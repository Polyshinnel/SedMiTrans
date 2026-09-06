import type { Metadata } from 'next';
import { Anchor, Breadcrumbs, Text, Title } from '@mantine/core';
import { CasesGrid } from '@/components/cases-grid';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Кейсы',
  description: 'Примеры логистических решений SedMiTrans для бизнеса.',
};

export default function CasesPage() {
  return (
    <>
      <section className={styles.intro}>
        <Breadcrumbs separator="/" className={styles.breadcrumbs}>
          <Anchor href="/" underline="never">Главная</Anchor>
          <Text c="dimmed">Кейсы</Text>
        </Breadcrumbs>
        <Title order={1} className={styles.title}>Кейсы</Title>
      </section>
      <CasesGrid />
    </>
  );
}
