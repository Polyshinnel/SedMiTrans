import type { Metadata } from 'next';
import { Button, Text, Title } from '@mantine/core';
import {
  IconArrowRight,
  IconCalendarCheck,
  IconContainer,
  IconMap2,
  IconRoute,
  IconShieldCheck,
  IconShip,
  IconTrain,
  IconTruck,
} from '@tabler/icons-react';
import Image from 'next/image';
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

const steps = ['Получаем маршрут и параметры груза', 'Проектируем схему доставки и рассчитываем ставку', 'Организуем отправку и перевалку на терминалах', 'Контролируем каждый участок до склада получателя'];

export default function MultimodalTransportationPage() {
  return (
    <>
      <section className={styles.hero} style={{ backgroundImage: "url('/images/multimodal-hero.webp')" }} aria-labelledby="multimodal-hero-title">
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <Text className={styles.eyebrow}>Международная логистика</Text>
          <Title id="multimodal-hero-title" order={1} className={styles.heroTitle}>
            Мультимодальные перевозки <span>одним маршрутом</span>
          </Title>
          <Text className={styles.heroDescription}>
            Объединяем море, железную дорогу и автомобильную доставку в понятную логистическую цепочку.
            Вы получаете единый расчёт, контроль и одного ответственного за весь путь груза.
          </Text>
          <div className={styles.heroActions}>
            <Button component="a" href="/quote" color="brandOrange" size="lg">Рассчитать стоимость</Button>
            <Button component="a" href="#how-we-work" variant="outline" color="white" size="lg">Как мы работаем</Button>
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
          <Image src="/images/multimodal-terminal.webp" alt="Перевалка контейнера между железнодорожным вагоном и грузовым автомобилем" fill sizes="(max-width: 900px) 100vw, 50vw" className={styles.terminalImage} />
          <div className={styles.fact}><strong>Без разрывов маршрута</strong><span>Координируем переход груза между всеми видами транспорта</span></div>
        </div>
        <div className={styles.terminalContent}>
          <Text className={styles.eyebrow}>Терминальная координация</Text>
          <Title id="terminal-title" order={2} className={styles.sectionTitle}>Перевалка — не пауза, а часть маршрута</Title>
          <Text>В портах, на железнодорожных станциях и складах временного хранения важны точные стыковки. Согласуем терминальные операции, документы и подачу следующего транспорта, чтобы груз не терял время в ожидании.</Text>
          <a href="/quote" className={styles.textLink}>Обсудить перевозку <IconArrowRight size={18} stroke={1.8} /></a>
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
          <Title id="workflow-title" order={2} className={styles.sectionTitle}>Как организуем мультимодальную перевозку</Title>
        </div>
        <ol className={styles.steps}>
          {steps.map((step, index) => <li key={step}><span>0{index + 1}</span><Text>{step}</Text></li>)}
        </ol>
      </section>

      <section className={styles.cta} aria-labelledby="multimodal-cta-title">
        <div>
          <Text className={styles.ctaLabel}>Начните с расчёта</Text>
          <Title id="multimodal-cta-title" order={2}>Расскажите о поставке — соберём оптимальную схему</Title>
          <Text>Укажите маршрут, объём, точки отправления и получения. Вернёмся с расчётом и вариантами доставки.</Text>
        </div>
        <Button component="a" href="/quote" color="brandOrange" size="lg">Получить расчёт</Button>
      </section>
    </>
  );
}
