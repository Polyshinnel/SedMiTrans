import type { Metadata } from 'next';
import { Anchor, Box, Text, Title } from '@mantine/core';
import {
  IconBox,
  IconClipboardCheck,
  IconFileDescription,
  IconFileInvoice,
  IconMap2,
  IconPackageExport,
  IconRoute,
  IconShieldCheck,
} from '@tabler/icons-react';
import Image from 'next/image';
import { CalculationRequestModal } from '@/components/calculation-request-modal';
import styles from '../avtoperevozki/page.module.css';

export const metadata: Metadata = {
  title: 'Страхование грузов',
  description: 'Страхование грузов при перевозке: подбор покрытия, оформление полиса и сопровождение при страховом случае.',
};

const services = [
  { icon: IconShieldCheck, title: 'Подбор покрытия', text: 'Определяем подходящий вариант страхования с учётом маршрута, вида транспорта и особенностей груза.' },
  { icon: IconFileDescription, title: 'Оформление полиса', text: 'Собираем данные по поставке и готовим документы без лишних согласований с вашей стороны.' },
  { icon: IconBox, title: 'Страхование разных грузов', text: 'Работаем с коммерческими, проектными, сборными и специальными грузами.' },
  { icon: IconClipboardCheck, title: 'Сопровождение поставки', text: 'Помогаем зафиксировать состояние груза, важные условия и порядок действий на маршруте.' },
];

const advantages = [
  { icon: IconRoute, title: 'Покрытие по маршруту', text: 'Учитываем все участки перевозки и точки перегрузки, чтобы защита не прерывалась в пути.' },
  { icon: IconFileInvoice, title: 'Прозрачные условия', text: 'Объясняем, что входит в покрытие, какие есть исключения и как рассчитывается страховая сумма.' },
  { icon: IconMap2, title: 'Поддержка при событии', text: 'Остаёмся на связи и помогаем собрать информацию для обращения и урегулирования.' },
];

const steps = [
  { icon: IconPackageExport, text: 'Получаем сведения о грузе, стоимости и маршруте' },
  { icon: IconRoute, text: 'Оцениваем риски перевозки и предлагаем варианты покрытия' },
  { icon: IconFileDescription, text: 'Согласуем условия и оформляем страховой полис' },
  { icon: IconShieldCheck, text: 'Сопровождаем поставку и остаёмся на связи до получения' },
];

export default function CargoInsurancePage() {
  return (
    <>
      <section className={styles.hero} style={{ backgroundImage: "url('/images/cargo-insurance-hero.png')" }} aria-labelledby="insurance-hero-title">
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <Box className={styles.heroBreadcrumbs}>
            <Anchor href="/" underline="never">Главная</Anchor><span aria-hidden="true">/</span>
            <Anchor href="/uslugi" underline="never">Услуги</Anchor><span aria-hidden="true">/</span>
            <Text component="span">Страхование грузов</Text>
          </Box>
          <Title id="insurance-hero-title" order={1} className={styles.heroTitle}>Страхование грузов <span>в пути</span></Title>
          <Text className={styles.heroDescription}>Подбираем защиту под реальный маршрут и ценность поставки, оформляем полис и остаёмся рядом на всём пути груза.</Text>
          <div className={styles.heroActions}><CalculationRequestModal label="Застраховать груз" size="lg" /></div>
        </div>
      </section>

      <section className={styles.intro} aria-labelledby="insurance-intro-title">
        <div><Text className={styles.eyebrow}>Защита без формальностей</Text><Title id="insurance-intro-title" order={2} className={styles.sectionTitle}>Спокойствие начинается с понятных условий</Title></div>
        <div className={styles.introCopy}><Text>В международной перевозке груз проходит несколько этапов: погрузку, перегрузки, хранение и доставку последней мили. На каждом из них важно понимать, какие риски покрывает страховка.</Text><Text>Мы помогаем выбрать разумный уровень защиты, заранее фиксируем ключевые условия и объясняем порядок действий, если с грузом что-то произошло.</Text></div>
      </section>

      <section className={styles.transportSection} aria-labelledby="insurance-services-title">
        <div className={styles.sectionHeading}><Text className={styles.eyebrow}>Что мы делаем</Text><Title id="insurance-services-title" order={2} className={styles.sectionTitle}>Страхование, встроенное в логистику</Title></div>
        <div className={styles.transportGrid}>{services.map(({ icon: Icon, title, text }) => <article className={styles.transportCard} key={title}><Icon size={38} stroke={1.55} /><Title order={3}>{title}</Title><Text>{text}</Text></article>)}</div>
      </section>

      <section className={styles.terminalSection} aria-labelledby="insurance-protection-title">
        <div className={styles.terminalImageWrap}><Image src="/images/cargo-insurance-protection.png" alt="Защищённый и закреплённый груз на паллете" fill sizes="(max-width: 900px) 100vw, 50vw" className={styles.terminalImage} /><div className={styles.fact}><strong>Груз подготовлен к пути</strong><span>Учитываем упаковку, крепление и точки обработки при оценке рисков</span></div></div>
        <div className={styles.terminalContent}><Text className={styles.eyebrow}>Оценка рисков</Text><Title id="insurance-protection-title" order={2} className={styles.sectionTitle}>Защита должна соответствовать реальной перевозке</Title><Text>Смотрим не только на стоимость товара, но и на маршрут, тип упаковки, сезонность, перегрузки и особенности транспорта. Так условия страхования остаются практичными, а не формальными.</Text><CalculationRequestModal label="Подобрать покрытие" /></div>
      </section>

      <section className={styles.advantages} aria-labelledby="insurance-advantages-title"><Text className={styles.eyebrow}>Важные детали</Text><Title id="insurance-advantages-title" order={2} className={styles.sectionTitle}>Уверенность на каждом участке маршрута</Title><div className={styles.advantageGrid}>{advantages.map(({ icon: Icon, title, text }) => <article key={title} className={styles.advantageCard}><Icon size={42} stroke={1.5} /><Title order={3}>{title}</Title><Text>{text}</Text></article>)}</div></section>

      <section id="how-we-work" className={styles.workflow} aria-labelledby="insurance-workflow-title"><div className={styles.sectionHeading}><Text className={styles.eyebrow}>Порядок работы</Text><Title id="insurance-workflow-title" order={2} className={styles.sectionTitle}>Как мы страхуем груз</Title></div><ol className={styles.steps}>{steps.map(({ icon: Icon, text }, index) => <li key={text}><Icon className={styles.stepIcon} size={28} stroke={1.6} aria-hidden="true" /><span>0{index + 1}</span><Text>{text}</Text></li>)}</ol></section>

      <section className={styles.cta} aria-labelledby="insurance-cta-title"><div><Text className={styles.ctaLabel}>Начните с расчёта</Text><Title id="insurance-cta-title" order={2}>Расскажите о грузе — предложим подходящий уровень защиты</Title><Text>Укажите стоимость, маршрут, вид транспорта и сроки. Подготовим варианты страхования и объясним условия простым языком.</Text></div><CalculationRequestModal label="Получить предложение" size="lg" /></section>
    </>
  );
}
