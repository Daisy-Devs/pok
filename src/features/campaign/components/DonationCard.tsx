import { useState } from "react";
import Image from "next/image";
import { Switch } from "@/src/components/ui/switch";
import { Button } from "@/src/components/ui/button";
import { useConnection, usePublicClient, useWriteContract } from "wagmi";
import { formatUnits, parseEther, parseUnits } from "viem";
import { toast } from "sonner";
import { CONTRACT_ABI } from "@/src/constants/contract";
import { useAppSelector } from "@/src/store/store";
import { selectUser } from "@/src/store/services/selectors/authSelectors";
import { useRouter } from "next/navigation";
import { Spinner } from "@/src/components/ui/spinner";
import { TOKENS, TokenSymbol } from "@/src/constants/tokens";
import { useDonationFlow } from "../hooks/useDonationFlow";
import { useSwapQuote } from "../hooks/useSwapQuote";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Coins, Cuboid, Dot, Globe, GlobeOff } from "lucide-react";
import { hideWalletAddress } from "@/src/lib/utils";

export default function DonationCard({
  campaignId,
  campaignToken,
}: {
  campaignId: string;
  campaignToken: TokenSymbol;
}) {
  const [anonymous, setAnonymous] = useState(false);
  const [amount, setAmount] = useState("");
  const [userToken, setUserToken] = useState<TokenSymbol>("ETH");
  const donationAmount =
    amount && !isNaN(Number(amount)) && Number(amount) > 0
      ? parseUnits(amount, TOKENS[userToken].decimals)
      : 0n;

  // Smart contract interaction details
  const CONTRACT_ADDRESS = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
  const { isConnected, address } = useConnection();
  // quote: if I send donationAmount of userToken, how much campaignToken comes out?
  const {
    amountOut,
    isLoading: quoteLoading,
    needsSwap,
  } = useSwapQuote({
    userToken,
    campaignToken,
    donationAmount,
  });

  const { step, execute } = useDonationFlow({
    userAddress: address,
    userToken,
    campaignToken,
    campaignId,
    amountIn: donationAmount, // what user spends
    amountOut: amountOut ?? 0n, // what contract receives
    needsSwap,
    anonymous,
  });
  const isProcessing = !["idle", "done", "error"].includes(step);
  const user = useAppSelector(selectUser);
  const router = useRouter();
  const displayAmount = amountOut
    ? formatUnits(amountOut, TOKENS[campaignToken].decimals)
    : "—";

  async function handleDonate() {
    if (user?.role !== "Donor") {
      toast.info("Sign in to start donating.");
      router.push("/sign-in");
      return;
    }
    if (!isConnected) {
      toast.warning("Please connect your wallet to donate.");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) return;
    console.log("Inside handleDonate", {
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "donate",
      args: [campaignId, anonymous], // passes the anonymous bool
      value: amount, // sends ETH along with the call
      gas: 100000n,
    });
    execute().then(() => {
      setAmount("");
      toast.success("Donation successful! Thank you for your generosity.🫶");
    }).catch((e) => {
      console.error(e);
      toast.error("Donation failed. Please try again.");
    });
  }
  return (
    <div className="flex items-center justify-center p-4 xl:p-10">
      <div className="bg-white rounded-3xl shadow-xl p-7 w-full max-w-sm xl:max-w-md font-sans">
        <div className="flex items-center justify-between mb-6 xl:space-y-4">
          <h1 className="text-2xl w-full font-bold text-secondaryText tracking-tight">
            Make an Impact
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-primaryText">Anonymously</span>
            <Switch
              checked={anonymous}
              onCheckedChange={setAnonymous}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        <div className="mb-2">
          <label className="block text-sm font-semibold text-primaryText mb-2">
            Donation Amount
          </label>
          <div className="relative flex items-center bg-input rounded-xl overflow-hidden">
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-input text-primaryText text-xl font-medium px-4 py-3.5 outline-none placeholder-gray-300 w-0"
            />
            <Select value={userToken} onValueChange={setUserToken}>
              <SelectTrigger
                size="sm"
                className="w-27 p-2 mr-2 h-2 bg-background-secondary font-semibold text-primary"
              >
                <Coins className="pointer-events-none size-4 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["ETH", "USDC", "USDT", "DAI"].map((token) => (
                  <SelectItem key={token} value={token}>
                    {token}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between mb-5">
          <span className="text-sm text-primaryText">
            {amountOut && donationAmount > 0n
              ? `≈ ${displayAmount} ${campaignToken}`
              : "—"}
          </span>
          <div className="flex flex-row items-center">
            <span className="text-sm text-primaryText">LIVE MARKET PRICE</span>
            <Dot
              size={30}
              strokeWidth={4.75}
              className="animate-caret-blink text-green-500 h-9"
            />
          </div>
        </div>

        {isProcessing ? (
          <Button
            disabled
            text="Making an impact🔗..."
            size={"lg"}
            className="h-15 w-full rounded-xl font-semibold text-lg"
            leftIcon={<Spinner />}
          />
        ) : (
          <Button
            onClick={handleDonate}
            disabled={!amount || parseFloat(amount) <= 0}
            text="Confirm Donation"
            size={"lg"}
            className="h-15 w-full rounded-xl font-semibold text-lg"
          />
        )}
        <p className="mt-6 text-center text-xs text-primaryText leading-tight">
          By confirming, your donation will be instantly distributed to the NGO
          smart contract. Transaction fees apply.
        </p>
        <div className="h-px bg-muted my-3" />
        {isConnected ? (
          <div className="flex justify-center items-center gap-2 mx-4 self-center bg-input rounded-2xl p-3">
            <Globe size={25} className="text-secondary-dark" />
            <p className="text-xs text-secondaryText font-semibold">
              WALLET CONNECTED : {hideWalletAddress(address!)}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 mx-4 self-center bg-input rounded-2xl p-3">
            <GlobeOff size={25} className="text-destructive" />
            <p className="text-xs text-secondaryText font-semibold">
              WALLET NOT CONNECTED
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
