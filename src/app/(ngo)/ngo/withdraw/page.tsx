import React from "react";

const WithdrawFunds = () => {
  return(
  <div>
    <div className="flex flex-col bg-tertiary rounded-3xl p-8">
        <p className="text-secondary-mute font-semibold">Total Available for Withdrawal</p>
        <h1 className="text-white font-extrabold text-4xl">{42.95+" ETH"}</h1>
    </div>
  </div>
  );
};

export default WithdrawFunds;
