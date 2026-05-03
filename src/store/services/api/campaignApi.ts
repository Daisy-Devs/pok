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
      query: (params) => ({ url: ENDPOINTS.campaign.getAllCampaigns, method: "GET",params: {
          page: params?.page || 1,
          limit: params?.limit || 6,
          cause: params?.category === "All" ? "" : params?.category,
          search: params?.searchTerm,
          sortBy: params?.sort,
        }, }),
    }),
    getCampaignById: builder.query({
      query: (id: string) => ({
        url: ENDPOINTS.campaign.getCampaignById.replace(":id", id),
        method: "GET",
      }),
    }),
    getAllOrganizations: builder.query({
      query: (id: string) => ({
        url: ENDPOINTS.campaign.getAllOrganizations.replace(
          ":organizationId",
          id,
        ),
        method: "GET",
      }),
    }),
  createCampaign: builder.mutation({
    query: (data) => ({
      url: ENDPOINTS.campaign.createCampaign,
      method: "POST",
      body: data,
    }),
  })
  }),
});
export const {
  useRegisterNgoMutation,
  useGetAllCampaignsQuery,
  useGetCampaignByIdQuery,
  useGetAllOrganizationsQuery,
  useCreateCampaignMutation
} = campaignApi;
