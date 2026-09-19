<?php

namespace App\Presentation\Http\Cases\Resources;

use App\Infrastructure\Persistence\Eloquent\Models\CaseRecord;
use Illuminate\Http\Resources\Json\JsonResource;

final class CaseResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray($request): array
    {
        /** @var CaseRecord $case */
        $case = $this->resource;
        $images = $case->relationLoaded('images') ? $case->images : $case->images()->get();
        $imageUrls = $images->map(fn ($image): string => '/storage/'.$image->path)->values()->all();
        $primary = $images->firstWhere('is_primary', true) ?? $images->first();

        return [
            'slug' => $case->slug,
            'seo' => ['title' => $case->seo_title, 'description' => $case->seo_description],
            'title' => $case->title,
            'excerpt' => $case->excerpt,
            'date' => $case->published_at?->format('d.m.Y'),
            'body' => $case->body,
            'image' => $primary ? '/storage/'.$primary->path : null,
            'gallery' => $imageUrls,
        ];
    }
}
