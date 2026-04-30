import type { Metadata } from "next";
import { NeolasticView } from "./NeolasticView";
import { shortenTokenId } from "@/lib/format";

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const short = shortenTokenId(params.id);
  return {
    title: `Neolastic ${short} — Neolastics`,
    description: `Neolastic ${short} — a pseudo-random Mondrian-inspired piece minted from an on-chain bonding curve.`,
  };
}

export default function Page({ params }: { params: { id: string } }) {
  return <NeolasticView id={params.id} />;
}
