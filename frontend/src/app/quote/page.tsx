import { Container, Stack, Text, Title } from '@mantine/core';
import { QuoteRequestForm } from '@/components/quote-request-form';

// Content is code-owned until a public Content API and its cache policy exist.
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Рассчитать перевозку' };

export default function QuotePage() {
  return (
    <Container size="sm" py={{ base: 'xl', sm: 80 }}>
      <Stack gap="md">
        <Title order={1}>Рассчитать стоимость перевозки</Title>
        <Text c="dimmed">Оставьте контакты и кратко опишите задачу. Мы свяжемся с вами, чтобы подготовить расчёт.</Text>
        <QuoteRequestForm />
      </Stack>
    </Container>
  );
}
