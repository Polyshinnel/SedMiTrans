<?php

namespace App\Presentation\Http\Media\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

final class MediaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'path' => $this->path,
            'url' => $this->disk === 'public' ? '/storage/'.$this->path : null,
            'mime_type' => $this->mime_type,
            'width' => $this->width,
            'height' => $this->height,
            'processing' => false,
        ];
    }
}
