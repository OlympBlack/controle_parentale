<?php

namespace App\Http\Resources;

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
            'my_role'        => $this->whenPivotLoaded('family_user', function () {
                $role = $this->pivot->role;
                return $role instanceof \App\Enums\UserRole ? $role->value : $role;
            }),
            'created_at'     => $this->created_at?->toIso8601String(),
            'updated_at'     => $this->updated_at?->toIso8601String(),
        ];
    }
}
