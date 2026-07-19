<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin        = 'admin';
    case Gestionnaire = 'gestionnaire';
    case Observateur  = 'observateur';

    public function label(): string
    {
        return match($this) {
            self::Admin        => 'Administrateur',
            self::Gestionnaire => 'Gestionnaire',
            self::Observateur  => 'Observateur',
        };
    }

    public function description(): string
    {
        return match($this) {
            self::Admin        => 'Accès complet — gestion de la famille, des membres et de toutes les règles.',
            self::Gestionnaire => 'Peut gérer les enfants et les règles, sans administration de la famille.',
            self::Observateur  => 'Lecture seule — consultation des activités, alertes et rapports uniquement.',
        };
    }

    public function canManageFamily(): bool
    {
        return $this === self::Admin;
    }

    public function canManageRules(): bool
    {
        return $this === self::Admin || $this === self::Gestionnaire;
    }

    public function isReadOnly(): bool
    {
        return $this === self::Observateur;
    }
}
