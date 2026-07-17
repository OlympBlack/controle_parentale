<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreAppRuleRequest;
use App\Http\Resources\AppRuleResource;
use App\Http\Traits\ApiResponse;
use App\Models\AppRule;
use Illuminate\Http\Request;

class AppRuleController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = AppRule::query()->with('application');

        if ($childId = $request->get('child_id')) {
            $query->where('child_id', $childId);
        }

        $rules = $query->paginate(15);

        return $this->paginated($rules, 'Liste des règles d\'applications');
    }

    public function store(StoreAppRuleRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = $request->user()->id;

        $rule = AppRule::create($data);

        return $this->success(new AppRuleResource($rule->load('application')), 'Règle créée', 201);
    }

    public function show(AppRule $appRule)
    {
        return $this->success(new AppRuleResource($appRule->load('application')), 'Détails de la règle');
    }

    public function update(Request $request, AppRule $appRule)
    {
        $appRule->update($request->validate([
            'status' => ['sometimes', 'in:allowed,blocked,limited'],
            'daily_quota_minutes' => ['sometimes', 'nullable', 'integer', 'min:0'],
        ]));

        return $this->success(new AppRuleResource($appRule->load('application')), 'Règle mise à jour');
    }

    public function destroy(AppRule $appRule)
    {
        $appRule->delete();
        return $this->success(null, 'Règle supprimée');
    }
}
