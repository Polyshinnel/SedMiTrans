import { AdditionalServices } from '@/components/additional-services';
import { AboutCompany } from '@/components/about-company';
import { AdvantagesSection } from '@/components/advantages-section';
import { CalculationFormSection } from '@/components/calculation-form-section';
import { DeliveryAdvisor } from '@/components/delivery-advisor';
import { HeroBanner } from '@/components/hero-banner';
import { SpecialTransport } from '@/components/special-transport';
import { StatsSection } from '@/components/stats-section';
import { TransportDirections } from '@/components/transport-directions';
import { WorkflowSection } from '@/components/workflow-section';

// The public landing page is intentionally request-time SSR; future CMS content
// can be added with an explicit revalidate policy instead of changing this implicitly.
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <AdvantagesSection />
      <TransportDirections />
      <SpecialTransport />
      <AdditionalServices />
      <WorkflowSection />
      <DeliveryAdvisor />
      <StatsSection />
      <AboutCompany />
      <CalculationFormSection />
    </>
  );
}
