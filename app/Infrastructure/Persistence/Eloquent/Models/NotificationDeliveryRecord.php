<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;

final class NotificationDeliveryRecord extends Model
{
    protected $table = 'notification_deliveries';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['id', 'delivery_key', 'lead_id', 'channel', 'status', 'delivered_at', 'failed_at', 'last_error'];

    protected function casts(): array
    {
        return ['delivered_at' => 'immutable_datetime', 'failed_at' => 'immutable_datetime'];
    }
}
