<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('filter_rule_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('filter_rule_id')->constrained('filter_rules')->cascadeOnDelete();
            $table->json('previous_value')->nullable();
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('changed_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('filter_rule_histories');
    }
};
