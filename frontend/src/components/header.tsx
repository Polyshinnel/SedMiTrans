'use client';

import { Anchor, Box, Burger, Drawer, Group, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Image from 'next/image';
import { CalculationRequestModal } from '@/components/calculation-request-modal';
import { SocialLinks } from '@/components/social-links';
import type { ContactSettings } from '@/lib/api/types';
import styles from './header.module.css';

const navigation = [
  { label: 'Главная', href: '/' },
  { label: 'Услуги', href: '/uslugi' },
  { label: 'О компании', href: '/about' },
  { label: 'Кейсы', href: '/kejsy' },
  { label: 'Контакты', href: '/contacts' },
];

export function Header({ contacts }: { contacts: ContactSettings }) {
  const [opened, { close, toggle }] = useDisclosure(false);
  const phoneHref = `tel:${contacts.phone.replace(/[^+\d]/g, '')}`;

  return (
    <Box
      component="header"
      h={100}
      bg="brandGray.6"
      className={styles.header}
    >
      <Group h="100%" justify="space-between" wrap="nowrap" className={styles.desktopHeader}>
        <Anchor href="/" underline="never" aria-label="SedMiTrans — на главную">
          <Image src="/images/logo.svg" alt="SedMiTrans" width={142} height={76} priority />
        </Anchor>

        <Group component="nav" gap="25.6px" wrap="nowrap" aria-label="Основная навигация">
          {navigation.map(({ label, href }) => (
            <Anchor key={href} href={href} size="16px" c="white" underline="never" fw={500}>
              {label}
            </Anchor>
          ))}
        </Group>

        <Group gap="md" wrap="nowrap">
          <Stack gap={2}>
            <Anchor href={phoneHref} c="white" underline="never" fw={600}>{contacts.phone}</Anchor>
            <Anchor href={`mailto:${contacts.email}`} size="sm" c="white" underline="never">{contacts.email}</Anchor>
          </Stack>
          <SocialLinks telegramUrl={contacts.telegram_url} whatsappUrl={contacts.whatsapp_url} maxUrl={contacts.max_url} />
        </Group>
      </Group>

      <Group h="100%" justify="space-between" wrap="nowrap" className={styles.tabletHeader}>
        <Anchor href="/" underline="never" aria-label="SedMiTrans — на главную">
          <Image className={styles.mobileLogo} src="/images/logo.svg" alt="SedMiTrans" width={142} height={76} priority />
        </Anchor>
        <Burger opened={opened} onClick={toggle} color="white" size="28px" aria-label={opened ? 'Закрыть меню' : 'Открыть меню'} />
      </Group>

      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size={360}
        padding="xl"
        title="Меню"
        classNames={{ content: styles.drawer, header: styles.drawerHeader, title: styles.drawerTitle, close: styles.drawerClose, body: styles.drawerBody }}
        overlayProps={{ backgroundOpacity: 0.55, blur: 2 }}
      >
        <Stack gap="xl">
          <Stack component="nav" gap="lg" aria-label="Основная навигация">
            {navigation.map(({ label, href }) => (
              <Anchor key={href} href={href} className={styles.mobileNavLink} onClick={close}>
                {label}
              </Anchor>
            ))}
          </Stack>

          <Box className={styles.contacts}>
            <Text className={styles.contactsLabel}>Контакты</Text>
            <Stack gap={6}>
              <Anchor href={phoneHref} className={styles.contactLink}>{contacts.phone}</Anchor>
              <Anchor href={`mailto:${contacts.email}`} className={styles.contactLink}>{contacts.email}</Anchor>
            </Stack>
          </Box>

          <CalculationRequestModal label="Получить расчёт" size="md" />
        </Stack>
      </Drawer>
    </Box>
  );
}
