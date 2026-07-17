<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Http\Traits\ApiResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ProfileController extends Controller
{
    use ApiResponse;

    #[OA\Get(
        path: '/api/profile',
        tags: ['Profile'],
        summary: 'Afficher le profil',
        operationId: 'profileShow',
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
    public function show(Request $request)
    {
        return $this->success(new UserResource($request->user()), 'Profil utilisateur');
    }

    #[OA\Put(
        path: '/api/profile',
        tags: ['Profile'],
        summary: 'Mettre à jour le profil',
        operationId: 'profileUpdate',
        security: [['sanctum' => []]]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Jean Dupont'),
                new OA\Property(property: 'email', type: 'string', format: 'email', example: 'jean@exemple.com'),
                new OA\Property(property: 'phone', type: 'string', example: '+33612345678'),
                new OA\Property(property: 'avatar', type: 'string', nullable: true),
                new OA\Property(property: 'locale', type: 'string', example: 'fr'),
                new OA\Property(property: 'timezone', type: 'string', example: 'Europe/Paris'),
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Profil mis à jour',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Profil mis à jour'),
                new OA\Property(property: 'data', ref: '#/components/schemas/User'),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    #[OA\Response(response: 422, ref: '#/components/responses/ValidationError')]
    public function update(UpdateProfileRequest $request)
    {
        $user = $request->user();
        $user->update($request->validated());

        return $this->success(new UserResource($user), 'Profil mis à jour');
    }
}
