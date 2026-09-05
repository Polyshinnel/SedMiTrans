import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:28180';
  return [
    { url, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${url}/uslugi`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${url}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${url}/uslugi/avtoperevozki`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${url}/uslugi/zheleznodorozhnye-perevozki`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${url}/uslugi/aviaperevozki`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${url}/uslugi/multimodalnye-perevozki`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${url}/uslugi/sbornye-gruzy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${url}/uslugi/proektnye-gruzy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];
}
