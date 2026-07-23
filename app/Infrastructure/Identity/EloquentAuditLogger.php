<?php

namespace App\Infrastructure\Identity;

use App\Application\Identity\Contracts\AuditLogger;
use Illuminate\Support\Facades\DB;

final class EloquentAuditLogger implements AuditLogger
{
    public function record(string $actorId, string $action, string $entityType, string $entityId, array $diff = []): void
    {
        unset($diff['password'], $diff['token'], $diff['remember_token']);
        DB::table('audit_logs')->insert(['actor_id' => $actorId, 'action' => $action, 'entity_type' => $entityType, 'entity_id' => $entityId, 'diff' => json_encode($diff, JSON_THROW_ON_ERROR), 'created_at' => now()]);
    }
}
