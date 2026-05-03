"use client";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "lucide-react";
import React from "react";

export type DonationHistory = {
  donor: string;
  address: string;
  amount: string;
  usd: string;
  cause: string;
  date: string;
  time: String;
  hash: String;
  status: String;
};
export const donationHistoryColumns: ColumnDef<DonationHistory>[] = [
  {
    accessorKey: "donor",
    header: "Donor",
    cell: ({ row }) => {
      const { donor, address } = row.original;

      const isAnonymous = donor.toLowerCase().includes("anonymous");

      // Generate initials (e.g., "Vihan Shetty" → "VS")
      const getInitials = (name: string) => {
        return name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
      };

      return (
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center overflow-hidden text-sm font-semibold text-[#07006C]">
            {isAnonymous ? <User size={18} /> : getInitials(donor)}
          </div>

          {/* Name + Address */}
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{donor}</span>
            <span className="text-xs text-primary-color">{address}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const { amount, usd } = row.original;

      return (
        <div className="flex flex-col">
          <span className="font-semibold">{amount}</span>
          <span className="text-xs text-secondary-dark">{usd}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "cause",
    header: "Cause / Campaign",
  },
  {
    accessorKey: "date",
    header: "Timestamp",
  },
  {
    accessorKey: "hash",
    header: "Tx Hash",
    cell:({row})=>{
      const {hash}=row.original;
      return(
        <div>
          <span className="text-primary">{hash}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { status } = row.original;
      return (
        <div className="flex flex-col">
          <span
            className={`flex items-center gap-2 text-sm font-medium ${
              status === "CONFIRMED" ? "text-green-600" : "text-red-500"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                status === "CONFIRMED" ? "bg-green-500" : "bg-red-500"
              }`}
            />
            {status}
          </span>
        </div>
      );
    },
  },
];
