<?php

namespace App\Application\Identity\Contracts;

interface AuditLogger
{
    /** @param array<string, mixed> $diff */
    public function record(string $actorId, string $action, string $entityType, string $entityId, array $diff = []): void;
}
