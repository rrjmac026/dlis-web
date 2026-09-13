<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Minutes extends Model
{
    use HasFactory;

    // Explicit — Laravel's pluralizer can't be trusted to guess correctly
    // on an already-plural-looking class name like "Minutes".
    protected $table = 'minutes';

    public $timestamps = false;

    protected $fillable = [
        'session_type', // "Regular Session" or "Special Session"
        'date',
        'document_path',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
        ];
    }
}