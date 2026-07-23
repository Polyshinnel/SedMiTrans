# Шаг 12. Создать production Docker Compose

## Цель

Описать production topology без bind mounts исходников и host ports внутренних сервисов, с persistent volumes, healthchecks, limits, log rotation и единичным release step миграций.

## Зависимости

- Production images и routing готовы после шага 11.

## Изменяемые файлы

- `docker-compose.prod.yml`;
- `.env.production.example` либо documented Dokploy variable list без secrets;
- `docs/Deployment.md` (локальный smoke/release раздел).

## Обязательная topology

Сервисы: `nginx`, `app`, `frontend`, `horizon`, `scheduler`, `mysql`, `redis`. `app`, `horizon`, `scheduler` используют один `BACKEND_IMAGE` и один tag/digest.

Compose skeleton:

```yaml
services:
  nginx:
    image: ${NGINX_IMAGE}
    restart: unless-stopped
    ports:
      - "80"
    volumes:
      - storage_public:/var/www/storage:ro
    depends_on:
      app: { condition: service_healthy }
      frontend: { condition: service_healthy }
    networks: [internal]

  app:
    image: ${BACKEND_IMAGE}
    restart: unless-stopped
    env_file: []
    volumes:
      - storage_public:/var/www/html/storage/app/public
    networks: [internal]

  horizon:
    image: ${BACKEND_IMAGE}
    command: ["php", "artisan", "horizon"]
    restart: unless-stopped
    volumes:
      - storage_public:/var/www/html/storage/app/public
    networks: [internal]

  scheduler:
    image: ${BACKEND_IMAGE}
    command: ["php", "artisan", "schedule:work"]
    restart: unless-stopped
    networks: [internal]

  frontend:
    image: ${FRONTEND_IMAGE}
    restart: unless-stopped
    networks: [internal]

  mysql:
    image: mysql:8.4
    restart: unless-stopped
    volumes:
      - mysql_data:/var/lib/mysql
    networks: [internal]

  redis:
    image: redis:7-alpine
    command: ["redis-server", "--appendonly", "yes"]
    restart: unless-stopped
    volumes:
      - redis_data:/data
    networks: [internal]

networks:
  internal:
    internal: true

volumes:
  mysql_data:
  redis_data:
  storage_public:
```

В Dokploy ingress должен достигать Nginx. Если `internal: true` мешает platform ingress, разделить на `edge` network для Nginx и `internal` для upstreams; не публиковать остальные сервисы.

## Настройки, обязательные для каждого сервиса

1. Healthcheck с реалистичными `start_period`, timeout и retries.
2. Log rotation:

```yaml
logging:
  driver: json-file
  options:
    max-size: 10m
    max-file: "5"
```

3. Resource reservations/limits по возможностям Dokploy Compose. Особое внимание Node, Horizon, MySQL.
4. `stop_grace_period` достаточный для FPM/Horizon jobs; timeout job не должен превышать grace period без осознанной стратегии.
5. MySQL charset/collation/strict и Redis AOF.
6. Secrets только из environment/secrets Dokploy. Не использовать committed `env_file` с production values.
7. Backend replica code immutable; никаких bind mounts repository.

## Release process

Миграции выполнять один раз:

```bash
php artisan migrate --force
```

Не добавлять эту команду в entrypoint `app`, `horizon`, `scheduler`. Для destructive/large migrations описать expand-migrate-contract rollout:

1. backup;
2. backward-compatible schema expansion;
3. deploy совместимого code;
4. resumable backfill command/job;
5. прекращение чтения старого поля;
6. удаление в позднем релизе.

После deploy выполнить `php artisan horizon:terminate` для старых workers.

## Проверка на чистых volumes

Использовать отдельный project name, чтобы не задеть local volumes:

```bash
docker compose -p sedmitrans-prod-smoke -f docker-compose.prod.yml config
docker compose -p sedmitrans-prod-smoke -f docker-compose.prod.yml up -d
docker compose -p sedmitrans-prod-smoke -f docker-compose.prod.yml run --rm app php artisan migrate --force
```

Перед cleanup записать заявку и media file, перезапустить services и проверить persistence. Удаление smoke volumes — отдельное осознанное действие после проверки их точного имени.

## Критерии приёмки

- `docker compose config` валиден без bind mounts и host ports DB/Redis/FPM/Node.
- Чистые volumes проходят migration и общий smoke test.
- Повторный start не повреждает данные и не запускает параллельные migrations.
- Nginx единственный edge service; backend/frontend доступны только по networks.
- Limits, rotation, healthchecks и graceful shutdown заданы.
- Один tag backend используется тремя Laravel processes.
