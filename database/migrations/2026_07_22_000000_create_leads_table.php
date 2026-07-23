<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('idempotency_key', 128)->unique();
            $table->string('name', 120);
            $table->string('phone', 32);
            $table->string('email')->nullable();
            $table->text('message')->nullable();
            $table->string('status', 32)->index();
            $table->timestamp('submitted_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
