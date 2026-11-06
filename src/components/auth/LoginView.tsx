import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AmicaleLogo } from '../BrandLogos';
import {
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  User,
  KeyRound,
  ShieldCheck,
  Loader2,
  ExternalLink,
  Check,
} from 'lucide-react';
import { PasswordResetModal } from '../modals/PasswordResetModal';

export const LoginView: React.FC = () => {
  const {
    loginStudent,
    sendAdminLoginOtp,
    verifyAdminLoginOtp,
    admins,
    students,
    setActiveTab,
    siteImages,
    setShowEmailModal,
    isGmailActive,
    gmailUserEmail,
    connectGmail,
    disconnectGmailAccount,
    dispatchCodeToRealGmail,
  } = useApp();

  const [step, setStep] = useState<'credentials' | 'admin_2fa'>('credentials');
  const [emailOrIne, setEmailOrIne] = useState('');
  const [password, setPassword] = useState('');
  const [twoFaCode, setTwoFaCode] = useState('');
  const [pendingAdminEmail, setPendingAdminEmail] = useState('');
  const [pendingAdminName, setPendingAdminName] = useState('');
  const [lastGeneratedCode, setLastGeneratedCode] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectingGoogle, setConnectingGoogle] = useState(false);
  const [realEmailSentStatus, setRealEmailSentStatus] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  // Connect Google account to enable real Gmail sending
  const handleConnectGoogle = async () => {
    setErrorMsg('');
    setConnectingGoogle(true);
    try {
      const res = await connectGmail();
      if (res.success) {
        setSuccessMsg(res.message);
        // If we have a pending 2FA code, send it immediately to their real Gmail!
        if (step === 'admin_2fa' && lastGeneratedCode && pendingAdminEmail) {
          const sendRes = await dispatchCodeToRealGmail(
            pendingAdminEmail,
            pendingAdminName,
            lastGeneratedCode,
            '2fa_login'
          );
          if (sendRes.success) {
            setRealEmailSentStatus(
              `Code 2FA envoyé avec succès à votre boîte Gmail réelle : ${pendingAdminEmail}`
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

  // Step 1: Handle initial submission of credentials
  const handleSubmitCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setRealEmailSentStatus(null);

    const trimmedInput = emailOrIne.trim().toLowerCase();

    // Check if the user is an administrator
    const matchingAdmin = admins.find(a => a.email.toLowerCase() === trimmedInput);

    if (matchingAdmin) {
      setLoading(true);
      setTimeout(async () => {
        const res = sendAdminLoginOtp(emailOrIne, password);
        setLoading(false);

        if (res.success) {
          setPendingAdminEmail(matchingAdmin.email);
          setPendingAdminName(matchingAdmin.name);
          setLastGeneratedCode(res.code || '');
          setSuccessMsg(res.message);
          setStep('admin_2fa');

          // If Gmail is already connected, send the real email!
          if (isGmailActive && res.code) {
            const sendRes = await dispatchCodeToRealGmail(
              matchingAdmin.email,
              matchingAdmin.name,
              res.code,
              '2fa_login'
            );
            if (sendRes.success) {
              setRealEmailSentStatus(
                `Code 2FA envoyé à votre boîte Gmail officielle (${matchingAdmin.email}) !`
              );
            }
          }
        } else {
          setErrorMsg(res.message);
        }
      }, 400);
      return;
    }

    // Otherwise, authenticate as student (by email or INE)
    const matchingStudent = students.find(
      s => s.email.toLowerCase() === trimmedInput || s.ine.toLowerCase() === trimmedInput
    );

    if (matchingStudent) {
      setLoading(true);
      setTimeout(() => {
        const res = loginStudent(emailOrIne, password);
        setLoading(false);

        if (res.success) {
          setSuccessMsg(res.message);
          setTimeout(() => setActiveTab('etudiant'), 500);
        } else {
          setErrorMsg(res.message);
        }
      }, 400);
      return;
    }

    // If neither exists
    setErrorMsg('Aucun compte trouvé avec cet identifiant (email ou numéro INE). Vérifiez vos informations de connexion.');
  };

  // Step 2: Handle 2FA verification code submission for administrator
  const handleSubmit2FA = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!twoFaCode.trim() || twoFaCode.length < 6) {
      setErrorMsg('Veuillez saisir le code de validation à 6 chiffres.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = verifyAdminLoginOtp(pendingAdminEmail, twoFaCode);
      setLoading(false);

      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => setActiveTab('admin'), 600);
      } else {
        setErrorMsg(res.message);
      }
    }, 450);
  };

  const handleResendAdminOtp = async () => {
    setErrorMsg('');
    const res = sendAdminLoginOtp(pendingAdminEmail, password);
    if (res.success) {
      setLastGeneratedCode(res.code || '');
      setSuccessMsg('Nouveau code de sécurité généré.');

      if (isGmailActive && res.code) {
        const sendRes = await dispatchCodeToRealGmail(
          pendingAdminEmail,
          pendingAdminName,
          res.code,
          '2fa_login'
        );
        if (sendRes.success) {
          setRealEmailSentStatus(`Nouveau code 2FA envoyé à votre adresse Gmail ${pendingAdminEmail} !`);
        }
      }
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleBackToCredentials = () => {
    setStep('credentials');
    setTwoFaCode('');
    setErrorMsg('');
    setSuccessMsg('');
    setRealEmailSentStatus(null);
  };

  return (
    <div className="max-w-md mx-auto my-8 space-y-4">
      {/* Real Gmail Connection Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isGmailActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="font-bold text-slate-800">
              {isGmailActive
                ? `Envoi réel Gmail activé (${gmailUserEmail})`
                : 'Envoi d\'emails réels vers Gmail'}
            </span>
          </div>
          {isGmailActive && (
            <button
              type="button"
              onClick={disconnectGmailAccount}
              className="text-[11px] text-slate-400 hover:text-slate-600 underline cursor-pointer"
            >
              Déconnecter
            </button>
          )}
        </div>

        {!isGmailActive ? (
          <div className="space-y-2 pt-1">
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Pour que les codes de sécurité à 6 chiffres soient envoyés <strong>directement et exclusivement sur votre boîte Gmail réelle</strong>, authentifiez votre compte Google :
            </p>
            <button
              type="button"
              onClick={handleConnectGoogle}
              disabled={connectingGoogle}
              className="w-full py-2 px-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>
                {connectingGoogle
                  ? 'Connexion à Google en cours...'
                  : 'Connecter avec Google pour recevoir les emails réels'}
              </span>
            </button>
          </div>
        ) : (
          <div className="bg-emerald-50 text-emerald-800 text-[11px] p-2 rounded-lg flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Tous les codes 2FA sont expédiés via l'API Gmail officielle vers votre boîte réelle.</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header with Amicale Logo */}
        <div className="bg-[#0f2b4c] text-white p-8 text-center space-y-3 relative">
          <div className="flex justify-center">
            <AmicaleLogo
              customSrc={siteImages.amicaleLogo || undefined}
              className="w-24 h-24 drop-shadow-lg"
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-tight text-white">
              {step === 'credentials' ? 'Portail de Connexion Unifié' : 'Validation de Sécurité Administrateur'}
            </h2>
            <p className="text-xs text-amber-300 font-medium">
              AE UFR SES Biblio · Université Iba Der Thiam de Thiès
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 md:p-8 space-y-5">
          {step === 'credentials' ? (
            <p className="text-xs text-slate-600 text-center leading-relaxed">
              Saisissez vos identifiants pour vous connecter. Le système identifie automatiquement votre profil étudiant ou administrateur.
            </p>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2.5 text-xs text-blue-950">
              <div className="flex items-center gap-2 font-bold text-[#0f2b4c]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Double Authentification Requise (2FA)</span>
              </div>
              <p className="leading-relaxed text-slate-700">
                Bonjour <strong>{pendingAdminName}</strong>. Un <strong>code de validation à 6 chiffres</strong> a été expédié directement vers votre messagerie Gmail.
              </p>
              {!isGmailActive && (
                <div className="bg-amber-100/80 border border-amber-300 p-2.5 rounded-xl text-amber-950 font-medium space-y-1.5">
                  <span className="font-bold block text-amber-900">
                    Vérification Gmail obligatoire :
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    Pour garantir qu'aucun code n'est divulgué sur le site, veuillez connecter votre compte Google. Le code 2FA sera alors immédiatement envoyé dans votre boîte de réception Gmail.
                  </p>
                  <button
                    type="button"
                    onClick={handleConnectGoogle}
                    disabled={connectingGoogle}
                    className="w-full mt-1 py-2 px-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{connectingGoogle ? 'Authentification Google...' : 'Autoriser Gmail pour recevoir le code'}</span>
                  </button>
                </div>
              )}
              {realEmailSentStatus && (
                <div className="bg-emerald-100/70 border border-emerald-300 p-2 rounded-lg text-emerald-900 font-medium flex items-start gap-1.5 mt-2">
                  <Check className="w-3.5 h-3.5 text-emerald-700 mt-0.5 shrink-0" />
                  <span>{realEmailSentStatus}</span>
                </div>
              )}
            </div>
          )}

          {/* Error & Success alerts */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* STEP 1: Unified Credentials Form */}
          {step === 'credentials' && (
            <form onSubmit={handleSubmitCredentials} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Identifiant de connexion
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={emailOrIne}
                    onChange={(e) => setEmailOrIne(e.target.value)}
                    placeholder="Adresse Email ou Numéro INE"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f2b4c] focus:border-transparent outline-none font-medium"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Étudiants : Numéro INE ou email · Admins : Adresse email
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowResetModal(true)}
                    className="text-[11px] text-amber-700 hover:text-amber-800 font-semibold cursor-pointer inline-flex items-center gap-1"
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>Mot de passe oublié ?</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f2b4c] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#0f2b4c] hover:bg-[#163a66] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Se connecter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Administrator 2FA Validation Code Form */}
          {step === 'admin_2fa' && (
            <form onSubmit={handleSubmit2FA} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                  Saisissez le code de validation reçu sur Gmail (6 chiffres)
                </label>
                <div className="relative max-w-xs mx-auto">
                  <KeyRound className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    placeholder="123456"
                    value={twoFaCode}
                    onChange={(e) => setTwoFaCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-300 focus:border-[#0f2b4c] rounded-xl text-center text-2xl font-mono font-bold tracking-widest outline-none transition-all"
                  />
                </div>
              </div>

              {/* Direct Gmail Open Link or Connect Button */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-center">
                {isGmailActive ? (
                  <a
                    href="https://mail.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f2b4c] hover:underline cursor-pointer"
                  >
                    <span>Ouvrir Gmail pour voir le message reçu</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={handleConnectGoogle}
                    disabled={connectingGoogle}
                    className="text-xs text-amber-700 hover:text-amber-800 font-bold underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Connecter Gmail pour recevoir le code en direct</span>
                  </button>
                )}
                <div>
                  <button
                    type="button"
                    onClick={handleResendAdminOtp}
                    className="text-[11px] text-slate-500 hover:text-slate-700 underline cursor-pointer"
                  >
                    Renvoyer un nouveau code par email
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleBackToCredentials}
                  className="px-3 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-[#0f2b4c] hover:bg-[#163a66] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Valider et accéder à la console</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer switch to registration */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 text-center text-xs text-slate-600">
          Nouvel étudiant non encore inscrit ?{' '}
          <button
            onClick={() => setActiveTab('inscription')}
            className="font-bold text-[#0f2b4c] hover:underline cursor-pointer"
          >
            Créer un compte avec votre INE
          </button>
        </div>
      </div>

      {/* Password Reset Modal */}
      <PasswordResetModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        prefillEmail={emailOrIne}
      />
    </div>
  );
};
