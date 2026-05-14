"use client";
import { ColumnDef } from "@tanstack/react-table";
import WithdrawModal from "./components/WithdrawModal";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { formatCryptoAmount, hideWalletAddress } from "@/src/lib/utils";
export type ClaimableCampaigns = {
  campaignName: string;
  campaignId: `0x${string}`;
  balance: string;
  actions: string;
};
export const claimableCampaignsColumns: ColumnDef<ClaimableCampaigns>[] = [
  {
    accessorKey: "campaignName",
    header: "Campaign Name",
  },
  {
    accessorKey: "campaignId",
    header: "Campaign ID",
    cell: ({ row }) => (
      <div>{hideWalletAddress(row.original.campaignId as `0x${string}`)}</div>
    ),
  },
  {
    accessorKey: "balance",
    header: "Current Balance",
    cell: ({ row }) => (
      <div>
        {formatCryptoAmount(
          Number(row.original.balance.split(" ")[0]),
          row.original.balance.split(" ")[1] as "ETH" | "USDC"|"DAI"|"USDT",
        )}{" "}
        {row.original.balance.split(" ")[1]}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const campaignId = row.original.campaignId;
      const campainName = row.original.campaignName;
      const balance = row.original.balance;
      const category = row.original.actions;
      const withdrawable = formatCryptoAmount(Number(row.original.balance.split(" ")[0]), row.original.balance.split(" ")[1] as "ETH" | "USDC"|"DAI"|"USDT");

      return (
        <WithdrawModal
          campaignId={campaignId}
          campaignName={campainName}
          balance={balance}
          category={category}
          disabled={Number(withdrawable) <= 0}
        />
      );
    },
  },
];
export type ClaimHistory = {
  amount: string;
  campaignName: string;
  date: string;
  txHash: string;
};

export const claimHistoryColumns: ColumnDef<ClaimHistory>[] = [
  {
    accessorKey: "campaignName",
    header: "Campaign Name",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell:({row})=>{ 
      const date = new Date(row.original.date);
          const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });

      const formattedTime = date
        .toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        .replace("AM", "am")
        .replace("PM", "pm");
    return<div>{formattedDate}, {formattedTime}</div>}
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      return (
        <Link
          href={`${process.env.NEXT_PUBLIC_ETHER_SCAN}${row.original.txHash}`}
          target="_blank"
          className="text-primary"
        >
          <ChevronRight size={20} />
        </Link>
      );
    },
  },
];
