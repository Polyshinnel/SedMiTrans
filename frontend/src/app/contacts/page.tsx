import { ActionIcon, Anchor, Badge, Box, Button, Container, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconArrowUpRight, IconBrandTelegram, IconBrandWhatsapp, IconClock, IconMail, IconMapPin, IconMessageCircle, IconPhone } from '@tabler/icons-react';
import { CalculationRequestModal } from '@/components/calculation-request-modal';
import { YandexMap } from '@/components/yandex-map';
import styles from './page.module.css';

export const metadata = {
  title: 'Контакты',
  description: 'Свяжитесь с командой SedMiTrans в Смоленске для организации перевозки.',
};

const contacts = [
  { icon: IconPhone, label: 'Телефон', value: '+7 (495) 123-45-67', href: 'tel:+74951234567', detail: 'Звонок по России бесплатный' },
  { icon: IconMail, label: 'Электронная почта', value: 'info@sedmitrans.ru', href: 'mailto:info@sedmitrans.ru', detail: 'Ответим в течение рабочего дня' },
  { icon: IconMapPin, label: 'Офис', value: 'г. Смоленск, ул. Нормандия-Неман, д. 35', href: 'https://yandex.ru/maps/?pt=32.0162,54.77908&z=16&l=map', detail: 'Деловой центр «Неман»' },
];

export default function ContactsPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <Container size="xl" className={styles.heroContent}>
          <Stack gap="xl" maw={690}>
            <Box className={styles.heroBreadcrumbs}>
              <Anchor href="/" underline="never">Главная</Anchor>
              <span aria-hidden="true">/</span>
              <Text component="span">Контакты</Text>
            </Box>
            <Title order={1} className={styles.heroTitle}>SedMiTrans — <span className={styles.heroAccent}>надежная доставка</span></Title>
            <Text className={styles.heroText}>Расскажите о маршруте и грузе — специалист предложит удобный способ перевозки, сроки и рассчитает стоимость.</Text>
            <Group gap="md"><Button component="a" href="tel:+74951234567" color="brandOrange" size="lg">Позвонить нам</Button><Button component="a" href="/quote" variant="outline" color="white" size="lg">Оставить заявку</Button></Group>
          </Stack>
        </Container>
      </section>

      <Container size="xl" className={styles.section}>
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
          {contacts.map(({ icon: Icon, label, value, href, detail }) => (
            <Paper key={label} className={styles.contactCard} radius="md" p="xl">
              <ThemeIcon size={52} radius="xl" color="brandOrange" variant="light"><Icon size={25} stroke={1.8} /></ThemeIcon>
              <Text mt="lg" c="dimmed" size="sm">{label}</Text>
              <Anchor href={href} target={label === 'Офис' ? '_blank' : undefined} rel={label === 'Офис' ? 'noreferrer' : undefined} className={styles.contactValue}>{value}</Anchor>
              <Text mt="sm" size="sm" c="dimmed">{detail}</Text>
            </Paper>
          ))}
        </SimpleGrid>
      </Container>

      <section className={styles.mapSection}>
        <Container size="xl">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={0} className={styles.mapLayout}>
            <Box className={styles.mapCopy}>
              <Badge color="brandOrange" variant="light" radius="sm">Как нас найти</Badge>
              <Title order={2} mt="md">Приезжайте в наш офис</Title>
              <Text mt="md" c="dimmed" lh={1.65}>Встретимся, обсудим задачу и подготовим логистическое решение. Если удобнее — проведём консультацию по телефону или в мессенджере.</Text>
              <Group mt="xl" gap="sm" align="flex-start" wrap="nowrap"><ThemeIcon color="brandOrange" variant="light" radius="xl"><IconClock size={18} /></ThemeIcon><Stack gap={2}><Text fw={700}>Режим работы</Text><Text size="sm" c="dimmed">Пн–Пт: 09:00–18:00, Сб–Вс: выходной</Text></Stack></Group>
              <Button component="a" href="https://yandex.ru/maps/?pt=32.0162,54.77908&z=16&l=map" target="_blank" rel="noreferrer" rightSection={<IconArrowUpRight size={18} />} variant="light" color="brandOrange" mt="xl">Построить маршрут</Button>
            </Box>
            <Box className={styles.map}><YandexMap /></Box>
          </SimpleGrid>
        </Container>
      </section>

      <Container size="xl" className={styles.bottomSection}>
        <Paper className={styles.cta} radius="md" p={{ base: 'xl', sm: 46 }}>
          <Stack align="center" gap="md">
            <Group gap="sm">
              <ActionIcon component="a" href="#" aria-label="Telegram" variant="filled" color="white" c="brandGray.6" radius="xl" size="lg"><IconBrandTelegram size={19} stroke={1.8} /></ActionIcon>
              <ActionIcon component="a" href="#" aria-label="WhatsApp" variant="filled" color="white" c="brandGray.6" radius="xl" size="lg"><IconBrandWhatsapp size={19} stroke={1.8} /></ActionIcon>
              <ActionIcon component="a" href="#" aria-label="MAX" variant="filled" color="white" c="brandGray.6" radius="xl" size="lg"><IconMessageCircle size={19} stroke={1.8} /></ActionIcon>
            </Group>
            <Title order={2} ta="center" c="white">Нужен расчёт перевозки?</Title>
            <Text ta="center" c="gray.2" maw={580}>Оставьте заявку на сайте, или напишите нам в соц сетях</Text>
            <CalculationRequestModal label="Получить расчет" size="lg" />
          </Stack>
        </Paper>
      </Container>
    </>
  );
}
