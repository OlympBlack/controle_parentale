<?php

use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\AlertController;
use App\Http\Controllers\Api\AppRuleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChildController;
use App\Http\Controllers\Api\DeviceController;
use App\Http\Controllers\Api\FamilyController;
use App\Http\Controllers\Api\FilterRuleController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ScreenTimeRuleController;
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

    // Children
    Route::apiResource('children', ChildController::class);

    // Devices
    Route::apiResource('devices', DeviceController::class);

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

    // Screen Time Rules
    Route::apiResource('screen-time-rules', ScreenTimeRuleController::class);

    // App Rules
    Route::apiResource('app-rules', AppRuleController::class);

    // Locations
    Route::get('/locations', [LocationController::class, 'index']);
    Route::get('/children/{childId}/locations/latest', [LocationController::class, 'latest']);
});
