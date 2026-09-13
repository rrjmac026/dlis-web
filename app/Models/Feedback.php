<?php

namespace App\Models;

use App\Enums\FeedbackStatus;
use App\Enums\FeedbackType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    // Explicit for the same reason as Minutes — cheap insurance, and makes
    // the mapping to the real "Feedback" table (via the lowercase view)
    // obvious at a glance rather than relying on the uncountable-words guess.
    protected $table = 'feedback';

    const UPDATED_AT = null;

    protected $fillable = [
        'submitted_by',
        'type',
        'message',
        'status',
    ];

    protected $attributes = [
        'status' => FeedbackStatus::Open->value,
    ];

    protected function casts(): array
    {
        return [
            'type' => FeedbackType::class,
            'status' => FeedbackStatus::class,
        ];
    }
}