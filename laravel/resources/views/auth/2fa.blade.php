@extends('layouts.app')

@section('title', 'Validation 2FA - AE UFR SES Biblio')

@section('content')
<div class="max-w-md mx-auto my-8">
    <div class="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div class="bg-[#0f2b4c] text-white p-8 text-center space-y-2">
            <h2 class="text-xl font-black">Validation de Sécurité Administrateur</h2>
            <p className="text-xs text-amber-300">Authentification à deux facteurs (2FA)</p>
        </div>

        <div class="p-6 space-y-4">
            <div class="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
                Un <strong>code de validation à 6 chiffres</strong> a été envoyé à votre adresse email universitaire : <strong>{{ $email }}</strong>. Saisissez ce code pour valider votre accès.
            </div>

            @if($errors->any())
                <div class="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                    {{ $errors->first() }}
                </div>
            @endif

            <form action="{{ route('admin.2fa.post') }}" method="POST" class="space-y-4">
                @csrf
                <div>
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                        Code de sécurité reçu par email (6 chiffres)
                    </label>
                    <input
                        type="text"
                        name="code"
                        maxlength="6"
                        required
                        autofocus
                        placeholder="123456"
                        class="w-full py-3 bg-slate-50 border-2 border-slate-300 focus:border-[#0f2b4c] rounded-xl text-center text-2xl font-mono font-bold tracking-widest outline-none"
                    >
                </div>

                <div class="flex items-center gap-2 pt-2">
                    <a href="{{ route('login') }}" class="px-3 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50">
                        Retour
                    </a>
                    <button type="submit" class="flex-1 py-3 bg-[#0f2b4c] hover:bg-[#163a66] text-white font-bold text-xs rounded-xl shadow-md transition-colors">
                        Valider et accéder à la console
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
