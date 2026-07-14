<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $fillable = ['child_id', 'device_id', 'type', 'target', 'content_category_id', 'duration_seconds', 'started_at', 'ended_at', 'metadata'];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function child() {
        return $this->belongsTo(Child::class);
    }

    public function device() {
        return $this->belongsTo(Device::class);
    }

    public function category() {
        return $this->belongsTo(ContentCategory::class, 'content_category_id');
    }
}
