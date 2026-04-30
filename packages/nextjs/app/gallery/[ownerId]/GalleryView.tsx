"use client";

import { useQuery } from "@apollo/client";
import { Gallery } from "@/components/Gallery";
import { Skeleton } from "@/components/ui/skeleton";
import { GALLERY_QUERY, type GalleryQueryData } from "@/lib/graphql";

export function GalleryView({ ownerId }: { ownerId: string }) {
  const normalized = ownerId.toLowerCase();

  const { data, loading, error } = useQuery<GalleryQueryData>(GALLERY_QUERY, {
    variables: { ownerId: normalized },
    fetchPolicy: "cache-and-network",
    skip: !normalized,
  });

  return (
    <div className="space-y-6 text-left">
      <h1 className="text-2xl sm:text-3xl font-bold">Gallery</h1>
      {loading && !data ? (
        <div className="space-y-4">
          <Skeleton className="h-[300px] w-[300px]" />
          <Skeleton className="h-[300px] w-[300px]" />
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">Error loading gallery: {error.message}</p>
      ) : data ? (
        <Gallery ownerId={normalized} collector={data.collector} />
      ) : null}
    </div>
  );
}
