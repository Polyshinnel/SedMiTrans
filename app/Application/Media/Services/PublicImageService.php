<?php

namespace App\Application\Media\Services;

use App\Infrastructure\Persistence\Eloquent\Models\MediaAssetRecord;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Intervention\Image\Laravel\Facades\Image;
use Intervention\Image\Encoders\WebpEncoder;

/**
 * Owns the public-image write path. The source upload is decoded and
 * re-encoded to WebP, so client filenames, client MIME and EXIF never become
 * public storage metadata.
 */
final class PublicImageService
{
    public function store(UploadedFile $upload, string $directory): MediaAssetRecord
    {
        $directory = $this->directory($directory);
        $encoded = $this->inspectAndEncode($upload);
        $path = $this->publish($directory, $encoded['contents']);

        try {
            return DB::transaction(fn (): MediaAssetRecord => MediaAssetRecord::query()->create([
                'id' => (string) Str::ulid(),
                'disk' => 'public',
                'path' => $path,
                'mime_type' => 'image/webp',
                'size' => strlen($encoded['contents']),
                'width' => $encoded['width'],
                'height' => $encoded['height'],
            ]));
        } catch (\Throwable $exception) {
            Storage::disk('public')->delete($path);
            throw $exception;
        }
    }

    public function replace(MediaAssetRecord $media, UploadedFile $upload): MediaAssetRecord
    {
        if ($media->disk !== 'public') {
            throw new \LogicException('Only public images can be replaced by this service.');
        }

        $encoded = $this->inspectAndEncode($upload);
        $newPath = $this->publish($this->directoryFromPath($media->path), $encoded['contents']);
        $oldPath = $media->path;

        try {
            DB::transaction(function () use ($media, $newPath, $oldPath, $encoded): void {
                $media->forceFill([
                    'path' => $newPath,
                    'mime_type' => 'image/webp',
                    'size' => strlen($encoded['contents']),
                    'width' => $encoded['width'],
                    'height' => $encoded['height'],
                ])->save();

                DB::afterCommit(fn () => Storage::disk('public')->delete($oldPath));
            });
        } catch (\Throwable $exception) {
            Storage::disk('public')->delete($newPath);
            throw $exception;
        }

        return $media->refresh();
    }

    public function delete(MediaAssetRecord $media): void
    {
        $disk = $media->disk;
        $path = $media->path;

        DB::transaction(function () use ($media, $disk, $path): void {
            $media->delete();
            DB::afterCommit(fn () => Storage::disk($disk)->delete($path));
        });
    }

    /** @return array{contents: string, width: int, height: int} */
    private function inspectAndEncode(UploadedFile $upload): array
    {
        if (! $upload->isValid() || $upload->getSize() === false || $upload->getSize() > config('images.uploads.max_bytes')) {
            $this->invalid('image', 'Файл изображения повреждён или превышает 10 МБ.');
        }

        $path = $upload->getRealPath();
        $info = $path === false ? false : @getimagesize($path);
        $mime = $path === false ? false : (new \finfo(FILEINFO_MIME_TYPE))->file($path);
        $allowed = config('images.uploads.allowed_mime_types');

        if ($info === false || $mime === false || ! in_array($mime, $allowed, true) || ($info['mime'] ?? null) !== $mime) {
            $this->invalid('image', 'Допускаются только корректные JPEG, PNG или WebP изображения.');
        }

        [$width, $height] = $info;
        if ($width < 1 || $height < 1 || $width * $height > config('images.uploads.max_pixels')) {
            $this->invalid('image', 'Разрешение изображения превышает допустимый лимит.');
        }

        try {
            $contents = (string) Image::decode($path)
                ->orient()
                ->encode(new WebpEncoder(quality: config('images.webp.quality'), strip: true));
        } catch (\Throwable) {
            $this->invalid('image', 'Не удалось безопасно обработать изображение.');
        }

        return compact('contents', 'width', 'height');
    }

    private function publish(string $directory, string $contents): string
    {
        $disk = Storage::disk('public');
        $path = $directory.'/'.Str::ulid().'.webp';
        $temporary = '.tmp/'.Str::ulid().'.webp';
        $disk->put($temporary, $contents, ['visibility' => 'public']);

        try {
            $disk->move($temporary, $path);
        } catch (\Throwable $exception) {
            $disk->delete($temporary);
            throw $exception;
        }

        return $path;
    }

    private function directory(string $directory): string
    {
        $directory = trim($directory, '/');
        if (! preg_match('/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/', $directory)) {
            throw new \InvalidArgumentException('Public media directory must be a single safe path segment.');
        }

        return $directory;
    }

    private function directoryFromPath(string $path): string
    {
        return $this->directory((string) str($path)->beforeLast('/'));
    }

    /** @return never */
    private function invalid(string $field, string $message): never
    {
        throw ValidationException::withMessages([$field => $message]);
    }
}
