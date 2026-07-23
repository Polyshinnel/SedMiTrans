# План развёртывания и базовой архитектуры sedmitrans.ru

## 1. Назначение документа

Документ описывает подготовку репозитория, локального Docker-окружения, production-сборки и развёртывания сайта логистической компании в Dokploy.

Целевой стек:

- backend: Laravel 13, PHP 8.5;
- публичный frontend: Next.js с App Router, TypeScript и обязательным SSR;
- UI: Mantine (название `Mantime` из исходных требований трактуется как `Mantine`);
- административная панель: Filament;
- база данных: MySQL 8.4;
- cache, session и очереди: Redis 7;
- обработка очередей и мониторинг: Laravel Horizon;
- инфраструктура: Docker Compose для local и production, деплой через Dokploy;
- архитектура backend: DDD с явным разделением Domain, Application, Infrastructure и Presentation.

План фиксирует инфраструктурный фундамент. Конкретная бизнес-модель перевозок должна быть уточнена отдельно до реализации соответствующих доменных модулей.

## 2. Исходное состояние

Исходно в репозитории был чистый Laravel `13.8`. В рамках подготовки плана уже выполнены два базовых изменения:

- минимальная PHP-зависимость поднята до `^8.5`;
- добавлен `intervention/image-laravel:^4.0` и опубликована конфигурация GD/WebP;

Остальная исходная заготовка пока имеет следующие особенности:

- стандартная SQLite-конфигурация;
- стандартный Vite frontend без Next.js;
- отсутствуют Filament, Horizon и Laravel Redis client;
- Docker-файлы ещё не созданы.

Репозиторий `/home/andrey/projects/uniqset2.com` изучен как референс. Из него следует переиспользовать следующие решения:

- единая входная точка Nginx на порту `80`;
- маршрутизация `/api`, `/admin`, `/horizon`, `/livewire` в Laravel, остальных запросов — в Next.js;
- server-side запросы Next.js к backend по внутреннему адресу, а browser-side запросы — через same-origin `/api`;
- production-сборка Next.js во время сборки Docker image;
- отдельный процесс планировщика `php artisan schedule:work`;
- Redis с AOF и отдельные persistent volumes для MySQL, Redis и пользовательских файлов;
- production-переменные окружения задаются в Dokploy, секреты не входят в image.

В новом проекте процессы рекомендуется разделить по контейнерам, а не запускать PHP-FPM, Nginx, Next.js и Horizon через Supervisor в одном контейнере. Это даст независимые healthcheck, логи, рестарты и масштабирование. Единый контейнер из референса можно оставить только как fallback, если появится ограничение конкретной установки Dokploy.

## 3. Целевая схема

```text
Internet
   |
   v
Dokploy / TLS
   |
   v
nginx:80
   |-- /api/*, /admin/*, /livewire/*, /horizon/* --> app:9000 (PHP-FPM)
   |-- /storage/* -------------------------------------> shared storage_public (read-only)
   |-- Laravel/Filament static assets -----------------> immutable public/
   `-- /*, /_next/* -----------------------------------> frontend:3000 (Next SSR)

frontend -- server-side HTTP --> nginx/api/v1/*
app --------------------------> mysql:3306
app/horizon/scheduler --------> redis:6379
horizon ----------------------> mysql:3306 when jobs require DB
scheduler --------------------> mysql:3306 and redis:6379
```

Публично открывается только Nginx. MySQL, Redis, PHP-FPM и Next.js доступны лишь внутри Docker network. TLS завершается на reverse proxy Dokploy.

### 3.1. Контейнеры

| Сервис | Назначение | Публичный порт | Persistent data |
|---|---|---:|---|
| `nginx` | единая точка входа, маршрутизация и раздача media | `80` | `storage_public`, read-only |
| `app` | Laravel API, Filament, PHP-FPM | нет | `storage_public` |
| `frontend` | Next.js standalone server, SSR | нет | нет |
| `horizon` | выполнение и мониторинг очередей | нет | общие Laravel-файлы только при необходимости |
| `scheduler` | `php artisan schedule:work` | нет | нет |
| `mysql` | основное хранилище данных | только local, опционально | `mysql_data` |
| `redis` | queue/cache/session | только local, опционально | `redis_data` |

`app`, `horizon` и `scheduler` должны собираться из одного immutable backend image, но иметь разные команды запуска. `frontend` собирается отдельным multi-stage image с `output: 'standalone'`.

## 4. Структура репозитория

Предлагаемая структура:

```text
app/
  Domain/
    <Area>/{Entities,ValueObjects,Events,Exceptions,Contracts}/
  Application/
    <Area>/{Commands,Queries,DTO,Handlers}/
  Infrastructure/
    Persistence/Eloquent/{Models,Repositories}/
    Integrations/
    Jobs/
    Providers/
  Presentation/
    Http/<Area>/{Controllers,Requests,Resources}/
    Filament/<Area>/
  Shared/
    Domain/
bootstrap/
config/
database/
docker/
  nginx/
  php/
  mysql/
frontend/
  app/
  components/
  features/
  lib/
  public/
  styles/
routes/
tests/
  Architecture/
  Feature/
  Integration/
  Unit/
docs/
Dockerfile.backend
Dockerfile.frontend
docker-compose.yml
docker-compose.prod.yml
```

Next.js лучше разместить в отдельном каталоге `frontend/`, а не в `resources/js`, как в референсе. Это явно отделяет самостоятельное SSR-приложение от Laravel/Vite assets Filament и упрощает Docker build context, ESLint, TypeScript и standalone-сборку.

## 5. Правила DDD

### 5.1. Границы слоёв

- `Domain` содержит бизнес-правила и не зависит от Laravel, Filament, HTTP, Redis или Eloquent.
- `Application` реализует сценарии использования, координирует domain objects и работает через интерфейсы.
- `Infrastructure` реализует repository contracts, Eloquent mapping, внешние интеграции, очереди и Laravel providers.
- `Presentation` содержит HTTP API, validation/resources и Filament adapters.
- `Shared` используется только для действительно общих примитивов: идентификаторы, Clock, Money и base domain event. Бизнес-логика туда не переносится.

Направление зависимостей:

```text
Presentation -> Application -> Domain
Infrastructure -> Application/Domain
Domain -> ни от кого
```

### 5.2. Предметные области и зависимости

- Предметная область группируется одинаковым `<Area>` namespace в слоях, например `Domain/Lead` и `Application/Lead`; это организация кода, а не модуль с отдельным runtime и provider.
- Каждая таблица и Eloquent model имеет одного владельца в Infrastructure; Domain и Presentation не обращаются к Eloquent напрямую.
- Синхронная связь между областями выполняется через небольшой Application contract; асинхронная — через domain/application events и queued listeners.
- HTTP-контроллеры и Filament resources не содержат бизнес-правил, а вызывают application use case.
- Связи между таблицами проектируются по потребности конкретного use case, без искусственного запрета или обязательного создания идентификаторов.

### 5.3. Подтверждённые области первого релиза

На текущий момент подтверждены следующие области. Они описываются в `docs/Architecture.md`; каталоги в `app/` появляются только с первым реализуемым use case.

- `Lead` — обращения с сайта: сохранение в БД и последующая передача в CRM;
- `Seo` — настройки страниц: как минимум `title`, `description`, `og:image`; остальные поля добавляются по подтверждённой потребности;
- `Website` — страница контактов и баннеры главной страницы;
- `Settings` — ключи и иные параметры интеграций со сторонними сервисами. Секретные значения шифруются при хранении, маскируются в панели и никогда не попадают в API, логи или audit diff;
- `Identity` — администраторы, роли и доступ в Filament;
- `Media` — загрузка, преобразование и раздача файлов, если для баннеров или SEO понадобится управляемое изображение.

Новые области добавляются по мере появления задач. `Logistics`, `Geo`, управляемый контент и прочие непроверенные предположения не входят в стартовую модель.

### 5.4. Регистрация Laravel-адаптеров

- Регистрировать нужные bindings, listeners, console commands и routes в обычных Laravel providers, явно перечисленных в `bootstrap/providers.php`.
- API routes могут быть сгруппированы по предметным областям, но подключаются с общим prefix `/api/v1`.
- Filament resources обнаруживать только в `Presentation/Filament` через конфигурацию панели.
- Не использовать неявное сканирование всего filesystem: явная регистрация облегчает анализ связей и production cache.

## 6. Этапы реализации

### Этап 0. Зафиксировать решения и соглашения

1. Уточнить домены для production и staging.
2. Уточнить требования к заявкам: поля, статусы, уведомления, вложения, CRM-интеграция.
3. Определить, какие страницы управляются из Filament, а какие остаются в коде.
4. Определить роли администраторов и правила доступа.
5. Зафиксировать файловое хранилище: local volume на первом этапе либо S3-compatible storage.
6. Зафиксировать SLA, ожидаемый трафик, размер загрузок и политику хранения персональных данных.
7. Оформить architecture decision records хотя бы для DDD-структуры, API auth и deployment topology.

Результат: отсутствуют решения, которые пришлось бы угадывать при проектировании БД и публичного API.

### Этап 1. Подготовить backend-зависимости

1. Оставить Laravel 13 и зафиксировать минимальную версию PHP `^8.5`, совпадающую с runtime image `php:8.5-fpm-alpine`.
2. Установить совместимые версии:

   - `filament/filament`;
   - `laravel/horizon`;
   - `intervention/image-laravel:^4.0` — уже добавлен, lock file фиксирует Laravel adapter `4.1.0` и core `4.2.0`;
   - Redis PHP extension в image;
   - GD и EXIF PHP extensions с поддержкой JPEG, PNG, WebP и FreeType — обязательны с первой сборки image;
   - `laravel/sanctum` только если появится браузерная авторизация публичного frontend или защищённый API.

3. Опубликовать и проверить конфигурации Filament/Horizon.
4. Перевести `.env.example` на MySQL и Redis:

   ```env
   DB_CONNECTION=mysql
   DB_HOST=mysql
   DB_PORT=3306
   QUEUE_CONNECTION=redis
   CACHE_STORE=redis
   SESSION_DRIVER=redis
   REDIS_CLIENT=phpredis
   REDIS_HOST=redis
   REDIS_PORT=6379
   ```

5. Установить локаль приложения `ru`, fallback locale, timezone `Europe/Moscow` и `utf8mb4`.
6. Добавить `/api/v1/health` для readiness и оставить Laravel `/up` для liveness.
7. Не хранить реальные пароли, `APP_KEY` и токены в `.env.example`.

Критерий готовности: Laravel запускается в контейнере, подключается к MySQL и Redis, миграции выполняются, cache/session и тестовая job используют Redis.

### Этап 2. Создать DDD-каркас

1. Создать только каталоги, необходимые для первого среза: `app/Domain/Lead`, `app/Application/Lead`, Infrastructure и Presentation; `app/Shared/Domain` — лишь при появлении общего примитива.
2. Использовать стандартный PSR-4 namespace `App\\`; отдельные prefixes для слоёв не требуются.
3. Реализовать один вертикальный срез — предпочтительно `Lead/SubmitQuoteRequest`:

   ```text
   HTTP Request
     -> SubmitQuoteRequestController
     -> SubmitQuoteRequest command/handler
     -> Lead aggregate/domain rules
     -> LeadRepository contract
     -> EloquentLeadRepository
     -> LeadSubmitted event
     -> queued notification/integration
   ```

4. На этом срезе проверить транзакцию, idempotency, validation, event dispatch и queue retry policy.
5. Добавить architecture tests, запрещающие зависимости Domain от Illuminate, Filament и Eloquent.
6. Актуализировать `docs/Architecture.md`: ответственность области, публичные contracts, события и принадлежащие таблицы.

Критерий готовности: use case проходит unit, integration и API tests, границы не нарушены.

### Этап 3. Установить и защитить Filament

1. Создать панель по адресу `/admin`.
2. Хранить пользователей панели в области `Identity` либо адаптировать стандартный `User` как infrastructure model.
3. Реализовать `canAccessPanel()`; доступ разрешать только активным администраторам с нужной ролью.
4. Создание первого администратора выполнять отдельной Artisan-командой или одноразовой Dokploy command, а не публичной регистрацией и не seed с фиксированным паролем.
5. Отключить публичную регистрацию.
6. Настроить rate limiting login, secure session cookies, password policy и аудит критических изменений.
7. Filament resources размещать около Presentation-слоя соответствующего модуля; формы вызывают application actions.
8. Добавить русскую локализацию панели и корректную timezone.
9. Для публичных изображений Filament FileUpload всегда использовать Laravel disk `public`:

   - физический root: `storage/app/public`;
   - visibility: `public`;
   - в БД хранить только относительный путь, например `services/01J...webp`;
   - API Resource возвращает same-origin путь `/storage/<relative-path>`; абсолютный URL через `Storage::disk('public')->url($path)` формируется только там, где он действительно нужен, например для Open Graph;
   - использовать уникальные имена файлов, чтобы CDN/browser/Next cache не показывал старую версию после замены;
   - проверять MIME, размер и разрешение изображения server-side.

10. Приватные документы не класть на disk `public`: для них нужен отдельный private disk и авторизованный download endpoint.

Критерий готовности: неавторизованный пользователь не видит панель, роли проверяются server-side, CRUD не обходит domain/application rules.

### Этап 4. Настроить Horizon и очереди

1. Опубликовать `config/horizon.php`.
2. Выделить очереди минимум:

   - `default` — короткие общие jobs;
   - `notifications` — email/CRM/webhooks;
   - `media` — обработка изображений и файлов;
   - `imports` — будущие продолжительные импорты, если они появятся.

3. Задать для каждой очереди отдельные `timeout`, `tries`, `backoff`, memory и число процессов.
4. Jobs должны быть идемпотентными; внешние запросы — иметь timeout и retry только для повторяемых ошибок.
5. Не передавать в job большие Eloquent graphs и содержимое файлов; передавать идентификаторы.
6. Включить failed jobs, pruning и `horizon:snapshot` по расписанию.
7. Закрыть `/horizon` проверкой администратора. Дополнительная защита через basic auth/IP allowlist на Nginx или Dokploy допустима, но не заменяет application authorization.
8. При деплое выполнять `php artisan horizon:terminate`, чтобы workers поднялись с новым кодом.

Критерий готовности: тестовая job видна в Horizon, обрабатывается нужной очередью, failed/retry сценарии воспроизводимы, `/horizon` недоступен публично.

### Этап 5. Создать Next.js SSR frontend

1. Инициализировать Next.js в `frontend/` с App Router, TypeScript, ESLint и `src`-алиасами по согласованному стандарту.
2. Установить Mantine packages, необходимые проекту: core, hooks, form, notifications, modals и Tabler icons.
3. Подключить Mantine provider, server-compatible styles, `ColorSchemeScript` и единую theme configuration.
4. Создать layout, error boundary, `not-found`, loading states и базовую SEO metadata.
5. Server Components использовать по умолчанию; добавлять `'use client'` только для интерактивных компонентов.
6. Для backend API создать два адреса:

   ```env
   API_INTERNAL_URL=http://nginx/api/v1
   NEXT_PUBLIC_API_URL=/api/v1
   ```

   - SSR и Server Components используют `API_INTERNAL_URL` внутри Docker network;
   - браузер использует same-origin `/api/v1`, без раскрытия внутреннего hostname;
   - Nginx передаёт исходные `Host`, `X-Forwarded-For` и `X-Forwarded-Proto`.

7. Явно задавать стратегию рендера и cache для каждого маршрута:

   - персональные и быстро меняющиеся данные — `cache: 'no-store'`;
   - публичный контент — SSR с ограниченным `revalidate`, если допустима задержка обновления;
   - принудительная динамика для страниц, где HTML должен формироваться на каждый запрос.

8. Не превращать обязательный SSR в статический export. Проверка SSR должна подтверждать, что содержимое присутствует в исходном HTML до выполнения JavaScript.
9. Создать типизированный API client. Laravel API Resources считаются внешним контрактом; breaking changes идут через новую версию API.
10. Добавить обработку Laravel validation errors, `404`, `429` и `5xx`, request timeout и correlation/request ID.
11. Публичные Laravel-изображения использовать по same-origin URL вида `/storage/services/image.webp`. Для обычных `<img>` и Mantine `Image` дополнительная настройка не нужна. Для `next/image` добавить internal rewrite `/storage/:path*` на `${MEDIA_INTERNAL_URL}/storage/:path*`, чтобы Next image optimizer мог получить файл внутри Docker network, не обращаясь к host `localhost` или публичному DNS.
12. Настроить robots/sitemap/canonical/OG без зависимости от browser JavaScript.

Критерий готовности: production `next build` успешен, HTML публичной страницы отдаётся сервером, browser и SSR запросы достигают одного API через разные корректные адреса.

### Этап 6. Собрать local Docker Compose

Создать `docker-compose.yml` для разработки:

1. `nginx` с loopback binding `127.0.0.1:${APP_HTTP_PORT:-28180}:80`.
2. `app` с bind mount репозитория и PHP config.
3. `frontend` с bind mount `frontend/`, dev server и отдельным volume для `node_modules`.
4. `horizon` из backend image с командой `php artisan horizon`.
5. `scheduler` с командой `php artisan schedule:work`.
6. `mysql:8.4` с `utf8mb4`, strict SQL mode, healthcheck, volume и loopback binding `127.0.0.1:${MYSQL_HOST_PORT:-23307}:3306`.
7. `redis:7-alpine` с AOF, healthcheck, volume и loopback binding `127.0.0.1:${REDIS_HOST_PORT:-26380}:6379`.
8. `depends_on` использовать с `condition: service_healthy`, где это поддерживается, но приложение всё равно должно корректно переживать временную недоступность dependency.
9. Проброс MySQL/Redis на host нужен только для локальных IDE/DB clients; в production его не использовать.
10. Синхронизировать UID/GID для writable Laravel directories либо запускать process под host-compatible user.

Закреплённые локальные порты проверены на машине на момент обновления плана:

| Назначение | URL/порт на host | Порт контейнера | Публикация |
|---|---:|---:|---|
| сайт, API, Filament, Horizon, media | `http://localhost:28180` | Nginx `80` | `127.0.0.1` |
| MySQL для IDE | `127.0.0.1:23307` | MySQL `3306` | `127.0.0.1` |
| Redis для диагностики | `127.0.0.1:26380` | Redis `6379` | `127.0.0.1` |
| Next.js | не публикуется | `3000` | только Docker network |
| PHP-FPM | не публикуется | `9000` | только Docker network |

Значения по умолчанию добавить в `.env.example`:

```env
APP_URL=http://localhost:28180
FRONTEND_URL=http://localhost:28180
APP_HTTP_PORT=28180
MYSQL_HOST_PORT=23307
REDIS_HOST_PORT=26380
API_INTERNAL_URL=http://nginx/api/v1
MEDIA_INTERNAL_URL=http://nginx
NEXT_PUBLIC_API_URL=/api/v1
```

Привязка к `127.0.0.1` не даёт другим компьютерам в локальной сети обращаться к БД и Redis. Если сайту временно нужен доступ из LAN или с мобильного устройства, только Nginx можно осознанно привязать к `0.0.0.0`; MySQL и Redis должны остаться на loopback.

Добавить команды разработчика в `Makefile` или `justfile`:

```text
init, up, down, restart, logs, shell, artisan, composer, npm,
migrate, seed, test, lint, build
```

Первый запуск должен сводиться к документированной последовательности:

```bash
cp .env.example .env
docker compose build
docker compose run --rm app php artisan key:generate
docker compose up -d
docker compose exec app php artisan migrate
```

Команды необходимо окончательно проверить после создания Dockerfiles; документация не должна содержать непроверенный happy path.

Критерий готовности: чистый clone поднимается по README, hot reload работает, данные переживают перезапуск контейнеров.

### Этап 7. Подготовить production images

#### Backend image

1. Multi-stage build на `php:8.5-fpm-alpine`.
2. Перенести из `uniqset2.com` проверенный стек обработки изображений сразу в базовый image:

   - Alpine runtime libraries: `libpng`, `freetype`, `libjpeg-turbo`, `libwebp`;
   - Alpine build libraries: `libpng-dev`, `freetype-dev`, `libjpeg-turbo-dev`, `libwebp-dev`;
   - PHP extensions: `gd`, `exif`;
   - настройка: `docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp`;
   - Composer package: `intervention/image-laravel:^4.0`;
   - application config: `config/image.php` и `config/images.php`.

   Build packages после компиляции GD можно удалить, оставив runtime libraries. Imagick не добавлять без отдельного use case: референс использует GD, а два image driver увеличат image и поверхность обновлений без пользы.

3. Установить остальные PHP extensions: как минимум `pdo_mysql`, `redis`, `intl`, `mbstring`, `bcmath`, `opcache`, `pcntl`, `zip`.
4. Выполнить `composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction`.
5. Не копировать `.env`, `.git`, tests, local caches и `node_modules` благодаря `.dockerignore`.
6. Запускать PHP-FPM не от root; writable оставить только `storage` и `bootstrap/cache`.
7. Включить production OPcache и настроить PHP limits через config.
8. Добавить CI/runtime smoke check `php -m`, который подтверждает наличие `gd`, `exif` и `redis`, а также проверку `gd_info()` на JPEG, PNG, WebP и FreeType. Это не позволит собрать image, в котором Composer-пакет установлен, но системный codec отсутствует.

#### Frontend image

1. Multi-stage build на поддерживаемой Node LTS.
2. Использовать `npm ci`, а не `npm install`, при наличии lock file.
3. Выполнить lint/typecheck до `next build`.
4. Включить `output: 'standalone'` и переносить в runtime stage только standalone server, static assets и public files.
5. Запускать Node не от root.
6. Не встраивать секреты в `NEXT_PUBLIC_*`: всё с этим prefix становится публичной частью bundle.
7. При инициализации `frontend/` установить `sharp` как production dependency для `next/image` в standalone runtime; он отвечает за оптимизацию на стороне Next.js и не заменяет Laravel/Intervention обработку оригиналов.

#### Nginx image

1. Хранить routes отдельно в `docker/nginx/default.conf`.
2. Копировать immutable contents Laravel `public/` из backend build stage.
3. Один named volume `storage_public` подключать:

   - в `app` и процессы Laravel: `/var/www/html/storage/app/public` с правом записи;
   - в `nginx`: `/var/www/storage:ro` только для чтения;
   - location `/storage/` раздавать через `alias /var/www/storage/`.

   Файл, загруженный Filament, становится доступен Nginx немедленно; `docker cp`, синхронизация каталогов и повторная сборка frontend не требуются.

4. API, Filament, Livewire, Horizon и Laravel assets направлять в PHP-FPM.
5. `/_next/*` и публичные страницы направлять в Next.js.
6. Для hashed `/_next/static` использовать длительный immutable cache, для HTML — подходящую SSR cache policy.
7. Для `/storage/` задать cache headers с учётом уникальных имён файлов и отключить исполнение любого содержимого как PHP.
8. Настроить upload limit, timeouts и security headers.
9. Запретить доступ к dotfiles и исполнение произвольных PHP-файлов.

Критерий готовности: images собираются без dev-зависимостей и исходных секретов, контейнеры работают с read-only application code и проходят healthcheck.

### Этап 8. Создать production Compose

`docker-compose.prod.yml` не должен содержать bind mounts исходного кода и host ports у внутренних сервисов.

Обязательные элементы:

- `restart: unless-stopped`;
- отдельная внутренняя network;
- named volumes `mysql_data`, `redis_data`, `storage_public`;
- healthchecks для Nginx/frontend, Laravel readiness, MySQL и Redis;
- resource limits, особенно для Horizon, MySQL и Node;
- log rotation (`max-size`, `max-file`) либо внешний log driver;
- одинаковый backend image/tag для `app`, `horizon`, `scheduler`;
- production commands без installation/build на старте;
- секреты только через Dokploy environment/secrets;
- MySQL и Redis не публикуют порты наружу.

Миграции выполняются один раз как release command:

```bash
php artisan migrate --force
```

Не следует безусловно запускать миграции одновременно в entrypoint каждой replica. Перед destructive/долго выполняющимися миграциями нужен backup и отдельный rollout plan.

Критерий готовности: production Compose стартует с чистыми volumes, проходит migrations и smoke tests, повторный старт не повреждает данные.

### Этап 9. Настроить Dokploy

1. Создать Compose application из repository/branch.
2. Привязать домен к сервису `nginx`, container port `80`.
3. Включить TLS и redirect HTTP → HTTPS.
4. Создать persistent volumes и проверить их mount points.
5. Внести production environment variables через интерфейс Dokploy.
6. Настроить release command миграций и post-deploy Horizon restart.
7. Настроить healthcheck path `/up` либо отдельный Nginx endpoint, который отражает готовность frontend/backend.
8. Выполнить первый deploy, создать администратора одноразовой командой и сразу проверить доступы.
9. Настроить automatic deploy только после появления CI quality gate.
10. Сохранить инструкцию по ручному rollback на предыдущий image tag.

Минимальный набор production variables:

```env
APP_NAME=sedmitrans.ru
APP_ENV=production
APP_KEY=base64:CHANGE_ME
APP_DEBUG=false
APP_URL=https://example.ru
FRONTEND_URL=https://example.ru
APP_LOCALE=ru
APP_FALLBACK_LOCALE=ru
APP_TIMEZONE=Europe/Moscow

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=sedmitrans
DB_USERNAME=sedmitrans
DB_PASSWORD=CHANGE_ME

REDIS_CLIENT=phpredis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=CHANGE_ME_OR_NULL
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax

API_INTERNAL_URL=http://nginx/api/v1
MEDIA_INTERNAL_URL=http://nginx
NEXT_PUBLIC_API_URL=/api/v1

LOG_LEVEL=error
```

Точные `DB_HOST`, `REDIS_HOST`, `API_INTERNAL_URL` и `MEDIA_INTERNAL_URL` должны совпасть с Compose service names, видимыми внутри Dokploy network. Если MySQL/Redis будут внешними Dokploy resources, используются их внутренние DNS names вместо приведённых значений.

### Этап 10. CI, тесты и quality gates

Backend pipeline:

1. `composer validate`;
2. Laravel Pint check;
3. static analysis с согласованным уровнем;
4. unit и architecture tests;
5. integration/feature tests на MySQL и Redis, а не только SQLite;
6. проверка миграций на пустой БД;
7. сборка backend image.

Frontend pipeline:

1. `npm ci`;
2. ESLint;
3. TypeScript check;
4. component/unit tests после выбора test runner;
5. production `next build`;
6. минимальный SSR smoke/e2e test;
7. сборка frontend image.

Общий smoke test после deploy:

- `/` возвращает `200` и server-rendered content;
- `/_next/static/*` доступен;
- `/api/v1/health` возвращает ожидаемый status;
- `/admin` открывает login и не допускает анонимного пользователя;
- `/horizon` защищён;
- тестовая заявка сохраняется и ставит notification job в очередь;
- scheduler и Horizon живы;
- неизвестный URL отдаёт корректный Next.js `404`, а не Laravel welcome page.

### Этап 11. Эксплуатация, backup и безопасность

1. Настроить ежедневный backup MySQL с шифрованием, retention и хранением вне Docker host.
2. Если используется local media volume, отдельно копировать `storage_public`; предпочтительно перейти на S3-compatible storage до роста объёма.
3. Не считать Redis единственным источником бизнес-данных; AOF помогает восстановлению, но не заменяет backup/повторную постановку jobs.
4. Ежемесячно проводить тестовое восстановление backup в изолированное окружение.
5. Настроить alerts на:

   - недоступность сайта/API;
   - рост `failed_jobs` и Horizon wait time;
   - заполнение диска;
   - memory/restart loop;
   - ошибки `5xx`;
   - истечение TLS certificate.

6. Логи писать в stdout/stderr либо централизованное хранилище, не оставлять их без rotation в container filesystem.
7. Добавить request/correlation ID от Nginx до Laravel и исходящих jobs.
8. Ограничить частоту публичных форм, использовать honeypot/CAPTCHA по фактической атакуемости и не писать персональные данные в логи.
9. Настроить CSP, HSTS после проверки HTTPS, `X-Content-Type-Options`, `Referrer-Policy` и безопасные cookies.
10. Регулярно обновлять Composer/NPM dependencies и базовые images через проверяемые pull requests.

## 7. Стратегия API и SSR

### 7.1. API

- публичный контракт начинается с `/api/v1`;
- ответы формируются Laravel API Resources;
- validation errors имеют единый JSON format;
- pagination и filters имеют общий формат;
- даты передаются в ISO 8601, timezone semantics фиксируются в контракте;
- internal exceptions не раскрываются клиенту в production;
- mutating endpoints для публичных форм защищены rate limit и CSRF в соответствии с выбранной auth model;
- CORS не нужен для основного сайта при same-origin схеме; если появятся отдельные origins, whitelist должен быть явным.

### 7.2. SSR и cache

SSR является архитектурным требованием, а не только способом сборки. Для каждой страницы фиксируется одна из политик:

| Тип страницы | Политика |
|---|---|
| главная, услуги, направления | SSR с управляемым `revalidate` либо dynamic SSR по требованиям актуальности |
| SEO landing pages | SSR/ISR только при гарантированном обновлении после изменения контента |
| результаты персонального расчёта | dynamic, `no-store` |
| формы | серверный initial HTML, интерактивность в client component |
| админка | Filament/Laravel, вне Next.js |

При обновлении контента из Filament можно добавить безопасный revalidation webhook в Next.js. Endpoint должен иметь secret, строгий список разрешённых paths/tags и rate limit.

### 7.3. Сквозной поток изображений Filament → Laravel storage → Next.js

Основной сценарий не содержит копирования файлов:

```text
Filament FileUpload
  -> Laravel disk "public"
  -> named volume storage_public
  -> Nginx location /storage/* (тот же volume, read-only)
  -> URL /storage/<relative-path>
  -> Next.js / Mantine Image / browser
```

Правила реализации:

1. Laravel — единственный владелец записи и удаления файлов. Frontend имеет только HTTP-доступ на чтение.
2. `app`, `horizon` и `scheduler`, если они обрабатывают media, используют один и тот же disk root `/var/www/html/storage/app/public`.
3. Nginx видит этот же named volume по `/var/www/storage:ro`; `location ^~ /storage/` раздаёт его напрямую через `alias`.
4. В БД хранится относительный path, а не container path и не жёстко заданный production domain.
5. API отдаёт same-origin URL `/storage/...`, поэтому один контракт работает на `localhost:28180`, staging и production.
6. Браузер, обычный `<img>` и Mantine `Image` получают файл прямо через Nginx.
7. При использовании `next/image` его optimizer должен уметь загрузить относительный источник. Для этого Next.js получает rewrite `/storage/:path*` на `http://nginx/storage/:path*`; значение `MEDIA_INTERNAL_URL=http://nginx` задаётся frontend container при build/runtime.
8. Загруженный файл доступен сразу после успешного завершения FileUpload. Не нужны `docker cp`, shared folder с frontend, сборка Next.js или синхронизация файлов.
9. Имена файлов должны быть UUID/content-hash. При замене изображения создаётся новый path, после успешного сохранения записи старый файл удаляется; это устраняет stale cache.
10. Обработку WebP/AVIF, thumbnails и очистку orphan files можно выполнять jobs из очереди `media`. До готовности производных вариантов API продолжает отдавать оригинал либо явно сообщает status обработки.
11. Для `storage_public` обязательно настроить отдельный backup. Named volume решает совместный доступ контейнеров, но сам по себе не является резервной копией.
12. Схема рассчитана на один Docker/Dokploy host. При горизонтальном масштабировании на несколько hosts disk меняется на S3-compatible storage; публичный API path/URL contract при этом сохраняется.

Приёмочная проверка этого потока:

- загрузить JPG/PNG/WebP через Filament;
- убедиться, что в БД сохранён относительный path;
- открыть возвращённый `/storage/...` URL через `localhost:28180`;
- отрисовать тот же URL в SSR HTML и через `next/image`;
- заменить изображение и проверить новый URL без старого cache;
- удалить сущность и проверить согласованное удаление файла;
- перезапустить/пересоздать containers и убедиться, что файл сохранился в volume.

## 8. Работа с данными и миграциями

- одна migration изменяет объекты одного модуля;
- таблицы получают понятный module-oriented prefix только если без него возможны коллизии; namespaces в PHP не требуют механического prefix всех таблиц;
- production migrations должны быть backward-compatible с предыдущей версией приложения при rolling deploy;
- удаление колонок выполняется отдельным поздним релизом после прекращения чтения старым кодом;
- крупные backfill не выполняются внутри обычной migration — для них создаётся resumable command/job;
- seeders содержат справочники и test fixtures, но не production secrets;
- timestamps хранятся консистентно, отображение переводится в `Europe/Moscow` на границе приложения.

## 9. Последовательность релизов

Рекомендуемый порядок работ:

1. решения этапа 0 и обновление README;
2. backend dependencies, MySQL/Redis config;
3. Docker local environment;
4. DDD vertical slice на одной заявке;
5. Filament и администратор;
6. Horizon, scheduler и тестовая job;
7. Next.js + Mantine + SSR shell;
8. API integration и первая server-rendered страница;
9. production images и Nginx routing;
10. production Compose;
11. CI quality gates;
12. staging deploy в Dokploy;
13. backup/restore drill, security и load smoke test;
14. production deploy.

Не следует сначала строить все абстракции DDD без рабочего вертикального среза. Первый срез должен пройти полностью от SSR-страницы или формы до API, БД, события, очереди и Filament — он выявит проблемы в границах раньше масштабирования архитектуры.

## 10. Общие критерии готовности инфраструктуры

Проект можно считать развёрнутым, когда одновременно выполнены условия:

- новый разработчик поднимает проект по README без ручной настройки контейнеров;
- Laravel работает на PHP 8.5 с MySQL и Redis;
- Next.js отдаёт server-rendered HTML через Nginx;
- изображение, загруженное через Filament, сразу доступно Next.js по `/storage/...` без копирования и повторной сборки;
- публичный frontend, API, Filament и Horizon доступны на одном HTTPS origin по своим paths;
- MySQL, Redis, PHP-FPM и Node ports не открыты в Internet;
- Horizon обрабатывает очереди, scheduler выполняет задания;
- `/admin` и `/horizon` защищены;
- images immutable, production не использует bind mounts исходников;
- migrations выполняются отдельным контролируемым release step;
- CI проверяет backend, frontend, SSR и сборку images;
- backup MySQL и файлов создан и проверен восстановлением;
- rollback на предыдущий image tag документирован и протестирован;
- секреты отсутствуют в Git, Docker layers, frontend bundle и логах.

## 11. Основные риски и меры

| Риск | Мера |
|---|---|
| Next.js незаметно отдаёт static HTML вместо обязательного SSR | явная cache policy и e2e-проверка содержимого HTML |
| SSR обращается к публичному домену и создаёт loop/DNS-зависимость | отдельный `API_INTERNAL_URL` через Docker network |
| Filament напрямую меняет Eloquent model, обходя domain rules | Filament actions вызывают application use cases |
| модули становятся папками без реальных границ | contracts/events и architecture tests |
| workers продолжают выполнять старый код после deploy | `horizon:terminate` и controlled restart |
| миграции стартуют одновременно в нескольких replicas | единичный release command |
| потеря media/MySQL при пересоздании Compose | named volumes плюс внешние проверяемые backups |
| секрет попадает в `NEXT_PUBLIC_*` | публичный prefix только для не-секретных значений |
| один тяжёлый job блокирует все очереди | раздельные supervisors/queues и resource limits |
| слишком раннее усложнение DDD | реализация по вертикальным срезам, abstractions только при use case |

## 12. Отдельные документы, которые следует создать по ходу работ

- `README.md` — проверенный local quick start и основные команды;
- `docs/Architecture.md` — boundaries, dependency rules и module map;
- `docs/Deployment.md` — Dokploy variables, release, rollback и troubleshooting;
- `docs/BackupRestore.md` — команды backup/restore и retention;
- `docs/ApiContract.md` либо OpenAPI specification;
- `docs/adr/` — ключевые architecture decisions;
- `.env.example` — полный безопасный перечень переменных без секретов.
