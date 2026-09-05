import type { Metadata } from 'next';
import { Anchor, Box, Button, Text, Title } from '@mantine/core';
import {
  IconCalendarCheck,
  IconClipboardCheck,
  IconContainer,
  IconMap2,
  IconRoute,
  IconShieldCheck,
  IconShip,
  IconTrain,
  IconTruck,
} from '@tabler/icons-react';
import Image from 'next/image';
import { CalculationRequestModal } from '@/components/calculation-request-modal';
import styles from '../avtoperevozki/page.module.css';

export const metadata: Metadata = {
  title: 'Мультимодальные перевозки | Седьмой Транс',
  description: 'Мультимодальная доставка грузов морским, железнодорожным и автомобильным транспортом.',
};

const transportTypes = [
  { icon: IconShip, title: 'Море + железная дорога', text: 'Экономичная схема для доставки контейнеров из портов Азии и других направлений.' },
  { icon: IconTrain, title: 'Железная дорога + авто', text: 'Связываем станцию и склад получателя, сокращая время и число промежуточных операций.' },
  { icon: IconTruck, title: 'Море + авто', text: 'Организуем вывоз из порта и доставку до двери без лишних согласований с вашей стороны.' },
  { icon: IconContainer, title: 'Контейнерные решения', text: 'Подбираем размер контейнера, маршрут и схему перевалки под специфику вашего груза.' },
];

const advantages = [
  { icon: IconRoute, title: 'Один маршрут — один ответственный', text: 'Координируем всех участников цепочки и остаёмся единой точкой контакта для вас.' },
  { icon: IconMap2, title: 'Гибкая схема доставки', text: 'Сочетаем виды транспорта так, чтобы уложиться в нужные сроки и бюджет.' },
  { icon: IconShieldCheck, title: 'Контроль в точках стыковки', text: 'Сопровождаем перевалку, терминальные операции, документы и дальнейшее движение груза.' },
];

const steps = [
  { icon: IconClipboardCheck, text: 'Получаем маршрут и параметры груза' },
  { icon: IconRoute, text: 'Проектируем схему доставки и рассчитываем ставку' },
  { icon: IconContainer, text: 'Организуем отправку и перевалку на терминалах' },
  { icon: IconShieldCheck, text: 'Контролируем каждый участок до склада получателя' },
];

export default function MultimodalTransportationPage() {
  return (
    <>
      <section className={styles.hero} style={{ backgroundImage: "url('/images/multimodal-hero.webp')" }} aria-labelledby="multimodal-hero-title">
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <Box className={styles.heroBreadcrumbs}>
            <Anchor href="/" underline="never">Главная</Anchor>
            <span aria-hidden="true">/</span>
            <Anchor href="/uslugi" underline="never">Услуги</Anchor>
            <span aria-hidden="true">/</span>
            <Text component="span">Мультимодальные перевозки</Text>
          </Box>
          <Title id="multimodal-hero-title" order={1} className={styles.heroTitle}>
            Мультимодальные перевозки <span>одним маршрутом</span>
          </Title>
          <Text className={styles.heroDescription}>
            Объединяем море, железную дорогу и автомобильную доставку в понятную логистическую цепочку.
            Вы получаете единый расчёт, контроль и одного ответственного за весь путь груза.
          </Text>
          <div className={styles.heroActions}>
            <CalculationRequestModal label="Рассчитать стоимость" size="lg" />
          </div>
        </div>
      </section>

      <section className={styles.intro} aria-labelledby="multimodal-intro-title">
        <div>
          <Text className={styles.eyebrow}>Связанный маршрут</Text>
          <Title id="multimodal-intro-title" order={2} className={styles.sectionTitle}>Когда одного вида транспорта недостаточно</Title>
        </div>
        <div className={styles.introCopy}>
          <Text>Мультимодальная перевозка помогает найти баланс между сроком и стоимостью: длинный участок проходит морем или по железной дороге, а автомобиль доставляет груз до нужной точки.</Text>
          <Text>Мы заранее выстраиваем стыковки, распределяем ответственность и контролируем движение на каждом участке — от порта отправления до склада получателя.</Text>
        </div>
      </section>

      <section className={styles.transportSection} aria-labelledby="transport-title">
        <div className={styles.sectionHeading}>
          <Text className={styles.eyebrow}>Комбинации транспорта</Text>
          <Title id="transport-title" order={2} className={styles.sectionTitle}>Соберём маршрут под вашу поставку</Title>
        </div>
        <div className={styles.transportGrid}>
          {transportTypes.map(({ icon: Icon, title, text }) => (
            <article className={styles.transportCard} key={title}>
              <Icon size={38} stroke={1.55} />
              <Title order={3}>{title}</Title>
              <Text>{text}</Text>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.terminalSection} aria-labelledby="terminal-title">
        <div className={styles.terminalImageWrap}>
          <Image src="/images/multimodal-terminal-port-sunset-20260905.png" alt="Контейнеровоз прибывает в порт на закате" fill sizes="(max-width: 900px) 100vw, 50vw" className={styles.terminalImage} />
          <div className={styles.fact}><strong>Без разрывов маршрута</strong><span>Координируем переход груза между всеми видами транспорта</span></div>
        </div>
        <div className={styles.terminalContent}>
          <Text className={styles.eyebrow}>Терминальная координация</Text>
          <Title id="terminal-title" order={2} className={styles.sectionTitle}>Перевалка — не пауза, а часть маршрута</Title>
          <Text>В портах, на железнодорожных станциях и складах временного хранения важны точные стыковки. Согласуем терминальные операции, документы и подачу следующего транспорта, чтобы груз не терял время в ожидании.</Text>
          <CalculationRequestModal label="Обсудить перевозку" />
        </div>
      </section>

      <section className={styles.advantages} aria-labelledby="advantages-title">
        <Text className={styles.eyebrow}>Управление всей цепочкой</Text>
        <Title id="advantages-title" order={2} className={styles.sectionTitle}>Сложный маршрут — простой контроль</Title>
        <div className={styles.advantageGrid}>
          {advantages.map(({ icon: Icon, title, text }) => (
            <article key={title} className={styles.advantageCard}>
              <Icon size={42} stroke={1.5} />
              <Title order={3}>{title}</Title>
              <Text>{text}</Text>
            </article>
          ))}
        </div>
      </section>

      <section id="how-we-work" className={styles.workflow} aria-labelledby="workflow-title">
        <div className={styles.sectionHeading}>
          <Text className={styles.eyebrow}>Простой процесс</Text>
          <Title id="workflow-title" order={2} className={styles.sectionTitle}>Как мы организуем мультимодальную перевозку</Title>
        </div>
        <ol className={styles.steps}>
          {steps.map(({ icon: Icon, text }, index) => <li key={text}><Icon className={styles.stepIcon} size={28} stroke={1.6} aria-hidden="true" /><span>0{index + 1}</span><Text>{text}</Text></li>)}
        </ol>
      </section>

      <section className={styles.cta} aria-labelledby="multimodal-cta-title">
        <div>
          <Text className={styles.ctaLabel}>Начните с расчёта</Text>
          <Title id="multimodal-cta-title" order={2}>Расскажите о поставке — соберём оптимальную схему</Title>
          <Text>Укажите маршрут, объём, точки отправления и получения. Вернёмся с расчётом и вариантами доставки.</Text>
        </div>
        <CalculationRequestModal label="Получить расчёт" size="lg" />
      </section>
    </>
  );
}
