<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained('children')->cascadeOnDelete();
            $table->foreignId('device_id')->constrained('devices')->cascadeOnDelete();
            $table->enum('type', ['web', 'app', 'search', 'call', 'sms', 'autre']);
            $table->string('target');
            $table->foreignId('content_category_id')->nullable()->constrained('content_categories')->nullOnDelete();
            $table->integer('duration_seconds')->nullable();
            $table->timestamp('started_at');
            $table->timestamp('ended_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            $table->index(['child_id', 'started_at']);
            $table->index('device_id');
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
