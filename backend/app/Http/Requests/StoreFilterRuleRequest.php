<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFilterRuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'child_id' => ['required', 'exists:children,id'],
            'type' => ['required', 'string', 'in:domain,keyword,category,app'],
            'value' => ['required', 'string', 'max:255'],
            'status' => ['sometimes', 'in:active,paused,disabled'],
            'categories' => ['sometimes', 'array'],
            'categories.*' => ['exists:content_categories,id'],
        ];
    }
}
