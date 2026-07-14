<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FilterRuleHistory extends Model
{
    protected $fillable = ['filter_rule_id', 'previous_value', 'changed_by', 'changed_at'];

    protected $casts = [
        'previous_value' => 'array',
        'changed_at' => 'datetime',
    ];

    public function rule() {
        return $this->belongsTo(FilterRule::class, 'filter_rule_id');
    }

    public function changedBy() {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
