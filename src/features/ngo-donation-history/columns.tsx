"use client";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "lucide-react";
import React from "react";

export type DonationHistory = {
  donor: string;
  donorName: string;
  amount: number;
  goalToken: string;
  campaignTitle: string;
  cause: string;
  createdAt: string;
  txHash: string;
  status: string;
};
export const donationHistoryColumns: ColumnDef<DonationHistory>[] = [
  {
    accessorKey: "donorName",
    header: "Donor",
    cell: ({ row }) => {
      const { donorName, donor } = row.original;

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
          <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center overflow-hidden text-sm font-semibold text-[#07006C]">
            {donorName?.toLowerCase() === "anonymous" ? (
              <User size={18} />
            ) : (
              getInitials(donorName)
            )}
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-sm">{donorName}</span>

            <span className="text-xs text-primary-color">
              {donor.slice(0, 6)}...{donor.slice(-4)}
            </span>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const { amount, goalToken } = row.original;

      return (
        <div className="font-semibold">
          {amount} {goalToken}
        </div>
      );
    },
  },
  {
    accessorKey: "campaignTitle",
    header: "Cause / Campaign",
    cell: ({ row }) => {
      const { campaignTitle, cause } = row.original;

      return (
        <div className="flex flex-col">
          <span className="font-semibold">{campaignTitle}</span>

          <span className="text-xs text-gray-500">{cause}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Timestamp",
    cell: ({ row }) => {
      const { createdAt } = row.original;

      return (
        <div className="text-sm">{new Date(createdAt).toLocaleString()}</div>
      );
    },
  },
  {
    accessorKey: "txHash",
    header: "Tx Hash",
    cell: ({ row }) => {
      const { txHash } = row.original;

      return (
        <span className="text-primary text-sm">{txHash.slice(0, 10)}...</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { status } = row.original;

      const isConfirmed = status === "success";

      return (
        <span
          className={`flex items-center gap-2 text-sm font-medium ${
            isConfirmed ? "text-secondary-dark" : "text-red-500"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isConfirmed ? "bg-secondary-dark" : "bg-red-500"
            }`}
          />

          {isConfirmed ? "CONFIRMED" : "FAILED"}
        </span>
      );
    },
  },
];
