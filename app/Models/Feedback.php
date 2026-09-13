<?php

namespace App\Models;

use App\Casts\OrdinalEnumCast;
use App\Enums\FeedbackStatus;
use App\Enums\FeedbackType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    protected $table = 'feedback';

    const UPDATED_AT = null;

    protected $fillable = [
        'submitted_by',
        'type',
        'message',
        'status',
    ];

    protected $attributes = [
        'status' => 0, // FeedbackStatus::Open
    ];

    protected function casts(): array
    {
        return [
            'type' => OrdinalEnumCast::using(FeedbackType::class),
            'status' => OrdinalEnumCast::using(FeedbackStatus::class),
        ];
    }
}