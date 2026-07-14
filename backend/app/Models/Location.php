<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = ['child_id', 'device_id', 'latitude', 'longitude', 'accuracy_meters', 'recorded_at'];

    protected $casts = ['recorded_at' => 'datetime'];

    public function child() {
        return $this->belongsTo(Child::class);
    }

    public function device() {
        return $this->belongsTo(Device::class);
    }
}
