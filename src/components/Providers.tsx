"use client";

import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { persistor, store } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          {children}
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  );
}
