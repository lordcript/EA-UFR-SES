@extends('layouts.app')

@section('title', 'Espace Étudiant - AE UFR SES Biblio')

@section('content')
<div class="space-y-8">
    <!-- Carte d'Identité Universitaire de l'Étudiant -->
    <div class="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-center gap-5">
            <img src="{{ asset('images/amicale_logo.png') }}" alt="Logo Amicale" class="w-16 h-16 rounded-full shadow-sm">
            <div>
                <span class="text-xs font-bold text-amber-700 uppercase">Espace Étudiant Officiel · UIDT</span>
                <h1 class="text-2xl font-black text-[#0f2b4c]">{{ $student->full_name }}</h1>
                <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                    <span class="font-mono font-bold text-slate-800">INE : {{ $student->ine }}</span>
                    <span>·</span>
                    <span class="font-semibold text-emerald-700">{{ $student->filiere_id }}</span>
                    <span>·</span>
                    <span>{{ $student->level }}</span>
                </div>
            </div>
        </div>

        <div>
            <!-- Formulaire de modification de mot de passe -->
            <form action="{{ route('student.update_password') }}" method="POST" class="flex flex-wrap items-center gap-2">
                @csrf
                <input type="password" name="current_password" required placeholder="Mot de passe actuel" class="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none">
                <input type="password" name="password" required placeholder="Nouveau mot de passe" class="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none">
                <input type="password" name="password_confirmation" required placeholder="Confirmer" class="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none">
                <button type="submit" class="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl">Mettre à jour</button>
            </form>
        </div>
    </div>

    <!-- Modules et Cours de sa promotion -->
    <div class="space-y-4">
        <h2 class="text-lg font-bold text-[#0f2b4c]">Documents de votre cursus ({{ $student->level }} · {{ $student->filiere_id }})</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @forelse($curriculumResources as $res)
                <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
                    <div>
                        <div class="flex items-center justify-between text-xs mb-1">
                            <span class="font-bold uppercase text-amber-700">{{ $res->type }} ({{ strtoupper($res->format) }})</span>
                            <span class="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-[#0f2b4c]">{{ $res->code_ue }}</span>
                        </div>
                        <h3 class="text-sm font-bold text-slate-900">{{ $res->title }}</h3>
                        <p class="text-xs text-slate-500">{{ $res->module_name }} · {{ $res->semester }} · Par {{ $res->author }}</p>
                    </div>
                    <div class="pt-3 border-t border-slate-100 space-y-3">
                        <div class="flex items-center justify-between text-[11px] text-slate-500">
                            <span class="font-mono truncate max-w-[200px]">📁 {{ $res->file_name }}</span>
                            <span class="font-mono font-semibold text-slate-600">{{ $res->file_size ?? 'Document' }}</span>
                        </div>
                        <div class="grid grid-cols-2 gap-2.5">
                            <button type="button" class="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-[#0f2b4c] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors">
                                <span>Consulter</span>
                            </button>
                            <a href="{{ route('resources.download', $res->id) }}" class="w-full py-2.5 px-3 bg-[#0f2b4c] hover:bg-[#163a66] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors text-center shadow-xs">
                                <span>Télécharger</span>
                            </a>
                        </div>
                    </div>
                </div>
            @empty
                <div class="col-span-2 bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
                    Aucun document n'a encore été mis en ligne pour votre niveau.
                </div>
            @endforelse
        </div>
    </div>
</div>
@endsection
