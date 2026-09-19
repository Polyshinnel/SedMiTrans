<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cases', function (Blueprint $table): void {
            $table->id();
            $table->string('seo_title', 255);
            $table->text('seo_description');
            $table->string('slug')->unique();
            $table->string('title', 255);
            $table->text('excerpt');
            $table->date('published_at');
            $table->longText('body');
            $table->timestamps();
            $table->index('published_at');
        });

        Schema::create('case_images', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('case_id')->constrained('cases')->cascadeOnDelete();
            $table->string('path');
            $table->boolean('is_primary')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->index(['case_id', 'is_primary']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('case_images');
        Schema::dropIfExists('cases');
    }
};
