import type { MetadataRoute } from 'next';
import { getCases } from '@/lib/api/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:28180';
  const firstPage = await getCases(1, 100);
  return [
    { url, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${url}/uslugi`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${url}/kejsy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...firstPage.data.map((item) => ({ url: `${url}/kejsy/${item.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 })),
    { url: `${url}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${url}/uslugi/avtoperevozki`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${url}/uslugi/zheleznodorozhnye-perevozki`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${url}/uslugi/aviaperevozki`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${url}/uslugi/multimodalnye-perevozki`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${url}/uslugi/negabaritnie-gruzy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${url}/uslugi/opasniye-gruzy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${url}/uslugi/tamozhennoe-oformlenie`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${url}/uslugi/strahovanie-gruzov`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${url}/uslugi/skladskaya-logistika`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${url}/uslugi/konsultirovanie-po-voprosam-ved`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];
}
