"use client";
import React from "react";
import Link from "next/link";

import { Share2 } from "lucide-react";
import { nomenclature } from "../constants/nomenclature";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-background-secondary text-gray-600 py-6 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* LEFT: Brand */}
        <div className="text-center sm:text-left">
          <h1 className="font-semibold text-gray-800">
            {nomenclature.PRODUCT_NAME}
          </h1>
          <p className="text-sm">
            © {new Date().getFullYear()} · Daisy Devs🌼 · Demo only — no real funds involved
          </p>
        </div>

        {/* RIGHT: Links */}
        <div className="flex flex-wrap justify-center sm:justify-end gap-4 text-sm">
          <Link href="/privacy-policy" className="hover:text-black transition">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-black transition">
            Terms & Services
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
            <Share2 size={20} className="cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
