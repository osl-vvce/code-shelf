import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      }
    ],
  },
  async redirects() {
    return [
      {
        source: '/members',
        destination: '/',
        permanent: true,
      },
      {
        source: '/projects',
        destination: '/projects/new',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;