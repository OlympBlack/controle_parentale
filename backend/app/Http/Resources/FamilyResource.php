<?php

namespace App\Http\Resources;

use App\Enums\UserRole;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FamilyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'plan'           => $this->plan,
            'owner'          => new UserResource($this->whenLoaded('owner')),
            'children_count' => $this->whenCounted('children'),
            'my_role'        => $this->pivot
                ? ($this->pivot->role instanceof UserRole
                    ? $this->pivot->role->value
                    : $this->pivot->role)
                : null,
            'created_at'     => $this->created_at?->toIso8601String(),
            'updated_at'     => $this->updated_at?->toIso8601String(),
        ];
    }
}
