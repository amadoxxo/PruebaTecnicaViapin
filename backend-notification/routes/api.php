<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\api\UserNotificationController;

// Registro y login de usuario
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
// Api Notification
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/notifications',      [UserNotificationController::class, 'index']);
    Route::post('/notifications',     [UserNotificationController::class, 'store']);
    Route::put('/notifications/read', [UserNotificationController::class, 'markAsRead']);
});
