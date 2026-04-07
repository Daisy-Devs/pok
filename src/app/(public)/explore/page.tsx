"use client";

import { useState } from "react";

import HeroSection from "@/src/features/explore/components/HeroSection";
import CampaignGrid from "@/src/features/explore/components/CampaignGrid";
import CategoryFilter from "@/src/features/explore/components/CategoryFilter";
import SortDropdown from "@/src/features/explore/components/SortDropdown";
import { campaigns } from "@/src/features/explore/components/data/campaigns";
import NetworkBanner from "@/src/features/explore/components/NetworkBanner";

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? campaigns
      : campaigns.filter(
          (c) =>
            c.category.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <div className="bg-[#ECEEF0] min-h-screen">
      <HeroSection />

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <CategoryFilter
          active={activeCategory}
          setActive={setActiveCategory}
        />
        <SortDropdown />
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-10">
        <CampaignGrid data={filtered} />
      </div>
      <NetworkBanner/>
    </div>
  );
}