'use client';

import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { QuoteRequestForm } from '@/components/quote-request-form';
import styles from './calculation-request-modal.module.css';

export function CalculationRequestModal({ label = 'Получить расчёт', size = 'md' }: { label?: string; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) {
  const [opened, { close, open }] = useDisclosure(false);

  return (
    <>
      <Button color="brandOrange" c="white" radius="md" size={size} onClick={open}>
        {label}
      </Button>

      <Modal opened={opened} onClose={close} centered classNames={styles}>
        <QuoteRequestForm dark calculationFields heading="Получите расчет стоимости перевозки" />
      </Modal>
    </>
  );
}
