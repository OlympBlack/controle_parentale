<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usage_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained('devices')->cascadeOnDelete();
            $table->string('package_name');
            $table->string('nom_application')->nullable();
            $table->integer('duree_secondes')->default(0);
            $table->date('date_utilisation');
            $table->string('categorie')->nullable();
            $table->timestamps();

            $table->index(['device_id', 'date_utilisation']);
            $table->index('package_name');
        });

        Schema::create('app_usage_summary', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained('devices')->cascadeOnDelete();
            $table->date('date');
            $table->integer('temps_ecran_total_secondes')->default(0);
            $table->integer('nombre_apps_utilisees')->default(0);
            $table->timestamps();

            $table->unique(['device_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('app_usage_summary');
        Schema::dropIfExists('usage_sessions');
    }
};
