import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, hardhat } from "wagmi/chains";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
if (!projectId) {
  throw new Error(
    "Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID. Get one at https://cloud.walletconnect.com and add it to .env.local — see .env.example.",
  );
}

export const config = getDefaultConfig({
  appName: "Neolastics",
  projectId,
  chains: [mainnet, hardhat],
  ssr: true,
});

export const curveAddress = "0x174150478891bdD4EAefaB50FB24B9126F289FA6" as const;
export const artistAddress = "0x0CaCC6104D8Cd9d7b2850b4f35c65C1eCDEECe03" as const;

export const GRAPH_API_URL = `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_API_KEY}/subgraphs/id/99P9iFUCyaiJouugpEjW6LozFrt8kDAcpZPqt7RFzhb7`;
