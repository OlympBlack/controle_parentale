<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained('children')->cascadeOnDelete();
            $table->foreignId('device_id')->nullable()->constrained('devices')->nullOnDelete();
            $table->enum('type', ['content_blocked', 'quota_exceeded', 'bypass_attempt', 'suspicious_activity', 'new_app_installed']);
            $table->enum('severity', ['low', 'medium', 'high', 'critical']);
            $table->text('message');
            $table->enum('status', ['new', 'read', 'archived'])->default('new');
            $table->timestamp('triggered_at');
            $table->timestamps();
            
            $table->index(['child_id', 'status']);
            $table->index('severity');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alerts');
    }
};
