<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AppRule extends Model
{
    use SoftDeletes;

    protected $fillable = ['child_id', 'application_id', 'status', 'daily_quota_minutes', 'created_by'];

    public function child() {
        return $this->belongsTo(Child::class);
    }

    public function application() {
        return $this->belongsTo(Application::class);
    }

    public function createdBy() {
        return $this->belongsTo(User::class, 'created_by');
    }
}
