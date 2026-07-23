<?php

namespace Tests\Feature\Queue;

use App\Domain\Lead\Events\LeadSubmitted;
use App\Infrastructure\Persistence\Eloquent\Models\NotificationDeliveryRecord;
use App\Jobs\SendLeadSubmittedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

final class LeadSubmittedNotificationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        if (! in_array('sqlite', \PDO::getAvailableDrivers(), true)) {
            $this->markTestSkipped('The SQLite PDO driver is not installed. Run this feature suite in the MySQL test environment.');
        }

        parent::setUp();
    }

    public function test_a_submitted_lead_enqueues_one_idempotent_notification_delivery(): void
    {
        Queue::fake();

        $response = $this->postJson('/api/v1/leads/quote-requests', [
            'name' => 'Alice',
            'phone' => '+79991234567',
        ], ['Idempotency-Key' => 'notification-request-1'])->assertCreated();

        $leadId = $response->json('data.id');

        self::assertDatabaseCount('notification_deliveries', 1);
        self::assertDatabaseHas('notification_deliveries', [
            'lead_id' => $leadId,
            'delivery_key' => 'lead-submitted:'.$leadId.':email',
            'status' => 'pending',
        ]);
        Queue::assertPushedOn('notifications', SendLeadSubmittedNotification::class);

        event(new LeadSubmitted($leadId, new \DateTimeImmutable));

        self::assertDatabaseCount('notification_deliveries', 1);
        self::assertCount(1, Queue::pushed(SendLeadSubmittedNotification::class));
    }

    public function test_replayed_notification_job_does_not_repeat_the_delivery_side_effect(): void
    {
        $lead = new \App\Infrastructure\Persistence\Eloquent\Models\LeadRecord;
        $lead->id = '01J00000000000000000000001';
        $lead->forceFill([
            'idempotency_key' => 'notification-job-replay',
            'name' => 'Alice',
            'phone' => '+79991234567',
            'status' => 'new',
            'submitted_at' => now(),
        ]);
        $lead->save();

        $delivery = NotificationDeliveryRecord::query()->create([
            'id' => '01J00000000000000000000000',
            'delivery_key' => 'lead-submitted:test:email',
            'lead_id' => $lead->id,
            'channel' => 'email',
            'status' => 'delivered',
        ]);

        (new SendLeadSubmittedNotification($delivery->id))->handle();

        self::assertDatabaseHas('notification_deliveries', [
            'id' => $delivery->id,
            'status' => 'delivered',
        ]);
    }
}
