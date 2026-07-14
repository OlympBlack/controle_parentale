<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BehaviorAnomaly extends Model
{
    protected $fillable = ['child_id', 'activity_id', 'type', 'description', 'severity', 'detected_at'];

    protected $casts = ['detected_at' => 'datetime'];

    public function child() {
        return $this->belongsTo(Child::class);
    }

    public function activity() {
        return $this->belongsTo(Activity::class);
    }
}
