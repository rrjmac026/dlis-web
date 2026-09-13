<?php

namespace App\Models;

use App\Enums\FinalAction;
use App\Enums\OrdinanceState;
use App\Enums\OrdinanceStatus;
use App\Enums\TypeOfLaw;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Casts\OrdinalEnumCast;

class Ordinance extends Model
{
    use HasFactory;

    protected $fillable = [
        'ordinance_number',
        'series_number',
        'title',
        'subject',
        'type',
        'status',
        'sponsor',
        'committee',
        'date_passed',
        'date_approved',
        'date_published',
        'document_path',
        'reference_number',
        'nrs_nsb',
        'nomenclature',
        'final_action',
        'location',
        'state',
        'added_by',
        'added_at',
    ];

    protected function casts(): array
    {
        return [
            'type' => OrdinalEnumCast::using(TypeOfLaw::class),
            'status' => OrdinalEnumCast::using(OrdinanceStatus::class),
            'final_action' => OrdinalEnumCast::using(FinalAction::class),
            'state' => OrdinalEnumCast::using(OrdinanceState::class),
            'date_passed' => 'date:Y-m-d',
            'date_approved' => 'date:Y-m-d',
            'date_published' => 'date:Y-m-d',
            'added_at' => 'datetime',
        ];
    }

    public function versions()
    {
        return $this->hasMany(OrdinanceVersion::class)->orderByDesc('version_number');
    }

    // Mirrors LatestVersion computed property
    public function getLatestVersionAttribute()
    {
        return $this->versions->sortByDesc('version_number')->first();
    }

    // Mirrors HasAmendments computed property
    public function getHasAmendmentsAttribute(): bool
    {
        return $this->versions->count() > 1;
    }
}
