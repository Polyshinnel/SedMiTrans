# Шаг 11. Завершить production images и Nginx routing

## Цель

Собрать минимальные non-root images backend/frontend/Nginx без dev dependencies и секретов. Nginx становится единственной публичной точкой и маршрутизирует Laravel, Next SSR, static и shared media.

## Зависимости

- Backend target шага 03 собирается.
- Frontend standalone build шага 09 и e2e flow шага 10 работают.
- Media path/mount подтверждены на шаге 07.

## Backend image

Довести `Dockerfile.backend` до production-ready состояния:

- `composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction`;
- `APP_ENV=production`, но без `.env` в image;
- non-root `www-data`;
- writable только `storage`/`bootstrap/cache`;
- FPM healthcheck/health endpoint;
- production OPcache;
- никаких миграций, `key:generate`, `storage:link` и permission recursion на каждом старте.

Config/route/view cache допускается создавать на release/start только если все нужные env доступны и кеш не встраивает environment-specific secrets в shared image. Выбранный способ описать в Deployment docs.

## Frontend Dockerfile

Создать `Dockerfile.frontend`:

```dockerfile
# syntax=docker/dockerfile:1.7
FROM node:24-alpine AS deps
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

FROM node:24-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ .
ARG NEXT_PUBLIC_API_URL=/api/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run lint && npm run typecheck && npm run build

FROM node:24-alpine AS runtime
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000
WORKDIR /app
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
COPY --from=build --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nextjs /app/public ./public
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

Node major в примере заменить на LTS, принятый и проверенный на момент реализации; один и тот же major использовать local/CI/production. `API_INTERNAL_URL` и `MEDIA_INTERNAL_URL` нужны runtime server, а не public build args. Ни один secret не должен иметь prefix `NEXT_PUBLIC_`.

## Nginx image

Создать отдельный `Dockerfile.nginx` либо документированный Nginx target в backend Dockerfile, который копирует immutable Laravel `public/` из backend build stage. Shared media туда не копируется.

```dockerfile
FROM sedmitrans-backend-build AS backend
FROM nginx:1.27-alpine
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=backend /var/www/html/public /var/www/html/public
```

Если cross-Dockerfile stage unavailable в выбранном builder, использовать named build context или единый multi-target Dockerfile. Не копировать host `public/`, если это может разойтись с backend image tag.

## Production routing

`default.conf` должен содержать:

- `/api/*`, `/admin/*`, `/livewire/*`, `/horizon/*` и нужные Laravel assets → `app:9000` через front controller;
- `/storage/*` → `alias /var/www/storage/`, read-only, no execution;
- `/_next/static/*` → frontend с immutable cache;
- остальные paths → `frontend:3000`;
- upload/body limits из ADR;
- upstream connect/read/send timeouts;
- forwarded host/proto/IP/request ID;
- deny dotfiles;
- security headers, совместимые с приложением.

Не применять immutable cache ко всему `/_next/*`: image optimizer и dynamic responses требуют своей политики. HTML не кешировать Nginx без отдельного ADR.

## Healthchecks

- frontend: endpoint, подтверждающий запущенный standalone server;
- FPM/app: readiness идёт через Nginx `/api/v1/health`, process health можно проверять отдельно;
- Nginx: endpoint проверяет routing, а не только существование master process.

## Проверки supply/runtime

```bash
docker build -f Dockerfile.backend --target app -t sedmitrans/backend:test .
docker build -f Dockerfile.frontend -t sedmitrans/frontend:test .
docker build -f Dockerfile.nginx -t sedmitrans/nginx:test .
```

- проверить non-root user через `docker inspect`/`id`;
- просканировать images на vulnerabilities выбранным CI scanner;
- проверить layers на `.env`, tokens и source maps с чувствительными данными;
- убедиться, что frontend runtime содержит standalone output, static и public, но не полный `node_modules`/source tree;
- запустить smoke Compose из шага 12.

## Критерии приёмки

- Три images воспроизводимо собираются и имеют immutable tag/digest.
- Backend extensions/codec smoke из шага 03 проходит.
- Все runtime processes non-root, application code read-only.
- Secrets отсутствуют в args, layers, bundle и image config.
- Nginx корректно разделяет Laravel/Next/media/static и не исполняет uploads.
- Hashed static кешируется долго, SSR HTML — по явной безопасной политике.
