<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('behavior_anomalies', function (Blueprint $table) {
            $table->enum('type', [
                'excessive_usage',
                'bypass_attempt',
                'suspicious_content',
                'unusual_hour',
                'rapid_app_switching',
                'other',
            ])->change();
        });
    }

    public function down(): void
    {
        Schema::table('behavior_anomalies', function (Blueprint $table) {
            $table->string('type')->change();
        });
    }
};
