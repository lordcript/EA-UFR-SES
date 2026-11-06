<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            FiliereSeeder::class,
            StudentSeeder::class,
            AcademicResourceSeeder::class,
            SiteSettingSeeder::class,
            AmicaleActivitySeeder::class,
        ]);
    }
}
