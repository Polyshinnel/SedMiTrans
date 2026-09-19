# Template Site

## Локальная разработка

Требуются Docker Engine с Docker Compose v2 и свободные локальные порты `28180`,
`23307` и `26380`. Снаружи приложения доступен только Nginx по
`http://127.0.0.1:28180`; MySQL и Redis намеренно опубликованы только на loopback.

```bash
cp .env.example .env
# В .env укажите LOCAL_UID и LOCAL_GID: id -u; id -g
docker compose build
docker compose run --rm app php artisan key:generate
docker compose up -d
docker compose exec app php artisan migrate
```

После запуска проверьте:

```bash
curl -fsS http://localhost:28180/up
curl -fsS http://localhost:28180/api/v1/health
docker compose ps
```

До шага 09 frontend — временная заглушка. Она отвечает на все не-Laravel маршруты.

## Dokploy / production

Для Dokploy используйте [`docker-compose.prod.yml`](docker-compose.prod.yml), а не
локальный `docker-compose.yml`: последний намеренно монтирует исходники для
разработки. Перед деплоем добавьте production-переменные в Dokploy так, чтобы они
были доступны сервисам как `.env` (в частности `APP_KEY`, `APP_URL`, параметры БД,
Redis и `NEXT_PUBLIC_SITE_URL`). Production Compose не монтирует репозиторий в
Laravel-контейнеры, поэтому `storage/logs` и `bootstrap/cache` сохраняют владельца
`www-data` из образа.

### Администратор Filament

Создание администратора выполняется специальной командой проекта: она создаёт
активного пользователя и назначает роль `super-admin`.

Локально:

```bash
docker compose exec app php artisan identity:create-admin
```

В production:

```bash
docker compose -f docker-compose.prod.yml run --rm app php artisan identity:create-admin
```

Команда запросит имя, e-mail и пароль. `make:filament-user` для этого проекта не
используйте: он создаёт пользователя без необходимого разрешения `admin.access`.

## Команды Make

`make init` создаёт `.env`, но не собирает образы. Все команды принимают дополнительные
аргументы через `ARGS`, например `make artisan ARGS='make:controller Vehicle'` или
`make logs ARGS='app horizon'`.

```bash
make up
make down
make restart
make logs ARGS=app
make shell
make artisan ARGS='route:list'
make composer ARGS='require vendor/package'
make npm ARGS='run build'
make migrate
make seed
make test
make lint
make build
```

После изменения `composer.lock` пересоберите backend и обновите named volume с
зависимостями: `docker compose build app horizon scheduler`, затем
`docker compose run --rm app composer install`. Не удаляйте volumes командой
`docker compose down -v`, если хотите сохранить локальные MySQL, Redis и файлы uploads.
