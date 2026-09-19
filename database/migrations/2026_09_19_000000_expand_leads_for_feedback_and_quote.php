<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leads', function (Blueprint $table): void {
            $table->string('type', 32)->default('quote')->after('idempotency_key')->index();
            $table->text('cargo')->nullable()->after('email');
            $table->text('route')->nullable()->after('cargo');
            $table->timestamp('read_at')->nullable()->after('status')->index();
        });

        Schema::table('notification_deliveries', function (Blueprint $table): void {
            $table->unsignedInteger('attempts')->default(0)->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('notification_deliveries', function (Blueprint $table): void {
            $table->dropColumn('attempts');
        });

        Schema::table('leads', function (Blueprint $table): void {
            $table->dropIndex(['read_at']);
            $table->dropColumn(['type', 'cargo', 'route', 'read_at']);
        });
    }
};
