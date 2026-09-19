import type { Metadata } from 'next';
import { Anchor, Breadcrumbs, Button, Text, Title } from '@mantine/core';
import { CasesGrid } from '@/components/cases-grid';
import styles from './page.module.css';
import { getCases, getSeoPage } from '@/lib/api/server';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> { return buildSeoMetadata(await getSeoPage('cases')); }

export default async function CasesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const pageValue = Number((await searchParams).page ?? '1');
  const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1;
  const result = await getCases(page);

  return (
    <>
      <section className={styles.intro}>
        <Breadcrumbs separator="/" className={styles.breadcrumbs}>
          <Anchor href="/" underline="never">Главная</Anchor>
          <Text c="dimmed">Кейсы</Text>
        </Breadcrumbs>
        <Title order={1} className={styles.title}>Кейсы</Title>
      </section>
      {result.data.length === 0 ? (
        <section className={styles.emptyState} aria-label="Кейсы пока не добавлены">
          <Text className={styles.emptyText}>К сожалению, эта страница пока пуста. Можете ознакомиться с нашими услугами.</Text>
          <Button component="a" href="/uslugi" color="brandOrange" size="lg">Услуги</Button>
        </section>
      ) : (
        <CasesGrid cases={result.data} currentPage={result.meta.current_page} totalPages={result.meta.last_page} />
      )}
    </>
  );
}
