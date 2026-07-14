<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ScreenTimeRule extends Model
{
    use SoftDeletes;

    protected $fillable = ['child_id', 'type', 'duration_minutes', 'day_of_week', 'start_time', 'end_time', 'status', 'created_by'];

    public function child() {
        return $this->belongsTo(Child::class);
    }

    public function createdBy() {
        return $this->belongsTo(User::class, 'created_by');
    }
}
