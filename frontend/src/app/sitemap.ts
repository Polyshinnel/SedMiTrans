import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:28180';
  return [
    { url, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${url}/avtoperevozki`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${url}/zheleznodorozhnye-perevozki`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${url}/aviaperevozki`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${url}/multimodalnye-perevozki`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${url}/sbornye-gruzy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${url}/proektnye-gruzy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];
}
