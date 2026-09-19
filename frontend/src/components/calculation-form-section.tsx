'use client';

import { Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { QuoteRequestForm } from '@/components/quote-request-form';
import { RequestSuccessModal } from '@/components/request-success-modal';
import styles from './calculation-form-section.module.css';

export function CalculationFormSection() {
  const [successOpened, { close: closeSuccess, open: openSuccess }] = useDisclosure(false);

  return (
    <>
      <section id="calculation" className={styles.section}>
        <Title order={2} className={styles.heading}>Получите расчет стоимости перевозки</Title>
        <div className={styles.form}>
          <QuoteRequestForm dark calculationFields calculationGrid submitLabel="Получить расчет" onSuccess={openSuccess} />
        </div>
      </section>
      <RequestSuccessModal opened={successOpened} onClose={closeSuccess} />
    </>
  );
}
