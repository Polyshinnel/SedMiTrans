<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;

final class IdentityPermissionRecord extends Model
{
    protected $table = 'identity_permissions';
    protected $guarded = [];
}
