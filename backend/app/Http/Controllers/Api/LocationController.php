<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\LocationResource;
use App\Http\Traits\ApiResponse;
use App\Models\Location;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class LocationController extends Controller
{
    use ApiResponse;

    #[OA\Get(
        path: '/api/locations',
        tags: ['Locations'],
        summary: 'Liste des localisations',
        description: 'Retourne les localisations (paginées), filtrable par child_id',
        operationId: 'locationsIndex',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'page', in: 'query', schema: new OA\Schema(type: 'integer', default: 1))]
    #[OA\Parameter(name: 'child_id', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(
        response: 200,
        description: 'Liste paginée des localisations',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Liste des localisations'),
                new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Location')),
                new OA\Property(property: 'meta', type: 'object'),
                new OA\Property(property: 'links', type: 'object'),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    public function index(Request $request)
    {
        $query = Location::query();

        if ($childId = $request->get('child_id')) {
            $query->where('child_id', $childId);
        }

        $locations = $query->latest('recorded_at')->paginate(50);

        return $this->paginated($locations, 'Liste des localisations');
    }

    #[OA\Get(
        path: '/api/children/{childId}/locations/latest',
        tags: ['Locations'],
        summary: 'Dernière localisation d\'un enfant',
        operationId: 'locationsLatest',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'childId', in: 'path', required: true, description: 'ID de l\'enfant', schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(
        response: 200,
        description: 'Dernière localisation',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Dernière localisation'),
                new OA\Property(property: 'data', ref: '#/components/schemas/Location'),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    #[OA\Response(response: 404, ref: '#/components/responses/NotFound')]
    public function latest(Request $request, $childId)
    {
        $location = Location::where('child_id', $childId)
            ->latest('recorded_at')
            ->first();

        if (!$location) {
            return $this->error('Aucune localisation trouvée', 404);
        }

        return $this->success(new LocationResource($location), 'Dernière localisation');
    }
}
