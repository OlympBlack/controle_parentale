<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PairDeviceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pairing_code'       => ['required', 'string', 'max:10'],
            'name'               => ['nullable', 'string', 'max:255'],
            'brand'              => ['nullable', 'string', 'max:100'],
            'model'              => ['nullable', 'string', 'max:100'],
            'os'                 => ['nullable', 'string', 'max:50'],
            'os_version'         => ['nullable', 'string', 'max:50'],
            'app_version'        => ['nullable', 'string', 'max:50'],
            'battery_level'      => ['nullable', 'integer', 'min:0', 'max:100'],
        ];
    }
}
