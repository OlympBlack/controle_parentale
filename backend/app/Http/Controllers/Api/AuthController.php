<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Http\Traits\ApiResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    use ApiResponse;

    #[OA\Post(
        path: '/api/register',
        tags: ['Auth'],
        summary: 'Inscription d\'un nouvel utilisateur',
        description: 'Crée un compte parent et retourne un token d\'authentification',
        operationId: 'register'
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['name', 'email', 'password'],
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Jean Dupont'),
                new OA\Property(property: 'email', type: 'string', format: 'email', example: 'jean@exemple.com'),
                new OA\Property(property: 'phone', type: 'string', example: '+33612345678'),
                new OA\Property(property: 'password', type: 'string', format: 'password', example: 'password123'),
                new OA\Property(property: 'password_confirmation', type: 'string', format: 'password', example: 'password123'),
                new OA\Property(property: 'device_name', type: 'string', example: 'Chrome Browser'),
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Compte créé avec succès',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Compte créé avec succès'),
                new OA\Property(
                    property: 'data',
                    properties: [
                        new OA\Property(property: 'token', type: 'string', example: '1|abcdef123456'),
                        new OA\Property(property: 'user', ref: '#/components/schemas/User'),
                    ],
                    type: 'object'
                ),
            ]
        )
    )]
    #[OA\Response(response: 422, ref: '#/components/responses/ValidationError')]
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => $request->password,
        ]);

        $deviceName = $request->device_name ?? $request->userAgent() ?? 'unknown';
        $token = $user->createToken($deviceName)->plainTextToken;

        return $this->success(
            ['user' => new UserResource($user), 'token' => $token],
            'Compte créé avec succès',
            201
        );
    }

    #[OA\Post(
        path: '/api/login',
        tags: ['Auth'],
        summary: 'Connexion utilisateur',
        description: 'Authentifie un utilisateur et retourne un token Bearer',
        operationId: 'login'
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['email', 'password'],
            properties: [
                new OA\Property(property: 'email', type: 'string', format: 'email', example: 'jean@exemple.com'),
                new OA\Property(property: 'password', type: 'string', format: 'password', example: 'password123'),
                new OA\Property(property: 'device_name', type: 'string', example: 'Chrome Browser'),
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Connexion réussie',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Connexion réussie'),
                new OA\Property(
                    property: 'data',
                    properties: [
                        new OA\Property(property: 'token', type: 'string', example: '1|abcdef123456'),
                        new OA\Property(property: 'user', ref: '#/components/schemas/User'),
                    ],
                    type: 'object'
                ),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->error('Identifiants incorrects', 401);
        }

        if ($user->status !== 'active') {
            return $this->error('Votre compte est ' . $user->status, 403);
        }

        $user->update(['last_login_at' => now()]);

        $deviceName = $request->device_name ?? $request->userAgent() ?? 'unknown';
        $token = $user->createToken($deviceName)->plainTextToken;

        return $this->success(
            ['user' => new UserResource($user), 'token' => $token],
            'Connexion réussie'
        );
    }

    #[OA\Post(
        path: '/api/logout',
        tags: ['Auth'],
        summary: 'Déconnexion utilisateur',
        description: 'Révoque le token courant',
        operationId: 'logout',
        security: [['sanctum' => []]]
    )]
    #[OA\Response(response: 200, ref: '#/components/responses/Success')]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success(null, 'Déconnexion réussie');
    }

    #[OA\Get(
        path: '/api/me',
        tags: ['Auth'],
        summary: 'Utilisateur courant',
        description: 'Retourne les informations de l\'utilisateur authentifié',
        operationId: 'me',
        security: [['sanctum' => []]]
    )]
    #[OA\Response(
        response: 200,
        description: 'Profil utilisateur',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Profil utilisateur'),
                new OA\Property(property: 'data', ref: '#/components/schemas/User'),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    public function me(Request $request)
    {
        return $this->success(new UserResource($request->user()), 'Profil utilisateur');
    }
}
