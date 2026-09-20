<?php

namespace App\Jobs;

use App\Infrastructure\Lead\LeadNotificationSettings;
use App\Infrastructure\Persistence\Eloquent\Models\LeadRecord;
use App\Infrastructure\Persistence\Eloquent\Models\NotificationDeliveryRecord;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

final class SendLeadSubmittedNotification implements ShouldBeUnique, ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 5;

    public int $timeout = 60;

    public function __construct(public readonly string $deliveryId, public readonly ?string $requestId = null)
    {
        $this->onQueue('notifications');
    }

    /** @return list<int> */
    public function backoff(): array
    {
        return [10, 60, 300];
    }

    public function uniqueId(): string
    {
        return $this->deliveryId;
    }

    /** @return list<object> */
    public function middleware(): array
    {
        return [(new WithoutOverlapping('notification-delivery:'.$this->deliveryId))->expireAfter($this->timeout)];
    }

    public function handle(): void
    {
        $delivery = NotificationDeliveryRecord::query()->findOrFail($this->deliveryId);

        // A completed outbox record makes duplicate queue delivery harmless.
        if ($delivery->status === 'delivered') {
            return;
        }

        $lead = LeadRecord::query()->findOrFail($delivery->lead_id);
        $delivery->increment('attempts');

        if ($delivery->channel === 'email') {
            $recipients = app(LeadNotificationSettings::class)->emailRecipients();
            if ($recipients === []) {
                throw new \LogicException('At least one lead notification email must be configured.');
            }

            $subject = $lead->type === 'quote' ? 'Новая заявка на расчёт' : 'Новое обращение с сайта';

            Mail::send('emails.lead-submitted', [
                'lead' => $lead,
                'logoUrl' => rtrim((string) config('app.url'), '/').'/images/logo.svg',
                'subject' => $subject,
            ], static function ($message) use ($recipients, $delivery, $subject): void {
                $message->to($recipients)
                    ->subject($subject)
                    ->getHeaders()
                    ->addTextHeader('X-Delivery-Key', $delivery->delivery_key);
            });
        } else {
            $token = (string) config('services.telegram.bot_token');
            if ($token === '') {
                throw new \LogicException('TELEGRAM_BOT_TOKEN must be configured.');
            }

            $chatIds = app(LeadNotificationSettings::class)->telegramChatIds();
            if ($chatIds === []) {
                throw new \LogicException('At least one Telegram chat_id must be configured.');
            }

            foreach ($chatIds as $chatId) {
                Http::timeout(15)
                    ->withOptions(app(LeadNotificationSettings::class)->telegramProxyOptions())
                    ->post("https://api.telegram.org/bot{$token}/sendMessage", [
                        'chat_id' => $chatId,
                        'text' => $this->text($lead),
                        'parse_mode' => 'HTML',
                    ])->throw();
            }
        }

        // CRM/webhook transports must pass delivery_key as their provider-side
        // idempotency key too.
        Log::info('Lead submission notification delivered.', [
            'delivery_key' => $delivery->delivery_key,
            'lead_id' => $delivery->lead_id,
            'channel' => $delivery->channel,
            'request_id' => $this->requestId,
        ]);

        $delivery->forceFill([
            'status' => 'delivered',
            'delivered_at' => now(),
            'failed_at' => null,
            'last_error' => null,
        ])->save();
    }

    private function text(LeadRecord $lead): string
    {
        $type = $lead->type === 'quote' ? 'Запрос расчёта' : 'Обратная связь';
        $lines = [
            '📩 <b>'.$this->telegramValue($type).'</b>',
            '👤 <b>Имя</b> - '.$this->telegramValue($lead->name),
            '📞 <b>Телефон</b> - '.$this->telegramValue($lead->phone),
            '✉️ <b>Email</b> - '.$this->telegramValue($lead->email),
        ];
        if ($lead->type === 'quote') {
            $lines[] = '📦 <b>Груз</b> - '.$this->telegramValue($lead->cargo);
            $lines[] = '🛣️ <b>Маршрут</b> - '.$this->telegramValue($lead->route);
            $lines[] = '📐 <b>Параметры груза</b> - '.$this->telegramValue($lead->cargo_parameters);
        } else {
            $lines[] = '💬 <b>Сообщение</b> - '.$this->telegramValue($lead->message);
        }

        return implode("\n", $lines);
    }

    private function telegramValue(?string $value): string
    {
        return htmlspecialchars($value ?: '—', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    public function failed(\Throwable $exception): void
    {
        NotificationDeliveryRecord::query()->whereKey($this->deliveryId)->where('status', '!=', 'delivered')->update([
            'status' => 'failed',
            'failed_at' => now(),
            'last_error' => str($exception->getMessage())->limit(1000),
            'updated_at' => now(),
        ]);
    }
}
