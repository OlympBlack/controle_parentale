<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAppRuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'child_id' => ['required', 'exists:children,id'],
            'application_id' => ['required', 'exists:applications,id'],
            'status' => ['sometimes', 'in:allowed,blocked,limited'],
            'daily_quota_minutes' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
