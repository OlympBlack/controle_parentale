<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDeviceUsageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sessions' => ['required', 'array', 'min:1', 'max:500'],
            'sessions.*.package_name' => ['required', 'string', 'max:255'],
            'sessions.*.nom_application' => ['nullable', 'string', 'max:255'],
            'sessions.*.duree_secondes' => ['required', 'integer', 'min:0'],
            'sessions.*.date_utilisation' => ['required', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'sessions.required' => 'Au moins une session d\'usage est requise.',
            'sessions.*.package_name.required' => 'Le nom du package est requis.',
            'sessions.*.duree_secondes.required' => 'La durée en secondes est requise.',
            'sessions.*.date_utilisation.required' => 'La date d\'utilisation est requise.',
        ];
    }
}
