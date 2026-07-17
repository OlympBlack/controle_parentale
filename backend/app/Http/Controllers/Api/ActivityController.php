<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\ActivityResource;
use App\Http\Traits\ApiResponse;
use App\Models\Activity;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ActivityController extends Controller
{
    use ApiResponse;

    #[OA\Get(
        path: '/api/activities',
        tags: ['Activities'],
        summary: 'Liste des activités',
        description: 'Retourne les activités (paginées), filtrable par child_id et device_id',
        operationId: 'activitiesIndex',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'page', in: 'query', schema: new OA\Schema(type: 'integer', default: 1))]
    #[OA\Parameter(name: 'child_id', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'device_id', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(
        response: 200,
        description: 'Liste paginée des activités',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Liste des activités'),
                new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Activity')),
                new OA\Property(property: 'meta', type: 'object'),
                new OA\Property(property: 'links', type: 'object'),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    public function index(Request $request)
    {
        $query = Activity::query()->with('category');

        if ($childId = $request->get('child_id')) {
            $query->where('child_id', $childId);
        }

        if ($deviceId = $request->get('device_id')) {
            $query->where('device_id', $deviceId);
        }

        $activities = $query->latest('started_at')->paginate(20);

        return $this->paginated($activities, 'Liste des activités');
    }

    #[OA\Get(
        path: '/api/activities/{activity}',
        tags: ['Activities'],
        summary: 'Détails d\'une activité',
        operationId: 'activitiesShow',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'activity', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(
        response: 200,
        description: 'Détails de l\'activité',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: "Détails de l'activité"),
                new OA\Property(property: 'data', ref: '#/components/schemas/Activity'),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    #[OA\Response(response: 404, ref: '#/components/responses/NotFound')]
    public function show(Activity $activity)
    {
        $activity->load('category', 'child', 'device');
        return $this->success(new ActivityResource($activity), 'Détails de l\'activité');
    }
}
