<?php

namespace App\Providers;

use App\Domain\Lead\Events\LeadSubmitted;
use App\Listeners\QueueLeadSubmittedNotification;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(LeadSubmitted::class, QueueLeadSubmittedNotification::class);

        RateLimiter::for('quote-requests', function (Request $request): Limit {
            return Limit::perMinute(10)->by('quote-request:'.$request->ip());
        });

        RateLimiter::for('filament-login', fn (Request $request): Limit => Limit::perMinute(5)->by('filament-login:'.$request->ip()));
    }
}
