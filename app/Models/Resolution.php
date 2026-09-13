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
        'affirmative_votes',
        'negative_votes',
        'abstained_votes',
        'absent_votes',
        'certified_adopted_by',
        'certified_date',
        'verified_by',
        'verified_date',
        'attested_by',
        'attested_date',
        'document_path',
        'added_by',
        'added_at',
    ];

    protected $attributes = [
        'negative_votes' => 'None',
        'abstained_votes' => 'None',
        'absent_votes' => 'None',
    ];

    protected function casts(): array
    {
        return [
            'date_approved' => 'date:Y-m-d',
            'certified_date' => 'date:Y-m-d',
            'verified_date' => 'date:Y-m-d',
            'attested_date' => 'date:Y-m-d',
            'added_at' => 'datetime',
        ];
    }

    public function clauses()
    {
        return $this->hasMany(ResolutionClause::class)->orderBy('order');
    }

    public function getWhereasClausesAttribute()
    {
        return $this->clauses->where('clause_type', 'Whereas')->sortBy('order')->values();
    }

    public function getResolvedClausesAttribute()
    {
        return $this->clauses->where('clause_type', 'Resolved')->sortBy('order')->values();
    }
}