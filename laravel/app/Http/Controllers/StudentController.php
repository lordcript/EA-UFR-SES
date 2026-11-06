<?php

namespace App\Http\Controllers;

use App\Models\AcademicResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    public function dashboard()
    {
        $student = Auth::guard('student')->user();

        $curriculumResources = AcademicResource::where('filiere_id', $student->filiere_id)
            ->where('level', $student->level)
            ->latest()
            ->get();

        $otherResources = AcademicResource::where('filiere_id', $student->filiere_id)
            ->where('level', '!=', $student->level)
            ->latest()
            ->take(8)
            ->get();

        return view('student.dashboard', compact('student', 'curriculumResources', 'otherResources'));
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $student = Auth::guard('student')->user();

        if (!Hash::check($request->current_password, $student->password)) {
            return back()->withErrors(['current_password' => 'Le mot de passe actuel est erroné.']);
        }

        $student->update(['password' => Hash::make($request->password)]);

        return back()->with('success', 'Votre mot de passe a été modifié avec succès.');
    }
}
