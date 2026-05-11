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

    getDonationsByDonor: builder.query({
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
    markDonationFailure: builder.mutation({
      query: (failedDetails) => ({
        url: ENDPOINTS.donation.markDonationFailure,
        method: "POST",
        body: failedDetails,
      }),
      invalidatesTags: ['Donations'],
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
  useMarkDonationFailureMutation,
  useGetAllWithdrawalsQuery,
} = donationApi;
