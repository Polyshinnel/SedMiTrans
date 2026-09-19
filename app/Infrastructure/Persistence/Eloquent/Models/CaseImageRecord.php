<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

final class CaseImageRecord extends Model
{
    protected $table = 'case_images';

    protected $guarded = [];

    protected function casts(): array
    {
        return ['is_primary' => 'boolean', 'sort_order' => 'integer'];
    }

    public function case(): BelongsTo
    {
        return $this->belongsTo(CaseRecord::class, 'case_id');
    }

    protected static function booted(): void
    {
        self::saved(function (self $image): void {
            $siblings = $image->case()->first()?->images()->get() ?? collect();
            if ($siblings->isNotEmpty() && ! $siblings->contains('is_primary', true)) {
                $image->forceFill(['is_primary' => true])->saveQuietly();
            }
            if ($image->is_primary) {
                $image->case()->first()?->images()->whereKeyNot($image->getKey())->update(['is_primary' => false]);
            }
        });

        self::deleted(function (self $image): void {
            if ($image->path !== '') {
                Storage::disk('public')->delete($image->path);
            }
            $image->case()->first()?->images()->where('is_primary', true)->exists()
                ?: $image->case()->first()?->images()->first()?->forceFill(['is_primary' => true])->saveQuietly();
        });
    }
}
