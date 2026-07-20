<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Device extends Model
{
    use SoftDeletes;

    protected $fillable = ['child_id', 'name', 'type', 'os', 'os_version', 'app_version', 'pairing_code', 'pairing_code_expires_at', 'paired_at', 'status', 'last_seen_at', 'is_online', 'battery_level', 'device_token', 'permissions_accordees', 'derniere_synchronisation'];

    protected $casts = [
        'pairing_code_expires_at' => 'datetime',
        'paired_at' => 'datetime',
        'last_seen_at' => 'datetime',
        'derniere_synchronisation' => 'datetime',
        'is_online' => 'boolean',
        'permissions_accordees' => 'array',
    ];

    public function child() {
        return $this->belongsTo(Child::class);
    }

    public function installedApps() {
        return $this->belongsToMany(Application::class, 'device_installed_apps')
                    ->withPivot('installed_at', 'version')
                    ->withTimestamps();
    }

    public function usageSessions() {
        return $this->hasMany(UsageSession::class);
    }

    public function appUsageSummaries() {
        return $this->hasMany(AppUsageSummary::class);
    }

    public function locations() {
        return $this->hasMany(Location::class);
    }
}
