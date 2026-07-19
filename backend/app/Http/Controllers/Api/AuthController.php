<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Http\Traits\ApiResponse;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly AuthService $authService) {}

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
            required: ['name', 'email', 'password', 'password_confirmation'],
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Jean Dupont'),
                new OA\Property(property: 'email', type: 'string', format: 'email', example: 'jean@exemple.com'),
                new OA\Property(property: 'phone', type: 'string', example: '+33612345678'),
                new OA\Property(property: 'password', type: 'string', format: 'password', example: 'P@ssw0rd!'),
                new OA\Property(property: 'password_confirmation', type: 'string', format: 'password', example: 'P@ssw0rd!'),
                new OA\Property(property: 'locale', type: 'string', example: 'fr'),
                new OA\Property(property: 'timezone', type: 'string', example: 'Europe/Paris'),
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
    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register(
            $request->validated(),
            $request->device_name ?? $request->userAgent()
        );

        return $this->success(
            ['user' => new UserResource($result['user']), 'token' => $result['token']],
            'Compte créé avec succès',
            201
        );
    }

    #[OA\Post(
        path: '/api/login',
        tags: ['Auth'],
        summary: 'Connexion utilisateur',
        description: 'Authentifie un utilisateur et retourne un token Bearer. Limité à 10 tentatives par minute.',
        operationId: 'login'
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['email', 'password'],
            properties: [
                new OA\Property(property: 'email', type: 'string', format: 'email', example: 'jean@exemple.com'),
                new OA\Property(property: 'password', type: 'string', format: 'password', example: 'P@ssw0rd!'),
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
    #[OA\Response(response: 403, description: 'Compte suspendu ou inactif')]
    #[OA\Response(response: 429, description: 'Trop de tentatives')]
    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login(
            $request->email,
            $request->password,
            $request->device_name ?? $request->userAgent()
        );

        if ($result === null) {
            return $this->error('Identifiants incorrects.', 401);
        }

        $user = $result['user'];

        if ($user->status === 'suspended') {
            return $this->error('Votre compte a été suspendu. Contactez le support.', 403);
        }

        if ($user->status === 'pending') {
            return $this->error('Votre compte est en attente de validation.', 403);
        }

        return $this->success(
            ['user' => new UserResource($user), 'token' => $result['token']],
            'Connexion réussie'
        );
    }

    #[OA\Post(
        path: '/api/logout',
        tags: ['Auth'],
        summary: 'Déconnexion (token courant)',
        description: 'Révoque uniquement le token utilisé pour cette requête',
        operationId: 'logout',
        security: [['sanctum' => []]]
    )]
    #[OA\Response(response: 200, ref: '#/components/responses/Success')]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    public function logout(Request $request): JsonResponse
    {
        $this->authService->revokeCurrentToken($request->user());

        return $this->success(null, 'Déconnexion réussie.');
    }

    #[OA\Post(
        path: '/api/logout-all',
        tags: ['Auth'],
        summary: 'Déconnexion de tous les appareils',
        description: 'Révoque tous les tokens de l\'utilisateur (utile en cas de vol d\'appareil)',
        operationId: 'logoutAll',
        security: [['sanctum' => []]]
    )]
    #[OA\Response(response: 200, ref: '#/components/responses/Success')]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    public function logoutAll(Request $request): JsonResponse
    {
        $this->authService->revokeAllTokens($request->user());

        return $this->success(null, 'Déconnecté de tous les appareils.');
    }

    #[OA\Post(
        path: '/api/auth/password',
        tags: ['Auth'],
        summary: 'Changer le mot de passe',
        description: 'Vérifie le mot de passe actuel et le remplace. Révoque toutes les autres sessions.',
        operationId: 'changePassword',
        security: [['sanctum' => []]]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['current_password', 'password', 'password_confirmation'],
            properties: [
                new OA\Property(property: 'current_password', type: 'string', format: 'password'),
                new OA\Property(property: 'password', type: 'string', format: 'password'),
                new OA\Property(property: 'password_confirmation', type: 'string', format: 'password'),
            ]
        )
    )]
    #[OA\Response(response: 200, ref: '#/components/responses/Success')]
    #[OA\Response(response: 422, ref: '#/components/responses/ValidationError')]
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $changed = $this->authService->changePassword(
            $request->user(),
            $request->current_password,
            $request->password
        );

        if (!$changed) {
            return $this->error('Le mot de passe actuel est incorrect.', 422);
        }

        return $this->success(null, 'Mot de passe modifié. Les autres sessions ont été révoquées.');
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
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        $cacheKey = "user:{$user->id}:profile";

        $data = Cache::remember($cacheKey, 60, function () use ($user) {
            return new UserResource($user);
        });

        return $this->success($data, 'Profil utilisateur');
    }
}
