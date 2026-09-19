<?php

namespace App\Infrastructure\Persistence\Eloquent\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

final class CaseRecord extends Model
{
    protected $table = 'cases';

    protected $guarded = [];

    protected function casts(): array
    {
        return ['published_at' => 'date'];
    }

    public function images(): HasMany
    {
        return $this->hasMany(CaseImageRecord::class, 'case_id')->orderBy('sort_order')->orderBy('id');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query;
    }

    protected static function booted(): void
    {
        self::deleting(function (self $case): void {
            $case->images()->get()->each->delete();
        });

        self::saving(function (self $case): void {
            $case->slug = static::uniqueSlug($case->slug ?: $case->title, $case->getKey());
        });

        self::saved(function (self $case): void {
            $images = $case->images()->get();
            if ($images->isNotEmpty() && ! $images->contains('is_primary', true)) {
                $images->first()->forceFill(['is_primary' => true])->saveQuietly();
            }

            $primaryFound = false;
            foreach ($images as $image) {
                if ($image->is_primary && ! $primaryFound) {
                    $primaryFound = true;

                    continue;
                }
                if ($image->is_primary) {
                    $image->forceFill(['is_primary' => false])->saveQuietly();
                }
            }
        });
    }

    private static function uniqueSlug(string $value, mixed $ignoreId = null): string
    {
        $base = Str::slug($value) ?: 'case';
        $slug = $base;
        $number = 2;

        while (self::query()->where('slug', $slug)->when($ignoreId !== null, fn (Builder $query) => $query->where($query->getModel()->getKeyName(), '!=', $ignoreId))->exists()) {
            $slug = $base.'-'.$number++;
        }

        return $slug;
    }
}
