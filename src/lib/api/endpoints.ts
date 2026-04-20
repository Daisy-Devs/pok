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
  campaign:{
    getAllCampaigns: "/campaign/",
  },
  documents: {
    uploadCompanyProfileImage: "/cloudinary/profile",
    uploadCampaignImages: "/cloudinary/causeImages",
    uploadSupportingNgoDocuments: "/cloudinary/documents",
  },
};
