<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreDeviceRequest;
use App\Http\Requests\UpdateDeviceRequest;
use App\Http\Resources\DeviceResource;
use App\Http\Traits\ApiResponse;
use App\Models\Device;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class DeviceController extends Controller
{
    use ApiResponse;

    #[OA\Get(
        path: '/api/devices',
        tags: ['Devices'],
        summary: 'Liste des appareils',
        description: 'Retourne les appareils (paginés), filtrable par child_id',
        operationId: 'devicesIndex',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'page', in: 'query', schema: new OA\Schema(type: 'integer', default: 1))]
    #[OA\Parameter(name: 'child_id', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(
        response: 200,
        description: 'Liste paginée des appareils',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Liste des appareils'),
                new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Device')),
                new OA\Property(property: 'meta', type: 'object'),
                new OA\Property(property: 'links', type: 'object'),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    public function index(Request $request)
    {
        $query = Device::query();

        if ($childId = $request->get('child_id')) {
            $query->where('child_id', $childId);
        }

        $devices = $query->paginate(15);

        return $this->paginated($devices, 'Liste des appareils');
    }

    #[OA\Post(
        path: '/api/devices',
        tags: ['Devices'],
        summary: 'Ajouter un appareil',
        operationId: 'devicesStore',
        security: [['sanctum' => []]]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['child_id', 'name', 'type'],
            properties: [
                new OA\Property(property: 'child_id', type: 'integer', example: 1),
                new OA\Property(property: 'name', type: 'string', example: 'iPhone de Lucas'),
                new OA\Property(property: 'type', type: 'string', example: 'smartphone'),
                new OA\Property(property: 'os', type: 'string', example: 'iOS'),
                new OA\Property(property: 'os_version', type: 'string', example: '17.2'),
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Appareil ajouté',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Appareil ajouté'),
                new OA\Property(property: 'data', ref: '#/components/schemas/Device'),
            ]
        )
    )]
    #[OA\Response(response: 422, ref: '#/components/responses/ValidationError')]
    public function store(StoreDeviceRequest $request)
    {
        $device = Device::create($request->validated());

        return $this->success(new DeviceResource($device), 'Appareil ajouté', 201);
    }

    #[OA\Get(
        path: '/api/devices/{device}',
        tags: ['Devices'],
        summary: 'Détails d\'un appareil',
        operationId: 'devicesShow',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'device', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(
        response: 200,
        description: 'Détails de l\'appareil',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: "Détails de l'appareil"),
                new OA\Property(property: 'data', ref: '#/components/schemas/Device'),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    #[OA\Response(response: 404, ref: '#/components/responses/NotFound')]
    public function show(Device $device)
    {
        return $this->success(new DeviceResource($device), 'Détails de l\'appareil');
    }

    #[OA\Put(
        path: '/api/devices/{device}',
        tags: ['Devices'],
        summary: 'Mettre à jour un appareil',
        operationId: 'devicesUpdate',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'device', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'iPhone de Lucas'),
                new OA\Property(property: 'status', type: 'string', enum: ['paired', 'unpaired', 'locked', 'lost'], example: 'paired'),
                new OA\Property(property: 'is_online', type: 'boolean', example: true),
                new OA\Property(property: 'battery_level', type: 'integer', example: 75),
            ]
        )
    )]
    #[OA\Response(
        response: 200,
        description: 'Appareil mis à jour',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Appareil mis à jour'),
                new OA\Property(property: 'data', ref: '#/components/schemas/Device'),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    #[OA\Response(response: 404, ref: '#/components/responses/NotFound')]
    public function update(UpdateDeviceRequest $request, Device $device)
    {
        $device->update($request->validated());
        return $this->success(new DeviceResource($device->fresh()), 'Appareil mis à jour');
    }

    #[OA\Delete(
        path: '/api/devices/{device}',
        tags: ['Devices'],
        summary: 'Supprimer un appareil',
        operationId: 'devicesDestroy',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'device', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, ref: '#/components/responses/Success')]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    #[OA\Response(response: 404, ref: '#/components/responses/NotFound')]
    public function destroy(Device $device)
    {
        $device->delete();
        return $this->success(null, 'Appareil supprimé');
    }
}
