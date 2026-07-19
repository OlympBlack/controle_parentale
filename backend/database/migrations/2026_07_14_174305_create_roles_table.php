<?php

use Illuminate\Database\Migrations\Migration;

/**
 * Les rôles sont gérés par l'enum PHP App\Enums\UserRole.
 * La colonne `role` est stockée directement dans `family_user` (string).
 * Cette migration est intentionnellement vide.
 */
return new class extends Migration
{
    public function up(): void {}

    public function down(): void {}
};
