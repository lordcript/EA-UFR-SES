import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  X,
  LogOut,
  Shield,
  GraduationCap,
  Mail,
  UserCheck,
} from 'lucide-react';
import { AmicaleLogo } from '../BrandLogos';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentAdmin,
    currentStudent,
    logout,
    siteImages,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* ZONE 1: Brand Zone - Single element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('accueil')}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <AmicaleLogo
                customSrc={siteImages.amicaleLogo || undefined}
                className="w-11 h-11 transition-transform group-hover:scale-105 shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-[#0f2b4c] leading-none">
                  AE UFR SES Biblio
                </span>
                <span className="text-[11px] font-semibold text-amber-700 tracking-wide mt-1">
                  Bibliothèque Numérique · UIDT
                </span>
              </div>
            </button>
          </div>

          {/* ZONE 2: 4-6 Clean Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
            <button
              onClick={() => {
                setActiveTab('accueil');
                setMobileMenuOpen(false);
              }}
              className={`transition-colors pb-0.5 cursor-pointer ${
                activeTab === 'accueil'
                  ? 'text-[#0f2b4c] border-b-2 border-amber-500 font-bold'
                  : 'hover:text-[#0f2b4c]'
              }`}
            >
              Accueil
            </button>

            <button
              onClick={() => {
                setActiveTab('filieres');
                setMobileMenuOpen(false);
              }}
              className={`transition-colors pb-0.5 cursor-pointer ${
                activeTab === 'filieres'
                  ? 'text-[#0f2b4c] border-b-2 border-amber-500 font-bold'
                  : 'hover:text-[#0f2b4c]'
              }`}
            >
              Filières & Cours
            </button>

            <button
              onClick={() => {
                setActiveTab('activites');
                setMobileMenuOpen(false);
              }}
              className={`transition-colors pb-0.5 cursor-pointer ${
                activeTab === 'activites'
                  ? 'text-[#0f2b4c] border-b-2 border-amber-500 font-bold'
                  : 'hover:text-[#0f2b4c]'
              }`}
            >
              Activités de l'Amicale
            </button>

            {currentStudent && (
              <button
                onClick={() => {
                  setActiveTab('etudiant');
                  setMobileMenuOpen(false);
                }}
                className={`transition-colors pb-0.5 cursor-pointer ${
                  activeTab === 'etudiant'
                    ? 'text-[#0f2b4c] border-b-2 border-amber-500 font-bold'
                    : 'hover:text-[#0f2b4c]'
                }`}
              >
                Mon Espace Étudiant
              </button>
            )}

            {/* Onglet Administration visible UNIQUEMENT quand l'administrateur est connecté */}
            {currentAdmin && (
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 transition-colors pb-0.5 cursor-pointer ${
                  activeTab === 'admin'
                    ? 'text-[#0f2b4c] border-b-2 border-amber-500 font-bold'
                    : 'text-amber-800 hover:text-[#0f2b4c]'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-600" />
                <span>Administration</span>
              </button>
            )}
          </nav>

          {/* ZONE 3: 1-2 Primary Actions */}
          <div className="hidden md:flex items-center gap-3">

            {currentAdmin ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[140px]">
                    {currentAdmin.name}
                  </div>
                  <div className="text-[10px] text-amber-700 font-semibold uppercase">
                    Administrateur
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : currentStudent ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('etudiant')}
                  className="flex items-center gap-2 text-left cursor-pointer hover:opacity-85"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0f2b4c] text-white flex items-center justify-center font-bold text-xs">
                    {currentStudent.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                      {currentStudent.fullName}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {currentStudent.ine} · {currentStudent.filiereId}
                    </div>
                  </div>
                </button>
                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Déconnexion"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('connexion')}
                  className="px-4 py-2 text-xs font-bold text-[#0f2b4c] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Connexion
                </button>
                <button
                  onClick={() => setActiveTab('inscription')}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0f2b4c] hover:bg-[#163a66] rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Inscription Étudiant
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <button
            onClick={() => {
              setActiveTab('accueil');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-sm font-semibold text-slate-800"
          >
            Accueil
          </button>
          <button
            onClick={() => {
              setActiveTab('filieres');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-sm font-semibold text-slate-800"
          >
            Filières & Cours (MIO, MTH, SEG, LAC, LEA, MIDIA, MACI)
          </button>
          <button
            onClick={() => {
              setActiveTab('activites');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-sm font-semibold text-slate-800"
          >
            Activités de l'Amicale (Historique & Actualités)
          </button>

          {currentStudent && (
            <button
              onClick={() => {
                setActiveTab('etudiant');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 text-sm font-semibold text-[#0f2b4c] flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Mon Espace Étudiant ({currentStudent.fullName})</span>
            </button>
          )}

          {currentAdmin && (
            <button
              onClick={() => {
                setActiveTab('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 text-sm font-semibold text-amber-800 flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-amber-600" />
              <span>Espace Administration</span>
            </button>
          )}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentAdmin || currentStudent ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-xs font-bold text-red-600 bg-red-50 rounded-lg"
              >
                Se déconnecter
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setActiveTab('connexion');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-[#0f2b4c] border border-slate-200 rounded-lg"
                >
                  Connexion
                </button>
                <button
                  onClick={() => {
                    setActiveTab('inscription');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-white bg-[#0f2b4c] rounded-lg"
                >
                  Inscription Étudiant (INE)
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
