export function TransactionError({ error }: { error: Error | null }) {
  if (!error) return null;
  const message = error.message?.includes("User rejected")
    ? "Transaction was rejected."
    : error.message?.split("\n")[0] || "Transaction failed.";
  return <p className="text-sm text-destructive mt-2">{message}</p>;
}
