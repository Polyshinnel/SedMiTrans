'use client';

import { Alert, Button, Paper, Stack, Text, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRef, useState } from 'react';
import { browserApi } from '@/lib/api/browser';
import { ApiError } from '@/lib/api/types';

type QuoteValues = { name: string; phone: string; email: string; message: string };
type QuoteResponse = { data: { id: string; status: string } };
const initialValues: QuoteValues = { name: '', phone: '', email: '', message: '' };

function errorText(error: ApiError): string {
  if (error.kind === 'rate_limit') return 'Слишком много попыток. Пожалуйста, подождите и повторите отправку.';
  if (error.kind === 'network') return 'Не удалось связаться с сервером. Проверьте соединение и повторите попытку.';
  return 'Не удалось отправить заявку. Попробуйте ещё раз или сообщите номер обращения поддержке.';
}

export function QuoteRequestForm() {
  const form = useForm<QuoteValues>({
    initialValues,
    validate: {
      name: (value) => value.trim().length > 0 ? null : 'Укажите имя',
      phone: (value) => /^[+0-9()\s-]{7,32}$/.test(value) ? null : 'Укажите телефон',
      email: (value) => value === '' || /^\S+@\S+\.\S+$/.test(value) ? null : 'Укажите корректный email',
    },
  });
  const idempotencyKey = useRef<string | null>(null);
  const [error, setError] = useState<{ text: string; requestId?: string } | null>(null);
  const [success, setSuccess] = useState(false);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);

  const submit = async (values: QuoteValues) => {
    setError(null);
    setSuccess(false);
    idempotencyKey.current ??= crypto.randomUUID();

    try {
      await browserApi<QuoteResponse>('/leads/quote-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey.current },
        body: JSON.stringify(values),
      });
      form.reset();
      idempotencyKey.current = null;
      setSuccess(true);
    } catch (caught) {
      const apiError = caught instanceof ApiError ? caught : new ApiError('network', 0);
      if (apiError.kind === 'validation') {
        const fields = apiError.errors ?? {};
        const knownFields = new Set<keyof QuoteValues>(['name', 'phone', 'email', 'message']);
        const unknown = Object.keys(fields).some((field) => !knownFields.has(field as keyof QuoteValues));
        form.setErrors(Object.fromEntries(Object.entries(fields).filter(([field]) => knownFields.has(field as keyof QuoteValues)).map(([field, messages]) => [field, messages[0] ?? 'Некорректное значение'])));
        if (!unknown) return;
        // Consumers may attach telemetry to this event; user payload is never exposed.
        window.dispatchEvent(new CustomEvent('quote-request-error', { detail: { status: apiError.status, requestId: apiError.requestId } }));
      }
      if (apiError.kind === 'rate_limit' && apiError.retryAfter) {
        setRetryAfter(apiError.retryAfter);
        window.setTimeout(() => setRetryAfter(null), apiError.retryAfter * 1000);
      }
      setError({ text: errorText(apiError), requestId: apiError.requestId });
    }
  };

  return (
    <Paper component="form" withBorder p="lg" radius="md" onSubmit={form.onSubmit(submit)}>
      <Stack>
        <TextInput label="Имя" required autoComplete="name" {...form.getInputProps('name')} />
        <TextInput label="Телефон" required autoComplete="tel" inputMode="tel" {...form.getInputProps('phone')} />
        <TextInput label="Email" type="email" autoComplete="email" {...form.getInputProps('email')} />
        <Textarea label="Что нужно перевезти" minRows={4} {...form.getInputProps('message')} />
        {error && <Alert color="red" title="Заявка не отправлена">{error.text}{error.requestId && <Text size="sm" mt="xs">Номер обращения: {error.requestId}</Text>}</Alert>}
        {success && <Alert color="green" title="Заявка отправлена">Спасибо! Мы скоро свяжемся с вами.</Alert>}
        <Button type="submit" loading={form.submitting} disabled={retryAfter !== null}>
          {retryAfter === null ? 'Отправить заявку' : `Повторите через ${retryAfter} сек.`}
        </Button>
      </Stack>
    </Paper>
  );
}
