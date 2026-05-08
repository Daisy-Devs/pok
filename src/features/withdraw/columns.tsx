"use client"
import { ColumnDef } from "@tanstack/react-table"
import WithdrawModal from "./components/WithdrawModal";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { formatCryptoAmount, hideWalletAddress } from "@/src/lib/utils";
export type ClaimableCampaigns={
    campaignName: string,
    campaignId: string,
    balance: string,
    actions: string
}
export const claimableCampaignsColumns: ColumnDef<ClaimableCampaigns>[] = [
  {
    accessorKey: "campaignName",
    header: "Campaign Name",
  },
  {
    accessorKey: "campaignId",
    header: "Campaign ID",
    cell: ({row})=>(<div>{hideWalletAddress(row.original.campaignId as `0x${string}`)}</div>)
  },
  {
    accessorKey: "balance",
    header: "Current Balance",
    cell: ({row})=>(<div>{formatCryptoAmount(Number(row.original.balance.split(" ")[0]),row.original.balance.split(" ")[1])} {row.original.balance.split(" ")[1]}</div>)
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const campaignId = row.original.campaignId
      const campainName = row.original.campaignName
      const balance = row.original.balance
      const category = row.original.actions
      console.log("hafsgsg",row.original);
      
      return <WithdrawModal campaignId={campaignId} campaignName={campainName} balance={balance} category={category}/>
    },
  },
];
export type ClaimHistory={
    payoutId: string,
    amount: string,
    campaignName: string,
    date: string,
    txHash: string
}

export const claimHistoryColumns: ColumnDef<ClaimHistory>[] = [
  {
    accessorKey: "payoutId",
    header: "Payout ID",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "campaignName",
    header: "Campaign Name",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      return <Link href={`https://sepolia.etherscan.io/tx/${row.original.txHash}`} target="_blank" className="text-primary"><ChevronRight size={20} /></Link>
    },
  },
];