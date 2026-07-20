<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDeviceLocationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'precision_metres' => ['nullable', 'numeric', 'min:0'],
            'captured_at' => ['required', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'latitude.required' => 'La latitude est requise.',
            'longitude.required' => 'La longitude est requise.',
            'captured_at.required' => 'La date de capture est requise.',
        ];
    }
}
