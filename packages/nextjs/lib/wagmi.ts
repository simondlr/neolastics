import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  frameWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { fallback, http } from "wagmi";
import { mainnet, hardhat } from "wagmi/chains";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "";

// Mainnet RPC: WalletConnect's RPC (keyed by the project ID) first, then a public RPC.
// viem's default (eth.merkle.io) rejects browser requests with CORS errors.
// Only used for transaction confirmations; everything else is read from the subgraph.
const PUBLIC_MAINNET_RPC = "https://ethereum-rpc.publicnode.com";
const mainnetTransport = projectId
  ? fallback([http(`https://rpc.walletconnect.org/v1/?chainId=eip155:${mainnet.id}&projectId=${projectId}`), http(PUBLIC_MAINNET_RPC)])
  : http(PUBLIC_MAINNET_RPC);

// RainbowKit wallets that fall back to WalletConnect (MetaMask and Rainbow on mobile, WalletConnect itself)
// throw at config time without a project ID, so without one only wallets that never need it are listed.
const wallets = projectId
  ? [
      {
        groupName: "Popular",
        wallets: [metaMaskWallet, frameWallet, rainbowWallet, coinbaseWallet, walletConnectWallet],
      },
      {
        groupName: "Other",
        wallets: [injectedWallet, safeWallet],
      },
    ]
  : [
      {
        groupName: "Wallets",
        wallets: [injectedWallet, frameWallet, coinbaseWallet, safeWallet],
      },
    ];

export const config = getDefaultConfig({
  appName: "Neolastics",
  projectId,
  wallets,
  chains: process.env.NODE_ENV === "development" ? [mainnet, hardhat] : [mainnet],
  transports: {
    [mainnet.id]: mainnetTransport,
    [hardhat.id]: http(),
  },
  ssr: true,
});

export const curveAddress = "0x174150478891bdD4EAefaB50FB24B9126F289FA6" as const;
export const artistAddress = "0x0CaCC6104D8Cd9d7b2850b4f35c65C1eCDEECe03" as const;

export const GRAPH_API_URL = `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NEXT_PUBLIC_GRAPH_API_KEY}/subgraphs/id/99P9iFUCyaiJouugpEjW6LozFrt8kDAcpZPqt7RFzhb7`;
