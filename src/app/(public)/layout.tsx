
import AppSidebar from "@/src/components/AppSidebar";
import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import { SidebarProvider } from "@/src/components/ui/sidebar";
import React from "react";

const PublicLayout = ({children}: {
  children: React.ReactNode;
}) => {
  return (
    <div>
      <SidebarProvider className="flex flex-col">
        <Navbar />
        <div className="flex-col">
          <AppSidebar />
          <main className="flex-1 bg-background overflow-y-auto h-screen">
            {children}
          </main>
          <Footer />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default PublicLayout;
