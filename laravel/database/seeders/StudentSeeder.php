<?php

namespace Database\Seeders;

use App\Models\Student;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = [
            [
                'ine' => 'N01284917245',
                'email' => 'amadou.fall@univ-thies.sn',
                'full_name' => 'Amadou Fall',
                'filiere_id' => 'MIO',
                'level' => 'Licence 2',
                'phone' => '+221 77 450 12 34',
                'password' => Hash::make('etudiantfall2026'),
                'status' => 'actif',
            ],
            [
                'ine' => 'N01934208119',
                'email' => 'fatou.sow@univ-thies.sn',
                'full_name' => 'Fatou Sow',
                'filiere_id' => 'SEG',
                'level' => 'Licence 3',
                'phone' => '+221 78 610 99 21',
                'password' => Hash::make('etudiantsow2026'),
                'status' => 'actif',
            ],
            [
                'ine' => 'N01755109283',
                'email' => 'moussa.ba@univ-thies.sn',
                'full_name' => 'Moussa Ba',
                'filiere_id' => 'MTH',
                'level' => 'Licence 1',
                'phone' => '+221 76 890 33 45',
                'password' => Hash::make('etudiantba2026'),
                'status' => 'actif',
            ],
            [
                'ine' => 'N01429817553',
                'email' => 'awa.diop@univ-thies.sn',
                'full_name' => 'Awa Diop',
                'filiere_id' => 'LAC',
                'level' => 'Licence 2',
                'phone' => '+221 77 312 88 44',
                'password' => Hash::make('etudiantdiop2026'),
                'status' => 'actif',
            ],
            [
                'ine' => 'N01827490123',
                'email' => 'cheikh.seck@univ-thies.sn',
                'full_name' => 'Cheikh Seck',
                'filiere_id' => 'LEA',
                'level' => 'Licence 3',
                'phone' => '+221 70 945 61 70',
                'password' => Hash::make('etudiantseck2026'),
                'status' => 'actif',
            ],
        ];

        foreach ($students as $student) {
            Student::updateOrCreate(
                ['ine' => $student['ine']],
                $student
            );
        }
    }
}
