<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResolutionClause extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'resolution_id',
        'clause_type', // "Whereas" or "Resolved"
        'order',
        'text',
    ];

    public function resolution()
    {
        return $this->belongsTo(Resolution::class);
    }
}
