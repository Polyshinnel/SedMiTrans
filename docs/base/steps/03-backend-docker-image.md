# Шаг 03. Создать backend Docker image

## Цель

Собрать единый immutable backend image для `app`, `horizon` и `scheduler`: PHP 8.5 FPM Alpine, Composer production dependencies, GD/WebP/EXIF, Redis и необходимые Laravel extensions.

## Зависимости

- Завершён шаг 02, `composer.lock` актуален.

## Изменяемые файлы

- `Dockerfile.backend`;
- `docker/php/php.ini`, `docker/php/opcache.ini`, при необходимости `docker/php/www.conf`;
- `.dockerignore`;
- `docker/scripts/backend-entrypoint.sh` только если реально нужна инициализация прав/каталогов.

## Реализация

1. Создать multi-stage Dockerfile. Точные Alpine package names проверить сборкой для выбранного `php:8.5-fpm-alpine` tag. Структура должна соответствовать примеру:

```dockerfile
# syntax=docker/dockerfile:1.7
FROM php:8.5-fpm-alpine AS php-base

RUN apk add --no-cache \
        libpng freetype libjpeg-turbo libwebp icu-libs libzip \
    && apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS linux-headers \
        libpng-dev freetype-dev libjpeg-turbo-dev libwebp-dev \
        icu-dev libzip-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_mysql intl mbstring bcmath opcache pcntl zip gd exif \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html

FROM php-base AS vendor
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev --prefer-dist --no-interaction --no-progress \
    --optimize-autoloader --no-scripts

FROM php-base AS app
COPY --chown=www-data:www-data . .
COPY --from=vendor --chown=www-data:www-data /var/www/html/vendor ./vendor
COPY docker/php/php.ini /usr/local/etc/php/conf.d/zz-app.ini
COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/zz-opcache.ini
RUN composer dump-autoload --no-dev --classmap-authoritative --no-interaction \
    && mkdir -p storage/app/public storage/framework/{cache,sessions,views} storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache
USER www-data
CMD ["php-fpm", "-F"]
```

Если package discovery требует Laravel files, запускать scripts только после `COPY . .`; не копировать `.env` для удовлетворения build scripts.
2. Настроить production PHP limits через env-aware или отдельный ini. Начальные значения согласовать с upload ADR:

```ini
expose_php=Off
memory_limit=256M
upload_max_filesize=20M
post_max_size=22M
max_execution_time=60
```

3. Настроить OPcache:

```ini
opcache.enable=1
opcache.enable_cli=1
opcache.validate_timestamps=0
opcache.memory_consumption=192
opcache.max_accelerated_files=20000
```

Для local Compose допускается отдельный override с `opcache.validate_timestamps=1`.
4. Запускать FPM от `www-data`; writable только `storage` и `bootstrap/cache`. Не делать весь `/var/www/html` writable.
5. В `.dockerignore` исключить как минимум:

```gitignore
.git
.env
.env.*
!.env.example
vendor
node_modules
frontend/node_modules
frontend/.next
storage/logs/*
storage/framework/cache/*
storage/framework/sessions/*
storage/framework/views/*
tests
docs
```

Если tests/docs нужны отдельному CI target, добавить их адресно в target, а не возвращать в production image.

## Smoke checks

Сборка должна падать при отсутствии codec/extension. Добавить CI-команду:

```bash
docker build --target app -t sedmitrans-backend:test -f Dockerfile.backend .
docker run --rm sedmitrans-backend:test php -r '
$required = ["pdo_mysql", "redis", "intl", "mbstring", "bcmath", "pcntl", "zip", "gd", "exif"];
foreach ($required as $extension) {
    if (!extension_loaded($extension)) { fwrite(STDERR, "Missing: $extension\n"); exit(1); }
}
$gd = gd_info();
foreach (["JPEG Support", "PNG Support", "WebP Support", "FreeType Support"] as $feature) {
    if (empty($gd[$feature])) { fwrite(STDERR, "Missing GD feature: $feature\n"); exit(1); }
}
'
```

Дополнительно проверить:

```bash
docker run --rm sedmitrans-backend:test php -v
docker run --rm sedmitrans-backend:test php -m
docker history sedmitrans-backend:test
```

## Критерии приёмки

- Image собирается воспроизводимо из lock file.
- PHP 8.5 и все перечисленные extensions/codec доступны.
- В layers нет `.env`, Git metadata, `node_modules`, tests и Composer cache.
- Процесс не root, приложение read-only кроме двух writable каталогов.
- Один и тот же target пригоден для FPM, Horizon и scheduler с разными Compose commands.
