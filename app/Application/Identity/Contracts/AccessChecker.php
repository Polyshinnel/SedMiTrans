<?php

namespace App\Application\Identity\Contracts;

interface AccessChecker
{
    public function hasPermission(string $actorId, string $permission): bool;
}
