'use client';

import { Button, Container, Stack, Text, Title } from '@mantine/core';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error('Route render failed', { digest: error.digest }); }, [error.digest]);
  return <Container py="xl"><Stack><Title order={1}>Не удалось загрузить страницу</Title><Text>Попробуйте обновить страницу позднее.</Text><Button onClick={reset} w="fit-content">Повторить</Button></Stack></Container>;
}
