'use client';

import { Anchor, Box, Burger, Drawer, Group, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Image from 'next/image';
import { CalculationRequestModal } from '@/components/calculation-request-modal';
import styles from './header.module.css';

const navigation = [
  { label: 'Главная', href: '/' },
  { label: 'Услуги', href: '/uslugi' },
  { label: 'О компании', href: '/about' },
  { label: 'Кейсы', href: '/kejsy' },
  { label: 'Контакты', href: '/contacts' },
];

export function Header() {
  const [opened, { close, toggle }] = useDisclosure(false);

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
            <Anchor href="tel:+74951234567" c="white" underline="never" fw={600}>+7 (495) 123-45-67</Anchor>
            <Anchor href="mailto:info@sedmitrans.ru" size="sm" c="white" underline="never">info@sedmitrans.ru</Anchor>
          </Stack>
          <CalculationRequestModal />
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
              <Anchor href="tel:+74951234567" className={styles.contactLink}>+7 (495) 123-45-67</Anchor>
              <Anchor href="mailto:info@sedmitrans.ru" className={styles.contactLink}>info@sedmitrans.ru</Anchor>
            </Stack>
          </Box>

          <CalculationRequestModal label="Получить расчёт" size="md" />
        </Stack>
      </Drawer>
    </Box>
  );
}
