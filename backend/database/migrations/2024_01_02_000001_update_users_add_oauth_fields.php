<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('google_id')->nullable()->after('email');
            $table->string('avatar')->nullable()->after('google_id');
            $table->enum('plan', ['free', 'pro'])->default('free')->after('avatar');
            $table->integer('daily_conversions')->default(0)->after('plan');
            $table->date('daily_reset_at')->nullable()->after('daily_conversions');
            $table->string('password')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['google_id', 'avatar', 'plan', 'daily_conversions', 'daily_reset_at']);
        });
    }
};
