"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";

export function Header() {
  const { isConnected, address } = useAccount();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      {/* A thin band of Mondrian primaries along the top edge. */}
      <div className="flex h-1" aria-hidden="true">
        <span className="flex-[3] bg-mondrian-red" />
        <span className="flex-1 bg-mondrian-yellow" />
        <span className="flex-[2] bg-mondrian-blue" />
      </div>
      <div className="max-w-5xl mx-auto flex h-14 items-center justify-between gap-4 px-4 sm:px-8">
        <nav aria-label="Main" className="flex items-center gap-4 sm:gap-6 min-w-0">
          <Link
            href="/"
            className="font-display text-lg sm:text-xl tracking-wide hover:opacity-70 transition-opacity"
          >
            NEOLASTICS
          </Link>
          {isConnected && address && (
            <Link
              href={`/gallery/${address}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              My gallery
            </Link>
          )}
        </nav>
        <ConnectButton
          accountStatus={{ smallScreen: "avatar", largeScreen: "address" }}
          chainStatus="icon"
          showBalance={false}
        />
      </div>
    </header>
  );
}
