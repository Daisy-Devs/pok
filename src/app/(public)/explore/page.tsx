"use client";

import { useEffect, useMemo, useState } from "react";

import HeroSection from "@/src/features/explore/components/HeroSection";
import CampaignGrid from "@/src/features/explore/components/CampaignGrid";
import CategoryFilter from "@/src/features/explore/components/CategoryFilter";
import SortDropdown from "@/src/features/explore/components/SortDropdown";
import NetworkBanner from "@/src/features/explore/components/NetworkBanner";
import SearchBar from "@/src/features/explore/components/SearchProp";
import { useGetAllCampaignsQuery } from "@/src/store/services/api/campaignApi";
import { Campaign, CampaignApi } from "@/src/features/explore/types";
import { useSearchParams } from "next/navigation";

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const causeFromUrl = searchParams.get("cause");

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (causeFromUrl) {
      setActiveCategory(causeFromUrl);
    }
  }, [causeFromUrl]);

  const { data, isLoading, error } = useGetAllCampaignsQuery({});

  const campaigns: Campaign[] = useMemo(() => {
    return (
      data?.data?.campaigns?.map((c: CampaignApi) => ({
        id: c.id,
        title: c.title,
        description: c.missionStatement,
        category: c.cause,
        image: c.imageUrl,
        progress: c.goalAmount
          ? ((c.raisedAmount || 0) / c.goalAmount) * 100
          : 0,
        raised: c.raisedAmount || 0,
        currency: "ETH",
      })) || []
    );
  }, [data]);

  const filtered = useMemo(() => {
    return campaigns.filter((c) => {
      const matchesCategory =
        activeCategory === "All" || c.category.toLowerCase() === activeCategory.toLowerCase();

      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [campaigns, activeCategory, search]);

  return (
    <div className="bg-white min-h-screen  ">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10 md:items-end">
        <div className="flex-1">
          <HeroSection />
        </div>

        <div className="w-full md:w-127.5 flex justify-end">
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </div>
      {/* Filters */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <CategoryFilter active={activeCategory} setActive={setActiveCategory} />
        <div className="w-full md:w-auto flex justify-end">
          <SortDropdown />
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-10">
        <CampaignGrid data={filtered} />
      </div>
      <NetworkBanner />
    </div>
  );
}
