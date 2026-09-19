import type { NextConfig } from 'next';

const media = (process.env.MEDIA_INTERNAL_URL ?? 'http://nginx').replace(/\/$/, '');

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [{ source: '/storage/:path*', destination: `${media}/storage/:path*` }];
  },
  async redirects() {
    return [
      { source: '/uslugi/sbornye-gruzy', destination: '/uslugi/negabaritnie-gruzy', permanent: true },
      { source: '/uslugi/proektnye-gruzy', destination: '/uslugi/opasniye-gruzy', permanent: true },
    ];
  },
};

export default nextConfig;
