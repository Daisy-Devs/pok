"use client";

import CampaignCauses from "@/src/features/home/components/CampaignCauses";
import HeroSection from "@/src/features/home/components/HeroSection";
import Philanthropy from "@/src/features/home/components/Philanthropy";

export default function Home() {
  return (
    <div className="bg-white overflow-x-hidden">
      {/* ── HERO ── */}
      <HeroSection />

      {/* ──  PHILANTHROPY ── */}
      <Philanthropy />

      {/* ── URGENT CAUSES ── */}
      <CampaignCauses />
    </div>
  );
}
