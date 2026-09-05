import { Anchor, Box, Group, Stack } from '@mantine/core';
import Image from 'next/image';
import { CalculationRequestModal } from '@/components/calculation-request-modal';

const navigation = [
  { label: 'Главная', href: '/' },
  { label: 'Услуги', href: '/uslugi' },
  { label: 'О компании', href: '/about' },
  { label: 'Кейсы', href: '/#cases' },
  { label: 'Контакты', href: '/contacts' },
];

export function Header() {
  return (
    <Box
      component="header"
      h={100}
      bg="brandGray.6"
      style={{ paddingInline: '130px' }}
    >
      <Group h="100%" justify="space-between" wrap="nowrap">
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
    </Box>
  );
}
