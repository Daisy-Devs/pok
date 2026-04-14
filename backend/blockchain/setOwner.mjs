import { ethers } from "ethers";
import { contract } from "../config/contract.mjs";

export const setCampaignOnChain = async (campaignId, ngoWallet, signer) => {
  const contractWithSigner = contract.connect(signer);

  const campaignIdBytes32 =
    ethers.encodeBytes32String(campaignId);

  const tx = await contractWithSigner.setCampaignOwner(
    campaignIdBytes32,
    ngoWallet
  );

  await tx.wait();

  return {
    txHash: tx.hash,
    campaignIdBytes32
  };
};