<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('filter_rule_content_category', function (Blueprint $table) {
            $table->id();
            $table->foreignId('filter_rule_id')->constrained('filter_rules')->cascadeOnDelete();
            $table->foreignId('content_category_id')->constrained('content_categories')->cascadeOnDelete();
            $table->timestamps();
            
            $table->unique(['filter_rule_id', 'content_category_id'], 'fr_cc_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('filter_rule_content_category');
    }
};
