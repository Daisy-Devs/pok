import { contract } from "../config/contract.mjs";

export const setCampaignOnChain = async (job, signer) => {
  try {
    const { campaignIdBytes32, ngoWallet } = job;

    const contractWithSigner = contract.connect(signer);

    const tx = await contractWithSigner.setCampaignOwner(
      campaignIdBytes32,
      ngoWallet
    );

    await tx.wait();

    return {
      txHash: tx.hash,
      campaignIdBytes32
    };
  } catch (error) {
    console.error("Blockchain error:", error);
    throw error;
  }
};