<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FamilyInvitation extends Model
{
    protected $fillable = [
        'family_id', 'invited_by', 'email', 'role', 'token', 'accepted_at', 'expires_at',
    ];

    protected $casts = [
        'role'        => UserRole::class,
        'accepted_at' => 'datetime',
        'expires_at'  => 'datetime',
    ];

    public function family(): BelongsTo
    {
        return $this->belongsTo(Family::class);
    }

    public function inviter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by');
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isAccepted(): bool
    {
        return $this->accepted_at !== null;
    }

    public function isPending(): bool
    {
        return !$this->isAccepted() && !$this->isExpired();
    }

    public static function generateToken(): string
    {
        return bin2hex(random_bytes(32));
    }
}
