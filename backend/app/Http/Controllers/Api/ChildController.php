<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreChildRequest;
use App\Http\Requests\UpdateChildRequest;
use App\Http\Resources\ChildResource;
use App\Http\Traits\ApiResponse;
use App\Models\Child;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ChildController extends Controller
{
    use ApiResponse;

    #[OA\Get(
        path: '/api/children',
        tags: ['Children'],
        summary: 'Liste des enfants',
        description: 'Retourne les enfants (paginés), filtrable par family_id',
        operationId: 'childrenIndex',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'page', in: 'query', description: 'Numéro de page', schema: new OA\Schema(type: 'integer', default: 1))]
    #[OA\Parameter(name: 'family_id', in: 'query', description: 'Filtrer par famille', schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(
        response: 200,
        description: 'Liste paginée des enfants',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Liste des enfants'),
                new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Child')),
                new OA\Property(property: 'meta', type: 'object'),
                new OA\Property(property: 'links', type: 'object'),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    public function index(Request $request)
    {
        $query = Child::query()
            ->with('devices')
            ->withCount('devices');

        if ($familyId = $request->get('family_id')) {
            $query->where('family_id', $familyId);
        }

        $children = $query->paginate(15);

        return $this->paginated($children, 'Liste des enfants');
    }

    #[OA\Post(
        path: '/api/children',
        tags: ['Children'],
        summary: 'Ajouter un enfant',
        operationId: 'childrenStore',
        security: [['sanctum' => []]]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['family_id', 'first_name', 'birth_date', 'maturity_level'],
            properties: [
                new OA\Property(property: 'family_id', type: 'integer', example: 1),
                new OA\Property(property: 'first_name', type: 'string', example: 'Lucas'),
                new OA\Property(property: 'last_name', type: 'string', example: 'Dupont'),
                new OA\Property(property: 'birth_date', type: 'string', format: 'date', example: '2015-03-10'),
                new OA\Property(property: 'avatar', type: 'string', nullable: true),
                new OA\Property(property: 'maturity_level', type: 'string', enum: ['enfant', 'preado', 'ado'], example: 'enfant'),
                new OA\Property(property: 'pin_code', type: 'string', nullable: true, example: '1234'),
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Enfant ajouté',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Enfant ajouté'),
                new OA\Property(property: 'data', ref: '#/components/schemas/Child'),
            ]
        )
    )]
    #[OA\Response(response: 422, ref: '#/components/responses/ValidationError')]
    public function store(StoreChildRequest $request)
    {
        $child = Child::create($request->validated());

        return $this->success(new ChildResource($child->load('devices')), 'Enfant ajouté', 201);
    }

    #[OA\Get(
        path: '/api/children/{child}',
        tags: ['Children'],
        summary: 'Détails d\'un enfant',
        description: 'Inclut les appareils, règles de filtrage, règles d\'apps et règles de temps d\'écran',
        operationId: 'childrenShow',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'child', in: 'path', required: true, description: 'ID de l\'enfant', schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(
        response: 200,
        description: 'Détails de l\'enfant',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: "Détails de l'enfant"),
                new OA\Property(property: 'data', ref: '#/components/schemas/Child'),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    #[OA\Response(response: 404, ref: '#/components/responses/NotFound')]
    public function show(Child $child)
    {
        $child->load('devices', 'filterRules', 'appRules', 'screenTimeRules');
        return $this->success(new ChildResource($child), 'Détails de l\'enfant');
    }

    #[OA\Put(
        path: '/api/children/{child}',
        tags: ['Children'],
        summary: 'Mettre à jour un enfant',
        operationId: 'childrenUpdate',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'child', in: 'path', required: true, description: 'ID de l\'enfant', schema: new OA\Schema(type: 'integer'))]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'first_name', type: 'string', example: 'Lucas'),
                new OA\Property(property: 'last_name', type: 'string', example: 'Dupont'),
                new OA\Property(property: 'birth_date', type: 'string', format: 'date', example: '2015-03-10'),
                new OA\Property(property: 'maturity_level', type: 'string', enum: ['enfant', 'preado', 'ado'], example: 'preado'),
                new OA\Property(property: 'status', type: 'string', enum: ['active', 'paused', 'archived'], example: 'active'),
                new OA\Property(property: 'digital_health_score', type: 'integer', example: 85),
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Enfant mis à jour',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Enfant mis à jour'),
                new OA\Property(property: 'data', ref: '#/components/schemas/Child'),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    #[OA\Response(response: 404, ref: '#/components/responses/NotFound')]
    #[OA\Response(response: 422, ref: '#/components/responses/ValidationError')]
    public function update(UpdateChildRequest $request, Child $child)
    {
        $child->update($request->validated());
        return $this->success(new ChildResource($child->fresh('devices')), 'Enfant mis à jour');
    }

    #[OA\Delete(
        path: '/api/children/{child}',
        tags: ['Children'],
        summary: 'Supprimer un enfant (soft delete)',
        operationId: 'childrenDestroy',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'child', in: 'path', required: true, description: 'ID de l\'enfant', schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, ref: '#/components/responses/Success')]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    #[OA\Response(response: 404, ref: '#/components/responses/NotFound')]
    public function destroy(Child $child)
    {
        $child->delete();
        return $this->success(null, 'Enfant supprimé');
    }
}
