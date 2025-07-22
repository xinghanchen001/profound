import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  // Optimize images for Docker
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
