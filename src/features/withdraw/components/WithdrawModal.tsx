"use client";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { CAUSE_CATEGORIES } from "@/src/constants/misc";
import { formatCryptoAmount, hideWalletAddress } from "@/src/lib/utils";
import { BadgeCheck, Coins } from "lucide-react";
import React, { FC } from "react";
import { useConnection } from "wagmi";
import { useWithdraw } from "../hooks/useWithdraw";
import { TOKENS, TokenSymbol } from "@/src/constants/tokens";
import { parseUnits } from "viem";

type WithdrawModalProps = {
  campaignId: string;
  campaignName: string;
  balance: string;
  category: string;
};
const WithdrawModal: FC<WithdrawModalProps> = ({
  campaignId,
  campaignName,
  balance,
  category,
}) => {
  const Icon = CAUSE_CATEGORIES.find(
    (currentCategory) => currentCategory.name === category,
  )!.icon;
  const [amount, setAmount] = React.useState<string>();
  const token=balance.split(' ')[1] as TokenSymbol
  const balanceAmount =Number(balance.split(" ")[0]);
  const{address}=useConnection();
  const donationAmount =
      amount && !isNaN(Number(amount)) && Number(amount) > 0
        ? parseUnits(amount, TOKENS[token].decimals)
        : 0n;
  const {withdraw}=useWithdraw({ campaignIdBytes32: campaignId,amount:donationAmount,campaignToken: token as TokenSymbol });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Withdraw</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-extrabold text-secondaryText text-2xl">
            Withdraw Funds
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2 p-5 rounded-2xl bg-background-secondary">
          <div className="grid flex-1 gap-2">
            <div className="flex justify-between">
              <div className="flex gap-4 items-center">
                <div className="aspect-square flex justify-center items-center bg-primary-light w-14 rounded-xl">
                  <Icon className="text-primary" size={30} />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-secondaryText">
                    {campaignName}
                  </span>
                  <span className="text-sm">ID: {hideWalletAddress(campaignId)}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-xs uppercase">Current balance</span>
                <span className="text-xl font-extrabold text-primary">
                  {formatCryptoAmount(balanceAmount,token)} {token}
                </span>
              </div>
            </div>
          </div>
        </div>
        <span className="text-sm text-secondaryText font-semibold">
          Enter Amount to Withdraw
        </span>
          <div className="relative flex items-center bg-input rounded-xl overflow-hidden">
            <input
              type="number"
              min="0"
              max={balanceAmount}
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-input text-primaryText text-xl font-medium px-4 py-3.5 outline-none placeholder-gray-300 w-0"
            />
            {/* <Select value={token} onValueChange={setToken}>
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
            </Select> */}
            <div className="font-extrabold p-4 text-primary">{token}</div>
          </div>
          <span className="text-xs text-primary font-semibold">
          Maximum Withdrawal: {formatCryptoAmount(balanceAmount,token)} {token}
        </span>
        <div className="border border-border flex p-3 gap-3 rounded-lg">
          <BadgeCheck className="w-5 h-5 text-primary" />
          <span className="text-sm text-secondaryText font-semibold items-center justify-center">
            Funds will be transferred to your verified institutional wallet:<span className="font-extrabold">{hideWalletAddress(address)}</span>
          </span>
        </div>
        <div className="w-full flex flex-col gap-2">
        <Button onClick={()=>{withdraw()}} size={'lg'} className="w-full font-extrabold rounded-lg" text="Confirm Withdrawal"/>
        <DialogClose asChild>
            <Button variant={'ghost'} type="button" className="w-full" text="Cancel"/>
          </DialogClose>
          </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawModal;
