export default function NetworkBanner() {
  return (
    <div className="bg-tertiary p-6 md:p-8 lg:p-10">
      <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
        
        {/* Left Content */}
        <div className="space-y-4 max-w-xl items-center overflow-x-hidden">
          <p className="text-secondary-dark text-md font-extrabold tracking-widest uppercase">
            Network Power
          </p>

          <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold leading-snug text-white max-w-xs">
            Your contributions are multiplied by the power of community
            governance.
          </h2>
        </div>

        {/* Right Stats */}
        <div className="gap-8 md:border-l md:border-slate-700 md:pl-8 flex flex-row">
          
          {/* Stat 1 */}
          <div className="space-y-1">
            <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">
              Global Impact
            </p>
            <p className="text-3xl md:text-4xl font-extrabold text-white">
              120K+
            </p>
            <p className="text-slate-400 text-sm">
              Lives changed
            </p>
          </div>

          {/* Stat 2 */}
          <div className="space-y-1">
            <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">
              On-Chain
            </p>
            <p className="text-3xl md:text-4xl font-extrabold text-secondary-dark">
              100%
            </p>
            <p className="text-slate-400 text-sm">
              Transparency
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}