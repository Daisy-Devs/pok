import { ENDPOINTS } from "@/src/lib/api/endpoints";
import { apiSlice } from "../slice/apiSlice";

export const campaignApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerNgo: builder.mutation({
      query: (data) => ({
        url: ENDPOINTS.ngoAuth.registerNgo,
        method: "POST",
        body: data,        
      }),
    }),
    getAllCampaigns: builder.query({
      query: () => ({ url: ENDPOINTS.campaign.getAllCampaigns, method: "GET" }),
    }),
  }),
});
export const { useRegisterNgoMutation, useGetAllCampaignsQuery } = campaignApi;