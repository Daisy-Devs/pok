"use client"
import { DataTable } from "@/src/components/ui/data-table";
import { claimableCampaignsColumns, claimHistoryColumns } from "@/src/features/withdraw/columns";
import React from "react";

const WithdrawFunds = () => {
  const campaignData=[{
    campaignName:"Campaign 1",
    campaignId:"1",
    balance:"42.95 ETH",
    actions:"Environment"
  },
  {
    campaignName:"Campaign 2",
    campaignId:"2",
    balance:"40.95 ETH",
    actions:"Social Justice"
  },
  {
    campaignName:"Campaign 3",
    campaignId:"3",
    balance:"22.95 ETH",
    actions:"Disaster Relief"
  },
  {
    campaignName:"Campaign 4",
    campaignId:"4",
    balance:"12.95 ETH",
    actions:"Animal Welfare"
  },
  {
    campaignName:"Campaign 5",
    campaignId:"5",
    balance:"32.95 ETH",
    actions:"Disaster Relief"
  }
]
const claimHistoryData=[{
  payoutId:"1",
  amount:"42.95 ETH",
  campaignName:"Campaign 1",
  date:"2023-01-01",
  txHash:'0xf72da640dc2009798d9848fe5796f34188892abe6dfd0d31910730add57dfe3e'
},
{
  payoutId:"2",
  amount:"40.95 ETH",
  campaignName:"Campaign 2",
  date:"2023-01-01",
  txHash:'0xf72da640dc2009798d9848fe5796f34188892abe6dfd0d31910730add57dfe3e'
},
{
  payoutId:"3",
  amount:"22.95 ETH",
  campaignName:"Campaign 3",
  date:"2023-01-01",
  txHash:'0xf72da640dc2009798d9848fe5796f34188892abe6dfd0d31910730add57dfe3e'
},
]
  return(
  <div className="px-4 space-y-7">
    <div className="flex flex-col bg-tertiary rounded-3xl p-8">
        <p className="text-secondary-mute font-semibold">Total Available for Withdrawal</p>
        <h1 className="text-white font-extrabold text-4xl">{42.95+" ETH"}</h1>
    </div>
    <div className="space-y-6">
    <h3 className="text-xl font-extrabold">{'Claimable Campaigns'}</h3>
    <DataTable columns={claimableCampaignsColumns} data={campaignData} rowLimit={3}/>
    </div>
    <div className="space-y-6">
    <h3 className="text-xl font-extrabold">{'Claim History'}</h3>
    <DataTable columns={claimHistoryColumns} data={claimHistoryData} rowLimit={3}/>
    </div>
  </div>
  );
};

export default WithdrawFunds;
