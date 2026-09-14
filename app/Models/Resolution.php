<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resolution extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'resolution_number',
        'sb_term',
        'session_info',
        'committee',
        'title',
        'sponsor',
        'date_approved',
        'document_path',
        'added_by',
        'added_at',
    ];

    protected function casts(): array
    {
        return [
            'date_approved' => 'date:Y-m-d',
            'added_at' => 'datetime',
        ];
    }

    public function clauses()
    {
        return $this->hasMany(ResolutionClause::class)->orderBy('order');
    }
}