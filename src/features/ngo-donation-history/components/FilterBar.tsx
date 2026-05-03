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
    <div className="flex flex-wrap items-center justify-between gap-4  p-4 rounded-xl ">
      <div className="flex items-center gap-3 ">
        {/* 1. Date Filter */}
        <Select onValueChange={onDateChange} defaultValue="30">
          <SelectTrigger className="w-45 bg-white shadow-sm ">
            <Calendar className="w-4 h-4 mr-2 opacity-50 " />
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
          <SelectTrigger className="w-42.5 bg-white shadow-sm ">
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
            className="shadow-sm text-semibold text-foreground bg-white"
            placeholder="Filter by campaign"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-sm font-medium">
          <span className="text-primary-color mr-2 uppercase  text-bold">
            Total Screened:
          </span>
          <span className="text-secondary-dark font-bold">
            {totalRecords} Records
          </span>
        </div>
        <Button
          variant="ghost"
          className="font-semibold"
          text="Export CSV"
          leftIcon={<Download className="w-4 h-4 " />}
        />
      </div>
    </div>
  );
};
