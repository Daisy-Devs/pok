import { createConfig, http } from "wagmi";
import { sepolia } from 'wagmi/chains'
import { metaMask } from "wagmi/connectors";

export const walletConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  connectors: [metaMask()], //  MetaMask only
});

