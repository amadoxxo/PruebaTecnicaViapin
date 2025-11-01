<?php

namespace App\Events;

use App\Models\UserNotification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserNotificationCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $userNotification;

    public function __construct(UserNotification $userNotification)
    {
        $this->userNotification = $userNotification;
    }

    public function broadcastOn(): Channel
    {
        // Canal privado por usuario
        return new Channel('notifications.' . $this->userNotification->user_id);
    }

    public function broadcastAs(): string
    {
        return 'userNotification.created';
    }

    public function broadcastWith(): array
    {
        return [
            'id'        => $this->userNotification->id,
            'user_id'   => $this->userNotification->user_id,
            'title'     => $this->userNotification->title,
            'message'   => $this->userNotification->message,
            'read'      => (bool) $this->userNotification->read,
            'created_at'=> $this->userNotification->created_at->toDateTimeString(),
        ];
    }
}
