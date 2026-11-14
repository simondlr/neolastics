import { NeolasticCard, NeolasticGrid } from "./NeolasticCard";
import type { NeolasticListItem } from "@/lib/graphql";

export function RecentNeolastics({ neolastics }: { neolastics: NeolasticListItem[] }) {
  if (neolastics.length === 0) {
    return <p className="text-sm text-muted-foreground">No neolastics yet.</p>;
  }

  return (
    <NeolasticGrid>
      {neolastics.map(({ id, created, pricePaid, owner }) => (
        <NeolasticCard key={id} id={id} created={created} pricePaid={pricePaid} ownerId={owner.id} />
      ))}
    </NeolasticGrid>
  );
}
