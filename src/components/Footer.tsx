"use client" 
import React from "react";
import Link from "next/link";


import { FaInstagram } from "react-icons/fa";
import { Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background-secondary text-gray-600 py-6 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* LEFT: Brand */}
        <div className="text-center sm:text-left">
          <h1 className="font-semibold text-gray-800">Proof of Kindness</h1>
          <p className="text-sm">
            © {new Date().getFullYear()} Built on Ethereum
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
            <FaInstagram size={20} className="cursor-pointer" />
            <Share2 size={20} className="cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
