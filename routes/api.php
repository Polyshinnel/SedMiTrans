<?php

use App\Presentation\Http\Cases\Controllers\ListCasesController;
use App\Presentation\Http\Cases\Controllers\ShowCaseController;
use App\Presentation\Http\Contact\Controllers\GetContactSettingsController;
use App\Presentation\Http\Lead\Controllers\SubmitFeedbackRequestController;
use App\Presentation\Http\Lead\Controllers\SubmitQuoteRequestController;
use App\Presentation\Http\Seo\Controllers\GetSeoPageController;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Route;
use Laravel\Horizon\Contracts\SupervisorRepository;
use Laravel\Horizon\Contracts\WorkloadRepository;

Route::prefix('v1')->group(function (): void {
    Route::post('/leads/quote-requests', SubmitQuoteRequestController::class)
        ->middleware('throttle:quote-requests')
        ->name('api.v1.leads.quote-requests.store');
    Route::post('/leads/feedback', SubmitFeedbackRequestController::class)
        ->middleware('throttle:quote-requests')
        ->name('api.v1.leads.feedback.store');
    Route::get('/contacts', GetContactSettingsController::class)
        ->name('api.v1.contacts.show');
    Route::get('/seo/{key}', GetSeoPageController::class)
        ->name('api.v1.seo.show');
    Route::get('/cases', ListCasesController::class)->name('api.v1.cases.index');
    Route::get('/cases/{slug}', ShowCaseController::class)->name('api.v1.cases.show');

    Route::get('/health', function () {
        DB::select('select 1');
        Redis::connection()->ping();

        return response()->json(['status' => 'ready']);
    })->name('api.v1.health');

    Route::get('/health/queues', function (SupervisorRepository $supervisors, WorkloadRepository $workloads) {
        $schedulerHeartbeat = Cache::get('health:scheduler:last_heartbeat_at');
        $schedulerAge = $schedulerHeartbeat === null ? null : now()->diffInSeconds(CarbonImmutable::parse($schedulerHeartbeat));

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
