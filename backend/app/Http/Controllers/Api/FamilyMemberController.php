<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Traits\ApiResponse;
use App\Models\Family;
use App\Models\User;
use App\Models\FamilyInvitation;
use App\Notifications\FamilyInvitationNewUserNotification;
use App\Notifications\FamilyInvitationNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use OpenApi\Attributes as OA;

class FamilyMemberController extends Controller
{
    use ApiResponse;

    #[OA\Get(
        path: '/api/families/{family}/members',
        tags: ['Family Members'],
        summary: 'Lister les membres d\'une famille',
        operationId: 'familyMembersIndex',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'family', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, description: 'Liste des membres')]
    #[OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    public function index(Request $request, Family $family): JsonResponse
    {
        if (!$this->isMember($family, $request->user())) {
            return $this->error('Accès refusé à cette famille', 403);
        }

        $members = $family->users()
            ->withPivot('role', 'joined_at')
            ->get()
            ->map(fn(User $u) => $this->formatMember($u, $family));

        return $this->success($members, 'Membres de la famille');
    }

    #[OA\Post(
        path: '/api/families/{family}/members',
        tags: ['Family Members'],
        summary: 'Inviter un membre dans la famille',
        operationId: 'familyMembersStore',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'family', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['email', 'role'],
            properties: [
                new OA\Property(property: 'email', type: 'string', format: 'email', example: 'marie@example.com'),
                new OA\Property(property: 'role', type: 'string', enum: ['admin', 'gestionnaire', 'observateur']),
            ]
        )
    )]
    #[OA\Response(response: 201, description: 'Membre ajouté')]
    #[OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    #[OA\Response(response: 422, ref: '#/components/responses/ValidationError')]
    public function store(Request $request, Family $family): JsonResponse
    {
        if (!$this->isAdmin($family, $request->user())) {
            return $this->error('Seul un administrateur peut inviter des membres', 403);
        }

        $data = $request->validate([
            'email' => ['required', 'email'],
            'role'  => ['required', Rule::in(array_column(UserRole::cases(), 'value'))],
        ]);

        $email   = mb_strtolower(trim($data['email']));
        $invitee = User::where('email', $email)->first();

        if ($invitee) {
            if ($invitee->id === $request->user()->id) {
                return $this->error('Vous êtes déjà membre de cette famille.', 422);
            }
            if ($family->users()->where('user_id', $invitee->id)->exists()) {
                return $this->error('Cet utilisateur est déjà membre de cette famille.', 422);
            }

            $family->users()->attach($invitee->id, [
                'role'       => $data['role'],
                'invited_by' => $request->user()->id,
                'joined_at'  => now(),
            ]);

            $invitee->notify(new FamilyInvitationNotification(
                family:    $family,
                invitedBy: $request->user(),
                role:      $data['role'],
            ));

            $newMember = $family->users()
                ->withPivot('role', 'joined_at')
                ->where('users.id', $invitee->id)
                ->first();

            return $this->success($this->formatMember($newMember, $family), 'Membre ajouté', 201);
        }

        // No account yet — create an invitation
        FamilyInvitation::where('family_id', $family->id)
            ->where('email', $email)
            ->whereNull('accepted_at')
            ->delete();

        $invitation = FamilyInvitation::create([
            'family_id'  => $family->id,
            'invited_by' => $request->user()->id,
            'email'      => $email,
            'role'       => $data['role'],
            'token'      => FamilyInvitation::generateToken(),
            'expires_at' => now()->addDays(7),
        ]);

        Notification::route('mail', $email)
            ->notify(new FamilyInvitationNewUserNotification($invitation, $request->user(), $family));

        return $this->success([
            'pending'    => true,
            'email'      => $email,
            'role'       => $data['role'],
            'expires_at' => $invitation->expires_at->toIso8601String(),
        ], 'Invitation envoyée par e-mail.', 201);
    }

    #[OA\Patch(
        path: '/api/families/{family}/members/{member}',
        tags: ['Family Members'],
        summary: 'Modifier le rôle d\'un membre',
        operationId: 'familyMembersUpdate',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'family', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'member', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['role'],
            properties: [
                new OA\Property(property: 'role', type: 'string', enum: ['admin', 'gestionnaire', 'observateur']),
            ]
        )
    )]
    #[OA\Response(response: 200, description: 'Rôle mis à jour')]
    #[OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    public function update(Request $request, Family $family, User $member): JsonResponse
    {
        if (!$this->isAdmin($family, $request->user())) {
            return $this->error('Seul un administrateur peut modifier les rôles', 403);
        }

        if (!$family->users()->where('user_id', $member->id)->exists()) {
            return $this->error('Cet utilisateur n\'est pas membre de cette famille', 404);
        }

        if ($member->id === $family->owner_id) {
            return $this->error('Impossible de modifier le rôle du propriétaire', 422);
        }

        $data = $request->validate([
            'role' => ['required', Rule::in(array_column(UserRole::cases(), 'value'))],
        ]);

        $family->users()->updateExistingPivot($member->id, ['role' => $data['role']]);

        $updated = $family->users()
            ->withPivot('role', 'joined_at')
            ->where('users.id', $member->id)
            ->first();

        return $this->success($this->formatMember($updated, $family), 'Rôle mis à jour');
    }

    #[OA\Delete(
        path: '/api/families/{family}/members/{member}',
        tags: ['Family Members'],
        summary: 'Retirer un membre de la famille',
        operationId: 'familyMembersDestroy',
        security: [['sanctum' => []]]
    )]
    #[OA\Parameter(name: 'family', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'member', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: 200, ref: '#/components/responses/Success')]
    #[OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    public function destroy(Request $request, Family $family, User $member): JsonResponse
    {
        if (!$this->isAdmin($family, $request->user())) {
            return $this->error('Seul un administrateur peut retirer des membres', 403);
        }

        if (!$family->users()->where('user_id', $member->id)->exists()) {
            return $this->error('Cet utilisateur n\'est pas membre de cette famille', 404);
        }

        if ($member->id === $family->owner_id) {
            return $this->error('Impossible de retirer le propriétaire de la famille', 422);
        }

        $family->users()->detach($member->id);

        return $this->success(null, 'Membre retiré');
    }

    public function pendingInvitations(Request $request, Family $family): JsonResponse
    {
        if (!$this->isAdmin($family, $request->user())) {
            return $this->error('Accès refusé', 403);
        }

        $invitations = FamilyInvitation::with('inviter')
            ->where('family_id', $family->id)
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->get()
            ->map(fn($inv) => [
                'id'         => $inv->id,
                'email'      => $inv->email,
                'role'       => $inv->role->value,
                'role_label' => $inv->role->label(),
                'invited_by' => $inv->inviter->name,
                'expires_at' => $inv->expires_at->toIso8601String(),
            ]);

        return $this->success($invitations, 'Invitations en attente');
    }

    public function cancelInvitation(Request $request, Family $family, FamilyInvitation $invitation): JsonResponse
    {
        if (!$this->isAdmin($family, $request->user())) {
            return $this->error('Accès refusé', 403);
        }

        if ($invitation->family_id !== $family->id) {
            return $this->error('Invitation introuvable.', 404);
        }

        $invitation->delete();

        return $this->success(null, 'Invitation annulée');
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private function isMember(Family $family, User $user): bool
    {
        return $family->users()->where('user_id', $user->id)->exists();
    }

    private function isAdmin(Family $family, User $user): bool
    {
        $member = $family->users()->where('user_id', $user->id)->first();
        $role   = $member?->pivot?->role;

        return $role instanceof UserRole
            ? $role === UserRole::Admin
            : $role === UserRole::Admin->value;
    }

    private function formatMember(User $user, Family $family): array
    {
        $raw   = $user->pivot?->role;
        $role  = $raw instanceof UserRole ? $raw : UserRole::tryFrom((string) $raw);

        return [
            'id'         => $user->id,
            'name'       => $user->name,
            'email'      => $user->email,
            'avatar'     => $user->avatar,
            'role'       => $role?->value ?? $raw,
            'role_label' => $role?->label() ?? $raw,
            'joined_at'  => $user->pivot?->joined_at
                ? Carbon::parse($user->pivot->joined_at)->toIso8601String()
                : null,
            'is_owner'   => $user->id === $family->owner_id,
        ];
    }
}
