<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreScreenTimeRuleRequest;
use App\Http\Resources\ScreenTimeRuleResource;
use App\Http\Traits\ApiResponse;
use App\Models\ScreenTimeRule;
use Illuminate\Http\Request;

class ScreenTimeRuleController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = ScreenTimeRule::query();

        if ($childId = $request->get('child_id')) {
            $query->where('child_id', $childId);
        }

        $rules = $query->paginate($request->get('per_page', 15));

        return $this->paginated($rules, 'Liste des règles de temps d\'écran');
    }

    public function store(StoreScreenTimeRuleRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = $request->user()->id;

        $rule = ScreenTimeRule::create($data);

        return $this->success(new ScreenTimeRuleResource($rule), 'Règle créée', 201);
    }

    public function show(ScreenTimeRule $screenTimeRule)
    {
        return $this->success(new ScreenTimeRuleResource($screenTimeRule), 'Détails de la règle');
    }

    public function update(Request $request, ScreenTimeRule $screenTimeRule)
    {
        $screenTimeRule->update($request->validate([
            'type' => ['sometimes', 'string', 'in:daily_quota,schedule,bedtime,homework,break'],
            'duration_minutes' => ['sometimes', 'nullable', 'integer', 'min:1'],
            'day_of_week' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:6'],
            'start_time' => ['sometimes', 'nullable', 'date_format:H:i'],
            'end_time' => ['sometimes', 'nullable', 'date_format:H:i'],
            'status' => ['sometimes', 'in:active,inactive'],
        ]));

        return $this->success(new ScreenTimeRuleResource($screenTimeRule), 'Règle mise à jour');
    }

    public function destroy(ScreenTimeRule $screenTimeRule)
    {
        $screenTimeRule->delete();
        return $this->success(null, 'Règle supprimée');
    }
}
