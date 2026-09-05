import { Anchor, Breadcrumbs, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';
import styles from './legal-document.module.css';

export type LegalDocument = {
  title: string;
  paragraphs: string[];
};

function renderParagraph(paragraph: string, index: number): ReactNode {
  const isSectionHeading = /^\d+\.\s/.test(paragraph);
  const isBullet = paragraph.startsWith('- ');
  const className = isSectionHeading ? styles.sectionHeading : isBullet ? styles.bullet : styles.paragraph;

  return <p key={`${index}-${paragraph}`} className={className}>{paragraph}</p>;
}

export function LegalDocumentPage({ document }: { document: LegalDocument }) {
  return (
    <div className={styles.page}>
      <Breadcrumbs separator="/" className={styles.breadcrumbs}>
        <Anchor href="/" underline="never">Главная</Anchor>
        <Text c="dimmed">{document.title}</Text>
      </Breadcrumbs>

      <Title order={1} className={styles.title}>{document.title}</Title>

      <article className={styles.document}>
        {document.paragraphs.map(renderParagraph)}
      </article>
    </div>
  );
}
