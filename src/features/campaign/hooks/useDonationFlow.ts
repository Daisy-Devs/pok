import { CONTRACT_ABI, swapRouterAbi } from "@/src/constants/contract";
import { TOKENS, TokenSymbol, UNISWAP_ROUTER } from "@/src/constants/tokens";
import { walletConfig } from "@/src/lib/walletConfig";
import { useState } from "react";
import { toast } from "sonner";
import { erc20Abi } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

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
  amountIn, // bigint — user token amount (from quote)
  amountOut, // bigint — campaign token amount (the goal amount)
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
  const [txHash, setHash] = useState<`0x${string}` | undefined>();

  const { mutateAsync: writeContractAsync } = useWriteContract();
  const { data: receipt } = useWaitForTransactionReceipt({ hash: txHash });
  const DONATION_CONTRACT = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
  async function execute() {
    try {
      // ── 1. Approve router if needed ──────────────────────────────
      if (needsSwap && needsRouterApproval && userToken !== "ETH") {
        setStep("approving_router");
        console.log("approve1",{
          address: TOKENS[userToken].address!,
          abi: erc20Abi,
          functionName: "approve",
          args: [UNISWAP_ROUTER, amountIn],
        });
        
        const hash = await writeContractAsync({
          address: TOKENS[userToken].address!,
          abi: erc20Abi,
          functionName: "approve",
          args: [UNISWAP_ROUTER, amountIn],
        });

        setHash(hash);
        await waitForTx(hash);
      }

      // ── 2. Swap ───────────────────────────────────────────────────
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

            console.log("swapping",{
              tokenIn,
              tokenOut,
              fee: 3000,
              recipient: userAddress,
              amountIn,
              amountOutMinimum: amountOut, // slippage = exact output expected
              sqrtPriceLimitX96: 0n,
            },);
            
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
              amountOutMinimum: amountOut, // slippage = exact output expected
              sqrtPriceLimitX96: 0n,
            },
          ],
          value: userToken === "ETH" ? amountIn : 0n,
        });
        setHash(hash);
        await waitForTx(hash);
      }

      // ── 3. Approve donation contract ─────────────────────────────
      if (needsDonationApproval && campaignToken !== "ETH") {
        setStep("approving_donation");
        console.log("approve2",{
          address: TOKENS[campaignToken].address!,
          abi: erc20Abi,
          functionName: "approve",
          args: [DONATION_CONTRACT, amountOut],
        });
        
        // after swap, the token sitting in wallet is campaignToken
        const tokenToApprove = TOKENS[campaignToken].address!;
        const hash = await writeContractAsync({
          address: tokenToApprove,
          abi: erc20Abi,
          functionName: "approve",
          args: [DONATION_CONTRACT, amountOut],
          gas: 100000n,
        });
        setHash(hash);
        await waitForTx(hash);
      }

      // ── 4. Donate ─────────────────────────────────────────────────
      setStep("donating");
      const donateToken =
        TOKENS[campaignToken].address ??
        "0x0000000000000000000000000000000000000000"; // zero address = ETH
      if(campaignToken === "ETH") {
      const hash = await writeContractAsync({
        address: DONATION_CONTRACT,
        abi: CONTRACT_ABI,
        functionName: "donate",
        args: [campaignId, anonymous],
        value: amountIn,
        gas: 100000n,
      });
      setHash(hash);
      await waitForTx(hash);
      setStep("done");
    }
    else{
      console.log("donateTokennn",{
        address: DONATION_CONTRACT,
        abi: CONTRACT_ABI,
        functionName: "donateToken",
        args: [campaignId,amountIn,donateToken, anonymous],
        gas: 100000n,
      });
      
      const hash= await writeContractAsync({
        address: DONATION_CONTRACT,
        abi: CONTRACT_ABI,
        functionName: "donateToken",
        args: [campaignId,amountIn,donateToken, anonymous],
        gas: 100000n,
      })
      console.log("donate token hash",hash);
      
    }

    } catch (e) {
      console.error(e);
      setStep("error");
      toast.error("Donation failed. Please try again.");
    }
  }

  return { step, execute };
}

async function waitForTx(hash: `0x${string}`) {
  const { waitForTransactionReceipt } = await import("viem/actions");
  console.log(waitForTransactionReceipt);
  
  // wagmi's useWaitForTransactionReceipt is hook-only
  // for async flows, use viem client directly:
  const { createPublicClient, http } = await import("viem");
  const client = createPublicClient({
    chain: walletConfig.chains[0],
    transport: http(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
    ),
  });
  const receipt = await client.waitForTransactionReceipt({ hash });
  if (receipt?.status == "success") {
    toast.success("Donation successful! Thank you for your generosity.🫶");
  }
  else {
  throw new Error("Transaction reverted");
}
}
