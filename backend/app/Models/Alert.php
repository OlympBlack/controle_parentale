<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    protected $fillable = ['child_id', 'device_id', 'type', 'severity', 'message', 'status', 'triggered_at'];

    protected $casts = ['triggered_at' => 'datetime'];

    public function child() {
        return $this->belongsTo(Child::class);
    }

    public function device() {
        return $this->belongsTo(Device::class);
    }
}
