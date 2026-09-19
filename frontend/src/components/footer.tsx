import { Anchor, Box, Divider, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconMail, IconMapPin, IconPhone } from '@tabler/icons-react';
import Image from 'next/image';
import { CallbackRequestModal } from './callback-request-modal';
import styles from './footer.module.css';
import { SocialLinks } from './social-links';
import type { ContactSettings } from '@/lib/api/types';

const serviceLinks = [
  { label: 'Автоперевозки', href: '/uslugi/avtoperevozki' },
  { label: 'Железнодорожные перевозки', href: '/uslugi/zheleznodorozhnye-perevozki' },
  { label: 'Авиаперевозки', href: '/uslugi/aviaperevozki' },
  { label: 'Мультимодальные перевозки', href: '/uslugi/multimodalnye-perevozki' },
  { label: 'Негабаритные грузы', href: '/uslugi/negabaritnie-gruzy' },
  { label: 'Опасные грузы', href: '/uslugi/opasniye-gruzy' },
];

const additionalServiceLinks = [
  { label: 'Таможенное оформление', href: '/uslugi/tamozhennoe-oformlenie' },
  { label: 'Страхование грузов', href: '/uslugi/strahovanie-gruzov' },
  { label: 'Складская логистика', href: '/uslugi/skladskaya-logistika' },
  { label: 'Консультирование по вопросам ВЭД', href: '/uslugi/konsultirovanie-po-voprosam-ved' },
];

const companyLinks = [
  { label: 'О компании', href: '/about' },
  { label: 'Кейсы', href: '/kejsy' },
  { label: 'Контакты', href: '/contacts' },
];

function FooterLinks({ title, links }: { title: string; links: (string | { label: string; href: string })[] }) {
  return (
    <Stack gap="sm">
          <Text className={styles.columnTitle} fw={600} fz="lg" c="white">{title}</Text>
      <Stack gap="xs">
        {links.map((item) => {
          const link = typeof item === 'string' ? { label: item, href: '#' } : item;
          return <Anchor className={styles.footerLink} key={link.label} href={link.href} size="sm" c="white" underline="never">{link.label}</Anchor>;
        })}
      </Stack>
    </Stack>
  );
}

export function Footer({ contacts }: { contacts: ContactSettings }) {
  const phoneHref = `tel:${contacts.phone.replace(/[^+\d]/g, '')}`;

  return (
    <Box component="footer" id="contacts" bg="brandGray.6" className={styles.footer} style={{ padding: '40px var(--page-gutter)' }}>
      <Stack gap="xl">
        <SimpleGrid className={styles.linksGrid} cols={5} spacing="xl">
          <Stack gap="md">
            <Anchor href="/" w="fit-content" underline="never" aria-label="SedMiTrans — на главную">
              <Image className={styles.logo} src="/images/logo.svg" alt="SedMiTrans" width={142} height={76} />
            </Anchor>
            <Text className={styles.description} size="sm" c="white" maw={220}>Международные грузоперевозки по всему миру</Text>
            <SocialLinks telegramUrl={contacts.telegram_url} whatsappUrl={contacts.whatsapp_url} maxUrl={contacts.max_url} />
          </Stack>

          <FooterLinks title="Услуги" links={serviceLinks} />
          <FooterLinks title="Дополнительные услуги" links={additionalServiceLinks} />
          <FooterLinks title="Компания" links={companyLinks} />

          <Stack gap="sm">
            <Text className={styles.columnTitle} fw={600} fz="lg" c="white">Контакты</Text>
            <Group gap="sm" align="flex-start" wrap="nowrap">
              <IconPhone size={20} color="var(--color-brand-orange)" />
              <Anchor className={styles.footerLink} href={phoneHref} size="sm" c="white" underline="never">{contacts.phone}</Anchor>
            </Group>
            <Group gap="sm" align="flex-start" wrap="nowrap">
              <IconMail size={20} color="var(--color-brand-orange)" />
              <Anchor className={styles.footerLink} href={`mailto:${contacts.email}`} size="sm" c="brandOrange.6" underline="never">{contacts.email}</Anchor>
            </Group>
            <Group gap="sm" align="flex-start" wrap="nowrap">
              <IconMapPin size={20} color="var(--color-brand-orange)" />
              <Text className={styles.description} size="sm" c="white">{contacts.address}</Text>
            </Group>
            <CallbackRequestModal />
          </Stack>
        </SimpleGrid>

        <div className={styles.bottom}>
          <Group className={styles.legalLinks} gap="lg" wrap="nowrap">
            <Anchor className={styles.footerLink} href="/politika-obrabotki-personalnyh-dannyh" size="sm" c="white" underline="never">Политика обработки ПД</Anchor>
            <Anchor className={styles.footerLink} href="/soglasie-na-obrabotku-personalnyh-dannyh" size="sm" c="white" underline="never">Согласие на обработку персональных данных</Anchor>
          </Group>
          <Divider className={styles.bottomDivider} color="brandGray.4" />
          <Text className={styles.copyright} size="sm" c="white">2026 SedMiTrans. Все права защищены.</Text>
        </div>
      </Stack>
    </Box>
  );
}
