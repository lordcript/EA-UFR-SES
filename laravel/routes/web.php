<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\FiliereController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\StudentMiddleware;

/*
|--------------------------------------------------------------------------
| Web Routes - AE UFR SES Biblio (Université Iba Der Thiam de Thiès)
|--------------------------------------------------------------------------
*/

// Accueil
Route::get('/', [HomeController::class, 'index'])->name('home');

// Filières & Cours (MIO, MTH, SEG, LAC, LEA)
Route::get('/filieres/{id}', [FiliereController::class, 'show'])->name('filieres.show');

// Téléchargement sécurisé des documents
Route::get('/resources/{resource}/download', [ResourceController::class, 'download'])->name('resources.download');

// Authentification & Inscription
Route::get('/connexion', [AuthController::class, 'showLogin'])->name('login');
Route::post('/connexion', [AuthController::class, 'login'])->name('login.post');
Route::get('/connexion/2fa', [AuthController::class, 'show2fa'])->name('admin.2fa');
Route::post('/connexion/2fa', [AuthController::class, 'verify2fa'])->name('admin.2fa.post');
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

    // Gestion des cours, TD, TP, examens
    Route::post('/resources', [AdminDashboardController::class, 'storeResource'])->name('resources.store');
    Route::delete('/resources/{resource}', [AdminDashboardController::class, 'destroyResource'])->name('resources.destroy');

    // Modification des images de l'application
    Route::post('/images', [AdminDashboardController::class, 'updateImages'])->name('images.update');

    // Gestion des administrateurs (ajout, blocage, suppression)
    Route::post('/administrateurs', [AdminDashboardController::class, 'storeAdmin'])->name('admins.store');
    Route::post('/administrateurs/{user}/toggle-block', [AdminDashboardController::class, 'toggleBlockAdmin'])->name('admins.toggle_block');
    Route::delete('/administrateurs/{user}', [AdminDashboardController::class, 'destroyAdmin'])->name('admins.destroy');

    // Gestion des étudiants (statuts)
    Route::post('/etudiants/{student}/toggle-block', [AdminDashboardController::class, 'toggleBlockStudent'])->name('students.toggle_block');
});
