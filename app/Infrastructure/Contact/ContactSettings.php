<?php

namespace App\Infrastructure\Contact;

use App\Infrastructure\Persistence\Eloquent\Models\ApplicationSettingRecord;

final class ContactSettings
{
    public const KEY = 'site.contacts';

    /** @return array{phone: string, email: string, address: string, telegram_url: string, whatsapp_url: string, max_url: string, working_hours: string, latitude: string, longitude: string} */
    public function get(): array
    {
        $value = ApplicationSettingRecord::query()->find(self::KEY)?->value;
        $value = is_array($value) ? $value : [];

        return [
            'phone' => (string) ($value['phone'] ?? '+7 (495) 123-45-67'),
            'email' => (string) ($value['email'] ?? 'info@sedmitrans.ru'),
            'address' => (string) ($value['address'] ?? 'г. Смоленск, ул. Нормандия-Неман, д. 35'),
            'telegram_url' => (string) ($value['telegram_url'] ?? ''),
            'whatsapp_url' => (string) ($value['whatsapp_url'] ?? ''),
            'max_url' => (string) ($value['max_url'] ?? ''),
            'working_hours' => (string) ($value['working_hours'] ?? 'Пн–Пт: 09:00–18:00, Сб–Вс: выходной'),
            'latitude' => (string) ($value['latitude'] ?? '54.77908'),
            'longitude' => (string) ($value['longitude'] ?? '32.0162'),
        ];
    }

    /** @param array<string, string|null> $value */
    public function put(array $value): void
    {
        ApplicationSettingRecord::query()->updateOrCreate(
            ['key' => self::KEY],
            ['value' => array_map(static fn (?string $item): string => trim((string) $item), $value)],
        );
    }
}
