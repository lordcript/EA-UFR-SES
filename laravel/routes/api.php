<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Filiere;
use App\Models\AcademicResource;

/*
|--------------------------------------------------------------------------
| API Routes - UIDTprogramme UFR SES
|--------------------------------------------------------------------------
*/

Route::get('/filieres', function () {
    return response()->json(Filiere::withCount('resources')->get());
});

Route::get('/filieres/{id}/resources', function ($id) {
    return response()->json(
        AcademicResource::where('filiere_id', strtoupper($id))->latest()->get()
    );
});

Route::get('/resources/search', function (Request $request) {
    $q = $request->query('q');
    if (!$q) return response()->json([]);

    return response()->json(
        AcademicResource::where('title', 'like', "%{$q}%")
            ->orWhere('code_ue', 'like', "%{$q}%")
            ->orWhere('module_name', 'like', "%{$q}%")
            ->take(10)
            ->get()
    );
});
