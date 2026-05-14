

const DecentralizingTrust = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row bg-background-secondary rounded-3xl py-32 px-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="bg-white rounded-2xl shadow-sm flex flex-col justify-end pl-4 pb-4 min-w-70 aspect-square">
          <p className="text-4xl font-bold text-primary">0%</p>
          <p className="mt-2 text-sm">Unauthorized Data</p>
        </div>

        <div className="bg-primary text-white rounded-2xl shadow-sm flex flex-col justify-end pl-4 pb-4 min-w-70 aspect-square">
          <p className="text-4xl font-bold">100%</p>
          <p className="mt-2 text-sm opacity-90">Transparency</p>
        </div>
      </div>

      <div className="p-8">
        <h2 className="text-4xl font-extrabold text-secondaryText">
          Decentralizing Trust
        </h2>
        <p className="text-lg mt-3">
          Traditional giving is often obscured by layers of bureaucracy.
          ProofOfKindness connects donors directly to causes using smart
          contracts, ensuring that funds are released only when verified
          milestones are achieved.
        </p>
      </div>
    </div>
  );
};

export default DecentralizingTrust;
