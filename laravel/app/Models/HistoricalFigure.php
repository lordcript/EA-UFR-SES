<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoricalFigure extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'title',
        'period',
        'photo_url',
        'biography',
        'contributions',
        'display_order',
    ];
}
