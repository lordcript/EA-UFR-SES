<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AmicaleNews extends Model
{
    use HasFactory;

    protected $table = 'amicale_news';

    protected $fillable = [
        'title',
        'theme',
        'summary',
        'content',
        'author_name',
        'category',
        'photos',
        'video_url',
        'is_pinned',
        'published_at',
    ];

    protected $casts = [
        'photos' => 'array',
        'is_pinned' => 'boolean',
        'published_at' => 'datetime',
    ];
}
