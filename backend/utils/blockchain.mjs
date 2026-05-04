import { ethers } from "ethers";

const provider = new ethers.WebSocketProvider(
  `wss://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
);

// 🧪 TEST CONNECTION (temporary)
provider.getBlockNumber().then(block => {
  console.log("📦 Connected to blockchain. Block:", block);
}).catch(err => {
  console.error("❌ Blockchain connection failed:", err);
});

export default provider;


// import { CONTRACT_ABI, swapRouterAbi } from "@/src/constants/contract";
// import { TOKENS, TokenSymbol, UNISWAP_ROUTER } from "@/src/constants/tokens";
// import { walletConfig } from "@/src/lib/walletConfig";
// import { useState } from "react";
// import { toast } from "sonner";
// import { erc20Abi } from "viem";
// import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
// import { readContract } from "wagmi/actions";

// type Step =
//   | "idle"
//   | "approving_router"
//   | "swapping"
//   | "approving_donation"
//   | "donating"
//   | "done"
//   | "error";

// export function useDonationFlow({
//   userAddress,
//   userToken,
//   campaignToken,
//   campaignId,
//   amountIn,
//   amountOut,
//   needsSwap,
//   needsRouterApproval = true,
//   needsDonationApproval = true,
//   anonymous = false,
// }: {
//   userAddress: `0x${string}`;
//   userToken: TokenSymbol;
//   campaignToken: TokenSymbol;
//   campaignId: string;
//   amountIn: bigint;
//   amountOut: bigint;
//   needsSwap: boolean;
//   needsRouterApproval?: boolean;
//   needsDonationApproval?: boolean;
//   anonymous: boolean;
// }) {
//   const [step, setStep] = useState<Step>("idle");
//   const [txHash, setHash] = useState<`0x${string}` | undefined>();

//   const { mutateAsync: writeContractAsync } = useWriteContract();
//   const { data: receipt } = useWaitForTransactionReceipt({ hash: txHash });

//   const DONATION_CONTRACT = process.env
//     .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

//   async function execute() {
//     try {
//       // ─────────────────────────────────────────────
//       // ✅ SINGLE SOURCE OF TRUTH: donateAmount
//       // ─────────────────────────────────────────────
//       let donateAmount = amountIn;

//       // ─────────────────────────────────────────────
//       // ✅ SAFE BALANCE FETCH (ONLY IF NEEDED)
//       // ─────────────────────────────────────────────
//       if (needsSwap) {
//         const tokenAddress = TOKENS[campaignToken]?.address;

//         console.log("🔍 DEBUG TOKEN:", {
//           campaignToken,
//           tokenAddress,
//           userAddress,
//         });

//         // ❌ ETH is NOT ERC20 → skip balanceOf
//         if (campaignToken !== "ETH") {
//           if (!tokenAddress || tokenAddress === "0x0000000000000000000000000000000000000000") {
//             throw new Error(`Invalid token address for ${campaignToken}`);
//           }

//           try {
//             const actualBalance = await readContract(walletConfig, {
//               address: tokenAddress,
//               abi: erc20Abi,
//               functionName: "balanceOf",
//               args: [userAddress],
//             });

//             console.log("🔥 actualBalance:", actualBalance);

//             donateAmount = actualBalance;
//           } catch (err) {
//             console.error("❌ balanceOf failed:", err);
//             throw err;
//           }
//         }
//       }

//       // ─────────────────────────────────────────────
//       // ❌ SAFETY CHECK
//       // ─────────────────────────────────────────────
//       if (!donateAmount || donateAmount === 0n) {
//         throw new Error("Donation amount is zero");
//       }

//       // ─────────────────────────────────────────────
//       // 1. APPROVE ROUTER
//       // ─────────────────────────────────────────────
//       if (needsSwap && needsRouterApproval && userToken !== "ETH") {
//         setStep("approving_router");

//         const tokenInAddress = TOKENS[userToken].address;

//         if (!tokenInAddress) {
//           throw new Error("Invalid user token address");
//         }

//         const hash = await writeContractAsync({
//           address: tokenInAddress,
//           abi: erc20Abi,
//           functionName: "approve",
//           args: [UNISWAP_ROUTER, amountIn],
//         });

//         setHash(hash);
//         await waitForTx(hash);
//       }

//       // ─────────────────────────────────────────────
//       // 2. SWAP
//       // ─────────────────────────────────────────────
//       if (needsSwap) {
//         setStep("swapping");

//         const tokenIn =
//           userToken === "ETH"
//             ? TOKENS.ETH.wrappedAddress
//             : TOKENS[userToken].address!;

//         const tokenOut =
//           campaignToken === "ETH"
//             ? TOKENS.ETH.wrappedAddress
//             : TOKENS[campaignToken].address!;

//         const hash = await writeContractAsync({
//           address: UNISWAP_ROUTER,
//           abi: swapRouterAbi,
//           functionName: "exactInputSingle",
//           args: [
//             {
//               tokenIn,
//               tokenOut,
//               fee: 3000,
//               recipient: userAddress,
//               amountIn,
//               amountOutMinimum: amountOut * 95n / 100n,
//               sqrtPriceLimitX96: 0n,
//             },
//           ],
//           value: userToken === "ETH" ? amountIn : 0n,
//         });

//         setHash(hash);
//         await waitForTx(hash);
//       }

//       // ── 3. Approve donation contract ───────────────────
//       if (needsDonationApproval && campaignToken !== "ETH") {
//         setStep("approving_donation");

//         const hash = await writeContractAsync({
//           address: TOKENS[campaignToken].address!,
//           abi: erc20Abi,
//           functionName: "approve",
//           args: [DONATION_CONTRACT, donateAmount],
//         });

//         setHash(hash);
//         await waitForTx(hash);
//       }

//       // ── 4. Donate ─────────────────────────────────────
//       setStep("donating");

//       const donateToken =
//         campaignToken === "ETH"
//           ? "0x0000000000000000000000000000000000000000"
//           : TOKENS[campaignToken].address!;

//       if (campaignToken === "ETH") {
//         const hash = await writeContractAsync({
//           address: DONATION_CONTRACT,
//           abi: CONTRACT_ABI,
//           functionName: "donate",
//           args: [campaignId, anonymous],
//           value: amountIn,
//         });

//         setHash(hash);
//         await waitForTx(hash);
//         setStep("done");
//       } else {
//         const hash = await writeContractAsync({
//           address: DONATION_CONTRACT,
//           abi: CONTRACT_ABI,
//           functionName: "donateToken",
//           args: [campaignId, donateAmount, donateToken, anonymous],
//         });

//         setHash(hash);
//         await waitForTx(hash);
//         setStep("done");
//       }
//     } catch (e) {
//       console.error(e);
//       setStep("error");
//       toast.error("Donation failed. Please try again.");
//     }
//   }

//   return { step, execute };
// }

// async function waitForTx(hash: `0x${string}`) {
//   const { createPublicClient, http } = await import("viem");

//   const client = createPublicClient({
//     chain: walletConfig.chains[0],
//     transport: http(
//       `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`
//     ),
//   });

//   const receipt = await client.waitForTransactionReceipt({ hash });

//   if (receipt?.status === "success") {
//     toast.success("Donation successful! Thank you 🫶");
//   } else {
//     throw new Error("Transaction reverted");
//   }
// }