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
    href: '/uslugi/avtoperevozki',
  },
  {
    image: '/images/train.webp',
    imageAlt: 'Грузовой поезд',
    icon: IconTrain,
    title: 'Железнодорожные перевозки',
    description: 'Надежная доставка грузов железнодорожным транспортом из Китая и стран ЕАЭС',
    href: '/uslugi/zheleznodorozhnye-perevozki',
  },
  {
    image: '/images/plan.webp',
    imageAlt: 'Грузовой самолёт',
    icon: IconPlane,
    title: 'Авиаперевозки',
    description: 'Быстрая доставка грузов из/в любую точку мира',
    href: '/uslugi/aviaperevozki',
  },
  {
    image: '/images/ship.webp',
    imageAlt: 'Контейнеровоз',
    icon: IconShip,
    title: 'Мультимодальные перевозки',
    description: 'Доставка грузов комбинированными видами транспорта(море+жд)',
    href: '/uslugi/multimodalnye-perevozki',
  },
];

export function TransportDirections({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section id="services" className={`${styles.section} ${!showHeading ? styles.pageSection : ''}`}>
      {showHeading && <Title order={2} className={styles.heading}>Основные направления перевозок</Title>}
      <div className={styles.grid}>
        {directions.map(({ image, imageAlt, icon: Icon, title, description, href }) => (
          <article key={title} className={styles.card}>
            <div className={styles.imageWrap}>
              <Anchor href={href} className={styles.imageLink} aria-label={`Перейти к разделу «${title}»`}>
                <Image src={image} alt={imageAlt} fill sizes="(max-width: 1200px) 50vw, 25vw" className={styles.image} />
              </Anchor>
              <span className={styles.iconBox}><Icon size={30} stroke={1.7} /></span>
            </div>
            <Stack className={styles.content} gap="sm">
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
