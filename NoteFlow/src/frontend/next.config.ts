import type { NextConfig } from "next";
import path from "node:path";
import { config as loadEnv } from "dotenv";

// Local / non-Vercel: reuse `src/backend/.env` so Next API routes see MONGODB_URI + JWT without duplicating in frontend/.env.local
if (!process.env.VERCEL) {
  loadEnv({ path: path.resolve(process.cwd(), "../backend/.env") });
}

/** Notes + auth are Next Route Handlers. Proxy favorites/users to Express when BACKEND_PROXY_ORIGIN is set. */
const fromEnv = process.env.BACKEND_PROXY_ORIGIN?.trim().replace(/\/$/, "") ?? "";
const backendOrigin =
  fromEnv || (process.env.VERCEL ? "" : "http://localhost:5000");

const nextConfig: NextConfig = {
  typedRoutes: false,
  async rewrites() {
    if (!backendOrigin) return [];
    return [
      { source: "/api/favorites", destination: `${backendOrigin}/api/favorites` },
      { source: "/api/favorites/:path*", destination: `${backendOrigin}/api/favorites/:path*` },
      { source: "/api/users", destination: `${backendOrigin}/api/users` },
      { source: "/api/users/:path*", destination: `${backendOrigin}/api/users/:path*` },
    ];
  },
};

export default nextConfig;
