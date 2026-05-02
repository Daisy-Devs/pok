import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../../components/ui/button"
import { createElement } from "react"
import { ExternalLink } from "lucide-react"
export type ClaimableCampaigns={
    campaignName: string,
    campaignId: string,
    balance: string,
    actions: (campaignId: string) => void
}
export const claimableCampaignsColumns: ColumnDef<ClaimableCampaigns>[] = [
  {
    accessorKey: "campaignName",
    header: "Campaign Name",
  },
  {
    accessorKey: "campaignId",
    header: "Campaign ID",
  },
  {
    accessorKey: "balance",
    header: "Current Balance",
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      return createElement(Button, { onClick: () => row.original.actions(row.original.campaignId) }, "Withdraw");
    },
  },
];
export type ClaimHistory={
    payoutId: string,
    amount: string,
    campaignName: string,
    date: string,
    actions: (campaignId: string) => void
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
      return createElement(ExternalLink, { onClick: () => {} });
    },
  },
];