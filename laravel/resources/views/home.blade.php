@extends('layouts.app')

@section('title', 'Accueil - AE UFR SES Biblio')

@section('content')
<div class="space-y-12">
    <!-- Bannière Portail Entrée UIDT -->
    <div class="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900 min-h-[380px] flex items-end p-8 text-white">
        <img src="{{ $heroBanner }}" alt="Portail Université Iba Der Thiam de Thiès" class="absolute inset-0 w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent"></div>

        <div class="relative z-10 max-w-3xl space-y-3">
            <span class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-300">
                Amicale des Étudiants · UFR SES UIDT
            </span>
            <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight">AE UFR SES Biblio</h1>
            <p class="text-slate-200 text-sm leading-relaxed">
                Bibliothèque numérique officielle de l'Amicale des Étudiants : cours magistraux, examens passés, travaux dirigés (TD) et travaux pratiques (TP) pour les filières fondamentales et masters d'excellence (<strong>MIO</strong>, <strong>MTH</strong>, <strong>SEG</strong>, <strong>LAC</strong>, <strong>LEA</strong>, <strong>MIDIA</strong> et <strong>MACI</strong>).
            </p>
            <div class="flex items-center gap-3 pt-2">
                <a href="{{ route('filieres.show', 'MIO') }}" class="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors">Explorer les Cours</a>
                <a href="#activites" class="px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold rounded-xl text-xs transition-colors">Activités de l'Amicale</a>
            </div>
        </div>
    </div>

    <!-- Section Activités de l'Amicale (Historique & Actualités) -->
    <div id="activites" class="bg-gradient-to-br from-[#0f2b4c] to-slate-900 rounded-3xl p-8 text-white shadow-xl space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
                <span class="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">Espace Vie Étudiante & Mémoire</span>
                <h2 class="text-2xl font-black">Activités de l'Amicale des Étudiants</h2>
                <p class="text-xs text-slate-300 mt-1">Revue historique des présidents et figures emblématiques, rédactions, actualités, photos et vidéos de nos événements.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white/10 rounded-2xl p-6 border border-white/15 space-y-3">
                <h3 class="text-lg font-bold text-amber-300">Revue Historique</h3>
                <p class="text-xs text-slate-300 leading-relaxed">Portraits, commentaires biographiques et réalisations des présidents fondateurs et figures de l'UFR SES.</p>
                <div class="text-xs font-bold text-amber-300 pt-2">Historique de l'Amicale →</div>
            </div>
            <div class="bg-white/10 rounded-2xl p-6 border border-white/15 space-y-3">
                <h3 class="text-lg font-bold text-amber-300">Actualités & Rédactions</h3>
                <p class="text-xs text-slate-300 leading-relaxed">Articles de fond rédigés par l'équipe administrative et les administrateurs secondaires, journées d'intégration et vidéos.</p>
                <div class="text-xs font-bold text-amber-300 pt-2">Fil d'actualité universitaire →</div>
            </div>
        </div>
    </div>

    <!-- Les 5 Filières Imagées -->
    <div class="space-y-6">
        <h2 class="text-2xl font-extrabold text-[#0f2b4c]">Filières de Formation · UFR SES</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @foreach($filieres as $filiere)
                <a href="{{ route('filieres.show', $filiere->id) }}" class="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-400 transition-all flex flex-col">
                    <div class="relative h-44 w-full bg-slate-900 overflow-hidden">
                        <img src="{{ $filiere->cover_image ?? asset('images/filiere_mio.jpg') }}" alt="{{ $filiere->name }}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                        <div class="absolute top-3 left-3 bg-[#0f2b4c]/90 text-white px-2.5 py-1 rounded-lg text-xs font-black">{{ $filiere->code }}</div>
                        <div class="absolute bottom-3 left-3 right-3 text-white">
                            <h3 class="text-sm font-bold line-clamp-1">{{ $filiere->name }}</h3>
                            <p class="text-[11px] text-amber-300 line-clamp-1">{{ $filiere->department }}</p>
                        </div>
                    </div>
                    <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed">{{ $filiere->description }}</p>
                        <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>{{ $filiere->courses_count }} cours · {{ $filiere->exams_count }} examens · {{ $filiere->td_count }} TD/TP</span>
                            <span class="text-amber-700 font-bold">Consulter →</span>
                        </div>
                    </div>
                </a>
            @endforeach
        </div>
    </div>
</div>
@endsection
