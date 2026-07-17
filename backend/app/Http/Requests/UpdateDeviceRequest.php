<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDeviceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'type' => ['sometimes', 'string', 'max:50'],
            'os' => ['sometimes', 'nullable', 'string', 'max:50'],
            'os_version' => ['sometimes', 'nullable', 'string', 'max:50'],
            'app_version' => ['sometimes', 'nullable', 'string', 'max:50'],
            'status' => ['sometimes', 'string', 'in:paired,unpaired,locked,lost'],
            'is_online' => ['sometimes', 'boolean'],
            'battery_level' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:100'],
        ];
    }
}
