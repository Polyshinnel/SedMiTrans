import { Button, Group, Stack, Text, Title } from '@mantine/core';
import type { Metadata } from 'next';
import styles from './not-found.module.css';

export const metadata: Metadata = { title: 'Страница не найдена', robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <section className={styles.hero} aria-labelledby="not-found-title">
      <div className={styles.overlay} />
      <div className={styles.content}>
        <Stack gap="md" maw={560}>
          <Title id="not-found-title" order={1} className={styles.title}>Страница не найдена</Title>
          <Text className={styles.description}>Похоже, маршрут изменился или такой страницы больше нет. Вернитесь на главную или выберите нужную услугу.</Text>
          <Group gap="md" mt="md">
            <Button component="a" href="/" color="brandOrange" size="lg">На главную</Button>
            <Button component="a" href="/uslugi" variant="outline" color="white" size="lg">К услугам</Button>
          </Group>
        </Stack>
      </div>
    </section>
  );
}
