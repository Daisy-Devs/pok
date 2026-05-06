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
    getCampaignByOrg: "/campaign/org",//campaigns insidde organisation
  },
  donation: {
    getAllDonations: "/donation/",
    getDonationsByCampaign: "/donation/:campaignId",
    getDonationsByDonor: "/donation/user",
    getDonationsByOrg: "/donation/org/history",//to get all donations for campaigns under an org
    getdonationStatus:"/donation/txStatus",//transction status of a donation //in backend we can't get cancelled or failed transtion of donors so in frontend i want to call function and pass the details like {txHash,donor,campaignId,campaignBytes32,amount,token,ngowallet,isAnonymous=false,donorName="Anomymous",userId=null}
  },
  withdrawal: {
    getWithdrawal: "/withdraw",
  },
  documents: {
    uploadCompanyProfileImage: "/cloudinary/profile",
    uploadCampaignImages: "/cloudinary/causeImages",
    uploadSupportingNgoDocuments: "/cloudinary/documents",
    deleteDocument: "/cloudinary/delete",
  },
};
