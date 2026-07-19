<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'child_id' => $this->child_id,
            'period_type' => $this->period_type,
            'period_start' => $this->period_start?->toDateString(),
            'period_end' => $this->period_end?->toDateString(),
            'digital_health_score' => $this->digital_health_score,
            'statistics' => $this->statistics,
            'file_path' => $this->file_path,
            'generated_at' => $this->generated_at?->toIso8601String(),
            'child' => $this->whenLoaded('child', fn () => [
                'id' => $this->child->id,
                'first_name' => $this->child->first_name,
                'last_name' => $this->child->last_name,
                'full_name' => trim("{$this->child->first_name} {$this->child->last_name}"),
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
