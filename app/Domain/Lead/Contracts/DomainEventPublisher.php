<?php

namespace App\Domain\Lead\Contracts;

use App\Domain\Lead\Events\DomainEvent;

interface DomainEventPublisher
{
    /** @param list<DomainEvent> $events */
    public function publish(array $events): void;
}
