import { ActionIcon, Group } from '@mantine/core';
import { IconBrandTelegram, IconBrandWhatsapp, IconMessageCircle } from '@tabler/icons-react';

export function SocialLinks({ telegramUrl = '', whatsappUrl = '', maxUrl = '' }: { telegramUrl?: string; whatsappUrl?: string; maxUrl?: string }) {
  return (
    <Group gap="sm">
      <ActionIcon component="a" href={telegramUrl || '#'} aria-label="Telegram" variant="filled" color="white" c="brandGray.6" radius="xl" size="lg">
        <IconBrandTelegram size={19} stroke={1.8} />
      </ActionIcon>
      <ActionIcon component="a" href={whatsappUrl || '#'} aria-label="WhatsApp" variant="filled" color="white" c="brandGray.6" radius="xl" size="lg">
        <IconBrandWhatsapp size={19} stroke={1.8} />
      </ActionIcon>
      <ActionIcon component="a" href={maxUrl || '#'} aria-label="MAX" variant="filled" color="white" c="brandGray.6" radius="xl" size="lg">
        <IconMessageCircle size={19} stroke={1.8} />
      </ActionIcon>
    </Group>
  );
}
