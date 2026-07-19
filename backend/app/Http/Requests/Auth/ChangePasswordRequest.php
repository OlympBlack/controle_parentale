<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class ChangePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'current_password' => ['required', 'string'],
            'password'         => [
                'required',
                'string',
                'max:72',
                'confirmed',
                'different:current_password',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->uncompromised(),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'password.different'     => 'Le nouveau mot de passe doit être différent de l\'actuel.',
            'password.max'           => 'Le mot de passe ne peut pas dépasser 72 caractères.',
            'password.mixed_case'    => 'Le mot de passe doit contenir des majuscules et des minuscules.',
            'password.numbers'       => 'Le mot de passe doit contenir au moins un chiffre.',
            'password.uncompromised' => 'Ce mot de passe est apparu dans une fuite de données. Veuillez en choisir un autre.',
        ];
    }
}
