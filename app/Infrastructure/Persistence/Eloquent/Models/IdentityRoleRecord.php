<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

final class IdentityRoleRecord extends Model
{
    protected $table = 'identity_roles';
    protected $guarded = [];

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(IdentityPermissionRecord::class, 'identity_permission_role', 'role_id', 'permission_id');
    }
}
