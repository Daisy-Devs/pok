"use client";

import { FilterBar } from "@/src/features/ngo-donation-history/components/FilterBar";
import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/src/components/ui/data-table";
import { donationHistoryColumns } from "@/src/features/ngo-donation-history/columns";
import { useGetDonationByOrganisationQuery } from "@/src/store/services/api/donationApi";

export default function DonationHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [assetFilter, setAssetFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, error } =
    useGetDonationByOrganisationQuery({
      page,
      limit: 10,
      days: dateRange === "all" ? undefined : dateRange,
      goalToken: assetFilter === "all" ? undefined : assetFilter,
      cause: searchQuery || undefined,
    });

  useEffect(() => {
    if (data) {
      console.log("💰 Donation History Data:", {
        records: data?.data?.donations,
        total: data?.data?.totalRecords,
        filters: { searchQuery, assetFilter, dateRange },
      });
    }
    if (error) console.error("❌ Donation API Error:", error);
  }, [data, error, searchQuery, assetFilter, dateRange]);

  const donations = data?.data?.donations || [];
  const totalRecords = data?.data?.totalRecords || 0;

  return (
    <div>
      <div className="w-full  bg-slate-50 min-h-screen space-y-4">
        <FilterBar
          onSearchChange={setSearchQuery}
          onAssetChange={setAssetFilter}
          onDateChange={setDateRange}
          totalRecords={totalRecords}
          isLoading={isLoading || isFetching}
        />

        <div>
          <DataTable
            columns={donationHistoryColumns}
            data={donations}
            rowLimit={4}
          />
        </div>
      </div>
    </div>
  );
}
