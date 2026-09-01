import { ActionIcon, Anchor, Box, Button, Divider, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconBrandTelegram, IconBrandWhatsapp, IconMail, IconMapPin, IconMessageCircle, IconPhone } from '@tabler/icons-react';
import Image from 'next/image';

const serviceLinks = [
  { label: 'Автоперевозки', href: '/avtoperevozki' },
  { label: 'Железнодорожные перевозки', href: '/zheleznodorozhnye-perevozki' },
  { label: 'Авиаперевозки', href: '/aviaperevozki' },
  { label: 'Мультимодальные перевозки', href: '/multimodalnye-perevozki' },
  'Сборные грузы',
  'Проектные грузы',
];

const additionalServiceLinks = [
  'Таможенное оформление',
  'Страхование грузов',
  'Складская логистика',
  'Консультирование по вопросам ВЭД',
];

const companyLinks = ['О компании', 'Преимущества', 'Отрасли', { label: 'Контакты', href: '/contacts' }];

function FooterLinks({ title, links }: { title: string; links: (string | { label: string; href: string })[] }) {
  return (
    <Stack gap="sm">
      <Text fw={600} fz="lg" c="white">{title}</Text>
      <Stack gap="xs">
        {links.map((item) => {
          const link = typeof item === 'string' ? { label: item, href: '#' } : item;
          return <Anchor key={link.label} href={link.href} size="sm" c="white" underline="never">{link.label}</Anchor>;
        })}
      </Stack>
    </Stack>
  );
}

export function Footer() {
  return (
    <Box component="footer" id="contacts" bg="brandGray.6" style={{ padding: '40px 130px' }}>
      <Stack gap="xl">
        <SimpleGrid cols={5} spacing="xl">
          <Stack gap="md">
            <Anchor href="/" w="fit-content" underline="never" aria-label="SedMiTrans — на главную">
              <Image src="/images/logo.svg" alt="SedMiTrans" width={142} height={76} />
            </Anchor>
            <Text size="sm" c="white" maw={220}>Международные грузоперевозки по всему миру</Text>
            <Group gap="sm">
              <ActionIcon component="a" href="#" aria-label="Telegram" variant="filled" color="white" c="brandGray.6" radius="xl" size="lg">
                <IconBrandTelegram size={19} stroke={1.8} />
              </ActionIcon>
              <ActionIcon component="a" href="#" aria-label="WhatsApp" variant="filled" color="white" c="brandGray.6" radius="xl" size="lg">
                <IconBrandWhatsapp size={19} stroke={1.8} />
              </ActionIcon>
              <ActionIcon component="a" href="#" aria-label="MAX" variant="filled" color="white" c="brandGray.6" radius="xl" size="lg">
                <IconMessageCircle size={19} stroke={1.8} />
              </ActionIcon>
            </Group>
          </Stack>

          <FooterLinks title="Услуги" links={serviceLinks} />
          <FooterLinks title="Дополнительные услуги" links={additionalServiceLinks} />
          <FooterLinks title="Компания" links={companyLinks} />

          <Stack gap="sm">
            <Text fw={600} fz="lg" c="white">Контакты</Text>
            <Group gap="sm" align="flex-start" wrap="nowrap">
              <IconPhone size={20} color="var(--color-brand-orange)" />
              <Anchor href="tel:+74951233456" size="sm" c="white" underline="never">+7(495)-123-34-56</Anchor>
            </Group>
            <Group gap="sm" align="flex-start" wrap="nowrap">
              <IconMail size={20} color="var(--color-brand-orange)" />
              <Anchor href="mailto:info@sedmitrans.ru" size="sm" c="brandOrange.6" underline="never">info@sedmitrans.ru</Anchor>
            </Group>
            <Group gap="sm" align="flex-start" wrap="nowrap">
              <IconMapPin size={20} color="var(--color-brand-orange)" />
              <Text size="sm" c="white">г. Смоленск, ул. Нормандия-Неман д.35</Text>
            </Group>
            <Button component="a" href="/quote" variant="transparent" color="brandOrange" p={0} w="fit-content" fw={700}>
              Перезвоните мне
            </Button>
          </Stack>
        </SimpleGrid>

        <Divider color="brandGray.4" />

        <Group justify="space-between" wrap="nowrap">
          <Text size="sm" c="white">2026 SedMiTrans. Все права защищены.</Text>
          <Group gap="lg" wrap="nowrap">
            <Anchor href="#" size="sm" c="white" underline="never">Политика конфиденциальности</Anchor>
            <Anchor href="#" size="sm" c="white" underline="never">Согласие на обработку персональных данных</Anchor>
          </Group>
        </Group>
      </Stack>
    </Box>
  );
}
