"use client";

import { useState } from "react";

import HeroSection from "@/src/features/explore/components/HeroSection";
import CampaignGrid from "@/src/features/explore/components/CampaignGrid";
import CategoryFilter from "@/src/features/explore/components/CategoryFilter";
import SortDropdown from "@/src/features/explore/components/SortDropdown";
import { campaigns } from "@/src/features/explore/components/data/campaigns";
import NetworkBanner from "@/src/features/explore/components/NetworkBanner";
import SearchBar from "@/src/features/explore/components/SearchProp";

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = campaigns.filter((c) => {
    const matchesCategory =
      activeCategory === "All" || c.category === activeCategory;

    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

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
