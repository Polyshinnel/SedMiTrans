<?php

namespace Tests\Feature\Media;

use App\Infrastructure\Persistence\Eloquent\Models\IdentityRoleRecord;
use App\Infrastructure\Persistence\Eloquent\Models\MediaAssetRecord;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

final class PrivateMediaDownloadTest extends TestCase
{
    use RefreshDatabase;

    public function test_private_file_is_not_a_public_storage_url_and_requires_the_granted_role(): void
    {
        Storage::fake('private');
        Storage::disk('private')->put('documents/contract.pdf', 'private document');
        $media = MediaAssetRecord::query()->create([
            'disk' => 'private', 'path' => 'documents/contract.pdf', 'mime_type' => 'application/pdf', 'size' => 16,
        ]);
        $admin = User::factory()->create(['is_active' => true]);
        $admin->roles()->attach(IdentityRoleRecord::query()->where('name', 'super-admin')->value('id'));

        $this->get('/storage/documents/contract.pdf')->assertNotFound();
        $this->get(route('media.private.download', $media))->assertRedirect(route('filament.admin.auth.login'));
        $this->actingAs($admin)
            ->get(route('media.private.download', $media))
            ->assertOk()
            ->assertHeader('content-disposition', 'attachment; filename=contract.pdf');
    }
}
