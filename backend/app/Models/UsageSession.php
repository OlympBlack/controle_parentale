<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UsageSession extends Model
{
    protected $fillable = [
        'device_id',
        'package_name',
        'nom_application',
        'duree_secondes',
        'date_utilisation',
        'categorie',
    ];

    protected $casts = [
        'date_utilisation' => 'date',
    ];

    public function device()
    {
        return $this->belongsTo(Device::class);
    }
}
