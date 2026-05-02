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
import { Coins, HandHeart, History, LayoutPanelTop, Plus } from "lucide-react";
import { useAppSelector } from "../store/store";
import { selectUser } from "../store/services/selectors/authSelectors";
import { Button } from "./ui/button";
import Image from "next/image";

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
          <SidebarGroup className="flex flex-col justify-between h-full">
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
            <div className="flex flex-col space-x-3 items-center">
            <Link
              href="/ngo/new-cause">
                <Button text={nomenclature.POST_A_CAUSE}
                leftIcon={<Plus size={20}/>}
                />
              </Link>
              <div className="bg-white flex p-3 rounded-lg w-9/10 my-5">
                <Image className="w-10 h-10 rounded-full" quality={90} loading="eager" src="https://images.unsplash.com/photo-1777153200096-f68a98d12fa4?q=80&w=1157&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="NGO profile image" width={500} height={500}/>
                <div className="flex flex-col ml-3">
                  <span className="font-semibold text-secondaryText text-sm">{'Global Relief NGO'}</span>
                  <span className="text-xs">{'Verified Partner'}</span>
                </div>
              </div>
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
