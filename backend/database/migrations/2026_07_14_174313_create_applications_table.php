<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('package_name')->unique();
            $table->enum('platform', ['android', 'ios', 'both']);
            $table->foreignId('content_category_id')->nullable()->constrained('content_categories')->nullOnDelete();
            $table->string('icon_url')->nullable();
            $table->boolean('is_system_app')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
