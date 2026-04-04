export default function HeroSection() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-10 items-center">

        {/* LEFT CONTENT */}
        <div className="space-y-6">

          {/* BADGE */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-xs font-medium">
            SOC2 Type II Certified Security
          </div>

          {/* HEADING */}
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-gray-900">
            Anonymity-
            <br />
            Powered{" "}
            <span className="text-indigo-600">Crypto Donations</span>{" "}
            for
            <br />
            Global Good
          </h1>

          {/* DESCRIPTION */}
          <p className="text-gray-500 max-w-lg">
            The first decentralized custodian platform enabling secure,
            private, and verifiable crypto contributions to vetted NGOs
            worldwide with near-zero fees.
          </p>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <button className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium shadow-md hover:bg-indigo-700 transition">
              Start Donating
            </button>

            <button className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition">
              Register as NGO
            </button>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="flex justify-center lg:justify-end">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm relative">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
              <p className="font-medium text-gray-700">Real-time Impact</p>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                ● LIVE
              </span>
            </div>

            {/* LIST */}
            <div className="space-y-3">

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div>
                  <p className="text-xs text-gray-500">Anonymous Donor</p>
                  <p className="font-semibold">2.5 ETH</p>
                </div>
                <span className="text-xs text-gray-400">2m ago</span>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div>
                  <p className="text-xs text-gray-500">Reforest Africa</p>
                  <p className="font-semibold">14,200 USDC</p>
                </div>
                <span className="text-xs text-gray-400">5m ago</span>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div>
                  <p className="text-xs text-gray-500">CleanWater Project</p>
                  <p className="font-semibold">0.8 BTC</p>
                </div>
                <span className="text-xs text-gray-400">12m ago</span>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="my-4 h-px bg-gray-200" />

            {/* FOOTER */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-400">TOTAL CONTRIBUTED</p>
                <p className="text-xl font-bold">$42,891,044</p>
              </div>
              <p className="text-green-500 text-sm font-medium">+12.4%</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}