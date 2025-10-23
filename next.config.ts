import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable cache components feature flag for Next.js 16
  cacheComponents: true,
  
  // Set correct Turbopack root to silence workspace warning
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
