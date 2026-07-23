<?php

use App\Presentation\Http\Lead\Controllers\SubmitQuoteRequestController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cache;
use Laravel\Horizon\Contracts\SupervisorRepository;
use Laravel\Horizon\Contracts\WorkloadRepository;

Route::prefix('v1')->group(function (): void {
    Route::post('/leads/quote-requests', SubmitQuoteRequestController::class)
        ->middleware('throttle:quote-requests')
        ->name('api.v1.leads.quote-requests.store');

    Route::get('/health', function () {
        DB::select('select 1');
        Redis::connection()->ping();

        return response()->json(['status' => 'ready']);
    })->name('api.v1.health');

    Route::get('/health/queues', function (SupervisorRepository $supervisors, WorkloadRepository $workloads) {
        $schedulerHeartbeat = Cache::get('health:scheduler:last_heartbeat_at');
        $schedulerAge = $schedulerHeartbeat === null ? null : now()->diffInSeconds(\Carbon\CarbonImmutable::parse($schedulerHeartbeat));

        return response()->json([
            // Horizon removes a supervisor from this repository after 29 seconds,
            // so an empty list is a distinct "worker unavailable" signal.
            'workers' => [
                'status' => empty($supervisors->all()) ? 'unavailable' : 'running',
                'supervisors' => $supervisors->all(),
            ],
            'scheduler' => [
                'status' => $schedulerAge === null ? 'missing' : ($schedulerAge > 120 ? 'stale' : 'fresh'),
                'last_heartbeat_at' => $schedulerHeartbeat,
                'age_seconds' => $schedulerAge,
            ],
            // Each queue's length, worker count and predicted wait are emitted by Horizon.
            'queues' => $workloads->get(),
        ]);
    })->name('api.v1.health.queues');
});
