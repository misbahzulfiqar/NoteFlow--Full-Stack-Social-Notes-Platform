import type { NextConfig } from "next";

const backendOrigin =
  process.env.BACKEND_PROXY_ORIGIN?.replace(/\/$/, "") ??
  "http://localhost:5000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;