import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HistoricalFigure, AmicaleNewsArticle } from '../../types';
import { AmicaleLogo } from '../BrandLogos';
import {
  Calendar,
  Clock,
  User,
  Plus,
  Edit2,
  Trash2,
  Video,
  Image as ImageIcon,
  Tag,
  Share2,
  ChevronRight,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  BookOpen,
  Award,
  Sparkles,
  Play,
  FileText,
} from 'lucide-react';

export const AmicaleActivitiesView: React.FC = () => {
  const {
    activitesSubTab,
    setActivitesSubTab,
    historicalFigures,
    amicaleNews,
    currentAdmin,
    addHistoricalFigure,
    updateHistoricalFigure,
    deleteHistoricalFigure,
    addAmicaleNews,
    updateAmicaleNews,
    deleteAmicaleNews,
  } = useApp();

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // --- HISTORICAL FIGURES MODAL STATE ---
  const [showFigureModal, setShowFigureModal] = useState(false);
  const [editingFigure, setEditingFigure] = useState<HistoricalFigure | null>(null);
  const [figureForm, setFigureForm] = useState({
    fullName: '',
    titleOrRole: '',
    period: '',
    photoUrl: '',
    biography: '',
    achievementsText: '',
  });

  // --- NEWS & REDACTION MODAL STATE ---
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<AmicaleNewsArticle | null>(null);
  const [newsForm, setNewsForm] = useState<{
    title: string;
    theme: string;
    category: 'actualite' | 'evenement' | 'communique' | 'redaction';
    summary: string;
    content: string;
    authorName: string;
    authorRole: string;
    date: string;
    photoUrl: string;
    videoUrl: string;
    tagsText: string;
  }>({
    title: '',
    theme: '',
    category: 'actualite',
    summary: '',
    content: '',
    authorName: currentAdmin?.name || 'Bureau de l\'Amicale',
    authorRole: currentAdmin?.role === 'superadmin' ? 'Super Administrateur' : 'Administrateur Secondaire',
    date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    photoUrl: '',
    videoUrl: '',
    tagsText: '',
  });

  // Article reader modal
  const [selectedArticleToRead, setSelectedArticleToRead] = useState<AmicaleNewsArticle | null>(null);

  // Filters for News
  const [newsCategoryFilter, setNewsCategoryFilter] = useState<'all' | 'actualite' | 'evenement' | 'communique' | 'redaction'>('all');
  const [newsSearch, setNewsSearch] = useState('');

  // Handle Figure Form Submit
  const handleSaveFigure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!figureForm.fullName.trim() || !figureForm.titleOrRole.trim()) {
      setNotification({ type: 'error', text: 'Veuillez renseigner le nom et le rôle de la figure historique.' });
      return;
    }

    const achievements = figureForm.achievementsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const defaultPhoto = figureForm.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80';

    if (editingFigure) {
      updateHistoricalFigure(editingFigure.id, {
        fullName: figureForm.fullName,
        titleOrRole: figureForm.titleOrRole,
        period: figureForm.period,
        photoUrl: defaultPhoto,
        biography: figureForm.biography,
        achievements,
      });
      setNotification({ type: 'success', text: 'Figure historique mise à jour dans la revue de l\'Amicale.' });
    } else {
      addHistoricalFigure({
        fullName: figureForm.fullName,
        titleOrRole: figureForm.titleOrRole,
        period: figureForm.period,
        photoUrl: defaultPhoto,
        biography: figureForm.biography,
        achievements,
      });
      setNotification({ type: 'success', text: 'Nouvelle figure historique enregistrée avec succès.' });
    }

    setShowFigureModal(false);
    setEditingFigure(null);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleEditFigureClick = (fig: HistoricalFigure) => {
    setEditingFigure(fig);
    setFigureForm({
      fullName: fig.fullName,
      titleOrRole: fig.titleOrRole,
      period: fig.period,
      photoUrl: fig.photoUrl,
      biography: fig.biography,
      achievementsText: fig.achievements ? fig.achievements.join('\n') : '',
    });
    setShowFigureModal(true);
  };

  const handleDeleteFigureClick = (id: string, name: string) => {
    if (window.confirm(`Confirmez-vous la suppression de ${name} de la revue historique ?`)) {
      deleteHistoricalFigure(id);
      setNotification({ type: 'success', text: `La figure historique ${name} a été retirée.` });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  // Handle Image Upload for Figure
  const handleFigurePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFigureForm(prev => ({
          ...prev,
          photoUrl: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle News Form Submit
  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title.trim() || !newsForm.content.trim()) {
      setNotification({ type: 'error', text: 'Veuillez saisir au moins le titre et le contenu de la rédaction.' });
      return;
    }

    const tags = newsForm.tagsText
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const photos = newsForm.photoUrl ? [newsForm.photoUrl] : [];

    if (editingNews) {
      updateAmicaleNews(editingNews.id, {
        title: newsForm.title,
        theme: newsForm.theme || 'Vie Universitaire',
        category: newsForm.category,
        summary: newsForm.summary || newsForm.content.slice(0, 160) + '...',
        content: newsForm.content,
        authorName: newsForm.authorName,
        authorRole: newsForm.authorRole,
        date: newsForm.date,
        photos: photos.length > 0 ? photos : editingNews.photos,
        videoUrl: newsForm.videoUrl || undefined,
        tags: tags.length > 0 ? tags : editingNews.tags,
      });
      setNotification({ type: 'success', text: 'Rédaction / Actualité mise à jour avec succès.' });
    } else {
      addAmicaleNews({
        title: newsForm.title,
        theme: newsForm.theme || 'Vie Universitaire',
        category: newsForm.category,
        summary: newsForm.summary || newsForm.content.slice(0, 160) + '...',
        content: newsForm.content,
        authorName: newsForm.authorName || currentAdmin?.name || 'Administrateur',
        authorRole: newsForm.authorRole || 'Admin Secondaire',
        date: newsForm.date || new Date().toLocaleDateString('fr-FR'),
        photos,
        videoUrl: newsForm.videoUrl || undefined,
        tags: tags.length > 0 ? tags : ['Amicale', 'UFR SES'],
      });
      setNotification({ type: 'success', text: 'Nouvel article publié avec succès sur l\'espace actualités.' });
    }

    setShowNewsModal(false);
    setEditingNews(null);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleEditNewsClick = (article: AmicaleNewsArticle) => {
    setEditingNews(article);
    setNewsForm({
      title: article.title,
      theme: article.theme,
      category: article.category,
      summary: article.summary,
      content: article.content,
      authorName: article.authorName,
      authorRole: article.authorRole,
      date: article.date,
      photoUrl: article.photos[0] || '',
      videoUrl: article.videoUrl || '',
      tagsText: article.tags.join(', '),
    });
    setShowNewsModal(true);
  };

  const handleDeleteNewsClick = (id: string, title: string) => {
    if (window.confirm(`Confirmez-vous la suppression de l'article "${title}" ?`)) {
      deleteAmicaleNews(id);
      setNotification({ type: 'success', text: 'Article supprimé avec succès.' });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleNewsPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewsForm(prev => ({
          ...prev,
          photoUrl: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Filtered news
  const filteredNews = amicaleNews.filter(article => {
    if (newsCategoryFilter !== 'all' && article.category !== newsCategoryFilter) return false;
    if (newsSearch.trim()) {
      const q = newsSearch.toLowerCase();
      const match =
        article.title.toLowerCase().includes(q) ||
        article.theme.toLowerCase().includes(q) ||
        article.content.toLowerCase().includes(q) ||
        article.authorName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner */}
      <div className="bg-[#0f2b4c] text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <AmicaleLogo className="w-20 h-20 shrink-0 drop-shadow-md" />
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Vie Universitaire & Mémoire Collective</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Activités de l'Amicale des Étudiants
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                Retrouvez la revue historique des pionniers et présidents de l'Amicale ainsi que les actualités, rédactions, événements, photos et vidéos de la vie estudiantine de l'UFR SES (UIDT).
              </p>
            </div>
          </div>

          {/* Sub-tab switcher */}
          <div className="flex items-center bg-white/10 p-1 rounded-2xl border border-white/20 shrink-0">
            <button
              type="button"
              onClick={() => setActivitesSubTab('historique')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activitesSubTab === 'historique'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Revue Historique</span>
            </button>
            <button
              type="button"
              onClick={() => setActivitesSubTab('actualites')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activitesSubTab === 'actualites'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Actualités & Rédactions</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Notification Feedback */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between animate-in fade-in shadow-xs ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span className="font-semibold">{notification.text}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: REVUE HISTORIQUE */}
      {activitesSubTab === 'historique' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-lg font-bold text-[#0f2b4c]">
                Revue Historique de l'Amicale des Étudiants de l'UFR SES
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Hommage aux personnalités, anciens présidents et fondateurs qui ont façonné l'histoire de notre amicale
              </p>
            </div>

            {/* Admin Add Figure Button */}
            {currentAdmin && (
              <button
                type="button"
                onClick={() => {
                  setEditingFigure(null);
                  setFigureForm({
                    fullName: '',
                    titleOrRole: '',
                    period: '',
                    photoUrl: '',
                    biography: '',
                    achievementsText: '',
                  });
                  setShowFigureModal(true);
                }}
                className="px-4 py-2.5 bg-[#0f2b4c] hover:bg-[#163a66] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Ajouter une figure historique</span>
              </button>
            )}
          </div>

          {/* Historical Figures Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historicalFigures.map((fig) => (
              <div
                key={fig.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo with Overlay Badge */}
                  <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={fig.photoUrl}
                      alt={fig.fullName}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="inline-block bg-amber-500/90 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black uppercase mb-1">
                        {fig.period}
                      </div>
                      <h3 className="text-lg font-extrabold leading-tight">
                        {fig.fullName}
                      </h3>
                      <p className="text-xs text-amber-300 font-medium">
                        {fig.titleOrRole}
                      </p>
                    </div>
                  </div>

                  {/* Biography & Commentary */}
                  <div className="p-5 space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Revue Historique & Biographie
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {fig.biography}
                      </p>
                    </div>

                    {/* Achievements */}
                    {fig.achievements && fig.achievements.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Réalisations majeures :
                        </span>
                        <ul className="space-y-1">
                          {fig.achievements.map((item, idx) => (
                            <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                              <span className="text-amber-600 font-bold shrink-0">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin controls: Modifier / Supprimer */}
                {currentAdmin && (
                  <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">
                      Gestion administrateur
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditFigureClick(fig)}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-[#0f2b4c] rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Modifier</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteFigureClick(fig.id, fig.fullName)}
                        className="px-2.5 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ACTUALITÉS & RÉDACTIONS */}
      {activitesSubTab === 'actualites' && (
        <div className="space-y-6">
          {/* Action bar and filters */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#0f2b4c]">
                  Actualités, Événements & Rédactions
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publications rédigées par l'équipe administrative et les administrateurs secondaires de l'Amicale
                </p>
              </div>

              {/* Add News Button for any logged-in administrator */}
              {currentAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingNews(null);
                    setNewsForm({
                      title: '',
                      theme: '',
                      category: 'actualite',
                      summary: '',
                      content: '',
                      authorName: currentAdmin.name,
                      authorRole: currentAdmin.role === 'superadmin' ? 'Super Administrateur' : 'Administrateur Secondaire',
                      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
                      photoUrl: '',
                      videoUrl: '',
                      tagsText: 'Amicale, UFR SES',
                    });
                    setShowNewsModal(true);
                  }}
                  className="px-4 py-2.5 bg-[#0f2b4c] hover:bg-[#163a66] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Nouvelle Rédaction / Publication</span>
                </button>
              )}
            </div>

            {/* Filter tags & Search */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: 'Toutes les rédactions' },
                  { id: 'actualite', label: 'Actualités' },
                  { id: 'evenement', label: 'Événements' },
                  { id: 'communique', label: 'Communiqués' },
                  { id: 'redaction', label: 'Analyses & Débats' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setNewsCategoryFilter(cat.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      newsCategoryFilter === cat.id
                        ? 'bg-[#0f2b4c] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher par thème..."
                  value={newsSearch}
                  onChange={(e) => setNewsSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-[#0f2b4c] outline-none"
                />
              </div>
            </div>
          </div>

          {/* News Articles Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredNews.map((article) => {
              const coverImg = article.photos[0] || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80';

              return (
                <div
                  key={article.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Media */}
                    <div className="relative h-56 w-full bg-slate-900 overflow-hidden">
                      <img
                        src={coverImg}
                        alt={article.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="bg-amber-500 text-slate-950 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                          {article.category}
                        </span>
                        <span className="bg-[#0f2b4c]/90 text-white px-2.5 py-1 rounded-md text-[10px] font-bold border border-white/20">
                          {article.theme}
                        </span>
                      </div>

                      {/* Video indicator badge if videoUrl present */}
                      {article.videoUrl && (
                        <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-md">
                          <Play className="w-3 h-3 fill-current" />
                          <span>Vidéo incluse</span>
                        </div>
                      )}

                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <div className="flex items-center gap-2 text-[11px] text-amber-300 font-semibold mb-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{article.date}</span>
                        </div>
                        <h3 className="text-base font-extrabold leading-snug line-clamp-2">
                          {article.title}
                        </h3>
                      </div>
                    </div>

                    {/* Article Content Preview */}
                    <div className="p-5 space-y-4">
                      {/* Author byline */}
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-bold text-slate-800">{article.authorName}</span>
                        <span>·</span>
                        <span className="text-amber-700 font-medium">{article.authorRole}</span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {article.summary}
                      </p>

                      {/* Video Player Embed preview if available */}
                      {article.videoUrl && (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f2b4c]">
                            <Video className="w-4 h-4 text-red-600" />
                            <span>Média Vidéo Associé</span>
                          </div>
                          {article.videoUrl.includes('youtube.com') || article.videoUrl.includes('youtu.be') ? (
                            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                              <iframe
                                src={article.videoUrl.replace('watch?v=', 'embed/')}
                                title={article.title}
                                className="w-full h-full"
                                allowFullScreen
                              />
                            </div>
                          ) : (
                            <video
                              controls
                              className="w-full rounded-lg max-h-48 bg-black object-contain"
                              src={article.videoUrl}
                            />
                          )}
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        {article.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer actions: Read full article + Admin controls */}
                  <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedArticleToRead(article)}
                      className="text-xs font-bold text-[#0f2b4c] hover:text-amber-700 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Lire l'intégralité de la rédaction</span>
                    </button>

                    {currentAdmin && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditNewsClick(article)}
                          className="p-1.5 bg-white border border-slate-200 text-slate-700 hover:text-[#0f2b4c] rounded-lg transition-colors cursor-pointer"
                          title="Modifier la rédaction"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteNewsClick(article.id, article.title)}
                          className="p-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Supprimer la publication"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- MODAL 1: ADD / EDIT HISTORICAL FIGURE --- */}
      {showFigureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0f2b4c] text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-amber-400" />
                <h3 className="text-base font-bold">
                  {editingFigure ? 'Modifier la Figure Historique' : 'Ajouter une Figure Historique (Revue)'}
                </h3>
              </div>
              <button
                onClick={() => setShowFigureModal(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFigure} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Nom et Prénom du Personnage *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Moustapha Diallo"
                  value={figureForm.fullName}
                  onChange={(e) => setFigureForm({ ...figureForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0f2b4c] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Titre ou Rôle Officiel *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Président de l'Amicale SES"
                    value={figureForm.titleOrRole}
                    onChange={(e) => setFigureForm({ ...figureForm, titleOrRole: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0f2b4c] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Période / Mandat
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Mandat 2018 - 2020"
                    value={figureForm.period}
                    onChange={(e) => setFigureForm({ ...figureForm, period: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0f2b4c] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Photo du Personnage (Fichier ou URL)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="https://... ou téléchargez ci-contre"
                    value={figureForm.photoUrl}
                    onChange={(e) => setFigureForm({ ...figureForm, photoUrl: e.target.value })}
                    className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0f2b4c] outline-none"
                  />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Téléverser</span>
                    <input type="file" accept="image/*" onChange={handleFigurePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Commentaires Historiques & Biographie *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Rédigez ici le parcours de cette personnalité, ses contributions clés au sein de l'amicale, ses luttes étudiantes et son impact sur l'UFR SES..."
                  value={figureForm.biography}
                  onChange={(e) => setFigureForm({ ...figureForm, biography: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0f2b4c] outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Réalisations Majeures (Une par ligne)
                </label>
                <textarea
                  rows={3}
                  placeholder="Création de la caisse d'entraide&#10;Digitalisation des annales&#10;Organisation du colloque international"
                  value={figureForm.achievementsText}
                  onChange={(e) => setFigureForm({ ...figureForm, achievementsText: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0f2b4c] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFigureModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0f2b4c] hover:bg-[#163a66] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {editingFigure ? 'Enregistrer les modifications' : 'Ajouter à la revue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: ADD / EDIT NEWS ARTICLE --- */}
      {showNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0f2b4c] text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-amber-400" />
                <h3 className="text-base font-bold">
                  {editingNews ? 'Modifier la Rédaction / Actualité' : 'Publier une Rédaction / Actualité (Admin)'}
                </h3>
              </div>
              <button
                onClick={() => setShowNewsModal(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Titre de la publication *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Grande Cérémonie d'Intégration de l'UFR SES"
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0f2b4c] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Catégorie
                  </label>
                  <select
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0f2b4c] outline-none"
                  >
                    <option value="actualite">Actualité</option>
                    <option value="evenement">Événement</option>
                    <option value="communique">Communiqué</option>
                    <option value="redaction">Analyse & Rédaction</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Titre du Thème
                </label>
                <input
                  type="text"
                  placeholder="ex: Journée Pédagogique & Accueil Promotion 2026"
                  value={newsForm.theme}
                  onChange={(e) => setNewsForm({ ...newsForm, theme: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0f2b4c] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Auteur / Signataire
                  </label>
                  <input
                    type="text"
                    value={newsForm.authorName}
                    onChange={(e) => setNewsForm({ ...newsForm, authorName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0f2b4c] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Rôle de l'Auteur
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Admin Secondaire, Secrétaire Général"
                    value={newsForm.authorRole}
                    onChange={(e) => setNewsForm({ ...newsForm, authorRole: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0f2b4c] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Photo illustrative (Téléversement ou URL)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="https://... ou téléchargez votre image"
                    value={newsForm.photoUrl}
                    onChange={(e) => setNewsForm({ ...newsForm, photoUrl: e.target.value })}
                    className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0f2b4c] outline-none"
                  />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Image</span>
                    <input type="file" accept="image/*" onChange={handleNewsPhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Lien Vidéo (Lien YouTube ou fichier MP4)
                </label>
                <div className="relative">
                  <Video className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=... ou https://.../video.mp4"
                    value={newsForm.videoUrl}
                    onChange={(e) => setNewsForm({ ...newsForm, videoUrl: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0f2b4c] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Texte de Rédaction Complet *
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Rédigez votre article, annonce ou compte-rendu avec toutes les précisions nécessaires..."
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0f2b4c] outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Mots-clés / Tags (séparés par des virgules)
                </label>
                <input
                  type="text"
                  placeholder="Intégration, UIDT, Conférence, Masters"
                  value={newsForm.tagsText}
                  onChange={(e) => setNewsForm({ ...newsForm, tagsText: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0f2b4c] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewsModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0f2b4c] hover:bg-[#163a66] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {editingNews ? 'Enregistrer les modifications' : 'Publier l\'article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: FULL ARTICLE READER --- */}
      {selectedArticleToRead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="relative h-64 w-full bg-slate-900 shrink-0">
              <img
                src={selectedArticleToRead.photos[0] || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80'}
                alt={selectedArticleToRead.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent" />
              
              <button
                type="button"
                onClick={() => setSelectedArticleToRead(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-1.5 rounded-full backdrop-blur-xs cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1.5">
                <div className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded text-[10px] font-black uppercase">
                  {selectedArticleToRead.category} · {selectedArticleToRead.theme}
                </div>
                <h2 className="text-xl font-black leading-snug drop-shadow-sm">
                  {selectedArticleToRead.title}
                </h2>
              </div>
            </div>

            {/* Reader Content Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#0f2b4c]" />
                  <span className="font-bold text-slate-800">{selectedArticleToRead.authorName}</span>
                  <span>({selectedArticleToRead.authorRole})</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>{selectedArticleToRead.date}</span>
                </div>
              </div>

              {/* Text */}
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-4 font-normal">
                {selectedArticleToRead.content}
              </div>

              {/* Video Player if available */}
              {selectedArticleToRead.videoUrl && (
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-[#0f2b4c] uppercase tracking-wider flex items-center gap-2">
                    <Video className="w-4 h-4 text-red-600" />
                    <span>Enregistrement Vidéo de l'Événement</span>
                  </h4>
                  {selectedArticleToRead.videoUrl.includes('youtube.com') || selectedArticleToRead.videoUrl.includes('youtu.be') ? (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-md bg-black">
                      <iframe
                        src={selectedArticleToRead.videoUrl.replace('watch?v=', 'embed/')}
                        title={selectedArticleToRead.title}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <video
                      controls
                      className="w-full rounded-2xl shadow-md bg-black max-h-72 object-contain"
                      src={selectedArticleToRead.videoUrl}
                    />
                  )}
                </div>
              )}

              {/* Additional Photos Gallery if more than 1 photo */}
              {selectedArticleToRead.photos.length > 1 && (
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-[#0f2b4c] uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span>Galerie Photos de l'Amicale</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedArticleToRead.photos.slice(1).map((p, idx) => (
                      <img
                        key={idx}
                        src={p}
                        alt={`Photo additionnelle ${idx + 1}`}
                        className="w-full h-40 object-cover rounded-xl border border-slate-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                {selectedArticleToRead.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedArticleToRead(null)}
                className="px-5 py-2 bg-[#0f2b4c] text-white text-xs font-bold rounded-xl hover:bg-[#163a66] cursor-pointer"
              >
                Fermer la lecture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
