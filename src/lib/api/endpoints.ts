export const ENDPOINTS = {
  donorAuth: {
    google: "/user/google",
    apple: "/user/apple",
    signup: "/user/register",
    signin: "/user/login",
    logout: "/user/logout",
    resetPassword: "/user/resetPassword",
    forgotPassword: "/user/forgotPassword",
    validateAuth: "/user/me",
    reconnectWallet: "/wallet/connect",
    donors: "/user/",
  },
  ngoAuth: {
    registerNgo: "/campaign/orgAndCampaign",
  },
  wallet: {
    walletLogout: "/wallet/logout",
    walletLogin: "/wallet/login",
    connectWallet: "/wallet/connect",
    disconnectWallet: "/wallet/disconnect",
  },
  campaign: {
    getAllCampaigns: "/campaign/",
    getAllOrganizations: "/campaign/organizations/:organizationId",
  },
  donation: {
    getAllDonations: "/donation/",
    getDonationsByCampaign: "/donation/:campaignId",
    getDonationsByDonor: "/donation/user",
    getAllWithdrawals: "/donation/withdraw",
    getWithdrawalsByCampaign: "/donation/withdraw/:campaignId",
  },
};
