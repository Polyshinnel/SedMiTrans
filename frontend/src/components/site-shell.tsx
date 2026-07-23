import { Anchor, Box, Container, Group, Text } from '@mantine/core';
import type { ReactNode } from 'react';

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Anchor className="skip-link" href="#main-content">Перейти к содержанию</Anchor>
      <Box component="header" py="md" bg="white" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
        <Container size="lg">
          <Group justify="space-between">
            <Anchor href="/" fw={700} c="dark" underline="never">Седьмой Транс</Anchor>
            <Text size="sm" c="dimmed">Грузовые перевозки</Text>
          </Group>
        </Container>
      </Box>
      <Box component="main" id="main-content" tabIndex={-1}>{children}</Box>
      <Box component="footer" py="xl" bg="dark.9" c="white">
        <Container size="lg"><Text size="sm">© {new Date().getFullYear()} Седьмой Транс</Text></Container>
      </Box>
    </>
  );
}
