import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: false,
  // Temporarily remove these lines
  // outputFileTracingRoot: path.resolve(process.cwd(), "../.."),
  // experimental: {
  //   externalDir: true,
  // },
};

export default nextConfig;