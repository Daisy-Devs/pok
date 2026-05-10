"use client";
import React from "react";
import { UserType } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { ChevronRight, EyeOff, UserIcon } from "lucide-react";
import { timeAgo } from "@/src/lib/utils";
import { useGetDonationsByCampaignQuery } from "@/src/store/services/api/donationApi";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { TOKENS } from "@/src/constants/tokens";

const LiveDonationActivity = ({ campaignId }: { campaignId: string }) => {
  const { data, isLoading, error } = useGetDonationsByCampaignQuery(campaignId);
  const donations = data?.donations ?? [];
  console.log("fetched data",data);
  
  return (
    <div className="md:px-6">
      <h2 className="text-3xl font-extrabold text-secondaryText mb-8">
        Live Donation Activity
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-110">Donor</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations.length > 0 ? (
            donations.map((activity: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <User
                    name={activity.donorName}
                    isAnonymous={activity.donorName=="Anomymous"}
                  />
                </TableCell>
                <TableCell className="font-semibold text-secondaryText text-base">
                  {activity.amount} {Object.values(TOKENS).find((token) => token.address===activity.token)?.symbol}
                </TableCell>
                <TableCell suppressHydrationWarning>
                  {(() => {
                    const dateValue = activity.date || activity.createdAt;
                    if (!dateValue) return "Recently";

                    const parsedDate = new Date(dateValue);
                    return isNaN(parsedDate.getTime())
                      ? "Recently"
                      : timeAgo(parsedDate.toISOString());
                  })()}
                </TableCell>
                <TableCell>
                  <a
                    href={`${process.env.NEXT_PUBLIC_ETHER_SCAN}${activity.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ChevronRight size={12} />
                  </a>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-60">
                <div className="flex flex-col items-center justify-center">
                  <DotLottieReact
                    src="/gif/Empty.lottie"
                    loop
                    autoplay
                    style={{ width: 200, height: 200 }}
                  />
                  <p className="text-sm text-gray-500 mt-2">No donations yet</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const User = ({ name, isAnonymous }: UserType) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex justify-center items-center w-8 h-8 rounded-full ${isAnonymous ? "bg-muted" : "bg-primary-light"}`}
      >
        {isAnonymous ? (
          <EyeOff size={16} className="text-primaryColor" />
        ) : (
          <UserIcon size={16} className="text-primary" />
        )}
      </div>
      <span
        className={`font-semibold ${isAnonymous ? "text-muted-foreground" : "text-primaryText"}`}
      >
        {isAnonymous ? "Anonymous" : name}
      </span>
    </div>
  );
};
export default LiveDonationActivity;
