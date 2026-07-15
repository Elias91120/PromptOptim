import type { NextConfig } from "next";

const internalApi =
  process.env.INTERNAL_API_URL ?? "http://prompt-optim-api:8000";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${internalApi}/api/:path*` },
      { source: "/auth/:path*", destination: `${internalApi}/auth/:path*` },
      { source: "/health", destination: `${internalApi}/health` },
    ];
  },
};

export default nextConfig;
