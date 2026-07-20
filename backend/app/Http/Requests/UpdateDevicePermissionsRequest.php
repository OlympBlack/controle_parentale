<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDevicePermissionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'permissions' => ['required', 'array'],
            'permissions.usage_access' => ['boolean'],
            'permissions.location' => ['boolean'],
            'permissions.notifications' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'permissions.required' => 'Les permissions sont requises.',
            'permissions.array' => 'Les permissions doivent être un tableau.',
        ];
    }
}
