<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'User',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'name', type: 'string', example: 'Jean Dupont'),
        new OA\Property(property: 'email', type: 'string', format: 'email', example: 'jean@exemple.com'),
        new OA\Property(property: 'phone', type: 'string', example: '+33612345678'),
        new OA\Property(property: 'avatar', type: 'string', nullable: true),
        new OA\Property(property: 'locale', type: 'string', example: 'fr'),
        new OA\Property(property: 'timezone', type: 'string', nullable: true),
        new OA\Property(property: 'status', type: 'string', enum: ['active', 'suspended', 'pending'], example: 'active'),
        new OA\Property(property: 'last_login_at', type: 'string', format: 'date-time', nullable: true),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'Family',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'name', type: 'string', example: 'Famille Dupont'),
        new OA\Property(property: 'plan', type: 'string', enum: ['free', 'premium'], example: 'free'),
        new OA\Property(property: 'owner', ref: '#/components/schemas/User'),
        new OA\Property(property: 'children_count', type: 'integer', example: 2),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'Child',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'family_id', type: 'integer', example: 1),
        new OA\Property(property: 'first_name', type: 'string', example: 'Lucas'),
        new OA\Property(property: 'last_name', type: 'string', example: 'Dupont'),
        new OA\Property(property: 'full_name', type: 'string', example: 'Lucas Dupont'),
        new OA\Property(property: 'birth_date', type: 'string', format: 'date', example: '2015-03-10'),
        new OA\Property(property: 'avatar', type: 'string', nullable: true),
        new OA\Property(property: 'maturity_level', type: 'string', enum: ['enfant', 'preado', 'ado'], example: 'enfant'),
        new OA\Property(property: 'status', type: 'string', enum: ['active', 'paused', 'archived'], example: 'active'),
        new OA\Property(property: 'digital_health_score', type: 'integer', nullable: true, example: 85),
        new OA\Property(property: 'devices', type: 'array', items: new OA\Items(ref: '#/components/schemas/Device')),
        new OA\Property(property: 'devices_count', type: 'integer', example: 1),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'Device',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'child_id', type: 'integer', example: 1),
        new OA\Property(property: 'name', type: 'string', example: 'iPhone de Lucas'),
        new OA\Property(property: 'type', type: 'string', example: 'smartphone'),
        new OA\Property(property: 'os', type: 'string', example: 'iOS'),
        new OA\Property(property: 'os_version', type: 'string', example: '17.2'),
        new OA\Property(property: 'app_version', type: 'string', nullable: true),
        new OA\Property(property: 'status', type: 'string', example: 'paired'),
        new OA\Property(property: 'is_online', type: 'boolean', example: true),
        new OA\Property(property: 'battery_level', type: 'integer', nullable: true, example: 75),
        new OA\Property(property: 'last_seen_at', type: 'string', format: 'date-time', nullable: true),
        new OA\Property(property: 'paired_at', type: 'string', format: 'date-time', nullable: true),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'Activity',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'child_id', type: 'integer', example: 1),
        new OA\Property(property: 'device_id', type: 'integer', example: 1),
        new OA\Property(property: 'type', type: 'string', example: 'app_usage'),
        new OA\Property(property: 'target', type: 'string', example: 'com.youtube.app'),
        new OA\Property(property: 'duration_seconds', type: 'integer', example: 3600),
        new OA\Property(property: 'started_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'ended_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'metadata', type: 'object'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'Alert',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'child_id', type: 'integer', example: 1),
        new OA\Property(property: 'device_id', type: 'integer', nullable: true),
        new OA\Property(property: 'type', type: 'string', example: 'inappropriate_content'),
        new OA\Property(property: 'severity', type: 'string', enum: ['low', 'medium', 'high', 'critical'], example: 'high'),
        new OA\Property(property: 'message', type: 'string', example: 'Tentative d\'accès à un site bloqué'),
        new OA\Property(property: 'status', type: 'string', enum: ['new', 'acknowledged', 'resolved', 'dismissed'], example: 'new'),
        new OA\Property(property: 'triggered_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'Notification',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'user_id', type: 'integer', example: 1),
        new OA\Property(property: 'alert_id', type: 'integer', nullable: true),
        new OA\Property(property: 'channel', type: 'string', example: 'push'),
        new OA\Property(property: 'title', type: 'string', example: 'Nouvelle alerte'),
        new OA\Property(property: 'body', type: 'string', example: 'Lucas a tenté d\'accéder à...'),
        new OA\Property(property: 'status', type: 'string', example: 'sent'),
        new OA\Property(property: 'sent_at', type: 'string', format: 'date-time', nullable: true),
        new OA\Property(property: 'read_at', type: 'string', format: 'date-time', nullable: true),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'Report',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'child_id', type: 'integer', example: 1),
        new OA\Property(property: 'period_type', type: 'string', example: 'weekly'),
        new OA\Property(property: 'period_start', type: 'string', format: 'date'),
        new OA\Property(property: 'period_end', type: 'string', format: 'date'),
        new OA\Property(property: 'digital_health_score', type: 'integer', example: 85),
        new OA\Property(property: 'statistics', type: 'object'),
        new OA\Property(property: 'file_path', type: 'string', nullable: true),
        new OA\Property(property: 'generated_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'FilterRule',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'child_id', type: 'integer', example: 1),
        new OA\Property(property: 'type', type: 'string', enum: ['domain', 'keyword', 'category', 'app'], example: 'domain'),
        new OA\Property(property: 'value', type: 'string', example: 'example.com'),
        new OA\Property(property: 'status', type: 'string', enum: ['active', 'paused', 'disabled'], example: 'active'),
        new OA\Property(property: 'version', type: 'integer', example: 1),
        new OA\Property(property: 'categories', type: 'array', items: new OA\Items(ref: '#/components/schemas/ContentCategory')),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ScreenTimeRule',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'child_id', type: 'integer', example: 1),
        new OA\Property(property: 'type', type: 'string', enum: ['daily', 'weekly', 'schedule'], example: 'daily'),
        new OA\Property(property: 'duration_minutes', type: 'integer', example: 120),
        new OA\Property(property: 'day_of_week', type: 'integer', nullable: true, example: 1),
        new OA\Property(property: 'start_time', type: 'string', nullable: true, example: '08:00'),
        new OA\Property(property: 'end_time', type: 'string', nullable: true, example: '20:00'),
        new OA\Property(property: 'status', type: 'string', enum: ['active', 'paused', 'disabled'], example: 'active'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'AppRule',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'child_id', type: 'integer', example: 1),
        new OA\Property(property: 'application_id', type: 'integer', example: 1),
        new OA\Property(property: 'status', type: 'string', enum: ['allowed', 'blocked', 'limited'], example: 'limited'),
        new OA\Property(property: 'daily_quota_minutes', type: 'integer', nullable: true, example: 60),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'Location',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'child_id', type: 'integer', example: 1),
        new OA\Property(property: 'device_id', type: 'integer', example: 1),
        new OA\Property(property: 'latitude', type: 'number', format: 'float', example: 48.8566),
        new OA\Property(property: 'longitude', type: 'number', format: 'float', example: 2.3522),
        new OA\Property(property: 'accuracy_meters', type: 'number', nullable: true, example: 10.5),
        new OA\Property(property: 'recorded_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ContentCategory',
    properties: [
        new OA\Property(property: 'id', type: 'integer', example: 1),
        new OA\Property(property: 'name', type: 'string', example: 'Réseaux sociaux'),
        new OA\Property(property: 'slug', type: 'string', example: 'social-media'),
        new OA\Property(property: 'description', type: 'string', nullable: true),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
    ],
    type: 'object'
)]
#[OA\Response(
    response: 'Success',
    description: 'Opération réussie',
    content: new OA\JsonContent(
        properties: [
            new OA\Property(property: 'success', type: 'boolean', example: true),
            new OA\Property(property: 'message', type: 'string', example: 'Opération réussie'),
            new OA\Property(property: 'data', type: 'object', nullable: true),
        ]
    )
)]
#[OA\Response(
    response: 'Unauthorized',
    description: 'Non authentifié',
    content: new OA\JsonContent(
        properties: [
            new OA\Property(property: 'success', type: 'boolean', example: false),
            new OA\Property(property: 'message', type: 'string', example: 'Unauthenticated.'),
        ]
    )
)]
#[OA\Response(
    response: 'ValidationError',
    description: 'Erreur de validation',
    content: new OA\JsonContent(
        properties: [
            new OA\Property(property: 'success', type: 'boolean', example: false),
            new OA\Property(property: 'message', type: 'string', example: 'Validation error'),
            new OA\Property(
                property: 'errors',
                type: 'object',
                additionalProperties: new OA\AdditionalProperties(
                    type: 'array',
                    items: new OA\Items(type: 'string')
                )
            ),
        ]
    )
)]
#[OA\Response(
    response: 'NotFound',
    description: 'Ressource introuvable',
    content: new OA\JsonContent(
        properties: [
            new OA\Property(property: 'success', type: 'boolean', example: false),
            new OA\Property(property: 'message', type: 'string', example: 'Ressource introuvable'),
        ]
    )
)]
#[OA\Response(
    response: 'Forbidden',
    description: 'Action non autorisée',
    content: new OA\JsonContent(
        properties: [
            new OA\Property(property: 'success', type: 'boolean', example: false),
            new OA\Property(property: 'message', type: 'string', example: 'Action non autorisée'),
        ]
    )
)]
class Schemas
{
    //
}
