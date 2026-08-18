import { Anchor, Text, Title } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import styles from './about-company.module.css';

export function AboutCompany() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.textPanel}>
        <Title order={2} className={styles.heading}>О компании</Title>
        <Text className={styles.description}>
          SedMiTrans - надежный партнер в сфере международной логистики. Мы предлагаем комплексные решения
          для бизнеса любого масштаба, обеспечивая быструю, безопасную и экономичную доставку грузов по всему миру.
        </Text>
        <Anchor href="#" className={styles.more} underline="never">
          Подробнее о компании <IconArrowRight size={18} stroke={1.8} />
        </Anchor>
      </div>
      <div className={styles.image} role="img" aria-label="Офис SedMiTrans" />
    </section>
  );
}
