import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/home/HomeView';
import { FilieresView } from './components/filieres/FilieresView';
import { AmicaleActivitiesView } from './components/activities/AmicaleActivitiesView';
import { LoginView } from './components/auth/LoginView';
import { RegisterView } from './components/auth/RegisterView';
import { StudentDashboard } from './components/student/StudentDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DocumentViewerModal } from './components/modals/DocumentViewerModal';
import { Shield, Lock } from 'lucide-react';
import { AmicaleLogo } from './components/BrandLogos';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, currentAdmin, currentStudent, siteImages } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'accueil' && <HomeView />}

        {activeTab === 'filieres' && <FilieresView />}

        {activeTab === 'activites' && <AmicaleActivitiesView />}

        {activeTab === 'connexion' && <LoginView />}

        {activeTab === 'inscription' && <RegisterView />}

        {activeTab === 'etudiant' && (
          currentStudent ? (
            <StudentDashboard />
          ) : (
            <div className="max-w-md mx-auto my-12 text-center bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <AmicaleLogo className="w-16 h-16 mx-auto" />
              <h2 className="text-lg font-bold text-[#0f2b4c]">
                Accès réservé aux étudiants inscrits
              </h2>
              <p className="text-xs text-slate-500">
                Veuillez vous authentifier avec votre numéro INE ou votre adresse email pour accéder à vos cours personnalisés.
              </p>
              <button
                onClick={() => setActiveTab('connexion')}
                className="w-full py-2.5 px-4 bg-[#0f2b4c] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Se connecter
              </button>
            </div>
          )
        )}

        {activeTab === 'admin' && (
          currentAdmin ? (
            <AdminDashboard />
          ) : (
            <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="bg-[#0f2b4c] text-white p-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-300">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-black">Espace d'Administration Restreint</h2>
                <p className="text-xs text-amber-300">
                  UFR SES · Université Iba Der Thiam de Thiès
                </p>
              </div>

              <div className="p-6 text-center space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cette zone est réservée aux administrateurs autorisés pour la gestion des filières, polycopiés de cours, TD/TP, examens et droits d'accès.
                </p>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Cette zone est strictement réservée au personnel enseignant et administrateurs autorisés pour la gestion pédagogique, des ressources d'examens et des filières.
                </p>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 text-left space-y-1">
                  <span className="font-bold text-[#0f2b4c] block">Accès Administrateur Sécurisé (2FA) :</span>
                  <p className="text-[11px] text-slate-600">
                    Saisissez vos identifiants universitaires autorisés puis renseignez le code de sécurité envoyé sur votre boîte Gmail.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('connexion')}
                  className="w-full py-2.5 px-4 bg-[#0f2b4c] hover:bg-[#163a66] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Accéder à la mire de connexion
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Persistent Global Modals */}
      <DocumentViewerModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
