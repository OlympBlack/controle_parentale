<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes, HasApiTokens;

    protected $fillable = [
        'name', 'email', 'password', 'phone', 'avatar', 'locale', 'timezone',
        'last_login_at',
    ];

    protected $guarded = [
        'id', 'status', 'email_verified_at',
        'two_factor_secret', 'two_factor_recovery_codes', 'two_factor_confirmed_at',
    ];

    protected $hidden = [
        'password', 'remember_token', 'two_factor_secret', 'two_factor_recovery_codes'
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'two_factor_confirmed_at' => 'datetime',
        'last_login_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function ownedFamilies() {
        return $this->hasMany(Family::class, 'owner_id');
    }

    public function families() {
        return $this->belongsToMany(Family::class)
            ->withPivot('role', 'invited_by', 'joined_at')
            ->withTimestamps()
            ->withCasts(['role' => UserRole::class]);
    }
}
