<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Super Administrateur Principal (Compte Officiel UIDT & Compte de secours)
        User::updateOrCreate(
            ['email' => 'idrissa.hyjazi@univ-thies.sn'],
            [
                'name' => 'Idrissa Hyjazi (Super Admin UFR SES)',
                'password' => Hash::make('adminhyjazi1234'),
                'role' => 'superadmin',
                'filiere_assigned' => 'ALL',
                'is_blocked' => false,
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'adminhyjazi@gmail.com'],
            [
                'name' => 'Idrissa Hyjazi (Super Admin - Compte Principal)',
                'password' => Hash::make('adminhyjazi1234'),
                'role' => 'superadmin',
                'filiere_assigned' => 'ALL',
                'is_blocked' => false,
                'email_verified_at' => now(),
            ]
        );

        // 2. Administrateur Scolarité & Coordination Pédagogique
        User::updateOrCreate(
            ['email' => 'scolarite.ufrses@univ-thies.sn'],
            [
                'name' => 'Dr. Mamadou Diop (Coordinateur Pédagogique)',
                'password' => Hash::make('scolariteUIDT2026'),
                'role' => 'admin',
                'filiere_assigned' => 'ALL',
                'is_blocked' => false,
                'email_verified_at' => now(),
            ]
        );

        // 3. Modérateur Pédagogique Filière MIO
        User::updateOrCreate(
            ['email' => 'moderateur.mio@univ-thies.sn'],
            [
                'name' => 'Pr. A. Ndiaye (Délégué Pédagogique MIO)',
                'password' => Hash::make('mioPass2026'),
                'role' => 'moderateur',
                'filiere_assigned' => 'MIO',
                'is_blocked' => false,
                'email_verified_at' => now(),
            ]
        );
    }
}
