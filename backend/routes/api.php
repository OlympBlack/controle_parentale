<?php

use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\AlertController;
use App\Http\Controllers\Api\AppRuleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChildController;
use App\Http\Controllers\Api\DeviceController;
use App\Http\Controllers\Api\FamilyController;
use App\Http\Controllers\Api\FamilyMemberController;
use App\Http\Controllers\Api\InvitationController;
use App\Http\Controllers\Api\ContentCategoryController;
use App\Http\Controllers\Api\FilterRuleController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ScreenTimeRuleController;
use App\Http\Controllers\Api\UsageController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public routes — rate limited
|--------------------------------------------------------------------------
*/
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
});

Route::middleware('throttle:10,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

// Invitations (public)
Route::get('/invitations/{token}', [InvitationController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Protected routes (Sanctum authentication required)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout',         [AuthController::class, 'logout']);
    Route::post('/logout-all',     [AuthController::class, 'logoutAll']);
    Route::post('/auth/password',  [AuthController::class, 'changePassword']);
    Route::get('/me',              [AuthController::class, 'me']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    // Families
    Route::apiResource('families', FamilyController::class);
    Route::get   ('families/{family}/members',                  [FamilyMemberController::class, 'index']);
    Route::post  ('families/{family}/members',                  [FamilyMemberController::class, 'store']);
    Route::patch ('families/{family}/members/{member}',         [FamilyMemberController::class, 'update']);
    Route::delete('families/{family}/members/{member}',         [FamilyMemberController::class, 'destroy']);
    Route::get   ('families/{family}/invitations',              [FamilyMemberController::class, 'pendingInvitations']);
    Route::delete('families/{family}/invitations/{invitation}', [FamilyMemberController::class, 'cancelInvitation']);
    Route::post  ('/invitations/{token}/accept',                [InvitationController::class,   'accept']);

    // Children
    Route::apiResource('children', ChildController::class);

    // Devices
    Route::apiResource('devices', DeviceController::class);
    Route::post  ('/devices/pair',                 [DeviceController::class, 'pair']);
    Route::post  ('/devices/{device}/usage',         [UsageController::class, 'storeUsage']);
    Route::post  ('/devices/{device}/location',      [UsageController::class, 'storeLocation']);
    Route::post  ('/devices/{device}/installed-apps', [UsageController::class, 'storeInstalledApps']);
    Route::patch ('/devices/{device}/permissions',   [UsageController::class, 'updatePermissions']);

    // Children — usage & location
    Route::get('/children/{child}/usage',           [UsageController::class, 'childUsage']);
    Route::get('/children/{child}/usage/today',     [UsageController::class, 'childUsageToday']);
    Route::get('/children/{child}/location/last',   [UsageController::class, 'childLocationLast']);
    Route::get('/children/{child}/location/history',[UsageController::class, 'childLocationHistory']);

    // Activities (index + show only)
    Route::apiResource('activities', ActivityController::class)->only(['index', 'show']);

    // Alerts
    Route::apiResource('alerts', AlertController::class)->only(['index', 'show']);
    Route::patch('/alerts/{alert}/status', [AlertController::class, 'updateStatus']);

    // Notifications
    Route::apiResource('notifications', NotificationController::class)->only(['index', 'show']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);

    // Reports (index + show only)
    Route::apiResource('reports', ReportController::class)->only(['index', 'show']);

    // Filter Rules
    Route::apiResource('filter-rules', FilterRuleController::class);

    // Content Categories (index only)
    Route::get('/content-categories', [ContentCategoryController::class, 'index']);

    // Screen Time Rules
    Route::apiResource('screen-time-rules', ScreenTimeRuleController::class);

    // App Rules
    Route::apiResource('app-rules', AppRuleController::class);

    // Locations (legacy index endpoint)
    Route::get('/locations', [LocationController::class, 'index']);
});
