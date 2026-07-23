# Детализированный план реализации

Этот каталог превращает `docs/base/ProjectPlan.md` в последовательность изолированных пакетов работ. Один файл — одно задание, которое можно передать отдельному исполнителю. Исполнитель меняет только перечисленные в его шаге области; новые решения, влияющие на соседние шаги, оформляются ADR и передаются следующему исполнителю.

## Порядок выполнения

| № | Шаг | Зависит от | Основной результат |
|---:|---|---|---|
| 01 | [Решения и ADR](01-decisions-and-adr.md) | — | Сняты продуктовые и инфраструктурные неопределённости |
| 02 | [Backend foundation](02-backend-foundation.md) | 01 | Laravel настроен на MySQL/Redis, есть readiness API |
| 03 | [Backend Docker image](03-backend-docker-image.md) | 02 | Воспроизводимый PHP 8.5 image со всеми extensions |
| 04 | [Локальное окружение](04-local-compose.md) | 03 | Docker Compose, Nginx и команды разработчика |
| 05 | [DDD-каркас и Lead slice](05-ddd-lead-slice.md) | 01–04 | Первый use case проходит от API до БД и события |
| 06 | [Identity и Filament](06-filament-identity.md) | 05 | Защищённая русская административная панель |
| 07 | [Media lifecycle](07-media-lifecycle.md) | 06 | Безопасная загрузка, преобразование и раздача файлов |
| 08 | [Horizon и scheduler](08-horizon-and-scheduler.md) | 05, 06 | Очереди разделены и наблюдаемы, Horizon защищён |
| 09 | [Next.js и Mantine](09-nextjs-mantine-shell.md) | 01, 04 | Рабочий SSR shell и типизированный API client |
| 10 | [Сквозная SSR-интеграция](10-ssr-api-integration.md) | 05, 07–09 | Публичная форма и media проходят весь vertical slice |
| 11 | [Production images и Nginx](11-production-images-nginx.md) | 03, 07, 09, 10 | Immutable production images и единая маршрутизация |
| 12 | [Production Compose](12-production-compose.md) | 11 | Production topology без bind mounts и открытых БД-портов |
| 13 | [CI и quality gates](13-ci-quality-gates.md) | 10–12 | Проверки backend/frontend/images/SSR автоматизированы |
| 14 | [Dokploy и выпуск](14-dokploy-deployment.md) | 12, 13 | Staging/production deployment, release и rollback |
| 15 | [Эксплуатация и безопасность](15-operations-security.md) | 14 | Backup/restore, monitoring, hardening и runbooks |

Шаги выполняются по порядку. После завершения каждого шага исполнитель должен приложить список изменённых файлов, команды проверки и результаты проверок. Если зависимый сервис ещё не готов, допускаются только явно помеченные временные заглушки; критерии приёмки шага всё равно должны выполняться.

## Общие правила для всех исполнителей

- Не коммитить `.env`, ключи, пароли, токены, дампы БД и содержимое persistent volumes.
- Не менять публичный API без обновления `docs/ApiContract.md` или OpenAPI-схемы.
- Не обращаться к Eloquent-модели из Domain или Presentation; изменения бизнес-состояния идут через Application use case.
- Не помещать бизнес-правила в Controller, FormRequest, API Resource или Filament Resource.
- В production не выполнять install/build/migrate в entrypoint реплик.
- Все примеры кода в шагах являются минимальной формой контракта. Имена полей из шага 01 имеют приоритет над примерами.
- Для каждого нового поведения добавлять тест на наиболее важный успешный сценарий и хотя бы один отказ.

## Общая финальная проверка

После шага 15 должны одновременно выполняться критерии раздела 10 исходного плана: чистый clone поднимается по README, SSR виден в исходном HTML, API/Admin/Horizon доступны на одном origin, внутренние порты закрыты, очередь и scheduler работают, media переживает пересоздание контейнеров, backup восстановлен на тесте, rollback задокументирован и секреты отсутствуют в Git/images/frontend bundle/logs.
