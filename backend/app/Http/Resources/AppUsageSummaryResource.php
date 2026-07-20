<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppUsageSummaryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'device_id' => $this->device_id,
            'date' => $this->date?->toDateString(),
            'temps_ecran_total_secondes' => $this->temps_ecran_total_secondes,
            'nombre_apps_utilisees' => $this->nombre_apps_utilisees,
        ];
    }
}
