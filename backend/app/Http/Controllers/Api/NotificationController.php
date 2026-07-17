<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\NotificationResource;
use App\Http\Traits\ApiResponse;
use App\Models\Notification;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class NotificationController extends Controller
{
    use ApiResponse;

    #[OA\Get(
        path: '/api/notifications',
        tags: ['Notifications'],
        summary: 'Liste des notifications',
        description: 'Retourne les notifications de l\'utilisateur authentifié (paginées)',
        operationId: 'notificationsIndex',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'page', in: 'query', schema: new OA\Schema(type: 'integer', default: 1))]
    #[OA\Response(
        response: 200,
        description: 'Liste paginée des notifications',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Liste des notifications'),
                new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Notification')),
                new OA\Property(property: 'meta', type: 'object'),
                new OA\Property(property: 'links', type: 'object'),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    public function index(Request $request)
    {
        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->paginate(20);

        return $this->paginated($notifications, 'Liste des notifications');
    }

    #[OA\Get(
        path: '/api/notifications/{notification}',
        tags: ['Notifications'],
        summary: 'Détails d\'une notification',
        operationId: 'notificationsShow',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'notification', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(
        response: 200,
        description: 'Détails de la notification',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Détails de la notification'),
                new OA\Property(property: 'data', ref: '#/components/schemas/Notification'),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    #[OA\Response(response: 404, ref: '#/components/responses/NotFound')]
    public function show(Notification $notification)
    {
        return $this->success(new NotificationResource($notification), 'Détails de la notification');
    }

    #[OA\Patch(
        path: '/api/notifications/{notification}/read',
        tags: ['Notifications'],
        summary: 'Marquer une notification comme lue',
        operationId: 'notificationsMarkAsRead',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'notification', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(
        response: 200,
        description: 'Notification marquée comme lue',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean', example: true),
                new OA\Property(property: 'message', type: 'string', example: 'Notification marquée comme lue'),
                new OA\Property(property: 'data', ref: '#/components/schemas/Notification'),
            ]
        )
    )]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    #[OA\Response(response: 404, ref: '#/components/responses/NotFound')]
    public function markAsRead(Notification $notification)
    {
        if ($notification->read_at === null) {
            $notification->update(['read_at' => now()]);
        }

        return $this->success(new NotificationResource($notification), 'Notification marquée comme lue');
    }

    #[OA\Post(
        path: '/api/notifications/mark-all-read',
        tags: ['Notifications'],
        summary: 'Marquer toutes les notifications comme lues',
        operationId: 'notificationsMarkAllAsRead',
        security: [['sanctum' => []]]
    )]
    #[OA\Response(response: 200, ref: '#/components/responses/Success')]
    #[OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    public function markAllAsRead(Request $request)
    {
        $request->user()
            ->notifications()
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return $this->success(null, 'Toutes les notifications marquées comme lues');
    }
}
