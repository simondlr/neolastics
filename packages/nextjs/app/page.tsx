"use client";

import { useQuery } from "@apollo/client";
import { useAccount, useChainId } from "wagmi";
import { mainnet } from "wagmi/chains";
import { formatEther } from "viem";
import { NEOLASTICS_QUERY, type NeolasticsQueryData } from "@/lib/graphql";
import { RecentNeolastics } from "@/components/RecentNeolastics";
import { Curve } from "@/components/Curve";
import { MintForm } from "@/components/MintForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  const { data, loading, error, refetch } = useQuery<NeolasticsQueryData>(NEOLASTICS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const mintPriceWei = data?.curve?.mintPrice ? BigInt(data.curve.mintPrice) : 0n;
  const onCorrectNetwork = chainId === mainnet.id;

  return (
    <div className="space-y-10 text-justify">
      <section className="space-y-4">
        <p>
          Neolastics is a digital art project that can automatically mint and burn unique, onchain,
          pseudo-randomly generated neoplasticism inspired cubes of collectible digital art.
          An automated liquidity system sets the prices for the cost of minting pieces, and
          the reward for burning pieces.
        </p>
        <p>
          First deployed in December 2020, it&apos;s one of the first ever onchain generative
          art projects (using no other scripts and only using SVG) and the first project
          employing a native bonding curve directly for minting NFTs.
        </p>
      </section>

      <section className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Recently Minted</h1>
        {loading && !data ? (
          <div className="space-y-4">
            <Skeleton className="h-[300px] w-[300px]" />
            <Skeleton className="h-[300px] w-[300px]" />
          </div>
        ) : error ? (
          <p className="text-sm text-destructive">Error loading data: {error.message}</p>
        ) : data ? (
          <RecentNeolastics neolastics={data.neolastics} />
        ) : null}

        <div>
          <a
            href="https://opensea.io/collection/neolastics"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">View The Entire Collection on OpenSea</Button>
          </a>
        </div>
      </section>

      <hr />

      <section className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Mint</h1>
        <p className="text-lg">
          Current Cost: {data ? formatEther(mintPriceWei) : "..."} ETH.
          <br />
          Current Buffer: 0.01 ETH.
        </p>

        {!isConnected ? (
          <p>
            [You are not connected to an Ethereum wallet. You need to have a web3/Ethereum-enabled
            browser and connect it (see top right of the page). Please download the{" "}
            <a
              href="https://metamask.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline decoration-primary/30 underline-offset-4"
            >
              MetaMask Chrome extension
            </a>{" "}
            or open in any Ethereum-compatible browser.]
          </p>
        ) : !onCorrectNetwork ? (
          <p>You are on the wrong network. Please switch to Ethereum mainnet.</p>
        ) : data ? (
          <MintForm mintPrice={mintPriceWei} onSuccess={() => refetch()} />
        ) : null}

        <p>
          NOTE: This code is *unaudited*, but has been running without hiccup since December 2020.
          Caution is still advised unless you want to take the risk.
        </p>

        <h3 className="text-xl font-semibold">Buffer?</h3>
        <p>
          Above and beyond Ethereum computation and storage costs, it currently costs{" "}
          {data ? formatEther(mintPriceWei) : "..."} ETH to mint a new pseudo-randomly,
          on-chain generated Neolastic.
        </p>
        <p>
          However, a buffer of 0.01 ETH is added to the cost ensure that the transaction succeeds
          (because only one neolastic per price point can be minted). If there&apos;s high demand
          (more than one mint transaction per block), a part of the buffer will be used to pay
          the mint cost at the time of confirmation. If no one else buys during the same block,
          you are refunded the entire 0.01 ETH buffer. If more than 10 buys occur in one block,
          the minting transaction can fail (too much demand for the pricing curve based on the
          time the transaction is issued and when it is mined/confirmed), but you will still be
          refunded.
        </p>
      </section>

      <hr />

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold">Collection Details:</h2>
        {data ? <Curve curve={data.curve} /> : <p>Loading curve data...</p>}
      </section>

      <hr />

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold">Algorithmic Pricing Details</h2>
        <p>
          Any collector can pay to mint a randomly generated neolastic piece based on the
          hardcoded price formula (using a bonding curve). If there are more neolastics in
          existence, it becomes more expensive to mint the next neolastic. The price that a
          neolastic collector will receive upon burning their piece is based on how many
          neolastics currently exist. If there are more neolastics in circulation, then the
          floor price of your piece will be higher. 99.5% of each mint cost is stored in a
          communal reserve pool that acts as a buyer if any collector wants to burn their
          neolastic.
        </p>
      </section>

      <hr />

      <section className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold">Technicals</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Code is available here:{" "}
            <a
              href="https://github.com/simondlr/neolastics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline decoration-primary/30 underline-offset-4"
            >
              https://github.com/simondlr/neolastics
            </a>
            .
          </li>
          <li>The price curve is linear, starting at 0.001 ETH for a Neolastic piece. Each new piece increases the price by 0.001 ETH.</li>
          <li>99.5% of the price is kept in the bonding curve reserve. 0.5% goes to the creator.</li>
          <li>There exists 6 colours, with white, black, red, blue, and yellow being equally likely (~20%).</li>
          <li>Green is rare (~1/256).</li>
          <li>The colours are chosen from the first 9 bytes of a pseudo-randomly generated 32 byte hash.</li>
          <li>A maximum of 10,077,696 (6^9) potential combinations can thus exist.</li>
          <li>Duplicates are possible with different hashes.</li>
          <li>
            Every neolastic is stored as its hash on Ethereum and can be auto-generated directly
            from the smart contract into an SVG blob. Thus, if this website goes away, you would
            always be able to own and view your neolastic.
          </li>
        </ul>
      </section>

      <hr />

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold">About The Project:</h2>
        <p>
          In November 2016,{" "}
          <a
            href="https://medium.com/@simondlr/a-software-agent-without-human-control-that-produces-owns-sells-its-own-art-2a232e053329"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline decoration-primary/30 underline-offset-4"
          >
            I proposed the idea of creating an autonomous artist that sells its own generative art
          </a>{" "}
          using an early version of what would become bonding curves. A year later,{" "}
          <a
            href="https://medium.com/@simondlr/lets-summon-an-autonomous-artist-a-bot-that-creates-owns-and-sells-its-own-art-ada1afad086a"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline decoration-primary/30 underline-offset-4"
          >
            I had a more concrete proposal in summoning an autonomous artist that tasked a crowd to curate a generator
          </a>
          . In an attempt to compress these ideas into a simple MVP,{" "}
          <a
            href="https://blog.simondlr.com/maximising-blockchain-collectible-economies"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline decoration-primary/30 underline-offset-4"
          >
            I formulated a new version that directly tied newly minted pieces directly onto a bonding curve
          </a>
          . Since then, NFTs, Generative Art, and Bonding Curves became a mainstay of art and engagement with blockchain technology. 
          Neolastics is thus an early example of protocol art that uses the medium for building a native economy in perpetuity.
          I&apos;m a huge fan of Mondrian&apos;s Neo-Plasticism art and it served as inspiration
          for the kind of generative art I wish to see. Hat tip to{" "}
          <a
            href="https://clovers.network/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline decoration-primary/30 underline-offset-4"
          >
            Clovers.Network
          </a>{" "}
          for pushing the boundaries of a generative art + bonding curve economy.
        </p>
      </section>

      <hr />

      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold">About The Artist:</h2>
          <p>
            I'm a creator at heart. Besides my art practice, I have created games, novels, music, companies, and 
            new economics. In the Ethereum world, I helped create the ERC20 token standard and co-invented and popularised
            token bonding curves. Today, I'm primarily a writer, artist, and technologist.
          </p>
          <p>
            Subscribe to my newsletter!{" "}
            <a href="https://sceneswithsimon.com" className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-colors" target="_blank" rel="noopener noreferrer">sceneswithsimon.com</a>
          </p>
          <p>
            Check my other art projects:{" "}
            <a href="https://home.simondlr.com/art" className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-colors" target="_blank" rel="noopener noreferrer">home.simondlr.com/art</a>
          </p>
          <p>
            Last updated: April 2026
          </p>
      </section>
    </div>
  );
}
