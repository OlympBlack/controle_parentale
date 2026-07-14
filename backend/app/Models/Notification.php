<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = ['user_id', 'alert_id', 'channel', 'title', 'body', 'status', 'sent_at', 'read_at'];

    protected $casts = ['sent_at' => 'datetime', 'read_at' => 'datetime'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function alert() {
        return $this->belongsTo(Alert::class);
    }
}
