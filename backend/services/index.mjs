import { startDonationListener } from "./startDonation.mjs";
import { startWithdrawListener } from "./withdrawDonation.mjs";

export const startAllListeners = () => {
  startDonationListener();
  startWithdrawListener();

  console.log("🚀 All listeners started...");
};