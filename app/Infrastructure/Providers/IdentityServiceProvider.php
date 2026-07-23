<?php

namespace App\Infrastructure\Providers;

use App\Application\Identity\Contracts\AccessChecker;
use App\Application\Identity\Contracts\AuditLogger;
use App\Infrastructure\Identity\EloquentAccessChecker;
use App\Infrastructure\Identity\EloquentAuditLogger;
use Illuminate\Support\ServiceProvider;

final class IdentityServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(AccessChecker::class, EloquentAccessChecker::class);
        $this->app->bind(AuditLogger::class, EloquentAuditLogger::class);
    }
}
