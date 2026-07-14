<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScreenTimeBonus extends Model
{
    protected $fillable = ['child_id', 'minutes', 'reason', 'granted_by', 'expires_at'];

    protected $casts = ['expires_at' => 'datetime'];

    public function child() {
        return $this->belongsTo(Child::class);
    }

    public function grantedBy() {
        return $this->belongsTo(User::class, 'granted_by');
    }
}
