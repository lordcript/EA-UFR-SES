<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Table des Utilisateurs & Administrateurs
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', ['superadmin', 'admin', 'moderateur'])->default('admin');
            $table->string('filiere_assigned')->default('ALL');
            $table->boolean('is_blocked')->default(false);
            $table->timestamp('last_login_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        // 2. Table des Filières (MIO, MTH, SEG, LAC, LEA)
        Schema::create('filieres', function (Blueprint $table) {
            $table->string('id', 10)->primary(); // MIO, MTH, SEG, LAC, LEA
            $table->string('code', 10);
            $table->string('name');
            $table->string('department');
            $table->text('description')->nullable();
            $table->json('levels')->nullable(); // ['Licence 1', 'Licence 2', ...]
            $table->string('cover_image')->nullable();
            $table->string('badge_color')->default('bg-blue-600');
            $table->timestamps();
        });

        // 3. Table des Étudiants Inscrits
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('ine', 30)->unique(); // Numéro INE universitaire (ex: N01284917245)
            $table->string('email')->unique();
            $table->string('full_name');
            $table->string('filiere_id', 10);
            $table->string('level', 30); // Licence 1, Licence 2, etc.
            $table->string('phone', 30)->nullable();
            $table->string('password');
            $table->enum('status', ['actif', 'bloque'])->default('actif');
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamps();

            $table->foreign('filiere_id')->references('id')->on('filieres')->onDelete('cascade');
        });

        // 4. Table des Ressources Académiques (Cours, TD, TP, Examens)
        Schema::create('academic_resources', function (Blueprint $table) {
            $table->id();
            $table->string('filiere_id', 10);
            $table->enum('type', ['cours', 'examen', 'td', 'tp']);
            $table->string('title');
            $table->string('code_ue', 20); // ex: MIO-201
            $table->string('module_name');
            $table->string('level', 30);
            $table->string('semester', 30);
            $table->enum('format', ['pdf', 'video', 'photo', 'csv', 'xlsx']);
            $table->string('file_url');
            $table->string('file_name');
            $table->string('file_size', 20);
            $table->string('author')->default('Enseignant UFR SES');
            $table->string('academic_year', 20)->default('2025-2026');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('downloads_count')->default(0);
            $table->timestamps();

            $table->foreign('filiere_id')->references('id')->on('filieres')->onDelete('cascade');
        });

        // 5. Table des Codes de Vérification par Email (OTP à 6 chiffres)
        Schema::create('verification_codes', function (Blueprint $table) {
            $table->id();
            $table->string('email');
            $table->string('ine')->nullable();
            $table->string('code', 6);
            $table->string('purpose')->default('password_reset');
            $table->boolean('used')->default(false);
            $table->timestamp('expires_at');
            $table->timestamps();
        });

        // 6. Table des Paramètres et Images de la Plateforme
        Schema::create('site_settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('site_settings');
        Schema::dropIfExists('verification_codes');
        Schema::dropIfExists('academic_resources');
        Schema::dropIfExists('students');
        Schema::dropIfExists('filieres');
        Schema::dropIfExists('users');
        Schema::enableForeignKeyConstraints();
    }
};
