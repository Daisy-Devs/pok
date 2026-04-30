"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from "./ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nomenclature } from "@/src/constants/nomenclature";
import { splitTitle } from "../lib/utils";
import { Coins, HandHeart, History, LayoutPanelTop } from "lucide-react";
import { useAppSelector } from "../store/store";
import { selectUser } from "../store/services/selectors/authSelectors";

const AppSidebar = () => {
  const pathname = usePathname();
  const { firstHalf, secondHalf } = splitTitle(nomenclature.PRODUCT_NAME);
  const isNGO = useAppSelector(selectUser)?.role == "NGO";

  return (
    <Sidebar className={isNGO?"":"md:hidden"}>
      <SidebarHeader>
        <div className="flex justify-center mt-5">
          <h2 className="text-xl font-extrabold text-tertiary">{firstHalf}</h2>
          <h2 className="text-xl font-extrabold text-primary">
            {secondHalf.replace(/\s/g, "")}
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {isNGO ? (
          <SidebarGroup>
            <div className="flex flex-col gap-4 mt-7 px-3">
              <Link
                href="/ngo"
                className={`text-sm px-4 py-3 text-primaryText font-semibold rounded-lg hover:bg-primary hover:text-white ${
                  pathname === "/ngo" && "bg-primary/95 text-white font-bold"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <LayoutPanelTop size={20} />
                  <p>{nomenclature.OVERVIEW}</p>
                </div>
              </Link>

              <Link
                href="/ngo/causes"
                className={`text-sm px-4 py-3 text-primaryText font-semibold rounded-lg hover:bg-primary hover:text-white ${
                  pathname === "/ngo/causes" && "bg-primary/95 text-white font-bold"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <HandHeart size={20} />
                  <p>{nomenclature.ACTIVE_CAUSES}</p>
                </div>
              </Link>

              <Link
                href="/ngo/donation-history"
                className={`text-sm px-4 py-3 text-primaryText font-semibold rounded-lg hover:bg-primary hover:text-white ${
                  pathname === "/ngo/donation-history" &&
                  "bg-primary/95 text-white font-bold"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <History size={20} />
                  <p>{nomenclature.DONATION_HISTORY}</p>
                </div>
              </Link>
              <Link
                href="/ngo/withdraw"
                className={`text-sm px-4 py-3 text-primaryText font-semibold rounded-lg hover:bg-primary hover:text-white ${
                  pathname === "/ngo/withdraw" &&
                  "bg-primary/95 text-white font-bold"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Coins size={20} />
                  <p>{nomenclature.WITHDRAW_FUNDS}</p>
                </div>
              </Link>
            </div>
          </SidebarGroup>
        ) : (
          <SidebarGroup>
            <div className="flex flex-col items-center gap-6">
              <Link
                href="/"
                className={`text-sm hover:underline underline-offset-8 ${
                  pathname === "/" &&
                  "underline decoration-primary decoration-3"
                }`}
              >
                {nomenclature.HOME}
              </Link>
              <Link
                href="/explore"
                className={`text-sm hover:underline underline-offset-8 ${
                  pathname === "/explore" &&
                  "underline decoration-primary decoration-3"
                }`}
              >
                {nomenclature.EXPLORE_CAMPAIGNS}
              </Link>

              <Link
                href="/about"
                className={`text-sm hover:underline underline-offset-8 ${
                  pathname === "/about" &&
                  "underline decoration-primary decoration-3"
                }`}
              >
                {nomenclature.ABOUT_US}
              </Link>
            </div>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
