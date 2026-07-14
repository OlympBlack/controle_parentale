<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Child extends Model
{
    use SoftDeletes;

    protected $fillable = ['family_id', 'first_name', 'last_name', 'birth_date', 'avatar', 'maturity_level', 'pin_code', 'status', 'digital_health_score'];

    protected $casts = [
        'birth_date' => 'date',
    ];

    public function family() {
        return $this->belongsTo(Family::class);
    }

    public function devices() {
        return $this->hasMany(Device::class);
    }

    public function filterRules() {
        return $this->hasMany(FilterRule::class);
    }

    public function appRules() {
        return $this->hasMany(AppRule::class);
    }

    public function screenTimeRules() {
        return $this->hasMany(ScreenTimeRule::class);
    }

    public function activities() {
        return $this->hasMany(Activity::class);
    }
}
