import { Anchor, Box } from '@mantine/core';
import type { ReactNode } from 'react';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Anchor className="skip-link" href="#main-content">Перейти к содержанию</Anchor>
      <Box mih="100dvh" style={{ display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box component="main" id="main-content" tabIndex={-1} style={{ flex: 1 }}>{children}</Box>
        <Footer />
      </Box>
    </>
  );
}
