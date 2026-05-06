import { CONTRACT_ABI } from "@/src/constants/contract";
import { TOKENS, TokenSymbol } from "@/src/constants/tokens";
import { toast } from "sonner";
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
    try {
      if (campaignToken == "ETH") {
        await writeContractAsync({
          address: DONATION_CONTRACT,
          abi: CONTRACT_ABI,
          functionName: "withdrawETH",
          args: [campaignIdBytes32, amount],
          gas: 100000n,
        });
      } else {
        await writeContractAsync({
          address: DONATION_CONTRACT,
          abi: CONTRACT_ABI,
          functionName: "withdrawToken",
          args: [campaignIdBytes32, TOKENS[campaignToken].address!, amount],
          gas: 100000n,
        });
      }
      toast.success("Withdrawal successful!💜");
    } catch (error) {
      console.error(error);
      toast.error("Withdrawal failed. Please try again.");
    }
  }

  return { withdraw };
}
