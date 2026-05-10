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
import { useRouter } from "next/navigation";

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
  const router=useRouter();
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Incoming Donations</h2>
        <Button variant="ghost" text="View All" onClick={()=>{router.push("/ngo/donation-history")}} />
      </div>

      <Table className="min-w-175">
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
                  <span className="font-semibold">{item.donor}</span>
                  <Badge variant='default' className="font-bold mt-1">
                    {item.type}
                  </Badge>
                </div>
              </TableCell>

              {/* Amount */}
              <TableCell className="font-bold">{item.amount}</TableCell>

              {/* Cause */}
              <TableCell>{item.cause}</TableCell>

              {/* Status */}
              <TableCell>
                <span
                  className={`flex items-center gap-2 text-sm font-medium ${
                    item.status === "Confirmed"
                      ? "text-secondary-dark"
                      : "text-red-500"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      item.status === "Confirmed"
                        ? "bg-secondary"
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
