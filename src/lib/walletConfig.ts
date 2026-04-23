import { createConfig, http } from "wagmi";
import { sepolia } from 'wagmi/chains'
import { metaMask } from "wagmi/connectors";

export const walletConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
  },
  connectors: [metaMask()], //  MetaMask only
});

