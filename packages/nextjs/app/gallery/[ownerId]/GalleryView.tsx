"use client";

import { useQuery } from "@apollo/client";
import { isAddress } from "viem";
import { Gallery } from "@/components/Gallery";
import { Address } from "@/components/Address";
import { NeolasticCardSkeleton, NeolasticGrid } from "@/components/NeolasticCard";
import { GALLERY_QUERY, type GalleryQueryData } from "@/lib/graphql";

export function GalleryView({ ownerId }: { ownerId: string }) {
  const normalized = ownerId.toLowerCase();
  const valid = isAddress(normalized);

  const { data, loading, error } = useQuery<GalleryQueryData>(GALLERY_QUERY, {
    variables: { ownerId: normalized },
    fetchPolicy: "cache-and-network",
    skip: !valid,
  });

  const count = data?.collector?.neolastics.length;

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="eyebrow">Collector</p>
        <h1 className="text-4xl sm:text-5xl">Gallery</h1>
        {valid && (
          <p className="text-muted-foreground">
            <Address address={normalized} />
            {count !== undefined && (
              <span className="ml-3 text-sm">
                {count} {count === 1 ? "piece" : "pieces"}
              </span>
            )}
          </p>
        )}
      </header>

      {!valid ? (
        <p className="text-destructive">“{ownerId}” is not a valid Ethereum address.</p>
      ) : loading && !data ? (
        <NeolasticGrid>
          {[1, 2, 3].map((i) => (
            <NeolasticCardSkeleton key={i} />
          ))}
        </NeolasticGrid>
      ) : error ? (
        <p className="text-sm text-destructive">Error loading gallery: {error.message}</p>
      ) : data ? (
        <Gallery collector={data.collector} />
      ) : null}
    </div>
  );
}
