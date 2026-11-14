import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { ExternalLink } from "@/components/ExternalLink";

const display = localFont({
  src: "../public/fonts/SFNewRepublic.ttf",
  variable: "--font-display",
  display: "swap",
});
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const description =
  "Liquid on-chain generative neo-plastic art. A bonding-curve-backed NFT collection minting and burning Mondrian-inspired SVG cubes on Ethereum.";

export const metadata: Metadata = {
  metadataBase: new URL("https://neolastics.com"),
  title: "Neolastics: Liquid On-Chain Generative Neo-Plastic Art",
  description,
  openGraph: {
    title: "Neolastics: Liquid On-Chain Generative Neo-Plastic Art",
    description,
    type: "website",
    images: [{ url: "/meta.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neolastics: Liquid On-Chain Generative Neo-Plastic Art",
    description,
    images: ["/meta.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <Providers>
          <Header />
          <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
            {children}
          </main>
          <footer className="border-t">
            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-muted-foreground">
              <p className="font-display text-base tracking-wide text-foreground">NEOLASTICS</p>
              <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
                <ExternalLink href="https://github.com/simondlr/neolastics">GitHub</ExternalLink>
                <ExternalLink href="https://opensea.io/collection/neolastics">OpenSea</ExternalLink>
                <ExternalLink href="https://home.simondlr.com/art">Simon de la Rouviere</ExternalLink>
              </nav>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
