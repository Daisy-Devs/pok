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
      query: (params) => ({
        url: ENDPOINTS.campaign.getAllCampaigns,
        method: "GET",
        params: {
          page: params?.page || 1,
          limit: params?.limit || 6,
          cause: params?.category === "All" ? "" : params?.category,
          search: params?.search,
          sortBy: params?.sort,
        },
      }),
      providesTags: ['Campaigns'],
    }),
    getCampaign: builder.query({
      query: (params) => ({
        url: ENDPOINTS.campaign.getCampaignById.replace(":id", params),
        method: "GET",
      }),
      providesTags: ['Campaign'],
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
        invalidatesTags:['Campaign','Campaigns']
      }),
    }),
    getCampaignByOrg: builder.query({
      query: () => ({
        url: ENDPOINTS.campaign.getCampaignByOrg,
        method: "GET",
      }),
    }),
    updateCampaign: builder.mutation({
      query: ({id,data}) => ({
        url: ENDPOINTS.campaign.updateCampaign.replace(":id",id),
        method: "POST",
        body: data,
      }),
    })
  }),
});
export const {
  useRegisterNgoMutation,
  useGetAllCampaignsQuery,
  useGetCampaignQuery,
  useGetAllOrganizationsQuery,
  useCreateCampaignMutation,
  useGetCampaignByOrgQuery,
  useUpdateCampaignMutation
} = campaignApi;
