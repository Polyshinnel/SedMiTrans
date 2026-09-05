import type { Metadata } from 'next';
import { LegalDocumentPage } from '@/components/legal-document';
import { consentDocument } from '@/components/legal-content';

export const metadata: Metadata = {
  title: 'Согласие на обработку персональных данных',
  robots: { index: false, follow: false },
};

export default function ConsentPage() {
  return <LegalDocumentPage document={consentDocument} />;
}
