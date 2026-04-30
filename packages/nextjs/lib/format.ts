export function shortenAddress(addr: string): string {
  if (!addr.startsWith("0x") || addr.length < 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function shortenTokenId(decimalId: string): string {
  try {
    const hex = "0x" + BigInt(decimalId).toString(16).padStart(64, "0");
    return `${hex.slice(0, 6)}…${hex.slice(-4)}`;
  } catch {
    return decimalId.slice(0, 10);
  }
}
