<?php

namespace App\Infrastructure\Lead;

use App\Infrastructure\Persistence\Eloquent\Models\ApplicationSettingRecord;

final class LeadNotificationSettings
{
    public const EMAILS_KEY = 'lead_notifications.email_recipients';
    public const TELEGRAM_KEY = 'lead_notifications.telegram_chat_ids';

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

    /** @param list<string> $values */
    public function put(string $key, array $values): void
    {
        ApplicationSettingRecord::query()->updateOrCreate(['key' => $key], ['value' => array_values(array_unique(array_filter(array_map('trim', $values))))]);
    }

    /** @return list<string> */
    private function values(string $key): array
    {
        $value = ApplicationSettingRecord::query()->find($key)?->value ?? [];

        return array_values(array_filter(array_map('strval', is_array($value) ? $value : [])));
    }
}
