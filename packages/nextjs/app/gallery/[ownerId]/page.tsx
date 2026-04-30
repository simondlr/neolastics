import type { Metadata } from "next";
import { GalleryView } from "./GalleryView";
import { shortenAddress } from "@/lib/format";

export function generateMetadata({ params }: { params: { ownerId: string } }): Metadata {
  const short = shortenAddress(params.ownerId);
  return {
    title: `Gallery ${short} — Neolastics`,
    description: `Neolastics owned by ${short}.`,
  };
}

export default function Page({ params }: { params: { ownerId: string } }) {
  return <GalleryView ownerId={params.ownerId} />;
}
