<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use App\Models\Filiere;
use App\Models\VerificationCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function showLogin()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email_or_ine' => 'required|string',
            'password' => 'required|string',
        ]);

        $query = trim($request->email_or_ine);

        // 1. Vérification automatique si c'est un compte Administrateur
        $user = User::where('email', strtolower($query))->first();

        if ($user) {
            if (!Hash::check($request->password, $user->password)) {
                return back()->withErrors(['email_or_ine' => 'Mot de passe administrateur incorrect.'])->withInput();
            }

            if ($user->isBlocked()) {
                return back()->withErrors(['email_or_ine' => 'Ce compte administrateur a été suspendu par le Super Administrateur.'])->withInput();
            }

            // Génération du code 2FA envoyé par email
            $code = str_pad((string)random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
            VerificationCode::create([
                'email' => $user->email,
                'code' => $code,
                'purpose' => 'admin_2fa',
                'expires_at' => now()->addMinutes(15),
            ]);

            session(['pending_admin_id' => $user->id, 'pending_admin_email' => $user->email]);

            return redirect()->route('admin.2fa')->with('info', "Code de sécurité 2FA envoyé à votre adresse email {$user->email}.");
        }

        // 2. Connexion Étudiant (via Email ou Numéro INE)
        $student = Student::where('email', strtolower($query))
            ->orWhere('ine', strtoupper($query))
            ->first();

        if (!$student || !Hash::check($request->password, $student->password)) {
            return back()->withErrors(['email_or_ine' => 'Aucun compte trouvé ou mot de passe incorrect.'])->withInput();
        }

        if ($student->isBlocked()) {
            return back()->withErrors(['email_or_ine' => 'Votre accès étudiant a été restreint. Veuillez contacter la scolarité.'])->withInput();
        }

        Auth::guard('student')->login($student);

        return redirect()->route('student.dashboard')->with('success', "Bienvenue sur votre espace étudiant, {$student->full_name} !");
    }

    public function show2fa()
    {
        $email = session('pending_admin_email');
        if (!$email) return redirect()->route('login');
        return view('auth.2fa', compact('email'));
    }

    public function verify2fa(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $email = session('pending_admin_email');
        $adminId = session('pending_admin_id');

        if (!$email || !$adminId) {
            return redirect()->route('login')->withErrors(['email_or_ine' => 'Session expirée. Veuillez vous reconnecter.']);
        }

        $codeRecord = VerificationCode::where('email', $email)
            ->where('code', $request->code)
            ->where('purpose', 'admin_2fa')
            ->where('used', false)
            ->where('expires_at', '>', now())
            ->first();

        if (!$codeRecord) {
            return back()->withErrors(['code' => 'Code de sécurité 2FA incorrect ou expiré.']);
        }

        $codeRecord->update(['used' => true]);

        $user = User::find($adminId);
        Auth::login($user);
        $user->update(['last_login_at' => now()]);

        session()->forget(['pending_admin_id', 'pending_admin_email']);

        return redirect()->route('admin.dashboard')->with('success', "Connexion 2FA réussie ! Bienvenue, {$user->name}.");
    }

    public function showRegister()
    {
        $filieres = Filiere::all();
        return view('auth.register', compact('filieres'));
    }

    public function register(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email',
            'ine' => 'required|string|min:8|max:30|unique:students,ine',
            'filiere_id' => 'required|exists:filieres,id',
            'level' => 'required|string',
            'phone' => 'nullable|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $student = Student::create([
            'full_name' => $request->full_name,
            'email' => strtolower($request->email),
            'ine' => strtoupper(trim($request->ine)),
            'filiere_id' => $request->filiere_id,
            'level' => $request->level,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'status' => 'actif',
        ]);

        Auth::guard('student')->login($student);

        return redirect()->route('student.dashboard')->with('success', 'Inscription validée avec succès !');
    }

    // --- WORKFLOW CODE DE VÉRIFICATION PAR EMAIL (6 CHIFFRES) ---
    public function sendVerificationCode(Request $request)
    {
        $request->validate([
            'email_or_ine' => 'required|string',
        ]);

        $query = trim($request->email_or_ine);
        $student = Student::where('email', strtolower($query))
            ->orWhere('ine', strtoupper($query))
            ->first();

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun compte étudiant ne correspond à cette adresse email ou ce numéro INE.',
            ], 404);
        }

        // Génération du code OTP à 6 chiffres
        $code = (string) rand(100000, 999999);

        // Expiration à 15 minutes
        VerificationCode::create([
            'email' => $student->email,
            'ine' => $student->ine,
            'code' => $code,
            'purpose' => 'password_reset',
            'expires_at' => now()->addMinutes(15),
            'used' => false,
        ]);

        // Envoi réel du courriel ou simulation
        // Mail::to($student->email)->send(new \App\Mail\VerificationCodeMail($code, $student->full_name));

        return response()->json([
            'success' => true,
            'message' => "Un code de sécurité à 6 chiffres a été expédié à l'adresse {$student->email}.",
            'code' => $code, // inclus pour environnement de démonstration
            'email' => $student->email,
        ]);
    }

    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        $record = VerificationCode::where('email', strtolower($request->email))
            ->where('code', $request->code)
            ->where('used', false)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if (!$record) {
            return response()->json([
                'success' => false,
                'message' => 'Code de vérification invalide ou expiré.',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Code validé avec succès. Vous pouvez maintenant définir votre nouveau mot de passe.',
        ]);
    }

    public function resetPasswordWithCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $record = VerificationCode::where('email', strtolower($request->email))
            ->where('code', $request->code)
            ->where('used', false)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if (!$record) {
            return back()->withErrors(['code' => 'Code expiré ou invalide.']);
        }

        $student = Student::where('email', strtolower($request->email))->firstOrFail();
        $student->update(['password' => Hash::make($request->password)]);
        $record->update(['used' => true]);

        return redirect()->route('login')->with('success', 'Votre mot de passe a été mis à jour avec succès !');
    }

    public function logout(Request $request)
    {
        if (Auth::guard('student')->check()) {
            Auth::guard('student')->logout();
        }
        if (Auth::check()) {
            Auth::logout();
        }

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home')->with('success', 'Vous avez été déconnecté avec succès.');
    }
}
