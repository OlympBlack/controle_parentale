<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = ['child_id', 'period_type', 'period_start', 'period_end', 'digital_health_score', 'statistics', 'file_path', 'generated_at'];

    protected $casts = [
        'period_start' => 'date',
        'period_end' => 'date',
        'statistics' => 'array',
        'generated_at' => 'datetime',
    ];

    public function child() {
        return $this->belongsTo(Child::class);
    }
}
