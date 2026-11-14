"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TxStatus } from "@/components/TransactionStatus";
import { useCurveWrite } from "@/hooks/useCurveWrite";
import { curveAbi } from "@/contracts/curveAbi";
import { curveAddress } from "@/lib/wagmi";
import { formatEth } from "@/lib/utils";

export function BurnForm({
  tokenId,
  burnPrice,
  onSuccess,
}: {
  tokenId: string;
  burnPrice: bigint;
  onSuccess?: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const { writeContract, reset, hash, status, isBusy, error } = useCurveWrite(onSuccess);

  const handleBurn = () => {
    writeContract({
      address: curveAddress,
      abi: curveAbi,
      functionName: "burn",
      args: [BigInt(tokenId)],
    });
  };

  if (status === "success") {
    return (
      <TxStatus
        status={status}
        hash={hash}
        error={error}
        successMessage={`Burned. ${formatEth(burnPrice)} ETH was returned to your wallet from the reserve.`}
      />
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Burning destroys this piece forever and returns {formatEth(burnPrice)} ETH to you from the reserve.
      </p>
      {!confirming ? (
        <Button variant="outline" onClick={() => setConfirming(true)}>
          Burn this piece
        </Button>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button variant="destructive" onClick={handleBurn} disabled={isBusy}>
            {status === "signing"
              ? "Confirm in wallet…"
              : status === "pending"
                ? "Burning…"
                : `Burn for ${formatEth(burnPrice)} ETH`}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setConfirming(false);
              reset();
            }}
            disabled={isBusy}
          >
            Cancel
          </Button>
        </div>
      )}
      <TxStatus status={status} hash={hash} error={error} />
    </div>
  );
}
