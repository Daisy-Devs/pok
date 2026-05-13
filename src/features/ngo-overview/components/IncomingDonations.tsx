"use client";

import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";
import { DataTable } from "@/src/components/ui/data-table";
import { donateHistoryColumns } from "../columns";
import { useGetDonationByOrganisationQuery } from "@/src/store/services/api/donationApi";

export default function IncomingDonations() {
  const { data, isLoading, isFetching, error } =
    useGetDonationByOrganisationQuery({});

  const router = useRouter();

  const donations = data?.data?.donations || [];
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Incoming Donations</h2>
        <Button
          variant="ghost"
          text="View All"
          onClick={() => {
            router.push("/ngo/donation-history");
          }}
        />
      </div>

      <div className="min-w-175">
        <DataTable
          columns={donateHistoryColumns}
          data={donations.slice(0, 4)}
          showPagination={false}
        />
      </div>
    </div>
  );
}
