<?php

namespace Database\Seeders;

use App\Models\AppUsageSummary;
use App\Models\Child;
use App\Models\Device;
use App\Models\Family;
use App\Models\Location;
use App\Models\UsageSession;
use App\Models\User;
use App\Enums\UserRole;
use Illuminate\Database\Seeder;

class SafeKidDemoSeeder extends Seeder
{
    public function run(): void
    {
        // ─── 1. User (parent) ────────────────────────────────────────────────
        $user = User::updateOrCreate(
            ['email' => 'safekid.parent@gmail.com'],
            [
                'name'     => 'Parent Demo',
                'password' => bcrypt('password'),
                'phone'    => '+33612345678',
                'locale'   => 'fr',
                'timezone' => 'Europe/Paris',
                'status'   => 'active',
            ]
        );

        // ─── 2. Family ───────────────────────────────────────────────────────
        $family = Family::updateOrCreate(
            ['name' => 'Famille Demo'],
            ['owner_id' => $user->id, 'plan' => 'premium']
        );

        // Attach user to family as admin
        if (!$family->users()->where('user_id', $user->id)->exists()) {
            $family->users()->attach($user->id, [
                'role'      => UserRole::Admin,
                'joined_at' => now(),
            ]);
        }

        // ─── 3. Children ─────────────────────────────────────────────────────
        $lucas = Child::updateOrCreate(
            ['family_id' => $family->id, 'first_name' => 'Lucas', 'last_name' => 'Dupont'],
            [
                'birth_date'           => '2015-03-12',
                'maturity_level'       => 'preado',
                'pin_code'             => '1234',
                'status'               => 'active',
                'digital_health_score' => 72,
            ]
        );

        $emma = Child::updateOrCreate(
            ['family_id' => $family->id, 'first_name' => 'Emma', 'last_name' => 'Dupont'],
            [
                'birth_date'           => '2018-09-05',
                'maturity_level'       => 'enfant',
                'pin_code'             => '5678',
                'status'               => 'active',
                'digital_health_score' => 85,
            ]
        );

        // ─── 4. Devices ──────────────────────────────────────────────────────
        $lucasPhone = Device::updateOrCreate(
            ['device_token' => 'lucas-phone-token-demo'],
            [
                'child_id'         => $lucas->id,
                'name'             => 'Téléphone de Lucas',
                'type'             => 'mobile',
                'brand'            => 'Samsung',
                'model'            => 'Galaxy A54',
                'os'               => 'android',
                'os_version'       => '14',
                'app_version'      => '1.0.0',
                'status'           => 'active',
                'is_online'        => true,
                'battery_level'    => 78,
                'last_seen_at'     => now()->subMinutes(5),
                'paired_at'        => now()->subDays(30),
                'permissions_accordees' => [
                    'usage_access'  => true,
                    'location'      => true,
                    'notifications' => false,
                ],
                'derniere_synchronisation' => now()->subMinutes(10),
            ]
        );

        $emmaTablet = Device::updateOrCreate(
            ['device_token' => 'emma-tablet-token-demo'],
            [
                'child_id'         => $emma->id,
                'name'             => 'Tablette d\'Emma',
                'type'             => 'tablette',
                'brand'            => 'Samsung',
                'model'            => 'Galaxy Tab A9',
                'os'               => 'android',
                'os_version'       => '13',
                'app_version'      => '1.0.0',
                'status'           => 'active',
                'is_online'        => false,
                'battery_level'    => 45,
                'last_seen_at'     => now()->subHours(2),
                'paired_at'        => now()->subDays(15),
                'permissions_accordees' => [
                    'usage_access'  => true,
                    'location'      => false,
                    'notifications' => true,
                ],
                'derniere_synchronisation' => now()->subHours(2),
            ]
        );

        // ─── 5. Usage Sessions (7 derniers jours pour Lucas) ─────────────────
        $this->seedUsageSessions($lucasPhone->id, 7);

        // Usage pour Emma (3 jours)
        $this->seedUsageSessions($emmaTablet->id, 3);

        // ─── 6. App Usage Summaries ──────────────────────────────────────────
        $this->seedSummaries($lucasPhone->id, 7);
        $this->seedSummaries($emmaTablet->id, 3);

        // ─── 7. Locations ────────────────────────────────────────────────────
        $this->seedLocations($lucas->id, $lucasPhone->id, 20);
        $this->seedLocations($emma->id, $emmaTablet->id, 5);

        $this->command->info('SafeKid demo data seeded successfully!');
        $this->command->line('');
        $this->command->info('Login: safekid.parent@gmail.com / password');
        $this->command->line('Children: Lucas (preado) & Emma (enfant)');
        $this->command->line('Devices: 2 (1 phone, 1 tablet)');
        $this->command->line('Usage sessions: 10 days of data');
        $this->command->line('Locations: 25 position records');
    }

    private function seedUsageSessions(int $deviceId, int $days): void
    {
        $apps = [
            ['package_name' => 'com.whatsapp',         'nom_application' => 'WhatsApp',        'weight' => 3],
            ['package_name' => 'com.instagram.android', 'nom_application' => 'Instagram',       'weight' => 2],
            ['package_name' => 'com.youtube.app',      'nom_application' => 'YouTube',         'weight' => 4],
            ['package_name' => 'com.android.chrome',   'nom_application' => 'Chrome',          'weight' => 2],
            ['package_name' => 'com.spotify.music',    'nom_application' => 'Spotify',         'weight' => 1],
            ['package_name' => 'com.mobile.roblox',    'nom_application' => 'Roblox',          'weight' => 3],
            ['package_name' => 'com.snapchat.android', 'nom_application' => 'Snapchat',        'weight' => 1],
            ['package_name' => 'com.tiktok.android',   'nom_application' => 'TikTok',          'weight' => 2],
            ['package_name' => 'com.google.android.apps.maps', 'nom_application' => 'Maps',    'weight' => 1],
            ['package_name' => 'com.android.settings', 'nom_application' => 'Paramètres',      'weight' => 1],
        ];

        for ($d = 0; $d < $days; $d++) {
            $date = now()->subDays($d)->toDateString();

            // Skip if sessions already exist for this device+date
            if (UsageSession::where('device_id', $deviceId)->where('date_utilisation', $date)->exists()) {
                continue;
            }

            // Pick 3-6 apps per day
            $numApps = rand(3, 6);
            $selectedApps = $this->weightedPick($apps, $numApps);

            foreach ($selectedApps as $app) {
                // Duration: 30s to 2h, weighted by app weight
                $baseSeconds = rand(60, 7200);
                $duree = (int)($baseSeconds * $app['weight'] / 2);

                UsageSession::create([
                    'device_id'         => $deviceId,
                    'package_name'      => $app['package_name'],
                    'nom_application'   => $app['nom_application'],
                    'duree_secondes'    => $duree,
                    'date_utilisation'  => $date,
                ]);
            }
        }
    }

    private function seedSummaries(int $deviceId, int $days): void
    {
        for ($d = 0; $d < $days; $d++) {
            $date = now()->subDays($d)->toDateString();

            $sessions = UsageSession::where('device_id', $deviceId)
                ->where('date_utilisation', $date)
                ->get();

            if ($sessions->isEmpty()) continue;

            AppUsageSummary::updateOrCreate(
                ['device_id' => $deviceId, 'date' => $date],
                [
                    'temps_ecran_total_secondes' => $sessions->sum('duree_secondes'),
                    'nombre_apps_utilisees'      => $sessions->count(),
                ]
            );
        }
    }

    private function seedLocations(int $childId, int $deviceId, int $count): void
    {
        // Paris area as base
        $baseLat = 48.8566;
        $baseLng = 2.3522;

        for ($i = 0; $i < $count; $i++) {
            $offset = $i * 0.005; // ~500m steps
            $lat = $baseLat + (rand(-100, 100) / 1000) + $offset;
            $lng = $baseLng + (rand(-100, 100) / 1000) + $offset;

            Location::create([
                'child_id'        => $childId,
                'device_id'       => $deviceId,
                'latitude'        => $lat,
                'longitude'       => $lng,
                'accuracy_meters' => rand(5, 50),
                'recorded_at'     => now()->subMinutes($i * 15),
            ]);
        }
    }

    private function weightedPick(array $items, int $count): array
    {
        $result = [];
        $pool = $items;
        for ($i = 0; $i < $count && count($pool) > 0; $i++) {
            $totalWeight = array_sum(array_column($pool, 'weight'));
            $random = rand(1, $totalWeight);
            $cumulative = 0;
            $pickedIndex = 0;
            foreach ($pool as $index => $item) {
                $cumulative += $item['weight'];
                if ($random <= $cumulative) {
                    $pickedIndex = $index;
                    break;
                }
            }
            $result[] = $pool[$pickedIndex];
            array_splice($pool, $pickedIndex, 1);
        }
        return $result;
    }
}
