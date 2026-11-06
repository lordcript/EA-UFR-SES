import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  KeyRound,
  Mail,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Check,
} from 'lucide-react';
import { AmicaleLogo } from '../BrandLogos';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillEmail?: string;
}

export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  isOpen,
  onClose,
  prefillEmail = '',
}) => {
  const {
    requestPasswordResetCode,
    verifyResetCode,
    completePasswordReset,
    setShowEmailModal,
    isGmailActive,
    gmailUserEmail,
    connectGmail,
    dispatchCodeToRealGmail,
    admins,
    students,
  } = useApp();

  const [step, setStep] = useState<'request' | 'verify' | 'newpass' | 'success'>('request');
  const [emailOrIne, setEmailOrIne] = useState(prefillEmail);
  const [code, setCode] = useState('');
  const [lastGeneratedCode, setLastGeneratedCode] = useState('');
  const [resolvedTargetEmail, setResolvedTargetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [realEmailSentStatus, setRealEmailSentStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [connectingGoogle, setConnectingGoogle] = useState(false);

  if (!isOpen) return null;

  // Handle Google OAuth connection
  const handleConnectGoogle = async () => {
    setErrorMsg('');
    setConnectingGoogle(true);
    try {
      const res = await connectGmail();
      if (res.success) {
        setSuccessMsg(res.message);
        // If code was already generated and we have target email, send real email right away!
        if (lastGeneratedCode && resolvedTargetEmail) {
          const sendRes = await dispatchCodeToRealGmail(
            resolvedTargetEmail,
            resolvedTargetEmail,
            lastGeneratedCode,
            'password_reset'
          );
          if (sendRes.success) {
            setRealEmailSentStatus(
              `Code de réinitialisation envoyé avec succès à votre Gmail réel : ${resolvedTargetEmail}`
            );
          }
        }
      } else {
        setErrorMsg(res.message);
      }
    } finally {
      setConnectingGoogle(false);
    }
  };

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setRealEmailSentStatus(null);
    if (!emailOrIne.trim()) {
      setErrorMsg('Veuillez saisir votre adresse email ou votre numéro INE.');
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      const res = requestPasswordResetCode(emailOrIne);
      setLoading(false);
      if (res.success) {
        setLastGeneratedCode(res.code || '');
        setSuccessMsg(res.message);

        // Resolve email address for display and dispatch
        const trimmed = emailOrIne.trim().toLowerCase();
        const foundStudent = students.find(s => s.email.toLowerCase() === trimmed || s.ine.toLowerCase() === trimmed);
        const foundAdmin = admins.find(a => a.email.toLowerCase() === trimmed);
        const targetEmail = foundStudent ? foundStudent.email : foundAdmin ? foundAdmin.email : emailOrIne;
        const targetName = foundStudent ? foundStudent.fullName : foundAdmin ? foundAdmin.name : 'Utilisateur';
        setResolvedTargetEmail(targetEmail);

        if (isGmailActive && res.code) {
          const sendRes = await dispatchCodeToRealGmail(
            targetEmail,
            targetName,
            res.code,
            'password_reset'
          );
          if (sendRes.success) {
            setRealEmailSentStatus(`Code envoyé à votre boîte Gmail officielle (${targetEmail}) !`);
          }
        }

        setStep('verify');
      } else {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!code.trim() || code.length < 6) {
      setErrorMsg('Veuillez saisir le code à 6 chiffres reçu par mail.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = verifyResetCode(emailOrIne, code);
      setLoading(false);
      if (res.success) {
        setErrorMsg('');
        setSuccessMsg(res.message);
        setStep('newpass');
      } else {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  const handleSetNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('Le nouveau mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = completePasswordReset(emailOrIne, newPassword);
      setLoading(false);
      if (res.success) {
        setStep('success');
      } else {
        setErrorMsg(res.message);
      }
    }, 500);
  };

  const handleResetModal = () => {
    setStep('request');
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMsg('');
    setSuccessMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0f2b4c] text-white p-6 text-center relative">
          <div className="flex justify-center mb-2">
            <AmicaleLogo className="w-16 h-16 drop-shadow-md" />
          </div>
          <h3 className="text-lg font-bold">Réinitialisation du Mot de Passe</h3>
          <p className="text-xs text-amber-300 font-medium mt-1">
            Sécurité académique · UFR SES Université Iba Der Thiam
          </p>

          <button
            onClick={handleResetModal}
            className="absolute top-4 right-4 text-slate-300 hover:text-white text-xs font-semibold p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>

        {/* Step Progress indicators */}
        <div className="bg-slate-100 px-6 py-2.5 flex items-center justify-between text-xs text-slate-600 border-b border-slate-200">
          <span className={`font-semibold ${step === 'request' ? 'text-[#0f2b4c]' : 'text-slate-400'}`}>
            1. Email / INE
          </span>
          <span className="text-slate-300">→</span>
          <span className={`font-semibold ${step === 'verify' ? 'text-[#0f2b4c]' : 'text-slate-400'}`}>
            2. Code de sécurité
          </span>
          <span className="text-slate-300">→</span>
          <span className={`font-semibold ${step === 'newpass' ? 'text-[#0f2b4c]' : 'text-slate-400'}`}>
            3. Nouveau code
          </span>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {/* Gmail Real Delivery Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isGmailActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span className="font-bold text-slate-800">
                  {isGmailActive
                    ? `Envoi réel Gmail activé (${gmailUserEmail})`
                    : 'Réception des codes sur votre Gmail réel'}
                </span>
              </div>
            </div>

            {!isGmailActive ? (
              <div className="space-y-1.5">
                <p className="text-[11px] text-slate-600">
                  Connectez votre compte Google pour recevoir instantanément ce code dans votre boîte Gmail.
                </p>
                <button
                  type="button"
                  onClick={handleConnectGoogle}
                  disabled={connectingGoogle}
                  className="w-full py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>
                    {connectingGoogle ? 'Connexion à Google...' : 'Activer l\'envoi direct vers Gmail'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Expédition automatique configurée vers votre compte Gmail officiel.</span>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && step !== 'success' && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* STEP 1: Request code with Email or INE */}
          {step === 'request' && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Renseignez votre <strong>adresse email</strong> (étudiant ou administrateur) ou votre <strong>numéro INE universitaire</strong>. Un code d'authentification à 6 chiffres vous sera envoyé par mail pour valider votre identité avant d'accéder au formulaire de modification.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email ou Numéro INE
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="ex: votre.adresse@univ-thies.sn ou Numéro INE"
                    value={emailOrIne}
                    onChange={(e) => setEmailOrIne(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f2b4c] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-[#0f2b4c] hover:bg-[#163a66] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Recevoir le code de validation par mail</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Enter 6-digit Code */}
          {step === 'verify' && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-bold block">Étape obligatoire de sécurité :</span>
                <p>
                  Saisissez le <strong>code de validation à 6 chiffres</strong> reçu par email pour débloquer l'accès au formulaire de modification du mot de passe.
                </p>
                {realEmailSentStatus && (
                  <div className="mt-2 bg-emerald-100/80 border border-emerald-300 p-2 rounded-lg text-emerald-900 font-semibold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{realEmailSentStatus}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-center">
                  Code de vérification (6 chiffres)
                </label>
                <div className="relative max-w-xs mx-auto">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-300 focus:border-[#0f2b4c] rounded-xl text-center text-xl font-mono font-bold tracking-widest outline-none transition-all"
                  />
                </div>
              </div>

              {/* Direct Gmail links & simulation fallback */}
              <div className="space-y-2 text-center pt-1">
                {isGmailActive ? (
                  <div>
                    <a
                      href="https://mail.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f2b4c] hover:underline cursor-pointer"
                    >
                      <span>Ouvrir Gmail pour consulter le message reçu</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={handleConnectGoogle}
                      disabled={connectingGoogle}
                      className="text-xs text-amber-700 hover:text-amber-800 font-bold underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Envoyer également sur ma boîte Gmail réelle maintenant</span>
                    </button>
                  </div>
                )}

              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('request')}
                  className="px-3 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 bg-[#0f2b4c] hover:bg-[#163a66] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Valider le code et continuer</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Enter New Password */}
          {step === 'newpass' && (
            <form onSubmit={handleSetNewPassword} className="space-y-4">
              <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Code vérifié avec succès. Vous pouvez maintenant définir votre nouveau mot de passe.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 caractères"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f2b4c] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  required
                  placeholder="Répétez le mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f2b4c] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Enregistrer le nouveau mot de passe</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success Message */}
          {step === 'success' && (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Mot de passe mis à jour !
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Votre mot de passe a été actualisé avec succès. Vous pouvez désormais vous connecter à la bibliothèque numérique <strong>AE UFR SES Biblio</strong>.
              </p>
              <button
                type="button"
                onClick={handleResetModal}
                className="w-full py-2.5 px-4 bg-[#0f2b4c] hover:bg-[#163a66] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Retour à l'espace de connexion
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
