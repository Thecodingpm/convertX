<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tool_stats', function (Blueprint $table) {
            $table->id();
            $table->string('tool_slug')->unique();
            $table->string('module');
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('usage_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tool_stats');
    }
};
