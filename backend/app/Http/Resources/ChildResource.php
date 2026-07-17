<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChildResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'family_id' => $this->family_id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => trim("{$this->first_name} {$this->last_name}"),
            'birth_date' => $this->birth_date?->toDateString(),
            'avatar' => $this->avatar,
            'maturity_level' => $this->maturity_level,
            'status' => $this->status,
            'digital_health_score' => $this->digital_health_score,
            'devices' => DeviceResource::collection($this->whenLoaded('devices')),
            'devices_count' => $this->whenCounted('devices'),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
