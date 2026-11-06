import React from 'react';
import { useApp } from '../../context/AppContext';
import { FiliereId } from '../../types';
import {
  BookOpen,
  FileCheck,
  FolderGit2,
  GraduationCap,
  ArrowRight,
  Search,
  Download,
  Eye,
  Calendar,
  Layers,
  ChevronRight,
  Award,
  Sparkles,
} from 'lucide-react';
import { UidtCampusGateBanner, AmicaleLogo } from '../BrandLogos';

export const HomeView: React.FC = () => {
  const {
    filieres,
    resources,
    setSelectedFiliereId,
    setActiveTab,
    setActivitesSubTab,
    historicalFigures,
    amicaleNews,
    siteImages,
    setPreviewResource,
    incrementDownload,
  } = useApp();

  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSelectFiliere = (id: FiliereId) => {
    setSelectedFiliereId(id);
    setActiveTab('filieres');
  };

  // Filtered resources for global search
  const searchResults = searchQuery.trim()
    ? resources.filter(
        r =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.codeUE.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.filiereId.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-12 pb-16">
      {/* HERO SECTION with the FIRST IMAGE (UIDT Campus Entrance) */}
      <section className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200">
        <UidtCampusGateBanner
          customSrc={siteImages.heroBanner || undefined}
          className="w-full min-h-[380px] md:min-h-[440px]"
        />

        {/* Hero Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 text-white">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-semibold text-amber-300">
              <AmicaleLogo className="w-5 h-5" />
              <span>Amicale des Étudiants · UFR Sciences Économiques et Sociales</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              AE UFR SES Biblio
            </h1>

            <p className="text-sm md:text-base text-slate-200 leading-relaxed max-w-2xl">
              La bibliothèque numérique officielle de l'Amicale des Étudiants de l'UFR Sciences Économiques et Sociales (UIDT). Retrouvez l'intégralité des <strong>cours</strong>, <strong>examens passés</strong>, <strong>travaux dirigés (TD)</strong> et <strong>travaux pratiques (TP)</strong> pour les {filieres.length} filières et masters d'excellence de l'UFR.
            </p>

            {/* Global Search Bar */}
            <div className="pt-2 max-w-xl">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="Rechercher un cours, un sujet d'examen, un TD ou un code UE (ex: BPMN, SEG-201, MIO)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white text-slate-900 rounded-xl text-sm font-medium shadow-lg placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Live search dropdown results */}
              {searchQuery.trim() && (
                <div className="mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 max-h-72 overflow-y-auto divide-y divide-slate-100 text-slate-900 z-20 relative">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      Aucun document trouvé pour "{searchQuery}".
                    </div>
                  ) : (
                    searchResults.map((res) => (
                      <button
                        key={res.id}
                        type="button"
                        onClick={() => {
                          setPreviewResource(res);
                          setSearchQuery('');
                        }}
                        className="w-full text-left p-2.5 hover:bg-slate-50 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer group"
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold text-[#0f2b4c] group-hover:text-amber-700 flex items-center gap-2">
                            <span>[{res.filiereId}] {res.title}</span>
                            <span className="uppercase text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                              {res.type}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {res.moduleName} · {res.level} ({res.semester}) · Par {res.author}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0f2b4c] shrink-0 ml-2" />
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('filieres')}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Accéder aux filières</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('inscription')}
                className="px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold rounded-xl border border-white/30 transition-all cursor-pointer"
              >
                Inscription Étudiant (Numéro INE)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS OVERVIEW */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-[#0f2b4c]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {resources.filter(r => r.type === 'cours').length}
            </div>
            <div className="text-xs text-slate-500 font-medium">Polycopiés de Cours</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {resources.filter(r => r.type === 'examen').length}
            </div>
            <div className="text-xs text-slate-500 font-medium">Examens & Annales</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {resources.filter(r => r.type === 'td' || r.type === 'tp').length}
            </div>
            <div className="text-xs text-slate-500 font-medium">Fiches de TD & TP</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-700">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{filieres.length}</div>
            <div className="text-xs text-slate-500 font-medium">Filières & Masters</div>
          </div>
        </div>
      </section>

      {/* SECTION ACTIVITÉS DE L'AMICALE (HISTORIQUE & ACTUALITÉS) */}
      <section className="bg-gradient-to-br from-slate-900 via-[#0f2b4c] to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Espace Vie Étudiante & Mémoire</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Activités de l'Amicale des Étudiants
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Explorez les deux piliers de l'Amicale : la revue historique rendant hommage à nos illustres figures et fondateurs, ainsi que le fil continu des actualités et rédactions universitaires.
            </p>
          </div>

          <button
            onClick={() => {
              setActivitesSubTab('actualites');
              setActiveTab('activites');
            }}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Accéder à l'espace Amicale</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2 Interactive Sub-Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Revue Historique */}
          <div
            onClick={() => {
              setActivitesSubTab('historique');
              setActiveTab('activites');
            }}
            className="group bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/15 transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:border-amber-400/50"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  Revue Historique · {historicalFigures.length} Figures
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                Figures Emblématiques & Présidents
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rétrospective historique des présidents fondateurs, leaders étudiants et bâtisseurs de la solidarité au sein de l'UFR Sciences Économiques et Sociales de l'UIDT.
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-amber-300 font-bold">
              <span>Consulter la revue historique</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: Actualités & Rédactions */}
          <div
            onClick={() => {
              setActivitesSubTab('actualites');
              setActiveTab('activites');
            }}
            className="group bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/15 transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:border-amber-400/50"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
                  Actualités & Rédactions · {amicaleNews.length} Publications
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                Événements, Rédactions & Médias
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Articles détaillés, journées d'intégration, colloques, galeries photos et enregistrements vidéos rédigés par l'équipe administrative et les administrateurs secondaires.
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-amber-300 font-bold">
              <span>Voir les dernières actualités & vidéos</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION DES FILIÈRES & MASTERS IMAGÉS (MIO, MTH, SEG, LAC, LEA, MIDIA, MACI) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0f2b4c] tracking-tight">
              Filières et Masters de Formation · UFR SES
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Licences fondamentales et Masters d'excellence (MIDIA & MACI inclus)
            </p>
          </div>
          <button
            onClick={() => setActiveTab('filieres')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Voir l'annuaire complet des cours</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 7 Filières & Masters Grid with Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filieres.map((filiere) => {
            const filiereResources = resources.filter(r => r.filiereId === filiere.id);
            const coursesCount = filiereResources.filter(r => r.type === 'cours').length;
            const examsCount = filiereResources.filter(r => r.type === 'examen').length;
            const tdCount = filiereResources.filter(r => r.type === 'td' || r.type === 'tp').length;

            const coverImage = siteImages.filieres[filiere.id] || filiere.coverImage;

            return (
              <div
                key={filiere.id}
                onClick={() => handleSelectFiliere(filiere.id)}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-300 transition-all cursor-pointer flex flex-col"
              >
                {/* Image Cover */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={coverImage}
                    alt={filiere.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />

                  {/* Filière Code Badge and Master Tag */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-[#0f2b4c]/90 backdrop-blur-xs text-white px-3 py-1 rounded-lg text-xs font-extrabold tracking-wider border border-white/20">
                      {filiere.code}
                    </span>
                    {filiere.isMasterSpecialise && (
                      <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                        Master Spécialisé
                      </span>
                    )}
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-base font-bold leading-snug line-clamp-1 drop-shadow-xs">
                      {filiere.name}
                    </h3>
                    <p className="text-[11px] text-amber-300 font-medium line-clamp-1">
                      {filiere.department}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {filiere.description}
                  </p>

                  {/* Unboxed Metadata Stats */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{coursesCount} cours</span>
                      <span className="text-slate-300">·</span>
                      <span className="font-semibold text-slate-800">{examsCount} examens</span>
                      <span className="text-slate-300">·</span>
                      <span className="font-semibold text-slate-800">{tdCount} TD/TP</span>
                    </div>
                    <span className="text-amber-700 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center">
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* RECENT ACADEMIC RESOURCES TABLE PREVIEW */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#0f2b4c]">
              Dernières publications académiques
            </h3>
            <p className="text-xs text-slate-500">
              Nouveaux cours, sujets d'examens et fiches de travaux dirigés mis en ligne
            </p>
          </div>
          <button
            onClick={() => setActiveTab('filieres')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800"
          >
            Tous les documents
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {resources.slice(0, 5).map((res) => (
            <div
              key={res.id}
              onClick={() => setPreviewResource(res)}
              className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-lg transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-[#0f2b4c]">
                  {res.filiereId}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-[#0f2b4c] line-clamp-1">
                    {res.title}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>{res.moduleName}</span>
                    <span>·</span>
                    <span>{res.level} ({res.semester})</span>
                    <span>·</span>
                    <span className="uppercase font-semibold text-amber-700">{res.format}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline mr-2">
                  {res.fileSize}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewResource(res);
                  }}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0f2b4c] rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Aperçu</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    incrementDownload(res.id);
                    const blob = new Blob([`Document officiel UIDT - ${res.title}`], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = res.fileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-2.5 py-1.5 bg-[#0f2b4c] hover:bg-[#163a66] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Télécharger</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
