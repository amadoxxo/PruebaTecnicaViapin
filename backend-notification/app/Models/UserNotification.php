<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserNotification extends Model
{
    public $timestamps = false;
    protected $table = 'user_notifications';

    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'message',
        'read',
    ];

    protected $casts = [
        'read' => 'boolean'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
