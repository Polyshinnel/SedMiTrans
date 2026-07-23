<?php

namespace App\Presentation\Http\Media\Controllers;

use App\Infrastructure\Persistence\Eloquent\Models\MediaAssetRecord;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

final class DownloadPrivateMediaController
{
    public function __invoke(MediaAssetRecord $media): StreamedResponse
    {
        abort_unless($media->disk === 'private', 404);
        abort_unless(auth()->user()?->is_active && auth()->user()?->hasPermission('media.private.download'), 403);
        abort_unless(Storage::disk('private')->exists($media->path), 404);

        return Storage::disk('private')->download($media->path, basename($media->path), [
            'Content-Type' => 'application/octet-stream',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
