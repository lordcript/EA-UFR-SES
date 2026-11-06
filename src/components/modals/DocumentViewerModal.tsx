import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Download,
  FileText,
  Video,
  Image as ImageIcon,
  Table,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Calendar,
  User,
  GraduationCap,
} from 'lucide-react';

export const DocumentViewerModal: React.FC = () => {
  const { previewResource, setPreviewResource, incrementDownload } = useApp();
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [csvFilter, setCsvFilter] = useState('');

  if (!previewResource) return null;

  const handleDownload = () => {
    incrementDownload(previewResource.id);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);

    // Create realistic mock file download blob
    const content = `Université Iba Der Thiam de Thiès (UIDT) - UFR SES
Filière: ${previewResource.filiereId}
Module: ${previewResource.moduleName} (${previewResource.codeUE})
Type de document: ${previewResource.type.toUpperCase()}
Titre: ${previewResource.title}
Niveau: ${previewResource.level} - ${previewResource.semester}
Enseignant / Auteur: ${previewResource.author}
Année académique: ${previewResource.academicYear}

Description du cours/document:
${previewResource.description || 'Document officiel validé par la commission pédagogique de l\'UFR Sciences Économiques et Sociales.'}

Téléchargé depuis la bibliothèque numérique officielle AE UFR SES Biblio.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = previewResource.fileName || `${previewResource.codeUE}_${previewResource.type}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Mock spreadsheet data for CSV and XLSX previews
  const sampleSpreadsheetHeaders = [
    'Code',
    'Indicateur / Variable',
    'Unité / Métrique',
    'Valeur S1',
    'Valeur S2',
    'Taux de Variation',
    'Statut Évaluation',
  ];

  const sampleSpreadsheetRows = [
    ['ECO-01', 'Chiffre d\'Affaires Opérationnel', 'FCFA (Millions)', '450.5', '512.8', '+13.8%', 'Objectif Atteint'],
    ['ECO-02', 'Marge Brute d\'Exploitation', '%', '28.4%', '31.2%', '+2.8 pts', 'Favorable'],
    ['ECO-03', 'Taux d\'Occupation Chambres (RevPAR)', '%', '68.5%', '74.2%', '+5.7 pts', 'Excellent'],
    ['ECO-04', 'Dépenses Logistiques & Transit', 'FCFA (Millions)', '64.2', '59.0', '-8.1%', 'Optimisé'],
    ['ECO-05', 'Indice de Productivité Salariés', 'Ratio', '1.42', '1.58', '+11.2%', 'Conforme'],
    ['ECO-06', 'Délai Moyen Recouvrement Clients', 'Jours', '42', '35', '-7 jours', 'Amélioré'],
    ['ECO-07', 'Valeur Actuelle Nette (VAN 10%)', 'FCFA (Millions)', '125.0', '140.2', '+12.1%', 'Rentable'],
  ];

  const filteredRows = sampleSpreadsheetRows.filter(row =>
    row.some(cell => cell.toLowerCase().includes(csvFilter.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 md:p-6 animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#0f2b4c] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              {previewResource.format === 'pdf' && <FileText className="w-5 h-5 text-red-400" />}
              {previewResource.format === 'video' && <Video className="w-5 h-5 text-amber-400" />}
              {previewResource.format === 'photo' && <ImageIcon className="w-5 h-5 text-emerald-400" />}
              {(previewResource.format === 'csv' || previewResource.format === 'xlsx') && (
                <Table className="w-5 h-5 text-emerald-300" />
              )}
            </div>
            <div>
              <div className="text-xs text-amber-300 font-semibold uppercase tracking-wider flex items-center gap-2">
                <span>{previewResource.filiereId}</span>
                <span>·</span>
                <span>{previewResource.type.toUpperCase()}</span>
                <span>·</span>
                <span>{previewResource.format.toUpperCase()}</span>
              </div>
              <h3 className="text-base font-bold text-white line-clamp-1">
                {previewResource.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-950" />
                  <span>Téléchargé !</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger ({previewResource.fileSize})</span>
                </>
              )}
            </button>
            <button
              onClick={() => setPreviewResource(null)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50">
          {/* Metadata pill-less bar */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 font-medium text-slate-800">
                <BookOpen className="w-3.5 h-3.5 text-[#0f2b4c]" />
                {previewResource.moduleName} ({previewResource.codeUE})
              </span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                {previewResource.level} ({previewResource.semester})
              </span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                {previewResource.author}
              </span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {previewResource.academicYear}
              </span>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              {previewResource.downloadsCount} téléchargements
            </div>
          </div>

          {/* Description */}
          {previewResource.description && (
            <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3.5 text-xs text-slate-700 leading-relaxed">
              <strong className="text-[#0f2b4c]">Résumé pédagogique :</strong> {previewResource.description}
            </div>
          )}

          {/* FORMAT 1: PDF Viewer */}
          {previewResource.format === 'pdf' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-xs font-bold text-slate-800">
                    Aperçu du polycopié officiel (Page 1 sur 24)
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">PDF Standard A4</span>
              </div>

              {/* Realistic academic paper simulator */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-lg border border-slate-200 font-serif text-slate-800 space-y-4 shadow-inner">
                <div className="text-center space-y-1 border-b border-slate-200 pb-4">
                  <div className="text-xs font-sans uppercase font-bold tracking-widest text-[#0f2b4c]">
                    Université Iba Der Thiam de Thiès · UFR Sciences Économiques et Sociales
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-2">
                    {previewResource.title}
                  </h2>
                  <div className="text-xs text-slate-500 font-sans">
                    Unité d'Enseignement : {previewResource.codeUE} · Semestre : {previewResource.semester}
                  </div>
                </div>

                <div className="space-y-3 text-xs md:text-sm leading-relaxed text-slate-700">
                  <h4 className="font-bold text-slate-900 font-sans text-xs uppercase tracking-wider text-[#0f2b4c]">
                    Section 1. Objectifs d'apprentissage et compétences visées
                  </h4>
                  <p>
                    Ce support pédagogique est dispensé dans le cadre du cursus <strong>{previewResource.filiereId} ({previewResource.level})</strong>. Les étudiants sont tenus d'assimiler les concepts théoriques, d'appliquer les méthodologies d'évaluation empiriques et de préparer les séances de travaux dirigés hebdomadaires.
                  </p>
                  <p>
                    L'évaluation comprend un contrôle continu pondéré pour 40% (épreuves sur table et restitution de TP) ainsi qu'un examen terminal de fin de semestre pour 60%.
                  </p>
                  <div className="bg-amber-50/70 border-l-4 border-amber-500 p-3 text-xs font-sans text-amber-900">
                    <strong>Rappel de la scolarité :</strong> Toute reproduction non autorisée ou diffusion externe de ce document sans l'accord préalable du département est strictement interdite.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FORMAT 2: Video Player */}
          {previewResource.format === 'video' && (
            <div className="bg-black rounded-xl overflow-hidden shadow-lg border border-slate-800">
              <video
                controls
                className="w-full max-h-[480px] object-contain mx-auto"
                poster="/src/assets/images/filiere_mio_1791143994882.jpg"
              >
                <source src={previewResource.fileUrl} type="video/mp4" />
                Votre navigateur ne prend pas en charge la balise vidéo HTML5.
              </video>
              <div className="p-3 bg-slate-900 text-white text-xs flex items-center justify-between">
                <span>Séance magistrale enregistrée · Salle de conférence UFR SES Thiès</span>
                <span className="text-amber-400 font-medium">Vidéo HD 1080p</span>
              </div>
            </div>
          )}

          {/* FORMAT 3: Photo / Image Lightbox */}
          {previewResource.format === 'photo' && (
            <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg p-2 text-center">
              <img
                src={previewResource.fileUrl}
                alt={previewResource.title}
                className="max-h-[500px] w-auto mx-auto rounded-lg object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="p-2 text-xs text-slate-300">
                Document graphique / Schéma pédagogique haute résolution
              </div>
            </div>
          )}

          {/* FORMAT 4: CSV / XLSX Spreadsheet */}
          {(previewResource.format === 'csv' || previewResource.format === 'xlsx') && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs space-y-3 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Visualiseur de Tableau de Données ({previewResource.format.toUpperCase()})
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Jeu de données pour travaux pratiques & analyse économétrique
                  </p>
                </div>
                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Filtrer dans les lignes..."
                    value={csvFilter}
                    onChange={(e) => setCsvFilter(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-[#0f2b4c]"
                  />
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                      {sampleSpreadsheetHeaders.map((hdr, idx) => (
                        <th key={idx} className="p-2.5 font-bold whitespace-nowrap">
                          {hdr}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`p-2.5 whitespace-nowrap ${
                              cIdx === 0 ? 'font-mono font-bold text-[#0f2b4c]' : 'text-slate-700'
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Nom du fichier :</span>
            <span className="font-mono font-semibold text-slate-700">{previewResource.fileName}</span>
          </div>
          <button
            onClick={() => setPreviewResource(null)}
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Fermer l'aperçu
          </button>
        </div>
      </div>
    </div>
  );
};
