<?php

namespace Database\Seeders;

use App\Models\HistoricalFigure;
use App\Models\AmicaleNews;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class AmicaleActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Figures Historiques de l'UFR SES et de l'Amicale
        HistoricalFigure::truncate();

        HistoricalFigure::create([
            'name' => 'Professeur Iba Der Thiam',
            'title' => 'Parrain Émérite de l\'Université & Historien d\'Exception',
            'period' => '1937 - 2020',
            'photo_url' => 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop',
            'biography' => 'Éminent historien, universitaire et homme d\'État sénégalais, le Professeur Iba Der Thiam a consacré sa vie à l\'éducation supérieure, à la recherche historique africaine et au rayonnement académique du Sénégal. L\'Université de Thiès porte fièrement son nom.',
            'contributions' => 'Pionnier de l\'Histoire Générale du Sénégal, artisan de la démocratisation du savoir universitaire et figure tutélaire inspirant les étudiants de l\'UFR SES.',
            'display_order' => 1,
        ]);

        HistoricalFigure::create([
            'name' => 'Professeur Ousmane Sène',
            'title' => 'Premier Directeur et Fondateur de l\'UFR SES',
            'period' => '2008 - 2015',
            'photo_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
            'biography' => 'Visionnaire académique, le Pr. Sène a posé les fondations solides de l\'Unité de Formation et de Recherche en Sciences Économiques et Sociales, instaurant l\'excellence et la rigueur dans les départements d\'Économie, Gestion et Mathématiques Appliquées.',
            'contributions' => 'Conception des maquettes pédagogiques LMD originelles et ouverture des premières filières professionnalisantes MIO et SEG.',
            'display_order' => 2,
        ]);

        HistoricalFigure::create([
            'name' => 'Dr. Awa Diop Ndiaye',
            'title' => 'Présidente Pionnière de l\'Amicale des Étudiants (AE UFR SES)',
            'period' => 'Mandat 2012 - 2014',
            'photo_url' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
            'biography' => 'Première femme à diriger l\'Amicale des Étudiants de l\'UFR SES, elle a instauré les semaines d\'intégration, les tutorats inter-niveaux et a milité activement pour l\'accès aux ressources documentaires pour tous.',
            'contributions' => 'Création des premiers polycopiés solidaires, mise en place des cours de renforcement en mathématiques et économétrie.',
            'display_order' => 3,
        ]);

        HistoricalFigure::create([
            'name' => 'M. Cheikh Tidiane Sow',
            'title' => 'Secrétaire Général Emblématique & Mentor Pédagogique',
            'period' => 'Mandat 2017 - 2019',
            'photo_url' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
            'biography' => 'Diplômé major de sa promotion en Informatique des Organisations (MIO), Cheikh Tidiane a modernisé les canaux de communication de l\'Amicale et a lancé les journées d\'orientation pour les bacheliers.',
            'contributions' => 'Inauguration du premier salon des métiers du numérique et de la finance à Thiès.',
            'display_order' => 4,
        ]);

        // 2. Actualités & Rédactions de l'Amicale
        AmicaleNews::truncate();

        AmicaleNews::create([
            'title' => 'Lancement officiel du portail numérique AE UFR SES Biblio',
            'theme' => 'Innovation & Numérique',
            'summary' => 'Une avancée majeure pour tous les étudiants : accès instantané aux cours, TD, TP corrigés et annales d\'examens du L1 au Master.',
            'content' => "Le Bureau Exécutif de l'Amicale des Étudiants de l'UFR SES a le plaisir d'inaugurer la plateforme AE UFR SES Biblio. Ce portail centralise l'ensemble du patrimoine pédagogique de notre faculté, des filières MIO, SEG, MTH, LAC, LEA jusqu'aux nouveaux Masters de pointe MIDIA (Ingénierie des Données & IA) et MACI (Audit & Contrôle Interne).\n\nGrâce à cette initiative portée bénévolement par les étudiants et soutenue par le corps professoral, les étudiants peuvent désormais télécharger gratuitement et rapidement leurs supports pédagogiques.",
            'author_name' => 'Commission Pédagogique & Digitale AE SES',
            'category' => 'actualite',
            'photos' => [
                'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
            ],
            'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'is_pinned' => true,
            'published_at' => Carbon::now()->subDays(2),
        ]);

        AmicaleNews::create([
            'title' => 'Journées d\'Intégration et Séminaire d\'Orientation L1 2025-2026',
            'theme' => 'Vie de Campus',
            'summary' => 'Accueil chaleureux des nouveaux bacheliers avec parrainage, ateliers méthodologiques et découverte des départements.',
            'content' => "Les Journées d'Intégration de l'UFR SES se sont déroulées dans une ambiance festive et studieuse sur le campus de l'UIDT. Au programme : découverte des unités d'enseignement fondamentales, ateliers de gestion du temps universitaire et prise en main de la bibliothèque numérique.\n\nLes aînés de Master ont partagé leurs retours d'expérience et dispensé des conseils méthodologiques précieux pour réussir les semestres S1 et S2.",
            'author_name' => 'Commission Sociale & Animation',
            'category' => 'evenement',
            'photos' => [
                'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop',
            ],
            'video_url' => null,
            'is_pinned' => false,
            'published_at' => Carbon::now()->subDays(7),
        ]);

        AmicaleNews::create([
            'title' => 'Ouverture des Masters MIDIA et MACI : Cap sur l\'IA et l\'Audit Stratégique',
            'theme' => 'Excellence Académique',
            'summary' => 'L\'UFR SES renforce son offre de formation supérieure avec deux nouveaux programmes de haut niveau répondant aux besoins du marché.',
            'content' => "Face aux mutations du marché de l'emploi en Afrique et à l'international, l'UFR SES franchit un cap historique avec l'ouverture des Masters :\n- Master Ingénierie des Données et Intelligence Artificielle (MIDIA) : Data science, Machine Learning, Big Data et IA générative.\n- Master Audit et Contrôle Interne (MACI) : Gestion des risques financiers, gouvernance d'entreprise et conformité internationale.\n\nL'Amicale félicite l'équipe décanale pour cette opportunité unique offerte à nos étudiants.",
            'author_name' => 'Bureau Exécutif AE UFR SES',
            'category' => 'communique',
            'photos' => [
                'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
            ],
            'video_url' => null,
            'is_pinned' => false,
            'published_at' => Carbon::now()->subDays(12),
        ]);
    }
}
