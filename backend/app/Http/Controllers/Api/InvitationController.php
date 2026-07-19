<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Traits\ApiResponse;
use App\Models\FamilyInvitation;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class InvitationController extends Controller
{
    use ApiResponse;

    #[OA\Get(
        path: '/api/invitations/{token}',
        tags: ['Invitations'],
        summary: "Consulter les détails d'une invitation",
        operationId: 'invitationsShow',
    )]
    #[OA\Parameter(name: 'token', in: 'path', required: true, schema: new OA\Schema(type: 'string'))]
    #[OA\Response(response: 200, description: "Détails de l'invitation")]
    #[OA\Response(response: 404, ref: '#/components/responses/NotFound')]
    public function show(string $token): JsonResponse
    {
        $invitation = FamilyInvitation::with('family', 'inviter')
            ->where('token', $token)
            ->first();

        if (!$invitation) {
            return $this->error('Invitation introuvable ou invalide.', 404);
        }

        if ($invitation->isExpired()) {
            return $this->error('Cette invitation a expiré.', 410);
        }

        if ($invitation->isAccepted()) {
            return $this->error('Cette invitation a déjà été acceptée.', 409);
        }

        return $this->success([
            'token'       => $invitation->token,
            'family_name' => $invitation->family->name,
            'invited_by'  => $invitation->inviter->name,
            'role'        => $invitation->role->value,
            'role_label'  => $invitation->role->label(),
            'expires_at'  => $invitation->expires_at->toIso8601String(),
            'email'       => $invitation->email,
        ], "Détails de l'invitation");
    }

    #[OA\Post(
        path: '/api/invitations/{token}/accept',
        tags: ['Invitations'],
        summary: "Accepter une invitation (authentification requise)",
        operationId: 'invitationsAccept',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'token', in: 'path', required: true, schema: new OA\Schema(type: 'string'))]
    #[OA\Response(response: 200, description: 'Invitation acceptée')]
    #[OA\Response(response: 409, description: 'Déjà membre ou invitation expirée')]
    public function accept(Request $request, string $token): JsonResponse
    {
        $invitation = FamilyInvitation::with('family')
            ->where('token', $token)
            ->first();

        if (!$invitation) {
            return $this->error('Invitation introuvable ou invalide.', 404);
        }

        if ($invitation->isExpired()) {
            return $this->error('Cette invitation a expiré.', 410);
        }

        if ($invitation->isAccepted()) {
            return $this->error('Cette invitation a déjà été acceptée.', 409);
        }

        $family = $invitation->family;
        $user   = $request->user();

        if ($family->users()->where('user_id', $user->id)->exists()) {
            return $this->error('Vous êtes déjà membre de cette famille.', 409);
        }

        $family->users()->attach($user->id, [
            'role'       => $invitation->role->value,
            'invited_by' => $invitation->invited_by,
            'joined_at'  => now(),
        ]);

        $invitation->update(['accepted_at' => now()]);

        return $this->success([
            'family_id'   => $family->id,
            'family_name' => $family->name,
            'role'        => $invitation->role->value,
        ], 'Invitation acceptée. Bienvenue dans la famille !');
    }
}
