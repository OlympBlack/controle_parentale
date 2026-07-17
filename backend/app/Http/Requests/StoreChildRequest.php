<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreChildRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'family_id' => ['required', 'exists:families,id'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'birth_date' => ['required', 'date', 'before:today'],
            'avatar' => ['nullable', 'string'],
            'maturity_level' => ['required', 'in:enfant,preado,ado'],
            'pin_code' => ['nullable', 'string', 'max:10'],
        ];
    }
}
