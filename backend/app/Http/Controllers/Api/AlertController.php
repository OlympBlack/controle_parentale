<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\AlertResource;
use App\Http\Traits\ApiResponse;
use App\Models\Alert;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class AlertController extends Controller
{
    use ApiResponse;

    #[OA\Get(
        path: '/api/alerts',
        tags: ['Alerts'],
        summary: 'Liste des alertes',
        description: 'Retourne les alertes (paginées), filtrable par child_id, severity et status',
        operationId: 'alertsIndex',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'page', in: 'query', schema: new OA\Schema(type: 'integer', default: 1))]
    #[OA\Parameter(name: 'child_id', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'severity', in: 'query', schema: new OA\Schema(type: 'string', enum: ['low', 'medium', 'high', 'critical']))]
    #[OA\Parameter(name: 'status', in: 'query', schema: new OA\Schema(type: 'string', enum: ['new', 'acknowledged', 'resolved', 'dismissed']))]
    #[OA\Response(
        response: 200,
        description: 'Liste paginée des alertes',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Liste des alertes'),
                new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Alert')),
                new OA\Property(property: 'meta', type: 'object'),
                new OA\Property(property: 'links', type: 'object'),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    public function index(Request $request)
    {
        $query = Alert::query();

        if ($childId = $request->get('child_id')) {
            $query->where('child_id', $childId);
        }

        if ($severity = $request->get('severity')) {
            $query->where('severity', $severity);
        }

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        $alerts = $query->latest('triggered_at')->paginate(20);

        return $this->paginated($alerts, 'Liste des alertes');
    }

    #[OA\Get(
        path: '/api/alerts/{alert}',
        tags: ['Alerts'],
        summary: 'Détails d\'une alerte',
        operationId: 'alertsShow',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'alert', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(
        response: 200,
        description: 'Détails de l\'alerte',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: "Détails de l'alerte"),
                new OA\Property(property: 'data', ref: '#/components/schemas/Alert'),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    #[OA\Response(response: 404, ref: '#/components/responses/NotFound')]
    public function show(Alert $alert)
    {
        return $this->success(new AlertResource($alert), 'Détails de l\'alerte');
    }

    #[OA\Patch(
        path: '/api/alerts/{alert}/status',
        tags: ['Alerts'],
        summary: 'Mettre à jour le statut d\'une alerte',
        operationId: 'alertsUpdateStatus',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'alert', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['status'],
            properties: [
                new OA\Property(property: 'status', type: 'string', enum: ['new', 'acknowledged', 'resolved', 'dismissed'], example: 'resolved'),
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Statut mis à jour',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: "Statut de l'alerte mis à jour"),
                new OA\Property(property: 'data', ref: '#/components/schemas/Alert'),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    #[OA\Response(response: 404, ref: '#/components/responses/NotFound')]
    #[OA\Response(response: 422, ref: '#/components/responses/ValidationError')]
    public function updateStatus(Request $request, Alert $alert)
    {
        $request->validate([
            'status' => ['required', 'in:new,acknowledged,resolved,dismissed'],
        ]);

        $alert->update(['status' => $request->status]);

        return $this->success(new AlertResource($alert), 'Statut de l\'alerte mis à jour');
    }
}
