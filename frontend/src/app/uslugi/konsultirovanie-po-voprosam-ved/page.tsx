import type { Metadata } from 'next';
import { Anchor, Box, Text, Title } from '@mantine/core';
import {
  IconBuildingBank,
  IconChecklist,
  IconClipboardCheck,
  IconFileDescription,
  IconFileInvoice,
  IconGlobe,
  IconReceiptTax,
  IconShieldCheck,
} from '@tabler/icons-react';
import Image from 'next/image';
import { CalculationRequestModal } from '@/components/calculation-request-modal';
import styles from '../avtoperevozki/page.module.css';

export const metadata: Metadata = {
  title: 'Консультирование по вопросам ВЭД',
  description: 'Практические консультации по ВЭД: внешнеторговые контракты, платежи, валютный контроль и документы для импорта и экспорта.',
};

const services = [
  { icon: IconFileDescription, title: 'Документы и контракты', text: 'Проверяем внешнеторговые договоры, инвойсы и условия поставки. Подсказываем, какие сведения важно зафиксировать заранее.' },
  { icon: IconBuildingBank, title: 'Платежи и расчёты', text: 'Ищем рабочие способы оплаты с учётом направления, валюты, банка и особенностей конкретной сделки.' },
  { icon: IconReceiptTax, title: 'Валютный контроль', text: 'Разбираем требования банка, помогаем подготовить подтверждающие документы и не терять сроки по контракту.' },
  { icon: IconGlobe, title: 'Маршрут поставки', text: 'Связываем коммерческие условия, логистику и таможенные формальности в одну реалистичную схему.' },
];

const advantages = [
  { icon: IconShieldCheck, title: 'Меньше неопределённости', text: 'До начала сделки обозначаем риски, обязательные документы и точки, где потребуется решение.' },
  { icon: IconChecklist, title: 'Практический результат', text: 'После консультации у вас остаётся не только ответ, но и понятный список следующих шагов.' },
  { icon: IconClipboardCheck, title: 'Одна команда', text: 'Синхронизируем ВЭД, таможню и перевозку, чтобы договорённости не расходились на этапах поставки.' },
];

const steps = [
  { icon: IconFileInvoice, text: 'Получаем вводные: товар, страну, маршрут и условия сделки' },
  { icon: IconFileDescription, text: 'Изучаем документы и отмечаем риски или недостающие сведения' },
  { icon: IconBuildingBank, text: 'Предлагаем варианты оформления, оплаты и взаимодействия с банком' },
  { icon: IconClipboardCheck, text: 'Передаём план действий и остаёмся на связи до завершения поставки' },
];

export default function VedConsultingPage() {
  return (
    <>
      <section className={styles.hero} style={{ backgroundImage: "url('/images/ved-consulting-hero.png')" }} aria-labelledby="ved-hero-title">
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <Box className={styles.heroBreadcrumbs}>
            <Anchor href="/" underline="never">Главная</Anchor><span aria-hidden="true">/</span>
            <Anchor href="/uslugi" underline="never">Услуги</Anchor><span aria-hidden="true">/</span>
            <Text component="span">Консультирование по вопросам ВЭД</Text>
          </Box>
          <Title id="ved-hero-title" order={1} className={styles.heroTitle}>Консультирование по вопросам <span>ВЭД</span></Title>
          <Text className={styles.heroDescription}>Помогаем разобраться в документах, платежах и требованиях к внешнеторговой сделке — ещё до того, как она столкнётся с задержкой.</Text>
          <div className={styles.heroActions}><CalculationRequestModal label="Получить консультацию" size="lg" /></div>
        </div>
      </section>

      <section className={styles.intro} aria-labelledby="ved-intro-title">
        <div><Text className={styles.eyebrow}>Уверенность до отгрузки</Text><Title id="ved-intro-title" order={2} className={styles.sectionTitle}>ВЭД становится понятнее, когда все детали собраны в одну картину</Title></div>
        <div className={styles.introCopy}><Text>Международная поставка состоит из решений, которые влияют друг на друга: условия контракта, способ оплаты, пакет документов, маршрут и таможенное оформление.</Text><Text>Мы переводим сложные требования на язык конкретной сделки. Вместе оцениваем задачу, находим слабые места и формируем последовательный план без лишней теории.</Text></div>
      </section>

      <section className={styles.transportSection} aria-labelledby="ved-services-title">
        <div className={styles.sectionHeading}><Text className={styles.eyebrow}>С чем помогаем</Text><Title id="ved-services-title" order={2} className={styles.sectionTitle}>Поддержка на ключевых этапах внешней торговли</Title></div>
        <div className={styles.transportGrid}>{services.map(({ icon: Icon, title, text }) => <article className={styles.transportCard} key={title}><Icon size={38} stroke={1.55} /><Title order={3}>{title}</Title><Text>{text}</Text></article>)}</div>
      </section>

      <section className={styles.terminalSection} aria-labelledby="ved-documents-title">
        <div className={styles.terminalImageWrap}><Image src="/images/ved-consulting-documents.png" alt="Рабочая консультация по документам внешнеторговой сделки" fill sizes="(max-width: 900px) 100vw, 50vw" className={styles.terminalImage} /><div className={styles.fact}><strong>Разбираем по существу</strong><span>Фиксируем риски, документы и действия, которые нужны именно для вашей поставки</span></div></div>
        <div className={styles.terminalContent}><Text className={styles.eyebrow}>Разбор конкретной сделки</Text><Title id="ved-documents-title" order={2} className={styles.sectionTitle}>Консультация, после которой можно действовать</Title><Text>Расскажите, что планируете ввозить или вывозить, откуда и куда пойдёт груз. Мы зададим правильные вопросы, проверим логику сделки и подскажем, как подготовиться к общению с перевозчиком, таможенным представителем и банком.</Text><CalculationRequestModal label="Разобрать сделку" /></div>
      </section>

      <section className={styles.advantages} aria-labelledby="ved-advantages-title"><Text className={styles.eyebrow}>Зачем подключать нас</Text><Title id="ved-advantages-title" order={2} className={styles.sectionTitle}>Решения, которые помогают двигаться без лишних остановок</Title><div className={styles.advantageGrid}>{advantages.map(({ icon: Icon, title, text }) => <article key={title} className={styles.advantageCard}><Icon size={42} stroke={1.5} /><Title order={3}>{title}</Title><Text>{text}</Text></article>)}</div></section>

      <section id="how-we-work" className={styles.workflow} aria-labelledby="ved-workflow-title"><div className={styles.sectionHeading}><Text className={styles.eyebrow}>Порядок работы</Text><Title id="ved-workflow-title" order={2} className={styles.sectionTitle}>Как проходит консультация по ВЭД</Title></div><ol className={styles.steps}>{steps.map(({ icon: Icon, text }, index) => <li key={text}><Icon className={styles.stepIcon} size={28} stroke={1.6} aria-hidden="true" /><span>0{index + 1}</span><Text>{text}</Text></li>)}</ol></section>

      <section className={styles.cta} aria-labelledby="ved-cta-title"><div><Text className={styles.ctaLabel}>Начните с вопроса</Text><Title id="ved-cta-title" order={2}>Опишите поставку — подскажем, с чего начать</Title><Text>Укажите страну, товар и примерные сроки. Мы оценим задачу и вернёмся с перечнем вопросов и ближайших шагов.</Text></div><CalculationRequestModal label="Обсудить поставку" size="lg" /></section>
    </>
  );
}
