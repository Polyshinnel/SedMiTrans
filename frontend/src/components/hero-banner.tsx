'use client';

import { Group, Stack, Text, Title } from '@mantine/core';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { CalculationRequestModal } from '@/components/calculation-request-modal';
import styles from './hero-banner.module.css';

export function HeroBanner() {
  return (
    <section aria-label="Международные грузоперевозки">
      <Swiper modules={[Pagination]} pagination={{ clickable: true }} className={styles.swiper}>
        <SwiperSlide className={styles.slide}>
          <div className={styles.overlay} />
          <Stack className={styles.content} gap="xl">
            <Stack gap="md">
              <Title order={1} className={styles.title}>
                Международные грузоперевозки{' '}
                <Text component="span" inherit c="brandOrange.6">по всему миру</Text>
              </Title>
              <Text className={styles.description} c="white">
                Автомобильные, железнодорожные, морские и авиаперевозки. Таможенное оформление,
                страхование, складская логистика и финансовое сопровождение.
              </Text>
            </Stack>
            <Group gap="md">
              <CalculationRequestModal label="Рассчитать стоимость" size="lg" />
            </Group>
          </Stack>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}
