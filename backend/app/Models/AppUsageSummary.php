<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppUsageSummary extends Model
{
    protected $fillable = [
        'device_id',
        'date',
        'temps_ecran_total_secondes',
        'nombre_apps_utilisees',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function device()
    {
        return $this->belongsTo(Device::class);
    }
}
