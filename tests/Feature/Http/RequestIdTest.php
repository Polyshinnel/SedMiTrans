<?php

namespace Tests\Feature\Http;

use Tests\TestCase;

final class RequestIdTest extends TestCase
{
    public function test_api_returns_a_generated_request_id(): void
    {
        $response = $this->getJson('/api/v1/health')->assertOk();

        self::assertMatchesRegularExpression('/^[A-Z0-9]{26}$/', (string) $response->headers->get('X-Request-Id'));
    }

    public function test_api_preserves_a_safe_client_request_id(): void
    {
        $this->getJson('/api/v1/health', ['X-Request-Id' => 'support-case_123'])->assertOk()
            ->assertHeader('X-Request-Id', 'support-case_123');
    }
}
