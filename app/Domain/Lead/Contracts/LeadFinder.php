<?php

namespace App\Domain\Lead\Contracts;

use App\Domain\Lead\Entities\Lead;

interface LeadFinder
{
    public function findById(string $id): ?Lead;
}
