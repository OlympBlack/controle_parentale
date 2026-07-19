<?php

namespace App\Notifications;

use App\Models\Family;
use App\Models\FamilyInvitation;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FamilyInvitationNewUserNotification extends Notification
{
    use Queueable;

    public function __construct(
        private readonly FamilyInvitation $invitation,
        private readonly User             $invitedBy,
        private readonly Family           $family,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $role           = $this->invitation->role;
        $registerUrl    = rtrim(config('app.frontend_url', config('app.url')), '/')
            . '/register?invitation=' . $this->invitation->token;

        return (new MailMessage)
            ->subject("Vous êtes invité à rejoindre « {$this->family->name} » sur Safekid")
            ->view('emails.family-invitation', [
                'recipientName'   => null,
                'familyName'      => $this->family->name,
                'invitedByName'   => $this->invitedBy->name,
                'roleLabel'       => $role->label(),
                'roleDescription' => $role->description(),
                'dashboardUrl'    => $registerUrl,
                'isNewUser'       => true,
            ]);
    }
}
