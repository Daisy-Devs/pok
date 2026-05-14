import { ENDPOINTS } from "@/src/lib/api/endpoints";
import { apiSlice } from "../slice/apiSlice";

export interface Donation {
  campaignId: string;
  campaignCause: string;
  campaignTitle: string;
  amount: number;
  donorName: string;
  token: string;
  date?: string;
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
      transformResponse: (response:any) => response?.data?.data,
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
      providesTags: (result, error, params) => [
        { type: "Campaign", id: params }, // params IS the id here
      ],
      transformResponse: (response:any) => {
        return response.data?.donations ?? response.data ?? [];
      },
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
    downloadDonationHistory: builder.mutation({
      query: (params) => ({
        url: ENDPOINTS.donation.getDonationsByOrg,
        method: "GET",
        params: { ...params, export: "true" },
        responseHandler: async (response: Response) => {
          const text = await response.text();
          return new Blob([text], { type: "text/csv" });
        },
        cache: "no-cache",
      }),
    }),
    getWithdrawableBalance: builder.query({
      query: () => ({
        url: ENDPOINTS.withdrawal.getWithdrawableBalance,
        method: "GET",
      }),
      providesTags: ["Donations"],
    }),
    getAllWithdrawals: builder.query<any, void>({
      query: () => ({
        url: ENDPOINTS.withdrawal.getWithdrawal,
        method: "GET",
      }),
      providesTags: ["Donations"],
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
  useDownloadDonationHistoryMutation,
  useGetAllWithdrawalsQuery,
  useGetWithdrawableBalanceQuery,
} = donationApi;
