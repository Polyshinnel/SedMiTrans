import { IconAward, IconBox, IconPhoneCall, IconWorld } from '@tabler/icons-react';
import { Group, Stack, Text } from '@mantine/core';
import styles from './stats-section.module.css';

const stats = [
  { icon: IconAward, value: '12+', label: 'лет опыта' },
  { icon: IconBox, value: '1500+', label: 'доставленных грузов' },
  { icon: IconWorld, value: '40+', label: 'стран' },
  { icon: IconPhoneCall, value: '24/7', label: 'поддержка клиентов' },
];

export function StatsSection() {
  return (
    <section className={styles.section} aria-label="Ключевые показатели SedMiTrans">
      {stats.map(({ icon: Icon, value, label }) => (
        <Group key={label} className={styles.stat} gap="20px" wrap="nowrap">
          <Icon className={styles.icon} size={60} stroke={1.6} />
          <Stack gap={2}>
            <Text className={styles.value} fw={700}>{value}</Text>
            <Text className={styles.label}>{label}</Text>
          </Stack>
        </Group>
      ))}
    </section>
  );
}
