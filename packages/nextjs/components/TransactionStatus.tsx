import type { ReactNode } from "react";
import { BaseError } from "viem";
import type { TxPhase } from "@/hooks/useCurveWrite";

export function TransactionError({ error }: { error: Error | null }) {
  if (!error) return null;
  let message = "Transaction failed.";
  if (error instanceof BaseError) {
    message = error.name === "UserRejectedRequestError" || error.shortMessage.includes("rejected")
      ? "Transaction was rejected."
      : error.shortMessage;
  } else if (error.message) {
    message = error.message.split("\n")[0];
  }
  return <p className="text-sm text-destructive">{message}</p>;
}

// Progress of a write from useCurveWrite: wallet prompt → pending (Etherscan link) → confirmed / error.
export function TxStatus({
  status,
  hash,
  error,
  successMessage = "Confirmed.",
}: {
  status: TxPhase;
  hash?: `0x${string}`;
  error: Error | null;
  successMessage?: ReactNode;
}) {
  const etherscan = hash && (
    <a href={`https://etherscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="gallery-link">
      View on Etherscan ↗
    </a>
  );

  return (
    <div aria-live="polite" className="text-sm min-h-0 empty:hidden">
      {status === "signing" && <p className="text-muted-foreground">Confirm the transaction in your wallet…</p>}
      {status === "pending" && (
        <p className="text-muted-foreground">
          <span className="inline-block h-2 w-2 mr-2 rounded-full bg-link animate-pulse align-middle" aria-hidden="true" />
          Waiting for confirmation. {etherscan}
        </p>
      )}
      {status === "success" && (
        <p className="text-success">
          {successMessage} {etherscan}
        </p>
      )}
      {status === "error" && <TransactionError error={error} />}
    </div>
  );
}
