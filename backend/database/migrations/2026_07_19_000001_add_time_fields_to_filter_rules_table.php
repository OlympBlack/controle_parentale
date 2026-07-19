<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('filter_rules', function (Blueprint $table) {
            $table->tinyInteger('day_of_week')->nullable()->after('value');
            $table->time('start_time')->nullable()->after('day_of_week');
            $table->time('end_time')->nullable()->after('start_time');
        });
    }

    public function down(): void
    {
        Schema::table('filter_rules', function (Blueprint $table) {
            $table->dropColumn(['day_of_week', 'start_time', 'end_time']);
        });
    }
};
