"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { ApolloProvider } from "@apollo/client";
import { config } from "@/lib/wagmi";
import { apolloClient } from "@/lib/apollo";

import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

// Matches the gallery palette in globals.css (ink accent, square-ish corners).
const RAINBOWKIT_THEME = lightTheme({
  accentColor: "hsl(30 10% 10%)",
  accentColorForeground: "hsl(40 23% 97%)",
  borderRadius: "small",
  fontStack: "system",
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={RAINBOWKIT_THEME}>
          <ApolloProvider client={apolloClient}>
            {mounted ? children : <div style={{ visibility: "hidden" }}>{children}</div>}
          </ApolloProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
