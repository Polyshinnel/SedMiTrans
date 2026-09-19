import { Anchor, Breadcrumbs, Text, Title } from '@mantine/core';
import { AdditionalServices } from '@/components/additional-services';
import { CalculationFormSection } from '@/components/calculation-form-section';
import { SpecialTransport } from '@/components/special-transport';
import { TransportDirections } from '@/components/transport-directions';
import styles from './page.module.css';
import { getSeoPage } from '@/lib/api/server';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export async function generateMetadata() { return buildSeoMetadata(await getSeoPage('services')); }

export default function ServicesPage() {
  return (
    <>
      <section className={styles.intro}>
        <Breadcrumbs separator="/" className={styles.breadcrumbs}>
          <Anchor href="/" underline="never">Главная</Anchor>
          <Text c="dimmed">Услуги</Text>
        </Breadcrumbs>
        <Title order={1} className={styles.title}>Услуги</Title>
      </section>

      <TransportDirections showHeading={false} />
      <SpecialTransport />
      <AdditionalServices />
      <CalculationFormSection />
    </>
  );
}
