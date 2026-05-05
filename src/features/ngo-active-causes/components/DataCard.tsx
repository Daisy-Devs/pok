"use client";

import { useState, useMemo } from "react";
import { CampaignCard } from "./CampaignCard";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { CampaignStatus } from "./types";

export default function DataCard() {
  const [tab, setTab] = useState<"active" | "draft" | "completed" | "all">(
    "active",
  );

  const MOCK_CAMPAIGNS: Campaign[] = [
    {
      id: "1",
      title: "Clean Water for Turkana Valley",
      description: "Providing sustainable solar-powered filtration...",
      raised: 42.5,
      goal: 60,
      progress: 75,
      daysLeft: 45,
      status: "active",
    },
    {
      id: "2",
      title: "Amazon Corridor Reforestation",
      description: "Restoring biodiversity corridors...",
      raised: 12.8,
      goal: 50,
      progress: 25,
      daysLeft: 45,
      image: "/forest.jpg",
      status: "active",
    },
    {
      id: "3",
      title: "Digital Literacy for Refugee Camps",
      description: "Setting up mobile computer labs...",
      lastEdited: "2h ago",
      status: "draft",
    },
    {
      id: "4",
      title: "Floating Clinic: Delta Region",
      description: "Boat-clinic for remote areas...",
      goal: 120,
      status: "completed",
    },
  ];

  const filtered = useMemo(() => {
    if (tab === "all") return MOCK_CAMPAIGNS;
    return MOCK_CAMPAIGNS.filter((c) => c.status === tab);
  }, [tab]);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as CampaignStatus)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}
