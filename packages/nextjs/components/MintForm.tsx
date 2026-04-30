"use client";

import { useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { Button } from "@/components/ui/button";
import { TransactionError } from "@/components/TransactionError";
import { curveAbi } from "@/contracts/curveAbi";
import { curveAddress } from "@/lib/wagmi";

const BUFFER_WEI = parseEther("0.01");

export function MintForm({
  mintPrice,
  onSuccess,
}: {
  mintPrice: bigint;
  onSuccess?: () => void;
}) {
  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess && onSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  const handleMint = () => {
    writeContract({
      address: curveAddress,
      abi: curveAbi,
      functionName: "mint",
      value: mintPrice + BUFFER_WEI,
    });
  };

  return (
    <div className="space-y-2">
      <Button onClick={handleMint} disabled={isPending || isConfirming}>
        {isPending || isConfirming ? "Processing..." : "MINT"}
      </Button>
      {isSuccess && <p className="text-sm text-success">Minted! New piece appearing shortly.</p>}
      <TransactionError error={writeError} />
    </div>
  );
}
