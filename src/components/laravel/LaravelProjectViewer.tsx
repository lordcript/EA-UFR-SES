import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Download,
  FileCode,
  Folder,
  CheckCircle,
  Copy,
  Terminal,
  Server,
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface FileItem {
  path: string;
  name: string;
  category: 'Routes' | 'Controllers' | 'Models' | 'Migrations & Seeders' | 'Blade Views' | 'Déploiement';
  language: string;
  content: string;
}

export const LaravelProjectViewer: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>('routes/web.php');
  const [copied, setCopied] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  // Repository of Laravel 11 project files for instant inspection and zip packaging
  const files: FileItem[] = [
    {
      path: 'composer.json',
      name: 'composer.json',
      category: 'Déploiement',
      language: 'json',
      content: `{
    "name": "uidt/programme-ufr-ses",
    "type": "project",
    "description": "Portail Académique UIDTprogramme UFR SES - Université Iba Der Thiam de Thiès",
    "license": "MIT",
    "require": {
        "php": "^8.2",
        "laravel/framework": "^11.0",
        "laravel/sanctum": "^4.0",
        "laravel/tinker": "^2.9"
    },
    "autoload": {
        "psr-4": {
            "App\\\\": "app/",
            "Database\\\\Factories\\\\": "database/factories/",
            "Database\\\\Seeders\\\\": "database/seeders/"
        }
    }
}`,
    },
    {
      path: 'routes/web.php',
      name: 'web.php',
      category: 'Routes',
      language: 'php',
      content: `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\HomeController;
use App\\Http\\Controllers\\FiliereController;
use App\\Http\\Controllers\\ResourceController;
use App\\Http\\Controllers\\AuthController;
use App\\Http\\Controllers\\StudentController;
use App\\Http\\Controllers\\AdminDashboardController;
use App\\Http\\Middleware\\AdminMiddleware;
use App\\Http\\Middleware\\StudentMiddleware;

/*
|--------------------------------------------------------------------------
| Web Routes - UIDTprogramme UFR SES (Université Iba Der Thiam de Thiès)
|--------------------------------------------------------------------------
*/

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/filieres/{id}', [FiliereController::class, 'show'])->name('filieres.show');
Route::get('/resources/{resource}/download', [ResourceController::class, 'download'])->name('resources.download');

// Authentification & Inscription
Route::get('/connexion', [AuthController::class, 'showLogin'])->name('login');
Route::post('/connexion', [AuthController::class, 'login'])->name('login.post');
Route::get('/inscription', [AuthController::class, 'showRegister'])->name('register');
Route::post('/inscription', [AuthController::class, 'register'])->name('register.post');
Route::post('/deconnexion', [AuthController::class, 'logout'])->name('logout');

// Workflow Code de vérification par email (OTP à 6 chiffres)
Route::post('/auth/password/send-code', [AuthController::class, 'sendVerificationCode'])->name('password.send_code');
Route::post('/auth/password/verify-code', [AuthController::class, 'verifyCode'])->name('password.verify_code');
Route::post('/auth/password/reset', [AuthController::class, 'resetPasswordWithCode'])->name('password.reset_with_code');

// Espace Étudiant (Protégé)
Route::middleware([StudentMiddleware::class])->prefix('etudiant')->name('student.')->group(function () {
    Route::get('/tableau-de-bord', [StudentController::class, 'dashboard'])->name('dashboard');
    Route::post('/modifier-mot-de-passe', [StudentController::class, 'updatePassword'])->name('update_password');
});

// Espace Administrateur (Protégé)
Route::middleware([AdminMiddleware::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/tableau-de-bord', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::post('/resources', [AdminDashboardController::class, 'storeResource'])->name('resources.store');
    Route::delete('/resources/{resource}', [AdminDashboardController::class, 'destroyResource'])->name('resources.destroy');
    Route::post('/images', [AdminDashboardController::class, 'updateImages'])->name('images.update');
    Route::post('/administrateurs', [AdminDashboardController::class, 'storeAdmin'])->name('admins.store');
    Route::post('/administrateurs/{user}/toggle-block', [AdminDashboardController::class, 'toggleBlockAdmin'])->name('admins.toggle_block');
    Route::delete('/administrateurs/{user}', [AdminDashboardController::class, 'destroyAdmin'])->name('admins.destroy');
    Route::post('/etudiants/{student}/toggle-block', [AdminDashboardController::class, 'toggleBlockStudent'])->name('students.toggle_block');
});`,
    },
    {
      path: 'app/Http/Controllers/AuthController.php',
      name: 'AuthController.php',
      category: 'Controllers',
      language: 'php',
      content: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\User;
use App\\Models\\Student;
use App\\Models\\VerificationCode;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;
use Illuminate\\Support\\Facades\\Hash;

class AuthController extends Controller
{
    // Authentification Administrateur (adminhyjazi@gmail.com) ou Étudiant (Numéro INE)
    public function login(Request $request)
    {
        $request->validate([
            'email_or_ine' => 'required|string',
            'password' => 'required|string',
            'role' => 'required|in:etudiant,admin',
        ]);

        if ($request->role === 'admin') {
            $user = User::where('email', strtolower($request->email_or_ine))->first();
            if (!$user || !Hash::check($request->password, $user->password) || $user->isBlocked()) {
                return back()->withErrors(['email_or_ine' => 'Accès refusé ou identifiants incorrects.']);
            }
            Auth::login($user);
            return redirect()->route('admin.dashboard');
        }

        // Étudiant via Email ou Numéro INE
        $student = Student::where('email', strtolower($request->email_or_ine))
            ->orWhere('ine', strtoupper($request->email_or_ine))
            ->first();

        if (!$student || !Hash::check($request->password, $student->password) || $student->isBlocked()) {
            return back()->withErrors(['email_or_ine' => 'Numéro INE ou mot de passe erroné.']);
        }

        Auth::guard('student')->login($student);
        return redirect()->route('student.dashboard');
    }

    // Code de vérification par email à 6 chiffres
    public function sendVerificationCode(Request $request)
    {
        $student = Student::where('email', $request->email_or_ine)
            ->orWhere('ine', $request->email_or_ine)->firstOrFail();

        $code = (string) rand(100000, 999999);
        VerificationCode::create([
            'email' => $student->email,
            'ine' => $student->ine,
            'code' => $code,
            'expires_at' => now()->addMinutes(15),
        ]);

        return response()->json(['success' => true, 'code' => $code, 'email' => $student->email]);
    }
}`,
    },
    {
      path: 'app/Http/Controllers/AdminDashboardController.php',
      name: 'AdminDashboardController.php',
      category: 'Controllers',
      language: 'php',
      content: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\User;
use App\\Models\\Student;
use App\\Models\\Filiere;
use App\\Models\\AcademicResource;
use App\\Models\\SiteSetting;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Hash;
use Illuminate\\Support\\Facades\\Storage;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        $filieres = Filiere::all();
        $admins = User::latest()->get();
        $students = Student::latest()->paginate(15);
        $resources = AcademicResource::latest()->paginate(15);
        return view('admin.dashboard', compact('filieres', 'admins', 'students', 'resources'));
    }

    // Ajout d'une ressource (PDF, Vidéo, Photo, CSV, XLSX)
    public function storeResource(Request $request)
    {
        $data = $request->validate([
            'filiere_id' => 'required',
            'type' => 'required|in:cours,examen,td,tp',
            'title' => 'required',
            'code_ue' => 'required',
            'module_name' => 'required',
            'level' => 'required',
            'semester' => 'required',
            'format' => 'required|in:pdf,video,photo,csv,xlsx',
        ]);

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('resources', 'public');
            $data['file_url'] = Storage::url($path);
        }

        AcademicResource::create($data);
        return back()->with('success', 'Document pédagogique ajouté avec succès !');
    }

    // Gestion des administrateurs (Bloquer, Débloquer, Supprimer)
    public function toggleBlockAdmin(User $user)
    {
        if (strtolower($user->email) === 'adminhyjazi@gmail.com') {
            return back()->withErrors(['error' => 'Action interdite sur le Super Admin.']);
        }
        $user->update(['is_blocked' => !$user->is_blocked]);
        return back()->with('success', 'Statut administrateur modifié.');
    }
}`,
    },
    {
      path: 'database/migrations/2026_01_01_000001_create_all_uidt_tables.php',
      name: 'create_all_uidt_tables.php',
      category: 'Migrations & Seeders',
      language: 'php',
      content: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', ['superadmin', 'admin', 'moderateur'])->default('admin');
            $table->boolean('is_blocked')->default(false);
            $table->timestamps();
        });

        Schema::create('filieres', function (Blueprint $table) {
            $table->string('id', 10)->primary(); // MIO, MTH, SEG, LAC, LEA
            $table->string('code', 10);
            $table->string('name');
            $table->string('department');
            $table->text('description')->nullable();
            $table->json('levels')->nullable();
            $table->string('cover_image')->nullable();
            $table->timestamps();
        });

        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('ine', 30)->unique();
            $table->string('email')->unique();
            $table->string('full_name');
            $table->string('filiere_id', 10);
            $table->string('level', 30);
            $table->string('password');
            $table->enum('status', ['actif', 'bloque'])->default('actif');
            $table->timestamps();
        });

        Schema::create('academic_resources', function (Blueprint $table) {
            $table->id();
            $table->string('filiere_id', 10);
            $table->enum('type', ['cours', 'examen', 'td', 'tp']);
            $table->string('title');
            $table->string('code_ue', 20);
            $table->string('module_name');
            $table->string('level', 30);
            $table->string('semester', 30);
            $table->enum('format', ['pdf', 'video', 'photo', 'csv', 'xlsx']);
            $table->string('file_url');
            $table->timestamps();
        });
    }
};`,
    },
    {
      path: 'database/seeders/DatabaseSeeder.php',
      name: 'DatabaseSeeder.php',
      category: 'Migrations & Seeders',
      language: 'php',
      content: `<?php

namespace Database\\Seeders;

use App\\Models\\User;
use App\\Models\\Filiere;
use Illuminate\\Database\\Seeder;
use Illuminate\\Support\\Facades\\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Super Administrateur Principal (idrissa.hyjazi@univ-thies.sn & adminhyjazi@gmail.com)
        User::updateOrCreate(
            ['email' => 'idrissa.hyjazi@univ-thies.sn'],
            [
                'name' => 'Idrissa Hyjazi (Super Admin UFR SES)',
                'password' => Hash::make('adminhyjazi1234'),
                'role' => 'superadmin',
                'is_blocked' => false,
            ]
        );
        User::updateOrCreate(
            ['email' => 'adminhyjazi@gmail.com'],
            [
                'name' => 'Idrissa Hyjazi (Compte Principal)',
                'password' => Hash::make('adminhyjazi1234'),
                'role' => 'superadmin',
                'is_blocked' => false,
            ]
        );

        // 2. Les 5 Filières : MIO, MTH, SEG, LAC, LEA
        $filieres = [
            ['id' => 'MIO', 'code' => 'MIO', 'name' => 'Management Informatisé des Organisations', 'department' => 'Département Informatique de Gestion'],
            ['id' => 'MTH', 'code' => 'MTH', 'name' => 'Management du Tourisme et de l\\'Hôtellerie', 'department' => 'Département Tourisme & Patrimoine'],
            ['id' => 'SEG', 'code' => 'SEG', 'name' => 'Sciences Économiques et de Gestion', 'department' => 'Département Économie Appliquée'],
            ['id' => 'LAC', 'code' => 'LAC', 'name' => 'Langues, Arts et Civilisations', 'department' => 'Département Langues, Arts & Civilisations'],
            ['id' => 'LEA', 'code' => 'LEA', 'name' => 'Langues Étrangères Appliquées', 'department' => 'Département Langues Vivantes'],
        ];

        foreach ($filieres as $f) {
            Filiere::updateOrCreate(['id' => $f['id']], $f);
        }
    }
}`,
    },
    {
      path: 'deploy.sh',
      name: 'deploy.sh',
      category: 'Déploiement',
      language: 'bash',
      content: `#!/usr/bin/env bash
set -e

echo "🚀 Déploiement en production de UIDTprogramme UFR SES..."
php artisan down || true
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan db:seed --force
php artisan storage:link || true
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan up
echo "✅ Application Laravel prête et déployée !"`,
    },
    {
      path: 'Dockerfile',
      name: 'Dockerfile',
      category: 'Déploiement',
      language: 'dockerfile',
      content: `FROM php:8.2-fpm-alpine
RUN apk add --no-cache nginx mysql-client libpng-dev libzip-dev
RUN docker-php-ext-install pdo_mysql mbstring zip bcmath
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html
COPY . /var/www/html
RUN chown -R www-data:www-data storage bootstrap/cache
EXPOSE 80
CMD ["sh", "-c", "php artisan migrate --force && php artisan db:seed --force && php-fpm"]`,
    },
    {
      path: 'docker-compose.yml',
      name: 'docker-compose.yml',
      category: 'Déploiement',
      language: 'yaml',
      content: `version: '3.8'
services:
  app:
    build: .
    ports:
      - "8000:80"
    environment:
      APP_NAME: "UIDTprogramme UFR SES"
      DB_CONNECTION: mysql
      DB_HOST: db
      DB_DATABASE: uidt_ufr_ses
    depends_on:
      - db
  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: uidt_ufr_ses
      MYSQL_ROOT_PASSWORD: secret_password`,
    },
    {
      path: 'resources/views/layouts/app.blade.php',
      name: 'app.blade.php',
      category: 'Blade Views',
      language: 'html',
      content: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>UIDTprogramme UFR SES - Université Iba Der Thiam de Thiès</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-900">
    <nav class="bg-white border-b border-slate-200 px-6 py-4 flex justify-between">
        <a href="/" class="text-lg font-bold text-[#0f2b4c]">UIDTprogramme UFR SES</a>
        <div class="flex gap-4">
            <a href="/">Accueil</a>
            <a href="/filieres/MIO">Filières & Cours</a>
            <a href="/connexion">Connexion</a>
        </div>
    </nav>
    <main class="max-w-7xl mx-auto p-6">@yield('content')</main>
</body>
</html>`,
    },
  ];

  const selectedFile = files.find(f => f.path === selectedFilePath) || files[1];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setDownloadingZip(true);
      const zip = new JSZip();

      // Add all project files into the zip archive
      files.forEach(file => {
        zip.file(file.path, file.content);
      });

      // Add extra essential Laravel 11 files
      zip.file(
        '.env.example',
        `APP_NAME="UIDTprogramme UFR SES"\nAPP_ENV=production\nAPP_KEY=\nAPP_DEBUG=false\nDB_CONNECTION=mysql\nDB_DATABASE=uidt_ufr_ses\n`
      );
      zip.file(
        'artisan',
        `#!/usr/bin/env php\n<?php\ndefine('LARAVEL_START', microtime(true));\nrequire __DIR__.'/vendor/autoload.php';\n$app = require_once __DIR__.'/bootstrap/app.php';\n$status = $app->handleCommand(new Symfony\\Component\\Console\\Input\\ArgvInput);\nexit($status);\n`
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'UIDTprogramme_UFR_SES_Laravel11_Projet_Complet.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-[#0f2b4c] text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30">
            <Server className="w-3.5 h-3.5" />
            <span>Architecture Laravel 11 · Prêt au Déploiement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Architecture & Code Source Laravel 11 (De A à Z)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Structure officielle MVC Laravel 11 : Routes, Contrôleurs, Modèles Eloquent, Migrations, Seeders (`adminhyjazi@gmail.com`), Vues Blade, Docker et script de déploiement automatique.
          </p>
        </div>

        <div>
          <button
            onClick={handleDownloadZip}
            disabled={downloadingZip}
            className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloadingZip ? 'Génération du ZIP...' : 'Télécharger Projet Laravel (.ZIP)'}</span>
          </button>
        </div>
      </div>

      {/* Deployment Quick Guide Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Terminal className="w-4 h-4 text-[#0f2b4c]" />
            <span>1. Installation Composer & Clé</span>
          </div>
          <code className="block bg-slate-100 p-2.5 rounded-lg text-[11px] font-mono text-slate-700">
            composer install --no-dev<br/>
            php artisan key:generate
          </code>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>2. Migrations & Initialisation</span>
          </div>
          <code className="block bg-slate-100 p-2.5 rounded-lg text-[11px] font-mono text-slate-700">
            php artisan migrate --seed<br/>
            php artisan storage:link
          </code>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Server className="w-4 h-4 text-amber-600" />
            <span>3. Déploiement 1-Clic Docker</span>
          </div>
          <code className="block bg-slate-100 p-2.5 rounded-lg text-[11px] font-mono text-slate-700">
            docker-compose up -d --build<br/>
            bash deploy.sh
          </code>
        </div>
      </div>

      {/* Interactive File Browser */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row min-h-[560px]">
        {/* Sidebar File Tree */}
        <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50/70 p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Folder className="w-4 h-4 text-[#0f2b4c]" />
              <span>Arborescence Laravel</span>
            </span>
            <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">
              {files.length} fichiers
            </span>
          </div>

          <div className="space-y-1 max-h-[500px] overflow-y-auto">
            {files.map((file) => {
              const isSelected = file.path === selectedFilePath;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#0f2b4c] text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`} />
                    <span className="truncate">{file.path}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold shrink-0 ml-1 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                    {file.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Content View */}
        <div className="flex-1 flex flex-col bg-slate-900 text-slate-100">
          <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs text-amber-400">
              <span className="text-slate-500">laravel/</span>
              <span className="font-bold">{selectedFile.path}</span>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>
          </div>

          <div className="flex-1 p-6 overflow-auto font-mono text-xs leading-relaxed">
            <pre className="text-slate-200 whitespace-pre-wrap select-all font-mono">
              {selectedFile.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
