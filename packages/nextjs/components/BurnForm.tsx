"use client";

import { useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatEther } from "viem";
import { Button } from "@/components/ui/button";
import { TransactionError } from "@/components/TransactionError";
import { curveAbi } from "@/contracts/curveAbi";
import { curveAddress } from "@/lib/wagmi";

export function BurnForm({
  tokenId,
  burnPrice,
  onSuccess,
}: {
  tokenId: string;
  burnPrice: bigint;
  onSuccess?: () => void;
}) {
  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  const handleBurn = () => {
    writeContract({
      address: curveAddress,
      abi: curveAbi,
      functionName: "burn",
      args: [BigInt(tokenId)],
    });
  };

  return (
    <div className="space-y-2">
      <Button variant="destructive" onClick={handleBurn} disabled={isPending || isConfirming}>
        {isPending || isConfirming ? "Processing..." : "BURN"}
      </Button>
      <p className="text-sm text-muted-foreground">
        You will receive {formatEther(burnPrice)} ETH from the reserve.
      </p>
      {isSuccess && <p className="text-sm text-success">Burn complete.</p>}
      <TransactionError error={writeError} />
    </div>
  );
}
