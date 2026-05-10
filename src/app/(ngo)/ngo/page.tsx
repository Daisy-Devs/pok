import IncomingDonations from "@/src/features/ngo-overview/components/IncomingDonations";
import { RecentActivity } from "@/src/features/ngo-overview/components/RecentActivity";
import StatsCard from "@/src/features/ngo-overview/components/StatsCard";
import React from "react";

const statsData = [
  {
    title: "Total Raised (All-time)",
    value: "142.85 ETH",
    change: "+12.5%",
    changeLabel: "vs last month",
    image: "/svg/walletIcon.svg",
  },
  {
    title: "Unique Donors",
    value: "4,821",
    change: "+241",
    changeLabel: "new this week",
    image: "/svg/profileIcon.svg",
  },
];

const NGODashboard = () => {
  if (!statsData) return <div>Loading...</div>;
  return (
    <div className="px-2 sm:px-4 lg:px-6 py-4 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
