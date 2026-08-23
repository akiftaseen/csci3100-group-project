import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'collectionapi.metmuseum.org',
        pathname: '/api/collection/v1/iiif/**',
      },
    ],
  },
}

export default nextConfig
