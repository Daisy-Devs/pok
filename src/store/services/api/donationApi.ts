import { ENDPOINTS } from "@/src/lib/api/endpoints";
import { apiSlice } from "../slice/apiSlice";

export interface Donation {
  campaignId: string;
  campaignCause: string;
  campaignTitle: string;
  amount: number;
  createdAt: string;
  transactionHash: string;
}

export interface DonationsByDonorResponse {
  data: {
    donations: Donation[];
  };
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

    getDonationsByDonor: builder.query<DonationsByDonorResponse, void>({
      query: () => ({
        url: ENDPOINTS.donation.getDonationsByDonor,
        method: "GET",
      }),
    }),
    
    getDonationsByCampaign: builder.query<Donation[], string>({
      query: (campaignId) => ({
        url: ENDPOINTS.donation.getDonationsByCampaign.replace(
          ":campaignId",
          campaignId,
        ),
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
    }),
    getDonationByOrganisation: builder.query({
      query: (params) => ({
        url: ENDPOINTS.donation.getDonationsByOrg,
        method: "GET",
        params: {
          page: params.page,
          limit: params.limit,
          days: params.days,
          goalToken: params.goalToken,
          cause: params.cause,
        },
      }),
    }),
    getAllWithdrawals: builder.query({
      query: () => ({
        url: ENDPOINTS.withdrawal.getWithdrawal,
        method: "GET",
      }),
    }),
    getWithdrawalByCampaign: builder.query({
      query: (campaignId) => ({
        url: ENDPOINTS.withdrawal.getWithdrawal + "/" + campaignId,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetDonationsByDonorQuery,
  useGetDonationsByCampaignQuery,
  useGetWithdrawalByCampaignQuery,
  useGetDonationByOrganisationQuery,
  useGetAllWithdrawalsQuery,
} = donationApi;
