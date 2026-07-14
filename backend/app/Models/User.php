<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name', 'email', 'password', 'phone', 'avatar', 'locale', 'timezone',
        'two_factor_secret', 'two_factor_recovery_codes', 'two_factor_confirmed_at',
        'last_login_at', 'status'
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
        return $this->belongsToMany(Family::class)->withPivot('role_id', 'invited_by', 'joined_at')->withTimestamps();
    }
}
