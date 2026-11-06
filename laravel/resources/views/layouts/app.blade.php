<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'AE UFR SES Biblio - Université Iba Der Thiam de Thiès')</title>
    <meta name="description" content="Bibliothèque numérique officielle de l'Amicale des Étudiants de l'UFR Sciences Économiques et Sociales (AE UFR SES Biblio) - Université Iba Der Thiam de Thiès (UIDT)">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        h1, h2, h3, h4, h5 { font-family: 'Outfit', sans-serif; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col selection:bg-amber-500 selection:text-white">

    <!-- En-tête Navigation -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-18">
                <!-- Zone Marque -->
                <a href="{{ route('home') }}" class="flex items-center gap-3">
                    <img src="{{ asset('images/amicale_logo.png') }}" alt="Logo Amicale UFR SES" class="w-11 h-11 object-contain rounded-full shadow-xs">
                    <div>
                        <span class="text-lg font-extrabold text-[#0f2b4c] leading-none block">AE UFR SES Biblio</span>
                        <span class="text-[11px] font-semibold text-amber-700 tracking-wide">Bibliothèque Numérique · UIDT Thiès</span>
                    </div>
                </a>

                <!-- Liens de Navigation -->
                <nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
                    <a href="{{ route('home') }}" class="hover:text-[#0f2b4c] transition-colors">Accueil</a>
                    <a href="{{ route('filieres.show', 'MIO') }}" class="hover:text-[#0f2b4c] transition-colors">Filières & Cours</a>
                    <a href="{{ route('home') }}#activites" class="hover:text-[#0f2b4c] transition-colors">Activités de l'Amicale</a>
                    @if(Auth::guard('student')->check())
                        <a href="{{ route('student.dashboard') }}" class="hover:text-[#0f2b4c] transition-colors">Mon Espace Étudiant</a>
                    @endif
                    @if(Auth::check() && !Auth::guard('student')->check())
                        <a href="{{ route('admin.dashboard') }}" class="hover:text-[#0f2b4c] transition-colors flex items-center gap-1.5 text-amber-800 font-bold">
                            <span>Administration</span>
                        </a>
                    @endif
                </nav>

                <!-- Actions Profil / Connexion -->
                <div class="hidden md:flex items-center gap-3">
                    @if(Auth::guard('student')->check())
                        <span class="text-xs font-bold text-slate-800">{{ Auth::guard('student')->user()->full_name }} (INE: {{ Auth::guard('student')->user()->ine }})</span>
                        <form action="{{ route('logout') }}" method="POST" class="inline">
                            @csrf
                            <button type="submit" class="text-xs text-red-600 font-bold hover:underline">Déconnexion</button>
                        </form>
                    @elseif(Auth::check())
                        <span class="text-xs font-bold text-[#0f2b4c]">Admin: {{ Auth::user()->name }}</span>
                        <form action="{{ route('logout') }}" method="POST" class="inline">
                            @csrf
                            <button type="submit" class="text-xs text-red-600 font-bold hover:underline">Déconnexion</button>
                        </form>
                    @else
                        <a href="{{ route('login') }}" class="px-4 py-2 text-xs font-bold text-[#0f2b4c] hover:bg-slate-100 rounded-lg">Connexion</a>
                        <a href="{{ route('register') }}" class="px-4 py-2 text-xs font-bold text-white bg-[#0f2b4c] hover:bg-[#163a66] rounded-lg shadow-xs">Inscription (INE)</a>
                    @endif
                </div>
            </div>
        </div>
    </header>

    <!-- Messages Flash -->
    @if(session('success'))
        <div class="max-w-7xl mx-auto px-4 mt-4">
            <div class="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium">
                {{ session('success') }}
            </div>
        </div>
    @endif
    @if($errors->any())
        <div class="max-w-7xl mx-auto px-4 mt-4">
            <div class="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl font-medium">
                {{ $errors->first() }}
            </div>
        </div>
    @endif

    <!-- Contenu Principal -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        @yield('content')
    </main>

    <!-- Pied de page -->
    <footer class="bg-[#0a1d33] text-white border-t border-slate-800 py-10 mt-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400 space-y-2">
            <p class="font-semibold text-white">© 2026 Université Iba Der Thiam de Thiès · Amicale des Étudiants UFR SES</p>
            <p>Application Laravel 11 - AE UFR SES Biblio · Filières : MIO, MTH, SEG, LAC, LEA</p>
        </div>
    </footer>

</body>
</html>
