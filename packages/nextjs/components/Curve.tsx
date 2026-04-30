import { formatEther } from "viem";
import type { CurveData } from "@/lib/graphql";

export function Curve({ curve }: { curve: CurveData }) {
  return (
    <div className="space-y-1 text-sm sm:text-base">
      <p>
        Currently, there are <strong>{curve.totalSupply}</strong> Neolastics in circulation.
      </p>
      <p>The reserve pool is currently {formatEther(BigInt(curve.reserve))} ETH.</p>
      <p>Current Minting Cost {formatEther(BigInt(curve.mintPrice))} ETH.</p>
      <p>Current Burning Reward {formatEther(BigInt(curve.burnPrice))} ETH.</p>
      <p>Total Ever Minted: {curve.totalEverMinted}.</p>
      <p>Total Ever Paid: {formatEther(BigInt(curve.totalEverPaid))} ETH.</p>
    </div>
  );
}
