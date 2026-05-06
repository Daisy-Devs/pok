import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";
import { Toaster } from "../components/ui/sonner";
import GlobalLoader from "../components/GlobalLoader";
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["800", "700", "600", "400"],
});

export const metadata: Metadata = {
  title: "Proof of Kindness",
  description: "Secure Crypto-Philanthropy",

  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <head></head>
      <body className="min-h-full">
        <Providers>
          {children}
          <GlobalLoader />
        </Providers>
        <Toaster richColors={true} position="top-center" theme="light" />
      </body>
    </html>
  );
}
