<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('device_installed_apps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained('devices')->cascadeOnDelete();
            $table->foreignId('application_id')->constrained('applications')->cascadeOnDelete();
            $table->timestamp('installed_at')->nullable();
            $table->string('version')->nullable();
            $table->timestamps();
            
            $table->unique(['device_id', 'application_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('device_installed_apps');
    }
};
