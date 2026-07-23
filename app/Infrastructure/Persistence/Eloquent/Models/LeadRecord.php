<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;

final class LeadRecord extends Model
{
    protected $table = 'leads';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['idempotency_key', 'name', 'phone', 'email', 'message', 'submitted_at'];

    protected function casts(): array
    {
        return ['submitted_at' => 'immutable_datetime'];
    }
}
