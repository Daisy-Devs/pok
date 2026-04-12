import { ENDPOINTS } from "@/src/lib/api/endpoints";
import { apiSlice } from "../slice/apiSlice";

export const donorAuthApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    donorSignIn: builder.mutation({
      query: (credentials) => ({
        url: ENDPOINTS.donorAuth.signin,
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          document.cookie = `role=Donor; path=/; max-age=${60 * 60 * 24}`;
        } catch {}
      },
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
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: ENDPOINTS.donorAuth.forgotPassword,
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, body }) => {
        return {
          url: `${ENDPOINTS.donorAuth.resetPassword}/${token}`,
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const {
  useDonorGoogleAuthMutation,
  useDonorSignInMutation,
  useDonorSignUpMutation,
  useDonorLogoutMutation,
  useValidateUserAuthQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = donorAuthApi;
