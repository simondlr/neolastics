import Link from "next/link";
import { Cells } from "./Cells";
import { Button } from "@/components/ui/button";
import { Address } from "@/components/Address";
import { formatUnixDate } from "@/lib/time";
import type { NeolasticListItem } from "@/lib/graphql";

export function RecentNeolastics({ neolastics }: { neolastics: NeolasticListItem[] }) {
  if (neolastics.length === 0) {
    return <p className="text-sm text-muted-foreground">No neolastics yet.</p>;
  }

  return (
    <div className="space-y-8">
      {neolastics.map(({ id, created, owner }) => (
        <div key={id} className="text-left space-y-2">
          <Cells tokenId={id} />
          <p className="text-sm">
            Owner: <Address address={owner.id} linkToGallery />
          </p>
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
