import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FiliereId, ResourceType, FileFormat } from '../../types';
import {
  FileText,
  Video,
  Image as ImageIcon,
  Table,
  Search,
  Download,
  Eye,
  Filter,
  Layers,
  GraduationCap,
  Calendar,
  User,
  CheckCircle,
} from 'lucide-react';

export const FilieresView: React.FC = () => {
  const {
    filieres,
    selectedFiliereId,
    setSelectedFiliereId,
    resources,
    siteImages,
    setPreviewResource,
    incrementDownload,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<'all' | ResourceType>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const currentFiliere = filieres.find(f => f.id === selectedFiliereId) || filieres[0];
  const coverImage = siteImages.filieres[currentFiliere.id] || currentFiliere.coverImage;

  // Filter resources
  const filiereResources = resources.filter(res => {
    if (res.filiereId !== selectedFiliereId) return false;
    if (activeCategory !== 'all' && res.type !== activeCategory) return false;
    if (selectedLevel !== 'all' && res.level !== selectedLevel) return false;
    if (selectedFormat !== 'all' && res.format !== selectedFormat) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const match =
        res.title.toLowerCase().includes(q) ||
        res.codeUE.toLowerCase().includes(q) ||
        res.moduleName.toLowerCase().includes(q) ||
        res.author.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleDownload = (resId: string, title: string, fileName: string) => {
    incrementDownload(resId);
    setDownloadNotice(title);
    setTimeout(() => setDownloadNotice(null), 2500);

    const blob = new Blob([`Document officiel AE UFR SES Biblio - ${title}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getFormatIcon = (format: FileFormat) => {
    switch (format) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-red-500" />;
      case 'video':
        return <Video className="w-4 h-4 text-amber-500" />;
      case 'photo':
        return <ImageIcon className="w-4 h-4 text-emerald-500" />;
      case 'csv':
      case 'xlsx':
        return <Table className="w-4 h-4 text-teal-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. TOP FILIÈRE SELECTOR TABS */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {filieres.map((filiere) => {
            const isSelected = filiere.id === selectedFiliereId;
            return (
              <button
                key={filiere.id}
                onClick={() => setSelectedFiliereId(filiere.id)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#0f2b4c] text-white shadow-md'
                    : 'text-slate-600 hover:text-[#0f2b4c] hover:bg-slate-100'
                }`}
              >
                <span className="font-extrabold tracking-wide">{filiere.code}</span>
                <span className="hidden sm:inline font-normal text-slate-300">|</span>
                <span className="hidden sm:inline font-medium text-[11px] truncate max-w-[160px]">
                  {filiere.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. ACTIVE FILIÈRE BANNER */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900">
        <div className="h-56 sm:h-64 w-full relative">
          <img
            src={coverImage}
            alt={currentFiliere.name}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-500/90 text-slate-950 text-xs font-black rounded-lg">
              {currentFiliere.isMasterSpecialise ? 'MASTER SPÉCIALISÉ' : 'FILIÈRE'} {currentFiliere.code}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currentFiliere.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed">
              {currentFiliere.description}
            </p>
            <div className="text-[11px] text-amber-300 font-semibold pt-1">
              {currentFiliere.department}
            </div>
          </div>
        </div>
      </div>

      {/* Download toast notice */}
      {downloadNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Téléchargement initié : <strong>{downloadNotice}</strong></span>
          </div>
          <span className="font-mono text-[11px]">Enregistré</span>
        </div>
      )}

      {/* 3. SUB-TABS & FILTERS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        {/* Category Tabs (Cours, Examens passés, TD, TP) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-white text-[#0f2b4c] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous les documents ({resources.filter(r => r.filiereId === selectedFiliereId).length})
            </button>
            <button
              onClick={() => setActiveCategory('cours')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'cours'
                  ? 'bg-white text-[#0f2b4c] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cours magistraux ({resources.filter(r => r.filiereId === selectedFiliereId && r.type === 'cours').length})
            </button>
            <button
              onClick={() => setActiveCategory('examen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'examen'
                  ? 'bg-white text-[#0f2b4c] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Examens passés ({resources.filter(r => r.filiereId === selectedFiliereId && r.type === 'examen').length})
            </button>
            <button
              onClick={() => setActiveCategory('td')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'td'
                  ? 'bg-white text-[#0f2b4c] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Travaux Dirigés (TD) ({resources.filter(r => r.filiereId === selectedFiliereId && r.type === 'td').length})
            </button>
            <button
              onClick={() => setActiveCategory('tp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'tp'
                  ? 'bg-white text-[#0f2b4c] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Travaux Pratiques (TP) ({resources.filter(r => r.filiereId === selectedFiliereId && r.type === 'tp').length})
            </button>
          </div>

          {/* Search bar inside filière */}
          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filtrer dans cette filière..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#0f2b4c]"
            />
          </div>
        </div>

        {/* Secondary Level & Format Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Niveau académique :</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 outline-none focus:border-[#0f2b4c]"
            >
              <option value="all">Tous les niveaux (L1 à M2)</option>
              {currentFiliere.levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Format de fichier :</span>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 outline-none focus:border-[#0f2b4c]"
            >
              <option value="all">Tous formats (PDF, Vidéo, Photo, Excel/CSV)</option>
              <option value="pdf">PDF (Polycopiés / Épreuves)</option>
              <option value="video">Vidéo (Enregistrements cours)</option>
              <option value="photo">Photo / Schémas</option>
              <option value="xlsx">XLSX (Classeurs Excel)</option>
              <option value="csv">CSV (Données de TP)</option>
            </select>
          </div>

          {(activeCategory !== 'all' || selectedLevel !== 'all' || selectedFormat !== 'all' || searchFilter) && (
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedLevel('all');
                setSelectedFormat('all');
                setSearchFilter('');
              }}
              className="text-amber-700 font-bold hover:underline ml-auto"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {/* 4. RESOURCES LISTING */}
      {filiereResources.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <Layers className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            Aucun document ne correspond à vos critères
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Aucune ressource disponible pour cette sélection. L'administrateur peut ajouter de nouveaux cours, TD/TP et sujets d'examens depuis son espace de gestion.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filiereResources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header row with format and UE */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-slate-100 rounded-lg">
                      {getFormatIcon(res.format)}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      {res.type === 'cours' ? 'Cours Magistral' : res.type === 'examen' ? 'Examen Passé' : res.type.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0f2b4c] bg-slate-100 px-2 py-0.5 rounded">
                    {res.codeUE}
                  </span>
                </div>

                {/* Resource Title */}
                <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                  {res.title}
                </h3>

                {/* Unboxed Metadata text with typographic separators */}
                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5">
                  <span className="font-medium text-slate-700">{res.moduleName}</span>
                  <span aria-hidden="true">·</span>
                  <span>{res.level} ({res.semester})</span>
                  <span aria-hidden="true">·</span>
                  <span>{res.academicYear}</span>
                </div>

                {/* Description snippet if any */}
                {res.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {res.description}
                  </p>
                )}
              </div>

              {/* Dedicated Footer with File Info strip & Prominent Dual Action Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                {/* File details strip */}
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono truncate max-w-[220px]" title={res.fileName}>
                    📁 {res.fileName}
                  </span>
                  <span className="font-mono font-semibold text-slate-600 shrink-0">
                    {res.fileSize}
                  </span>
                </div>

                {/* Prominently aligned action buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPreviewResource(res)}
                    className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-[#0f2b4c] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#0f2b4c]" />
                    <span>Aperçu</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownload(res.id, res.title, res.fileName)}
                    className="w-full py-2.5 px-3 bg-[#0f2b4c] hover:bg-[#163a66] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Télécharger</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
