<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('screen_time_usages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained('children')->cascadeOnDelete();
            $table->foreignId('device_id')->nullable()->constrained('devices')->nullOnDelete();
            $table->date('date');
            $table->integer('minutes_used')->default(0);
            $table->timestamps();
            
            $table->unique(['child_id', 'device_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('screen_time_usages');
    }
};
