import type { Metadata } from 'next';
import type { SeoPage } from '@/lib/api/types';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:28180';
const ogImage = new URL('/images/og-sedmitrans.jpg', siteUrl).toString();

export function buildSeoMetadata(page: SeoPage, options: { robots?: Metadata['robots'] } = {}): Metadata {
  const url = new URL(page.path, siteUrl).toString();

  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      siteName: 'SedMiTrans',
      title: page.title,
      description: page.description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: page.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [ogImage],
    },
    ...options,
  };
}
