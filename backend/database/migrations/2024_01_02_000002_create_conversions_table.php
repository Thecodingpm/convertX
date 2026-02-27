<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conversions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('tool_slug');
            $table->string('module');
            $table->string('original_filename');
            $table->string('original_mime');
            $table->unsignedBigInteger('original_size');
            $table->string('output_filename')->nullable();
            $table->string('output_mime')->nullable();
            $table->unsignedBigInteger('output_size')->nullable();
            $table->string('output_path')->nullable();
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            $table->text('error_message')->nullable();
            $table->integer('download_count')->default(0);
            $table->timestamp('expires_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
            $table->index('tool_slug');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversions');
    }
};
