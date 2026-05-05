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
    getDonationsByCampaign: builder.query<Donation[], string>({
      query: (campaignId) => ({
        url: ENDPOINTS.donation.getDonationsByCampaign.replace(":campaignId", campaignId),
        method: "GET",
      }),
      transformResponse: (response: any) => response.data.data,
    }),
    getAllWithdrawals: builder.query({
      query: () => ({
        url: ENDPOINTS.donation.getWithdrawal,
        method: "GET",
      }),
    }),
    getWithdrawalByCampaign: builder.query({
      query: (campaignId) => ({
        url: ENDPOINTS.donation.getWithdrawal+"/"+campaignId,
        method: "GET",
      }),
    })
  }),
});

export const { useGetDonationsByDonorQuery, useGetDonationsByCampaignQuery, useGetWithdrawalByCampaignQuery,useGetAllWithdrawalsQuery } = donationApi;
