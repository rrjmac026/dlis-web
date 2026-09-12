<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommitteeReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_number',
        'date',
        'submitted_by',
        'sponsored_by',
        'subject',
        'added_by',
        'added_at',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
            'added_at' => 'datetime',
        ];
    }

    public function attachments()
    {
        return $this->hasMany(CommitteeReportAttachment::class);
    }
}
