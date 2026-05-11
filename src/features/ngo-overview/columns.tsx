import { ColumnDef } from "@tanstack/react-table";
import { User } from "lucide-react";
import Image from "next/image";

export type DonateHistory = {
  donor: string;
  donorName: string;
  donorProfileImage?: {
    url?: string;
  };
  amount: number;
  goalToken: string;
  cause: string;
  status: string;
};

export const donateHistoryColumns: ColumnDef<DonateHistory>[] = [
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
            {row.original.donorProfileImage?.url ? (
              <Image
                src={row.original.donorProfileImage.url}
                alt={donorName}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : donorName?.toLowerCase() === "anonymous" ? (
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
    accessorKey: "cause",
    header: "Causes",
    cell: ({ row }) => {
      const { cause } = row.original;

      return (
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">{cause}</span>
        </div>
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
