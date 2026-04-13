import { ENDPOINTS } from "@/src/lib/api/endpoints";
import { apiSlice } from "./apiSlice";

export const donorAuthApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    donorSignIn: builder.mutation({
      query: (credentials) => ({
        url: ENDPOINTS.donorAuth.signin,
        method: "POST",
        body: credentials,
      }),
    }),
    donorSignUp: builder.mutation({
      query: (details) => ({
        url: ENDPOINTS.donorAuth.signup,
        method: "POST",
        body: details,
      }),
    }),
    donorGoogleAuth: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.donorAuth.google,
        method: "POST",
        body,
      }),
    }),
    donorLogout: builder.mutation({
      query: () => ({
        url: ENDPOINTS.donorAuth.logout,
        method: "POST",
      }),
    }),
    validateUserAuth: builder.query({
      query: () => ({
        url: ENDPOINTS.donorAuth.validateAuth,
        method: "GET",
      }),
    }),
    getAllCampaigns: builder.query({
      query: () => ({
        url: ENDPOINTS.donorAuth.allCampaigns,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useDonorGoogleAuthMutation,
  useDonorSignInMutation,
  useDonorSignUpMutation,
  useDonorLogoutMutation,
  useValidateUserAuthQuery,
  useGetAllCampaignsQuery,
} = donorAuthApi;
