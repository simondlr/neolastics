import { cn } from "@/lib/utils";

// A museum-style wall label: small-caps labels with values, separated by hairlines.
export function WallLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <dl className={cn("divide-y border-y text-sm", className)}>{children}</dl>;
}

export function WallLabelRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-2.5">
      <dt className="eyebrow shrink-0">{label}</dt>
      <dd className="text-right min-w-0">{children}</dd>
    </div>
  );
}
