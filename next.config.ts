import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // ignora warnings de ESLint no build
  },
};

export default nextConfig;
