"use client";

import CampaignCauses from "@/src/features/home/components/CampaignCauses";
import HeroSection from "@/src/features/home/components/HeroSection";
import Philanthropy from "@/src/features/home/components/Philanthropy";
import { ShieldAlert } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-white overflow-x-hidden">
      <HeroSection />

      <Philanthropy />

      <CampaignCauses />
      <div className="w-full flex justify-center my-7">
      <div className="w-md gap-3 border-3 border-amber-300 bg-amber-50 flex flex-col justify-center items-center p-5 rounded-xl">
        <div className="flex gap-2"><ShieldAlert className="text-amber-600" size={30}/> <span className="font-bold text-xl text-amber-600">This is not a real donation platform</span></div>
        <p className="text-sm text-amber-400">This project runs on a blockchain testnet for demonstration and testing purposes only. No real cryptocurrency or funds are collected, processed, or disbursed. All tokens used here have no monetary value.</p>
      </div>
      </div>
    </div>
  );
}
