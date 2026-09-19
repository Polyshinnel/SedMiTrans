<?php

namespace App\Infrastructure\Seo;

use App\Infrastructure\Persistence\Eloquent\Models\SeoPageRecord;

final class SeoPageSettings
{
    /** @return array{key: string, name: string, path: string, title: string, description: string}|null */
    public function find(string $key): ?array
    {
        $record = SeoPageRecord::query()->where('key', $key)->first();

        return $record?->only(['key', 'name', 'path', 'title', 'description']);
    }

    /** @return list<array{key: string, name: string, path: string, title: string, description: string}> */
    public function all(): array
    {
        return SeoPageRecord::query()->orderBy('id')->get()
            ->map(static fn (SeoPageRecord $record): array => $record->only(['key', 'name', 'path', 'title', 'description']))
            ->all();
    }
}
