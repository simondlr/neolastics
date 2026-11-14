"use client";

import Link from "next/link";
import { useQuery } from "@apollo/client";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { mainnet } from "wagmi/chains";
import { NEOLASTICS_QUERY, type NeolasticsQueryData } from "@/lib/graphql";
import { RecentNeolastics } from "@/components/RecentNeolastics";
import { NeolasticCardSkeleton, NeolasticGrid } from "@/components/NeolasticCard";
import { Cells } from "@/components/Cells";
import { MintForm, BUFFER_WEI } from "@/components/MintForm";
import { WallLabel, WallLabelRow } from "@/components/WallLabel";
import { ExternalLink } from "@/components/ExternalLink";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatEth, shortenTokenId } from "@/lib/utils";

// An editorial section: heading in the left column, content in the right.
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t pt-10 md:grid-cols-12 md:gap-8">
      <h2 className="text-2xl sm:text-3xl md:col-span-4">{title}</h2>
      <div className="md:col-span-8">{children}</div>
    </section>
  );
}

function Eth({ wei }: { wei: bigint | undefined }) {
  return <span className="tabular-nums">{wei === undefined ? "…" : `${formatEth(wei)} ETH`}</span>;
}

export default function Home() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const { data, loading, error, refetch } = useQuery<NeolasticsQueryData>(NEOLASTICS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const curve = data?.curve;
  const mintPriceWei = curve ? BigInt(curve.mintPrice) : undefined;
  const onCorrectNetwork = chainId === mainnet.id;
  const [latest, ...recent] = data?.neolastics ?? [];

  return (
    <div className="space-y-20">
      {/* Hero: the latest piece beside the introduction and the mint card. */}
      <section className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
        <figure className="space-y-3">
          {latest ? (
            <Link href={`/neolastic/${latest.id}`} className="block group" aria-label="View the latest Neolastic">
              <Cells tokenId={latest.id} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
            </Link>
          ) : (
            <Skeleton className="aspect-square w-full rounded-none" aria-busy="true" />
          )}
          <figcaption className="eyebrow">
            {latest ? <>Latest mint · {shortenTokenId(latest.id)}</> : "Latest mint"}
          </figcaption>
        </figure>

        <div className="space-y-8">
          <div className="space-y-4">
            <p className="eyebrow">Liquid on-chain generative neo-plastic art</p>
            <h1 className="text-5xl sm:text-6xl">Neolastics</h1>
            <div className="prose-gallery">
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
            </div>
          </div>

          <Card id="mint">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Mint</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <WallLabel>
                <WallLabelRow label="Current cost">
                  <span className="font-display text-xl">
                    <Eth wei={mintPriceWei} />
                  </span>
                </WallLabelRow>
                <WallLabelRow label="Buffer">
                  <Eth wei={BUFFER_WEI} />
                </WallLabelRow>
                <WallLabelRow label="You send">
                  <Eth wei={mintPriceWei === undefined ? undefined : mintPriceWei + BUFFER_WEI} />
                </WallLabelRow>
              </WallLabel>

              {!isConnected ? (
                <p className="rounded-md bg-notice p-3 text-sm text-notice-foreground">
                  [You are not connected to an Ethereum wallet. You need to have a web3/Ethereum-enabled
                  browser and connect it (see top right of the page). Please download the{" "}
                  <ExternalLink href="https://metamask.io">MetaMask Chrome extension</ExternalLink>{" "}
                  or open in any Ethereum-compatible browser.]
                </p>
              ) : !onCorrectNetwork ? (
                <div className="space-y-3 rounded-md bg-notice p-3 text-sm text-notice-foreground">
                  <p>You are on the wrong network. Please switch to Ethereum mainnet.</p>
                  <Button size="sm" onClick={() => switchChain({ chainId: mainnet.id })} disabled={isSwitching}>
                    {isSwitching ? "Switching…" : "Switch to mainnet"}
                  </Button>
                </div>
              ) : (
                <MintForm mintPrice={mintPriceWei ?? 0n} onSuccess={() => refetch()} />
              )}

              <p className="text-xs leading-relaxed text-muted-foreground">
                NOTE: This code is *unaudited*, but has been running without hiccup since December 2020.
                Caution is still advised unless you want to take the risk.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl sm:text-4xl">Recently Minted</h2>
          <a
            href="https://opensea.io/collection/neolastics"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline" })}
          >
            View The Entire Collection on OpenSea ↗
          </a>
        </div>
        {loading && !data ? (
          <NeolasticGrid>
            {[1, 2, 3].map((i) => (
              <NeolasticCardSkeleton key={i} />
            ))}
          </NeolasticGrid>
        ) : error ? (
          <p className="text-sm text-destructive">Error loading data: {error.message}</p>
        ) : data ? (
          <RecentNeolastics neolastics={recent} />
        ) : null}
      </section>

      <Section title="Collection Details">
        {curve ? (
          <WallLabel className="max-w-prose">
            <WallLabelRow label="In circulation">
              <span className="tabular-nums">{curve.totalSupply}</span>
            </WallLabelRow>
            <WallLabelRow label="Reserve pool">
              <Eth wei={BigInt(curve.reserve)} />
            </WallLabelRow>
            <WallLabelRow label="Minting cost">
              <Eth wei={BigInt(curve.mintPrice)} />
            </WallLabelRow>
            <WallLabelRow label="Burning reward">
              <Eth wei={BigInt(curve.burnPrice)} />
            </WallLabelRow>
            <WallLabelRow label="Total ever minted">
              <span className="tabular-nums">{curve.totalEverMinted}</span>
            </WallLabelRow>
            <WallLabelRow label="Total ever paid">
              <Eth wei={BigInt(curve.totalEverPaid)} />
            </WallLabelRow>
          </WallLabel>
        ) : (
          <p className="text-muted-foreground">Loading curve data...</p>
        )}
      </Section>

      <Section title="Buffer?">
        <div className="prose-gallery">
          <p>
            Above and beyond Ethereum computation and storage costs, it currently costs{" "}
            {mintPriceWei !== undefined ? formatEth(mintPriceWei) : "..."} ETH to mint a new pseudo-randomly,
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
        </div>
      </Section>

      <Section title="Algorithmic Pricing Details">
        <div className="prose-gallery">
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
        </div>
      </Section>

      <Section title="Technicals">
        <ul className="prose-gallery list-disc space-y-2 pl-5">
          <li>
            Code is available here:{" "}
            <ExternalLink href="https://github.com/simondlr/neolastics">https://github.com/simondlr/neolastics</ExternalLink>
            .
          </li>
          <li>The price curve is linear, starting at 0.001 ETH for a Neolastic piece. Each new piece increases the price by 0.001 ETH.</li>
          <li>99.5% of the price is kept in the bonding curve reserve. 0.5% goes to the creator.</li>
          <li>There exists 6 colours, with white, black, red, blue, and yellow being equally likely (~20%).</li>
          <li>Green is rare (~1/256).</li>
          <li>The colours are chosen from the first 9 bytes of a pseudo-randomly generated 32 byte hash. 
              This hash can unfortunately be brute-forced by grinding EOA MEV bundles or CREATE2 salts.
          </li>
          <li>A maximum of 10,077,696 (6^9) potential combinations can thus exist.</li>
          <li>Duplicates are possible with different hashes.</li>
          <li>
            Every neolastic is stored as its hash on Ethereum and can be auto-generated directly
            from the smart contract into an SVG blob. Thus, if this website goes away, you would
            always be able to own and view your neolastic.
          </li>
        </ul>
      </Section>

      <Section title="About The Project">
        <div className="prose-gallery">
          <p>
            In November 2016,{" "}
            <ExternalLink href="https://medium.com/@simondlr/a-software-agent-without-human-control-that-produces-owns-sells-its-own-art-2a232e053329">
              I proposed the idea of creating an autonomous artist that sells its own generative art
            </ExternalLink>{" "}
            using an early version of what would become bonding curves. A year later,{" "}
            <ExternalLink href="https://medium.com/@simondlr/lets-summon-an-autonomous-artist-a-bot-that-creates-owns-and-sells-its-own-art-ada1afad086a">
              I had a more concrete proposal in summoning an autonomous artist that tasked a crowd to curate a generator
            </ExternalLink>
            . In an attempt to compress these ideas into a simple MVP,{" "}
            <ExternalLink href="https://blog.simondlr.com/maximising-blockchain-collectible-economies">
              I formulated a new version that directly tied newly minted pieces directly onto a bonding curve
            </ExternalLink>
            . Since then, NFTs, Generative Art, and Bonding Curves became a mainstay of art and engagement with blockchain technology. 
            Neolastics is thus an early example of protocol art that uses the medium for building a native economy in perpetuity.
            I&apos;m a huge fan of Mondrian&apos;s Neo-Plasticism art and it served as inspiration
            for the kind of generative art I wish to see. Hat tip to{" "}
            <ExternalLink href="https://clovers.network/">Clovers.Network</ExternalLink>{" "}
            for pushing the boundaries of a generative art + bonding curve economy.
          </p>
        </div>
      </Section>

      <Section title="About The Artist">
        <div className="prose-gallery">
          <p>
            I&apos;m a creator at heart. Besides my art practice, I have created games, novels, music, companies, and 
            new economics. In the Ethereum world, I helped create the ERC20 token standard and co-invented and popularised
            token bonding curves. Today, I&apos;m primarily a writer, artist, and technologist.
          </p>
          <p>
            Subscribe to my newsletter!{" "}
            <ExternalLink href="https://sceneswithsimon.com">sceneswithsimon.com</ExternalLink>
          </p>
          <p>
            Check my other art projects:{" "}
            <ExternalLink href="https://home.simondlr.com/art">home.simondlr.com/art</ExternalLink>
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: November 2026
          </p>
        </div>
      </Section>
    </div>
  );
}
