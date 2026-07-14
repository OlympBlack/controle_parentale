<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->unique()->after('email');
            $table->string('avatar')->nullable()->after('phone');
            $table->string('locale')->default('fr')->after('avatar');
            $table->string('timezone')->nullable()->after('locale');
            $table->text('two_factor_secret')->nullable()->after('timezone');
            $table->text('two_factor_recovery_codes')->nullable()->after('two_factor_secret');
            $table->timestamp('two_factor_confirmed_at')->nullable()->after('two_factor_recovery_codes');
            $table->timestamp('last_login_at')->nullable()->after('two_factor_confirmed_at');
            $table->enum('status', ['active', 'suspended', 'pending'])->default('active')->after('last_login_at');
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone', 'avatar', 'locale', 'timezone',
                'two_factor_secret', 'two_factor_recovery_codes', 'two_factor_confirmed_at',
                'last_login_at', 'status'
            ]);
            $table->dropSoftDeletes();
        });
    }
};
