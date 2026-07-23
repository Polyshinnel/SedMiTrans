<?php

namespace App\Application\Lead\Commands;

final readonly class ChangeLeadStatus
{
    public function __construct(public string $leadId, public string $targetStatus, public string $actorId) {}
}
