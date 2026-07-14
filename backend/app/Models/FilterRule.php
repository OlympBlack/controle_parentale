<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FilterRule extends Model
{
    use SoftDeletes;

    protected $fillable = ['child_id', 'type', 'value', 'status', 'version', 'created_by'];

    public function child() {
        return $this->belongsTo(Child::class);
    }

    public function createdBy() {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function categories() {
        return $this->belongsToMany(ContentCategory::class, 'filter_rule_content_category');
    }

    public function histories() {
        return $this->hasMany(FilterRuleHistory::class);
    }
}
