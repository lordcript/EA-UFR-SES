<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use App\Models\Filiere;
use App\Models\AcademicResource;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        $filieres = Filiere::all();
        $admins = User::latest()->get();
        $students = Student::with('filiere')->latest()->paginate(15);

        $resourcesQuery = AcademicResource::with('filiere');
        if ($request->filled('filiere')) {
            $resourcesQuery->where('filiere_id', $request->filiere);
        }
        if ($request->filled('type')) {
            $resourcesQuery->where('type', $request->type);
        }
        $resources = $resourcesQuery->latest()->paginate(15);

        $stats = [
            'total_students' => Student::count(),
            'total_resources' => AcademicResource::count(),
            'total_admins' => User::count(),
            'total_downloads' => AcademicResource::sum('downloads_count'),
        ];

        $siteImages = [
            'hero_banner' => SiteSetting::get('hero_banner', '/images/uidt_gate.jpg'),
            'amicale_logo' => SiteSetting::get('amicale_logo', '/images/amicale_logo.png'),
        ];

        return view('admin.dashboard', compact('filieres', 'admins', 'students', 'resources', 'stats', 'siteImages'));
    }

    // --- GESTION DES RESSOURCES PÉDAGOGIQUES ---
    public function storeResource(Request $request)
    {
        $request->validate([
            'filiere_id' => 'required|exists:filieres,id',
            'type' => 'required|in:cours,examen,td,tp',
            'title' => 'required|string|max:255',
            'code_ue' => 'required|string|max:30',
            'module_name' => 'required|string|max:255',
            'level' => 'required|string',
            'semester' => 'required|string',
            'format' => 'required|in:pdf,video,photo,csv,xlsx',
            'author' => 'nullable|string',
            'academic_year' => 'nullable|string',
            'description' => 'nullable|string',
            'file' => 'nullable|file|max:51200', // max 50Mo
            'file_url' => 'nullable|string',
        ]);

        $fileUrl = $request->file_url ?? '/documents/sample.pdf';
        $fileName = "{$request->code_ue}_{$request->type}.{$request->format}";
        $fileSize = '2.5 Mo';

        if ($request->hasFile('file')) {
            $uploaded = $request->file('file');
            $fileName = $uploaded->getClientOriginalName();
            $fileSize = round($uploaded->getSize() / (1024 * 1024), 1) . ' Mo';
            $path = $uploaded->store('resources', 'public');
            $fileUrl = Storage::url($path);
        }

        AcademicResource::create([
            'filiere_id' => $request->filiere_id,
            'type' => $request->type,
            'title' => $request->title,
            'code_ue' => strtoupper($request->code_ue),
            'module_name' => $request->module_name,
            'level' => $request->level,
            'semester' => $request->semester,
            'format' => $request->format,
            'file_url' => $fileUrl,
            'file_name' => $fileName,
            'file_size' => $fileSize,
            'author' => $request->author ?? 'Enseignant UFR SES',
            'academic_year' => $request->academic_year ?? '2025-2026',
            'description' => $request->description,
        ]);

        return back()->with('success', 'Ressource pédagogique publiée avec succès !');
    }

    public function destroyResource(AcademicResource $resource)
    {
        $resource->delete();
        return back()->with('success', 'Document supprimé du programme.');
    }

    // --- GESTION DES IMAGES DE L'APPLICATION ---
    public function updateImages(Request $request)
    {
        if ($request->hasFile('hero_banner')) {
            $path = $request->file('hero_banner')->store('site', 'public');
            SiteSetting::set('hero_banner', Storage::url($path));
        }

        if ($request->hasFile('amicale_logo')) {
            $path = $request->file('amicale_logo')->store('site', 'public');
            SiteSetting::set('amicale_logo', Storage::url($path));
        }

        // Images de chaque filière (MIO, MTH, SEG, LAC, LEA)
        foreach (['MIO', 'MTH', 'SEG', 'LAC', 'LEA'] as $fId) {
            $inputName = "filiere_image_{$fId}";
            if ($request->hasFile($inputName)) {
                $path = $request->file($inputName)->store('filieres', 'public');
                $filiere = Filiere::find($fId);
                if ($filiere) {
                    $filiere->update(['cover_image' => Storage::url($path)]);
                }
            }
        }

        return back()->with('success', 'Images de la plateforme mises à jour avec succès.');
    }

    // --- GESTION DES ADMINISTRATEURS (Ajout, Blocage, Suppression) ---
    public function storeAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,moderateur',
        ]);

        User::create([
            'name' => $request->name,
            'email' => strtolower($request->email),
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'is_blocked' => false,
        ]);

        return back()->with('success', "Nouvel administrateur {$request->name} créé avec succès !");
    }

    public function toggleBlockAdmin(User $user)
    {
        if (strtolower($user->email) === 'adminhyjazi@gmail.com') {
            return back()->withErrors(['error' => 'Impossible de bloquer le Super Administrateur fondateur.']);
        }

        $user->update(['is_blocked' => !$user->is_blocked]);

        $status = $user->is_blocked ? 'bloqué' : 'débloqué';
        return back()->with('success', "Le compte administrateur a été {$status}.");
    }

    public function destroyAdmin(User $user)
    {
        if (strtolower($user->email) === 'adminhyjazi@gmail.com') {
            return back()->withErrors(['error' => 'Impossible de supprimer le Super Administrateur principal.']);
        }

        $user->delete();
        return back()->with('success', 'Administrateur supprimé.');
    }

    // --- GESTION DES ÉTUDIANTS ---
    public function toggleBlockStudent(Student $student)
    {
        $student->update([
            'status' => $student->status === 'actif' ? 'bloque' : 'actif'
        ]);

        return back()->with('success', "Statut de l'étudiant {$student->full_name} modifié.");
    }
}
