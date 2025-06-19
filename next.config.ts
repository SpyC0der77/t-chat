import type { NextConfig } from "next";
import "@/env";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://lh3.googleusercontent.com/a/**')]
  },
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;
