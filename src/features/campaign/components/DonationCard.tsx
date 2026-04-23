import { useState } from "react";
import Image from "next/image";
import { Switch } from "@/src/components/ui/switch";
import { Button } from "@/src/components/ui/button";
import { useConnection, usePublicClient, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { toast } from "sonner";
import { CONTRACT_ABI } from "@/src/constants/contract";
import { useAppSelector } from "@/src/store/store";
import { selectUser } from "@/src/store/services/selectors/authSelectors";
import { useRouter } from "next/navigation";
import { Spinner } from "@/src/components/ui/spinner";
import { Globe2, Mail, Sparkle, SparkleIcon } from "lucide-react";

const ETH_TO_USD = 2450;

export default function DonationCard({ campaignId }: { campaignId: string }) {
  const [anonymous, setAnonymous] = useState(false);
  const [amount, setAmount] = useState("");

  const usd = amount
    ? (parseFloat(amount) * ETH_TO_USD).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "0.00";
  const filters = amount ? Math.round(parseFloat(amount) * 500) : 0;
  const individuals = amount
    ? Math.round(parseFloat(amount) * 2500).toLocaleString()
    : "0";

  // Smart contract interaction details
  const CONTRACT_ADDRESS = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
  const { isConnected } = useConnection();
  const {
    mutateAsync: writeContract,
    data: hash,
    isPending,
    error: writeError,
  } = useWriteContract();
  const client = usePublicClient();
  const [isConfirming, setIsConfirming] = useState(false);

  const user = useAppSelector(selectUser);
  const router = useRouter();

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
      value: parseEther(amount), // sends ETH along with the call
      gas: 100000n,
    });

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "donate",
      args: [campaignId, anonymous], // passes the anonymous bool
      value: parseEther(amount), // sends ETH along with the call
      gas: 100000n,
    })
      .then(async (res) => {
        setIsConfirming(true);
        const receipt = await client?.waitForTransactionReceipt({ hash: res });
        if (receipt?.status == "success") {
          toast.success(
            "Donation successful! Thank you for your generosity.🫶",
          );
          setAmount("");
        }
      })
      .catch((err) => {
        console.error("Donation failed:", err, writeError);
        toast.error("Donation failed. Please try again.");
      }).finally(() => setIsConfirming(false));
  }
  const isBusy = isPending || isConfirming;
  return (
    <div className="flex items-center justify-center p-4 xl:p-10">
      <div className="bg-white rounded-3xl shadow-xl p-7 w-full max-w-sm xl:max-w-md font-sans">
        <div className="flex items-center justify-between mb-6 xl:space-y-4">
          <h1 className="text-2xl w-full font-bold text-secondaryText tracking-tight">
            Make an Impact
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-primaryText">Donate Anonymously</span>
            <Switch
              checked={anonymous}
              onCheckedChange={setAnonymous}
              className="data-[state=checked]:bg-indigo-500"
            />
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
              <div className="flex items-center gap-1.5 px-4 text-secondaryText font-semibold text-sm shrink-0">
                <Image src="/etherium.svg" alt="ETH" width={20} height={20} />
                <span>ETH</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-5">
            <span className="text-sm text-primaryText">≈ ${usd} USD</span>
            <span className="text-xs font-semibold bg-secondary text-secondary-dark px-2.5 py-1 rounded-sm">
              Gas: $4.20
            </span>
          </div>

          <div className="bg-tertiary rounded-2xl p-4 mb-5">
            <div className="flex items-center gap-1.5 mb-2">
              <SparkleIcon />
              <span className="text-sm font-bold text-white">
                Impact Forecast
              </span>
            </div>
            <p className="text-white font-bold text-lg leading-snug mb-1">
              {amount && parseFloat(amount) > 0
                ? `${parseFloat(amount)} ETH = ${filters.toLocaleString()} clean water filters`
                : "1 ETH = 500 clean water filters"}
            </p>
            <p className="text-primary-light text-xs">
              {amount && parseFloat(amount) > 0
                ? `Providing safe water to ${individuals} individuals for 5 years.`
                : "Providing safe water to 2,500 individuals for 5 years."}
            </p>
          </div>

          <Button
            text="Confirm Donation"
            size={"lg"}
            className="h-15 w-full rounded-xl font-semibold text-lg"
          />

          <p className="mt-6 text-center text-xs text-primaryText leading-tight">
            By clicking confirm, you agree to our Terms of Service. Your
            transaction will be permanently recorded on the Ethereum Blockchain.
          </p>
        </div>
      </div>


      <div className="mt-auto pt-6">
        <div className="bg-gray-100 rounded-xl p-4">
          <h1 className="text-xs font-semibold text-gray-500 uppercase mb-4">
            Campaign Host
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Image
                src="/avatar.png"
                alt="host"
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 border-2 border-white rounded-full" />
            </div>

            <div>
              <div>
                <h2 className="font-semibold text-gray-800">
                  Global Water Initiative
                </h2>

                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Mail className="w-4 h-4" />
                  <span>contact@globalwater.org</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1 cursor-pointer hover:text-gray-700">
                  <Globe2 className="w-4 h-4" />
                  <span>Visit Website</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-5">
          <span className="text-sm text-primaryText">≈ ${usd} USD</span>
          <span className="text-xs font-semibold bg-secondary text-secondary-dark px-2.5 py-1 rounded-sm">
            Gas: $4.20
          </span>
        </div>

        <div className="bg-tertiary rounded-2xl p-4 mb-5">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkle color="#34d399" size={15}/>
            <span className="text-sm font-bold text-white">
              Impact Forecast
            </span>
          </div>
          <p className="text-white font-bold text-lg leading-snug mb-1">
            {amount && parseFloat(amount) > 0
              ? `${parseFloat(amount)} ETH = ${filters.toLocaleString()} clean water filters`
              : "1 ETH = 500 clean water filters"}
          </p>
          <p className="text-primary-light text-xs">
            {amount && parseFloat(amount) > 0
              ? `Providing safe water to ${individuals} individuals for 5 years.`
              : "Providing safe water to 2,500 individuals for 5 years."}
          </p>
        </div>
        {isBusy ? (
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
          By clicking confirm, you agree to our Terms of Service. Your
          transaction will be permanently recorded on the Ethereum Blockchain.
        </p>
      </div>

      
    </div>
  );
}
