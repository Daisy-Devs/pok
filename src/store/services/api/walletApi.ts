import { ENDPOINTS } from "@/src/lib/api/endpoints";
import { apiSlice } from "../slice/apiSlice";

export const walletApi= apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        connectWallet:builder.mutation({
            query: (body) => ({
                url: ENDPOINTS.wallet.connectWallet,
                method: "POST",
                body,
            }),
        }),
        disconnectWallet:builder.mutation({
            query: () => ({
                url: ENDPOINTS.wallet.disconnectWallet,
                method: "POST",
            }),
        }),
        walletLogin:builder.mutation({
            query: (body) => ({
                url: ENDPOINTS.wallet.walletLogin,                
                method: "POST",
                body,
            }),
        }),
        walletLogout:builder.mutation({
            query: () => ({
                url: ENDPOINTS.wallet.walletLogout,
                method: "POST",
            }),
        }),
    })
})

export const {useConnectWalletMutation,useDisconnectWalletMutation,useWalletLoginMutation,useWalletLogoutMutation} = walletApi;