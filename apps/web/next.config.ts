import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@satellite-control/shared",
    "@satellite-control/entity-account",
    "@satellite-control/feature-account-auth",
    "@satellite-control/infra",
  ],
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
