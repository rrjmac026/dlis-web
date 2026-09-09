<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resolution extends Model
{
    use HasFactory;

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
            'date_approved' => 'date',
            'certified_date' => 'date',
            'verified_date' => 'date',
            'attested_date' => 'date',
            'added_at' => 'datetime',
        ];
    }

    public function clauses()
    {
        return $this->hasMany(ResolutionClause::class)->orderBy('order');
    }

    // Mirrors WhereasClauses computed property
    public function getWhereasClausesAttribute()
    {
        return $this->clauses
            ->where('clause_type', 'Whereas')
            ->sortBy('order')
            ->values();
    }

    // Mirrors ResolvedClauses computed property
    public function getResolvedClausesAttribute()
    {
        return $this->clauses
            ->where('clause_type', 'Resolved')
            ->sortBy('order')
            ->values();
    }
}
