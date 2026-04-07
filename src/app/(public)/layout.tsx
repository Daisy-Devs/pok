"use client";
import AppSidebar from "@/src/components/AppSidebar";
import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import { SidebarProvider } from "@/src/components/ui/sidebar";
import { useValidateUserAuthQuery } from "@/src/store/services/donorAuthApi";
import { selectIsAuthenticated } from "@/src/store/services/selectors/authSelectors";
import { loggedOut } from "@/src/store/services/slice/authSlice";
import { useAppSelector } from "@/src/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = useAppSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
    // Only call API if persisted state says user is authenticated
  const { isError } = useValidateUserAuthQuery({}, {
    skip: !isLoggedIn, // ← skips the call if not authenticated
  });

  useEffect(() => {
    if (isError) {
      console.log("Logging out!caught");
      
      dispatch(loggedOut());
    }
  }, [isError, dispatch]);
  return (
    <div>
      <SidebarProvider className="flex flex-col">
        <Navbar />
        <div className="flex-col">
          <AppSidebar />
          <main className="flex-1 bg-background overflow-y-auto">
            {children}
          </main>
          <Footer />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default PublicLayout;
