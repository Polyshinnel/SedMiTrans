<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();
        $permissionId = DB::table('identity_permissions')->insertGetId([
            'name' => 'horizon.view',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $superAdminId = DB::table('identity_roles')->where('name', 'super-admin')->value('id');

        if ($superAdminId !== null) {
            DB::table('identity_permission_role')->insert([
                'permission_id' => $permissionId,
                'role_id' => $superAdminId,
            ]);
        }
    }

    public function down(): void
    {
        $permissionId = DB::table('identity_permissions')->where('name', 'horizon.view')->value('id');

        if ($permissionId !== null) {
            DB::table('identity_permission_role')->where('permission_id', $permissionId)->delete();
            DB::table('identity_permissions')->where('id', $permissionId)->delete();
        }
    }
};
