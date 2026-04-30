"use client";

import dynamic from "next/dynamic";

const Providers = dynamic(
  () => import("@/app/providers").then((m) => m.Providers),
  { ssr: false },
);

export function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
