import { ENDPOINTS } from "@/src/lib/api/endpoints";
import { apiSlice } from "../slice/apiSlice";

export interface Donation {
  campaignId: string;
  cause: string;
  organization: string;
  amount: number;
  date: string;
  etherScanLink: string;
}

export const donationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDonations: builder.query<Donation[], void>({
      query: () => ({
        url: ENDPOINTS.donation.getAllDonations,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data.data,
    }),

    getDonationsByDonor: builder.query<Donation[], void>({
      query: () => ({
        url: ENDPOINTS.donation.getDonationsByDonor,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data.data,
    }),
  }),
});

export const { useGetDonationsByDonorQuery } = donationApi;
