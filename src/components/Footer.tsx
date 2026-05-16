"use client";

import Link from "next/link";

import { Share2 } from "lucide-react";
import { nomenclature } from "../constants/nomenclature";
import Image from "next/image";

export default function Footer() {
  const handleShare = async () => {
    const shareData = {
      title: "ProofOfKindness",
      text: "Turn your kindness into action.Every crypto counts",
      url: "https://pok-fe.up.railway.app/",
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };
  return (
    <footer className="bg-background-secondary text-gray-600 py-6 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* LEFT: Brand */}
        <div className="text-center sm:text-left">
          <h1 className="font-semibold text-gray-800">
            {nomenclature.PRODUCT_NAME}
          </h1>
          <p className="text-sm">
            © {new Date().getFullYear()} · Daisy Devs🌼 · Demo only — no real
            funds involved
          </p>
        </div>

        {/* RIGHT: Links */}
        <div className="flex flex-wrap justify-center sm:justify-end gap-4 text-sm">
          <Link
            href="https://www.termsfeed.com/live/e91619f2-678f-4951-ba8c-d630867a27fb"
            className="hover:text-black transition"
          >
            Privacy Policy
          </Link>
          <Link
            href="https://www.termsfeed.com/live/7d225c8e-5ed5-4f11-80d9-e0bcdbba0d45"
            className="hover:text-black transition"
          >
            Terms & Conditions
          </Link>
          <Link href="/help" className="hover:text-black transition">
            Help Center
          </Link>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 text-sm">
            <a
              href="https://github.com/Daisy-Devs/pok"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                width={"10"}
                height={"10"}
                alt="insta"
                src={"/svg/github.svg"}
                className="h-5 w-5"
              />
            </a>
            <Share2 size={20} className="cursor-pointer"  onClick={handleShare} />
          </div>
        </div>
      </div>
    </footer>
  );
}
