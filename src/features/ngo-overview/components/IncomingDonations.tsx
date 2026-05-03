"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { LucideIcon, PilcrowLeftIcon } from "lucide-react";

type Donation = {
  icon: LucideIcon;
  donor: string;
  type: "PUBLIC" | "PRIVATE";
  amount: string;
  cause: string;
  status: "Confirmed" | "Cancelled";
};

const data: Donation[] = [
  {
    donor: "Vitalik.eth",
    type: "PUBLIC",
    amount: "5.00 ETH",
    cause: "Clean Water Africa",
    status: "Confirmed",
    icon: PilcrowLeftIcon,
  },
  {
    donor: "Anonymous Donor",
    type: "PRIVATE",
    amount: "0.45 ETH",
    cause: "Education Fund",
    status: "Confirmed",
    icon: PilcrowLeftIcon,
  },
  {
    donor: "Sarah Connor",
    type: "PUBLIC",
    amount: "1.20 ETH",
    cause: "Reforestation Proj.",
    status: "Cancelled",
    icon: PilcrowLeftIcon,
  },
];

export default function IncomingDonations() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Incoming Donations</h2>
        <Button variant="ghost" text="View All" />
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Donor</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Cause</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              {/* Donor */}
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{item.donor}</span>
                  <Badge variant="secondary" className="w-fit text-[10px] mt-1">
                    {item.type}
                  </Badge>
                </div>
              </TableCell>

              {/* Amount */}
              <TableCell className="font-medium">{item.amount}</TableCell>

              {/* Cause */}
              <TableCell>{item.cause}</TableCell>

              {/* Status */}
              <TableCell>
                <span
                  className={`flex items-center gap-2 text-sm font-medium ${
                    item.status === "Confirmed"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      item.status === "Confirmed"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  {item.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
