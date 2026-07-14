<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('children', function (Blueprint $table) {
            $table->id();
            $table->foreignId('family_id')->constrained('families')->cascadeOnDelete();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->date('birth_date');
            $table->string('avatar')->nullable();
            $table->enum('maturity_level', ['enfant', 'preado', 'ado']);
            $table->string('pin_code')->nullable();
            $table->enum('status', ['active', 'paused', 'archived'])->default('active');
            $table->integer('digital_health_score')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('family_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('children');
    }
};
