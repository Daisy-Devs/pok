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
      // ✅ SINGLE SOURCE OF TRUTH
      // ─────────────────────────────────────────────
      const donateAmount = needsSwap ? amountOut : amountIn;
      let actualDonateAmount = donateAmount;

      if (!donateAmount || donateAmount === 0n) {
        throw new Error("Donation amount is zero");
      }

      const publicClient = createPublicClient({
        chain: walletConfig.chains[0],
        transport: http(
          `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
        ),
      });

      // ─────────────────────────────────────────────
      // 1. APPROVE ROUTER (for normal swaps)
      // ─────────────────────────────────────────────
      // 1. APPROVE ROUTER (skip for CASE 1)
      if (needsSwap && needsRouterApproval && userToken !== "ETH") {
        // ✅ Skip if campaign is ETH — contract handles swap internally
        if (campaignToken !== "ETH") {
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
      }

      // ─────────────────────────────────────────────
      // 2. SWAP
      // ─────────────────────────────────────────────
      if (needsSwap) {
        // 🔥 CASE 1: USDC (or any ERC20) → ETH (OPTIMIZED)
        if (campaignToken === "ETH" && userToken !== "ETH") {
          setStep("approving_donation");

          const tokenInAddress = TOKENS[userToken].address!;

          // Approve donation contract
          const existingAllowance = await publicClient.readContract({
            address: tokenInAddress,
            abi: erc20Abi,
            functionName: "allowance",
            args: [userAddress, DONATION_CONTRACT],
          });

          if (existingAllowance < amountIn) {
            const approveHash = await writeContractAsync({
              address: tokenInAddress,
              abi: erc20Abi,
              functionName: "approve",
              args: [DONATION_CONTRACT, maxUint256],
            });

            await waitForTx(approveHash);
          }

          // Call swapAndDonate (1 tx)
          setStep("swapping");

          const hash = await writeContractAsync({
            address: DONATION_CONTRACT,
            abi: CONTRACT_ABI,
            functionName: "swapAndDonate",
            args: [
              campaignId,
              tokenInAddress,
              amountIn,
              (amountOut * 85n) / 100n,
              anonymous,
            ],
            gas: 500000n, // 🔥 ADD THIS
          });

          await waitForTx(hash);

          setStep("done");
          return; // ✅ STOP (important)
        }

        // 🟡 CASE 2: ALL OTHER SWAPS (UNCHANGED LOGIC)
        setStep("swapping");

        const tokenIn =
          userToken === "ETH"
            ? TOKENS.ETH.wrappedAddress
            : TOKENS[userToken].address!;

        const tokenOut =
          campaignToken === "ETH"
            ? TOKENS.ETH.wrappedAddress
            : TOKENS[campaignToken].address!;

        const hash = await writeContractAsync({
          address: UNISWAP_ROUTER,
          abi: swapRouterAbi,
          functionName: "exactInputSingle",
          args: [
            {
              tokenIn,
              tokenOut,
              fee: 3000,
              recipient: userAddress,
              amountIn,
              amountOutMinimum: (amountOut * 95n) / 100n,
              sqrtPriceLimitX96: 0n,
            },
          ],
          value: userToken === "ETH" ? amountIn : 0n,
        });

        const receipt = await waitForTx(hash);

        // 🔍 Parse actual received tokens
        const tokenOutAddress =
          campaignToken === "ETH"
            ? TOKENS.ETH.wrappedAddress!.toLowerCase()
            : TOKENS[campaignToken].address!.toLowerCase();

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
              break;
            }
          } catch {
            continue;
          }
        }

        if (actualDonateAmount === donateAmount) {
          actualDonateAmount = (donateAmount * 95n) / 100n;
        }
      }

      // ─────────────────────────────────────────────
      // 3. APPROVE DONATION CONTRACT (ERC20)
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
            args: [DONATION_CONTRACT, amountIn],
          });
          await waitForTx(hash);
        }
      }

      // ─────────────────────────────────────────────
      // 4. DONATE
      // ─────────────────────────────────────────────
      setStep("donating");

      if (campaignToken === "ETH") {
        const hash = await writeContractAsync({
          address: DONATION_CONTRACT,
          abi: CONTRACT_ABI,
          functionName: "donate",
          args: [campaignId, anonymous],
          value: actualDonateAmount,
        });
        await waitForTx(hash);
      } else {
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

  const receipt = await client.waitForTransactionReceipt({ hash });
  
  if (receipt.status === "reverted") {
    throw new Error(`Transaction reverted: ${hash}`);
  }
  
  return receipt;
}
