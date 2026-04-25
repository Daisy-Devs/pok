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
    donorProfile: builder.query({
      query: () => ({
        url: ENDPOINTS.donorAuth.profile,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateProfileImage: builder.mutation({
      query: (formData) => ({
        url: ENDPOINTS.donorAuth.updateProfile,
        method: "POST",
        body: formData, 
      }),
      invalidatesTags: ["User"],
    }),
    deleteProfileImage: builder.mutation({
      query: () => ({
        url: ENDPOINTS.donorAuth.deleteProfile,
        method: "POST",
      }),
      invalidatesTags: ["User"],
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
  useDeleteProfileImageMutation,
  useDonorProfileQuery,
  useUpdateProfileImageMutation,
} = donorAuthApi;
