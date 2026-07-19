<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreFilterRuleRequest;
use App\Http\Resources\FilterRuleResource;
use App\Http\Traits\ApiResponse;
use App\Models\FilterRule;
use Illuminate\Http\Request;

class FilterRuleController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = FilterRule::query()->with('categories');

        if ($childId = $request->get('child_id')) {
            $query->where('child_id', $childId);
        }

        $rules = $query->paginate($request->get('per_page', 15));

        return $this->paginated($rules, 'Liste des règles de filtrage');
    }

    public function store(StoreFilterRuleRequest $request)
    {
        $rule = FilterRule::create($request->safe()->except('categories'));
        $rule->created_by = $request->user()->id;
        $rule->save();

        if ($request->has('categories')) {
            $rule->categories()->sync($request->categories);
        }

        return $this->success(new FilterRuleResource($rule->load('categories')), 'Règle créée', 201);
    }

    public function show(FilterRule $filterRule)
    {
        return $this->success(new FilterRuleResource($filterRule->load('categories')), 'Détails de la règle');
    }

    public function update(Request $request, FilterRule $filterRule)
    {
        $filterRule->update($request->validate([
            'type' => ['sometimes', 'string', 'in:domain,keyword,category,app'],
            'value' => ['sometimes', 'string', 'max:255'],
            'status' => ['sometimes', 'in:active,paused,disabled'],
        ]));

        if ($request->has('categories')) {
            $filterRule->categories()->sync($request->categories);
        }

        return $this->success(new FilterRuleResource($filterRule->load('categories')), 'Règle mise à jour');
    }

    public function destroy(FilterRule $filterRule)
    {
        $filterRule->delete();
        return $this->success(null, 'Règle supprimée');
    }
}
