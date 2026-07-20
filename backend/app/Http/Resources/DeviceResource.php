<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DeviceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'child_id' => $this->child_id,
            'name' => $this->name,
            'type' => $this->type,
            'brand' => $this->brand,
            'model' => $this->model,
            'os' => $this->os,
            'os_version' => $this->os_version,
            'app_version' => $this->app_version,
            'pairing_code' => $this->pairing_code,
            'device_token' => $this->device_token,
            'status' => $this->status,
            'permissions_accordees' => $this->permissions_accordees,
            'derniere_synchronisation' => $this->derniere_synchronisation?->toIso8601String(),
            'is_online' => $this->is_online,
            'battery_level' => $this->battery_level,
            'last_seen_at' => $this->last_seen_at?->toIso8601String(),
            'paired_at' => $this->paired_at?->toIso8601String(),
            'child' => $this->whenLoaded('child', fn () => [
                'id' => $this->child->id,
                'first_name' => $this->child->first_name,
                'last_name' => $this->child->last_name,
                'full_name' => trim("{$this->child->first_name} {$this->child->last_name}"),
            ]),
            'installed_apps' => $this->whenLoaded('installedApps', fn () => $this->installedApps->map(fn ($app) => [
                'id' => $app->id,
                'name' => $app->name,
                'package_name' => $app->package_name,
                'icon_url' => $app->icon_url,
                'platform' => $app->platform,
                'is_system_app' => $app->is_system_app,
                'installed_at' => $app->pivot->installed_at?->toIso8601String(),
                'version' => $app->pivot->version,
            ])),
            'recent_locations' => $this->whenLoaded('locations', fn () => $this->locations->map(fn ($loc) => [
                'id' => $loc->id,
                'latitude' => $loc->latitude,
                'longitude' => $loc->longitude,
                'accuracy' => $loc->accuracy_meters,
                'recorded_at' => $loc->recorded_at?->toIso8601String(),
            ])),
            'recent_usage_sessions' => $this->whenLoaded('usageSessions', fn () => $this->usageSessions->map(fn ($session) => [
                'id' => $session->id,
                'app_name' => $session->nom_application,
                'package_name' => $session->package_name,
                'duration_seconds' => $session->duree_secondes,
                'date_utilisation' => $session->date_utilisation?->toIso8601String(),
                'categorie' => $session->categorie,
            ])),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
