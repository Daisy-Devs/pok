import { useState } from "react";
import Image from "next/image";
import { Switch } from "@/src/components/ui/switch";
import { Button } from "@/src/components/ui/button";

const ETH_TO_USD = 2450;

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1L9.5 6.5L15 8L9.5 9.5L8 15L6.5 9.5L1 8L6.5 6.5L8 1Z" fill="#34d399" />
    </svg>
  );
}

export default function DonationCard() {
  const [anonymous, setAnonymous] = useState(false);
  const [amount, setAmount] = useState("");

  const usd = amount ? (parseFloat(amount) * ETH_TO_USD).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";
  const filters = amount ? Math.round(parseFloat(amount) * 500) : 0;
  const individuals = amount ? Math.round(parseFloat(amount) * 2500).toLocaleString() : "0";

  return (
    <div className="flex items-center justify-center p-4 xl:p-10">
      <div className="bg-white rounded-3xl shadow-xl p-7 w-full max-w-sm xl:max-w-md font-sans">
        <div className="flex items-center justify-between mb-6 xl:space-y-4">
          <h1 className="text-2xl w-full font-bold text-secondaryText tracking-tight">Make an Impact</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-primaryText">Donate Anonymously</span>
            <Switch
              checked={anonymous}
              onCheckedChange={setAnonymous}
              className="data-[state=checked]:bg-indigo-500"
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
            <span className="text-sm font-bold text-white">Impact Forecast</span>
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

        <Button text="Confirm Donation" size={"lg"} className="h-15 w-full rounded-xl font-semibold text-lg"/>

        <p className="mt-6 text-center text-xs text-primaryText leading-tight">
          By clicking confirm, you agree to our Terms of Service. Your transaction will be permanently recorded on the Ethereum Blockchain.
        </p>
      </div>
    </div>
  );
}
