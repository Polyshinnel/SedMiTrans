import { IconFileCheck, IconRoute, IconShieldCheck, IconTruck, IconUserCheck, IconWorld } from '@tabler/icons-react';
import { Stack, Text } from '@mantine/core';
import styles from './advantages-section.module.css';

const advantages = [
  {
    icon: IconWorld,
    title: 'Международные перевозки',
    description: 'Доставка грузов по всему миру',
  },
  {
    icon: IconTruck,
    title: 'Все виды транспорта',
    description: 'Авто, ж/д, авиа и морские перевозки',
  },
  {
    icon: IconRoute,
    title: 'Полный цикл логистики',
    description: 'От забора груза до доставки получателю',
  },
  {
    icon: IconFileCheck,
    title: 'Таможенное сопровождение',
    description: 'Быстрое и надежное оформление',
  },
  {
    icon: IconShieldCheck,
    title: 'Страхование грузов',
    description: 'Защита ваших грузов на всех этапах',
  },
  {
    icon: IconUserCheck,
    title: 'Персональный менеджер',
    description: 'Индивидуальный подход к каждому клиенту',
  },
];

export function AdvantagesSection() {
  return (
    <section className={styles.section} aria-label="Преимущества SedMiTrans">
      <div className={styles.grid}>
        {advantages.map(({ icon: Icon, title, description }) => (
          <Stack key={title} className={styles.card} gap="sm">
            <Icon className={styles.icon} size={52} stroke={1.6} />
            <Text className={styles.title} fw={600}>{title}</Text>
            <Text className={styles.description}>{description}</Text>
          </Stack>
        ))}
      </div>
    </section>
  );
}
