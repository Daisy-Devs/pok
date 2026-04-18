"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import Cause from "@/src/features/profile/components/Cause";
import Details from "@/src/features/profile/components/Details";
import { ProfileActivity } from "@/src/features/profile/types";
import { timeAgo } from "@/src/lib/utils";
import {
  ChevronRight,
  HandHeart,
  User,
  UserCheck2,
  VectorSquare,
} from "lucide-react";

const Profile = () => {
  const profileActivities: ProfileActivity[] = [
    {
      cause: "Save the Children",
      amount: 14.82,
      date: "2023-06-01T12:34:56Z",
      organization: "UNICEF",
      etherScanLink: "https://etherscan.io/tx/0x1234567890abcdef",
    },
    {
      cause: "Save the Children",
      amount: 14.82,
      date: "2023-06-01T12:34:56Z",
      organization: "UNICEF",
      etherScanLink: "https://etherscan.io/tx/0x1234567890abcdef",
    },
    {
      cause: "Save the Children",
      amount: 14.82,
      date: "2023-06-01T12:34:56Z",
      organization: "UNICEF",
      etherScanLink: "https://etherscan.io/tx/0x1234567890abcdef",
    },
    {
      cause: "Save the Children",
      amount: 14.82,
      date: "2023-06-01T12:34:56Z",
      organization: "UNICEF",
      etherScanLink: "https://etherscan.io/tx/0x1234567890abcdef",
    },
  ];
  return (
    <div className="flex flex-col gap-3 w-full py-12 px-5 space-y-9">
      <Details />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-border/15 rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <HandHeart size={25} className="text-emerald-700" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase mb-0.5">
              Total Donated
            </p>
            <p className="text-xl font-extrabold text-secondaryText leading-tight">
              14.82 ETH
            </p>
            <p className="text-sm font-semibold text-emerald-600 mt-0.5">
              ≈ $34,210.50 USD
            </p>
          </div>
        </div>

        <div className="bg-white border border-border/15 rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
            <VectorSquare size={25} className="text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase text-neutral-400 mb-0.5">
              Causes Supported
            </p>
            <p className="text-xl font-extrabold text-neutral-900 leading-tight">
              12 Campaigns
            </p>
          </div>
        </div>

        <div className="bg-white border border-border/15 rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <UserCheck2 size={25} className="text-blue-700" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide uppercase mb-0.5">
              Member Since
            </p>
            <p className="text-xl font-extrabold text-secondaryText leading-tight">
              May 2022
            </p>
          </div>
        </div>
      </div>

      {/** Recent Impacts */}
      <div>
        <h1 className="text-secondaryText text-xl font-extrabold w-full bg-white p-3 rounded-sm">
          Recent Impacts
        </h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-110">Cause/Campaign</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profileActivities.map((activity) => (
              <TableRow key={activity.cause + activity.organization}>
                <TableCell className="font-medium">
                  {
                    <Cause
                      cause={activity.cause}
                      organization={activity.organization}
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
    </div>
  );
};

export default Profile;
