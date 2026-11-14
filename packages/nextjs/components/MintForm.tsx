"use client";

import Link from "next/link";
import { decodeEventLog, parseEther } from "viem";
import { Button } from "@/components/ui/button";
import { TxStatus } from "@/components/TransactionStatus";
import { useCurveWrite } from "@/hooks/useCurveWrite";
import { curveAbi } from "@/contracts/curveAbi";
import { curveAddress } from "@/lib/wagmi";
import type { TransactionReceipt } from "viem";

export const BUFFER_WEI = parseEther("0.01");

// The tokenId of the piece minted in this receipt, read from the curve's Minted event.
function mintedTokenId(receipt?: TransactionReceipt): string | undefined {
  for (const log of receipt?.logs ?? []) {
    if (log.address.toLowerCase() !== curveAddress.toLowerCase()) continue;
    try {
      const event = decodeEventLog({ abi: curveAbi, data: log.data, topics: log.topics });
      if (event.eventName === "Minted") return event.args.tokenId.toString();
    } catch {
      // not a curve event we know
    }
  }
  return undefined;
}

export function MintForm({
  mintPrice,
  onSuccess,
}: {
  mintPrice: bigint;
  onSuccess?: () => void;
}) {
  const { writeContract, hash, receipt, status, isBusy, error } = useCurveWrite(onSuccess);
  const newTokenId = status === "success" ? mintedTokenId(receipt) : undefined;

  const handleMint = () => {
    writeContract({
      address: curveAddress,
      abi: curveAbi,
      functionName: "mint",
      value: mintPrice + BUFFER_WEI,
    });
  };

  return (
    <div className="space-y-3">
      <Button size="lg" className="w-full sm:w-auto" onClick={handleMint} disabled={isBusy || mintPrice === 0n}>
        {status === "signing" ? "Confirm in wallet…" : status === "pending" ? "Minting…" : "Mint a Neolastic"}
      </Button>
      <TxStatus
        status={status}
        hash={hash}
        error={error}
        successMessage={
          newTokenId ? (
            <>
              Minted!{" "}
              <Link href={`/neolastic/${newTokenId}`} className="gallery-link">
                View your new Neolastic →
              </Link>
            </>
          ) : (
            "Minted! New piece appearing shortly."
          )
        }
      />
    </div>
  );
}
