<?php

namespace App\Infrastructure\Providers;

use App\Domain\Lead\Contracts\DomainEventPublisher;
use App\Domain\Lead\Contracts\LeadFinder;
use App\Domain\Lead\Contracts\LeadRepository;
use App\Infrastructure\Events\LaravelDomainEventPublisher;
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentLeadRepository;
use Illuminate\Support\ServiceProvider;

final class LeadServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(LeadRepository::class, EloquentLeadRepository::class);
        $this->app->bind(LeadFinder::class, EloquentLeadRepository::class);
        $this->app->bind(DomainEventPublisher::class, LaravelDomainEventPublisher::class);
    }
}
