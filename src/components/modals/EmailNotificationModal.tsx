import React from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Check, X, ShieldAlert, ArrowRight, Copy, ExternalLink } from 'lucide-react';
import { AmicaleLogo } from '../BrandLogos';

export const EmailNotificationModal: React.FC = () => {
  // Disabled as per security requirement: validation codes must never appear on platform
  return null;
};

  const handleCopyCode = () => {
    navigator.clipboard.writeText(latestEmail.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Email Header Bar */}
        <div className="bg-[#0f2b4c] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Mail className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
                Messagerie Universitaire UIDT
              </div>
              <div className="text-sm font-bold text-white">Nouveau courriel reçu</div>
            </div>
          </div>
          <button
            onClick={() => setShowEmailModal(false)}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Content Body */}
        <div className="p-6 space-y-5">
          {/* Metadata */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">De :</span>
              <span className="font-semibold text-slate-800">{latestEmail.from}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Destinataire :</span>
              <span className="font-semibold text-[#0f2b4c]">{latestEmail.to}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Objet :</span>
              <span className="font-medium text-slate-700">{latestEmail.subject}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Heure d'expédition :</span>
              <span className="text-slate-600">{latestEmail.date} (Aujourd'hui)</span>
            </div>
          </div>

          {/* Letterhead */}
          <div className="flex items-center gap-4 py-2 border-b border-slate-100">
            <AmicaleLogo className="w-14 h-14 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-[#0f2b4c]">
                UFR Sciences Économiques et Sociales
              </h4>
              <p className="text-xs text-slate-500">
                Service Scolarité & Authentification des Étudiants · UIDT Thiès
              </p>
            </div>
          </div>

          {/* Message Greeting & Code Box */}
          <div className="space-y-3">
            <p className="text-sm text-slate-700">
              Bonjour <strong className="text-slate-900">{latestEmail.studentName || 'Étudiant(e)'}</strong>,
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Une demande de réinitialisation ou de modification de votre mot de passe a été initiée sur le portail <strong className="text-slate-800">AE UFR SES Biblio</strong>. Voici votre code d'authentification temporaire :
            </p>

            {/* OTP Code Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300/80 rounded-xl p-5 text-center shadow-xs">
              <span className="text-xs uppercase tracking-widest text-amber-800 font-bold block mb-1">
                Code de sécurité (Valable 15 min)
              </span>
              <div className="text-3xl font-mono font-extrabold text-[#0f2b4c] tracking-widest my-2 select-all">
                {latestEmail.code}
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Code copié dans le presse-papier !' : 'Copier le code'}
              </button>
            </div>

            <div className="flex items-start gap-2 bg-slate-100/80 rounded-lg p-3 text-[11px] text-slate-600">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Ne communiquez jamais ce code. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer ce message en toute sécurité.
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#0f2b4c] hover:underline font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Ouvrir Gmail (mail.google.com)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => setShowEmailModal(false)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0f2b4c] hover:bg-[#163a66] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <span>Continuer la saisie</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
