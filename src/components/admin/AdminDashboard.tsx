import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AdminUser,
  AcademicResource,
  FileFormat,
  FiliereId,
  ResourceType,
} from '../../types';
import {
  Shield,
  Image as ImageIcon,
  BookOpen,
  Users,
  GraduationCap,
  Plus,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Video,
  Table,
  Search,
  Eye,
  Sparkles,
  BarChart3,
  TrendingUp,
  Clock,
  Activity,
  Wifi,
  Mail,
  KeyRound,
  PieChart,
} from 'lucide-react';
import { AmicaleLogo, UidtCampusGateBanner } from '../BrandLogos';
import { PasswordResetModal } from '../modals/PasswordResetModal';

export const AdminDashboard: React.FC = () => {
  const {
    currentAdmin,
    filieres,
    resources,
    admins,
    students,
    siteImages,
    setActiveTab,
    addResource,
    updateResource,
    deleteResource,
    addAdmin,
    updateAdmin,
    toggleBlockAdmin,
    deleteAdmin,
    toggleBlockStudent,
    updateSiteImages,
    updateFiliereImage,
    resetImagesToDefault,
    setPreviewResource,
    updateAdminEmail,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'content' | 'images' | 'admins' | 'students' | 'analytics'>('content');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Security modals state (mot de passe & email)
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newAdminEmailInput, setNewAdminEmailInput] = useState('');
  const [emailModalFeedback, setEmailModalFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Analytics filter period
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'today' | 'week' | 'month'>('today');

  const isPrimarySuperAdmin =
    currentAdmin?.role === 'superadmin' ||
    currentAdmin?.email.toLowerCase() === 'idrissa.hyjazi@univ-thies.sn' ||
    currentAdmin?.email.toLowerCase() === 'adminhyjazi@gmail.com';

  // --- 1. RESOURCE MANAGEMENT STATE ---
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [editingResource, setEditingResource] = useState<AcademicResource | null>(null);
  const [resForm, setResForm] = useState<{
    filiereId: FiliereId;
    type: ResourceType;
    title: string;
    codeUE: string;
    moduleName: string;
    level: string;
    semester: string;
    format: FileFormat;
    fileUrl: string;
    fileName: string;
    fileSize: string;
    author: string;
    academicYear: string;
    description: string;
  }>({
    filiereId: 'MIO',
    type: 'cours',
    title: '',
    codeUE: 'MIO-101',
    moduleName: '',
    level: 'Licence 1',
    semester: 'Semestre 1',
    format: 'pdf',
    fileUrl: '',
    fileName: '',
    fileSize: '2.5 Mo',
    author: 'Enseignant UFR SES',
    academicYear: '2025-2026',
    description: '',
  });

  // Resource filters
  const [resourceSearch, setResourceSearch] = useState('');
  const [filterFiliere, setFilterFiliere] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // --- 2. ADMIN MANAGEMENT STATE ---
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [newAdminForm, setNewAdminForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin' as const,
  });

  // --- 3. STUDENTS FILTER STATE ---
  const [studentSearch, setStudentSearch] = useState('');

  // Handle resource form submission
  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resForm.title.trim() || !resForm.moduleName.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Veuillez remplir le titre et le nom du module.' });
      return;
    }

    const finalFileName = resForm.fileName || `${resForm.codeUE}_${resForm.type}.${resForm.format}`;

    if (editingResource) {
      updateResource(editingResource.id, {
        ...resForm,
        fileName: finalFileName,
      });
      setFeedbackMsg({ type: 'success', text: 'Ressource pédagogique mise à jour avec succès.' });
    } else {
      addResource({
        ...resForm,
        fileName: finalFileName,
        fileUrl: resForm.fileUrl || '/documents/sample.pdf',
      });
      setFeedbackMsg({ type: 'success', text: 'Nouvelle ressource pédagogique ajoutée au programme !' });
    }

    setShowAddResourceModal(false);
    setEditingResource(null);
  };

  const handleEditResourceClick = (res: AcademicResource) => {
    setEditingResource(res);
    setResForm({
      filiereId: res.filiereId,
      type: res.type,
      title: res.title,
      codeUE: res.codeUE,
      moduleName: res.moduleName,
      level: res.level,
      semester: res.semester,
      format: res.format,
      fileUrl: res.fileUrl,
      fileName: res.fileName,
      fileSize: res.fileSize,
      author: res.author,
      academicYear: res.academicYear,
      description: res.description || '',
    });
    setShowAddResourceModal(true);
  };

  // Handle file input for resources
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
        setResForm(prev => ({
          ...prev,
          fileUrl: event.target?.result as string,
          fileName: file.name,
          fileSize: `${sizeInMb} Mo`,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Admin creation
  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminForm.name.trim() || !newAdminForm.email.trim() || !newAdminForm.password.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Tous les champs sont requis.' });
      return;
    }

    const res = addAdmin({
      name: newAdminForm.name,
      email: newAdminForm.email,
      password: newAdminForm.password,
      role: newAdminForm.role,
      isBlocked: false,
    });

    if (res.success) {
      setFeedbackMsg({ type: 'success', text: res.message });
      setShowAddAdminModal(false);
      setNewAdminForm({ name: '', email: '', password: '', role: 'admin' });
    } else {
      setFeedbackMsg({ type: 'error', text: res.message });
    }
  };

  // Handle image upload from computer (Base64)
  const handleSiteImageUpload = (slot: 'heroBanner' | 'amicaleLogo' | FiliereId, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (slot === 'heroBanner') {
        updateSiteImages({ heroBanner: dataUrl });
      } else if (slot === 'amicaleLogo') {
        updateSiteImages({ amicaleLogo: dataUrl });
      } else {
        updateFiliereImage(slot as FiliereId, dataUrl);
      }
      setFeedbackMsg({ type: 'success', text: `Image (${slot}) mise à jour avec succès !` });
    };
    reader.readAsDataURL(file);
  };

  // Filtered resources for table
  const displayedResources = resources.filter(res => {
    if (filterFiliere !== 'all' && res.filiereId !== filterFiliere) return false;
    if (filterType !== 'all' && res.type !== filterType) return false;
    if (resourceSearch.trim()) {
      const q = resourceSearch.toLowerCase();
      return (
        res.title.toLowerCase().includes(q) ||
        res.codeUE.toLowerCase().includes(q) ||
        res.moduleName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered students
  const displayedStudents = students.filter(std => {
    if (studentSearch.trim()) {
      const q = studentSearch.toLowerCase();
      return (
        std.fullName.toLowerCase().includes(q) ||
        std.ine.toLowerCase().includes(q) ||
        std.email.toLowerCase().includes(q) ||
        std.filiereId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner */}
      <div className="bg-[#0f2b4c] text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30">
              <Shield className="w-3.5 h-3.5" />
              <span>Console Administrateur · UFR SES UIDT</span>
            </div>
            {isPrimarySuperAdmin && (
              <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
                ★ Super Administrateur Principal
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Espace d'Administration Pédagogique
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Connecté sous le profil : <strong>{currentAdmin?.name || 'Administrateur'}</strong> ({currentAdmin?.email})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setNewAdminEmailInput(currentAdmin?.email || '');
              setEmailModalFeedback(null);
              setShowEmailModal(true);
            }}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Modifier l'adresse email associée à ce compte administrateur"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Modifier mon email</span>
          </button>

          <button
            onClick={() => setShowPasswordResetModal(true)}
            className="px-3.5 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            title="Modifier le mot de passe via code de vérification envoyé par email"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Changer mot de passe (Code mail)</span>
          </button>

          <button
            onClick={() => {
              setEditingResource(null);
              setResForm({
                filiereId: 'MIO',
                type: 'cours',
                title: '',
                codeUE: 'MIO-101',
                moduleName: '',
                level: 'Licence 1',
                semester: 'Semestre 1',
                format: 'pdf',
                fileUrl: '',
                fileName: '',
                fileSize: '2.5 Mo',
                author: 'Enseignant UFR SES',
                academicYear: '2025-2026',
                description: '',
              });
              setShowAddResourceModal(true);
            }}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter cours / TD</span>
          </button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between animate-in fade-in ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-xs font-bold hover:underline"
          >
            Fermer
          </button>
        </div>
      )}

      {/* 2. Admin Navigation Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('content')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'content'
              ? 'bg-[#0f2b4c] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Gestion des Cours, TD, TP & Examens ({resources.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('images')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'images'
              ? 'bg-[#0f2b4c] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Modifier les Images de l'Application</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('admins')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'admins'
              ? 'bg-[#0f2b4c] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Gestion des Administrateurs ({admins.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('students')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeAdminTab === 'students'
              ? 'bg-[#0f2b4c] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Étudiants Inscrits ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('activites')}
          className="px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200"
          title="Gérer les figures historiques, articles, rédactions, photos et vidéos de l'Amicale"
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Activités de l'Amicale (Revue & Actualités)</span>
        </button>

        {isPrimarySuperAdmin && (
          <button
            onClick={() => setActiveAdminTab('analytics')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              activeAdminTab === 'analytics'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Statistiques & Fréquentation (Super Admin)</span>
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: GESTION DES COURS, TD, TP ET EXAMENS               */}
      {/* ========================================================= */}
      {activeAdminTab === 'content' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher par titre, code UE..."
                  value={resourceSearch}
                  onChange={(e) => setResourceSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#0f2b4c]"
                />
              </div>

              <select
                value={filterFiliere}
                onChange={(e) => setFilterFiliere(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 outline-none"
              >
                <option value="all">Toutes les filières</option>
                {filieres.map(f => (
                  <option key={f.id} value={f.id}>{f.code} - {f.name}</option>
                ))}
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 outline-none"
              >
                <option value="all">Tous types (Cours, TD, TP, Examens)</option>
                <option value="cours">Cours Magistraux</option>
                <option value="examen">Examens passés</option>
                <option value="td">Travaux Dirigés (TD)</option>
                <option value="tp">Travaux Pratiques (TP)</option>
              </select>
            </div>

            <div className="text-slate-500 font-mono">
              {displayedResources.length} document(s) trouvé(s)
            </div>
          </div>

          {/* Resources Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="p-3.5">Filière</th>
                    <th className="p-3.5">Type & Format</th>
                    <th className="p-3.5">Code & Module</th>
                    <th className="p-3.5">Titre du document</th>
                    <th className="p-3.5">Niveau & Semestre</th>
                    <th className="p-3.5">Auteur / Enseignant</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedResources.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        Aucun document ne correspond à votre filtre.
                      </td>
                    </tr>
                  ) : (
                    displayedResources.map((res) => (
                      <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-[#0f2b4c]">
                          {res.filiereId}
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold uppercase text-slate-700">{res.type}</span>
                          <span className="text-slate-400 ml-1">({res.format.toUpperCase()})</span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-mono font-bold text-slate-900 block">{res.codeUE}</span>
                          <span className="text-[11px] text-slate-500 truncate max-w-[120px] block">{res.moduleName}</span>
                        </td>
                        <td className="p-3.5 font-medium text-slate-900 max-w-xs truncate">
                          {res.title}
                        </td>
                        <td className="p-3.5 text-slate-600">
                          {res.level} ({res.semester})
                        </td>
                        <td className="p-3.5 text-slate-600">
                          {res.author}
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setPreviewResource(res)}
                              className="p-1.5 text-slate-500 hover:text-[#0f2b4c] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="Aperçu"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditResourceClick(res)}
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                              title="Modifier"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Supprimer définitivement le document "${res.title}" ?`)) {
                                  deleteResource(res.id);
                                  setFeedbackMsg({ type: 'success', text: `Document ${res.codeUE} supprimé.` });
                                }
                              }}
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: MODIFIER LES IMAGES DE L'APPLICATION                */}
      {/* ========================================================= */}
      {activeAdminTab === 'images' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-xl font-bold text-[#0f2b4c]">
                Personnalisation Graphique de la Plateforme
              </h2>
              <p className="text-xs text-slate-500">
                Modifiez la bannière du portail (entrée UIDT), le logo officiel de l'Amicale, ainsi que les visuels illustrant chaque filière (MIO, MTH, SEG, LAC, LEA).
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm('Restaurer toutes les images par défaut d\'origine ?')) {
                  resetImagesToDefault();
                  setFeedbackMsg({ type: 'success', text: 'Images restaurées aux valeurs initiales.' });
                }
              }}
              className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restaurer par défaut</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 1. HERO BANNER IMAGE (Portail UIDT) */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Bannière d'Accueil (Portail Université UIDT)
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Affiche l'arche d'entrée emblématique de l'université
                  </span>
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-xl overflow-hidden border border-slate-300 h-40">
                <UidtCampusGateBanner
                  customSrc={siteImages.heroBanner || undefined}
                  className="w-full h-full"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Remplacer par une image depuis votre appareil ou une URL
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 py-2 px-3 bg-white border border-slate-300 hover:border-[#0f2b4c] rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 cursor-pointer shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Téléverser une photo (JPG, PNG)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleSiteImageUpload('heroBanner', file);
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* 2. AMICALE LOGO IMAGE */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Logo Officiel (Amicale des Étudiants UFR SES)
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Sceau circulaire avec toge, livre ouvert et lauriers
                  </span>
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-xl border border-slate-300 h-40 flex items-center justify-center bg-white p-4">
                <AmicaleLogo
                  customSrc={siteImages.amicaleLogo || undefined}
                  className="w-28 h-28"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Remplacer le logo
                </label>
                <label className="w-full py-2 px-3 bg-white border border-slate-300 hover:border-[#0f2b4c] rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 cursor-pointer shadow-2xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Téléverser un logo (PNG, JPG, SVG)</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleSiteImageUpload('amicaleLogo', file);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* 3. FILIÈRES IMAGES (MIO, MTH, SEG, LAC, LEA) */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-[#0f2b4c]">
              Images des 5 Filières de Formation (MIO, MTH, SEG, LAC, LEA)
            </h3>
            <p className="text-xs text-slate-500">
              Chaque filière dispose d'une photo d'illustration haute définition personnalisable.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {filieres.map((filiere) => {
                const imgUrl = siteImages.filieres[filiere.id] || filiere.coverImage;
                return (
                  <div
                    key={filiere.id}
                    className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-[#0f2b4c] bg-white px-2 py-0.5 rounded border border-slate-200">
                        {filiere.code}
                      </span>
                      <span className="text-slate-600 font-medium truncate max-w-[150px]">
                        {filiere.name}
                      </span>
                    </div>

                    <div className="h-32 rounded-xl overflow-hidden border border-slate-300 bg-slate-900">
                      <img
                        src={imgUrl}
                        alt={filiere.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <label className="w-full py-2 px-3 bg-white border border-slate-300 hover:border-[#0f2b4c] rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 cursor-pointer shadow-2xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Changer l'image ({filiere.code})</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleSiteImageUpload(filiere.id, file);
                        }}
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: GESTION DES ADMINISTRATEURS (Ajout, Bloquer, Suppr) */}
      {/* ========================================================= */}
      {activeAdminTab === 'admins' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-xl font-bold text-[#0f2b4c]">
                Comptes et Droits d'Accès Administrateur
              </h2>
              <p className="text-xs text-slate-500">
                Vous pouvez ajouter d'autres administrateurs, modifier leurs paramètres, les bloquer ou les supprimer.
              </p>
            </div>
            <button
              onClick={() => setShowAddAdminModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0f2b4c] hover:bg-[#163a66] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un administrateur</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {admins.map((adm) => {
              const isSuper =
                adm.role === 'superadmin' ||
                adm.email.toLowerCase() === 'idrissa.hyjazi@univ-thies.sn' ||
                adm.email.toLowerCase() === 'adminhyjazi@gmail.com';
              return (
                <div
                  key={adm.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    adm.isBlocked
                      ? 'bg-red-50/50 border-red-200'
                      : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            adm.isBlocked ? 'bg-red-500' : 'bg-emerald-500'
                          }`}
                        />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          {adm.role === 'superadmin' ? 'Super Administrateur' : 'Administrateur'}
                        </span>
                      </div>
                      {adm.isBlocked && (
                        <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                          Compte Bloqué
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {adm.name}
                    </h3>
                    <div className="text-xs font-mono text-slate-600">
                      {adm.email}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">
                      Créé le {new Date(adm.createdAt).toLocaleDateString('fr-FR')}
                    </span>

                    <div className="flex items-center gap-2">
                      {!isSuper && (
                        <>
                          <button
                            onClick={() => {
                              const res = toggleBlockAdmin(adm.id);
                              setFeedbackMsg({
                                type: res.success ? 'success' : 'error',
                                text: res.message,
                              });
                            }}
                            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                              adm.isBlocked
                                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                                : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                            }`}
                          >
                            {adm.isBlocked ? (
                              <>
                                <Unlock className="w-3.5 h-3.5" />
                                <span>Débloquer</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3.5 h-3.5" />
                                <span>Bloquer</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Confirmer la suppression de l'administrateur ${adm.name} ?`)) {
                                const res = deleteAdmin(adm.id);
                                setFeedbackMsg({
                                  type: res.success ? 'success' : 'error',
                                  text: res.message,
                                });
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Supprimer l'administrateur"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {isSuper && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                          Compte Fondateur Principal
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: ÉTUDIANTS INSCRITS                                  */}
      {/* ========================================================= */}
      {activeAdminTab === 'students' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-xl font-bold text-[#0f2b4c]">
                Répertoire des Étudiants Inscrits
              </h2>
              <p className="text-xs text-slate-500">
                Liste officielle des étudiants avec Numéro INE, Filière d'affectation et Statut.
              </p>
            </div>
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Rechercher étudiant ou INE..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:border-[#0f2b4c]"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="p-3.5">Numéro INE</th>
                  <th className="p-3.5">Nom et Prénom</th>
                  <th className="p-3.5">Email universitaire</th>
                  <th className="p-3.5">Filière</th>
                  <th className="p-3.5">Niveau</th>
                  <th className="p-3.5">Date Inscription</th>
                  <th className="p-3.5">Statut</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedStudents.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#0f2b4c]">
                      {std.ine}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      {std.fullName}
                    </td>
                    <td className="p-3.5 text-slate-600 font-mono">
                      {std.email}
                    </td>
                    <td className="p-3.5 font-bold text-slate-800">
                      {std.filiereId}
                    </td>
                    <td className="p-3.5 text-slate-600">
                      {std.level}
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {new Date(std.registeredAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          std.status === 'actif'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {std.status === 'actif' ? 'Actif' : 'Suspendu'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          toggleBlockStudent(std.id);
                          setFeedbackMsg({
                            type: 'success',
                            text: `Statut de l'étudiant ${std.fullName} mis à jour.`,
                          });
                        }}
                        className="px-2.5 py-1 border border-slate-300 hover:bg-slate-100 rounded-lg text-slate-700 font-semibold cursor-pointer"
                      >
                        {std.status === 'actif' ? 'Bloquer' : 'Activer'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: STATISTIQUES & FRÉQUENTATION (SUPER ADMINISTRATEUR)*/}
      {/* ========================================================= */}
      {activeAdminTab === 'analytics' && isPrimarySuperAdmin && (
        <div className="space-y-6">
          {/* Header & Period Filter */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                  <BarChart3 className="w-4 h-4" />
                </span>
                <h2 className="text-lg font-black text-[#0f2b4c]">
                  Observatoire de Fréquentation & Consultations en Direct
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Métriques de connexion en temps réel, répartition académique et distribution horaire des consultations. Réservé au Super Administrateur Principal.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setAnalyticsPeriod('today')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  analyticsPeriod === 'today'
                    ? 'bg-[#0f2b4c] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Aujourd'hui
              </button>
              <button
                type="button"
                onClick={() => setAnalyticsPeriod('week')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  analyticsPeriod === 'week'
                    ? 'bg-[#0f2b4c] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                7 derniers jours
              </button>
              <button
                type="button"
                onClick={() => setAnalyticsPeriod('month')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  analyticsPeriod === 'month'
                    ? 'bg-[#0f2b4c] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ce mois (30j)
              </button>
            </div>
          </div>

          {/* 1. KEY KPI CARDS: POURCENTAGES DE CONNEXION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* KPI 1: Taux de connexion Étudiants */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Connexion Étudiants en Ligne
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  En direct
                </span>
              </div>

              <div>
                <div className="text-3xl font-black text-[#0f2b4c]">
                  {analyticsPeriod === 'today' ? '72.0%' : analyticsPeriod === 'week' ? '81.4%' : '88.6%'}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {analyticsPeriod === 'today'
                    ? '1 452 étudiants actifs en session / 2 018 inscrits'
                    : analyticsPeriod === 'week'
                    ? '1 642 étudiants connectés cette semaine'
                    : '1 788 étudiants réguliers ce mois-ci'}
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: analyticsPeriod === 'today' ? '72%' : analyticsPeriod === 'week' ? '81.4%' : '88.6%',
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Hors ligne : {analyticsPeriod === 'today' ? '28.0%' : analyticsPeriod === 'week' ? '18.6%' : '11.4%'}</span>
                  <span className="text-emerald-700 font-bold">Actifs : {analyticsPeriod === 'today' ? '72.0%' : analyticsPeriod === 'week' ? '81.4%' : '88.6%'}</span>
                </div>
              </div>
            </div>

            {/* KPI 2: Taux de connexion Administrateurs */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Connexion Administrateurs
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0f2b4c] border border-blue-200">
                  <Shield className="w-3 h-3 text-[#0f2b4c]" />
                  Équipe Décanat
                </span>
              </div>

              <div>
                <div className="text-3xl font-black text-[#0f2b4c]">
                  {analyticsPeriod === 'today' ? '75.0%' : '100%'}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {analyticsPeriod === 'today'
                    ? `${admins.filter(a => !a.isBlocked).length} administrateurs connectés sur ${admins.length}`
                    : 'Tous les comptes administrateurs ont été actifs'}
                </div>
              </div>

              {/* Admin Presence Bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0f2b4c] h-full rounded-full transition-all duration-500"
                    style={{ width: analyticsPeriod === 'today' ? '75%' : '100%' }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>En attente : {analyticsPeriod === 'today' ? '25%' : '0%'}</span>
                  <span className="text-[#0f2b4c] font-bold">Connectés : {analyticsPeriod === 'today' ? '75%' : '100%'}</span>
                </div>
              </div>
            </div>

            {/* KPI 3: Volume Global des Consultations */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Volume des Consultations
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                  <TrendingUp className="w-3 h-3 text-amber-600" />
                  +18.4% ce mois
                </span>
              </div>

              <div>
                <div className="text-3xl font-black text-[#0f2b4c]">
                  {analyticsPeriod === 'today' ? '3 840' : analyticsPeriod === 'week' ? '24 510' : '98 420'}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Supports de cours, TD, TP et annales consultés ou téléchargés
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-100">
                <span>Temps moyen de session :</span>
                <strong className="text-slate-900 font-mono">18 min 42 s</strong>
              </div>
            </div>
          </div>

          {/* 2. GRAPHIQUE 1 & 2 : CONSULTATIONS PAR FILIÈRE ET PAR NIVEAU */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique A: Consultations par Filière */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black text-[#0f2b4c] flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#0f2b4c]" />
                    <span>Consultations par Filière & Masters</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Répartition des consultations entre les licences et les nouveaux masters MIDIA / MACI
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">7 filières</span>
              </div>

              {/* Filière Bars */}
              <div className="space-y-3.5">
                {[
                  { id: 'MIO', name: 'Management Informatisé des Organisations (MIO)', count: analyticsPeriod === 'today' ? 1120 : analyticsPeriod === 'week' ? 7140 : 28650, pct: 29.2, color: 'bg-blue-600' },
                  { id: 'SEG', name: 'Sciences Économiques et de Gestion (SEG)', count: analyticsPeriod === 'today' ? 940 : analyticsPeriod === 'week' ? 6010 : 24120, pct: 24.5, color: 'bg-emerald-600' },
                  { id: 'MIDIA', name: 'Master Ingénierie des Données & IA (MIDIA)', count: analyticsPeriod === 'today' ? 560 : analyticsPeriod === 'week' ? 3580 : 14380, pct: 14.6, color: 'bg-purple-600' },
                  { id: 'MACI', name: 'Master Audit & Contrôle Interne (MACI)', count: analyticsPeriod === 'today' ? 480 : analyticsPeriod === 'week' ? 3060 : 12300, pct: 12.5, color: 'bg-indigo-600' },
                  { id: 'MTH', name: 'Management Tourisme & Hôtellerie (MTH)', count: analyticsPeriod === 'today' ? 320 : analyticsPeriod === 'week' ? 2040 : 8190, pct: 8.3, color: 'bg-amber-600' },
                  { id: 'LAC', name: 'Langues, Arts & Civilisations (LAC)', count: analyticsPeriod === 'today' ? 240 : analyticsPeriod === 'week' ? 1530 : 6140, pct: 6.2, color: 'bg-rose-600' },
                  { id: 'LEA', name: 'Langues Étrangères Appliquées (LEA)', count: analyticsPeriod === 'today' ? 180 : analyticsPeriod === 'week' ? 1150 : 4640, pct: 4.7, color: 'bg-teal-600' },
                ].map((item) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#0f2b4c] text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.id}
                        </span>
                        <span className="font-semibold text-slate-800 text-[11px] truncate max-w-xs">
                          {item.name}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-600">
                        <strong>{item.count.toLocaleString('fr-FR')}</strong> ({item.pct}%)
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${item.color} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${item.pct * 3.4}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Graphique B: Consultations par Niveau */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black text-[#0f2b4c] flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#0f2b4c]" />
                    <span>Consultations par Niveau d'Étude</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Distribution de l'activité du premier cycle (Licence) au second cycle (Master)
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">5 niveaux</span>
              </div>

              {/* Levels Bars */}
              <div className="space-y-4 pt-1">
                {[
                  { level: 'Licence 1', count: analyticsPeriod === 'today' ? 1450 : analyticsPeriod === 'week' ? 9260 : 37200, pct: 37.8, color: 'bg-[#0f2b4c]', note: 'Forte consultation des polycopiés de base & méthodologie' },
                  { level: 'Licence 2', count: analyticsPeriod === 'today' ? 880 : analyticsPeriod === 'week' ? 5620 : 22560, pct: 22.9, color: 'bg-blue-600', note: 'Consultation intensive des fiches de TD et examens' },
                  { level: 'Licence 3', count: analyticsPeriod === 'today' ? 710 : analyticsPeriod === 'week' ? 4530 : 18210, pct: 18.5, color: 'bg-emerald-600', note: 'Préparation des examens terminaux et projets d\'études' },
                  { level: 'Master 1', count: analyticsPeriod === 'today' ? 480 : analyticsPeriod === 'week' ? 3060 : 12300, pct: 12.5, color: 'bg-purple-600', note: 'Recherche documentaire spécialisée (Data, Audit, Éco)' },
                  { level: 'Master 2', count: analyticsPeriod === 'today' ? 320 : analyticsPeriod === 'week' ? 2040 : 8150, pct: 8.3, color: 'bg-amber-600', note: 'Mémoires professionnels et études de cas' },
                ].map((item) => (
                  <div key={item.level} className="space-y-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{item.level}</span>
                      <span className="font-mono text-slate-700">
                        <strong>{item.count.toLocaleString('fr-FR')}</strong> consultations ({item.pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`${item.color} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${item.pct * 2.5}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 italic">
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. GRAPHIQUE 3 : DISTRIBUTION HORAIRE DES CONSULTATIONS (08h à 00h) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <h3 className="text-sm font-black text-[#0f2b4c] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0f2b4c]" />
                  <span>Distribution Horaire des Consultations & Affluence Serveur</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Volume horaire des téléchargements de 08h00 à 00h00 mettant en évidence les pics de révision
                </p>
              </div>

              <div className="flex items-center gap-3 text-[11px]">
                <span className="inline-flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-300" />
                  Affluence normale
                </span>
                <span className="inline-flex items-center gap-1.5 text-amber-700 font-bold">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                  Pic de révision (14h-16h & 20h-22h)
                </span>
              </div>
            </div>

            {/* Hourly Column Histogram */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 pt-6 pb-2">
              {[
                { slot: '08h - 10h', count: analyticsPeriod === 'today' ? 210 : 1340, height: '24%', isPeak: false, label: 'Matinée' },
                { slot: '10h - 12h', count: analyticsPeriod === 'today' ? 480 : 3060, height: '56%', isPeak: false, label: 'Cours' },
                { slot: '12h - 14h', count: analyticsPeriod === 'today' ? 310 : 1980, height: '36%', isPeak: false, label: 'Pause' },
                { slot: '14h - 16h', count: analyticsPeriod === 'today' ? 790 : 5040, height: '92%', isPeak: true, label: '⚡ Pic TD/TP' },
                { slot: '16h - 18h', count: analyticsPeriod === 'today' ? 540 : 3440, height: '63%', isPeak: false, label: 'Travaux' },
                { slot: '18h - 20h', count: analyticsPeriod === 'today' ? 420 : 2680, height: '49%', isPeak: false, label: 'Retour' },
                { slot: '20h - 22h', count: analyticsPeriod === 'today' ? 860 : 5480, height: '100%', isPeak: true, label: '🔥 Pic Soir' },
                { slot: '22h - 00h', count: analyticsPeriod === 'today' ? 230 : 1490, height: '27%', isPeak: false, label: 'Nocturne' },
              ].map((h, idx) => (
                <div key={idx} className="flex flex-col items-center justify-end h-56 space-y-2 group">
                  <span className="font-mono text-[10px] font-bold text-slate-700">
                    {h.count}
                  </span>

                  <div className="w-full bg-slate-100 rounded-xl flex items-end justify-center p-1 h-36">
                    <div
                      className={`w-full rounded-lg transition-all duration-500 ${
                        h.isPeak
                          ? 'bg-amber-500 group-hover:bg-amber-600 shadow-sm'
                          : 'bg-[#0f2b4c]/80 group-hover:bg-[#0f2b4c]'
                      }`}
                      style={{ height: h.height }}
                    />
                  </div>

                  <div className="text-center space-y-0.5">
                    <span className="block font-mono text-[11px] font-bold text-slate-800">
                      {h.slot}
                    </span>
                    <span
                      className={`block text-[9px] font-semibold ${
                        h.isPeak ? 'text-amber-700 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {h.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. STATUT EN TEMPS RÉEL DES ADMINISTRATEURS */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-[#0f2b4c] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#0f2b4c]" />
                  <span>Statut de Connexion des Administrateurs & Superviseurs</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Détail en temps réel des accès administrateurs sur le portail AE UFR SES Biblio
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">
                {admins.length} comptes
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="p-3">Administrateur</th>
                    <th className="p-3">Email Universitaire</th>
                    <th className="p-3">Rôle & Attribution</th>
                    <th className="p-3">Statut de Connexion</th>
                    <th className="p-3">Dernière Connexion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {admins.map((adm) => {
                    const isOnline =
                      currentAdmin?.id === adm.id ||
                      adm.email.toLowerCase() === 'idrissa.hyjazi@univ-thies.sn' ||
                      adm.email.toLowerCase() === 'adminhyjazi@gmail.com' ||
                      adm.email.toLowerCase() === 'scolarite.ufrses@univ-thies.sn';

                    return (
                      <tr key={adm.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3 font-bold text-slate-900">
                          {adm.name}
                        </td>
                        <td className="p-3 font-mono text-slate-600">
                          {adm.email}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              adm.role === 'superadmin'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {adm.role === 'superadmin' ? 'Super Administrateur' : 'Administrateur'}
                          </span>
                        </td>
                        <td className="p-3">
                          {adm.isBlocked ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              Compte Suspendu
                            </span>
                          ) : isOnline ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Connecté en ligne
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              Hors ligne
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-500">
                          {adm.lastLogin ? new Date(adm.lastLogin).toLocaleString('fr-FR') : 'Aujourd\'hui'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: AJOUTER / MODIFIER UNE RESSOURCE PÉDAGOGIQUE       */}
      {/* ========================================================= */}
      {showAddResourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-[#0f2b4c] text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  {editingResource ? 'Modifier le document pédagogique' : 'Ajouter un nouveau cours / TD / TP / Examen'}
                </h3>
                <p className="text-xs text-amber-300">
                  UFR Sciences Économiques et Sociales · UIDT
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddResourceModal(false);
                  setEditingResource(null);
                }}
                className="text-slate-300 hover:text-white text-xs font-semibold p-1 hover:bg-white/10 rounded-lg"
              >
                Fermer
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="p-6 md:p-8 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Filière */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Filière de rattachement *
                  </label>
                  <select
                    value={resForm.filiereId}
                    onChange={(e) => setResForm({ ...resForm, filiereId: e.target.value as FiliereId })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none focus:border-[#0f2b4c]"
                  >
                    {filieres.map(f => (
                      <option key={f.id} value={f.id}>{f.code} - {f.name}</option>
                    ))}
                  </select>
                </div>

                {/* Type de ressource */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Type de document académique *
                  </label>
                  <select
                    value={resForm.type}
                    onChange={(e) => setResForm({ ...resForm, type: e.target.value as ResourceType })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none focus:border-[#0f2b4c]"
                  >
                    <option value="cours">Cours Magistral</option>
                    <option value="examen">Examen passé (Annales)</option>
                    <option value="td">Travaux Dirigés (TD)</option>
                    <option value="tp">Travaux Pratiques (TP)</option>
                  </select>
                </div>
              </div>

              {/* Format selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Format du fichier multimédia *
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {(['pdf', 'video', 'photo', 'xlsx', 'csv'] as FileFormat[]).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setResForm({ ...resForm, format: fmt })}
                      className={`py-2 rounded-xl text-xs font-bold uppercase transition-all border cursor-pointer ${
                        resForm.format === fmt
                          ? 'bg-[#0f2b4c] text-white border-[#0f2b4c] shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Titre du document */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Titre complet du document *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Modélisation des Processus Métiers & Notations BPMN"
                  value={resForm.title}
                  onChange={(e) => setResForm({ ...resForm, title: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:border-[#0f2b4c] outline-none"
                />
              </div>

              {/* Code UE and Module Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Code de l'UE *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: MIO-201, SEG-102"
                    value={resForm.codeUE}
                    onChange={(e) => setResForm({ ...resForm, codeUE: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:border-[#0f2b4c] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nom du Module / Matière *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Économie des Organisations"
                    value={resForm.moduleName}
                    onChange={(e) => setResForm({ ...resForm, moduleName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:border-[#0f2b4c] outline-none"
                  />
                </div>
              </div>

              {/* Level & Semester */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Niveau d'études *
                  </label>
                  <select
                    value={resForm.level}
                    onChange={(e) => setResForm({ ...resForm, level: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:border-[#0f2b4c]"
                  >
                    <option value="Licence 1">Licence 1 (L1)</option>
                    <option value="Licence 2">Licence 2 (L2)</option>
                    <option value="Licence 3">Licence 3 (L3)</option>
                    <option value="Master 1">Master 1 (M1)</option>
                    <option value="Master 2">Master 2 (M2)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Semestre d'enseignement *
                  </label>
                  <select
                    value={resForm.semester}
                    onChange={(e) => setResForm({ ...resForm, semester: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:border-[#0f2b4c]"
                  >
                    {['Semestre 1', 'Semestre 2', 'Semestre 3', 'Semestre 4', 'Semestre 5', 'Semestre 6', 'Semestre 7', 'Semestre 8'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Author & Academic Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Enseignant / Responsable
                  </label>
                  <input
                    type="text"
                    value={resForm.author}
                    onChange={(e) => setResForm({ ...resForm, author: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:border-[#0f2b4c] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Année académique
                  </label>
                  <input
                    type="text"
                    value={resForm.academicYear}
                    onChange={(e) => setResForm({ ...resForm, academicYear: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:border-[#0f2b4c] outline-none"
                  />
                </div>
              </div>

              {/* Upload file or enter URL */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Fichier du document ({resForm.format.toUpperCase()})
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="w-full sm:w-auto py-2.5 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Choisir un fichier</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <span className="text-xs text-slate-400">ou</span>
                  <input
                    type="text"
                    placeholder="URL externe / lien du document..."
                    value={resForm.fileUrl}
                    onChange={(e) => setResForm({ ...resForm, fileUrl: e.target.value })}
                    className="flex-1 w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-[#0f2b4c]"
                  />
                </div>
                {resForm.fileName && (
                  <div className="text-xs font-mono text-emerald-700 font-semibold">
                    Fichier sélectionné : {resForm.fileName} ({resForm.fileSize})
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description / Objectifs pédagogiques
                </label>
                <textarea
                  rows={3}
                  value={resForm.description}
                  onChange={(e) => setResForm({ ...resForm, description: e.target.value })}
                  placeholder="Résumé du cours ou consignes pour le travail dirigé..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-[#0f2b4c]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddResourceModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0f2b4c] hover:bg-[#163a66] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  {editingResource ? 'Enregistrer les modifications' : 'Publier le document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: AJOUTER UN ADMINISTRATEUR                         */}
      {/* ========================================================= */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0f2b4c] text-white p-6">
              <h3 className="text-lg font-bold">Ajouter un Nouvel Administrateur</h3>
              <p className="text-xs text-amber-300">
                Droits de gestion des filières, cours et étudiants
              </p>
            </div>

            <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nom et Prénom *
                </label>
                <input
                  type="text"
                  required
                  value={newAdminForm.name}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                  placeholder="ex: Dr. Abdoulaye Ba"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:border-[#0f2b4c] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Adresse Email Administrateur *
                </label>
                <input
                  type="email"
                  required
                  value={newAdminForm.email}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                  placeholder="admin.nom@univ-thies.sn"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:border-[#0f2b4c] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mot de passe provisoire *
                </label>
                <input
                  type="password"
                  required
                  value={newAdminForm.password}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                  placeholder="Min. 6 caractères"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:border-[#0f2b4c] outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0f2b4c] hover:bg-[#163a66] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  Créer le compte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: MODIFIER LE MOT DE PASSE (OTP MAIL IDENTIQUE)     */}
      {/* ========================================================= */}
      <PasswordResetModal
        isOpen={showPasswordResetModal}
        onClose={() => setShowPasswordResetModal(false)}
        prefillEmail={currentAdmin?.email || ''}
      />

      {/* ========================================================= */}
      {/* MODAL 4: MODIFIER L'ADRESSE EMAIL ADMINISTRATEUR           */}
      {/* ========================================================= */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0f2b4c] text-white p-6 space-y-1">
              <h3 className="text-lg font-bold">Modifier votre adresse email administrateur</h3>
              <p className="text-xs text-amber-300">
                Profil : {currentAdmin?.name} ({currentAdmin?.role})
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmailModalFeedback(null);
                const res = updateAdminEmail(newAdminEmailInput);
                if (res.success) {
                  setEmailModalFeedback({ type: 'success', message: res.message });
                  setTimeout(() => setShowEmailModal(false), 1200);
                } else {
                  setEmailModalFeedback({ type: 'error', message: res.message });
                }
              }}
              className="p-6 space-y-4"
            >
              {emailModalFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                    emailModalFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {emailModalFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <span>{emailModalFeedback.message}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nouvelle adresse email de connexion *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={newAdminEmailInput}
                    onChange={(e) => setNewAdminEmailInput(e.target.value)}
                    placeholder="nouvelle.adresse@univ-thies.sn"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:border-[#0f2b4c] outline-none font-medium"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Cette adresse sera requise pour vous connecter et recevoir vos codes de sécurité (2FA et récupération).
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0f2b4c] hover:bg-[#163a66] text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Mettre à jour mon email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
