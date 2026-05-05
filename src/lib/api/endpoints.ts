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
    profile: "/user/profile",
    updateProfile: "/cloudinary/user/updateProfile",
    deleteProfile: "/cloudinary/user/deleteProfile",
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
    getCampaignById: "/campaign/",
    getAllOrganizations: "/campaign/organizations/:organizationId",
    createCampaign: "/campaign/create",
    getCampaignByOrg:"/campaign/org"
  },
  donation: {
    getAllDonations: "/donation/",
    getDonationsByCampaign: "/donation/:campaignId",
    getDonationsByDonor: "/donation/user",
    getWithdrawal: "/withdraw",
  },
  documents: {
    uploadCompanyProfileImage: "/cloudinary/profile",
    uploadCampaignImages: "/cloudinary/causeImages",
    uploadSupportingNgoDocuments: "/cloudinary/documents",
    deleteDocument: "/cloudinary/delete",
  },
};
