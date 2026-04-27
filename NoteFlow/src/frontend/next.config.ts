import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: false,
  experimental: {
    externalDir: true,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
