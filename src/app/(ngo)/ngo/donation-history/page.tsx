'use client';

import { DonationTable } from "@/src/features/ngo-donation-history/DonationTable";
import { FilterBar } from "@/src/features/ngo-donation-history/FilterBar";
import { TablePagination } from "@/src/features/ngo-donation-history/TablePagination";
import React, { useMemo, useState } from "react";
import {MOCK_DATA} from '../../../../features/ngo-donation-history/Data'



export default function DonationHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [assetFilter, setAssetFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;

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

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  return (
    <div>
      <div className="w-full p-6 bg-slate-50 min-h-screen space-y-4">
        <FilterBar
          onSearchChange={setSearchQuery}
          onAssetChange={setAssetFilter}
          onDateChange={setDateRange}
          totalRecords={filteredData.length}
        />

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <DonationTable data={paginatedData} />
          <TablePagination
            currentPage={currentPage}
            totalRecords={filteredData.length}
            rowsPerPage={rowsPerPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
