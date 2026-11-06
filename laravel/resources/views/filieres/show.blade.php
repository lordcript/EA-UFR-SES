@extends('layouts.app')

@section('title', "Filière {$filiere->name} - AE UFR SES Biblio")

@section('content')
<div class="space-y-8">
    <!-- Onglets Filières Horizontaux -->
    <div class="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto">
        @foreach($allFilieres as $f)
            <a href="{{ route('filieres.show', $f->id) }}" class="px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all {{ $f->id === $filiere->id ? 'bg-[#0f2b4c] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100' }}">
                <span>{{ $f->code }}</span>
                <span class="hidden sm:inline font-normal text-slate-300">|</span>
                <span class="hidden sm:inline font-medium text-[11px]">{{ $f->name }}</span>
            </a>
        @endforeach
    </div>

    <!-- Bannière Filière -->
    <div class="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 h-56 flex items-end p-6 text-white">
        <img src="{{ $filiere->cover_image ?? asset('images/filiere_mio.jpg') }}" alt="{{ $filiere->name }}" class="absolute inset-0 w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent"></div>
        <div class="relative z-10 space-y-1">
            <span class="px-2 py-0.5 bg-amber-500 text-slate-950 text-xs font-black rounded">FILIÈRE {{ $filiere->code }}</span>
            <h1 class="text-2xl sm:text-3xl font-extrabold">{{ $filiere->name }}</h1>
            <p class="text-xs text-slate-200 max-w-2xl">{{ $filiere->description }}</p>
            <p class="text-[11px] text-amber-300 font-semibold">{{ $filiere->department }}</p>
        </div>
    </div>

    <!-- Filtres (Types, Niveaux, Formats) -->
    <form method="GET" action="{{ route('filieres.show', $filiere->id) }}" class="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <select name="type" onchange="this.form.submit()" class="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-slate-700">
            <option value="all">Tous les types de documents</option>
            <option value="cours" {{ request('type') == 'cours' ? 'selected' : '' }}>Cours Magistraux</option>
            <option value="examen" {{ request('type') == 'examen' ? 'selected' : '' }}>Examens passés (Annales)</option>
            <option value="td" {{ request('type') == 'td' ? 'selected' : '' }}>Travaux Dirigés (TD)</option>
            <option value="tp" {{ request('type') == 'tp' ? 'selected' : '' }}>Travaux Pratiques (TP)</option>
        </select>

        <select name="level" onchange="this.form.submit()" class="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700">
            <option value="all">Tous les niveaux (L1 à M2)</option>
            @foreach($filiere->levels as $lvl)
                <option value="{{ $lvl }}" {{ request('level') == $lvl ? 'selected' : '' }}>{{ $lvl }}</option>
            @endforeach
        </select>

        <select name="format" onchange="this.form.submit()" class="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700">
            <option value="all">Tous les formats (PDF, Vidéo, Photo, Excel, CSV)</option>
            <option value="pdf" {{ request('format') == 'pdf' ? 'selected' : '' }}>PDF</option>
            <option value="video" {{ request('format') == 'video' ? 'selected' : '' }}>Vidéo</option>
            <option value="photo" {{ request('format') == 'photo' ? 'selected' : '' }}>Photo</option>
            <option value="xlsx" {{ request('format') == 'xlsx' ? 'selected' : '' }}>XLSX (Excel)</option>
            <option value="csv" {{ request('format') == 'csv' ? 'selected' : '' }}>CSV</option>
        </select>

        <input type="text" name="q" value="{{ request('q') }}" placeholder="Rechercher un module, code UE..." class="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs flex-1">
        <button type="submit" class="px-4 py-1.5 bg-[#0f2b4c] text-white font-bold rounded-lg">Filtrer</button>
    </form>

    <!-- Grille des Ressources -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @forelse($resources as $res)
            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
                <div class="space-y-1.5">
                    <div class="flex items-center justify-between text-xs">
                        <span class="font-bold uppercase text-amber-700">{{ $res->type }} ({{ strtoupper($res->format) }})</span>
                        <span class="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-[#0f2b4c]">{{ $res->code_ue }}</span>
                    </div>
                    <h3 class="text-sm font-bold text-slate-900">{{ $res->title }}</h3>
                    <p class="text-xs text-slate-500">{{ $res->module_name }} · {{ $res->level }} ({{ $res->semester }}) · Par {{ $res->author }}</p>
                    @if($res->description)
                        <p class="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">{{ $res->description }}</p>
                    @endif
                </div>

                <div class="pt-3 border-t border-slate-100 space-y-3">
                    <div class="flex items-center justify-between text-[11px] text-slate-500">
                        <span class="font-mono truncate max-w-[220px]">📁 {{ $res->file_name }}</span>
                        <span class="font-mono font-semibold text-slate-600">{{ $res->file_size }}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-2.5">
                        <button type="button" class="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-[#0f2b4c] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors">
                            <span>Aperçu</span>
                        </button>
                        <a href="{{ route('resources.download', $res->id) }}" class="w-full py-2.5 px-3 bg-[#0f2b4c] hover:bg-[#163a66] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors text-center shadow-xs">
                            <span>Télécharger</span>
                        </a>
                    </div>
                </div>
            </div>
        @empty
            <div class="col-span-2 bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-xs text-slate-500">
                Aucun document ne correspond à cette sélection dans la filière {{ $filiere->name }}.
            </div>
        @endforelse
    </div>

    <div>
        {{ $resources->links() }}
    </div>
</div>
@endsection
