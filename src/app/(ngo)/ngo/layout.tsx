"use client";
import "../../globals.css";
import { Sidebar, SidebarProvider } from "@/src/components/ui/sidebar";
import NGOHeader from "@/src/components/NGOHeader";
import Footer from "@/src/components/Footer";
import { useAppSelector } from "@/src/store/store";
import { selectIsAuthenticated, selectUser } from "@/src/store/services/selectors/authSelectors";
import { useConnection } from "wagmi";
import { hideWalletAddress } from "@/src/lib/utils";
import App from "next/app";
import AppSidebar from "@/src/components/AppSidebar";

export default function NGOLayout({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAppSelector(selectIsAuthenticated);
  const { address } = useConnection();
  const isNGO= useAppSelector(selectUser)?.role=="NGO";
  return (
    <SidebarProvider>
      <div className={`flex w-full ${!isLoggedIn && "flex-col"}`}>
        {/* Sidebar ONLY if logged in */}
        {(isLoggedIn && isNGO) && <AppSidebar />}
        <div className="w-full">
          <NGOHeader
            walletAddress={hideWalletAddress(address)}
          />
          <main className="bg-background w-full overflow-y-auto p-4">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
