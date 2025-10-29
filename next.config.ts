import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', //creates  self contained server that can run in Lambda
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
