"use client";
import { DataTable } from "@/src/components/ui/data-table";
import {
  claimableCampaignsColumns,
  claimHistoryColumns,
} from "@/src/features/withdraw/columns";
import { formatCryptoAmount } from "@/src/lib/utils";
import { useGetAllWithdrawalsQuery, useGetWithdrawableBalanceQuery } from "@/src/store/services/api/donationApi";
import Image from "next/image";

const WithdrawFunds = () => {
  const { data: claimHistory, error: claimHistoryError } =
    useGetAllWithdrawalsQuery({});
  const { data: balance, error: balanceFetchError } =
    useGetWithdrawableBalanceQuery({});


  const claimableCampaigns = claimHistory?.data?.balances
    ?.map((campaign: any) => ({
      campaignName: campaign.campaignTitle,
      // campaignId: campaign._id,
      balance: `${campaign.remainingBalance}` + " " + campaign.token,
      actions: campaign.cause,
      campaignId: campaign.campaignIdBytes32,
    }))
  /** TODO: After a withdrawal, check the response and add to table */
  const claimHistoryData = claimHistory?.data?.withdrawals?.map(
    (withdrawal: any) => ({
      campaignName: withdrawal?.campaignTitle,
      amount: withdrawal?.amount+" "+withdrawal?.campaignToken,
      date: withdrawal?.createdAt,
      txHash: withdrawal?.transactionHash,
    }),
  ) || [];
  return (
    <div className="px-4 space-y-7">
      <div className="grid grid-cols-4 gap-x-3">
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
          <h1 className="text-white font-extrabold line-clamp-1 text-3xl">{formatCryptoAmount(balance?.data.ETH,"ETH")}</h1>
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
          <h1 className="text-white font-extrabold text-3xl">{formatCryptoAmount(balance?.data.USDC,"USDC")}</h1>
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
          <h1 className="text-white font-extrabold text-3xl">{formatCryptoAmount(balance?.data.USDT,"USDT")}</h1>
        </div>
        <div className="flex flex-col bg-tertiary rounded-3xl text-ellipsis p-8">
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
          <h1 className="text-white font-extrabold text-3xl">{formatCryptoAmount(balance?.data.DAI,"DAI")}</h1>
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
