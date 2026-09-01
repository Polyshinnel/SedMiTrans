import type { Metadata } from 'next';
import { Button, Text, Title } from '@mantine/core';
import {
  IconArrowRight,
  IconBox,
  IconCalendarCheck,
  IconContainer,
  IconMap2,
  IconPackages,
  IconRoute,
  IconShieldCheck,
  IconTrain,
} from '@tabler/icons-react';
import Image from 'next/image';
import styles from '../avtoperevozki/page.module.css';

export const metadata: Metadata = {
  title: 'Железнодорожные перевозки | Седьмой Транс',
  description: 'Контейнерные и железнодорожные перевозки грузов из Китая, стран ЕАЭС и по России.',
};

const transportTypes = [
  { icon: IconContainer, title: 'Контейнерные поезда', text: 'Регулярные отправки в 20- и 40-футовых контейнерах для стабильных поставок.' },
  { icon: IconPackages, title: 'Сборные контейнеры', text: 'Консолидируем небольшие партии, чтобы железнодорожная доставка оставалась выгодной.' },
  { icon: IconBox, title: 'Крытые вагоны', text: 'Перевозка грузов, которым требуется защита от осадков и внешней среды.' },
  { icon: IconTrain, title: 'Полувагоны и платформы', text: 'Решения для промышленного, тяжёлого и нестандартного груза.' },
];

const advantages = [
  { icon: IconCalendarCheck, title: 'Предсказуемый график', text: 'Планируем отправку с учётом расписания и заранее согласовываем контрольные точки.' },
  { icon: IconMap2, title: 'Маршруты Китай — ЕАЭС', text: 'Подбираем схему через ключевые терминалы и погранпереходы под вашу поставку.' },
  { icon: IconShieldCheck, title: 'Единая координация', text: 'Сопровождаем документы, терминальные операции и доставку от станции до склада.' },
];

const steps = ['Получаем параметры груза и направление', 'Подбираем сервис, контейнер и график', 'Организуем консолидацию и терминальные операции', 'Контролируем путь до станции или склада получателя'];

export default function RailTransportationPage() {
  return (
    <>
      <section className={styles.hero} style={{ backgroundImage: "url('/images/rail-hero.webp')" }} aria-labelledby="rail-hero-title">
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <Text className={styles.eyebrow}>Международная логистика</Text>
          <Title id="rail-hero-title" order={1} className={styles.heroTitle}>
            Железнодорожные перевозки <span>по выверенному маршруту</span>
          </Title>
          <Text className={styles.heroDescription}>
            Организуем контейнерную доставку из Китая, стран ЕАЭС и по России. Планируем график,
            терминальные операции и документы так, чтобы груз двигался без простоев.
          </Text>
          <div className={styles.heroActions}>
            <Button component="a" href="/quote" color="brandOrange" size="lg">Рассчитать стоимость</Button>
            <Button component="a" href="#how-we-work" variant="outline" color="white" size="lg">Как мы работаем</Button>
          </div>
        </div>
      </section>

      <section className={styles.intro} aria-labelledby="rail-intro-title">
        <div>
          <Text className={styles.eyebrow}>Стабильная логистика</Text>
          <Title id="rail-intro-title" order={2} className={styles.sectionTitle}>Когда нужно планировать поставки на недели вперёд</Title>
        </div>
        <div className={styles.introCopy}>
          <Text>Железная дорога помогает ритмично перевозить большие объёмы на длинных расстояниях. Это рациональный выбор для регулярных поставок, контейнерных партий и промышленной продукции.</Text>
          <Text>Мы связываем маршрут в одну систему: согласуем сервис, организуем работу на терминалах и при необходимости довозим груз до склада получателя.</Text>
        </div>
      </section>

      <section className={styles.transportSection} aria-labelledby="transport-title">
        <div className={styles.sectionHeading}>
          <Text className={styles.eyebrow}>Форматы перевозки</Text>
          <Title id="transport-title" order={2} className={styles.sectionTitle}>Подберём железнодорожное решение под объём и сроки</Title>
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
          <Image src="/images/rail-terminal.webp" alt="Погрузка контейнера на железнодорожной терминале" fill sizes="(max-width: 900px) 100vw, 50vw" className={styles.terminalImage} />
          <div className={styles.fact}><strong>От терминала до склада</strong><span>Связываем железную дорогу с автодоставкой последней мили</span></div>
        </div>
        <div className={styles.terminalContent}>
          <Text className={styles.eyebrow}>Терминальная логистика</Text>
          <Title id="terminal-title" order={2} className={styles.sectionTitle}>Контейнер в движении — детали под контролем</Title>
          <Text>Организуем приём груза, затарку контейнера, перевалку и выдачу на терминале. Следим за графиком и заранее координируем стыковки с автомобильной доставкой, чтобы исключить лишние ожидания.</Text>
          <a href="/quote" className={styles.textLink}>Обсудить перевозку <IconArrowRight size={18} stroke={1.8} /></a>
        </div>
      </section>

      <section className={styles.advantages} aria-labelledby="advantages-title">
        <Text className={styles.eyebrow}>Внимание к графику</Text>
        <Title id="advantages-title" order={2} className={styles.sectionTitle}>Поставки, которые можно планировать</Title>
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
          <Title id="workflow-title" order={2} className={styles.sectionTitle}>Как организуем железнодорожную перевозку</Title>
        </div>
        <ol className={styles.steps}>
          {steps.map((step, index) => <li key={step}><span>0{index + 1}</span><Text>{step}</Text></li>)}
        </ol>
      </section>

      <section className={styles.cta} aria-labelledby="rail-cta-title">
        <div>
          <Text className={styles.ctaLabel}>Начните с расчёта</Text>
          <Title id="rail-cta-title" order={2}>Расскажите о поставке — подберём сервис и график</Title>
          <Text>Укажите маршрут, объём, характеристики груза и желаемые сроки. Вернёмся с расчётом и вариантами отправки.</Text>
        </div>
        <Button component="a" href="/quote" color="brandOrange" size="lg">Получить расчёт</Button>
      </section>
    </>
  );
}
