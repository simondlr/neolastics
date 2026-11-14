"use client";

import { useNeolasticSvg } from "@/lib/useNeolasticSvg";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, shortenTokenId } from "@/lib/utils";

// The contract draws a fixed 300×300 canvas with no viewBox; add one so the piece scales to its frame.
function scalable(svg: string): string {
  return svg.replace("<svg width='300' height='300'>", "<svg viewBox='0 0 300 300' preserveAspectRatio='xMidYMid meet'>");
}

export function Cells({ tokenId, className }: { tokenId: string; className?: string }) {
  const { svg, isLoading, error } = useNeolasticSvg(tokenId);

  if (isLoading) {
    return <Skeleton className={cn("aspect-square w-full rounded-none", className)} aria-busy="true" />;
  }

  if (error || !svg) {
    return (
      <div
        className={cn(
          "aspect-square w-full flex items-center justify-center border border-dashed p-4 text-center text-sm text-muted-foreground",
          className
        )}
      >
        Could not load piece from chain.
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`Neolastic ${shortenTokenId(tokenId)}`}
      className={cn("cells artwork-frame aspect-square", className)}
      dangerouslySetInnerHTML={{ __html: scalable(svg) }}
    />
  );
}
