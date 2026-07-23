<?php

namespace App\Jobs;

use App\Infrastructure\Persistence\Eloquent\Models\NotificationDeliveryRecord;
use App\Infrastructure\Persistence\Eloquent\Models\LeadRecord;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

final class SendLeadSubmittedNotification implements ShouldQueue, ShouldBeUnique
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
        $recipient = (string) config('services.lead_notifications.to');

        if ($recipient === '') {
            throw new \LogicException('LEAD_NOTIFICATION_TO must be configured.');
        }

        Mail::raw(
            "New quote request from {$lead->name} ({$lead->phone}).",
            static function ($message) use ($recipient, $delivery): void {
                $message->to($recipient)
                    ->subject('New quote request')
                    ->getHeaders()
                    ->addTextHeader('X-Delivery-Key', $delivery->delivery_key);
            },
        );

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
