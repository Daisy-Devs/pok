"use client";
import { DataTable } from "@/src/components/ui/data-table";
import {
  claimableCampaignsColumns,
  claimHistoryColumns,
} from "@/src/features/withdraw/columns";
import { formatCryptoAmount } from "@/src/lib/utils";
import { useGetCampaignByOrgQuery } from "@/src/store/services/api/campaignApi";
import { useGetAllWithdrawalsQuery } from "@/src/store/services/api/donationApi";

const WithdrawFunds = () => {

  const claimHistoryData = [
    {
      payoutId: "1",
      amount: "42.95 ETH",
      campaignName: "Campaign 1",
      date: "2023-01-01",
      txHash:
        "0xf72da640dc2009798d9848fe5796f34188892abe6dfd0d31910730add57dfe3e",
    },
    {
      payoutId: "2",
      amount: "40.95 ETH",
      campaignName: "Campaign 2",
      date: "2023-01-01",
      txHash:
        "0xf72da640dc2009798d9848fe5796f34188892abe6dfd0d31910730add57dfe3e",
    },
    {
      payoutId: "3",
      amount: "22.95 ETH",
      campaignName: "Campaign 3",
      date: "2023-01-01",
      txHash:
        "0xf72da640dc2009798d9848fe5796f34188892abe6dfd0d31910730add57dfe3e",
    },
  ];
  const { data, error } = useGetCampaignByOrgQuery({});  
  console.log("response",data);
  
  const { data: claimHistory, error: claimHistoryError } = useGetAllWithdrawalsQuery({});
  const claimableCampaigns = data?.data?.campaigns?.map((campaign: any) => ({
    campaignName: campaign.title,
    // campaignId: campaign._id,
    balance: campaign.totalRaised +" "+ campaign.goalToken,
    actions: campaign.cause,
    campaignId: campaign.campaignIdBytes32
  })).filter((campaign: any) =>Number(formatCryptoAmount(Number(campaign.balance.split(" ")[0]),campaign.balance.split(" ")[1])) > 0);
  /** TODO: After a withdrawal, check the response and add to table */
  // const claimHistoryData = claimHistory?.data?.withdrawals?.map((withdrawal: any) => ({
  //   payoutId: "",
  //     amount: withdrawal.amount,
  //     campaignName: "",
  //     date: "",
  //     txHash:withdrawal.transactionHash
  // }))
  return (
    <div className="px-4 space-y-7">
      <div className="flex flex-col bg-tertiary rounded-3xl p-8">
        <p className="text-secondary-mute font-semibold">
          Total Available for Withdrawal
        </p>
        <h1 className="text-white font-extrabold text-4xl">{42.95 + " ETH"}</h1>
      </div>
      <div className="space-y-6">
        <h3 className="text-xl font-extrabold">{"Claimable Campaigns"}</h3>
        <DataTable
          columns={claimableCampaignsColumns}
          data={claimableCampaigns || []}
          rowLimit={3}
          emptyMessage={"No claimable campaigns"}
        />
      </div>
      <div className="space-y-6">
        <h3 className="text-xl font-extrabold">{"Claim History"}</h3>
        <DataTable
          columns={claimHistoryColumns}
          data={claimHistoryData}
          rowLimit={3}
          emptyMessage={"No claim history"}
        />
      </div>
    </div>
  );
};

export default WithdrawFunds;
