"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import CampaignCauses from "@/src/features/home/components/CampaignCauses";
import HeroSection from "@/src/features/home/components/HeroSection";
import Philanthropy from "@/src/features/home/components/Philanthropy";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      localStorage.setItem("hasVisited", "true");
      return true;
    }
    return false;
  });
  return (
    <div className="bg-white overflow-x-hidden">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Third Party Cookies Required</AlertDialogTitle>
            <AlertDialogDescription>
              This app uses cookies for secure login. Please make sure to allow
              third-party cookies on your browser for this website.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Okay</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <HeroSection />
      <Philanthropy />
      <CampaignCauses />
    </div>
  );
}
