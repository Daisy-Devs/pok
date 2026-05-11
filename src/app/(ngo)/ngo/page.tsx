"use client";

import IncomingDonations from "@/src/features/ngo-overview/components/IncomingDonations";
import { RecentActivity } from "@/src/features/ngo-overview/components/RecentActivity";
import StatsCard from "@/src/features/ngo-overview/components/StatsCard";
import { useGetCampaignByOrgQuery } from "@/src/store/services/api/campaignApi";
import { Rocket, FileEdit, CheckCircle2, Users, Wallet } from "lucide-react";
import React from "react";

const NGODashboard = () => {
  const { data, isLoading } = useGetCampaignByOrgQuery({});

  if (isLoading) return <div>Loading...</div>;

  const dashboardData = data?.data;

  const campaigns = dashboardData?.campaigns || [];

  const activeCampaigns = campaigns.filter(
    (campaign: any) => campaign.status === "active",
  ).length;

  const draftCampaigns = campaigns.filter(
    (campaign: any) => campaign.status === "draft",
  ).length;

  const completedCampaigns = campaigns.filter(
    (campaign: any) => campaign.status === "completed",
  ).length;

  const uniqueDonors = dashboardData?.activeDonors || 0;

  const statsData = [
    {
      title: "Active Campaigns",
      value: activeCampaigns,
      change: `${activeCampaigns}`,
      changeLabel: "currently running",
      icon: Wallet,
    },
    {
      title: "Draft Campaigns",
      value: draftCampaigns,
      change: `${draftCampaigns}`,
      changeLabel: "not published",
      icon: FileEdit,
    },
    {
      title: "Completed Campaigns",
      value: completedCampaigns,
      change: `${completedCampaigns}`,
      changeLabel: "successfully ended",
      icon: CheckCircle2,
    },
    {
      title: "Unique Donors",
      value: uniqueDonors,
      change: `${uniqueDonors}`,
      changeLabel: "total contributors",
      icon: Users,
    },
  ];

  return (
    <div className="px-2 sm:px-4 lg:px-6 py-4 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Donations Table */}
        <div className="xl:col-span-2">
          <IncomingDonations />
        </div>

        {/* Activity */}
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
