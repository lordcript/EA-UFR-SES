<?php

namespace Database\Seeders;

use App\Models\Filiere;
use Illuminate\Database\Seeder;

class FiliereSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $filieres = [
            [
                'id' => 'MIO',
                'code' => 'MIO',
                'name' => 'Management Informatisé des Organisations',
                'department' => 'Département Informatique de Gestion & Systèmes d\'Organisation',
                'description' => 'Formation de pointe alliant gestion des entreprises, gouvernance numérique, systèmes d\'information informatisés et ingénierie décisionnelle.',
                'levels' => ['Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2'],
                'cover_image' => '/images/filiere_mio.jpg',
                'badge_color' => 'bg-emerald-600',
            ],
            [
                'id' => 'MTH',
                'code' => 'MTH',
                'name' => 'Management du Tourisme et de l\'Hôtellerie',
                'department' => 'Département Tourisme, Hôtellerie & Patrimoine',
                'description' => 'Gestion stratégique de complexes touristiques, écotourisme, marketing hôtelier et valorisation du patrimoine territorial et culturel.',
                'levels' => ['Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2'],
                'cover_image' => '/images/filiere_mth.jpg',
                'badge_color' => 'bg-amber-600',
            ],
            [
                'id' => 'SEG',
                'code' => 'SEG',
                'name' => 'Sciences Économiques et de Gestion',
                'department' => 'Département Économie Appliquée & Finance',
                'description' => 'Analyse macroéconomique, économétrie, finance de marché, comptabilité analytique et gouvernance des politiques publiques en Afrique.',
                'levels' => ['Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2'],
                'cover_image' => '/images/filiere_seg.jpg',
                'badge_color' => 'bg-blue-600',
            ],
            [
                'id' => 'LAC',
                'code' => 'LAC',
                'name' => 'Langues, Arts et Civilisations',
                'department' => 'Département Langues, Arts & Civilisations',
                'description' => 'Étude approfondie des langues vivantes, de l\'histoire des arts, du patrimoine matériel et immatériel, et des civilisations africaines et mondiales.',
                'levels' => ['Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2'],
                'cover_image' => '/images/filiere_lac.jpg',
                'badge_color' => 'bg-indigo-600',
            ],
            [
                'id' => 'LEA',
                'code' => 'LEA',
                'name' => 'Langues Étrangères Appliquées',
                'department' => 'Département Langues Vivantes & Diplomatie',
                'description' => 'Traduction spécialisée, communication interculturelle, relations internationales et diplomatie économique en milieux multilingues.',
                'levels' => ['Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2'],
                'cover_image' => '/images/filiere_lea.jpg',
                'badge_color' => 'bg-rose-600',
            ],
            [
                'id' => 'MIDIA',
                'code' => 'MIDIA',
                'name' => 'Master Ingénierie des Données et Intelligence Artificielle',
                'department' => 'Département Informatique & Technologies Décisionnelles',
                'description' => 'Master d\'excellence formant des experts en Big Data, architectures d\'apprentissage automatique (Machine Learning), Deep Learning, NLP et déploiement IA.',
                'levels' => ['Master 1', 'Master 2'],
                'cover_image' => '/images/filiere_midia.jpg',
                'badge_color' => 'bg-teal-700',
            ],
            [
                'id' => 'MACI',
                'code' => 'MACI',
                'name' => 'Master Audit et Contrôle Interne',
                'department' => 'Département Sciences Économiques, Finance & Gestion',
                'description' => 'Formation de référence en audit financier international, contrôle de gestion stratégique, conformité réglementaire (COSO/ISA) et pilotage des risques.',
                'levels' => ['Master 1', 'Master 2'],
                'cover_image' => '/images/filiere_maci.jpg',
                'badge_color' => 'bg-violet-700',
            ],
        ];

        foreach ($filieres as $data) {
            Filiere::updateOrCreate(['id' => $data['id']], $data);
        }
    }
}
