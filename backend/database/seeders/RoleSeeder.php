<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name'        => 'Administrateur',
                'slug'        => 'admin',
                'description' => 'Parent principal — accès complet : création de la famille, gestion des membres, de tous les enfants et de toutes les règles.',
            ],
            [
                'name'        => 'Gestionnaire',
                'slug'        => 'gestionnaire',
                'description' => 'Co-parent — peut gérer les enfants et les règles, mais ne peut pas supprimer la famille ni gérer les membres.',
            ],
            [
                'name'        => 'Observateur',
                'slug'        => 'observateur',
                'description' => 'Lecture seule — consulte les activités, alertes et rapports sans pouvoir modifier les paramètres.',
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(['slug' => $role['slug']], $role);
        }
    }
}
