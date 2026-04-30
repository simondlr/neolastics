"use client";

import Link from "next/link";
import { useState } from "react";

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export function Address({
  address,
  linkToGallery = false,
}: {
  address: string;
  linkToGallery?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const truncated = `${address.slice(0, 6)}…${address.slice(-4)}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // clipboard may be unavailable in insecure contexts; silently no-op
    }
  };

  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-sm align-middle">
      {linkToGallery ? (
        <Link
          href={`/gallery/${address}`}
          className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
          title={address}
        >
          {truncated}
        </Link>
      ) : (
        <span title={address}>{truncated}</span>
      )}
      <button
        type="button"
        onClick={onCopy}
        title={copied ? "Copied" : "Copy address"}
        aria-label={copied ? "Address copied" : "Copy address"}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
      <a
        href={`https://etherscan.io/address/${address}`}
        target="_blank"
        rel="noopener noreferrer"
        title="View on Etherscan"
        aria-label="View on Etherscan"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <ExternalLinkIcon />
      </a>
    </span>
  );
}
