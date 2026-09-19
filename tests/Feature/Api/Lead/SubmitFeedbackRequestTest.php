<?php

namespace Tests\Feature\Api\Lead;

use App\Infrastructure\Persistence\Eloquent\Models\LeadRecord;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class SubmitFeedbackRequestTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        if (! in_array('sqlite', \PDO::getAvailableDrivers(), true)) {
            $this->markTestSkipped('The SQLite PDO driver is not installed. Run this feature suite in the MySQL test environment.');
        }

        parent::setUp();
    }

    public function test_it_stores_feedback_without_requiring_message(): void
    {
        $response = $this->postJson('/api/v1/leads/feedback', [
            'name' => 'Alice',
            'phone' => '+79991234567',
            'email' => 'alice@example.test',
        ], ['Idempotency-Key' => 'feedback-1'])->assertCreated();

        self::assertSame('new', $response->json('data.status'));
        self::assertDatabaseHas('leads', ['type' => 'feedback', 'name' => 'Alice', 'message' => null]);
    }

    public function test_it_rejects_feedback_without_name_or_phone(): void
    {
        $this->postJson('/api/v1/leads/feedback', [], ['Idempotency-Key' => 'feedback-2'])
            ->assertUnprocessable()->assertJsonValidationErrors(['name', 'phone']);
    }
}
