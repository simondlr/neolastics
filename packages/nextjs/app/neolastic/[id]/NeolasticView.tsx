"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { mainnet } from "wagmi/chains";
import { Cells } from "@/components/Cells";
import { BurnForm } from "@/components/BurnForm";
import { Address } from "@/components/Address";
import { WallLabel, WallLabelRow } from "@/components/WallLabel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NEOLASTIC_QUERY, type NeolasticQueryData } from "@/lib/graphql";
import { formatUnixDate } from "@/lib/time";
import { formatEth, shortenTokenId } from "@/lib/utils";

function DetailLayout({ art, children }: { art: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
      <div>{art}</div>
      <div className="space-y-8">{children}</div>
    </div>
  );
}

export function NeolasticView({ id }: { id: string }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  // Once burned, the subgraph drops the piece; keep showing the burn result instead of "does not exist".
  const [burned, setBurned] = useState(false);

  const { data, loading, error, refetch } = useQuery<NeolasticQueryData>(NEOLASTIC_QUERY, {
    variables: { id },
    fetchPolicy: "cache-and-network",
    skip: !id,
  });

  const title = <h1 className="text-4xl sm:text-5xl">Neolastic</h1>;
  const eyebrow = <p className="eyebrow font-mono normal-case tracking-normal">{shortenTokenId(id)}</p>;

  if (loading && !data) {
    return (
      <DetailLayout art={<Skeleton className="aspect-square w-full rounded-none" aria-busy="true" />}>
        <div className="space-y-2">
          {eyebrow}
          {title}
        </div>
        <div className="divide-y border-y" aria-busy="true">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between py-3">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-28" />
            </div>
          ))}
        </div>
      </DetailLayout>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">Error loading neolastic: {error.message}</p>;
  }

  const neolastic = data?.neolastic;
  const burnPriceWei = data ? BigInt(data.curve.burnPrice) : 0n;

  if (!neolastic && !burned) {
    return (
      <div className="space-y-4">
        {title}
        <p className="text-muted-foreground">
          This neolastic does not exist.{" "}
          <Link href="/" className="gallery-link">
            Back to the collection →
          </Link>
        </p>
      </div>
    );
  }

  const isOwner =
    !!neolastic && isConnected && address !== undefined && address.toLowerCase() === neolastic.owner.id.toLowerCase();
  const onCorrectNetwork = chainId === mainnet.id;

  return (
    <DetailLayout art={<Cells tokenId={id} />}>
      <div className="space-y-2">
        {eyebrow}
        {title}
      </div>

      {neolastic && (
        <WallLabel>
          <WallLabelRow label="Owner">
            <Address address={neolastic.owner.id} linkToGallery />
          </WallLabelRow>
          <WallLabelRow label="Created">{formatUnixDate(neolastic.created)}</WallLabelRow>
          <WallLabelRow label="Mint price">{formatEth(BigInt(neolastic.pricePaid))} ETH</WallLabelRow>
          <WallLabelRow label="Burn reward">{formatEth(burnPriceWei)} ETH</WallLabelRow>
        </WallLabel>
      )}

      {(isOwner || burned) && (
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl">{burned ? "Burned" : "Burn"}</CardTitle>
          </CardHeader>
          <CardContent>
            {!onCorrectNetwork && !burned ? (
              <div className="space-y-3 rounded-md bg-notice p-3 text-sm text-notice-foreground">
                <p>You are on the wrong network to interact with this Neolastic. Please switch to Ethereum mainnet.</p>
                <Button size="sm" onClick={() => switchChain({ chainId: mainnet.id })} disabled={isSwitching}>
                  {isSwitching ? "Switching…" : "Switch to mainnet"}
                </Button>
              </div>
            ) : (
              <BurnForm
                tokenId={id}
                burnPrice={burnPriceWei}
                onSuccess={() => {
                  setBurned(true);
                  refetch();
                }}
              />
            )}
          </CardContent>
        </Card>
      )}
    </DetailLayout>
  );
}
