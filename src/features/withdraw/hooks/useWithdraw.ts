import { CONTRACT_ABI } from "@/src/constants/contract";
import { TOKENS, TokenSymbol } from "@/src/constants/tokens";
import { walletConfig } from "@/src/lib/walletConfig";
import { toast } from "sonner";
import { createPublicClient, http } from "viem";
import { useWriteContract } from "wagmi";

export function useWithdraw({
  campaignIdBytes32,
  amount,
  campaignToken,
}: {
  campaignIdBytes32: string;
  amount: bigint;
  campaignToken: TokenSymbol;
}) {
  const { mutateAsync: writeContractAsync } = useWriteContract();

  const DONATION_CONTRACT = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

  async function withdraw() {
    let txHash;
    try {
      if (campaignToken == "ETH") {
        txHash = await writeContractAsync({
          address: DONATION_CONTRACT,
          abi: CONTRACT_ABI,
          functionName: "withdrawETH",
          args: [campaignIdBytes32, amount],
          gas: 100000n,
        });
      } else {
        txHash = await writeContractAsync({
          address: DONATION_CONTRACT,
          abi: CONTRACT_ABI,
          functionName: "withdrawToken",
          args: [campaignIdBytes32, TOKENS[campaignToken].address!, amount],
          gas: 100000n,
        });
      }

      console.log(txHash);
      const client = createPublicClient({
        chain: walletConfig.chains[0],
        transport: http(
          `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
        ),
      });
      const receipt = await client.waitForTransactionReceipt({
        hash: txHash,
        confirmations: 2, // wait for 2 blocks to be safe
      });
      if (receipt.status === "reverted")
        throw new Error(`Transaction reverted: ${txHash}`);
      toast.success("Withdrawal successful!💜");
      return receipt;
    } catch (error) {
      console.error(error);
      toast.error("Withdrawal failed. Please try again.");
    }
  }

  return { withdraw };
}
