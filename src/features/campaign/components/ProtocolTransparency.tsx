"use client";
import { StatCard } from "@/src/components/StatCard";
import { nomenclature } from "@/src/constants/nomenclature";
import { useGetDonationsByCampaignQuery } from "@/src/store/services/api/donationApi";
import { HouseHeart, Scroll, ScrollText } from "lucide-react";
import React from "react";

const ProtocolTransparency = ({ campaignId }: { campaignId: string }) => {
  const {
    data: donations,
    isLoading,
    error,
  } = useGetDonationsByCampaignQuery(campaignId);
  if (isLoading) return <p>Loading donations...</p>;
  if (error) return <p>Failed to load donations</p>;
  return (
    <div className="flex flex-col gap-10 w-full">
      {/* 🧾 DONATIONS TABLE */}
      <div className="w-full mt-6">
        <h2 className="text-xl font-bold mb-4">Donors</h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Donor</th>
                <th className="p-3 text-left">Amount (ETH)</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Transaction</th>
              </tr>
            </thead>

            <tbody>
              {donations?.map((donation, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3">
                    {donation.organization || "Anonymous"}
                  </td>

                  <td className="p-3 font-semibold">{donation.amount} ETH</td>

                  <td className="p-3">
                    {new Date(donation.date).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    <a
                      href={donation.etherScanLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 📊 TRANSPARENCY SECTION */}
      <div className="flex flex-col gap-10 w-full">
        <h2 className="font-bold text-3xl self-center mb-6 px-6">
          {nomenclature.PROTOCOL_TRANSPARENCY}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-4">
          <StatCard
            value="Smart Contracts"
            label="Verified on Etherscan for complete fund autonomy."
            icon={
              <div className="p-3.5 flex items-center justify-center rounded-full bg-primary-light">
                <ScrollText className="w-4 h-4" color="#4648D4" />
              </div>
            }
          />

          <StatCard
            value="0% Platform Fee"
            label="100% of your crypto reaches the community directly."
            icon={
              <div className="p-3.5 flex items-center justify-center rounded-full bg-[#DAE2FD]">
                <HouseHeart className="w-4 h-4" color="#3F465C" />
              </div>
            }
          />

          <StatCard
            value="NFT Impact Receipt"
            label="Receive a dynamic NFT tracking your personal impact."
            icon={
              <div className="p-3.5 flex items-center justify-center rounded-full bg-primary-light">
                <Scroll className="w-4 h-4" color="#4648D4" />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ProtocolTransparency;
