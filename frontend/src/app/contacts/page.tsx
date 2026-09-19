import { ActionIcon, Anchor, Badge, Box, Button, Container, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconArrowUpRight, IconBrandTelegram, IconBrandWhatsapp, IconClock, IconMail, IconMapPin, IconMessageCircle, IconPhone } from '@tabler/icons-react';
import { CallbackRequestModal } from '@/components/callback-request-modal';
import { CalculationRequestModal } from '@/components/calculation-request-modal';
import { YandexMap } from '@/components/yandex-map';
import { getContactSettings } from '@/lib/api/server';
import styles from './page.module.css';
import { getSeoPage } from '@/lib/api/server';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export async function generateMetadata() { return buildSeoMetadata(await getSeoPage('contacts')); }

export default async function ContactsPage() {
  const settings = await getContactSettings();
  const phoneHref = `tel:${settings.phone.replace(/[^+\d]/g, '')}`;
  const mapUrl = `https://yandex.ru/maps/?pt=${settings.longitude},${settings.latitude}&z=16&l=map`;
  const contacts = [
    { icon: IconPhone, label: 'Телефон', value: settings.phone, href: phoneHref, detail: 'Звонок по России бесплатный' },
    { icon: IconMail, label: 'Электронная почта', value: settings.email, href: `mailto:${settings.email}`, detail: 'Ответим в течение рабочего дня' },
    { icon: IconMapPin, label: 'Офис', value: settings.address, href: mapUrl, detail: 'Деловой центр «Неман»' },
  ];

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
            <Group gap="md"><Button component="a" href={phoneHref} color="brandOrange" size="lg">Позвонить нам</Button><CallbackRequestModal label="Оставить заявку" size="lg" variant="outline" color="white" className={styles.heroRequestButton} /></Group>
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
              <Group mt="xl" gap="sm" align="flex-start" wrap="nowrap"><ThemeIcon color="brandOrange" variant="light" radius="xl"><IconClock size={18} /></ThemeIcon><Stack gap={2}><Text fw={700}>Режим работы</Text><Text size="sm" c="dimmed">{settings.working_hours}</Text></Stack></Group>
              <Button component="a" href={mapUrl} target="_blank" rel="noreferrer" rightSection={<IconArrowUpRight size={18} />} variant="light" color="brandOrange" mt="xl">Построить маршрут</Button>
            </Box>
            <Box className={styles.map}><YandexMap latitude={settings.latitude} longitude={settings.longitude} fallbackUrl={mapUrl} /></Box>
          </SimpleGrid>
        </Container>
      </section>

      <Container size="xl" className={styles.bottomSection}>
        <Paper className={styles.cta} radius="md" p={{ base: 'xl', sm: 46 }}>
          <Stack align="center" gap="md">
            <Group gap="sm">
              <ActionIcon component="a" href={settings.telegram_url || '#'} aria-label="Telegram" variant="filled" color="white" c="brandGray.6" radius="xl" size="lg"><IconBrandTelegram size={19} stroke={1.8} /></ActionIcon>
              <ActionIcon component="a" href={settings.whatsapp_url || '#'} aria-label="WhatsApp" variant="filled" color="white" c="brandGray.6" radius="xl" size="lg"><IconBrandWhatsapp size={19} stroke={1.8} /></ActionIcon>
              <ActionIcon component="a" href={settings.max_url || '#'} aria-label="MAX" variant="filled" color="white" c="brandGray.6" radius="xl" size="lg"><IconMessageCircle size={19} stroke={1.8} /></ActionIcon>
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
