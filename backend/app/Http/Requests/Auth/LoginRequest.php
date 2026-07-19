<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email'       => ['required', 'string', 'email:rfc,dns', 'max:255', 'lowercase'],
            'password'    => ['required', 'string', 'min:8', 'max:72'],
            'device_name' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.lowercase'   => 'L\'adresse e-mail doit être en minuscules.',
            'password.max'      => 'Le mot de passe ne peut pas dépasser 72 caractères.',
        ];
    }
}
