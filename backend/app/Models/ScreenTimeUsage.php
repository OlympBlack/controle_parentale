<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScreenTimeUsage extends Model
{
    protected $fillable = ['child_id', 'device_id', 'date', 'minutes_used'];

    protected $casts = ['date' => 'date'];

    public function child() {
        return $this->belongsTo(Child::class);
    }

    public function device() {
        return $this->belongsTo(Device::class);
    }
}
