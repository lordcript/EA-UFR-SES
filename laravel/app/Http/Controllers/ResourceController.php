<?php

namespace App\Http\Controllers;

use App\Models\AcademicResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ResourceController extends Controller
{
    public function download(AcademicResource $resource)
    {
        $resource->increment('downloads_count');

        if (Storage::disk('public')->exists($resource->file_url)) {
            return Storage::disk('public')->download($resource->file_url, $resource->file_name);
        }

        // Si fichier hébergé externe ou démo
        return response()->streamDownload(function () use ($resource) {
            echo "Université Iba Der Thiam de Thiès (UIDT) - UFR SES\n";
            echo "Filière: {$resource->filiere_id}\n";
            echo "Module: {$resource->module_name} ({$resource->code_ue})\n";
            echo "Titre: {$resource->title}\n";
            echo "Format: {$resource->format}\n";
            echo "Auteur: {$resource->author}\n";
            echo "Année: {$resource->academic_year}\n\n";
            echo "Description:\n{$resource->description}\n";
        }, $resource->file_name, [
            'Content-Type' => 'text/plain',
        ]);
    }
}
