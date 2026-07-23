<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();
        $permissionId = DB::table('identity_permissions')->insertGetId([
            'name' => 'media.private.download',
            'created_at' => $now,
            'updated_at' => $now,
        ]);
        $roleId = DB::table('identity_roles')->where('name', 'super-admin')->value('id');

        if ($roleId !== null) {
            DB::table('identity_permission_role')->insert([
                'role_id' => $roleId,
                'permission_id' => $permissionId,
            ]);
        }
    }

    public function down(): void
    {
        $permissionId = DB::table('identity_permissions')->where('name', 'media.private.download')->value('id');
        if ($permissionId !== null) {
            DB::table('identity_permission_role')->where('permission_id', $permissionId)->delete();
            DB::table('identity_permissions')->where('id', $permissionId)->delete();
        }
    }
};
