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

export default function DataCard() {
  const [tab, setTab] = useState<"all" | "active" | "draft" | "completed">(
    "active",
  );
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
  const campaigns = responseData?.campaigns || [];
  const totalPages = responseData?.totalPages || 0;

  return (
    <div className="space-y-6">
      <Tabs
        value={tab}
        onValueChange={(v: any) => {
          setTab(v);
          setPage(1);
        }}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          <p>Loading campaigns...</p>
        ) : campaigns.length > 0 ? (
          campaigns.map((campaign: any) => (
            <CampaignCard
              key={campaign._id}
              campaign={{
                id: campaign._id,
                title: campaign.title,
                description: campaign.description,
                image: campaign.image,
                raised: campaign.totalRaised, // From your backend aggregation
                goal: campaign.goalAmount,
                progress: campaign.progressPercent, // From your backend aggregation
                status: campaign.status,
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
