@extends('layouts.app')

@section('title', 'Administration - AE UFR SES Biblio')

@section('content')
<div class="space-y-8">
    <!-- En-tête Console Admin -->
    <div class="bg-[#0f2b4c] text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
            <span class="px-2.5 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full">Console Laravel 11 · Administration Pédagogique</span>
            <h1 class="text-2xl sm:text-3xl font-black mt-2">Panneau d'Administration AE UFR SES Biblio</h1>
            <p class="text-xs text-slate-300">Connecté : <strong>{{ Auth::user()->name }}</strong> ({{ Auth::user()->email }})</p>
        </div>
        <div class="flex items-center gap-3">
            <span class="text-xs font-mono bg-white/10 px-3 py-1.5 rounded-lg">Laravel v11 · PHP 8.2</span>
        </div>
    </div>

    <!-- 1. Publication d'un Nouveau Cours / TD / TP / Examen -->
    <div class="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
        <h2 class="text-xl font-bold text-[#0f2b4c]">Ajouter un Document Pédagogique (Cours, TD, TP, Examen)</h2>
        <form action="{{ route('admin.resources.store') }}" method="POST" enctype="multipart/form-data" class="space-y-4">
            @csrf
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Filière *</label>
                    <select name="filiere_id" required class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold">
                        @foreach($filieres as $f)
                            <option value="{{ $f->id }}">{{ $f->code }} - {{ $f->name }}</option>
                        @endforeach
                    </select>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Type de Document *</label>
                    <select name="type" required class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold">
                        <option value="cours">Cours Magistral</option>
                        <option value="examen">Examen Passé (Annales)</option>
                        <option value="td">Travaux Dirigés (TD)</option>
                        <option value="tp">Travaux Pratiques (TP)</option>
                    </select>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Format Multimédia *</label>
                    <select name="format" required class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold">
                        <option value="pdf">PDF (Document / Épreuve)</option>
                        <option value="video">Vidéo (Enregistrement)</option>
                        <option value="photo">Photo (Schéma / Tableau)</option>
                        <option value="xlsx">XLSX (Classeur Excel)</option>
                        <option value="csv">CSV (Jeu de données)</option>
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Titre du Document *</label>
                    <input type="text" name="title" required placeholder="ex: Analyse Macroéconomique des Décisions" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Code UE & Module *</label>
                    <div class="grid grid-cols-2 gap-2">
                        <input type="text" name="code_ue" required placeholder="Code UE (ex: MIO-201)" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold">
                        <input type="text" name="module_name" required placeholder="Nom du Module" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs">
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Niveau *</label>
                    <select name="level" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs">
                        <option value="Licence 1">Licence 1</option>
                        <option value="Licence 2">Licence 2</option>
                        <option value="Licence 3">Licence 3</option>
                        <option value="Master 1">Master 1</option>
                        <option value="Master 2">Master 2</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Semestre *</label>
                    <select name="semester" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs">
                        <option value="Semestre 1">Semestre 1</option>
                        <option value="Semestre 2">Semestre 2</option>
                        <option value="Semestre 3">Semestre 3</option>
                        <option value="Semestre 4">Semestre 4</option>
                        <option value="Semestre 5">Semestre 5</option>
                        <option value="Semestre 6">Semestre 6</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Fichier (Téléversement)</label>
                    <input type="file" name="file" class="w-full text-xs text-slate-600">
                </div>
            </div>

            <button type="submit" class="px-5 py-2.5 bg-[#0f2b4c] hover:bg-[#163a66] text-white text-xs font-bold rounded-xl shadow-xs">
                Publier le document sur la plateforme
            </button>
        </form>
    </div>

    <!-- 2. Gestion des Administrateurs (Ajout, Blocage, Suppression) -->
    <div class="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
        <h2 class="text-xl font-bold text-[#0f2b4c]">Gestion des Administrateurs</h2>

        <!-- Formulaire d'ajout d'administrateur -->
        <form action="{{ route('admin.admins.store') }}" method="POST" class="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            @csrf
            <div>
                <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Nom *</label>
                <input type="text" name="name" required placeholder="Dr. Prénom Nom" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs">
            </div>
            <div>
                <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email *</label>
                <input type="email" name="email" required placeholder="admin@univ-thies.sn" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs">
            </div>
            <div>
                <label class="block text-[11px] font-bold text-slate-700 uppercase mb-1">Mot de passe *</label>
                <input type="password" name="password" required placeholder="Min. 6 car." class="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs">
            </div>
            <button type="submit" class="py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl">
                Créer l'administrateur
            </button>
        </form>

        <!-- Liste des Administrateurs -->
        <div class="overflow-x-auto border border-slate-200 rounded-2xl">
            <table class="w-full text-left text-xs border-collapse">
                <thead class="bg-slate-100 border-b border-slate-200 text-slate-700">
                    <tr>
                        <th class="p-3">Nom</th>
                        <th class="p-3">Email</th>
                        <th class="p-3">Rôle</th>
                        <th class="p-3">Statut</th>
                        <th class="p-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @foreach($admins as $adm)
                        <tr>
                            <td class="p-3 font-bold">{{ $adm->name }}</td>
                            <td class="p-3 font-mono text-slate-600">{{ $adm->email }}</td>
                            <td class="p-3 uppercase font-semibold text-slate-700">{{ $adm->role }}</td>
                            <td class="p-3">
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold {{ $adm->is_blocked ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800' }}">
                                    {{ $adm->is_blocked ? 'Bloqué' : 'Actif' }}
                                </span>
                            </td>
                            <td class="p-3 text-right">
                                @if(strtolower($adm->email) !== 'adminhyjazi@gmail.com')
                                    <form action="{{ route('admin.admins.toggle_block', $adm->id) }}" method="POST" class="inline">
                                        @csrf
                                        <button type="submit" class="px-2 py-1 text-[11px] border rounded font-semibold {{ $adm->is_blocked ? 'text-emerald-700 border-emerald-300' : 'text-amber-700 border-amber-300' }}">
                                            {{ $adm->is_blocked ? 'Débloquer' : 'Bloquer' }}
                                        </button>
                                    </form>
                                    <form action="{{ route('admin.admins.destroy', $adm->id) }}" method="POST" class="inline" onsubmit="return confirm('Confirmer la suppression ?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="px-2 py-1 text-[11px] text-red-600 font-bold hover:underline">Supprimer</button>
                                    </form>
                                @else
                                    <span class="text-[10px] font-bold text-emerald-700">Fondateur Principal</span>
                                @endif
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
