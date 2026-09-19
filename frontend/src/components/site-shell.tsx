import { Anchor, Box } from '@mantine/core';
import type { ReactNode } from 'react';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ScrollToTop } from '@/components/scroll-to-top';
import { getContactSettings } from '@/lib/api/server';

export async function SiteShell({ children }: { children: ReactNode }) {
  const contacts = await getContactSettings();

  return (
    <>
      <Anchor className="skip-link" href="#main-content">Перейти к содержанию</Anchor>
      <Box mih="100dvh" style={{ display: 'flex', flexDirection: 'column' }}>
        <Header contacts={contacts} />
        <Box component="main" id="main-content" tabIndex={-1} style={{ flex: 1 }}>{children}</Box>
        <Footer contacts={contacts} />
      </Box>
      <ScrollToTop />
    </>
  );
}
