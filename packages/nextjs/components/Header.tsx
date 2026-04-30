"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";

export function Header() {
  const { isConnected, address } = useAccount();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-2xl mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/"
            className="font-neolastics font-semibold text-lg hover:opacity-80 transition-opacity truncate"
          >
            <span className="sm:hidden">NEOLASTICS</span>
            <span className="hidden sm:inline">NEOLASTICS</span>
          </Link>
          {isConnected && address && (
            <Link
              href={`/gallery/${address}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
            >
              MY GALLERY
            </Link>
          )}
        </div>
        <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
      </div>
    </header>
  );
}
