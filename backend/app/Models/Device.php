<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Device extends Model
{
    use SoftDeletes;

    protected $fillable = ['child_id', 'name', 'type', 'os', 'os_version', 'app_version', 'pairing_code', 'pairing_code_expires_at', 'paired_at', 'status', 'last_seen_at', 'is_online', 'battery_level'];

    protected $casts = [
        'pairing_code_expires_at' => 'datetime',
        'paired_at' => 'datetime',
        'last_seen_at' => 'datetime',
        'is_online' => 'boolean',
    ];

    public function child() {
        return $this->belongsTo(Child::class);
    }

    public function installedApps() {
        return $this->belongsToMany(Application::class, 'device_installed_apps')
                    ->withPivot('installed_at', 'version')
                    ->withTimestamps();
    }
}
