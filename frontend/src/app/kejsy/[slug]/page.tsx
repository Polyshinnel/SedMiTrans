import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Anchor, Breadcrumbs, Text, Title } from '@mantine/core';
import { CaseGallery } from '@/components/case-gallery';
import { cases, getCase } from '@/components/cases-data';
import styles from './page.module.css';

export function generateStaticParams() { return cases.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const item = getCase((await params).slug);
  return { title: item?.title ?? 'Кейс', description: item?.excerpt };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const item = getCase((await params).slug);
  if (!item) notFound();

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
          {item.text.map((paragraph) => <Text key={paragraph}>{paragraph}</Text>)}
        </div>
        <div className={styles.gallerySection}>
          <Title order={2} className={styles.galleryTitle}>Галерея проекта</Title>
          <CaseGallery images={item.gallery} title={item.title} />
        </div>
      </section>
    </article>
  );
}
