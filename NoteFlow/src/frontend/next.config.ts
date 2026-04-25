import type { NextConfig } from "next";
import path from "node:path";
import { config as loadEnv } from "dotenv";

// Local / non-Vercel: reuse `src/backend/.env` so Next API routes see MONGODB_URI + JWT without duplicating in frontend/.env.local
if (!process.env.VERCEL) {
  loadEnv({ path: path.resolve(process.cwd(), "../backend/.env") });
}

/** Notes/favorites/users stay on Express unless you migrate them to Route Handlers. */
const fromEnv = process.env.BACKEND_PROXY_ORIGIN?.trim().replace(/\/$/, "") ?? "";
const backendOrigin =
  fromEnv || (process.env.VERCEL ? "" : "http://localhost:5000");

const nextConfig: NextConfig = {
  typedRoutes: false,
  async rewrites() {
    if (!backendOrigin) return [];
    // Auth lives in Next.js Route Handlers. Optionally proxy other modules to external Express.
    return [
      { source: "/api/notes", destination: `${backendOrigin}/api/notes` },
      { source: "/api/notes/:path*", destination: `${backendOrigin}/api/notes/:path*` },
      { source: "/api/favorites", destination: `${backendOrigin}/api/favorites` },
      { source: "/api/favorites/:path*", destination: `${backendOrigin}/api/favorites/:path*` },
      { source: "/api/users", destination: `${backendOrigin}/api/users` },
      { source: "/api/users/:path*", destination: `${backendOrigin}/api/users/:path*` },
    ];
  },
};

export default nextConfig;
