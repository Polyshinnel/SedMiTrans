import type { Metadata } from 'next';
import { Button, Text, Title } from '@mantine/core';
import {
  IconArrowRight,
  IconBox,
  IconClipboardCheck,
  IconPackages,
  IconRoute,
  IconShieldCheck,
  IconSnowflake,
  IconTruck,
} from '@tabler/icons-react';
import Image from 'next/image';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Автоперевозки | Седьмой Транс',
  description: 'Международные автомобильные перевозки грузов из Европы, Азии и стран ЕАЭС.',
};

const transportTypes = [
  { icon: IconTruck, title: 'Тентованные полуприцепы', text: 'Универсальное решение для палетированных, коробочных и негабаритных по объёму грузов.' },
  { icon: IconSnowflake, title: 'Рефрижераторы', text: 'Перевозка товаров с температурным режимом и контролем условий на всём маршруте.' },
  { icon: IconBox, title: 'Цельнометаллические фургоны', text: 'Защищённая доставка ценных, хрупких и небольших партий груза.' },
  { icon: IconPackages, title: 'Сборные грузы', text: 'Консолидируем отправления на складе, чтобы снизить стоимость перевозки.' },
];

const advantages = [
  { icon: IconRoute, title: 'Маршрут под задачу', text: 'Подберём сроки, тип транспорта и схему доставки с учётом особенностей груза.' },
  { icon: IconClipboardCheck, title: 'Контроль на каждом этапе', text: 'Держим в курсе статуса перевозки и оперативно решаем вопросы в пути.' },
  { icon: IconShieldCheck, title: 'Документы и риски', text: 'Помогаем с экспортно-импортными документами, таможенным оформлением и страхованием.' },
];

const steps = ['Получаем заявку и данные о грузе', 'Рассчитываем маршрут и согласовываем ставку', 'Организуем забор, документы и погрузку', 'Контролируем доставку до получателя'];

export default function AutoTransportationPage() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="auto-hero-title">
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <Text className={styles.eyebrow}>Международная логистика</Text>
          <Title id="auto-hero-title" order={1} className={styles.heroTitle}>
            Автоперевозки грузов <span>без лишних километров</span>
          </Title>
          <Text className={styles.heroDescription}>
            Доставляем полные и сборные грузы из Европы, Азии и стран ЕАЭС. Подбираем транспорт,
            маршрут и комплект документов под вашу задачу.
          </Text>
          <div className={styles.heroActions}>
            <Button component="a" href="/quote" color="brandOrange" size="lg">Рассчитать стоимость</Button>
            <Button component="a" href="#how-we-work" variant="outline" color="white" size="lg">Как мы работаем</Button>
          </div>
        </div>
      </section>

      <section className={styles.intro} aria-labelledby="auto-intro-title">
        <div>
          <Text className={styles.eyebrow}>Гибкая доставка</Text>
          <Title id="auto-intro-title" order={2} className={styles.sectionTitle}>Когда важны сроки, сохранность и понятная цена</Title>
        </div>
        <div className={styles.introCopy}>
          <Text>Автомобильный транспорт позволяет выстроить прямую доставку от склада отправителя до двери получателя и быстро адаптировать маршрут под изменения.</Text>
          <Text>Мы берём на себя координацию перевозки: от расчёта и подачи машины до сопровождения груза и финальных документов.</Text>
        </div>
      </section>

      <section className={styles.transportSection} aria-labelledby="transport-title">
        <div className={styles.sectionHeading}>
          <Text className={styles.eyebrow}>Возможности транспорта</Text>
          <Title id="transport-title" order={2} className={styles.sectionTitle}>Подберём машину под ваш груз</Title>
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
          <Image src="/images/auto-terminal.webp" alt="Подготовка грузового автомобиля к отправке на логистическом терминале" fill sizes="(max-width: 900px) 100vw, 50vw" className={styles.terminalImage} />
          <div className={styles.fact}><strong>От склада до двери</strong><span>Организуем забор и доставку одним маршрутом</span></div>
        </div>
        <div className={styles.terminalContent}>
          <Text className={styles.eyebrow}>Доставка без разрывов</Text>
          <Title id="terminal-title" order={2} className={styles.sectionTitle}>Больше, чем просто подача машины</Title>
          <Text>Перед рейсом проверяем требования к грузу, согласовываем точки погрузки и выгрузки, готовим маршрут. Если нужна консолидация, маркировка или временное хранение — подключаем складскую логистику.</Text>
          <a href="/quote" className={styles.textLink}>Обсудить перевозку <IconArrowRight size={18} stroke={1.8} /></a>
        </div>
      </section>

      <section className={styles.advantages} aria-labelledby="advantages-title">
        <Text className={styles.eyebrow}>Внимание к деталям</Text>
        <Title id="advantages-title" order={2} className={styles.sectionTitle}>Перевозка, которую удобно контролировать</Title>
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
          <Title id="workflow-title" order={2} className={styles.sectionTitle}>Как организуем автоперевозку</Title>
        </div>
        <ol className={styles.steps}>
          {steps.map((step, index) => <li key={step}><span>0{index + 1}</span><Text>{step}</Text></li>)}
        </ol>
      </section>

      <section className={styles.cta} aria-labelledby="auto-cta-title">
        <div>
          <Text className={styles.ctaLabel}>Начните с расчёта</Text>
          <Title id="auto-cta-title" order={2}>Расскажите о грузе — предложим оптимальный маршрут</Title>
          <Text>Укажите направление, габариты и желаемые сроки. Вернёмся с расчётом и вариантами доставки.</Text>
        </div>
        <Button component="a" href="/quote" color="brandOrange" size="lg">Получить расчёт</Button>
      </section>
    </>
  );
}
