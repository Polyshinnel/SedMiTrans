<?php

namespace App\Infrastructure\Lead;

use App\Infrastructure\Persistence\Eloquent\Models\ApplicationSettingRecord;

final class LeadNotificationSettings
{
    public const EMAILS_KEY = 'lead_notifications.email_recipients';

    public const TELEGRAM_KEY = 'lead_notifications.telegram_chat_ids';

    public const TELEGRAM_PROXY_KEY = 'lead_notifications.telegram_proxy';

    /** @return list<string> */
    public function emailRecipients(): array
    {
        return $this->values(self::EMAILS_KEY);
    }

    /** @return list<string> */
    public function telegramChatIds(): array
    {
        return $this->values(self::TELEGRAM_KEY);
    }

    /** @return array{enabled: bool, host: string, port: int} */
    public function telegramProxy(): array
    {
        $value = ApplicationSettingRecord::query()->find(self::TELEGRAM_PROXY_KEY)?->value;
        $value = is_array($value) ? $value : [];

        return [
            'enabled' => (bool) ($value['enabled'] ?? false),
            'host' => trim((string) ($value['host'] ?? '')),
            'port' => max(1, min(65535, (int) ($value['port'] ?? 3128))),
        ];
    }

    /** @return array<string, string> */
    public function telegramProxyOptions(): array
    {
        $proxy = $this->telegramProxy();

        if (! $proxy['enabled'] || $proxy['host'] === '') {
            return [];
        }

        return ['proxy' => sprintf('http://%s:%d', $proxy['host'], $proxy['port'])];
    }

    /** @param list<string> $values */
    public function put(string $key, array $values): void
    {
        ApplicationSettingRecord::query()->updateOrCreate(['key' => $key], ['value' => array_values(array_unique(array_filter(array_map('trim', $values))))]);
    }

    public function putTelegramProxy(bool $enabled, string $host, int $port): void
    {
        ApplicationSettingRecord::query()->updateOrCreate(
            ['key' => self::TELEGRAM_PROXY_KEY],
            ['value' => [
                'enabled' => $enabled,
                'host' => trim($host),
                'port' => max(1, min(65535, $port)),
            ]],
        );
    }

    /** @return list<string> */
    private function values(string $key): array
    {
        $value = ApplicationSettingRecord::query()->find($key)?->value ?? [];

        return array_values(array_filter(array_map('strval', is_array($value) ? $value : [])));
    }
}
