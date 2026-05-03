"use client";

import { FilterBar } from "@/src/features/ngo-donation-history/components/FilterBar";
import React, { useMemo, useState } from "react";
import { DataTable } from "@/src/components/ui/data-table";
import { donationHistoryColumns } from "@/src/features/ngo-donation-history/columns";

export default function DonationHistory() {
  const MOCK_DATA = [
    {
      donor: "vitalik.eth",
      address: "0xd8da...6045",
      amount: "5.20 ETH",
      usd: "$12,450.80",
      cause: "Clean Ocean Initiative",
      date: "Nov 24, 2023",
      time: "14:22",
      hash: "0x7a23...f12b",
      status: "CONFIRMED",
    },
    {
      donor: "Anonymous Donor",
      address: "0x8922...01e2",
      amount: "1.00 ETH",
      usd: "$2,394.12",
      cause: "Global Education Fund",
      date: "Oct 24, 2023",
      time: "11:05",
      hash: "0x12bc...e981",
      status: "CONFIRMED",
    },
    {
      donor: "sarah.lens",
      address: "0x3f5c...99a1",
      amount: "12.50 ETH",
      usd: "$29,926.50",
      cause: "Disaster Relief 2023",
      date: "Oct 23, 2023",
      time: "09:12",
      hash: "0xee44...c811",
      status: "CONFIRMED",
    },
    {
      donor: "Protocol Treasury",
      address: "0x1472...bb02",
      amount: "50.00 ETH",
      usd: "$119,706.00",
      cause: "Reforestation DAO",
      date: "Aug 26, 2023",
      time: "23:58",
      hash: "0x88ff...732a",
      status: "CONFIRMED",
    },

    {
      donor: "vitalik.eth",
      address: "0xd8da...6045",
      amount: "5.20 ETH",
      usd: "$12,450.80",
      cause: "Clean Ocean Initiative",
      date: "Sep 24, 2023",
      time: "14:22",
      hash: "0x7a23...f12b",
      status: "CONFIRMED",
    },
    {
      donor: "Anonymous Donor",
      address: "0x8922...01e2",
      amount: "1.00 ETH",
      usd: "$2,394.12",
      cause: "Global Education Fund",
      date: "Oct 24, 2023",
      time: "11:05",
      hash: "0x12bc...e981",
      status: "CONFIRMED",
    },
    {
      donor: "sarah.lens",
      address: "0x3f5c...99a1",
      amount: "12.50 ETH",
      usd: "$29,926.50",
      cause: "Disaster Relief 2023",
      date: "Oct 23, 2023",
      time: "09:12",
      hash: "0xee44...c811",
      status: "CONFIRMED",
    },
    {
      donor: "Protocol Treasury",
      address: "0x1472...bb02",
      amount: "50.00 ETH",
      usd: "$119,706.00",
      cause: "Reforestation DAO",
      date: "Oct 22, 2023",
      time: "23:58",
      hash: "0x88ff...732a",
      status: "CONFIRMED",
    },
    {
      donor: "vitalik.eth",
      address: "0xd8da...6045",
      amount: "5.20",
      asset: "eth",
      usd: "$12,450.80",
      cause: "Clean Ocean Initiative",
      date: "2023-08-24",
      time: "14:22",
      hash: "0x7a23...f12b",
      status: "CONFIRMED",
    },
    {
      donor: "Anonymous Donor",
      address: "0x8922...01e2",
      amount: "1.00",
      asset: "eth",
      usd: "$2,394.12",
      cause: "Global Education Fund",
      date: "2023-09-24",
      time: "11:05",
      hash: "0x12bc...e981",
      status: "CONFIRMED",
    },
    {
      donor: "sarah.lens",
      address: "0x3f5c...99a1",
      amount: "12.50",
      asset: "eth",
      usd: "$29,926.50",
      cause: "Disaster Relief 2023",
      date: "2023-10-23",
      time: "09:12",
      hash: "0xee44...c811",
      status: "CONFIRMED",
    },
    {
      donor: "Protocol Treasury",
      address: "0x1472...bb02",
      amount: "50.00",
      asset: "eth",
      usd: "$119,706.00",
      cause: "Reforestation DAO",
      date: "2023-10-22",
      time: "23:58",
      hash: "0x88ff...732a",
      status: "CONFIRMED",
    },
    {
      donor: "Stani.lens",
      address: "0x7421...aa12",
      amount: "1000.00",
      asset: "usdc",
      usd: "$1,000.00",
      cause: "Web3 Education",
      date: "2024-01-15",
      time: "10:00",
      hash: "0x55ff...22bb",
      status: "CONFIRMED",
    },
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const [assetFilter, setAssetFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  
 

  const filteredData = useMemo(() => {
    return MOCK_DATA.filter((item) => {
      const matchesSearch =
        item.cause.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.donor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAsset = assetFilter === "all" || item.asset === assetFilter;

      // Basic date logic (comparison based on string for static demo)
      const matchesDate = dateRange === "all" || true;

      return matchesSearch && matchesAsset && matchesDate;
    });
  }, [searchQuery, assetFilter, dateRange]);

  
 

  return (
    <div>
      <div className="w-full  bg-slate-50 min-h-screen space-y-4">
        <FilterBar
          onSearchChange={setSearchQuery}
          onAssetChange={setAssetFilter}
          onDateChange={setDateRange}
          totalRecords={filteredData.length}
        />

        <div >
          <DataTable
            columns={donationHistoryColumns}
            data={filteredData}
            rowLimit={4}
          />
        </div>
      </div>
    </div>
  );
}
