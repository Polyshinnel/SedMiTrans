<?php

namespace App\Listeners;

use App\Domain\Lead\Events\LeadSubmitted;
use App\Infrastructure\Persistence\Eloquent\Models\NotificationDeliveryRecord;
use App\Jobs\SendLeadSubmittedNotification;
use Illuminate\Support\Str;

final class QueueLeadSubmittedNotification
{
    /**
     * This listener is invoked only after SubmitQuoteRequestHandler has committed
     * the lead transaction. delivery_key is the outbox/idempotency key.
     */
    public function handle(LeadSubmitted $event): void
    {
        foreach (['email', 'telegram'] as $channel) {
            $delivery = NotificationDeliveryRecord::query()->firstOrCreate(
                ['delivery_key' => 'lead-submitted:'.$event->leadId.':'.$channel],
                [
                    'id' => (string) Str::ulid(),
                    'lead_id' => $event->leadId,
                    'channel' => $channel,
                    'status' => 'pending',
                ],
            );

            if ($delivery->wasRecentlyCreated) {
                SendLeadSubmittedNotification::dispatch($delivery->id, $event->requestId)->onQueue('notifications');
            }
        }
    }
}
