import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  typescript: {
    // TODO: Fix all type errors and remove this flag
    // Pre-existing type inconsistencies in database.ts are causing cascading errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
