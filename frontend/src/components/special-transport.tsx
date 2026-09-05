import { IconArrowRight } from '@tabler/icons-react';
import { Anchor, Stack, Text, Title } from '@mantine/core';
import styles from './special-transport.module.css';

const specialTransports = [
  {
    image: '/images/negabarit.webp',
    title: 'Сборные грузы',
    description: 'Перевозка промышленного оборудования, строительной техники, крупных конструкций и других нестандартных грузов.',
    href: '/uslugi/sbornye-gruzy',
  },
  {
    image: '/images/danger.webp',
    title: 'Проектные грузы',
    description: 'Организация перевозки опасных грузов с соблюдением международных требований и всех необходимых мер безопасности.',
    href: '/uslugi/proektnye-gruzy',
  },
];

export function SpecialTransport() {
  return (
    <section id="special-transportation" className={styles.section}>
      <Title order={2} className={styles.heading}>Специальные перевозки</Title>
      <div className={styles.grid}>
        {specialTransports.map(({ image, title, description, href }) => (
          <article key={title} className={styles.card} style={{ backgroundImage: `url(${image})` }}>
            <div className={styles.overlay} />
            <Stack className={styles.content} gap="md">
              <Text className={styles.title} fw={600}>{title}</Text>
              <Text className={styles.description}>{description}</Text>
              <Anchor href={href} className={styles.more} underline="never">
                Подробнее <IconArrowRight size={18} stroke={1.8} />
              </Anchor>
            </Stack>
          </article>
        ))}
      </div>
    </section>
  );
}
