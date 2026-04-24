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

const LiveDonationActivity = ({ campaignId }: { campaignId: string }) => {
  const { data, isLoading, error } = useGetDonationsByCampaignQuery(campaignId);
  if (isLoading) return <p>Loading donations...</p>;
  if (error) return <p>Failed to load donations</p>;
  if (!data?.length) return <p>No donations yet</p>;

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
          {data.map((activity: any, index: number) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                {
                  <User
                    name={activity.organization || "Anonymous"}
                    isAnonymous={!activity.organization}
                  />
                }
              </TableCell>
              <TableCell className="font-semibold text-secondaryText text-base">
                {activity.amount}
              </TableCell>
              <TableCell>{timeAgo(activity.date)}</TableCell>
              <TableCell>
                <a
                  href={activity.etherScanLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ChevronRight size={12} />
                </a>
              </TableCell>
            </TableRow>
          ))}
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
