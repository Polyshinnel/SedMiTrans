'use client';

import { Button, Modal, Stack, Text, Title } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import styles from './calculation-request-modal.module.css';

export function RequestSuccessModal({ opened, onClose }: { opened: boolean; onClose: () => void }) {
  return (
    <Modal opened={opened} onClose={onClose} centered classNames={styles}>
      <Stack className={styles.success} align="center" gap="md">
        <IconCircleCheck className={styles.successIcon} size={72} stroke={1.5} aria-hidden="true" />
        <Title order={2} className={styles.successTitle}>Заявка отправлена</Title>
        <Text className={styles.successText}>Спасибо! Мы скоро свяжемся с Вами!</Text>
        <Button color="brandOrange" c="white" onClick={onClose}>Закрыть окно</Button>
      </Stack>
    </Modal>
  );
}
