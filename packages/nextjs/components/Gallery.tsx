import Link from "next/link";
import { NeolasticCard, NeolasticGrid } from "./NeolasticCard";
import type { GalleryQueryData } from "@/lib/graphql";

// The owner is shown once in the page heading, so cards here only show when each piece was minted.
export function Gallery({ collector }: { collector: GalleryQueryData["collector"] }) {
  if (!collector || collector.neolastics.length === 0) {
    return (
      <p className="text-muted-foreground">
        This collector holds no Neolastics.{" "}
        <Link href="/" className="gallery-link">
          Mint one →
        </Link>
      </p>
    );
  }

  return (
    <NeolasticGrid>
      {collector.neolastics.map(({ id, created }) => (
        <NeolasticCard key={id} id={id} created={created} />
      ))}
    </NeolasticGrid>
  );
}
