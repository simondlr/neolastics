import Link from "next/link";
import { Cells } from "./Cells";
import { Button } from "@/components/ui/button";
import { Address } from "@/components/Address";
import { formatUnixDate } from "@/lib/time";
import type { GalleryQueryData } from "@/lib/graphql";

export function Gallery({
  ownerId,
  collector,
}: {
  ownerId: string;
  collector: GalleryQueryData["collector"];
}) {
  if (!collector || collector.neolastics.length === 0) {
    return <p>There&apos;s nothing here.</p>;
  }

  return (
    <div className="space-y-8">
      {collector.neolastics.map(({ id, created }) => (
        <div key={id} className="text-left space-y-2">
          <Cells tokenId={id} />
          <p className="text-sm">Owner: <Address address={ownerId} /></p>
          <p className="text-sm text-muted-foreground">
            Created: {formatUnixDate(created)}
          </p>
          <br />
          <Link href={`/neolastic/${id}`}>
            <Button>VIEW + INTERACT WITH PIECE</Button>
          </Link>
        </div>
      ))}
    </div>
  );
}
