import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  transpilePackages: [
    "@satellite-control/shared",
    "@satellite-control/entity-account",
    "@satellite-control/feature-account-auth",
    "@satellite-control/infra",
  ],
  typedRoutes: true,
};

export default withNextIntl(nextConfig);
