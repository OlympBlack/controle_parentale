<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Family extends Model
{
    protected $fillable = ['name', 'owner_id', 'plan'];

    public function owner() {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function users() {
        return $this->belongsToMany(User::class)
            ->withPivot('role', 'invited_by', 'joined_at')
            ->withTimestamps()
            ->withCasts(['role' => \App\Enums\UserRole::class]);
    }

    public function children() {
        return $this->hasMany(Child::class);
    }
}
