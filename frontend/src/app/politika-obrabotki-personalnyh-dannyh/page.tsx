import { LegalDocumentPage } from '@/components/legal-document';
import { policyDocument } from '@/components/legal-content';
import { getSeoPage } from '@/lib/api/server';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return buildSeoMetadata(await getSeoPage('personal-data-policy'), { robots: { index: false, follow: false } });
}

export default function PersonalDataPolicyPage() {
  return <LegalDocumentPage document={policyDocument} />;
}
