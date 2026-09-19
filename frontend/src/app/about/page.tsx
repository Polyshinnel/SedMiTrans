import { Anchor, Box, Button, Container, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconArrowRight, IconChartDots3, IconDownload, IconFileTypeDocx, IconFileTypePdf, IconRoute, IconShieldCheck, IconUsers } from '@tabler/icons-react';
import { CallbackRequestModal } from '@/components/callback-request-modal';
import { CalculationFormSection } from '@/components/calculation-form-section';
import { StatsSection } from '@/components/stats-section';
import styles from './page.module.css';
import { getSeoPage } from '@/lib/api/server';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export async function generateMetadata() { return buildSeoMetadata(await getSeoPage('about')); }

const principles = [
  { icon: IconRoute, title: 'Маршрут под задачу', text: 'Подбираем оптимальную схему перевозки с учётом сроков, бюджета и особенностей груза.' },
  { icon: IconShieldCheck, title: 'Ответственность за результат', text: 'Контролируем движение груза на каждом этапе и заранее предупреждаем о важных изменениях.' },
  { icon: IconUsers, title: 'Люди рядом', text: 'За каждым проектом закреплён специалист, который знает детали и всегда остаётся на связи.' },
  { icon: IconChartDots3, title: 'Прозрачная аналитика', text: 'Предоставляем понятные статусы, документы и расчёты, чтобы решения принимались уверенно.' },
];

const documents = [
  { icon: IconFileTypeDocx, title: 'Карточка контрагента', href: '/docs/contractor-card.docx' },
  { icon: IconFileTypePdf, title: 'Выписка из реестра о транспортно-экспидиционной деятельности', href: '/docs/transport-forwarding-registry-extract.pdf' },
  { icon: IconFileTypePdf, title: 'Свидетельство о постановке на учет', href: '/docs/tax-registration-certificate.pdf' },
];

export default function AboutPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroImage} />
        <Container size="xl" className={styles.heroContainer}>
          <div className={styles.heroCopy}>
            <Box className={styles.heroBreadcrumbs}>
              <Anchor href="/" underline="never">Главная</Anchor>
              <span aria-hidden="true">/</span>
              <Text component="span" c="dimmed">О компании</Text>
            </Box>
            <Title order={2} mt="lg">Доставляем больше, чем груз</Title>
            <Text mt="lg" c="dimmed" lh={1.7}>
              Мы соединяем бизнес и возможности, помогая товарам двигаться между городами и странами без лишних сложностей. Берём на себя логистику, чтобы вы могли сосредоточиться на развитии.
            </Text>
            <Box mt="xl">
              <CallbackRequestModal label="Обсудить задачу" size="lg" variant="filled" color="brandOrange" rightSection={<IconArrowRight size={18} />} />
            </Box>
          </div>
        </Container>
      </section>

      <Container size="xl" className={styles.story}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 40, md: 90 }}>
          <Stack gap="lg">
            <Text className={styles.eyebrow}>Наша история</Text>
            <Title order={2}>Логистика, которой можно доверять</Title>
          </Stack>
          <Stack gap="md" c="dimmed" lh={1.75}>
            <Text>Каждая перевозка начинается с внимательного разговора. Мы разбираемся в задаче, учитываем контекст и собираем решение, которое работает именно для вашего бизнеса.</Text>
            <Text>Команда SedMiTrans объединяет экспертизу в автомобильных, железнодорожных, авиационных и мультимодальных перевозках. От первого расчёта до доставки — мы остаёмся на вашей стороне.</Text>
          </Stack>
        </SimpleGrid>
      </Container>

      <section className={styles.documentsSection}>
        <Container size="xl">
          <Stack gap="xs" mb="xl" className={styles.documentsHeading}>
            <Text className={styles.eyebrow}>Документы</Text>
            <Title order={2}>Наши документы</Title>
          </Stack>
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
            {documents.map(({ icon: Icon, title, href }) => (
              <Paper key={title} className={styles.documentCard} radius="md" p="xl">
                <Icon className={styles.documentIcon} size={64} stroke={1.5} />
                <Text className={styles.documentTitle} mt="lg" fw={600}>{title}</Text>
                <Button
                  component="a"
                  href={href}
                  download
                  variant="subtle"
                  color="brandOrange"
                  mt="xl"
                  px={0}
                  rightSection={<IconDownload size={17} />}
                >
                  Скачать документ
                </Button>
              </Paper>
            ))}
          </SimpleGrid>
        </Container>
      </section>

      <section className={styles.principlesSection}>
        <Container size="xl">
          <Group justify="space-between" align="end" mb="xl" className={styles.sectionHeading}>
            <Stack gap="xs">
              <Text className={styles.eyebrow}>Как мы работаем</Text>
              <Title order={2}>Принципы, которые держат маршрут</Title>
            </Stack>
            <Text c="dimmed" maw={360} lh={1.6}>Понятный процесс, внимательная команда и решения, которые выдерживают реальный темп бизнеса.</Text>
          </Group>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
            {principles.map(({ icon: Icon, title, text }) => (
              <Paper key={title} className={styles.principleCard} radius="md" p="xl">
                <ThemeIcon color="brandOrange" variant="light" size={52} radius="xl"><Icon size={24} stroke={1.7} /></ThemeIcon>
                <Title order={3} mt="xl" fz="lg">{title}</Title>
                <Text mt="sm" size="sm" c="dimmed" lh={1.65}>{text}</Text>
              </Paper>
            ))}
          </SimpleGrid>
        </Container>
      </section>

      <div className={styles.statsSpacing}>
        <StatsSection />
      </div>

      <CalculationFormSection />
    </>
  );
}
