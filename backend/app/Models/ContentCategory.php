<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContentCategory extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'is_sensitive', 'parent_category_id'];

    protected $casts = [
        'is_sensitive' => 'boolean',
    ];

    public function parent() {
        return $this->belongsTo(ContentCategory::class, 'parent_category_id');
    }

    public function children() {
        return $this->hasMany(ContentCategory::class, 'parent_category_id');
    }
}
