# Neolastics

Liquid on-chain generative neo-plastic art. Generative NFTs backed by a bonding curve economy, deployed on Ethereum mainnet since December 2020.

https://neolastics.com

## Stack

- **`packages/nextjs`** — Next.js 14 (App Router), TypeScript, Tailwind, wagmi 2 + viem 2 + RainbowKit 2, Apollo Client. SVG art is rendered by deploying the actual ERC721 contract bytecode in-browser via `@ethereumjs/evm` — no mainnet RPC needed for display.
- **`packages/hardhat`** — Hardhat workspace housing the deployed Solidity contracts (immutable, untouched). Used today only for local-fork deploys and the legacy test suite.
- Subgraph lives in [simondlr/neolastics-subgraph](https://github.com/simondlr/neolastics-subgraph). The frontend reads it via The Graph's hosted gateway.

## Quick start

```sh
yarn install

# Frontend env
cp packages/nextjs/.env.example packages/nextjs/.env.local
# Then fill in:
#   NEXT_PUBLIC_GRAPH_API_KEY            (https://thegraph.com/studio)
#   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID (https://cloud.walletconnect.com)

yarn dev          # next dev on http://localhost:3000
yarn build        # production build
yarn lint         # next lint
```

## Hardhat (contracts)

Contracts are deployed and immutable. You only need this if you want to run the existing test suite or deploy a fresh copy locally.

```sh
yarn compile                  # hardhat compile
yarn test_contracts           # uses --network hardhat in-memory (no node needed)
yarn node                     # start a local hardhat node on :8545
yarn deploy_contracts_local   # deploy to localhost
yarn deploy_contracts_mainnet # deploy to mainnet (mnemonic required)
```

## Deploy

Netlify (`netlify.toml` at repo root): Node 20, `yarn build`, `@netlify/plugin-nextjs`. Set `NEXT_PUBLIC_GRAPH_API_KEY` and `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` in the Netlify environment.

## License

MIT.
