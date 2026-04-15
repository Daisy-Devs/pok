import { ENDPOINTS } from "@/src/lib/api/endpoints";
import { apiSlice } from "../slice/apiSlice";

export const campaignApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCampaigns: builder.query({
      query: () => ({ url: ENDPOINTS.campaign.getAllCampaigns, method: "GET" }),
    }),
  }),
});
export const { useGetAllCampaignsQuery } = campaignApi;