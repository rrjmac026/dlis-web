<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'username',
        'action',
        'details',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Mirrors TimestampPH from the .NET model (UTC + 8 hours, Philippine time)
    public function getTimestampPhAttribute()
    {
        return $this->created_at?->copy()->addHours(8);
    }
}
