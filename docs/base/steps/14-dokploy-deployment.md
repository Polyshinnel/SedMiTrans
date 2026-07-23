# Шаг 14. Настроить Dokploy, release и rollback

## Цель

Развернуть один и тот же release сначала в staging, затем в production; настроить TLS, volumes, secrets, healthcheck, миграции и проверенный rollback.

## Зависимости

- Production Compose принят на шаге 12.
- CI публикует immutable images и quality gate готов после шага 13.
- Домены/DNS и доступ к Dokploy согласованы на шаге 01.

## Подготовить `docs/Deployment.md`

Документ должен содержать точные UI/CLI действия для используемой версии Dokploy:

1. создание Compose application из repository/branch либо immutable images;
2. привязка domain к `nginx`, container port `80`;
3. TLS и HTTP → HTTPS;
4. volume names/mount points;
5. environment variable checklist;
6. pre/release/post-deploy commands;
7. smoke checks;
8. rollback на предыдущий image tag;
9. troubleshooting DNS/network/permissions/healthcheck.

## Production variables

Задать в Dokploy secrets/environment, не в Git:

```dotenv
APP_NAME=sedmitrans.ru
APP_ENV=production
APP_KEY=base64:...
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
DB_PASSWORD=...

REDIS_CLIENT=phpredis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=...
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

Заменить domains и internal DNS фактическими значениями. `NEXT_PUBLIC_API_URL` не secret; `APP_KEY`, DB/Redis credentials и webhook secrets — secrets.

## Staging rollout

1. Проверить DNS и TLS.
2. Создать/подключить три persistent volumes.
3. Запустить dependencies и healthchecks.
4. Снять backup, если окружение не пустое.
5. Один раз выполнить `php artisan migrate --force` как release command.
6. Запустить/обновить services.
7. Выполнить `php artisan horizon:terminate` в корректном release context.
8. Одноразовой интерактивной командой создать первого администратора; пароль передать безопасным каналом.
9. Выполнить smoke checklist из шага 13 и media persistence check.
10. Провести минимальный rollback rehearsal до production.

## Rollback

Документировать два разных сценария:

- code-only rollback: вернуть все три image tags одного release, restart, smoke;
- schema-affecting rollback: проверить backward compatibility. Не выполнять `migrate:rollback` автоматически; сначала оценить данные и migration plan.

Rollback должен сохранять named volumes. Зафиксировать команду/действие выбора предыдущего immutable tag и максимальное допустимое время восстановления.

## Production rollout

- Использовать те же image digests, что прошли staging, без rebuild.
- Перед миграцией проверить свежий backup и свободное место.
- Применить release command один раз.
- Контролировать health, `5xx`, queue wait, restart count и logs во время rollout.
- После успешного smoke включить/оставить automatic deploy только за CI gate.

## Критерии приёмки

- Публичен только HTTPS Nginx origin; HTTP перенаправляется.
- Volumes не пересоздаются при deploy и media остаётся доступна.
- Secrets отсутствуют в Compose/repository/build logs.
- Admin создан без default credentials, `/admin` и `/horizon` защищены.
- Migration выполняется один раз, workers перезапущены на новом code.
- Staging smoke, production smoke и реальный rollback rehearsal задокументированы результатами.
