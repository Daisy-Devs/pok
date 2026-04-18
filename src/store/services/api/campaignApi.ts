import { ENDPOINTS } from "@/src/lib/api/endpoints";
import { apiSlice } from "../slice/apiSlice";

export const campaignApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCampaigns: builder.query({
      query: () => ({ url: ENDPOINTS.campaign.allCampaigns, method: "GET" }),
    }),
    getAllOrganizations: builder.query({
      query: (id: string) => ({
        url: ENDPOINTS.campaign.allOrganizations.replace(":organizationId", id),
        method: "GET",
      }),
    }),
  }),
});
export const { useGetAllCampaignsQuery, useGetAllOrganizationsQuery } =
  campaignApi;
