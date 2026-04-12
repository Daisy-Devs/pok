"use client";

import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { persistor, store } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { walletConfig } from "../lib/walletConfig";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          <WagmiProvider config={walletConfig}>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </WagmiProvider>
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  );
}
