# Шаг 13. Настроить CI и quality gates

## Цель

Не допускать deployment кода, который нарушает DDD boundaries, не проходит MySQL/Redis integration, ломает SSR или не собирается в production images.

## Зависимости

- Backend/frontend tests и Dockerfiles существуют после шагов 10–12.
- CI provider/registry выбран ответственным за инфраструктуру.

## Pipeline stages

Разделить jobs так, чтобы быстрые проверки шли раньше дорогих, а независимые backend/frontend jobs выполнялись параллельно.

### Backend quality

```bash
composer validate --strict
composer install --no-interaction --prefer-dist
vendor/bin/pint --test
vendor/bin/phpstan analyse
php artisan test --testsuite=Unit
php artisan test --testsuite=Architecture
```

Static analysis tool и baseline должны быть осознанно добавлены в dev dependencies. Новый baseline не может молча расти; уровень зафиксировать в config.

### Backend integration

Поднять service containers `mysql:8.4` и `redis:7-alpine`, дождаться health и выполнить:

```bash
php artisan migrate:fresh --force
php artisan test --testsuite=Integration
php artisan test --testsuite=Feature
```

Не подменять этот job SQLite. Добавить отдельную проверку migrations на пустой DB и, при необходимости, upgrade from previous release snapshot.

### Frontend quality

```bash
cd frontend
npm ci
npm run lint
npm run typecheck
npm test -- --run
npm run build
```

Test runner выбрать и зафиксировать только при наличии component tests; команда не должна быть пустой заглушкой, всегда возвращающей success.

### Images

- собрать backend/frontend/Nginx images;
- выполнить PHP extension/GD codec smoke;
- запустить vulnerability and secret scan;
- tag images immutable commit SHA, optional semver/release alias;
- push только после всех quality jobs.

### Compose/e2e smoke

На собранных images поднять `docker-compose.prod.yml` с isolated project/volumes, применить migration и проверить:

```text
GET /                         200 + SSR marker
GET /_next/static/...         200
GET /api/v1/health            200 + ready
GET /admin                    login, no anonymous data
GET /horizon                  protected
POST quote request            DB row + one notification job
GET /unknown                  Next 404
scheduler/horizon             fresh heartbeat
```

## Артефакты и безопасность

- публиковать test reports, coverage summary и build logs без `.env`/payloads;
- не печатать secrets при `docker compose config`;
- dependency caches key по lock files;
- artifacts/images имеют retention;
- protected production credentials доступны только protected branch/environment;
- pull request из fork не получает deployment secrets.

## Quality gate для automatic deploy

Deployment разрешён только если:

- обязательные jobs green;
- image vulnerability policy пройдена либо exception documented;
- миграции прошли на чистой MySQL;
- SSR smoke подтвердил content до JS;
- images опубликованы под одним release identifier;
- для production требуется approval согласно процессу команды.

## Критерии приёмки

- Изменение в Domain с запрещённым `Illuminate` ломает architecture job.
- Сломанная migration, TypeScript ошибка и static export ломают pipeline.
- E2E использует собранные images, а не dev servers.
- Image tags позволяют точно повторить deploy и rollback.
- Automatic deploy не стартует до полного quality gate.
