<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Filiere extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'code',
        'name',
        'department',
        'description',
        'levels',
        'cover_image',
        'badge_color',
    ];

    protected $casts = [
        'levels' => 'array',
    ];

    public function resources(): HasMany
    {
        return $this->hasMany(AcademicResource::class, 'filiere_id', 'id');
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class, 'filiere_id', 'id');
    }

    public function courses(): HasMany
    {
        return $this->hasMany(AcademicResource::class, 'filiere_id', 'id')->where('type', 'cours');
    }

    public function exams(): HasMany
    {
        return $this->hasMany(AcademicResource::class, 'filiere_id', 'id')->where('type', 'examen');
    }

    public function tds(): HasMany
    {
        return $this->hasMany(AcademicResource::class, 'filiere_id', 'id')->where('type', 'td');
    }

    public function tps(): HasMany
    {
        return $this->hasMany(AcademicResource::class, 'filiere_id', 'id')->where('type', 'tp');
    }
}
