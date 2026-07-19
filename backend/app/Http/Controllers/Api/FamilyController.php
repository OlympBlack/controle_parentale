<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Requests\StoreFamilyRequest;
use App\Http\Requests\UpdateFamilyRequest;
use App\Http\Resources\FamilyResource;
use App\Http\Traits\ApiResponse;
use App\Models\Family;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class FamilyController extends Controller
{
    use ApiResponse;

    #[OA\Get(
        path: '/api/families',
        tags: ['Families'],
        summary: 'Liste des familles',
        description: 'Retourne les familles de l\'utilisateur authentifié (paginées)',
        operationId: 'familiesIndex',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'page', in: 'query', description: 'Numéro de page', schema: new OA\Schema(type: 'integer', default: 1))]
    #[OA\Parameter(name: 'per_page', in: 'query', description: 'Résultats par page (max 100)', schema: new OA\Schema(type: 'integer', default: 15, maximum: 100))]
    #[OA\Response(
        response: 200,
        description: 'Liste paginée des familles',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Liste des familles'),
                new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Family')),
                new OA\Property(property: 'meta', type: 'object'),
                new OA\Property(property: 'links', type: 'object'),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    public function index(Request $request)
    {
        $perPage = min((int) $request->query('per_page', 15), 100);

        $families = $request->user()
            ->families()
            ->with('owner')
            ->withCount('children')
            ->paginate($perPage);

        return FamilyResource::collection($families)
            ->additional([
                'success' => true,
                'message' => 'Liste des familles',
            ]);
    }

    #[OA\Post(
        path: '/api/families',
        tags: ['Families'],
        summary: 'Créer une famille',
        operationId: 'familiesStore',
        security: [['sanctum' => []]]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['name'],
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Famille Dupont'),
                new OA\Property(property: 'plan', type: 'string', enum: ['free', 'premium'], example: 'free'),
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Famille créée',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Famille créée'),
                new OA\Property(property: 'data', ref: '#/components/schemas/Family'),
            ]
        )
    )]
    #[OA\Response(response: 422, ref: '#/components/responses/ValidationError')]
    public function store(StoreFamilyRequest $request)
    {
        $family = Family::create([
            'name' => $request->name,
            'plan' => $request->plan ?? 'free',
            'owner_id' => $request->user()->id,
        ]);

        $family->users()->attach($request->user()->id, [
            'role'      => UserRole::Admin->value,
            'joined_at' => now(),
        ]);

        return $this->success(new FamilyResource($family->load('owner')), 'Famille créée', 201);
    }

    #[OA\Get(
        path: '/api/families/{family}',
        tags: ['Families'],
        summary: 'Détails d\'une famille',
        operationId: 'familiesShow',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'family', in: 'path', required: true, description: 'ID de la famille', schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(
        response: 200,
        description: 'Détails de la famille',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Détails de la famille'),
                new OA\Property(property: 'data', ref: '#/components/schemas/Family'),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    #[OA\Response(response: 404, ref: '#/components/responses/NotFound')]
    public function show(Request $request, Family $family)
    {
        $family->load('owner', 'children')->loadCount('children');
        return $this->success(new FamilyResource($family), 'Détails de la famille');
    }

    #[OA\Put(
        path: '/api/families/{family}',
        tags: ['Families'],
        summary: 'Mettre à jour une famille',
        operationId: 'familiesUpdate',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'family', in: 'path', required: true, description: 'ID de la famille', schema: new OA\Schema(type: 'integer'))]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Famille Dupont'),
                new OA\Property(property: 'plan', type: 'string', enum: ['free', 'premium'], example: 'premium'),
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Famille mise à jour',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Famille mise à jour'),
                new OA\Property(property: 'data', ref: '#/components/schemas/Family'),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    #[OA\Response(response: 404, ref: '#/components/responses/NotFound')]
    #[OA\Response(response: 422, ref: '#/components/responses/ValidationError')]
    public function update(UpdateFamilyRequest $request, Family $family)
    {
        $family->update($request->validated());
        return $this->success(new FamilyResource($family->fresh('owner')), 'Famille mise à jour');
    }

    #[OA\Delete(
        path: '/api/families/{family}',
        tags: ['Families'],
        summary: 'Supprimer une famille',
        description: 'Seul le propriétaire peut supprimer la famille',
        operationId: 'familiesDestroy',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'family', in: 'path', required: true, description: 'ID de la famille', schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, ref: '#/components/responses/Success')]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    #[OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    #[OA\Response(response: 404, ref: '#/components/responses/NotFound')]
    public function destroy(Request $request, Family $family)
    {
        if ($family->owner_id !== $request->user()->id) {
            return $this->error('Action non autorisée', 403);
        }

        $family->delete();
        return $this->success(null, 'Famille supprimée');
    }
}
