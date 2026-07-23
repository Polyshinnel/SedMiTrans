# Шаг 08. Настроить Horizon, очереди и scheduler

## Цель

Разделить jobs по workloads, зафиксировать retry/idempotency policy, защитить dashboard `/horizon` и обеспечить корректный restart workers после deploy.

## Зависимости

- Lead event существует после шага 05.
- Identity permission существует после шага 06.
- Media job contract известен после шага 07.

## Задачи исполнителя

1. Настроить `config/horizon.php` с supervisors минимум для:
   - `default` — короткие внутренние jobs;
   - `notifications` — email/CRM/webhook;
   - `media` — изображения/файлы;
   - `imports` — резерв для будущих длительных импортов; supervisor можно не запускать до первого job.
2. Не обслуживать тяжёлую `media` тем же supervisor, что latency-sensitive notifications.
3. Начальные production значения оформить через env; пример, требующий нагрузочной корректировки:

```php
'supervisor-notifications' => [
    'connection' => 'redis',
    'queue' => ['notifications'],
    'balance' => 'auto',
    'minProcesses' => 1,
    'maxProcesses' => 4,
    'tries' => 5,
    'timeout' => 60,
    'memory' => 128,
],
'supervisor-media' => [
    'connection' => 'redis',
    'queue' => ['media'],
    'balance' => 'simple',
    'processes' => 1,
    'tries' => 3,
    'timeout' => 180,
    'memory' => 256,
],
```

4. Job-specific `backoff()` использовать для внешних интеграций, например `[10, 60, 300]`. Retry разрешён только для timeout/429/5xx и иных явно повторяемых ошибок; validation/4xx переводятся в permanent failure.
5. Notification listener на `LeadSubmitted` ставит job в `notifications` после commit. Идемпотентность обеспечить unique delivery key/outbox record. Повтор job не отправляет второе письмо/webhook.
6. В jobs передавать scalar IDs/small DTO, не file contents и не большие serialized Eloquent relations.
7. Проверить migration `failed_jobs` и политику pruning. В `routes/console.php` или scheduler registration добавить:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('horizon:snapshot')->everyFiveMinutes();
Schedule::command('queue:prune-failed --hours=168')->daily();
```

Retention completed/recent/failed jobs настроить через секцию `trim` в `config/horizon.php`; `horizon:purge` по расписанию не запускать, поскольку эта команда очищает очереди. Точные retention values взять из эксплуатационных требований.
8. Защитить Horizon через gate/provider:

```php
Gate::define('viewHorizon', static fn ($user): bool =>
    $user->is_active && $user->hasPermission('horizon.view')
);
```

Проверка должна действовать и в production. Nginx basic auth/IP allowlist может быть вторым слоем, но не заменяет gate.
9. Добавить deployment hook `php artisan horizon:terminate`; Compose restart policy поднимает процесс на новом code/image.
10. Добавить health/observability signal для worker и scheduler. Отсутствие процесса, старый heartbeat и чрезмерный queue wait должны быть различимы.

## Тестовые jobs

Создать не демонстрационный production endpoint, а test-only/integration job, который:

- записывает marker в DB/Redis;
- умеет один раз упасть и успешно retry;
- показывает, в какой очереди выполнен;
- не дублирует side effect.

## Проверки

```bash
docker compose exec app php artisan horizon:status
docker compose exec app php artisan schedule:list
docker compose exec app php artisan queue:failed
docker compose exec app php artisan horizon:snapshot
```

Integration test должен отправить заявку, дождаться job ограниченное время и проверить ровно один notification delivery record.

## Критерии приёмки

- Jobs видны в Horizon и обрабатываются правильными supervisors.
- Failed/retry/permanent failure воспроизводимы тестами.
- `/horizon` недоступен anonymous и роли без permission.
- Scheduler выполняет snapshot/pruning и публикует heartbeat.
- `horizon:terminate` завершает workers gracefully, job не теряется и не дублирует side effect.
