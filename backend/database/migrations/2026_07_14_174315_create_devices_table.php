<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->nullable()->constrained('children')->nullOnDelete();
            $table->string('name');
            $table->enum('type', ['mobile', 'tablette', 'pc', 'autre']);
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->enum('os', ['android', 'ios', 'windows', 'macos', 'autre']);
            $table->string('os_version')->nullable();
            $table->string('app_version')->nullable();
            $table->string('pairing_code')->nullable()->unique();
            $table->timestamp('pairing_code_expires_at')->nullable();
            $table->timestamp('paired_at')->nullable();
            $table->enum('status', ['pending', 'active', 'inactive', 'blocked'])->default('pending');
            $table->timestamp('last_seen_at')->nullable();
            $table->boolean('is_online')->default(false);
            $table->integer('battery_level')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('child_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};
