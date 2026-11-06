<?php

namespace App\Http\Controllers;

use App\Models\Filiere;
use App\Models\AcademicResource;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $filieres = Filiere::withCount([
            'resources as courses_count' => fn($q) => $q->where('type', 'cours'),
            'resources as exams_count' => fn($q) => $q->where('type', 'examen'),
            'resources as td_count' => fn($q) => $q->whereIn('type', ['td', 'tp']),
        ])->get();

        $recentResources = AcademicResource::with('filiere')
            ->latest()
            ->take(6)
            ->get();

        $stats = [
            'courses' => AcademicResource::where('type', 'cours')->count(),
            'exams' => AcademicResource::where('type', 'examen')->count(),
            'td_tp' => AcademicResource::whereIn('type', ['td', 'tp'])->count(),
            'filieres' => $filieres->count(),
        ];

        $heroBanner = SiteSetting::get('hero_banner', '/images/uidt_gate.jpg');
        $amicaleLogo = SiteSetting::get('amicale_logo', '/images/amicale_logo.png');

        return view('home', compact('filieres', 'recentResources', 'stats', 'heroBanner', 'amicaleLogo'));
    }
}
