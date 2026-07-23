<?php

namespace App\Jobs\Testing;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;

/** Test-only job used by queue integration tests; it has no HTTP endpoint. */
final class QueueIntegrationProbeJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;

    public function __construct(public readonly string $marker, public readonly bool $failOnce = false)
    {
        $this->onQueue('default');
    }

    public function backoff(): int
    {
        return 1;
    }

    public function handle(): void
    {
        $attempts = Cache::increment('queue-probe:'.$this->marker.':attempts');

        if ($this->failOnce && $attempts === 1) {
            throw new \RuntimeException('Intentional queue integration failure.');
        }

        Cache::add('queue-probe:'.$this->marker.':completed', [
            'queue' => $this->queue,
            'attempts' => $attempts,
        ], now()->addHour());
    }
}
