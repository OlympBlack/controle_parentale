<?php

namespace App\Notifications;

use App\Enums\UserRole;
use App\Models\Family;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FamilyInvitationNotification extends Notification
{
    use Queueable;

    public function __construct(
        private readonly Family $family,
        private readonly User   $invitedBy,
        private readonly UserRole|string $role,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $roleEnum = $this->role instanceof UserRole
            ? $this->role
            : UserRole::tryFrom((string) $this->role);

        return (new MailMessage)
            ->subject("Invitation à rejoindre la famille « {$this->family->name} » sur Safekid")
            ->view('emails.family-invitation', [
                'recipientName'   => $notifiable->name,
                'familyName'      => $this->family->name,
                'invitedByName'   => $this->invitedBy->name,
                'roleLabel'       => $roleEnum?->label() ?? $this->role,
                'roleDescription' => $roleEnum?->description() ?? '',
                'dashboardUrl'    => rtrim(config('app.frontend_url', config('app.url')), '/') . '/dashboard',
            ]);
    }
}
