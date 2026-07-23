<?php

namespace Tests\Feature\Health;

use Tests\TestCase;

/**
 * @group integration
 */
class ReadinessTest extends TestCase
{
    public function test_readiness_endpoint_reports_ready_dependencies(): void
    {
        if (! filter_var(env('RUN_INTEGRATION_TESTS', false), FILTER_VALIDATE_BOOL)) {
            $this->markTestSkipped('Set RUN_INTEGRATION_TESTS=true with MySQL and Redis available.');
        }

        $this->getJson('/api/v1/health')
            ->assertOk()
            ->assertExactJson(['status' => 'ready']);
    }
}
