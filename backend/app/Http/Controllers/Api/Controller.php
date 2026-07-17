<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller as BaseController;
use OpenApi\Attributes as OA;

#[OA\Info(
    version: '1.0.0',
    description: 'API REST pour l\'application de Contrôle Parental - gestion des familles, enfants, appareils, règles de filtrage, temps d\'écran, alertes et rapports.',
    title: 'Contrôle Parental API',
)]
#[OA\Server(
    url: L5_SWAGGER_CONST_HOST,
    description: 'Serveur local',
)]
#[OA\SecurityScheme(
    securityScheme: 'sanctum',
    type: 'apiKey',
    description: "Entrez le token au format: Bearer {token}",
    name: 'Authorization',
    in: 'header',
)]
#[OA\Tag(name: 'Auth', description: 'Authentification - inscription, connexion, déconnexion')]
#[OA\Tag(name: 'Profile', description: 'Gestion du profil utilisateur')]
#[OA\Tag(name: 'Families', description: 'Gestion des familles')]
#[OA\Tag(name: 'Children', description: 'Gestion des enfants')]
#[OA\Tag(name: 'Devices', description: 'Gestion des appareils')]
#[OA\Tag(name: 'Activities', description: 'Consultation des activités')]
#[OA\Tag(name: 'Alerts', description: 'Gestion des alertes')]
#[OA\Tag(name: 'Notifications', description: 'Gestion des notifications')]
#[OA\Tag(name: 'Reports', description: 'Consultation des rapports')]
#[OA\Tag(name: 'Filter Rules', description: 'Règles de filtrage de contenu')]
#[OA\Tag(name: 'Screen Time Rules', description: "Règles de temps d'écran")]
#[OA\Tag(name: 'App Rules', description: "Règles d'applications")]
#[OA\Tag(name: 'Locations', description: 'Localisation des enfants')]
abstract class Controller extends BaseController
{
    //
}
