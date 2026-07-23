import type { NextConfig } from 'next';

const media = (process.env.MEDIA_INTERNAL_URL ?? 'http://nginx').replace(/\/$/, '');

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [{ source: '/storage/:path*', destination: `${media}/storage/:path*` }];
  },
};

export default nextConfig;
