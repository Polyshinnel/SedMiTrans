<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('horizon:snapshot')->everyFiveMinutes()->withoutOverlapping();
Schedule::command('queue:prune-failed --hours=168')->daily()->withoutOverlapping();
Schedule::call(static function (): void {
    Cache::put('health:scheduler:last_heartbeat_at', now()->toIso8601String(), now()->addMinutes(10));
})->everyMinute()->name('scheduler-heartbeat')->withoutOverlapping();
