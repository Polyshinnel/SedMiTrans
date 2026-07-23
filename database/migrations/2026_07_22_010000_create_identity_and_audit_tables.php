<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', fn (Blueprint $table) => $table->boolean('is_active')->default(true)->after('password'));
        Schema::create('identity_roles', function (Blueprint $table): void { $table->id(); $table->string('name')->unique(); $table->timestamps(); });
        Schema::create('identity_permissions', function (Blueprint $table): void { $table->id(); $table->string('name')->unique(); $table->timestamps(); });
        Schema::create('identity_role_user', function (Blueprint $table): void { $table->foreignId('role_id')->constrained('identity_roles')->cascadeOnDelete(); $table->foreignId('user_id')->constrained()->cascadeOnDelete(); $table->primary(['role_id', 'user_id']); });
        Schema::create('identity_permission_role', function (Blueprint $table): void { $table->foreignId('permission_id')->constrained('identity_permissions')->cascadeOnDelete(); $table->foreignId('role_id')->constrained('identity_roles')->cascadeOnDelete(); $table->primary(['permission_id', 'role_id']); });
        Schema::create('audit_logs', function (Blueprint $table): void {
            $table->id(); $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action'); $table->string('entity_type'); $table->string('entity_id'); $table->json('diff')->nullable(); $table->timestamp('created_at')->useCurrent(); $table->index(['entity_type', 'entity_id']);
        });

        $now = now();
        DB::table('identity_roles')->insert(array_map(fn (string $name) => ['name' => $name, 'created_at' => $now, 'updated_at' => $now], ['super-admin', 'content-manager', 'lead-manager']));
        DB::table('identity_permissions')->insert(array_map(fn (string $name) => ['name' => $name, 'created_at' => $now, 'updated_at' => $now], ['admin.access', 'lead.view', 'lead.change-status', 'admin.manage']));
        $roles = DB::table('identity_roles')->pluck('id', 'name'); $permissions = DB::table('identity_permissions')->pluck('id', 'name');
        foreach ([
            'super-admin' => ['admin.access', 'lead.view', 'lead.change-status', 'admin.manage'],
            'content-manager' => ['admin.access'],
            'lead-manager' => ['admin.access', 'lead.view', 'lead.change-status'],
        ] as $role => $grants) foreach ($grants as $permission) DB::table('identity_permission_role')->insert(['role_id' => $roles[$role], 'permission_id' => $permissions[$permission]]);
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs'); Schema::dropIfExists('identity_permission_role'); Schema::dropIfExists('identity_role_user'); Schema::dropIfExists('identity_permissions'); Schema::dropIfExists('identity_roles');
        Schema::table('users', fn (Blueprint $table) => $table->dropColumn('is_active'));
    }
};
