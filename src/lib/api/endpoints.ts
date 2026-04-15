export const ENDPOINTS = {
  donorAuth: {
    google: "/user/google", // sign in/up with google
    signup: "/user/register",
    signin: "/user/login",
    logout: "/user/logout",
    resetPassword: "/user/resetPassword",
    forgotPassword: "/user/forgotPassword",
    validateAuth: "/user/me",
    reconnectWallet: "/wallet/connect",
    donors: "/user/",
    allCampaigns: "/campaign/",
  },
  ngoAuth: {
    registerNgo: "/campaign/orgAndCampaign",
  },
  wallet: {
    walletLogout: "/user/wallet/logout",
    connectWallet: "/wallet/connect",
  },
};
