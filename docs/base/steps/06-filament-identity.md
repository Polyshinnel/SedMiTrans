# Шаг 06. Реализовать Identity и защитить Filament

## Цель

Поднять русскоязычную панель `/admin`, разрешённую только активным администраторам с server-side ролями, и дать операторам доступ к заявкам без обхода application layer.

## Зависимости

- Матрица ролей принята на шаге 01.
- Lead use case и DDD-соглашения готовы на шаге 05.

## Область изменений

- `app/Domain/Identity/**`, `app/Application/Identity/**` и необходимая инфраструктура;
- Filament panel provider/config;
- `app/Presentation/Filament/Lead/**`;
- миграции Identity/audit;
- отдельная Artisan-команда создания администратора;
- feature/authorization tests.

## Задачи исполнителя

1. Создать предметную область `Identity` только с подтверждённым use case управления доступом. Допускается адаптировать исходный `App\Models\User` как infrastructure model, но наружу Identity должен предоставлять понятные permissions/contracts.
2. Добавить поля/таблицы согласно ADR: как минимум active flag и role/permissions. Не хранить роль только в session/UI. Для нескольких ролей/permissions выбрать поддерживаемую схему и зафиксировать её в `docs/Architecture.md`.
3. Настроить Filament panel:

```php
public function panel(Panel $panel): Panel
{
    return $panel
        ->id('admin')
        ->path('admin')
        ->login()
        ->defaultLocale('ru');
}
```

Фактические методы сверить с установленной major-версией Filament. Метод `registration()` не вызывать: регистрация должна отсутствовать и в routes.
4. Реализовать `FilamentUser::canAccessPanel()` или актуальный эквивалент:

```php
public function canAccessPanel(Panel $panel): bool
{
    return $this->is_active
        && $panel->getId() === 'admin'
        && $this->hasPermission('admin.access');
}
```

5. Настроить login rate limiter, password policy, secure cookies через env и invalidation session при деактивации пользователя. В production требуются `SESSION_SECURE_COOKIE=true`, `SESSION_HTTP_ONLY=true`, `SESSION_SAME_SITE=lax`.
6. Создать интерактивную Artisan-команду, например `identity:create-admin`. Пароль запрашивать скрыто, проверять policy и hash через Laravel. Команда не принимает пароль как обязательный CLI argument, чтобы он не попал в shell history/process list.
7. Не создавать администратора seeder с фиксированным password и не включать default credentials.
8. Создать Lead Filament Resource. Table может читать projection/query service, но create/update/status actions обязаны вызывать Application handlers. Запретить mass assignment статуса напрямую.
9. Добавить audit критических действий: actor ID, action, entity type/ID, timestamp, безопасный diff без password/token/избыточных ПДн.
10. Зарегистрировать Filament resources явно или через ограниченное discovery внутри `Presentation/Filament`; не сканировать весь repository.
11. Настроить locale `ru` и отображение времени в `Europe/Moscow`; timestamps в storage/API остаются согласно ADR.

## Пример application action для статуса

```php
final readonly class ChangeLeadStatus
{
    public function __construct(
        public string $leadId,
        public string $targetStatus,
        public string $actorId,
    ) {}
}
```

Filament action формирует command и обрабатывает domain exception как понятное notification; список допустимых переходов задаёт aggregate/application policy, а не dropdown resource.

## Тесты

- anonymous `/admin` перенаправляется на login;
- inactive admin не входит даже с верным password;
- каждая роль соответствует матрице шага 01;
- прямой POST/Livewire action не обходит permission;
- недопустимый переход статуса отклонён domain layer;
- audit record создан и не содержит чувствительных полей;
- публичного register route нет;
- Horizon permission пока может быть contract-заглушкой, но будет подключён в шаге 08.

## Критерии приёмки

- Первый admin создаётся только одноразовой командой.
- `/admin` защищён server-side, cookies/password/rate limit настроены.
- Lead CRUD/actions не меняют Eloquent model в обход use case.
- Панель русифицирована, timezone корректна.
- Permissions и audit покрыты feature tests.
