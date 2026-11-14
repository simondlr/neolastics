"use client";

import { useEffect, useRef } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export type TxPhase = "idle" | "signing" | "pending" | "success" | "error";

// Wraps a contract write + receipt wait, calling onSuccess exactly once per confirmed tx.
export function useCurveWrite(onSuccess?: () => void) {
  const { data: hash, writeContract, isPending, error: writeError, reset } = useWriteContract();
  const { data: receipt, isLoading: isConfirming, isSuccess, error: receiptError } = useWaitForTransactionReceipt({ hash });

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;
  const handledHash = useRef<string>();

  // wagmi reports isSuccess once a receipt arrives, even when the transaction reverted.
  const confirmed = isSuccess && receipt?.status === "success";
  const reverted = isSuccess && receipt?.status === "reverted";

  useEffect(() => {
    if (confirmed && hash && handledHash.current !== hash) {
      handledHash.current = hash;
      onSuccessRef.current?.();
    }
  }, [confirmed, hash]);

  const error = writeError ?? receiptError ?? (reverted ? new Error("Transaction reverted.") : null);
  const status: TxPhase = error
    ? "error"
    : isPending
      ? "signing"
      : isConfirming
        ? "pending"
        : confirmed
          ? "success"
          : "idle";

  return { writeContract, reset, hash, receipt, status, isBusy: isPending || isConfirming, isSuccess: confirmed, error };
}
