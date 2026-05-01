import StatsCard from "@/src/features/ngo-overview/components/StatsCard";
import React from "react";

const statsData = [
  {
    title: "Total Raised (All-time)",
    value: "142.85 ETH",
    change: "+12.5%",
    changeLabel: "vs last month",
    image: "/ngo/walletIcon.svg",
  },
  {
    title: "Unique Donors",
    value: "4,821",
    change: "+241",
    changeLabel: "new this week",
    image: "/ngo/profileIcon.svg",
  },
];

const NGODashboard = () => {
  return (
    <div className="flex gap-4 flex-row">
      {statsData.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default NGODashboard;