import { CONTRACT_ABI, swapRouterAbi } from "@/src/constants/contract";
import { TOKENS, TokenSymbol, UNISWAP_ROUTER } from "@/src/constants/tokens";
import { walletConfig } from "@/src/lib/walletConfig";
import { useState } from "react";
import {
  createPublicClient,
  decodeEventLog,
  erc20Abi,
  http,
  maxUint256,
} from "viem";
import { useWriteContract } from "wagmi";

type Step =
  | "idle"
  | "approving_router"
  | "swapping"
  | "approving_donation"
  | "donating"
  | "done"
  | "error";

export function useDonationFlow({
  userAddress,
  userToken,
  campaignToken,
  campaignId,
  amountIn,
  amountOut,
  needsSwap,
  needsRouterApproval = true,
  needsDonationApproval = true,
  anonymous = false,
}: {
  userAddress: `0x${string}`;
  userToken: TokenSymbol;
  campaignToken: TokenSymbol;
  campaignId: string;
  amountIn: bigint;
  amountOut: bigint;
  needsSwap: boolean;
  needsRouterApproval?: boolean;
  needsDonationApproval?: boolean;
  anonymous: boolean;
}) {
  const [step, setStep] = useState<Step>("idle");
  const { mutateAsync: writeContractAsync } = useWriteContract();

  const DONATION_CONTRACT = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

  async function execute() {
    try {
      // ─────────────────────────────────────────────
      // ✅ SINGLE SOURCE OF TRUTH: donateAmount
      // ─────────────────────────────────────────────
      const donateAmount = needsSwap ? amountOut : amountIn;
      let actualDonateAmount = donateAmount;

      if (!donateAmount || donateAmount === 0n) {
        throw new Error("Donation amount is zero");
      }

      // When swapping to ETH, router keeps WETH internally
      // we send recipient=router then call unwrapWETH9 to get native ETH
      const isWethDonation = needsSwap && campaignToken === "ETH";

      // Create public client once for all reads
      const publicClient = createPublicClient({
        chain: walletConfig.chains[0],
        transport: http(
          `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
        ),
      });

      // ─────────────────────────────────────────────
      // 1. APPROVE ROUTER
      // ─────────────────────────────────────────────
      if (needsSwap && needsRouterApproval && userToken !== "ETH") {
        setStep("approving_router");

        const tokenInAddress = TOKENS[userToken].address;
        if (!tokenInAddress) throw new Error("Invalid user token address");

        const hash = await writeContractAsync({
          address: tokenInAddress,
          abi: erc20Abi,
          functionName: "approve",
          args: [UNISWAP_ROUTER, amountIn],
        });

        await waitForTx(hash);
      }

      // ─────────────────────────────────────────────
      // 2. SWAP
      // ─────────────────────────────────────────────
      // Add before swap to verify pool has liquidity
      const usdcBalance = await publicClient.readContract({
        address: TOKENS.USDC.address!,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [userAddress],
      });
      console.log("🔍 SWAP PARAMS:", {
        tokenIn:
          userToken === "ETH"
            ? TOKENS.ETH.wrappedAddress
            : TOKENS[userToken].address,
        tokenOut:
          campaignToken === "ETH"
            ? TOKENS.ETH.wrappedAddress
            : TOKENS[campaignToken].address,
        amountIn: amountIn.toString(),
        amountOut: amountOut.toString(),
        userUSDCBalance: usdcBalance,
      });

      console.log("💰 USDC Balance:", usdcBalance.toString());
      if (needsSwap) {
        setStep("swapping");

        const tokenIn =
          userToken === "ETH"
            ? TOKENS.ETH.wrappedAddress
            : TOKENS[userToken].address!;

        const tokenOut =
          campaignToken === "ETH"
            ? TOKENS.ETH.wrappedAddress
            : TOKENS[campaignToken].address!;

        // For WETH output, recipient = router so we can unwrapWETH9 after
        // For ERC20 output, recipient = user directly
        const swapRecipient = isWethDonation ? UNISWAP_ROUTER : userAddress;

        const hash = await writeContractAsync({
          address: UNISWAP_ROUTER,
          abi: swapRouterAbi,
          functionName: "exactInputSingle",
          args: [
            {
              tokenIn,
              tokenOut,
              fee: 3000,
              recipient: swapRecipient,
              amountIn,
              amountOutMinimum: (amountOut * 95n) / 100n,
              sqrtPriceLimitX96: 0n,
            },
          ],
          value: userToken === "ETH" ? amountIn : 0n,
        });

        const receipt = await waitForTx(hash);

        // ── Parse actual received amount from receipt logs ──
        if (isWethDonation) {
          // Parse WETH Transfer to router to get actual swap output
          const wethAddress = TOKENS.ETH.wrappedAddress!.toLowerCase();

          for (const log of receipt.logs) {
            if (log.address.toLowerCase() !== wethAddress) continue;
            try {
              const decoded = decodeEventLog({
                abi: erc20Abi,
                data: log.data,
                topics: log.topics,
              });
              if (
                decoded.eventName === "Transfer" &&
                decoded.args.to.toLowerCase() === UNISWAP_ROUTER.toLowerCase()
              ) {
                actualDonateAmount = decoded.args.value;
                console.log(
                  "✅ Actual WETH received from swap:",
                  actualDonateAmount,
                );
                break;
              }
            } catch {
              continue;
            }
          }

          if (actualDonateAmount === donateAmount) {
            console.warn(
              "⚠️ Could not parse WETH transfer, using 95% of quote",
            );
            actualDonateAmount = (donateAmount * 95n) / 100n;
          }

          // Unwrap WETH → native ETH, send directly to user
          const unwrapHash = await writeContractAsync({
            address: UNISWAP_ROUTER,
            abi: [
              {
                type: "function",
                name: "unwrapWETH9",
                inputs: [
                  { name: "amountMinimum", type: "uint256" },
                  { name: "recipient", type: "address" },
                ],
                outputs: [],
                stateMutability: "nonpayable",
              },
            ] as const,
            functionName: "unwrapWETH9",
            args: [actualDonateAmount, userAddress],
          });

          await waitForTx(unwrapHash);
          console.log("✅ WETH unwrapped to native ETH");
        } else {
          // ERC20 out — parse Transfer event to userAddress
          const tokenOutAddress = TOKENS[campaignToken].address!.toLowerCase();

          for (const log of receipt.logs) {
            if (log.address.toLowerCase() !== tokenOutAddress) continue;
            try {
              const decoded = decodeEventLog({
                abi: erc20Abi,
                data: log.data,
                topics: log.topics,
              });
              if (
                decoded.eventName === "Transfer" &&
                decoded.args.to.toLowerCase() === userAddress.toLowerCase()
              ) {
                actualDonateAmount = decoded.args.value;
                console.log(
                  "✅ Actual tokens received from swap:",
                  actualDonateAmount,
                );
                break;
              }
            } catch {
              continue;
            }
          }

          if (actualDonateAmount === donateAmount) {
            console.warn(
              "⚠️ Could not parse token transfer, using 95% of quote",
            );
            actualDonateAmount = (donateAmount * 95n) / 100n;
          }
        }
      }

      // ─────────────────────────────────────────────
      // 3. APPROVE DONATION CONTRACT
      // isWethDonation → now native ETH after unwrap → no approval needed
      // ─────────────────────────────────────────────
      if (needsDonationApproval && campaignToken !== "ETH") {
        setStep("approving_donation");

        const existingAllowance = await publicClient.readContract({
          address: TOKENS[campaignToken].address!,
          abi: erc20Abi,
          functionName: "allowance",
          args: [userAddress, DONATION_CONTRACT],
        });

        if (existingAllowance < actualDonateAmount) {
          const hash = await writeContractAsync({
            address: TOKENS[campaignToken].address!,
            abi: erc20Abi,
            functionName: "approve",
            args: [DONATION_CONTRACT, maxUint256],
          });
          await waitForTx(hash);
        } else {
          console.log("✅ Allowance already sufficient, skipping approval");
        }
      }

      // ─────────────────────────────────────────────
      // 4. DONATE
      // ─────────────────────────────────────────────
      setStep("donating");

      if (campaignToken === "ETH") {
        // Native ETH — direct donation or post-unwrap
        const hash = await writeContractAsync({
          address: DONATION_CONTRACT,
          abi: CONTRACT_ABI,
          functionName: "donate",
          args: [campaignId, anonymous],
          value: actualDonateAmount,
        });
        await waitForTx(hash);
      } else {
        // ERC20 donation
        const hash = await writeContractAsync({
          address: DONATION_CONTRACT,
          abi: CONTRACT_ABI,
          functionName: "donateToken",
          args: [
            campaignId,
            actualDonateAmount,
            TOKENS[campaignToken].address!,
            anonymous,
          ],
        });
        await waitForTx(hash);
      }

      setStep("done");
    } catch (e) {
      console.error(e);
      setStep("error");
      throw e;
    }
  }

  return { step, execute };
}

async function waitForTx(hash: `0x${string}`) {
  const { createPublicClient, http } = await import("viem");

  const client = createPublicClient({
    chain: walletConfig.chains[0],
    transport: http(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
    ),
  });

  return await client.waitForTransactionReceipt({ hash });
}
