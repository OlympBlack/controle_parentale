<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreScreenTimeRuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'child_id' => ['required', 'exists:children,id'],
            'type' => ['required', 'string', 'in:daily,weekly,schedule'],
            'duration_minutes' => ['required', 'integer', 'min:1'],
            'day_of_week' => ['nullable', 'integer', 'min:0', 'max:6'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i'],
            'status' => ['sometimes', 'in:active,paused,disabled'],
        ];
    }
}
