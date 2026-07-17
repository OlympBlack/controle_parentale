<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AlertResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'child_id' => $this->child_id,
            'device_id' => $this->device_id,
            'type' => $this->type,
            'severity' => $this->severity,
            'message' => $this->message,
            'status' => $this->status,
            'triggered_at' => $this->triggered_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
