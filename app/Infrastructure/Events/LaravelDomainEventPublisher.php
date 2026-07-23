<?php

namespace App\Infrastructure\Events;

use App\Domain\Lead\Contracts\DomainEventPublisher;

final readonly class LaravelDomainEventPublisher implements DomainEventPublisher
{
    public function publish(array $events): void
    {
        foreach ($events as $event) {
            event($event);
        }
    }
}
