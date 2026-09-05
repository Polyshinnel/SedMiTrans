import type { Metadata } from 'next';
import { Anchor, Box, Text, Title } from '@mantine/core';
import {
  IconBox,
  IconCheck,
  IconClipboardCheck,
  IconFileDescription,
  IconFileInvoice,
  IconMap2,
  IconShieldCheck,
  IconTruck,
} from '@tabler/icons-react';
import Image from 'next/image';
import { CalculationRequestModal } from '@/components/calculation-request-modal';
import styles from '../avtoperevozki/page.module.css';

export const metadata: Metadata = {
  title: 'Таможенное оформление',
  description: 'Таможенное оформление грузов при импорте и экспорте: документы, расчёт платежей и сопровождение до выпуска.',
};

const services = [
  { icon: IconFileDescription, title: 'Подготовка документов', text: 'Проверяем инвойсы, упаковочные листы, контракты и сведения о товаре до подачи декларации.' },
  { icon: IconBox, title: 'Классификация товара', text: 'Помогаем определить код ТН ВЭД, требования к разрешительным документам и маркировке.' },
  { icon: IconFileInvoice, title: 'Расчёт платежей', text: 'Рассчитываем пошлины, НДС и дополнительные расходы, чтобы бюджет поставки был прозрачен.' },
  { icon: IconTruck, title: 'Оформление на маршруте', text: 'Синхронизируем выпуск с перевозкой, терминалом и доставкой до склада получателя.' },
];

const advantages = [
  { icon: IconShieldCheck, title: 'Меньше рисков', text: 'Находим неточности в документах до подачи и заранее обозначаем спорные места.' },
  { icon: IconMap2, title: 'Единая координация', text: 'Таможенный представитель и логист работают в одной команде и держат общий план.' },
  { icon: IconClipboardCheck, title: 'Понятный статус', text: 'Сообщаем, на каком этапе находится оформление и какие действия нужны дальше.' },
];

const steps = [
  { icon: IconClipboardCheck, text: 'Получаем описание груза, маршрут и документы' },
  { icon: IconFileDescription, text: 'Проверяем данные, код ТН ВЭД и разрешительные требования' },
  { icon: IconFileInvoice, text: 'Готовим декларацию и рассчитываем таможенные платежи' },
  { icon: IconCheck, text: 'Сопровождаем выпуск и передаём груз в доставку' },
];

export default function CustomsClearancePage() {
  return (
    <>
      <section className={styles.hero} style={{ backgroundImage: "url('/images/customs-clearance-hero.png')" }} aria-labelledby="customs-hero-title">
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <Box className={styles.heroBreadcrumbs}>
            <Anchor href="/" underline="never">Главная</Anchor><span aria-hidden="true">/</span>
            <Anchor href="/uslugi" underline="never">Услуги</Anchor><span aria-hidden="true">/</span>
            <Text component="span">Таможенное оформление</Text>
          </Box>
          <Title id="customs-hero-title" order={1} className={styles.heroTitle}>Таможенное оформление <span>без задержек</span></Title>
          <Text className={styles.heroDescription}>Берём на себя документы, расчёты и взаимодействие с участниками ВЭД, чтобы груз прошёл таможню предсказуемо и вовремя.</Text>
          <div className={styles.heroActions}><CalculationRequestModal label="Получить консультацию" size="lg" /></div>
        </div>
      </section>

      <section className={styles.intro} aria-labelledby="customs-intro-title">
        <div><Text className={styles.eyebrow}>Спокойствие в деталях</Text><Title id="customs-intro-title" order={2} className={styles.sectionTitle}>Оформление начинается задолго до границы</Title></div>
        <div className={styles.introCopy}><Text>Таможенное оформление — это не только подача декларации. Важно заранее сверить описание товара, документы, код ТН ВЭД и требования к ввозу.</Text><Text>Мы подключаемся на этапе планирования поставки, согласуем данные с перевозкой и сопровождаем груз до выпуска, чтобы решения принимались вовремя.</Text></div>
      </section>

      <section className={styles.transportSection} aria-labelledby="customs-services-title">
        <div className={styles.sectionHeading}><Text className={styles.eyebrow}>Что входит в сопровождение</Text><Title id="customs-services-title" order={2} className={styles.sectionTitle}>Собираем оформление в одну понятную услугу</Title></div>
        <div className={styles.transportGrid}>{services.map(({ icon: Icon, title, text }) => <article className={styles.transportCard} key={title}><Icon size={38} stroke={1.55} /><Title order={3}>{title}</Title><Text>{text}</Text></article>)}</div>
      </section>

      <section className={styles.terminalSection} aria-labelledby="customs-documents-title">
        <div className={styles.terminalImageWrap}><Image src="/images/customs-clearance-documents.png" alt="Подготовка документов для таможенного оформления" fill sizes="(max-width: 900px) 100vw, 50vw" className={styles.terminalImage} /><div className={styles.fact}><strong>Документы под контролем</strong><span>Проверяем комплект до подачи декларации и выпуска груза</span></div></div>
        <div className={styles.terminalContent}><Text className={styles.eyebrow}>Предварительная проверка</Text><Title id="customs-documents-title" order={2} className={styles.sectionTitle}>Находим неточности до того, как они станут задержкой</Title><Text>Сверяем коммерческие документы, описание и характеристики товара. Если нужны дополнительные сведения или разрешения, сообщаем об этом заранее и предлагаем понятный план действий.</Text><CalculationRequestModal label="Проверить поставку" /></div>
      </section>

      <section className={styles.advantages} aria-labelledby="customs-advantages-title"><Text className={styles.eyebrow}>Работа на опережение</Text><Title id="customs-advantages-title" order={2} className={styles.sectionTitle}>Предсказуемый процесс для бизнеса</Title><div className={styles.advantageGrid}>{advantages.map(({ icon: Icon, title, text }) => <article key={title} className={styles.advantageCard}><Icon size={42} stroke={1.5} /><Title order={3}>{title}</Title><Text>{text}</Text></article>)}</div></section>

      <section id="how-we-work" className={styles.workflow} aria-labelledby="customs-workflow-title"><div className={styles.sectionHeading}><Text className={styles.eyebrow}>Порядок работы</Text><Title id="customs-workflow-title" order={2} className={styles.sectionTitle}>Как проходит таможенное оформление</Title></div><ol className={styles.steps}>{steps.map(({ icon: Icon, text }, index) => <li key={text}><Icon className={styles.stepIcon} size={28} stroke={1.6} aria-hidden="true" /><span>0{index + 1}</span><Text>{text}</Text></li>)}</ol></section>

      <section className={styles.cta} aria-labelledby="customs-cta-title"><div><Text className={styles.ctaLabel}>Начните с консультации</Text><Title id="customs-cta-title" order={2}>Расскажите о поставке — проверим, что потребуется для выпуска</Title><Text>Пришлите маршрут, описание товара и доступные документы. Оценим задачу и вернёмся с перечнем шагов и расчётом.</Text></div><CalculationRequestModal label="Обсудить поставку" size="lg" /></section>
    </>
  );
}
