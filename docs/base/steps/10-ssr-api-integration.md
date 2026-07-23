# Шаг 10. Завершить сквозной SSR/API vertical slice

## Цель

Соединить Next.js, Laravel Lead API, MySQL, event/job, Filament и media в один пользовательский поток. Именно этот шаг доказывает обязательный SSR и корректность same-origin/internal networking.

## Зависимости

- Lead endpoint готов после шага 05.
- Media/Horizon готовы после шагов 07–08.
- Next shell и API client готовы после шага 09.

## Сценарий приёмки

1. Пользователь открывает публичную страницу с формой расчёта.
2. Заголовок, пояснения и начальная форма присутствуют в server-rendered HTML.
3. Client component валидирует UX-ограничения, но Laravel остаётся источником истины.
4. Browser отправляет `POST /api/v1/leads/quote-requests` на тот же origin.
5. Laravel сохраняет заявку один раз, публикует событие after commit и ставит notification job.
6. Оператор видит заявку в Filament и меняет статус разрешённым application action.
7. Если страница содержит управляемое изображение, URL `/storage/...` работает в обычном image и через `next/image`.

## Frontend implementation

Создать route, например `frontend/src/app/quote/page.tsx`, как Server Component. Интерактивную форму вынести в небольшой client component.

```tsx
export const dynamic = 'force-dynamic';

export default async function QuotePage() {
  const content = await serverApi<QuotePageResponse>('pages/quote', {
    cache: 'no-store',
  });

  return <QuoteRequestView content={content.data} />;
}
```

Если Content API ещё не подтверждён, текст может быть code-owned согласно шагу 01; не создавать временный Content module только ради этого теста.

Browser submit:

```ts
await browserApi('/leads/quote-requests', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Idempotency-Key': crypto.randomUUID(),
  },
  body: JSON.stringify(values),
});
```

Idempotency key создаётся один раз на пользовательскую попытку и сохраняется на retry; не генерировать новый key внутри каждого повторного HTTP-вызова.

## Error UX

- `422`: сопоставить Laravel field errors полям Mantine form; неизвестные fields показать общей ошибкой и отправить telemetry без payload.
- `429`: понятное сообщение и `Retry-After`, submit временно блокируется.
- timeout/network: разрешить безопасный retry с тем же idempotency key.
- `5xx`: generic error + request ID для поддержки.
- success: очистить draft только после подтверждённого response; double click заблокировать.

## Correlation ID

Nginx принимает/создаёт request ID, Laravel возвращает его header, логирует structured context и передаёт безопасное значение в job metadata. Frontend отображает ID только при ошибке. Не использовать phone/email как correlation key.

## SSR и media verification

Добавить e2e/smoke тест, который:

1. запрашивает `/quote` обычным HTTP client без выполнения JS;
2. проверяет `200`, `<h1>` и начальный form content;
3. убеждается, что это не Laravel welcome page;
4. проверяет `/_next/static/*`;
5. проверяет media URL из API и `next/image` optimizer;
6. неизвестный public URL возвращает Next 404.

## Revalidation

Если шаг 01 требует управляемый content с caching, реализовать защищённый Next route handler для revalidation:

- secret только server-side;
- allowlist tags/paths, никаких произвольных paths;
- rate limit;
- Filament/Application listener вызывает endpoint после commit;
- failure retry идемпотентен.

Без подтверждённого cache use case webhook не добавлять.

## Тесты

- frontend unit: mapping `422`, `429`, timeout, request ID;
- backend feature: payload contract/idempotency/rate limit;
- integration: DB row + ровно одна notification при retry;
- e2e: submit через browser и появление заявки в защищённой панели (admin session fixture);
- SSR smoke: meaningful HTML без JavaScript;
- media: тот же relative URL работает через Nginx и optimizer.

## Критерии приёмки

- Полный сценарий выполняется через `http://localhost:28180`.
- SSR обращается к `http://nginx/api/v1`, browser — к `/api/v1`.
- Повтор submit не создаёт строку/job повторно.
- Validation/rate limit/server errors имеют предсказуемый UX.
- Filament не обходит application rules.
- SSR, media и Next 404 подтверждены автоматическим smoke/e2e тестом.
