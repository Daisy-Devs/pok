"use client";
import { DataTable } from "@/src/components/ui/data-table";
import {
  claimableCampaignsColumns,
  claimHistoryColumns,
} from "@/src/features/withdraw/columns";
import { formatCryptoAmount } from "@/src/lib/utils";
import { useGetCampaignByOrgQuery } from "@/src/store/services/api/campaignApi";
import { useGetAllWithdrawalsQuery } from "@/src/store/services/api/donationApi";
import Image from "next/image";

const WithdrawFunds = () => {
  // const claimHistoryData = [
  //   {
  //     payoutId: "1",
  //     amount: "42.95 ETH",
  //     campaignName: "Campaign 1",
  //     date: "2023-01-01",
  //     txHash:
  //       "0xf72da640dc2009798d9848fe5796f34188892abe6dfd0d31910730add57dfe3e",
  //   },
  //   {
  //     payoutId: "2",
  //     amount: "40.95 ETH",
  //     campaignName: "Campaign 2",
  //     date: "2023-01-01",
  //     txHash:
  //       "0xf72da640dc2009798d9848fe5796f34188892abe6dfd0d31910730add57dfe3e",
  //   },
  //   {
  //     payoutId: "3",
  //     amount: "22.95 ETH",
  //     campaignName: "Campaign 3",
  //     date: "2023-01-01",
  //     txHash:
  //       "0xf72da640dc2009798d9848fe5796f34188892abe6dfd0d31910730add57dfe3e",
  //   },
  // ];
  const { data, error } = useGetCampaignByOrgQuery({});

  const { data: claimHistory, error: claimHistoryError } =
    useGetAllWithdrawalsQuery({});
  console.log("cl", claimHistory);

  const claimableCampaigns = data?.data?.campaigns
    ?.map((campaign: any) => ({
      campaignName: campaign.title,
      // campaignId: campaign._id,
      balance: campaign.totalRaised + " " + campaign.goalToken,
      actions: campaign.cause,
      campaignId: campaign.campaignIdBytes32,
    }))
    .filter(
      (campaign: any) =>
        Number(
          formatCryptoAmount(
            Number(campaign.balance.split(" ")[0]),
            campaign.balance.split(" ")[1],
          ),
        ) > 0,
    );
  /** TODO: After a withdrawal, check the response and add to table */
  const claimHistoryData = claimHistory?.data?.withdrawals?.map(
    (withdrawal: any) => ({
      campaignName: withdrawal?.campaignTitle,
      amount: withdrawal?.amount,
      date: withdrawal?.createdAt,
      txHash: withdrawal?.transactionHash,
    }),
  ) || [];
  return (
    <div className="px-4 space-y-7">
      <div className="grid grid-cols-4 gap-x-5">
        <div className="flex flex-col bg-tertiary rounded-3xl p-8">
          <div className="flex gap-2 items-center">
            <div className="rounded-full flex justify-center items-center aspect-square h-6 bg-white">
              <Image
                src="/svg/etherium.svg"
                alt="etherium"
                width={48}
                height={48}
              />
            </div>
            <p className="text-secondary text-sm font-semibold">{"ETH"}</p>
          </div>
          <p className="text-white text-sm font-semibold uppercase mt-2">
            available
          </p>
          <h1 className="text-white font-extrabold text-3xl">{42.95}</h1>
        </div>
        <div className="flex flex-col bg-tertiary rounded-3xl p-8">
          <div className="flex gap-2 items-center">
            <div className="rounded-full flex justify-center items-center aspect-square h-6 bg-white">
              <Image src="/svg/usdc.svg" alt="usdc" width={48} height={48} />
            </div>
            <p className="text-secondary text-sm font-semibold">{"USDC"}</p>
          </div>
          <p className="text-white text-sm font-semibold uppercase mt-2">
            available
          </p>
          <h1 className="text-white font-extrabold text-3xl">{42.95}</h1>
        </div>
        <div className="flex flex-col bg-tertiary rounded-3xl p-8">
          <div className="flex gap-2 items-center">
            <div className="rounded-full flex justify-center items-center aspect-square h-6 bg-white">
              <Image
                src="/svg/usdt.svg"
                preload
                alt="usdt"
                width={48}
                height={48}
              />
            </div>
            <p className="text-secondary text-sm font-semibold">{"USDT"}</p>
          </div>
          <p className="text-white text-sm font-semibold uppercase mt-2">
            available
          </p>
          <h1 className="text-white font-extrabold text-3xl">{42.95}</h1>
        </div>
        <div className="flex flex-col bg-tertiary rounded-3xl p-8">
          <div className="flex gap-2 items-center">
            <div className="rounded-full flex justify-center items-center aspect-square h-6 bg-white">
              <Image
                src="/svg/dai.svg"
                preload
                alt="dai"
                width={48}
                height={48}
              />
            </div>
            <p className="text-secondary text-sm font-semibold">{"DAI"}</p>
          </div>
          <p className="text-white text-sm font-semibold uppercase mt-2">
            available
          </p>
          <h1 className="text-white font-extrabold text-3xl">{42.95}</h1>
        </div>
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
