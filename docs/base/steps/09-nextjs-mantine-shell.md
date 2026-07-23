# Шаг 09. Создать Next.js SSR shell с Mantine

## Цель

Создать отдельное приложение `frontend/` на Next.js App Router и TypeScript, настроить Mantine для SSR, typed API client и явные cache policies. Static export запрещён.

## Зависимости

- Из шага 01 известны canonical domains и SEO требования.
- Local Nginx/network из шага 04 доступны для проверки SSR.

## Инициализация

1. Создать `frontend/` с App Router, TypeScript, ESLint и согласованным `src/` layout:

```text
frontend/
  src/app/
  src/components/
  src/features/
  src/lib/api/
  src/styles/
  public/
  next.config.ts
  package.json
  package-lock.json
  tsconfig.json
```

2. Установить актуальные совместимые пакеты Mantine: core, hooks, form, notifications, modals, а также Tabler icons. Установить `sharp` как production dependency.
3. Зафиксировать Node LTS major в `.nvmrc`/`.node-version` и Dockerfile. Использовать `npm ci` при наличии lock file.

## Mantine root layout

Адаптировать imports к установленной версии:

```tsx
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from '@/styles/theme';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <head><ColorSchemeScript /></head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Notifications />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
```

Добавить единый theme, responsive shell, skip link, semantic header/main/footer. Не переводить весь layout в client component.

## Обязательные маршруты и boundaries

- `src/app/page.tsx` — server-rendered home placeholder с реальным заголовком проекта;
- `error.tsx` и `global-error.tsx` там, где требует App Router;
- `not-found.tsx`;
- `loading.tsx` только для реального streaming boundary;
- metadata/robots/sitemap на сервере;
- favicon/OG defaults.

`'use client'` использовать только в form controls, modals и других интерактивных leaf components.

## Runtime URLs

Создать валидируемый env helper:

```ts
const apiInternalUrl = process.env.API_INTERNAL_URL;
if (!apiInternalUrl) throw new Error('API_INTERNAL_URL is required');

export const serverEnv = {
  apiInternalUrl: apiInternalUrl.replace(/\/$/, ''),
  mediaInternalUrl: (process.env.MEDIA_INTERNAL_URL ?? 'http://nginx').replace(/\/$/, ''),
};
```

Server Components используют `API_INTERNAL_URL=http://nginx/api/v1`. Client code использует только `NEXT_PUBLIC_API_URL=/api/v1`. Никогда не импортировать server env module в client bundle.

## Typed API client

Создать server/browser adapters поверх общего decoder/types. Клиент должен:

- задавать timeout через `AbortSignal.timeout` либо AbortController;
- прокидывать/читать request ID;
- различать validation `422`, rate limit `429`, not found и `5xx`;
- не включать response body с ПДн в logs;
- принимать явный Next cache option.

Пример server fetch:

```ts
export async function serverApi<T>(
  path: string,
  init: RequestInit & {
    next?: { revalidate?: number | false; tags?: string[] };
  } = {},
): Promise<T> {
  const response = await fetch(`${serverEnv.apiInternalUrl}/${path.replace(/^\//, '')}`, {
    ...init,
    signal: init.signal ?? AbortSignal.timeout(8_000),
    headers: { Accept: 'application/json', ...init.headers },
  });

  if (!response.ok) throw await ApiError.fromResponse(response);
  return response.json() as Promise<T>;
}
```

Добавить runtime validation (например schema decoder) там, где данные формируют SEO/critical UI; TypeScript cast сам по себе не проверяет Laravel response.

## Cache policy

У каждого data route должна быть видимая политика:

- персональные/быстрые данные: `cache: 'no-store'`;
- публичный content: `next: { revalidate: N, tags: [...] }` только если допустима задержка;
- обязательный request-time SSR: `export const dynamic = 'force-dynamic'`.

Не включать `output: 'export'`. В `next.config.ts` включить `output: 'standalone'` и media rewrite:

```ts
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    const media = process.env.MEDIA_INTERNAL_URL ?? 'http://nginx';
    return [{ source: '/storage/:path*', destination: `${media}/storage/:path*` }];
  },
};
```

Проверить, что rewrite не создаёт loop в browser path и действительно используется Next image optimizer внутри network.

## Проверки

```bash
cd frontend
npm ci
npm run lint
npm run typecheck
npm run build
```

Через Nginx получить HTML с JavaScript disabled/обычным curl и убедиться, что заголовок страницы уже присутствует в response body.

## Критерии приёмки

- Production build создаёт standalone server и использует `sharp`.
- Mantine styles не мигают и корректны в SSR.
- Home/404/error metadata формируются server-side.
- Internal hostname не попадает в client bundle.
- Browser и Server Components используют разные base URL одного `/api/v1` contract.
- Исходный HTML содержит meaningful content до выполнения JavaScript.
