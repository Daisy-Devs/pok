import React from "react";

export default function Footer() {
  return (
    <footer className="bg-background-secondary text-gray-700 py-5 px-5">
      <div className=" flex flex-col">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-6">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <h1 className="font-semibold">Proof of Kindness</h1>
            <p className="text-sm text-gray-600">
              Decentralized Custodians of Global Good. Empowering donors with
              privacy and NGOs with seamless crypto liquidity.
            </p>
          </div>

          {/* Get Started */}
          <div className="flex flex-col gap-2">
            <h2 className="font-medium">Get Started</h2>
            <ul className="flex flex-col gap-1 text-sm text-gray-600">
              <li className="hover:text-black cursor-pointer">
                Fundraising Solution
              </li>
              <li className="hover:text-black cursor-pointer">Campaign</li>
            </ul>
          </div>

          {/* Give Now */}
          <div className="flex flex-col gap-2">
            <h2 className="font-medium">Give Now</h2>
            <ul className="flex flex-col gap-1 text-sm text-gray-600">
              <li className="hover:text-black cursor-pointer">
                Make a Donation
              </li>
              <li className="hover:text-black cursor-pointer">
                Anomous Donor Service
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-2">
            <h2 className="font-medium">Resources</h2>
            <ul className="flex flex-col gap-1 text-sm text-gray-600">
              <li className="hover:text-black cursor-pointer">
                Resources for Nonprofits
              </li>
              <li className="hover:text-black cursor-pointer">
                Resources for Donors
              </li>
              <li className="hover:text-black cursor-pointer">
                Crypto Staking
              </li>
              <li className="hover:text-black cursor-pointer">
                Developer Resources
              </li>
              <li className="hover:text-black cursor-pointer">
                Cryptocurrency
              </li>
              <li className="hover:text-black cursor-pointer">FAQ</li>
            </ul>
          </div>
          {/* Partnership */}
          <div className="flex flex-col gap-2">
            <h2 className="font-medium">Integration Partners</h2>
            <ul className="flex flex-col gap-1 text-sm text-gray-600">
              <li className="hover:text-black cursor-pointer">
                Crypto Industry Partners
              </li>
              <li className="hover:text-black cursor-pointer">
                Media Partners
              </li>
              <li className="hover:text-black cursor-pointer">
                Partner with Us
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="flex flex-col gap-2">
            <h2 className="font-medium">About</h2>
            <ul className="flex flex-col gap-1 text-sm text-gray-600">
              <li className="hover:text-black cursor-pointer">Events</li>
              <li className="hover:text-black cursor-pointer">Contact</li>
              <li className="hover:text-black cursor-pointer">Security</li>
              <li className="hover:text-black cursor-pointer">
                Supported Countries
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex justify-center items-center border-t pt-4 text-sm text-gray-500 text-center">
          <p>
            © {new Date().getFullYear()} Proof of Kindness. Decentralized
            Custodians of Global Good
          </p>
        </div>
      </div>
    </footer>
  );
}
