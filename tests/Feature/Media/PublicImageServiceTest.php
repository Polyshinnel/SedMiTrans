<?php

namespace Tests\Feature\Media;

use App\Application\Media\Services\PublicImageService;
use App\Infrastructure\Persistence\Eloquent\Models\MediaAssetRecord;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

final class PublicImageServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_stores_a_normalized_image_at_a_relative_unique_path(): void
    {
        Storage::fake('public');

        $media = app(PublicImageService::class)->store(
            UploadedFile::fake()->image('misleading-name.png', 120, 80)->size(100),
            'services',
        );

        $this->assertSame('public', $media->disk);
        $this->assertMatchesRegularExpression('#^services/[0-9A-HJKMNP-TV-Z]{26}\.webp$#', $media->path);
        $this->assertSame('image/webp', $media->mime_type);
        $this->assertSame(120, $media->width);
        $this->assertSame(80, $media->height);
        $this->assertDatabaseHas('media_assets', ['id' => $media->id, 'path' => $media->path]);
        Storage::disk('public')->assertExists($media->path);
    }

    public function test_replacement_keeps_the_old_file_until_the_new_record_is_committed(): void
    {
        Storage::fake('public');
        $service = app(PublicImageService::class);
        $media = $service->store(UploadedFile::fake()->image('old.jpg', 100, 100), 'services');
        $oldPath = $media->path;

        $replaced = $service->replace($media, UploadedFile::fake()->image('new.png', 240, 120));

        $this->assertNotSame($oldPath, $replaced->path);
        Storage::disk('public')->assertMissing($oldPath);
        Storage::disk('public')->assertExists($replaced->path);
    }

    public function test_invalid_image_bytes_are_rejected_and_never_published(): void
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->createWithContent('image.jpg', 'not an image');

        $this->expectException(\Illuminate\Validation\ValidationException::class);
        app(PublicImageService::class)->store($file, 'services');

        $this->assertSame(0, MediaAssetRecord::query()->count());
    }

    public function test_failed_replacement_retains_the_old_file_and_cleans_the_new_one(): void
    {
        Storage::fake('public');
        $service = app(PublicImageService::class);
        $media = $service->store(UploadedFile::fake()->image('old.jpg', 100, 100), 'services');
        $oldPath = $media->path;
        MediaAssetRecord::updating(static fn () => throw new \RuntimeException('simulated rollback'));

        try {
            $service->replace($media, UploadedFile::fake()->image('new.jpg', 200, 100));
            $this->fail('Replacement must fail.');
        } catch (\RuntimeException) {
            Storage::disk('public')->assertExists($oldPath);
            $this->assertSame([$oldPath], Storage::disk('public')->allFiles('services'));
        }
    }

    public function test_deleting_an_asset_cleans_its_file_after_commit(): void
    {
        Storage::fake('public');
        $service = app(PublicImageService::class);
        $media = $service->store(UploadedFile::fake()->image('image.jpg', 100, 100), 'services');
        $path = $media->path;

        $service->delete($media);

        $this->assertDatabaseMissing('media_assets', ['id' => $media->id]);
        Storage::disk('public')->assertMissing($path);
    }
}
