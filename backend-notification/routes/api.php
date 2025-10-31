<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\api\NotificationController;

// Registro y login de usuario
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
// Api Notification
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/notifications',      [NotificationController::class, 'index']);
    Route::post('/notifications',     [NotificationController::class, 'store']);
    Route::put('/notifications/read', [NotificationController::class, 'markAsRead']);
});
