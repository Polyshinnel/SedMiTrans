import { Anchor, Pagination, Stack, Text, Title } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import Image from 'next/image';
import type { CaseStudy } from '@/lib/api/types';
import styles from './cases-grid.module.css';

export function CasesGrid({ cases, currentPage, totalPages }: { cases: CaseStudy[]; currentPage: number; totalPages: number }) {
  return (
    <section className={styles.section} aria-label="Список кейсов">
      <div className={styles.grid}>
        {cases.map((item) => (
          <article key={item.slug} className={styles.card}>
            <Anchor href={`/kejsy/${item.slug}`} className={styles.imageLink} aria-label={`Открыть кейс «${item.title}»`}>
              {item.image && <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className={styles.image} />}
            </Anchor>
            <Stack className={styles.content} gap="xs">
              <Text className={styles.date}>{item.date}</Text>
              <Title order={2} className={styles.title}>{item.title}</Title>
              <Text className={styles.excerpt}>{item.excerpt}</Text>
              <Anchor href={`/kejsy/${item.slug}`} className={styles.more} underline="never">Подробнее <IconArrowRight size={18} stroke={1.8} /></Anchor>
            </Stack>
          </article>
        ))}
      </div>
      {totalPages > 1 && <Pagination total={totalPages} value={currentPage} siblings={0} boundaries={2} getItemProps={(page) => ({ component: Anchor, href: `/kejsy?page=${page}` })} className={styles.pagination} color="brandOrange" aria-label="Пагинация кейсов" />}
    </section>
  );
}
