# Шаг 05. Создать DDD-каркас и вертикальный срез обращения

## Цель

Реализовать один подтверждённый use case `Lead/SubmitQuoteRequest` от HTTP validation до транзакции, repository и domain event. Использовать DDD-разделение слоёв без модульного монолита: каркас должен доказать границы архитектуры, а не создать пустые абстракции и каталоги для будущих областей.

## Зависимости

- Шаг 01 содержит окончательные поля и статусы заявки.
- Шаги 02–04 дают MySQL/Redis и рабочее окружение.

## Целевая структура

```text
app/
  Domain/Lead/{Entities,ValueObjects,Events,Exceptions,Contracts}/
  Application/Lead/{Commands,DTO,Handlers}/
  Infrastructure/
    Persistence/Eloquent/{Models,Repositories}/
    Providers/
  Presentation/Http/Lead/{Controllers,Requests,Resources}/
  Shared/Domain/
tests/{Architecture,Unit/Domain/Lead,Integration/Lead,Feature/Api/Lead}/
```

`Lead` — namespace предметной области, а не самостоятельный модуль: ему не требуются module provider, отдельная регистрация маршрутов или изоляция от остального приложения. Не создавать `Seo`, `Website`, `Settings` и другие каталоги без первого подтверждённого use case.

## Задачи исполнителя

1. Оставить стандартный PSR-4 prefix `App\\`; отдельные mappings для `Domain`, `Application` и остальных слоёв не нужны. Зарегистрировать только необходимые общие Laravel providers в `bootstrap/providers.php`; не вводить `ModulesServiceProvider` и filesystem auto-scan.
2. Создать миграцию таблицы `leads`. Поля взять из шага 01; обязательный технический минимум:

```php
Schema::create('leads', function (Blueprint $table): void {
    $table->ulid('id')->primary();
    $table->string('idempotency_key', 128)->unique();
    $table->string('name', 120);
    $table->string('phone', 32);
    $table->string('email')->nullable();
    $table->text('message')->nullable();
    $table->string('status', 32)->index();
    $table->timestamp('submitted_at');
    $table->timestamps();
});
```

Если продуктовые поля отличаются, обновить пример и API contract.
3. Domain не должен использовать Laravel types. Пример контракта repository:

```php
namespace App\Domain\Lead\Contracts;

use App\Domain\Lead\Entities\Lead;

interface LeadRepository
{
    public function save(Lead $lead): void;

    public function findByIdempotencyKey(string $key): ?Lead;
}
```

4. Domain entity/aggregate должен:
   - создаваться через named constructor;
   - нормализовать и проверять значения через value objects;
   - начинать с подтверждённого начального статуса;
   - записывать `LeadSubmitted` как domain event;
   - не вызывать DB, queue, mail, `event()` или `dispatch()` напрямую.
5. Создать immutable command и handler:

```php
final readonly class SubmitQuoteRequest
{
    public function __construct(
        public string $idempotencyKey,
        public string $name,
        public string $phone,
        public ?string $email,
        public ?string $message,
    ) {}
}
```

Handler проверяет idempotency, создаёт aggregate, сохраняет его в одной DB transaction и публикует events только после успешного commit. Для надёжной внешней интеграции зафиксировать решение outbox; простой `afterCommit` допустим для первого релиза только как осознанный компромисс.
6. Eloquent model оставить в `Infrastructure/Persistence/Eloquent/Models`; model не выходит наружу. Repository выполняет mapping entity ↔ persistence record.
7. Создать `FormRequest` с подтверждёнными limits и controller `POST /api/v1/leads/quote-requests`. Controller только преобразует request в command, вызывает handler и возвращает Resource/response.
8. Единый успешный ответ:

```json
{
  "data": {
    "id": "01...",
    "status": "submitted"
  }
}
```

Повтор с тем же `Idempotency-Key` и тем же payload должен вернуть существующий результат без второй строки/job. Конфликтующий payload с тем же key — `409`.
9. Ограничить endpoint отдельным named rate limiter. Значение взять из SLA; IP и, при необходимости, нормализованный phone использовать без записи ПДн в log.
10. Описать в `docs/Architecture.md` ответственность Lead, таблицу `leads`, публичный application contract и событие. Отдельный README рядом с кодом не требуется.

## Architecture tests

Добавить тесты, которые сканируют PHP files/AST выбранным инструментом и запрещают в `app/Domain`:

- namespace/imports `Illuminate\*`, `Filament\*`;
- наследование Eloquent Model;
- вызовы Laravel facades/helpers инфраструктурного характера;
- зависимости Domain на `Application`, `Infrastructure` или `Presentation`.

Простая строковая проверка допустима как старт, но AST/dependency tool предпочтительнее и должен быть зафиксирован Composer dev dependency.

## Набор тестов

- Unit: value objects, создание Lead, недопустимые state transitions, запись event.
- Integration: Eloquent repository сохраняет и восстанавливает aggregate на MySQL.
- Feature: `201`, validation `422`, rate limit `429`, idempotent repeat, conflict `409`.
- Transaction: event/job не публикуется при rollback.
- Architecture: Domain не зависит от framework.

## Критерии приёмки

- Use case проходит unit, integration, feature и architecture suites.
- В Domain нет Laravel/Eloquent/Filament.
- Controller/Request/Resource не содержат бизнес-правил.
- Дубликат запроса не создаёт вторую заявку.
- Событие публикуется после commit; retry не дублирует будущую интеграцию.
- Миграция выполняется на чистой MySQL 8.4 и откатывается в test environment.
