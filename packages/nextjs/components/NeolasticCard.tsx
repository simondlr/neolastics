import Link from "next/link";
import { Cells } from "./Cells";
import { Skeleton } from "@/components/ui/skeleton";
import { Address } from "@/components/Address";
import { WallLabel, WallLabelRow } from "@/components/WallLabel";
import { formatUnixDay } from "@/lib/time";
import { formatEth, shortenTokenId } from "@/lib/utils";

// One framed piece with a compact wall label. The artwork and title link to the detail page.
export function NeolasticCard({
  id,
  created,
  pricePaid,
  ownerId,
}: {
  id: string;
  created: string;
  pricePaid?: string;
  ownerId?: string;
}) {
  const href = `/neolastic/${id}`;
  return (
    <article className="space-y-4">
      <Link href={href} className="block group" tabIndex={-1} aria-hidden="true">
        <Cells tokenId={id} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
      </Link>
      <h3 className="font-mono text-sm tracking-normal">
        <Link href={href} className="gallery-link">
          {shortenTokenId(id)}
        </Link>
      </h3>
      <WallLabel>
        {ownerId && (
          <WallLabelRow label="Owner">
            <Address address={ownerId} linkToGallery />
          </WallLabelRow>
        )}
        <WallLabelRow label="Minted">{formatUnixDay(created)}</WallLabelRow>
        {pricePaid && <WallLabelRow label="Paid">{formatEth(BigInt(pricePaid))} ETH</WallLabelRow>}
      </WallLabel>
    </article>
  );
}

export function NeolasticCardSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true">
      <Skeleton className="aspect-square w-full rounded-none" />
      <Skeleton className="h-4 w-24" />
      <div className="divide-y border-y">
        {[1, 2].map((i) => (
          <div key={i} className="flex justify-between py-3">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function NeolasticGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}
