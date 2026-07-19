<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:255'],
            'email'       => ['required', 'string', 'email:rfc,dns', 'max:255', 'lowercase', 'unique:users,email'],
            'phone'       => ['nullable', 'string', 'max:20', 'regex:/^\+?[0-9\s\-\(\)]{7,20}$/', 'unique:users,phone'],
            'password'    => [
                'required',
                'string',
                'max:72',
                'confirmed',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->uncompromised(),
            ],
            'locale'      => ['sometimes', 'string', Rule::in(['fr', 'en'])],
            'timezone'    => ['sometimes', 'nullable', 'timezone:all'],
            'device_name' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.lowercase'      => "L'adresse e-mail doit \u00eatre en minuscules.",
            'email.unique'         => 'Cette adresse e-mail est déjà utilisée.',
            'phone.regex'          => 'Le format du numéro de téléphone est invalide.',
            'phone.unique'         => 'Ce numéro de téléphone est déjà utilisé.',
            'password.max'         => 'Le mot de passe ne peut pas dépasser 72 caractères.',
            'password.mixed_case'  => 'Le mot de passe doit contenir des majuscules et des minuscules.',
            'password.numbers'     => 'Le mot de passe doit contenir au moins un chiffre.',
            'password.uncompromised' => 'Ce mot de passe est apparu dans une fuite de données. Veuillez en choisir un autre.',
        ];
    }
}
