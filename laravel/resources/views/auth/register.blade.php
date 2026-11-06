@extends('layouts.app')

@section('title', 'Inscription Étudiant - AE UFR SES Biblio')

@section('content')
<div class="max-w-xl mx-auto my-8">
    <div class="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <!-- En-tête avec Sceau de l'Amicale -->
        <div class="bg-[#0f2b4c] text-white p-8 text-center space-y-3">
            <img src="{{ asset('images/amicale_logo.png') }}" alt="Logo Amicale UFR SES" class="w-24 h-24 mx-auto rounded-full shadow-lg">
            <div>
                <h2 class="text-xl font-black">Inscription des Étudiants · UFR SES</h2>
                <p class="text-xs text-amber-300">Université Iba Der Thiam de Thiès · Amicale des Étudiants</p>
            </div>
        </div>

        <div class="p-6 md:p-8 space-y-4">
            <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                <strong>Numéro INE universitaire :</strong> Renseignez impérativement votre numéro officiel d'identification nationale étudiante. Vous pourrez par la suite modifier votre mot de passe via un code de validation à 6 chiffres envoyé sur votre boîte mail.
            </div>

            <form action="{{ route('register.post') }}" method="POST" class="space-y-4">
                @csrf

                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nom et Prénom *</label>
                    <input type="text" name="full_name" value="{{ old('full_name') }}" required placeholder="ex: Cheikh Tidiane Sène" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:border-[#0f2b4c] outline-none">
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Universitaire *</label>
                        <input type="email" name="email" value="{{ old('email') }}" required placeholder="etudiant@univ-thies.sn" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:border-[#0f2b4c] outline-none">
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Numéro INE Universitaire *</label>
                        <input type="text" name="ine" value="{{ old('ine') }}" required placeholder="ex: N0148920184" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:border-[#0f2b4c] outline-none">
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Filière d'affectation *</label>
                        <select name="filiere_id" required class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold focus:border-[#0f2b4c] outline-none">
                            @foreach($filieres as $f)
                                <option value="{{ $f->id }}">{{ $f->code }} - {{ $f->name }}</option>
                            @endforeach
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Niveau d'études *</label>
                        <select name="level" required class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:border-[#0f2b4c] outline-none">
                            <option value="Licence 1">Licence 1 (L1)</option>
                            <option value="Licence 2">Licence 2 (L2)</option>
                            <option value="Licence 3">Licence 3 (L3)</option>
                            <option value="Master 1">Master 1 (M1)</option>
                            <option value="Master 2">Master 2 (M2)</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Mot de passe *</label>
                        <input type="password" name="password" required placeholder="Min. 6 caractères" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:border-[#0f2b4c] outline-none">
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Confirmer mot de passe *</label>
                        <input type="password" name="password_confirmation" required placeholder="Répéter mot de passe" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:border-[#0f2b4c] outline-none">
                    </div>
                </div>

                <button type="submit" class="w-full py-3 bg-[#0f2b4c] hover:bg-[#163a66] text-white font-bold text-xs rounded-xl shadow-md transition-colors mt-2">
                    Créer mon compte étudiant
                </button>
            </form>
        </div>

        <div class="bg-slate-50 border-t border-slate-200 p-4 text-center text-xs text-slate-600">
            Déjà inscrit ? <a href="{{ route('login') }}" class="font-bold text-[#0f2b4c] hover:underline">Se connecter</a>
        </div>
    </div>
</div>
@endsection
