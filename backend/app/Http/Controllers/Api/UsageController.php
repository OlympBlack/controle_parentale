<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreDeviceLocationRequest;
use App\Http\Requests\StoreDeviceUsageRequest;
use App\Http\Resources\AppUsageSummaryResource;
use App\Http\Resources\LocationResource;
use App\Http\Resources\UsageSessionResource;
use App\Http\Traits\ApiResponse;
use App\Models\AppUsageSummary;
use App\Models\Child;
use App\Models\Device;
use App\Models\Location;
use App\Models\UsageSession;
use Illuminate\Http\Request;

class UsageController extends Controller
{
    use ApiResponse;

    // ─── Device usage batch (from child app) ──────────────────────────────────

    public function storeUsage(StoreDeviceUsageRequest $request, Device $device)
    {
        $sessions = $request->validated()['sessions'];
        $created = [];

        foreach ($sessions as $session) {
            $created[] = UsageSession::create([
                'device_id' => $device->id,
                'package_name' => $session['package_name'],
                'nom_application' => $session['nom_application'] ?? null,
                'duree_secondes' => $session['duree_secondes'],
                'date_utilisation' => $session['date_utilisation'],
            ]);
        }

        // Recalculate daily summaries for each unique date
        $dates = collect($sessions)->pluck('date_utilisation')->unique();
        foreach ($dates as $date) {
            $this->updateDailySummary($device->id, $date);
        }

        $device->update(['derniere_synchronisation' => now()]);

        return $this->success(
            UsageSessionResource::collection(collect($created)),
            'Données d\'usage reçues',
            201
        );
    }

    // ─── Device location (from child app) ─────────────────────────────────────

    public function storeLocation(StoreDeviceLocationRequest $request, Device $device)
    {
        $location = Location::create([
            'child_id' => $device->child_id,
            'device_id' => $device->id,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'accuracy_meters' => $request->precision_metres,
            'recorded_at' => $request->captured_at,
        ]);

        return $this->success(new LocationResource($location), 'Position enregistrée', 201);
    }

    // ─── Device permissions update ────────────────────────────────────────────

    public function updatePermissions(Request $request, Device $device)
    {
        $validated = $request->validate([
            'permissions' => ['required', 'array'],
            'permissions.usage_access' => ['boolean'],
            'permissions.location' => ['boolean'],
            'permissions.notifications' => ['boolean'],
        ]);

        $current = $device->permissions_accordees ?? [];
        $merged = array_merge($current, $validated['permissions']);
        $device->update(['permissions_accordees' => $merged]);

        return $this->success(
            new \App\Http\Resources\DeviceResource($device->fresh()),
            'Permissions mises à jour'
        );
    }

    // ─── Child usage (for parent dashboard) ───────────────────────────────────

    public function childUsage(Request $request, Child $child)
    {
        $query = UsageSession::query()
            ->whereIn('device_id', $child->devices()->pluck('id'));

        if ($from = $request->get('from')) {
            $query->where('date_utilisation', '>=', $from);
        }
        if ($to = $request->get('to')) {
            $query->where('date_utilisation', '<=', $to);
        }

        $sessions = $query->orderBy('date_utilisation', 'desc')
            ->orderBy('duree_secondes', 'desc')
            ->get();

        return $this->success(
            UsageSessionResource::collection($sessions),
            'Données d\'usage de l\'enfant'
        );
    }

    public function childUsageToday(Request $request, Child $child)
    {
        $today = now()->toDateString();
        $deviceIds = $child->devices()->pluck('id');

        $sessions = UsageSession::whereIn('device_id', $deviceIds)
            ->where('date_utilisation', $today)
            ->orderBy('duree_secondes', 'desc')
            ->get();

        $summary = AppUsageSummary::whereIn('device_id', $deviceIds)
            ->where('date', $today)
            ->first();

        return $this->success([
            'sessions' => UsageSessionResource::collection($sessions),
            'resume' => $summary ? new AppUsageSummaryResource($summary) : [
                'date' => $today,
                'temps_ecran_total_secondes' => $sessions->sum('duree_secondes'),
                'nombre_apps_utilisees' => $sessions->count(),
            ],
        ], 'Résumé du jour');
    }

    // ─── Child location (for parent dashboard) ────────────────────────────────

    public function childLocationLast(Request $request, Child $child)
    {
        $location = Location::where('child_id', $child->id)
            ->latest('recorded_at')
            ->first();

        if (!$location) {
            return $this->error('Aucune localisation trouvée', 404);
        }

        return $this->success(new LocationResource($location), 'Dernière localisation');
    }

    public function childLocationHistory(Request $request, Child $child)
    {
        $query = Location::where('child_id', $child->id);

        if ($from = $request->get('from')) {
            $query->where('recorded_at', '>=', $from);
        }
        if ($to = $request->get('to')) {
            $query->where('recorded_at', '<=', $to);
        }

        $locations = $query->orderBy('recorded_at', 'desc')
            ->paginate($request->get('per_page', 50));

        return $this->paginated($locations, 'Historique des positions');
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private function updateDailySummary(int $deviceId, string $date): void
    {
        $sessions = UsageSession::where('device_id', $deviceId)
            ->where('date_utilisation', $date)
            ->get();

        AppUsageSummary::updateOrCreate(
            ['device_id' => $deviceId, 'date' => $date],
            [
                'temps_ecran_total_secondes' => $sessions->sum('duree_secondes'),
                'nombre_apps_utilisees' => $sessions->count(),
            ]
        );
    }
}
