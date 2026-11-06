@extends('layouts.app')

@section('title', 'Connexion - AE UFR SES Biblio')

@section('content')
<div class="max-w-md mx-auto my-8">
    <div class="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <!-- En-tête avec le logo officiel de l'Amicale -->
        <div class="bg-[#0f2b4c] text-white p-8 text-center space-y-3">
            <img src="{{ asset('images/amicale_logo.png') }}" alt="Logo Amicale UFR SES" class="w-24 h-24 mx-auto rounded-full shadow-lg">
            <div>
                <h2 class="text-xl font-black">Connexion à l'Espace Sécurisé</h2>
                <p class="text-xs text-amber-300">UFR Sciences Économiques et Sociales · UIDT</p>
            </div>
        </div>

        <div class="p-6 space-y-4">
            <p class="text-xs text-slate-600 text-center leading-relaxed">
                Connectez-vous avec votre adresse email (administrateur ou étudiant) ou votre numéro INE étudiant.
            </p>

            <!-- Formulaire de Connexion Unifié -->
            <form action="{{ route('login.post') }}" method="POST" class="space-y-4">
                @csrf

                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Identifiant (Email ou Numéro INE)
                    </label>
                    <input type="text" name="email_or_ine" value="{{ old('email_or_ine') }}" required placeholder="ex: N01284917245 ou adminhyjazi@gmail.com" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:border-[#0f2b4c] outline-none">
                </div>

                <div>
                    <div class="flex items-center justify-between mb-1">
                        <label class="text-xs font-bold text-slate-700 uppercase tracking-wider">Mot de passe</label>
                        <a href="javascript:void(0)" onclick="openResetModal()" class="text-[11px] text-amber-700 font-semibold hover:underline">Mot de passe oublié ?</a>
                    </div>
                    <input type="password" name="password" required placeholder="••••••••••••" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:border-[#0f2b4c] outline-none">
                </div>

                <button type="submit" class="w-full py-3 bg-[#0f2b4c] hover:bg-[#163a66] text-white font-bold text-xs rounded-xl shadow-md transition-colors">
                    Se connecter
                </button>
            </form>
        </div>

        <div class="bg-slate-50 border-t border-slate-200 p-4 text-center text-xs text-slate-600">
            Nouvel étudiant ? <a href="{{ route('register') }}" class="font-bold text-[#0f2b4c] hover:underline">Créer votre compte avec votre INE</a>
        </div>
    </div>
</div>
@endsection
