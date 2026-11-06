import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  KeyRound,
  Mail,
  ShieldCheck,
  BookOpen,
  FileCheck,
  FolderGit2,
  Calendar,
  Eye,
  Download,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { AmicaleLogo } from '../BrandLogos';
import { PasswordResetModal } from '../modals/PasswordResetModal';

export const StudentDashboard: React.FC = () => {
  const { currentStudent, resources, setPreviewResource, incrementDownload, filieres, updateStudentEmail } = useApp();
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailFeedback, setEmailFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!currentStudent) return null;

  const studentFiliere = filieres.find(f => f.id === currentStudent.filiereId);

  // Filter resources for this student
  const studentResources = resources.filter(
    r => r.filiereId === currentStudent.filiereId && r.level === currentStudent.level
  );

  const otherFiliereResources = resources.filter(
    r => r.filiereId === currentStudent.filiereId && r.level !== currentStudent.level
  );

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Student Identification Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <AmicaleLogo className="w-18 h-18 shrink-0 drop-shadow-sm" />
            <div className="space-y-1">
              <div className="text-xs text-amber-700 font-bold uppercase tracking-wider">
                Espace Académique Étudiant · UFR SES UIDT
              </div>
              <h1 className="text-2xl font-black text-[#0f2b4c]">
                {currentStudent.fullName}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-mono font-bold text-slate-800">
                  INE : {currentStudent.ine}
                </span>
                <span className="text-slate-300">·</span>
                <span className="font-semibold text-emerald-700">
                  {currentStudent.filiereId} ({studentFiliere?.name})
                </span>
                <span className="text-slate-300">·</span>
                <span className="font-medium text-slate-700">
                  {currentStudent.level}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons to change password and email */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setNewEmail(currentStudent.email);
                setEmailFeedback(null);
                setShowEmailModal(true);
              }}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer border border-slate-300"
            >
              <Mail className="w-4 h-4 text-slate-600" />
              <span>Modifier mon adresse email</span>
            </button>

            <button
              onClick={() => setShowPasswordReset(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Modifier mon mot de passe (Code mail)</span>
            </button>
          </div>
        </div>

        {/* Info banner explaining the verification code system */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl text-xs text-slate-600">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Pour assurer l'intégrité de votre compte universitaire, la modification de vos identifiants requiert la réception préalable d'un <strong>code de sécurité à 6 chiffres</strong> envoyé par l'UFR SES sur votre adresse email <strong className="text-slate-800">{currentStudent.email}</strong>.
          </p>
        </div>
      </div>

      {/* 2. Personalized Courses for Student's Level */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg font-bold text-[#0f2b4c]">
              Documents recommandés pour votre cursus ({currentStudent.level} · {currentStudent.filiereId})
            </h2>
            <p className="text-xs text-slate-500">
              Cours magistraux, fiches de TD/TP et sujets d'examens correspondant à votre promotion
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">
            {studentResources.length} document(s)
          </span>
        </div>

        {studentResources.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500">
            Aucun document n'a encore été rattaché spécifiquement à votre niveau ({currentStudent.level}). Consultez les autres semestres de votre filière ci-dessous.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentResources.map((res) => (
              <div
                key={res.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-[#0f2b4c]/40 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono font-bold text-[#0f2b4c] bg-slate-100 px-2 py-0.5 rounded">
                      {res.codeUE}
                    </span>
                    <span className="uppercase text-[11px] font-bold text-amber-700">
                      {res.type} · {res.format}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                    {res.title}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1">
                    {res.moduleName} · {res.semester} · Par {res.author}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-mono truncate max-w-[200px]" title={res.fileName}>
                      📁 {res.fileName}
                    </span>
                    <span className="font-mono font-semibold text-slate-600 shrink-0">
                      {res.fileSize}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPreviewResource(res)}
                      className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-[#0f2b4c] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-[#0f2b4c]" />
                      <span>Consulter</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
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

      {/* 3. Other modules in the same filière */}
      {otherFiliereResources.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold text-[#0f2b4c] uppercase tracking-wider">
            Autres annales et supports de la filière {currentStudent.filiereId}
          </h3>
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {otherFiliereResources.map((res) => (
              <div
                key={res.id}
                onClick={() => setPreviewResource(res)}
                className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>{res.title}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {res.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {res.level} · {res.moduleName} ({res.codeUE})
                  </div>
                </div>
                <div className="flex items-center gap-2 font-bold text-[#0f2b4c]">
                  <span>Voir</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Password reset modal for student */}
      <PasswordResetModal
        isOpen={showPasswordReset}
        onClose={() => setShowPasswordReset(false)}
        prefillEmail={currentStudent.email}
      />

      {/* Email Update Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0f2b4c] text-white p-6 space-y-1">
              <h3 className="text-lg font-bold">Modifier votre adresse email</h3>
              <p className="text-xs text-amber-300">
                Compte étudiant · {currentStudent.fullName} (INE : {currentStudent.ine})
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmailFeedback(null);
                const res = updateStudentEmail(newEmail);
                if (res.success) {
                  setEmailFeedback({ type: 'success', message: res.message });
                  setTimeout(() => setShowEmailModal(false), 1200);
                } else {
                  setEmailFeedback({ type: 'error', message: res.message });
                }
              }}
              className="p-6 space-y-4"
            >
              {emailFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                    emailFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {emailFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <span>{emailFeedback.message}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nouvelle adresse email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="votre.nom@univ-thies.sn"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:border-[#0f2b4c] outline-none font-medium"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Cette adresse sera utilisée pour vos notifications de cours et la récupération de compte.
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
                  Enregistrer l'email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
