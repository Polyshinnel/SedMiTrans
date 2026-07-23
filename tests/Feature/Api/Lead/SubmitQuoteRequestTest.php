<?php

namespace Tests\Feature\Api\Lead;

use App\Infrastructure\Persistence\Eloquent\Models\LeadRecord;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class SubmitQuoteRequestTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        if (! in_array('sqlite', \PDO::getAvailableDrivers(), true)) {
            $this->markTestSkipped('The SQLite PDO driver is not installed. Run this feature suite in the MySQL test environment.');
        }

        parent::setUp();
    }

    public function test_it_submits_and_repeats_an_identical_request(): void
    {
        $headers = ['Idempotency-Key' => 'request-1'];
        $payload = ['name' => 'Alice', 'phone' => '+7 (999) 123-45-67', 'email' => 'ALICE@example.test', 'message' => 'Need a quote'];

        $first = $this->postJson('/api/v1/leads/quote-requests', $payload, $headers)->assertCreated()->json('data');
        $second = $this->postJson('/api/v1/leads/quote-requests', $payload, $headers)->assertCreated()->json('data');

        self::assertSame($first, $second);
        self::assertSame(1, LeadRecord::query()->count());
    }

    public function test_it_rejects_invalid_requests_and_conflicting_retries(): void
    {
        $headers = ['Idempotency-Key' => 'request-2'];
        $this->postJson('/api/v1/leads/quote-requests', ['name' => '', 'phone' => 'bad'], $headers)->assertUnprocessable()->assertJsonValidationErrors(['name', 'phone']);

        $this->postJson('/api/v1/leads/quote-requests', ['name' => 'Alice', 'phone' => '+79991234567'], $headers)->assertCreated();
        $this->postJson('/api/v1/leads/quote-requests', ['name' => 'Bob', 'phone' => '+79991234567'], $headers)->assertConflict();
    }
}
