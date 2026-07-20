<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UsageSessionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'device_id' => $this->device_id,
            'package_name' => $this->package_name,
            'nom_application' => $this->nom_application,
            'duree_secondes' => $this->duree_secondes,
            'date_utilisation' => $this->date_utilisation?->toDateString(),
            'categorie' => $this->categorie,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
