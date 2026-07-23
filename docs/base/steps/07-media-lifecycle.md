# Шаг 07. Реализовать lifecycle публичных и приватных файлов

## Цель

Обеспечить безопасный поток `Filament -> Laravel public disk -> storage_public volume -> Nginx -> Next/browser`, хранить в БД только относительные пути и не терять/не кешировать старые версии файлов.

## Зависимости

- Storage backend и upload limits приняты в ADR-0004.
- Filament доступен после шага 06.
- GD/WebP/EXIF есть в image шага 03.

## Область изменений

- `config/filesystems.php`, `config/image.php`, `config/images.php`;
- module-specific media Application actions и jobs;
- Filament FileUpload fields;
- API Resources;
- Nginx `/storage/` location из шага 04;
- integration tests.

## Правила данных

1. В БД хранить только относительный путь, например `services/01JXYZ.webp`.
2. Не хранить `/var/www/...`, `http://localhost...` или production domain.
3. Публичный API обычно отдаёт same-origin `"/storage/{$path}"`.
4. Абсолютный URL формировать только там, где он нужен (например Open Graph), через disk URL и текущий canonical origin.
5. Имена — UUID/ULID/content hash; при замене всегда новый path.
6. Private documents находятся на отдельном private disk и выдаются только через авторизованный download endpoint.

## Реализация public disk

Проверить конфигурацию:

```php
'public' => [
    'driver' => 'local',
    'root' => storage_path('app/public'),
    'url' => env('APP_URL').'/storage',
    'visibility' => 'public',
    'throw' => true,
],
```

Не полагаться на `public/storage` symlink внутри Nginx image: Nginx читает shared volume через `alias /var/www/storage/`.

Filament field должен явно задавать disk/directory/visibility и server-side ограничения:

```php
FileUpload::make('image_path')
    ->disk('public')
    ->directory('services')
    ->visibility('public')
    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
    ->maxSize(10 * 1024)
    ->image();
```

Client-reported MIME недостаточен: после upload проверить MIME через server-side file inspection, decode изображения, dimensions и лимит пикселей. EXIF orientation нормализовать; metadata, не нужные продукту, удалять.

## Согласованная замена и удаление

Операция замены:

1. загрузить новый файл под новым уникальным path;
2. проверить/преобразовать;
3. в DB transaction сохранить новый relative path;
4. после успешного commit удалить старый файл либо поставить idempotent cleanup job;
5. при rollback удалить новый orphan.

Нельзя сначала удалять старый файл. Удаление entity также должно ставить cleanup после commit. Периодический orphan scanner может быть safety net, но не основным механизмом.

## Media jobs

Jobs очереди `media` получают ID сущности/path, а не bytes или Eloquent graph. Минимальный контракт:

```php
final class GenerateImageVariants implements ShouldQueue
{
    public string $queue = 'media';
    public int $tries = 3;
    public int $timeout = 120;

    public function __construct(public readonly string $mediaId) {}
}
```

Job идемпотентно создаёт WebP/thumbnail во временный path, затем атомарно публикует итог. Если variant ещё не готов, API возвращает оригинал либо явный processing state — выбрать один контракт и описать его.

AVIF добавлять только после проверки поддержки runtime library и реального use case.

## Nginx и cache

Для уникальных имён допустим долгий cache:

```nginx
location ^~ /storage/ {
    alias /var/www/storage/;
    try_files $uri =404;
    add_header Cache-Control "public, max-age=31536000, immutable" always;
    add_header X-Content-Type-Options nosniff always;
}
```

Убедиться, что никакое содержимое storage не передаётся в PHP-FPM. Для документов со спорным content type использовать download response вместо public disk.

## Приёмочные тесты

- загрузить JPG, PNG и WebP через Filament;
- отклонить fake MIME, oversized dimensions и файл больше лимита;
- проверить relative path в БД и `200` по `/storage/...`;
- подтвердить сохранность файла после recreate app/nginx;
- заменить изображение: URL меняется, старый удаляется после commit;
- симулировать rollback: старый файл остаётся, новый очищается;
- удалить entity и проверить cleanup;
- private file не открывается по `/storage/...` и доступен только авторизованной роли.

## Критерии приёмки

- Laravel — единственный writer, Nginx/Next имеют только read access.
- Shared volume работает без `docker cp`, sync и frontend rebuild.
- Validation выполняется server-side, paths уникальны.
- Замена/удаление устойчивы к rollback/retry.
- Публичные и private файлы физически и логически разделены.
