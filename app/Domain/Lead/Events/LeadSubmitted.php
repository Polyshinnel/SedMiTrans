<?php

namespace App\Domain\Lead\Events;

final readonly class LeadSubmitted implements DomainEvent
{
    public function __construct(
        public string $leadId,
        public \DateTimeImmutable $submittedAt,
        public ?string $requestId = null,
    ) {}
}
