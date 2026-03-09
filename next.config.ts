import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Required so server-side API routes can use nativefier (a Node module)
  serverExternalPackages: ['nativefier'],

  images: {
    remotePatterns: [
      // Favicon / icon proxies used by the icon-fetcher
      {
        protocol: 'https',
        hostname: 'icons.duckduckgo.com',
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
