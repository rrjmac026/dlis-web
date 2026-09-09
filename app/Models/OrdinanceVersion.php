<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrdinanceVersion extends Model
{
    use HasFactory;

    protected $fillable = [
        'ordinance_id',
        'version_number',
        'title',
        'content',
        'date_enacted',
        'enacted_by',
        'amendment_notes',
    ];

    protected function casts(): array
    {
        return [
            'date_enacted' => 'date',
        ];
    }

    public function ordinance()
    {
        return $this->belongsTo(Ordinance::class);
    }
}
