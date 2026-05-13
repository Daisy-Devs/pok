"use client";
import {
  Table,
  TableBody,
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
  Donation,
  useGetDonationsByDonorQuery,
} from "@/src/store/services/api/donationApi";
import { ChevronRight, UserCheck2, VectorSquare } from "lucide-react";
import { useDonorProfileQuery } from "@/src/store/services/api/donorAuthApi";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Profile = () => {
  const { data: profileData, isLoading: isProfileLoading } =
    useDonorProfileQuery({});
  const { data, isLoading, isError } = useGetDonationsByDonorQuery();
  const donations: Donation[] = data?.data?.donations ?? [];
  console.log("Donations:", donations);
  const causeCount = new Set(donations.map((d) => d.campaignId)).size;
  const memberSinceDate = profileData?.profile?.memberSince;
  const latestCause = donations[0]?.campaignCause || "No Cause";

  const memberSince = memberSinceDate
    ? new Date(memberSinceDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "—";

  const profileActivities: ProfileActivity[] = [];
  return (
    <div className="flex flex-col gap-3 w-full py-12 px-5 space-y-9">
      <Details />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-border/15 rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
            <VectorSquare size={25} className="text-primary" />
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wide uppercase mb-0.5">
              Latest Donated Cause
            </p>

            <p className="text-xl font-bold text-secondaryText leading-tight">
              {latestCause}
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
              {causeCount} Campaign{causeCount !== 1 ? "s" : ""}
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
              {memberSince}
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
            {donations.length > 0 ? (
              donations.map((donation, idx) => (
                <TableRow key={`${donation.campaignId}-${idx}`}>
                  <TableCell className="font-medium">
                    <Cause
                      cause={donation.campaignCause}
                      organization={donation.campaignTitle}
                      individual
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-secondaryText text-base">
                    {donation.amount} ETH
                  </TableCell>
                  <TableCell>{timeAgo(donation.createdAt)}</TableCell>
                  <TableCell>
                    <a
                      href={
                        process.env.NEXT_PUBLIC_ETHER_SCAN +
                        donation.transactionHash
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View transaction on Etherscan"
                    >
                      <ChevronRight size={12} />
                    </a>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                {/* ✅ span ALL columns */}
                <TableCell colSpan={4} className="h-60">
                  <div className="flex flex-col items-center justify-center">
                    <DotLottieReact
                      src="/gif/Empty.lottie"
                      loop
                      autoplay
                      style={{ width: 200, height: 200 }}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      No donations yet
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Profile;
