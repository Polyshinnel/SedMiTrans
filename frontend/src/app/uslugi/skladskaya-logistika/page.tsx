import type { Metadata } from 'next';
import { Anchor, Box, Text, Title } from '@mantine/core';
import {
  IconBarcode,
  IconBox,
  IconClipboardCheck,
  IconContainer,
  IconPackages,
  IconRoute,
  IconShieldCheck,
  IconTruck,
} from '@tabler/icons-react';
import Image from 'next/image';
import { CalculationRequestModal } from '@/components/calculation-request-modal';
import styles from '../avtoperevozki/page.module.css';

export const metadata: Metadata = {
  title: 'Складская логистика | Седьмой Транс',
  description: 'Приёмка, хранение, консолидация и комплектация грузов на складах в России и за рубежом.',
};

const operations = [
  { icon: IconContainer, title: 'Приёмка и размещение', text: 'Принимаем груз по количеству и состоянию, сверяем документы и размещаем на подходящей зоне хранения.' },
  { icon: IconBox, title: 'Ответственное хранение', text: 'Сохраняем палеты, коробки и отдельные места до нужной даты с понятным учётом остатков.' },
  { icon: IconPackages, title: 'Консолидация партий', text: 'Объединяем поставки от разных отправителей в одну отгрузку, помогая снизить затраты на доставку.' },
  { icon: IconBarcode, title: 'Комплектация заказов', text: 'Подбираем позиции по заявке, проверяем состав и готовим груз к дальнейшей перевозке.' },
];

const advantages = [
  { icon: IconClipboardCheck, title: 'Прозрачный учёт', text: 'Фиксируем движение товара и предоставляем актуальную информацию по каждой партии.' },
  { icon: IconShieldCheck, title: 'Сохранность груза', text: 'Соблюдаем правила размещения, упаковки и обработки, предусмотренные для вашего груза.' },
  { icon: IconRoute, title: 'Склад как часть маршрута', text: 'Синхронизируем складские операции с транспортом, чтобы отгрузка не задерживала доставку.' },
];

const steps = [
  { icon: IconClipboardCheck, text: 'Получаем данные о грузе, объёме и сроках хранения' },
  { icon: IconContainer, text: 'Подбираем склад и согласовываем схему обработки' },
  { icon: IconPackages, text: 'Принимаем, размещаем и комплектуем груз по заявкам' },
  { icon: IconTruck, text: 'Передаём готовую партию в перевозку и контролируем отгрузку' },
];

export default function WarehouseLogisticsPage() {
  return (
    <>
      <section className={styles.hero} style={{ backgroundImage: "url('/images/warehouse-logistics-hero.png')" }} aria-labelledby="warehouse-hero-title">
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <Box className={styles.heroBreadcrumbs}>
            <Anchor href="/" underline="never">Главная</Anchor><span aria-hidden="true">/</span>
            <Anchor href="/uslugi" underline="never">Услуги</Anchor><span aria-hidden="true">/</span>
            <Text component="span">Складская логистика</Text>
          </Box>
          <Title id="warehouse-hero-title" order={1} className={styles.heroTitle}>Складская логистика <span>без потерь времени</span></Title>
          <Text className={styles.heroDescription}>Принимаем, храним, комплектуем и передаём груз в перевозку. Соединяем складские операции с маршрутом, чтобы каждая партия двигалась по плану.</Text>
          <div className={styles.heroActions}><CalculationRequestModal label="Рассчитать решение" size="lg" /></div>
        </div>
      </section>

      <section className={styles.intro} aria-labelledby="warehouse-intro-title">
        <div><Text className={styles.eyebrow}>Логистика под ключ</Text><Title id="warehouse-intro-title" order={2} className={styles.sectionTitle}>Склад — это точка контроля, а не пауза в доставке</Title></div>
        <div className={styles.introCopy}><Text>Когда поставки приходят частями или отправить их нужно позже, склад помогает сохранить гибкость. Мы организуем обработку груза и поддерживаем порядок в каждой партии.</Text><Text>Подключаем складскую логистику к автомобильным, железнодорожным и мультимодальным перевозкам — с единым ответственным за всю цепочку.</Text></div>
      </section>

      <section className={styles.transportSection} aria-labelledby="operations-title">
        <div className={styles.sectionHeading}><Text className={styles.eyebrow}>Операции на складе</Text><Title id="operations-title" order={2} className={styles.sectionTitle}>Берём на себя всё, что происходит с грузом до отправки</Title></div>
        <div className={styles.transportGrid}>{operations.map(({ icon: Icon, title, text }) => <article className={styles.transportCard} key={title}><Icon size={38} stroke={1.55} /><Title order={3}>{title}</Title><Text>{text}</Text></article>)}</div>
      </section>

      <section className={styles.terminalSection} aria-labelledby="fulfillment-title">
        <div className={styles.terminalImageWrap}><Image src="/images/warehouse-fulfillment.png" alt="Проверка и упаковка груза на складе" fill sizes="(max-width: 900px) 100vw, 50vw" className={styles.terminalImage} /><div className={styles.fact}><strong>Готово к отправке</strong><span>Проверяем состав заказа перед передачей перевозчику</span></div></div>
        <div className={styles.terminalContent}><Text className={styles.eyebrow}>Точная комплектация</Text><Title id="fulfillment-title" order={2} className={styles.sectionTitle}>Каждая партия собрана по вашему заданию</Title><Text>Проверяем количество мест, состояние упаковки и соответствие отгрузочным документам. При необходимости переупаковываем, маркируем, фотографируем и готовим груз к погрузке.</Text><CalculationRequestModal label="Обсудить хранение" /></div>
      </section>

      <section className={styles.advantages} aria-labelledby="advantages-title"><Text className={styles.eyebrow}>Порядок в цепочке</Text><Title id="advantages-title" order={2} className={styles.sectionTitle}>Складская логистика, которую легко контролировать</Title><div className={styles.advantageGrid}>{advantages.map(({ icon: Icon, title, text }) => <article key={title} className={styles.advantageCard}><Icon size={42} stroke={1.5} /><Title order={3}>{title}</Title><Text>{text}</Text></article>)}</div></section>

      <section id="how-we-work" className={styles.workflow} aria-labelledby="workflow-title"><div className={styles.sectionHeading}><Text className={styles.eyebrow}>Понятный процесс</Text><Title id="workflow-title" order={2} className={styles.sectionTitle}>Как мы организуем складскую логистику</Title></div><ol className={styles.steps}>{steps.map(({ icon: Icon, text }, index) => <li key={text}><Icon className={styles.stepIcon} size={28} stroke={1.6} aria-hidden="true" /><span>0{index + 1}</span><Text>{text}</Text></li>)}</ol></section>

      <section className={styles.cta} aria-labelledby="warehouse-cta-title"><div><Text className={styles.ctaLabel}>Начните с консультации</Text><Title id="warehouse-cta-title" order={2}>Расскажите о поставке — соберём складскую схему</Title><Text>Укажите объём, тип груза, сроки и направление. Предложим подходящий формат хранения, обработки и дальнейшей доставки.</Text></div><CalculationRequestModal label="Получить предложение" size="lg" /></section>
    </>
  );
}
