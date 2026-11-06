<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AcademicResource extends Model
{
    use HasFactory;

    protected $fillable = [
        'filiere_id',
        'type',
        'title',
        'code_ue',
        'module_name',
        'level',
        'semester',
        'format',
        'file_url',
        'file_name',
        'file_size',
        'author',
        'academic_year',
        'description',
        'downloads_count',
    ];

    public function filiere(): BelongsTo
    {
        return $this->belongsTo(Filiere::class, 'filiere_id', 'id');
    }
}
