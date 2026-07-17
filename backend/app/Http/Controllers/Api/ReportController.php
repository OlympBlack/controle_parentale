<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\ReportResource;
use App\Http\Traits\ApiResponse;
use App\Models\Report;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ReportController extends Controller
{
    use ApiResponse;

    #[OA\Get(
        path: '/api/reports',
        tags: ['Reports'],
        summary: 'Liste des rapports',
        description: 'Retourne les rapports (paginés), filtrable par child_id et period_type',
        operationId: 'reportsIndex',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'page', in: 'query', schema: new OA\Schema(type: 'integer', default: 1))]
    #[OA\Parameter(name: 'child_id', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'period_type', in: 'query', schema: new OA\Schema(type: 'string'))]
    #[OA\Response(
        response: 200,
        description: 'Liste paginée des rapports',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Liste des rapports'),
                new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Report')),
                new OA\Property(property: 'meta', type: 'object'),
                new OA\Property(property: 'links', type: 'object'),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    public function index(Request $request)
    {
        $query = Report::query();

        if ($childId = $request->get('child_id')) {
            $query->where('child_id', $childId);
        }

        if ($periodType = $request->get('period_type')) {
            $query->where('period_type', $periodType);
        }

        $reports = $query->latest('generated_at')->paginate(15);

        return $this->paginated($reports, 'Liste des rapports');
    }

    #[OA\Get(
        path: '/api/reports/{report}',
        tags: ['Reports'],
        summary: 'Détails d\'un rapport',
        operationId: 'reportsShow',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'report', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(
        response: 200,
        description: 'Détails du rapport',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Détails du rapport'),
                new OA\Property(property: 'data', ref: '#/components/schemas/Report'),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    #[OA\Response(response: 404, ref: '#/components/responses/NotFound')]
    public function show(Report $report)
    {
        return $this->success(new ReportResource($report), 'Détails du rapport');
    }
}
