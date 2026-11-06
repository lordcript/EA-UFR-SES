import React from 'react';
import { useApp } from '../../context/AppContext';
import { FiliereId } from '../../types';
import { AmicaleLogo } from '../BrandLogos';
import { Shield, BookOpen, GraduationCap, MapPin, Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setSelectedFiliereId, setActiveTab, siteImages } = useApp();

  const filieresList: { id: FiliereId; name: string }[] = [
    { id: 'MIO', name: 'Management Informatisé des Organisations' },
    { id: 'MTH', name: 'Management du Tourisme et de l\'Hôtellerie' },
    { id: 'SEG', name: 'Sciences Économiques et de Gestion' },
    { id: 'LAC', name: 'Langues, Arts et Civilisations' },
    { id: 'LEA', name: 'Langues Étrangères Appliquées' },
  ];

  return (
    <footer className="bg-[#0a1d33] text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Logo */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <AmicaleLogo
                customSrc={siteImages.amicaleLogo || undefined}
                className="w-12 h-12 bg-white rounded-full p-0.5"
              />
              <div>
                <span className="text-base font-extrabold text-white block leading-tight">
                  AE UFR SES Biblio
                </span>
                <span className="text-xs text-amber-400 font-semibold">
                  Bibliothèque Numérique · Thiès
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bibliothèque numérique officielle de l'Amicale des Étudiants de l'UFR Sciences Économiques et Sociales de l'Université Iba Der Thiam de Thiès (UIDT).
            </p>
          </div>

          {/* Col 2: Filières direct links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Filières de Formation
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {filieresList.map((f) => (
                <li key={f.id}>
                  <button
                    onClick={() => {
                      setSelectedFiliereId(f.id);
                      setActiveTab('filieres');
                    }}
                    className="hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="font-bold text-amber-300">[{f.id}]</span>
                    <span className="truncate max-w-[200px]">{f.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Espaces & Accès */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Portails & Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => setActiveTab('accueil')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Accueil & Calendrier
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('filieres')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Catalogue Cours, TD & Examens
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('inscription')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Inscription Étudiant (Numéro INE)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('connexion')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Espace de Connexion
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('admin')}
                  className="hover:text-white transition-colors cursor-pointer text-amber-300 font-semibold flex items-center gap-1"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Accès Administrateur</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: University Info */}
          <div className="space-y-3 text-xs text-slate-300">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Université Iba Der Thiam
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Campus Cité Malick Sy, Route de Dakar, Thiès, Sénégal</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>scolarite.ufrses@univ-thies.sn</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+221 33 951 12 34</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <div>
            © 2026 Université Iba Der Thiam de Thiès · Amicale des Étudiants UFR SES. Tous droits réservés.
          </div>
          <div className="text-slate-500">
            AE UFR SES Biblio · Bibliothèque Numérique
          </div>
        </div>
      </div>
    </footer>
  );
};
