<?php

namespace App\Infrastructure\Identity;

use App\Application\Identity\Contracts\AccessChecker;
use App\Models\User;

final class EloquentAccessChecker implements AccessChecker
{
    public function hasPermission(string $actorId, string $permission): bool
    {
        $user = User::query()->find($actorId);
        return $user !== null && $user->is_active && $user->hasPermission($permission);
    }
}
