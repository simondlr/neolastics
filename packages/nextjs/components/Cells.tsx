"use client";

import { useNeolasticSvg } from "@/lib/useNeolasticSvg";
import { Skeleton } from "@/components/ui/skeleton";

export function Cells({ tokenId, className }: { tokenId: string; className?: string }) {
  const { svg, isLoading, error } = useNeolasticSvg(tokenId);

  if (isLoading) {
    return <Skeleton className={`h-[300px] w-[300px] ${className ?? ""}`} />;
  }

  if (error || !svg) {
    return (
      <div
        className={`h-[300px] w-[300px] flex items-center justify-center border border-dashed text-sm text-muted-foreground ${className ?? ""}`}
      >
        Could not load piece from chain.
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`Neolastic ${tokenId.slice(0, 12)}…`}
      className={`cells flex justify-start ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
