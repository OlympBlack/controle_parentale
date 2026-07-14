<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = ['name', 'package_name', 'platform', 'content_category_id', 'icon_url', 'is_system_app'];

    protected $casts = ['is_system_app' => 'boolean'];

    public function category() {
        return $this->belongsTo(ContentCategory::class, 'content_category_id');
    }

    public function devices() {
        return $this->belongsToMany(Device::class, 'device_installed_apps')->withPivot('installed_at', 'version')->withTimestamps();
    }
}
