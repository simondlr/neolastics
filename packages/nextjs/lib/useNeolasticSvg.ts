"use client";

import { useEffect, useState } from "react";

export function useNeolasticSvg(tokenId: string) {
  const [svg, setSvg] = useState<string | undefined>();
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tokenId) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    import("./neolasticEvm")
      .then(({ generateSvg }) => generateSvg(tokenId))
      .then((s) => {
        if (cancelled) return;
        setSvg(s);
        setIsLoading(false);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e : new Error(String(e)));
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tokenId]);

  return { svg, isLoading, error };
}
