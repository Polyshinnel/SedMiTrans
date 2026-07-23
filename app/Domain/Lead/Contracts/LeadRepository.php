<?php

namespace App\Domain\Lead\Contracts;

use App\Domain\Lead\Entities\Lead;

interface LeadRepository
{
    public function save(Lead $lead): void;

    public function findByIdempotencyKey(string $key): ?Lead;

}
