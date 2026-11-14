import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatEther } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Human-readable ETH: at most 4 significant decimals, trailing zeros trimmed ("1.25", "0.0042", "<0.0001").
export function formatEth(wei: bigint): string {
  if (wei === 0n) return "0";
  const negative = wei < 0n;
  const abs = negative ? -wei : wei;
  if (abs < 10n ** 14n) return negative ? "-<0.0001" : "<0.0001";

  const [whole, fraction = ""] = formatEther(abs).split(".");
  let decimals: string;
  if (whole !== "0") {
    decimals = fraction.slice(0, 4);
  } else {
    // Keep 4 significant digits after the leading zeros, e.g. 0.000123 -> "0.000123".
    const firstNonZero = fraction.search(/[1-9]/);
    decimals = fraction.slice(0, Math.min(firstNonZero + 4, 18));
  }
  decimals = decimals.replace(/0+$/, "");
  const wholeFormatted = BigInt(whole).toLocaleString("en-US");
  return `${negative ? "-" : ""}${wholeFormatted}${decimals ? `.${decimals}` : ""}`;
}

export function truncateAddress(address?: string): string {
  if (!address) return "Unknown";
  if (!address.startsWith("0x") || address.length < 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

// Token IDs are 32-byte hashes; show them as a short hex string ("0x1a2b…9f0e").
export function shortenTokenId(decimalId: string): string {
  try {
    const hex = "0x" + BigInt(decimalId).toString(16).padStart(64, "0");
    return `${hex.slice(0, 6)}…${hex.slice(-4)}`;
  } catch {
    return decimalId.slice(0, 10);
  }
}
