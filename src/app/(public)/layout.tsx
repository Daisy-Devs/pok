"use client";
import AppSidebar from "@/src/components/AppSidebar";
import Footer from "@/src/components/Footer";
import Navbar from "@/src/components/Navbar";
import { SidebarProvider } from "@/src/components/ui/sidebar";
import {
  useDonorLogoutMutation,
  useValidateUserAuthQuery,
} from "@/src/store/services/api/donorAuthApi";
import { useWalletLogoutMutation } from "@/src/store/services/api/walletApi";
import { selectIsAuthenticated } from "@/src/store/services/selectors/authSelectors";
import { loggedOut } from "@/src/store/services/slice/authSlice";
import { useAppSelector } from "@/src/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = useAppSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { isError } = useValidateUserAuthQuery(
    {},
    {
      skip: !isLoggedIn,
    },
  );
  const [walletLogout] = useWalletLogoutMutation();
  const [donorLogout] = useDonorLogoutMutation();

  
  useEffect(() => {
    if (isError) {
      walletLogout({});
      donorLogout({});
      console.log("Logging out!caught");
      dispatch(loggedOut());
    }
  }, [isError, dispatch, walletLogout, donorLogout]);

  useEffect(() => {
    const protectedRoutes = ["/profile"];

    const isProtectedRoute = protectedRoutes.includes(pathname);

    if (!isLoggedIn && isProtectedRoute) {
      router.replace("/sign-in");
    }
  }, [isLoggedIn, pathname, router]);

  return (
    <div>
      <SidebarProvider className="flex flex-col  ">
        <Navbar />
        <div className="flex-col">
          <AppSidebar />
          <main className="flex-1 bg-background overflow-y-auto min-h-screen">
            {children}
          </main>
          <Footer />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default PublicLayout;
