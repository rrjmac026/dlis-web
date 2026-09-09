<?php

namespace App\Models;

use App\Enums\FeedbackStatus;
use App\Enums\FeedbackType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    const UPDATED_AT = null;

    protected $fillable = [
        'submitted_by',
        'type',
        'message',
        'status',
    ];

    protected $attributes = [
        'status' => FeedbackStatus::Open,
    ];

    protected function casts(): array
    {
        return [
            'type' => FeedbackType::class,
            'status' => FeedbackStatus::class,
        ];
    }
}
