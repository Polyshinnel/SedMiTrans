import type { Metadata } from 'next';
import { Anchor, Box, Text, Title } from '@mantine/core';
import { IconBox, IconClipboardCheck, IconContainer, IconRoute, IconShieldCheck, IconTruck } from '@tabler/icons-react';
import { CalculationRequestModal } from '@/components/calculation-request-modal';
import styles from '../avtoperevozki/page.module.css';

export const metadata: Metadata = { title: 'Опасные грузы | Седьмой Транс', description: 'Организация безопасной перевозки опасных грузов с соблюдением международных требований.' };

const options = [
  { icon: IconTruck, title: 'Специализированный транспорт', text: 'Подбираем транспорт с необходимым оснащением под класс и свойства груза.' },
  { icon: IconBox, title: 'Упаковка и маркировка', text: 'Проверяем требования к таре, маркировке, совместимости и размещению груза.' },
  { icon: IconClipboardCheck, title: 'Документы ADR', text: 'Помогаем подготовить комплект транспортных документов для международной перевозки.' },
  { icon: IconContainer, title: 'Контроль перегрузок', text: 'Координируем безопасную обработку груза на терминалах и в точках маршрута.' },
];
const advantages = [
  { icon: IconShieldCheck, title: 'Соблюдение требований', text: 'Учитываем правила перевозки, свойства груза и требования стран маршрута.' },
  { icon: IconRoute, title: 'Безопасный маршрут', text: 'Планируем движение с учётом ограничений, стоянок и контрольных точек.' },
  { icon: IconClipboardCheck, title: 'Постоянная связь', text: 'Держим в курсе статуса перевозки и оперативно координируем изменения.' },
];
const steps = [
  { icon: IconClipboardCheck, text: 'Получаем данные о классе опасности и маршруте' },
  { icon: IconRoute, text: 'Проверяем требования к транспорту и документам' },
  { icon: IconTruck, text: 'Организуем подготовку, погрузку и отправку' },
  { icon: IconShieldCheck, text: 'Контролируем движение до безопасной передачи получателю' },
];

export default function ProjectCargoPage() {
  return <>
    <section className={styles.hero} style={{ backgroundImage: "url('/images/dangerous-cargo-hero-v2.png')" }} aria-labelledby="dangerous-hero-title"><div className={styles.heroOverlay} /><div className={styles.heroContent}><Box className={styles.heroBreadcrumbs}><Anchor href="/" underline="never">Главная</Anchor><span aria-hidden="true">/</span><Anchor href="/uslugi" underline="never">Услуги</Anchor><span aria-hidden="true">/</span><Text component="span">Проектные грузы</Text></Box><Title id="dangerous-hero-title" order={1} className={styles.heroTitle}>Опасные грузы <span>по правилам безопасности</span></Title><Text className={styles.heroDescription}>Организуем перевозку опасных грузов с соблюдением международных требований, подбором специализированного транспорта и контролем на всём маршруте.</Text><div className={styles.heroActions}><CalculationRequestModal label="Рассчитать перевозку" size="lg" /></div></div></section>
    <section className={styles.intro} aria-labelledby="intro-title"><div><Text className={styles.eyebrow}>Ответственная логистика</Text><Title id="intro-title" order={2} className={styles.sectionTitle}>Когда безопасность определяет каждый шаг</Title></div><div className={styles.introCopy}><Text>Перевозка опасных грузов требует точного соблюдения правил: от классификации и упаковки до подбора транспорта, водителя и комплекта документов.</Text><Text>Мы выстраиваем маршрут и операции так, чтобы груз оставался под контролем на каждом этапе — от приёмки до передачи получателю.</Text></div></section>
    <section className={styles.transportSection} aria-labelledby="options-title"><div className={styles.sectionHeading}><Text className={styles.eyebrow}>Полный контроль</Text><Title id="options-title" order={2} className={styles.sectionTitle}>Организуем безопасную перевозку комплексно</Title></div><div className={styles.transportGrid}>{options.map(({ icon: Icon, title, text }) => <article className={styles.transportCard} key={title}><Icon size={38} stroke={1.55} /><Title order={3}>{title}</Title><Text>{text}</Text></article>)}</div></section>
    <section className={styles.advantages} aria-labelledby="advantages-title"><Text className={styles.eyebrow}>Внимание к нормам</Text><Title id="advantages-title" order={2} className={styles.sectionTitle}>Перевозка, в которой нет мелочей</Title><div className={styles.advantageGrid}>{advantages.map(({ icon: Icon, title, text }) => <article key={title} className={styles.advantageCard}><Icon size={42} stroke={1.5} /><Title order={3}>{title}</Title><Text>{text}</Text></article>)}</div></section>
    <section id="how-we-work" className={styles.workflow} aria-labelledby="workflow-title"><div className={styles.sectionHeading}><Text className={styles.eyebrow}>Чёткий порядок</Text><Title id="workflow-title" order={2} className={styles.sectionTitle}>Как мы организуем перевозку опасного груза</Title></div><ol className={styles.steps}>{steps.map(({ icon: Icon, text }, index) => <li key={text}><Icon className={styles.stepIcon} size={28} stroke={1.6} aria-hidden="true" /><span>0{index + 1}</span><Text>{text}</Text></li>)}</ol></section>
    <section className={styles.cta} aria-labelledby="cta-title"><div><Text className={styles.ctaLabel}>Начните с консультации</Text><Title id="cta-title" order={2}>Сообщите класс опасности — подготовим схему перевозки</Title><Text>Укажите характеристики груза, маршрут и сроки. Проверим требования и предложим безопасный вариант доставки.</Text></div><CalculationRequestModal label="Обсудить перевозку" size="lg" /></section>
  </>;
}
