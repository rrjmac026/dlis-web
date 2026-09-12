<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Minutes extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_type', // "Regular Session" or "Special Session"
        'date',
        'document_path',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date:d-m-Y',
        ];
    }
}
