import { IconCalculator, IconFileText, IconMapPin, IconRoute, IconSend, IconTruck } from '@tabler/icons-react';
import { Stack, Text, Title } from '@mantine/core';
import styles from './workflow-section.module.css';

const stages = [
  { icon: IconSend, title: 'Запрос', description: 'Оставьте заявку удобным для вас способом' },
  { icon: IconCalculator, title: 'Консультирование, подбор маршрута', description: 'Оптимизируем маршруты и транспорт под специфику вашей ВЭД' },
  { icon: IconRoute, title: 'Подбор маршрута', description: 'Выбираем оптимальный маршрут и транспорт.' },
  { icon: IconFileText, title: 'Оформление обязательств', description: 'Согласование деталей и подписание заявки' },
  { icon: IconTruck, title: 'Доставка вашего груза', description: 'Доставка груза по согласованному маршруту' },
  { icon: IconMapPin, title: 'Доставка получателю', description: 'Доставляем груз точно в срок.' },
];

export function WorkflowSection() {
  return (
    <section className={styles.section} aria-labelledby="workflow-heading">
      <Title id="workflow-heading" order={2} className={styles.heading}>Как мы работаем</Title>
      <div className={styles.stages}>
        {stages.map(({ icon: Icon, title, description }, index) => (
          <Stack key={title} className={styles.stage} align="center" gap="sm">
            <Icon className={styles.icon} size={52} stroke={1.5} />
            <Text className={styles.number}>0{index + 1}</Text>
            <Text className={styles.title} fw={600}>{title}</Text>
            <Text className={styles.description}>{description}</Text>
          </Stack>
        ))}
      </div>
    </section>
  );
}
