import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: false,
  // Keep tracing inside this repository so Next.js does not walk user-home lockfiles.
  outputFileTracingRoot: path.resolve(process.cwd(), "../.."),
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;          
