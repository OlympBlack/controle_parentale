<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained('children')->cascadeOnDelete();
            $table->enum('period_type', ['weekly', 'monthly']);
            $table->date('period_start');
            $table->date('period_end');
            $table->integer('digital_health_score')->nullable();
            $table->json('statistics');
            $table->string('file_path')->nullable();
            $table->timestamp('generated_at');
            $table->timestamps();
            
            $table->index(['child_id', 'period_type', 'period_start']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
