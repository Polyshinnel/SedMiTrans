import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import 'swiper/css';
import '@/styles/global.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { SiteShell } from '@/components/site-shell';
import { theme } from '@/styles/theme';

const manrope = localFont({
  src: '../fonts/manrope/Manrope[wght].ttf',
  variable: '--font-manrope',
  display: 'swap',
  weight: '200 800',
});

export const metadata: Metadata = {
  title: { default: 'SedMiTrans — логистические решения', template: '%s | SedMiTrans' },
  description: 'Грузовые перевозки и логистические решения.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:28180'),
  icons: { icon: '/images/favicon.svg' },
  openGraph: { type: 'website', locale: 'ru_RU', siteName: 'Седьмой Транс', title: 'Седьмой Транс', description: 'Грузовые перевозки и логистические решения.', images: ['/og-default.svg'] },
};

export const viewport: Viewport = { colorScheme: 'light' };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head><ColorSchemeScript defaultColorScheme="light" /></head>
      <body className={`${manrope.variable} ${manrope.className}`}>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Notifications />
          <SiteShell>{children}</SiteShell>
        </MantineProvider>
      </body>
    </html>
  );
}
