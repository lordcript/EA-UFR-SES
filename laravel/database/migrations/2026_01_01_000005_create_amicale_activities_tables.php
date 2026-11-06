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
        // Table des Figures Historiques (Revue Historique de l'UFR SES & de l'Amicale)
        Schema::create('historical_figures', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('title'); // ex: Doyen Fondateur, Président Honoraire de l'Amicale
            $table->string('period')->nullable(); // ex: 2008 - 2016
            $table->string('photo_url')->nullable();
            $table->text('biography');
            $table->text('contributions')->nullable();
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });

        // Table des Actualités et Rédactions de l'Amicale
        Schema::create('amicale_news', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('theme')->default('Général'); // ex: Pédagogie, Vie de campus, Innovation
            $table->text('summary')->nullable();
            $table->longText('content');
            $table->string('author_name')->default("Bureau Exécutif AE UFR SES");
            $table->string('category')->default('actualite'); // actualite, evenement, communique
            $table->json('photos')->nullable();
            $table->string('video_url')->nullable();
            $table->boolean('is_pinned')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('amicale_news');
        Schema::dropIfExists('historical_figures');
    }
};
