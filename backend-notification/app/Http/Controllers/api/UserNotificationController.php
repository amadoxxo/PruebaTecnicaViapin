<?php

namespace App\Http\Controllers\api;

use Illuminate\Http\Request;
use App\Models\UserNotification;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Events\UserNotificationCreated;

class UserNotificationController extends Controller
{
    public function index(Request $request): JsonResponse {
        $user = $request->user();
        $notifications = UserNotification::where('user_id', $user->id)->get();

        return response()->json($notifications);
    }

    public function store(Request $request): JsonResponse {
        $request->validate([
            'title'   => 'required|string|max:255',
            'message' => 'required|string'
        ]);

        $notification = UserNotification::create([
            'user_id' => $request->user()->id,
            'title'   => $request->title,
            'message' => $request->message,
            'read'    => false,
        ]);

        broadcast(new UserNotificationCreated($notification))->toOthers();

        return response()->json($notification, 201);
    }

    public function markAsRead(Request $request): JsonResponse {
        $user = $request->user();

        // Marcar todas las notificaciones del usuario como leídas
        $notification = $user->userNotification()
                    ->where('read', false)
                    ->update(['read' => true]);

        return response()->json([
            'message' => $notification > 0
                ? 'Las notificaciones han sido marcadas como leídas'
                : 'No tienes notificaciones por leer'
        ]);
    }
}
