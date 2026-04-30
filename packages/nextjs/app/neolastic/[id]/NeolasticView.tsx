"use client";

import { useQuery } from "@apollo/client";
import { useAccount, useChainId } from "wagmi";
import { mainnet } from "wagmi/chains";
import { formatEther } from "viem";
import { Cells } from "@/components/Cells";
import { BurnForm } from "@/components/BurnForm";
import { Address } from "@/components/Address";
import { Skeleton } from "@/components/ui/skeleton";
import { NEOLASTIC_QUERY, type NeolasticQueryData } from "@/lib/graphql";
import { formatUnixDate } from "@/lib/time";

export function NeolasticView({ id }: { id: string }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const { data, loading, error, refetch } = useQuery<NeolasticQueryData>(NEOLASTIC_QUERY, {
    variables: { id },
    fetchPolicy: "cache-and-network",
    skip: !id,
  });

  if (loading && !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[300px] w-[300px]" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">Error loading neolastic: {error.message}</p>;
  }

  if (!data?.neolastic) {
    return <p>This neolastic does not exist.</p>;
  }

  const { neolastic } = data;
  const burnPriceWei = BigInt(data.curve.burnPrice);
  const isOwner =
    isConnected &&
    address !== undefined &&
    address.toLowerCase() === neolastic.owner.id.toLowerCase();
  const onCorrectNetwork = chainId === mainnet.id;

  return (
    <div className="space-y-6 text-left">
      <Cells tokenId={neolastic.id} />

      <div className="space-y-1 text-sm sm:text-base">
        <p>
          Owner: <Address address={neolastic.owner.id} linkToGallery />
        </p>
        <p>Created on: {formatUnixDate(neolastic.created)}</p>
        <p>Mint Price: {formatEther(BigInt(neolastic.pricePaid))} ETH</p>
      </div>

      {isConnected && !onCorrectNetwork && (
        <p>You are on the wrong network to interact with this Neolastic. Please switch to Ethereum mainnet.</p>
      )}

      {isConnected && onCorrectNetwork && isOwner && (
        <BurnForm tokenId={neolastic.id} burnPrice={burnPriceWei} onSuccess={() => refetch()} />
      )}
    </div>
  );
}
