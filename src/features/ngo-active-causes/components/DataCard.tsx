"use client";

import { useEffect, useState } from "react";
import { CampaignCard } from "./CampaignCard";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination";
import { useGetCampaignByOrgQuery } from "@/src/store/services/api/campaignApi";
import { CampaignStatus, TabStatus } from "./types";

export default function DataCard() {
  const [tab, setTab] = useState<TabStatus>("active");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, error } = useGetCampaignByOrgQuery({
    page,
    status: tab,
  });

  useEffect(() => {
    if (isLoading) console.log("⏳ Campaigns: Fetching initial data...");
    if (isFetching)
      console.log("🔄 Campaigns: Refetching for tab/page change...");
    if (data) console.log("✅ Campaigns Received:", data.data);
    if (error) console.error("❌ Campaigns Error:", error);
  }, [data, isLoading, isFetching, error]);

  const responseData = data?.data;
  const campaigns =
    tab === "all"
      ? responseData?.campaigns || []
      : (responseData?.campaigns || []).filter((c: any) => c.status === tab);
  const totalPages = responseData?.totalPages || 0;

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={(v: any) => setTab(v)} className="w-fit">
        <TabsList className="bg-grey">
          <TabsTrigger value="all">All Causes</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {isLoading ? (
          <p>Loading campaigns...</p>
        ) : campaigns.length > 0 ? (
          campaigns.map((campaign: any) => (
            <CampaignCard
              key={campaign._id}
              campaign={{
                id: campaign._id,
                title: campaign.title,
                description: campaign.missionStatement,
                image: campaign.imageUrl,
                category: campaign.cause,
                raised: campaign.totalRaised,
                goal: campaign.goalAmount,
                token: campaign.goalToken,
                progress: campaign.progressPercent,
                status: campaign.status as CampaignStatus,
                lastEdited: new Date(campaign.updatedAt).toLocaleDateString(),
              }}
            />
          ))
        ) : (
          <p className="col-span-full text-center py-10 text-gray-500">
            No campaigns found in this category.
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent className="flex-wrap justify-center gap-1">
            <PaginationItem>
              <PaginationPrevious
                className="cursor-pointer"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                className="cursor-pointer"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
