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
            'os' => $this->os,
            'os_version' => $this->os_version,
            'app_version' => $this->app_version,
            'status' => $this->status,
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
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
