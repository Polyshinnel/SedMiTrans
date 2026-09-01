import { IconArrowRight, IconPlane, IconShip, IconTrain, IconTruck } from '@tabler/icons-react';
import { Anchor, Group, Text, Title } from '@mantine/core';
import styles from './delivery-advisor.module.css';

const recommendations = [
  { priority: 'Минимальная стоимость', icon: IconTrain, recommendation: 'Железнодорожную перевозку' },
  { priority: 'Максимальная скорость', icon: IconPlane, recommendation: 'Авиаперевозку' },
  { priority: 'Универсальность', icon: IconTruck, recommendation: 'Автоперевозку' },
  { priority: 'Специальная задача', icon: IconShip, recommendation: 'Проектная перевозка' },
];

export function DeliveryAdvisor() {
  return (
    <section className={styles.section} aria-label="Подбор способа доставки">
      <div className={styles.advisor}>
        <Title order={2} className={styles.heading}>Какой способ доставки подойдет вам?</Title>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Если вам важно...</th>
              <th>Мы рекомендуем</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map(({ priority, icon: Icon, recommendation }) => (
              <tr key={priority}>
                <td>{priority}</td>
                <td>
                  <Group gap="sm" wrap="nowrap">
                    <Icon className={styles.transportIcon} size={22} stroke={1.8} />
                    <span>{recommendation}</span>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Text className={styles.consultation} c="white" fw={600}>
          Нужна консультация?{' '}
          <Anchor href="#contacts" className={styles.contactLink} underline="never">
            Свяжитесь с нами <IconArrowRight size={18} stroke={1.8} />
          </Anchor>
        </Text>
      </div>
      <div className={styles.map} style={{ backgroundImage: "url('/images/map.webp')" }}>
        <Title order={2} className={styles.mapTitle}>География перевозок</Title>
      </div>
    </section>
  );
}
