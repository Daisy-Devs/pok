"use client";
import { Search, Calendar, RefreshCcw, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

export const FilterBar = ({
  onSearchChange,
  onAssetChange,
  onDateChange,
  totalRecords,
}: any) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl ">
      <div className="flex items-center gap-3">
        {/* 1. Date Filter */}
        <Select onValueChange={onDateChange} defaultValue="30">
          <SelectTrigger className="w-45 bg-white">
            <Calendar className="w-4 h-4 mr-2 opacity-50" />
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>

        {/* 2. Asset Filter */}
        <Select onValueChange={onAssetChange} defaultValue="eth">
          <SelectTrigger className="w-42.5 bg-white">
            <RefreshCcw className="w-4 h-4 mr-2 opacity-50" />
            <SelectValue placeholder="Asset" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="eth">Asset: ETH</SelectItem>
            <SelectItem value="usdc">Asset: USDC</SelectItem>
            <SelectItem value="btc">Asset: WBTC</SelectItem>
          </SelectContent>
        </Select>

        {/* 3. Search Filter */}
        <div className=" w-75">
          {/* <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" /> */}
          <Input
            className=""
            placeholder="Filter by campaign"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-sm font-medium">
          <span className="text-slate-500 mr-2 uppercase tracking-wider text-xs">
            Total Screened:
          </span>
          <span className="text-emerald-600 font-bold">{totalRecords}</span>
        </div>
        <Button
          variant="ghost"
          className="text-indigo-600 font-semibold hover:text-indigo-700 hover:bg-indigo-50"
          text="Export CSV"
          leftIcon={<Download className="w-4 h-4 mr-2" />}
        />
      </div>
    </div>
  );
};
