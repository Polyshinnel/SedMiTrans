<?php

namespace App\Presentation\Http\Lead\Resources;

use App\Domain\Lead\Entities\Lead;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Lead */
final class LeadResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return ['id' => $this->resource->id, 'status' => $this->resource->status];
    }
}
