# Шаг 04. Собрать локальное Docker Compose окружение

## Цель

Обеспечить проверенный запуск чистого clone через один Nginx origin на `127.0.0.1:28180`, с MySQL/Redis persistence, PHP-FPM, Horizon, scheduler и frontend dev server.

## Зависимости

- Завершён шаг 03.
- Если Next.js ещё не создан, сервис `frontend` может временно отдавать минимальную заглушку из отдельного target; после шага 09 заглушка обязательно удаляется.

## Изменяемые файлы

- `docker-compose.yml`;
- `docker/nginx/default.conf`;
- `docker/mysql/my.cnf`;
- `Makefile` или `justfile`;
- `README.md`;
- local target/override в `Dockerfile.backend`, если нужен;
- `.env.example` только для отсутствующих local variables.

## Сервисы и порты

| Сервис | Host binding | Внутренний порт |
|---|---|---:|
| nginx | `127.0.0.1:${APP_HTTP_PORT:-28180}` | 80 |
| mysql | `127.0.0.1:${MYSQL_HOST_PORT:-23307}` | 3306 |
| redis | `127.0.0.1:${REDIS_HOST_PORT:-26380}` | 6379 |
| app | отсутствует | 9000 |
| frontend | отсутствует | 3000 |

MySQL и Redis нельзя привязывать к `0.0.0.0`.

## Compose skeleton

Исполнитель должен дополнить healthchecks, env и mounts, сохраняя эту топологию:

```yaml
services:
  nginx:
    image: nginx:1.27-alpine
    ports:
      - "127.0.0.1:${APP_HTTP_PORT:-28180}:80"
    volumes:
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
      - ./public:/var/www/html/public:ro
      - storage_public:/var/www/storage:ro
    depends_on:
      app:
        condition: service_started
      frontend:
        condition: service_started

  app:
    build:
      context: .
      dockerfile: Dockerfile.backend
      target: development
    working_dir: /var/www/html
    command: php-fpm -F
    volumes:
      - .:/var/www/html
      - backend_vendor:/var/www/html/vendor
      - storage_public:/var/www/html/storage/app/public
    depends_on:
      mysql: { condition: service_healthy }
      redis: { condition: service_healthy }

  horizon:
    extends: { service: app }
    command: php artisan horizon
    ports: []

  scheduler:
    extends: { service: app }
    command: php artisan schedule:work
    ports: []

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
      target: deps
    working_dir: /app
    command: npm run dev -- --hostname 0.0.0.0
    volumes:
      - ./frontend:/app
      - frontend_node_modules:/app/node_modules

  mysql:
    image: mysql:8.4
    ports:
      - "127.0.0.1:${MYSQL_HOST_PORT:-23307}:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD-SHELL", "mysqladmin ping -h 127.0.0.1 -u$$MYSQL_USER -p$$MYSQL_PASSWORD --silent"]
      interval: 5s
      timeout: 5s
      retries: 20

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    ports:
      - "127.0.0.1:${REDIS_HOST_PORT:-26380}:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 20

volumes:
  mysql_data:
  redis_data:
  storage_public:
  backend_vendor:
  frontend_node_modules:
```

В `Dockerfile.backend` добавить `development` target с dev-зависимостями Composer. Named volume `backend_vendor` при первом создании получает `/var/www/html/vendor` из image и не скрывается корневым bind mount. После изменения `composer.lock` пересобрать image/volume документированной командой либо выполнить `composer install` в контейнере. Не копировать пример буквально без проверки: `extends` с mounts может дать нежелательное объединение volume lists. Итог `docker compose config` должен показывать ровно нужные mounts для каждого процесса.

## Nginx local routing

`docker/nginx/default.conf` обязан:

- направлять `/api`, `/admin`, `/livewire`, `/horizon` и Laravel assets в FPM;
- отдавать `/storage/` через `alias /var/www/storage/`;
- направлять остальные запросы и `/_next/` на `frontend:3000`;
- передавать `Host`, `X-Forwarded-For`, `X-Forwarded-Proto`, request ID;
- запрещать dotfiles и произвольное исполнение PHP.

Для PHP routes используйте единый named location, который всегда исполняет `public/index.php`, а не пользовательский URI как имя PHP-файла:

```nginx
location ~ ^/(api|admin|livewire|horizon)(/|$) {
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME /var/www/html/public/index.php;
    fastcgi_param SCRIPT_NAME /index.php;
    fastcgi_param REQUEST_URI $request_uri;
    fastcgi_pass app:9000;
}

location ^~ /storage/ {
    alias /var/www/storage/;
    try_files $uri =404;
}

location / {
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Request-Id $request_id;
    proxy_pass http://frontend:3000;
}
```

Проверить корректность `alias` фактическим файлом, поскольку `try_files` с `alias` требует внимания к преобразованию path.

## Команды разработчика

В `Makefile`/`justfile` добавить: `init`, `up`, `down`, `restart`, `logs`, `shell`, `artisan`, `composer`, `npm`, `migrate`, `seed`, `test`, `lint`, `build`. Команды должны прокидывать пользовательские аргументы документированным способом.

README quick start после проверки:

```bash
cp .env.example .env
docker compose build
docker compose run --rm app php artisan key:generate
docker compose up -d
docker compose exec app php artisan migrate
```

## Проверки

```bash
docker compose config
docker compose build
docker compose up -d
docker compose ps
curl -fsS http://localhost:28180/up
curl -fsS http://localhost:28180/api/v1/health
docker compose exec mysql mysqladmin ping -h 127.0.0.1 -usedmitrans -psedmitrans
docker compose exec redis redis-cli ping
```

Перезапустить Compose и подтвердить сохранность тестовой строки MySQL, Redis key и файла в `storage_public`.

## Критерии приёмки

- Quick start из README работает на чистом clone без ручного входа в контейнер.
- Публичен только Nginx; DB/Redis доступны с host лишь по loopback.
- Hot reload backend/frontend работает.
- Healthchecks достигают healthy, логи доступны отдельным сервисам.
- UID/GID не создают файлы, которые host user не может изменить.
- Данные трёх named volumes переживают `docker compose down` и повторный `up`.
