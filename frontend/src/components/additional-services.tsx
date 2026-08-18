import { IconArrowRight, IconBuilding, IconCreditCard, IconFileCheck, IconShieldCheck } from '@tabler/icons-react';
import { Anchor, Group, Stack, Text, Title } from '@mantine/core';
import styles from './additional-services.module.css';

const services = [
  {
    icon: IconFileCheck,
    title: 'Таможенное оформление',
    description: 'Полное сопровождение при растаможке грузов.',
  },
  {
    icon: IconShieldCheck,
    title: 'Страхование грузов',
    description: 'Страхование грузов от всех возможных рисков.',
  },
  {
    icon: IconBuilding,
    title: 'Складская логистика',
    description: 'Предоставление складских услуг в разных странах.',
  },
  {
    icon: IconCreditCard,
    title: 'Финансовые услуги',
    description: 'Консультации и инструменты оплаты за рубежом.',
  },
];

export function AdditionalServices() {
  return (
    <section className={styles.section}>
      <Title order={2} className={styles.heading}>Дополнительные услуги</Title>
      <div className={styles.grid}>
        {services.map(({ icon: Icon, title, description }) => (
          <article key={title} className={styles.card}>
            <Group align="flex-start" gap="lg" wrap="nowrap">
              <Icon className={styles.icon} size={48} stroke={1.6} />
              <Stack gap={6}>
                <Text className={styles.title} fw={600}>{title}</Text>
                <Text className={styles.description}>{description}</Text>
              </Stack>
            </Group>
            <Anchor href="#" className={styles.more} underline="never">
              Подробнее <IconArrowRight size={18} stroke={1.8} />
            </Anchor>
          </article>
        ))}
      </div>
    </section>
  );
}
