import { Button, Container, Stack, Text, Title } from '@mantine/core';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Страница не найдена', robots: { index: false, follow: false } };

export default function NotFound() {
  return <Container py="xl"><Stack><Title order={1}>Страница не найдена</Title><Text>Возможно, адрес был изменён или введён неверно.</Text><Button component="a" href="/" w="fit-content">На главную</Button></Stack></Container>;
}
