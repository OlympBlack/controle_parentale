<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('filter_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained('children')->cascadeOnDelete();
            $table->enum('type', ['whitelist', 'blacklist', 'category_block', 'time_based']);
            $table->string('value')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->integer('version')->default(1);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('child_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('filter_rules');
    }
};
