'use client';

import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { ReactNode } from 'react';
import { QuoteRequestForm } from '@/components/quote-request-form';
import { RequestSuccessModal } from '@/components/request-success-modal';
import styles from './calculation-request-modal.module.css';

export function CallbackRequestModal({ label = 'Перезвоните мне', size = 'sm', variant = 'transparent', color = 'brandOrange', className, rightSection }: { label?: string; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; variant?: 'transparent' | 'outline' | 'filled'; color?: string; className?: string; rightSection?: ReactNode }) {
  const [opened, { close, open }] = useDisclosure(false);
  const [successOpened, { close: closeSuccess, open: openSuccess }] = useDisclosure(false);

  const openRequest = () => {
    closeSuccess();
    open();
  };

  return (
    <>
      <Button className={className} component="button" color={color} variant={variant} size={size} p={variant === 'transparent' ? 0 : undefined} w={variant === 'transparent' ? 'fit-content' : undefined} fw={variant === 'transparent' ? 700 : undefined} rightSection={rightSection} onClick={openRequest}>
        {label}
      </Button>

      <Modal opened={opened} onClose={close} centered classNames={styles}>
        <QuoteRequestForm
          dark
          feedbackFields
          heading="Форма обратной связи"
          subtitle="Заполните поля и мы свяжемся с Вами в ближайшее время."
          onSuccess={() => {
            close();
            openSuccess();
          }}
        />
      </Modal>
      <RequestSuccessModal opened={successOpened} onClose={closeSuccess} />
    </>
  );
}
