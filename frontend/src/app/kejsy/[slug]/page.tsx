import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Anchor, Breadcrumbs, Text, Title } from '@mantine/core';
import { CaseGallery } from '@/components/case-gallery';
import { getCase } from '@/lib/api/server';
import type { CaseStudy } from '@/lib/api/types';
import styles from './page.module.css';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const item = await getCase((await params).slug);
    return {
      title: { absolute: item.seo.title },
      description: item.seo.description,
      alternates: { canonical: `/kejsy/${item.slug}` },
      openGraph: { type: 'article', locale: 'ru_RU', siteName: 'SedMiTrans', title: item.seo.title, description: item.seo.description, url: `/kejsy/${item.slug}`, images: item.image ? [item.image] : undefined },
      twitter: { card: 'summary_large_image', title: item.seo.title, description: item.seo.description, images: item.image ? [item.image] : undefined },
    };
  } catch {
    return { title: 'Кейс' };
  }
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  let item: CaseStudy;
  try { item = await getCase((await params).slug); } catch { notFound(); }

  return (
    <article>
      <section className={styles.intro}>
        <Breadcrumbs separator="/" className={styles.breadcrumbs}>
          <Anchor href="/" underline="never">Главная</Anchor>
          <Anchor href="/kejsy" underline="never">Кейсы</Anchor>
          <Text c="dimmed">{item.title}</Text>
        </Breadcrumbs>
        <Title order={1} className={styles.title}>{item.title}</Title>
        <Text className={styles.date}>{item.date}</Text>
      </section>
      <section className={styles.body}>
        <div className={styles.copy}>
          <div dangerouslySetInnerHTML={{ __html: item.body }} />
        </div>
        <div className={styles.gallerySection}>
          <Title order={2} className={styles.galleryTitle}>Галерея проекта</Title>
          <CaseGallery images={item.gallery} title={item.title} />
        </div>
      </section>
    </article>
  );
}
