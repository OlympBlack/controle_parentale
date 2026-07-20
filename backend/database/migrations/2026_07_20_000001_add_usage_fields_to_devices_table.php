<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('devices', function (Blueprint $table) {
            $table->string('device_token')->nullable()->unique()->after('pairing_code');
            $table->json('permissions_accordees')->nullable()->after('status');
            $table->timestamp('derniere_synchronisation')->nullable()->after('permissions_accordees');
        });
    }

    public function down(): void
    {
        Schema::table('devices', function (Blueprint $table) {
            $table->dropColumn(['device_token', 'permissions_accordees', 'derniere_synchronisation']);
        });
    }
};
