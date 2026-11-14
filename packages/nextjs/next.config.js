/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // The OG image reads the display font from disk; make sure serverless bundles include it.
    outputFileTracingIncludes: {
      "/neolastic/[id]/opengraph-image": ["./public/fonts/**"],
    },
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

module.exports = nextConfig;
