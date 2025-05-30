import { createCivicAuthPlugin } from "@civic/auth-web3/nextjs"
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: "YOUR CLIENT ID"
});

export default withCivicAuth(nextConfig)
