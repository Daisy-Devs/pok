import React from "react";

export default function Footer() {
  return (
    <footer className="bg-background-secondary text-gray-700 py-5 px-5">
      <div className=" flex flex-col">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-4 pb-3">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <h1 className="font-semibold">Proof of Kindness</h1>
            <p className="text-sm text-gray-600">
              Decentralized Custodians of Global Good. Empowering donors with
              privacy and NGOs with seamless crypto liquidity.
            </p>
          </div>

          {/* Ecosystem */}
          <div className="flex flex-col gap-2">
            <h2 className="font-medium">Ecosystem</h2>
            <ul className="flex flex-col gap-1 text-sm text-gray-600">
              <li className="hover:text-black cursor-pointer">WhitePaper</li>
              <li className="hover:text-black cursor-pointer">
                Smart Contracts
              </li>
              <li className="hover:text-black cursor-pointer">
                Network Status
              </li>
              <li className="hover:text-black cursor-pointer">Campaign</li>
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-2">
            <h2 className="font-medium">Legal</h2>
            <ul className="flex flex-col gap-1 text-sm text-gray-600">
              <li className="hover:text-black cursor-pointer">Support</li>
              <li className="hover:text-black cursor-pointer">
                Privacy Policy
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="font-medium">Legal</h2>
            <ul className="flex flex-col gap-1 text-sm text-gray-600">
              <li className="hover:text-black cursor-pointer">Support</li>
              <li className="hover:text-black cursor-pointer">
                Privacy Policy
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
