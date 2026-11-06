<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SiteSetting::set('platform_name', 'AE UFR SES Biblio');
        SiteSetting::set('university_name', 'Université Iba Der Thiam de Thiès');
        SiteSetting::set('hero_banner', '/images/uidt_gate.jpg');
        SiteSetting::set('amicale_logo', '/images/amicale_logo.png');
        SiteSetting::set('contact_email', 'contact.ufrses@univ-thies.sn');
        SiteSetting::set('contact_phone', '+221 33 951 12 34');
        SiteSetting::set('academic_year_current', '2025-2026');
    }
}
