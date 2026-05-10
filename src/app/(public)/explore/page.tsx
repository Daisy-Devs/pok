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
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { formatCryptoAmount } from "@/src/lib/utils";

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const causeFromUrl = searchParams.get("cause");

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(1);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading, error } = useGetAllCampaignsQuery({
    page,
    limit: 6,
    cause: activeCategory === "All" ? "" : activeCategory,
    search: debouncedSearch,
    sortBy: sortBy,
  });

  //SECOND QUERY (for categories only)
  const { data: allData } = useGetAllCampaignsQuery({
    page: 1,
    limit: 100, // enough to extract categories
  });

  useEffect(() => {
    setPage(1);
  }, [activeCategory, debouncedSearch, sortBy]);

  useEffect(() => {
    if (causeFromUrl) {
      setActiveCategory(causeFromUrl);
    }
  }, [causeFromUrl]);

  const availableCategories: string[] = useMemo(() => {
    const list: string[] =
      allData?.data?.campaigns?.map((c: CampaignApi) => String(c.cause)) || [];

    const unique: string[] = Array.from(new Set<string>(list));

    return ["All", ...unique];
  }, [allData]);

  useEffect(() => {
    if (
      availableCategories.length > 0 &&
      !availableCategories.includes(activeCategory)
    ) {
      setActiveCategory("All");
    }
  }, [availableCategories, activeCategory]);

  const campaigns: Campaign[] = 
      data?.data?.campaigns?.map((c: CampaignApi) => ({
        id: c.id,
        title: c.title,
        description: c.missionStatement,
        category: c.cause,
        image: c.imageUrl,
        progress:Math.ceil((c.totalRaised / c.goalAmount) * 100),
        raised: c.totalRaised? formatCryptoAmount(Number(c.totalRaised),c.goalToken): 0,
        currency:c.goalToken,
        goal: c.goalAmount,
        status: c.status,
      })) || []


  if (error) return <p>Failed to load campaigns</p>;

  console.log("actual",data?.data?.campaigns);

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
        <CategoryFilter
          active={activeCategory}
          setActive={setActiveCategory}
          categories={availableCategories}
        />
        <div className="w-full md:w-auto flex justify-end">
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-10">
        {campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <DotLottieReact
              src="/gif/Empty.lottie"
              loop
              autoplay
              style={{ width: 200, height: 200 }}
            />
            <p className="text-gray-500 mt-4 text-sm">No campaigns found</p>
          </div>
        ) : (
          <CampaignGrid
            totalPages={data?.data?.totalPages || 1}
            currentPage={page}
            onPageChange={setPage}
            data={campaigns}
          />
        )}
      </div>
      <NetworkBanner />
    </div>
  );
}
