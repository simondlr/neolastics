import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ProvidersWrapper } from "@/components/ProvidersWrapper";
import { Header } from "@/components/Header";

const neolasticsFont = localFont({
  src: "../public/fonts/SFNewRepublic.ttf",
  variable: "--font-neolastics",
  display: "swap",
});

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
    <html lang="en" className={neolasticsFont.variable}>
      <body className="font-sans">
        <ProvidersWrapper>
          <Header />
          <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
            {children}
          </main>
          <footer className="border-t mt-16">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span>Neolastics</span>
              <span className="hidden sm:inline" aria-hidden="true">
                &middot;
              </span>
              <a
                href="https://github.com/simondlr/neolastics"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-colors"
              >
                GitHub
              </a>
              <span className="hidden sm:inline" aria-hidden="true">
                &middot;
              </span>
              <a
                href="https://opensea.io/collection/neolastics"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-colors"
              >
                OpenSea
              </a>
            </div>
          </footer>
        </ProvidersWrapper>
      </body>
    </html>
  );
}
