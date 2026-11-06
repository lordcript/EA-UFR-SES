import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FiliereId } from '../../types';
import { AmicaleLogo } from '../BrandLogos';
import {
  Mail,
  Lock,
  User,
  GraduationCap,
  Layers,
  Phone,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const RegisterView: React.FC = () => {
  const { registerStudent, setActiveTab, siteImages, filieres } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [ine, setIne] = useState('');
  const [filiereId, setFiliereId] = useState<FiliereId>('MIO');
  const [level, setLevel] = useState('Licence 1');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password.length < 6) {
      setErrorMsg('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!ine.trim()) {
      setErrorMsg('Veuillez renseigner votre numéro INE universitaire.');
      return;
    }

    const res = registerStudent({
      fullName,
      email,
      ine,
      filiereId,
      level,
      phone,
      password,
    });

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        setActiveTab('etudiant');
      }, 1000);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header featuring the SECOND IMAGE (Amicale Logo) */}
        <div className="bg-[#0f2b4c] text-white p-8 text-center space-y-3 relative">
          <div className="flex justify-center">
            <AmicaleLogo
              customSrc={siteImages.amicaleLogo || undefined}
              className="w-24 h-24 drop-shadow-lg"
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-tight text-white">
              Inscription des Étudiants · UFR SES
            </h2>
            <p className="text-xs text-amber-300 font-medium">
              Université Iba Der Thiam de Thiès · Amicale des Étudiants
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 md:p-8 space-y-5">
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Formalité d'enregistrement officiel :</span>
              <p className="text-slate-600 leading-relaxed">
                Munissez-vous de votre <strong>numéro INE universitaire</strong> figurant sur votre carte d'étudiant ou relevé d'inscription. Vous pourrez par la suite modifier votre mot de passe en toute sécurité via un code de validation envoyé sur votre boîte mail.
              </p>
            </div>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom complet */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Prénom et Nom de l'Étudiant *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ex: Cheikh Tidiane Sène"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f2b4c] focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Email & INE in grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Adresse Email Universitaire *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="etudiant@univ-thies.sn"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f2b4c] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Numéro INE Universitaire *
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={ine}
                    onChange={(e) => setIne(e.target.value)}
                    placeholder="ex: N0148920184"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f2b4c] focus:border-transparent outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Filière & Niveau in grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Filière d'inscription *
                </label>
                <div className="relative">
                  <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    value={filiereId}
                    onChange={(e) => setFiliereId(e.target.value as FiliereId)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#0f2b4c] focus:border-transparent outline-none"
                  >
                    {filieres.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.code} - {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Niveau d'études *
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#0f2b4c] focus:border-transparent outline-none"
                >
                  <option value="Licence 1">Licence 1 (L1)</option>
                  <option value="Licence 2">Licence 2 (L2)</option>
                  <option value="Licence 3">Licence 3 (L3)</option>
                  <option value="Master 1">Master 1 (M1)</option>
                  <option value="Master 2">Master 2 (M2)</option>
                </select>
              </div>
            </div>

            {/* Phone (optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Numéro de Téléphone (Optionnel)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+221 77 000 00 00"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f2b4c] focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mot de passe *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 caractères"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f2b4c] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Confirmer le mot de passe *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Répétez le mot de passe"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0f2b4c] focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#0f2b4c] hover:bg-[#163a66] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <span>Créer mon compte étudiant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer switch to login */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 text-center text-xs text-slate-600">
          Vous disposez déjà d'un compte inscrit ?{' '}
          <button
            onClick={() => setActiveTab('connexion')}
            className="font-bold text-[#0f2b4c] hover:underline cursor-pointer"
          >
            Se connecter à l'espace étudiant
          </button>
        </div>
      </div>
    </div>
  );
};
