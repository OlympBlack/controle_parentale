<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateChildRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['sometimes', 'string', 'max:255'],
            'last_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'birth_date' => ['sometimes', 'date', 'before:today'],
            'avatar' => ['sometimes', 'nullable', 'string'],
            'maturity_level' => ['sometimes', 'in:enfant,preado,ado'],
            'pin_code' => ['sometimes', 'nullable', 'string', 'max:10'],
            'status' => ['sometimes', 'in:active,paused,archived'],
            'digital_health_score' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:100'],
        ];
    }
}
