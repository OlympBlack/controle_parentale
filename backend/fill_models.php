<?php

$dir = __DIR__ . '/app/Models/';

$models = [
    'User.php' => '<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        \'name\', \'email\', \'password\', \'phone\', \'avatar\', \'locale\', \'timezone\',
        \'two_factor_secret\', \'two_factor_recovery_codes\', \'two_factor_confirmed_at\',
        \'last_login_at\', \'status\'
    ];

    protected $hidden = [
        \'password\', \'remember_token\', \'two_factor_secret\', \'two_factor_recovery_codes\'
    ];

    protected $casts = [
        \'email_verified_at\' => \'datetime\',
        \'two_factor_confirmed_at\' => \'datetime\',
        \'last_login_at\' => \'datetime\',
        \'password\' => \'hashed\',
    ];

    public function ownedFamilies() {
        return $this->hasMany(Family::class, \'owner_id\');
    }

    public function families() {
        return $this->belongsToMany(Family::class)->withPivot(\'role_id\', \'invited_by\', \'joined_at\')->withTimestamps();
    }
}
',
    'Role.php' => '<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = [\'name\', \'slug\', \'description\'];

    public function users() {
        return $this->belongsToMany(User::class, \'family_user\');
    }
}
',
    'Family.php' => '<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Family extends Model
{
    protected $fillable = [\'name\', \'owner_id\', \'plan\'];

    public function owner() {
        return $this->belongsTo(User::class, \'owner_id\');
    }

    public function users() {
        return $this->belongsToMany(User::class)->withPivot(\'role_id\', \'invited_by\', \'joined_at\')->withTimestamps();
    }

    public function children() {
        return $this->hasMany(Child::class);
    }
}
',
    'Child.php' => '<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Child extends Model
{
    use SoftDeletes;

    protected $fillable = [\'family_id\', \'first_name\', \'last_name\', \'birth_date\', \'avatar\', \'maturity_level\', \'pin_code\', \'status\', \'digital_health_score\'];

    protected $casts = [
        \'birth_date\' => \'date\',
    ];

    public function family() {
        return $this->belongsTo(Family::class);
    }

    public function devices() {
        return $this->hasMany(Device::class);
    }

    public function filterRules() {
        return $this->hasMany(FilterRule::class);
    }

    public function appRules() {
        return $this->hasMany(AppRule::class);
    }

    public function screenTimeRules() {
        return $this->hasMany(ScreenTimeRule::class);
    }

    public function activities() {
        return $this->hasMany(Activity::class);
    }
}
',
    'Device.php' => '<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Device extends Model
{
    use SoftDeletes;

    protected $fillable = [\'child_id\', \'name\', \'type\', \'os\', \'os_version\', \'app_version\', \'pairing_code\', \'pairing_code_expires_at\', \'paired_at\', \'status\', \'last_seen_at\', \'is_online\', \'battery_level\'];

    protected $casts = [
        \'pairing_code_expires_at\' => \'datetime\',
        \'paired_at\' => \'datetime\',
        \'last_seen_at\' => \'datetime\',
        \'is_online\' => \'boolean\',
    ];

    public function child() {
        return $this->belongsTo(Child::class);
    }

    public function installedApps() {
        return $this->belongsToMany(Application::class, \'device_installed_apps\')
                    ->withPivot(\'installed_at\', \'version\')
                    ->withTimestamps();
    }
}
',
    'ContentCategory.php' => '<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContentCategory extends Model
{
    protected $fillable = [\'name\', \'slug\', \'description\', \'is_sensitive\', \'parent_category_id\'];

    protected $casts = [
        \'is_sensitive\' => \'boolean\',
    ];

    public function parent() {
        return $this->belongsTo(ContentCategory::class, \'parent_category_id\');
    }

    public function children() {
        return $this->hasMany(ContentCategory::class, \'parent_category_id\');
    }
}
',
    'Application.php' => '<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = [\'name\', \'package_name\', \'platform\', \'content_category_id\', \'icon_url\', \'is_system_app\'];

    protected $casts = [\'is_system_app\' => \'boolean\'];

    public function category() {
        return $this->belongsTo(ContentCategory::class, \'content_category_id\');
    }

    public function devices() {
        return $this->belongsToMany(Device::class, \'device_installed_apps\')->withPivot(\'installed_at\', \'version\')->withTimestamps();
    }
}
',
    'FilterRule.php' => '<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FilterRule extends Model
{
    use SoftDeletes;

    protected $fillable = [\'child_id\', \'type\', \'value\', \'status\', \'version\', \'created_by\'];

    public function child() {
        return $this->belongsTo(Child::class);
    }

    public function createdBy() {
        return $this->belongsTo(User::class, \'created_by\');
    }

    public function categories() {
        return $this->belongsToMany(ContentCategory::class, \'filter_rule_content_category\');
    }

    public function histories() {
        return $this->hasMany(FilterRuleHistory::class);
    }
}
',
    'FilterRuleHistory.php' => '<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FilterRuleHistory extends Model
{
    protected $fillable = [\'filter_rule_id\', \'previous_value\', \'changed_by\', \'changed_at\'];

    protected $casts = [
        \'previous_value\' => \'array\',
        \'changed_at\' => \'datetime\',
    ];

    public function rule() {
        return $this->belongsTo(FilterRule::class, \'filter_rule_id\');
    }

    public function changedBy() {
        return $this->belongsTo(User::class, \'changed_by\');
    }
}
',
    'AppRule.php' => '<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AppRule extends Model
{
    use SoftDeletes;

    protected $fillable = [\'child_id\', \'application_id\', \'status\', \'daily_quota_minutes\', \'created_by\'];

    public function child() {
        return $this->belongsTo(Child::class);
    }

    public function application() {
        return $this->belongsTo(Application::class);
    }

    public function createdBy() {
        return $this->belongsTo(User::class, \'created_by\');
    }
}
',
    'ScreenTimeRule.php' => '<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ScreenTimeRule extends Model
{
    use SoftDeletes;

    protected $fillable = [\'child_id\', \'type\', \'duration_minutes\', \'day_of_week\', \'start_time\', \'end_time\', \'status\', \'created_by\'];

    public function child() {
        return $this->belongsTo(Child::class);
    }

    public function createdBy() {
        return $this->belongsTo(User::class, \'created_by\');
    }
}
',
    'ScreenTimeUsage.php' => '<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScreenTimeUsage extends Model
{
    protected $fillable = [\'child_id\', \'device_id\', \'date\', \'minutes_used\'];

    protected $casts = [\'date\' => \'date\'];

    public function child() {
        return $this->belongsTo(Child::class);
    }

    public function device() {
        return $this->belongsTo(Device::class);
    }
}
',
    'ScreenTimeBonus.php' => '<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScreenTimeBonus extends Model
{
    protected $fillable = [\'child_id\', \'minutes\', \'reason\', \'granted_by\', \'expires_at\'];

    protected $casts = [\'expires_at\' => \'datetime\'];

    public function child() {
        return $this->belongsTo(Child::class);
    }

    public function grantedBy() {
        return $this->belongsTo(User::class, \'granted_by\');
    }
}
',
    'Activity.php' => '<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $fillable = [\'child_id\', \'device_id\', \'type\', \'target\', \'content_category_id\', \'duration_seconds\', \'started_at\', \'ended_at\', \'metadata\'];

    protected $casts = [
        \'started_at\' => \'datetime\',
        \'ended_at\' => \'datetime\',
        \'metadata\' => \'array\',
    ];

    public function child() {
        return $this->belongsTo(Child::class);
    }

    public function device() {
        return $this->belongsTo(Device::class);
    }

    public function category() {
        return $this->belongsTo(ContentCategory::class, \'content_category_id\');
    }
}
',
    'Location.php' => '<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = [\'child_id\', \'device_id\', \'latitude\', \'longitude\', \'accuracy_meters\', \'recorded_at\'];

    protected $casts = [\'recorded_at\' => \'datetime\'];

    public function child() {
        return $this->belongsTo(Child::class);
    }

    public function device() {
        return $this->belongsTo(Device::class);
    }
}
',
    'BehaviorAnomaly.php' => '<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BehaviorAnomaly extends Model
{
    protected $fillable = [\'child_id\', \'activity_id\', \'type\', \'description\', \'severity\', \'detected_at\'];

    protected $casts = [\'detected_at\' => \'datetime\'];

    public function child() {
        return $this->belongsTo(Child::class);
    }

    public function activity() {
        return $this->belongsTo(Activity::class);
    }
}
',
    'Alert.php' => '<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    protected $fillable = [\'child_id\', \'device_id\', \'type\', \'severity\', \'message\', \'status\', \'triggered_at\'];

    protected $casts = [\'triggered_at\' => \'datetime\'];

    public function child() {
        return $this->belongsTo(Child::class);
    }

    public function device() {
        return $this->belongsTo(Device::class);
    }
}
',
    'Notification.php' => '<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = [\'user_id\', \'alert_id\', \'channel\', \'title\', \'body\', \'status\', \'sent_at\', \'read_at\'];

    protected $casts = [\'sent_at\' => \'datetime\', \'read_at\' => \'datetime\'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function alert() {
        return $this->belongsTo(Alert::class);
    }
}
',
    'Report.php' => '<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [\'child_id\', \'period_type\', \'period_start\', \'period_end\', \'digital_health_score\', \'statistics\', \'file_path\', \'generated_at\'];

    protected $casts = [
        \'period_start\' => \'date\',
        \'period_end\' => \'date\',
        \'statistics\' => \'array\',
        \'generated_at\' => \'datetime\',
    ];

    public function child() {
        return $this->belongsTo(Child::class);
    }
}
'
];

foreach ($models as $file => $content) {
    file_put_contents($dir . $file, $content);
    echo "Written $file\n";
}

