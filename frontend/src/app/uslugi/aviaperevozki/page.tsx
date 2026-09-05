import type { Metadata } from 'next';
import { Button, Text, Title } from '@mantine/core';
import {
  IconArrowRight,
  IconBox,
  IconCalendarCheck,
  IconClock,
  IconPackages,
  IconPlane,
  IconRoute,
  IconShieldCheck,
  IconWorld,
} from '@tabler/icons-react';
import Image from 'next/image';
import styles from '../avtoperevozki/page.module.css';

export const metadata: Metadata = {
  title: 'Авиаперевозки | Седьмой Транс',
  description: 'Срочная международная доставка грузов воздушным транспортом из любой точки мира.',
};

const transportTypes = [
  { icon: IconPlane, title: 'Регулярные рейсы', text: 'Оптимальный вариант для плановых отправок с понятным расписанием и стоимостью.' },
  { icon: IconClock, title: 'Срочная доставка', text: 'Подбираем ближайший доступный рейс, когда груз нужно доставить в максимально короткий срок.' },
  { icon: IconPackages, title: 'Консолидированные грузы', text: 'Объединяем небольшие отправления, чтобы сократить бюджет на авиадоставку.' },
  { icon: IconBox, title: 'Специальные категории', text: 'Организуем перевозку ценных, хрупких и требующих особых условий грузов.' },
];

const advantages = [
  { icon: IconWorld, title: 'География без границ', text: 'Подберём удобный маршрут между аэропортами и организуем доставку до двери получателя.' },
  { icon: IconCalendarCheck, title: 'Контроль сроков', text: 'Оперативно отслеживаем статусы вылета, прибытия и терминальной обработки груза.' },
  { icon: IconShieldCheck, title: 'Документы и безопасность', text: 'Помогаем с авианакладными, таможенными формальностями и страхованием отправления.' },
];

const steps = ['Получаем данные о грузе и сроках', 'Подбираем рейс и согласовываем ставку', 'Организуем доставку в аэропорт и оформление', 'Контролируем прилёт и выдачу получателю'];

export default function AirTransportationPage() {
  return (
    <>
      <section className={styles.hero} style={{ backgroundImage: "url('/images/air-hero.webp')" }} aria-labelledby="air-hero-title">
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <Text className={styles.eyebrow}>Международная логистика</Text>
          <Title id="air-hero-title" order={1} className={styles.heroTitle}>
            Авиаперевозки, когда <span>счёт идёт на часы</span>
          </Title>
          <Text className={styles.heroDescription}>
            Организуем быструю доставку грузов из любой точки мира. Подбираем рейс, берём на себя
            аэропортовую обработку, документы и доставку до получателя.
          </Text>
          <div className={styles.heroActions}>
            <Button component="a" href="/quote" color="brandOrange" size="lg">Рассчитать стоимость</Button>
            <Button component="a" href="#how-we-work" variant="outline" color="white" size="lg">Как мы работаем</Button>
          </div>
        </div>
      </section>

      <section className={styles.intro} aria-labelledby="air-intro-title">
        <div>
          <Text className={styles.eyebrow}>Скорость без лишних рисков</Text>
          <Title id="air-intro-title" order={2} className={styles.sectionTitle}>Когда время поставки определяет результат</Title>
        </div>
        <div className={styles.introCopy}>
          <Text>Воздушная доставка помогает быстро пополнить запасы, отправить образцы, запчасти или ценный груз. Мы находим баланс между скоростью, стоимостью и требованиями к перевозке.</Text>
          <Text>От забора груза до выдачи в аэропорту назначения — координируем все этапы и остаёмся на связи до финальной доставки.</Text>
        </div>
      </section>

      <section className={styles.transportSection} aria-labelledby="transport-title">
        <div className={styles.sectionHeading}>
          <Text className={styles.eyebrow}>Форматы доставки</Text>
          <Title id="transport-title" order={2} className={styles.sectionTitle}>Подберём авиасервис под задачу и дедлайн</Title>
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
          <Image src="/images/air-terminal2.webp" alt="Самолёт, ангар и погрузчик с паллетами на авиационном терминале" fill sizes="(max-width: 900px) 100vw, 50vw" className={styles.terminalImage} />
          <div className={styles.fact}><strong>От двери до двери</strong><span>Организуем забор, терминальную обработку и выдачу груза</span></div>
        </div>
        <div className={styles.terminalContent}>
          <Text className={styles.eyebrow}>Аэропортовая логистика</Text>
          <Title id="terminal-title" order={2} className={styles.sectionTitle}>Быстрый рейс — только часть маршрута</Title>
          <Text>Чтобы груз действительно прибыл вовремя, важно точно организовать приём, взвешивание, оформление и обработку в аэропорту. Координируем терминальные операции и стыкуем их с дальнейшей автодоставкой.</Text>
          <a href="/quote" className={styles.textLink}>Обсудить перевозку <IconArrowRight size={18} stroke={1.8} /></a>
        </div>
      </section>

      <section className={styles.advantages} aria-labelledby="advantages-title">
        <Text className={styles.eyebrow}>Внимание к срокам</Text>
        <Title id="advantages-title" order={2} className={styles.sectionTitle}>Доставка, которую не нужно постоянно догонять</Title>
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
          <Title id="workflow-title" order={2} className={styles.sectionTitle}>Как организуем авиаперевозку</Title>
        </div>
        <ol className={styles.steps}>
          {steps.map((step, index) => <li key={step}><span>0{index + 1}</span><Text>{step}</Text></li>)}
        </ol>
      </section>

      <section className={styles.cta} aria-labelledby="air-cta-title">
        <div>
          <Text className={styles.ctaLabel}>Начните с расчёта</Text>
          <Title id="air-cta-title" order={2}>Расскажите о грузе — найдём ближайший подходящий рейс</Title>
          <Text>Укажите маршрут, вес, габариты и дедлайн. Вернёмся с расчётом и вариантами отправки.</Text>
        </div>
        <Button component="a" href="/quote" color="brandOrange" size="lg">Получить расчёт</Button>
      </section>
    </>
  );
}
