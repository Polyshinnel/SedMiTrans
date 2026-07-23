# Шаг 02. Подготовить Laravel foundation

## Цель

Установить серверные зависимости и перевести Laravel с исходной SQLite/database-конфигурации на MySQL 8.4 и Redis 7. Добавить отдельный readiness endpoint без раскрытия внутренних ошибок.

## Зависимости

- Завершён шаг 01.
- Доступна среда PHP 8.5 либо builder из шага 03 для повторного выполнения Composer-команд.

## Изменяемые файлы

- `composer.json`, `composer.lock`;
- `.env.example`;
- `config/app.php`, `config/database.php`, `config/cache.php`, `config/session.php`, `config/queue.php`;
- опубликованные конфигурации Filament/Horizon;
- `bootstrap/app.php`, `routes/api.php`;
- `tests/Feature/Health/ReadinessTest.php`.

## Задачи исполнителя

1. Установить версии Filament и Horizon, совместимые с Laravel 13 и PHP 8.5. До изменения lock file проверить constraints актуальных релизов. `intervention/image-laravel:^4.0` уже установлен — не понижать его.
2. Установить Sanctum только если ADR-0002 требует browser auth/protected API.
3. Опубликовать конфигурацию Horizon и необходимые assets/config Filament. Не публиковать пакеты без причины.
4. Обновить `.env.example` безопасными локальными defaults:

```dotenv
APP_NAME=sedmitrans.ru
APP_URL=http://localhost:28180
FRONTEND_URL=http://localhost:28180
APP_LOCALE=ru
APP_FALLBACK_LOCALE=ru
APP_FAKER_LOCALE=ru_RU
APP_TIMEZONE=Europe/Moscow

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=sedmitrans
DB_USERNAME=sedmitrans
DB_PASSWORD=sedmitrans
DB_CHARSET=utf8mb4
DB_COLLATION=utf8mb4_unicode_ci

REDIS_CLIENT=phpredis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=null
QUEUE_CONNECTION=redis
CACHE_STORE=redis
SESSION_DRIVER=redis

APP_HTTP_PORT=28180
MYSQL_HOST_PORT=23307
REDIS_HOST_PORT=26380
API_INTERNAL_URL=http://nginx/api/v1
MEDIA_INTERNAL_URL=http://nginx
NEXT_PUBLIC_API_URL=/api/v1
```

`DB_PASSWORD=sedmitrans` допустим только как local default в example; production получает отдельный secret из Dokploy. `APP_KEY` оставить пустым.
5. В `config/app.php` читать timezone из env:

```php
'timezone' => env('APP_TIMEZONE', 'Europe/Moscow'),
```

6. Подключить API routes в `bootstrap/app.php`:

```php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    api: __DIR__.'/../routes/api.php',
    commands: __DIR__.'/../routes/console.php',
    health: '/up',
)
```

Laravel автоматически применяет `/api`; в `routes/api.php` добавить только version prefix:

```php
<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/health', function () {
        DB::select('select 1');
        Redis::connection()->ping();

        return response()->json(['status' => 'ready']);
    })->name('api.v1.health');
});
```

В production exception renderer должен вернуть общий `503`, а детали записать в log. Если health endpoint вызывается часто, добавить короткий timeout и не логировать каждую успешную проверку.
7. Оставить `/up` как дешёвый liveness check без MySQL/Redis. Не подменять им readiness.
8. Убедиться, что MySQL connection использует `utf8mb4`, strict mode и `utf8mb4_unicode_ci` либо выбранную в ADR collation.
9. Разнести Redis databases/prefixes для default/cache при необходимости; production password не добавлять в repository.

## Тест readiness

Минимальная форма теста:

```php
public function test_readiness_endpoint_reports_ready_dependencies(): void
{
    $this->getJson('/api/v1/health')
        ->assertOk()
        ->assertExactJson(['status' => 'ready']);
}
```

Этот тест должен выполняться в integration job с реальными MySQL и Redis. Для unit/fast suite его можно пометить group `integration`, но нельзя заменять оба сервиса mocks во всех pipeline jobs.

## Команды проверки

```bash
composer validate --strict
php artisan about
php artisan config:clear
php artisan route:list --path=api/v1/health
php artisan test --filter=ReadinessTest
```

После появления Docker Compose повторить:

```bash
docker compose exec app php artisan migrate --force
docker compose exec app php artisan tinker --execute="cache()->put('foundation-check', 'ok', 60); dump(cache()->get('foundation-check'));"
```

## Критерии приёмки

- Lock file разрешается на PHP 8.5 и Laravel 13 без conflict.
- `/up` проверяет процесс, `/api/v1/health` — MySQL и Redis.
- Cache/session/queue настроены на Redis, migrations — на MySQL.
- Locale/timezone/collation соответствуют решениям.
- В `.env.example`, Git history и config нет настоящих секретов.
