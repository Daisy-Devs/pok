import { ENDPOINTS } from "@/src/lib/api/endpoints";
import { apiSlice } from "./apiSlice";

export const donorAuthApi= apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        donorSignIn:builder.mutation({
            query: (credentials) => ({
                url: ENDPOINTS.donorAuth.signin,
                method: "POST",
                body: credentials,
            }),
        }),
        donorSignUp:builder.mutation({
            query: (details) => ({
                url: ENDPOINTS.donorAuth.signup,
                method: "POST",
                body: details,
            }),
           
        }),
        donorGoogleAuth:builder.mutation({
            query: (token) => ({
                url: ENDPOINTS.donorAuth.google,
                method: "POST",
                body: token ,
            }),
        }),
    })
})

export const {useDonorGoogleAuthMutation,useDonorSignInMutation,useDonorSignUpMutation} = donorAuthApi;