import type { Metadata } from "next";
import { NeolasticView } from "./NeolasticView";
import { shortenTokenId } from "@/lib/format";

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const short = shortenTokenId(params.id);
  const title = `Neolastic ${short} — Neolastics`;
  const description = `Neolastic ${short} — a pseudo-random Mondrian-inspired piece minted from an on-chain bonding curve.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      // images: provided by app/neolastic/[id]/opengraph-image.tsx (auto-injected)
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function Page({ params }: { params: { id: string } }) {
  return <NeolasticView id={params.id} />;
}
