import type { Metadata } from "next";
import { GalleryView } from "./GalleryView";
import { shortenAddress } from "@/lib/format";

export function generateMetadata({ params }: { params: { ownerId: string } }): Metadata {
  const short = shortenAddress(params.ownerId);
  const title = `Gallery ${short} — Neolastics`;
  const description = `Neolastics owned by ${short}.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function Page({ params }: { params: { ownerId: string } }) {
  return <GalleryView ownerId={params.ownerId} />;
}
