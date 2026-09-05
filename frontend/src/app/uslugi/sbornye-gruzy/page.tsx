import type { Metadata } from 'next';
import { Button, Text, Title } from '@mantine/core';
import { IconBox, IconClipboardCheck, IconMap2, IconRoute, IconShieldCheck, IconTruck } from '@tabler/icons-react';
import styles from '../avtoperevozki/page.module.css';

export const metadata: Metadata = { title: 'Негабаритные грузы | Седьмой Транс', description: 'Перевозка негабаритного промышленного оборудования, строительной техники и крупных конструкций.' };

const options = [
  { icon: IconMap2, title: 'Проработка маршрута', text: 'Проверяем габариты проездов, мосты, ограничения и условия на площадках.' },
  { icon: IconTruck, title: 'Специальный транспорт', text: 'Подбираем тралы, низкорамные платформы и дополнительное сопровождение.' },
  { icon: IconBox, title: 'Надёжное крепление', text: 'Определяем схему размещения и фиксации техники, конструкций и оборудования.' },
  { icon: IconClipboardCheck, title: 'Разрешения и документы', text: 'Готовим транспортные документы и координируем необходимые согласования.' },
];
const advantages = [
  { icon: IconRoute, title: 'Маршрут под габариты', text: 'Учитываем каждый критичный участок до того, как груз выйдет на дорогу.' },
  { icon: IconShieldCheck, title: 'Контроль безопасности', text: 'Следим за погрузкой, креплением, сопровождением и соблюдением графика.' },
  { icon: IconClipboardCheck, title: 'Один координатор', text: 'Синхронизируем перевозчика, площадки, технику и вашу команду.' },
];
const steps = ['Получаем параметры груза и точки маршрута', 'Проверяем проезд и подбираем транспорт', 'Согласовываем график, крепление и документы', 'Организуем перевозку и сдачу груза на площадке'];

export default function ConsolidatedCargoPage() {
  return <>
    <section className={styles.hero} style={{ backgroundImage: "url('/images/oversized-cargo-hero-v2.png')" }} aria-labelledby="oversized-hero-title"><div className={styles.heroOverlay} /><div className={styles.heroContent}><Text className={styles.eyebrow}>Специальные перевозки</Text><Title id="oversized-hero-title" order={1} className={styles.heroTitle}>Негабаритные грузы <span>без лишних рисков</span></Title><Text className={styles.heroDescription}>Перевозим промышленное оборудование, строительную технику, крупные конструкции и другие нестандартные грузы. Берём на себя маршрут, технику, крепление и сопровождение.</Text><div className={styles.heroActions}><Button component="a" href="/quote" color="brandOrange" size="lg">Рассчитать перевозку</Button><Button component="a" href="#how-we-work" variant="outline" color="white" size="lg">Как мы работаем</Button></div></div></section>
    <section className={styles.intro} aria-labelledby="intro-title"><div><Text className={styles.eyebrow}>Нестандартная логистика</Text><Title id="intro-title" order={2} className={styles.sectionTitle}>Когда груз не помещается в стандартные рамки</Title></div><div className={styles.introCopy}><Text>Негабаритная перевозка требует точной подготовки: от оценки размеров и массы до проверки маршрута и возможностей погрузочной площадки.</Text><Text>Мы объединяем инженерную проработку и управление перевозкой, чтобы техника или конструкция прибыли на объект безопасно и в согласованный срок.</Text></div></section>
    <section className={styles.transportSection} aria-labelledby="options-title"><div className={styles.sectionHeading}><Text className={styles.eyebrow}>Подготовка к рейсу</Text><Title id="options-title" order={2} className={styles.sectionTitle}>Ведём перевозку от расчёта до выгрузки</Title></div><div className={styles.transportGrid}>{options.map(({ icon: Icon, title, text }) => <article className={styles.transportCard} key={title}><Icon size={38} stroke={1.55} /><Title order={3}>{title}</Title><Text>{text}</Text></article>)}</div></section>
    <section className={styles.advantages} aria-labelledby="advantages-title"><Text className={styles.eyebrow}>Управляемый процесс</Text><Title id="advantages-title" order={2} className={styles.sectionTitle}>Сложный груз — понятный план действий</Title><div className={styles.advantageGrid}>{advantages.map(({ icon: Icon, title, text }) => <article key={title} className={styles.advantageCard}><Icon size={42} stroke={1.5} /><Title order={3}>{title}</Title><Text>{text}</Text></article>)}</div></section>
    <section id="how-we-work" className={styles.workflow} aria-labelledby="workflow-title"><div className={styles.sectionHeading}><Text className={styles.eyebrow}>Пошаговая работа</Text><Title id="workflow-title" order={2} className={styles.sectionTitle}>Как организуем перевозку негабарита</Title></div><ol className={styles.steps}>{steps.map((step, index) => <li key={step}><span>0{index + 1}</span><Text>{step}</Text></li>)}</ol></section>
    <section className={styles.cta} aria-labelledby="cta-title"><div><Text className={styles.ctaLabel}>Начните с консультации</Text><Title id="cta-title" order={2}>Пришлите параметры груза — подготовим схему доставки</Title><Text>Укажите габариты, массу, точки отправления и назначения. Мы предложим транспорт и реалистичный маршрут.</Text></div><Button component="a" href="/quote" color="brandOrange" size="lg">Обсудить перевозку</Button></section>
  </>;
}
