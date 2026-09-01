import { IconArrowRight, IconPlane, IconShip, IconTrain, IconTruck } from '@tabler/icons-react';
import { Anchor, Stack, Text, Title } from '@mantine/core';
import Image from 'next/image';
import styles from './transport-directions.module.css';

const directions = [
  {
    image: '/images/auto.webp',
    imageAlt: 'Грузовой автомобиль SedMiTrans',
    icon: IconTruck,
    title: 'Автоперевозки',
    description: 'Грузоперевозки автомобильным транспортом из Европы и Азии.',
  },
  {
    image: '/images/train.webp',
    imageAlt: 'Грузовой поезд',
    icon: IconTrain,
    title: 'Железнодорожные перевозки',
    description: 'Надежная доставка грузов железнодорожным транспортом из Китая и стран ЕАЭС',
  },
  {
    image: '/images/plan.webp',
    imageAlt: 'Грузовой самолёт',
    icon: IconPlane,
    title: 'Авиаперевозки',
    description: 'Быстрая доставка грузов из/в любую точку мира',
  },
  {
    image: '/images/ship.webp',
    imageAlt: 'Контейнеровоз',
    icon: IconShip,
    title: 'Мультимодальные перевозки',
    description: 'Доставка грузов комбинированными видами транспорта(море+жд)',
  },
];

export function TransportDirections() {
  return (
    <section id="services" className={styles.section}>
      <Title order={2} className={styles.heading}>Основные направления перевозок</Title>
      <div className={styles.grid}>
        {directions.map(({ image, imageAlt, icon: Icon, title, description }) => (
          <article key={title} className={styles.card}>
            <div className={styles.imageWrap}>
              <Image src={image} alt={imageAlt} fill sizes="(max-width: 1200px) 50vw, 25vw" className={styles.image} />
              <span className={styles.iconBox}><Icon size={30} stroke={1.7} /></span>
            </div>
            <Stack className={styles.content} gap="sm">
              <Text className={styles.title} fw={600}>{title}</Text>
              <Text className={styles.description}>{description}</Text>
              <Anchor href="#" className={styles.more} underline="never">
                Подробнее <IconArrowRight size={18} stroke={1.8} />
              </Anchor>
            </Stack>
          </article>
        ))}
      </div>
    </section>
  );
}
