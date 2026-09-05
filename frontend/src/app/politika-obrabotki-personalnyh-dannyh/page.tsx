import type { Metadata } from 'next';
import { LegalDocumentPage } from '@/components/legal-document';
import { policyDocument } from '@/components/legal-content';

export const metadata: Metadata = {
  title: 'Политика обработки персональных данных',
  robots: { index: false, follow: false },
};

export default function PersonalDataPolicyPage() {
  return <LegalDocumentPage document={policyDocument} />;
}
