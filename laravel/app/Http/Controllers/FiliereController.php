<?php

namespace App\Http\Controllers;

use App\Models\Filiere;
use App\Models\AcademicResource;
use Illuminate\Http\Request;

class FiliereController extends Controller
{
    public function show(Request $request, string $id)
    {
        $filiere = Filiere::findOrFail(strtoupper($id));
        $allFilieres = Filiere::all();

        $query = AcademicResource::where('filiere_id', $filiere->id);

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->filled('level') && $request->level !== 'all') {
            $query->where('level', $request->level);
        }

        if ($request->filled('format') && $request->format !== 'all') {
            $query->where('format', $request->format);
        }

        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function($b) use ($q) {
                $b->where('title', 'like', "%{$q}%")
                  ->orWhere('code_ue', 'like', "%{$q}%")
                  ->orWhere('module_name', 'like', "%{$q}%")
                  ->orWhere('author', 'like', "%{$q}%");
            });
        }

        $resources = $query->latest()->paginate(12);

        return view('filieres.show', compact('filiere', 'allFilieres', 'resources'));
    }
}
