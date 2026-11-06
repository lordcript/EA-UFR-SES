import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AcademicResource,
  AdminUser,
  AmicaleNewsArticle,
  EmailVerificationToken,
  Filiere,
  FiliereId,
  HistoricalFigure,
  SiteImages,
  StudentUser,
} from '../types';
import {
  INITIAL_ADMINS,
  INITIAL_AMICALE_NEWS,
  INITIAL_FILIERES,
  INITIAL_HISTORICAL_FIGURES,
  INITIAL_RESOURCES,
  INITIAL_SITE_IMAGES,
  INITIAL_STUDENTS,
} from '../data/initialData';

import {
  connectGmailAccount,
  disconnectGmail,
  getGmailAccessToken,
  getGmailUser,
  initGmailAuth,
  isGmailConnected,
  sendGmailSecurityCode,
} from '../services/gmailService';

interface SimulatedEmailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  code: string;
  date: string;
  recipientName?: string;
  studentName?: string;
}

interface AppContextType {
  // Google Workspace Gmail API Integration
  isGmailActive: boolean;
  gmailUserEmail: string | null;
  connectGmail: () => Promise<{ success: boolean; message: string }>;
  disconnectGmailAccount: () => Promise<void>;
  dispatchCodeToRealGmail: (
    toEmail: string,
    recipientName: string,
    code: string,
    purpose: '2fa_login' | 'password_reset'
  ) => Promise<{ success: boolean; message: string }>;
  // Navigation
  activeTab: 'accueil' | 'filieres' | 'activites' | 'connexion' | 'inscription' | 'admin' | 'etudiant';
  setActiveTab: (tab: 'accueil' | 'filieres' | 'activites' | 'connexion' | 'inscription' | 'admin' | 'etudiant') => void;
  selectedFiliereId: FiliereId;
  setSelectedFiliereId: (id: FiliereId) => void;
  activitesSubTab: 'historique' | 'actualites';
  setActivitesSubTab: (sub: 'historique' | 'actualites') => void;

  // Data
  filieres: Filiere[];
  resources: AcademicResource[];
  admins: AdminUser[];
  students: StudentUser[];
  siteImages: SiteImages;
  historicalFigures: HistoricalFigure[];
  amicaleNews: AmicaleNewsArticle[];

  // Auth State
  currentAdmin: AdminUser | null;
  currentStudent: StudentUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStudent: boolean;

  // Auth Actions
  loginAdmin: (email: string, pass: string) => { success: boolean; message: string };
  sendAdminLoginOtp: (email: string, pass: string) => {
    success: boolean;
    message: string;
    adminName?: string;
    code?: string;
  };
  verifyAdminLoginOtp: (email: string, code: string) => { success: boolean; message: string };
  loginStudent: (emailOrIne: string, pass: string) => { success: boolean; message: string };
  updateStudentEmail: (newEmail: string) => { success: boolean; message: string };
  updateAdminEmail: (newEmail: string) => { success: boolean; message: string };
  registerStudent: (data: Omit<StudentUser, 'id' | 'registeredAt' | 'status'>) => {
    success: boolean;
    message: string;
    student?: StudentUser;
  };
  logout: () => void;

  // Password reset flow (Code OTP par Email pour étudiants & admins)
  requestPasswordResetCode: (emailOrIne: string) => { success: boolean; message: string; code?: string };
  verifyResetCode: (emailOrIne: string, code: string) => { success: boolean; message: string };
  completePasswordReset: (emailOrIne: string, newPass: string) => { success: boolean; message: string };
  simulatedInbox: SimulatedEmailMessage[];
  clearSimulatedInbox: () => void;
  showEmailModal: boolean;
  setShowEmailModal: (show: boolean) => void;
  latestEmail: SimulatedEmailMessage | null;

  // Resources Actions (Admin)
  addResource: (resource: Omit<AcademicResource, 'id' | 'createdAt' | 'downloadsCount'>) => void;
  updateResource: (id: string, updated: Partial<AcademicResource>) => void;
  deleteResource: (id: string) => void;
  incrementDownload: (id: string) => void;

  // Historical Figures Actions (Admin)
  addHistoricalFigure: (data: Omit<HistoricalFigure, 'id' | 'createdAt'>) => { success: boolean; message: string };
  updateHistoricalFigure: (id: string, updated: Partial<HistoricalFigure>) => void;
  deleteHistoricalFigure: (id: string) => { success: boolean; message: string };

  // Amicale News Actions (Admin & Secondary Admin)
  addAmicaleNews: (data: Omit<AmicaleNewsArticle, 'id' | 'createdAt'>) => { success: boolean; message: string };
  updateAmicaleNews: (id: string, updated: Partial<AmicaleNewsArticle>) => void;
  deleteAmicaleNews: (id: string) => { success: boolean; message: string };

  // Admin User Actions (Admin)
  addAdmin: (data: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => { success: boolean; message: string };
  updateAdmin: (id: string, updated: Partial<AdminUser>) => void;
  toggleBlockAdmin: (id: string) => { success: boolean; message: string };
  deleteAdmin: (id: string) => { success: boolean; message: string };

  // Student Actions (Admin & Self)
  updateStudent: (id: string, updated: Partial<StudentUser>) => void;
  toggleBlockStudent: (id: string) => void;

  // Site Images Actions
  updateSiteImages: (images: Partial<SiteImages>) => void;
  updateFiliereImage: (filiereId: FiliereId, imageUrl: string) => void;
  resetImagesToDefault: () => void;

  // Document Viewer Modal
  previewResource: AcademicResource | null;
  setPreviewResource: (res: AcademicResource | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'uidt_programme_ufr_ses_storage_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'accueil' | 'filieres' | 'activites' | 'connexion' | 'inscription' | 'admin' | 'etudiant'>('accueil');
  const [activitesSubTab, setActivitesSubTab] = useState<'historique' | 'actualites'>('actualites');
  const [selectedFiliereId, setSelectedFiliereId] = useState<FiliereId>('MIO');

  // Load state from localStorage or use initial seeds
  const [filieres] = useState<Filiere[]>(INITIAL_FILIERES);


  const [resources, setResources] = useState<AcademicResource[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_resources`);
      if (saved) {
        const parsed: AcademicResource[] = JSON.parse(saved);
        // Ensure seeded resources reflect updated MIO, LAC, MIDIA, and MACI definitions
        const updated = parsed.map(r => {
          const matchingSeed = INITIAL_RESOURCES.find(s => s.id === r.id);
          if (matchingSeed && (r.filiereId === 'LAC' || r.filiereId === 'MIO' || r.filiereId === 'MIDIA' || r.filiereId === 'MACI')) {
            return matchingSeed;
          }
          return r;
        });
        // Make sure newly added MIDIA and MACI seeds are present
        INITIAL_RESOURCES.forEach(seed => {
          if ((seed.filiereId === 'MIDIA' || seed.filiereId === 'MACI') && !updated.some(u => u.id === seed.id)) {
            updated.push(seed);
          }
        });
        return updated;
      }
      return INITIAL_RESOURCES;
    } catch {
      return INITIAL_RESOURCES;
    }
  });

  const [admins, setAdmins] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_admins`);
      if (saved) {
        const parsed: AdminUser[] = JSON.parse(saved);
        // Ensure default super admins always exist
        if (!parsed.some(a => a.email.toLowerCase() === 'idrissa.hyjazi@univ-thies.sn')) {
          parsed.unshift(INITIAL_ADMINS[0]);
        }
        if (!parsed.some(a => a.email.toLowerCase() === 'adminhyjazi@gmail.com')) {
          parsed.splice(1, 0, INITIAL_ADMINS[1]);
        }
        return parsed;
      }
      return INITIAL_ADMINS;
    } catch {
      return INITIAL_ADMINS;
    }
  });

  const [students, setStudents] = useState<StudentUser[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [siteImages, setSiteImages] = useState<SiteImages>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_site_images`);
      if (saved) {
        const parsed: SiteImages = JSON.parse(saved);
        // Ensure all default filiere images use bundled assets unless customized by admin
        const updatedFilieres = { ...INITIAL_SITE_IMAGES.filieres, ...(parsed.filieres || {}) };
        (['MIO', 'MTH', 'SEG', 'LAC', 'LEA', 'MIDIA', 'MACI'] as FiliereId[]).forEach(id => {
          if (!updatedFilieres[id] || updatedFilieres[id].startsWith('/src/assets/images/')) {
            updatedFilieres[id] = INITIAL_SITE_IMAGES.filieres[id];
          }
        });
        parsed.filieres = updatedFilieres;
        return parsed;
      }
      return INITIAL_SITE_IMAGES;
    } catch {
      return INITIAL_SITE_IMAGES;
    }
  });

  // Historical figures & Amicale News with LocalStorage persistence
  const [historicalFigures, setHistoricalFigures] = useState<HistoricalFigure[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_historical_figures`);
      return saved ? JSON.parse(saved) : INITIAL_HISTORICAL_FIGURES;
    } catch {
      return INITIAL_HISTORICAL_FIGURES;
    }
  });

  const [amicaleNews, setAmicaleNews] = useState<AmicaleNewsArticle[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_amicale_news`);
      return saved ? JSON.parse(saved) : INITIAL_AMICALE_NEWS;
    } catch {
      return INITIAL_AMICALE_NEWS;
    }
  });

  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_current_admin`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentStudent, setCurrentStudent] = useState<StudentUser | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_current_student`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Password reset tokens & simulated inbox
  const [tokens, setTokens] = useState<EmailVerificationToken[]>([]);
  const [simulatedInbox, setSimulatedInbox] = useState<SimulatedEmailMessage[]>([]);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [latestEmail, setLatestEmail] = useState<SimulatedEmailMessage | null>(null);

  // Document preview modal
  const [previewResource, setPreviewResource] = useState<AcademicResource | null>(null);

  // Google Workspace Gmail API state
  const [isGmailActive, setIsGmailActive] = useState<boolean>(isGmailConnected());
  const [gmailUserEmail, setGmailUserEmail] = useState<string | null>(getGmailUser()?.email || null);

  useEffect(() => {
    const unsubscribe = initGmailAuth(
      (user, token) => {
        setIsGmailActive(true);
        setGmailUserEmail(user.email || null);
      },
      () => {
        setIsGmailActive(false);
        setGmailUserEmail(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const connectGmail = async () => {
    try {
      const res = await connectGmailAccount();
      if (res) {
        setIsGmailActive(true);
        setGmailUserEmail(res.user.email || null);
        return {
          success: true,
          message: `Compte Google connecté (${res.user.email}) ! Les codes de sécurité sont désormais envoyés directement dans votre boîte Gmail.`,
        };
      }
      return { success: false, message: 'Connexion Google annulée.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Erreur lors de la connexion avec Google.' };
    }
  };

  const disconnectGmailAccount = async () => {
    await disconnectGmail();
    setIsGmailActive(false);
    setGmailUserEmail(null);
  };

  const dispatchCodeToRealGmail = async (
    toEmail: string,
    recipientName: string,
    code: string,
    purpose: '2fa_login' | 'password_reset'
  ) => {
    return await sendGmailSecurityCode({
      toEmail,
      recipientName,
      code,
      purpose,
    });
  };

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_resources`, JSON.stringify(resources));
    } catch (e) {
      console.error(e);
    }
  }, [resources]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_historical_figures`, JSON.stringify(historicalFigures));
    } catch (e) {
      console.error(e);
    }
  }, [historicalFigures]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_amicale_news`, JSON.stringify(amicaleNews));
    } catch (e) {
      console.error(e);
    }
  }, [amicaleNews]);


  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_admins`, JSON.stringify(admins));
    } catch (e) {
      console.error(e);
    }
  }, [admins]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
    } catch (e) {
      console.error(e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_site_images`, JSON.stringify(siteImages));
    } catch (e) {
      console.error(e);
    }
  }, [siteImages]);

  useEffect(() => {
    try {
      if (currentAdmin) {
        localStorage.setItem(`${STORAGE_KEY}_current_admin`, JSON.stringify(currentAdmin));
      } else {
        localStorage.removeItem(`${STORAGE_KEY}_current_admin`);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentAdmin]);

  useEffect(() => {
    try {
      if (currentStudent) {
        localStorage.setItem(`${STORAGE_KEY}_current_student`, JSON.stringify(currentStudent));
      } else {
        localStorage.removeItem(`${STORAGE_KEY}_current_student`);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentStudent]);

  // Auth Functions
  const loginAdmin = (email: string, pass: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const admin = admins.find(a => a.email.toLowerCase() === trimmedEmail);

    if (!admin) {
      return { success: false, message: 'Aucun compte administrateur associé à cet email.' };
    }

    if (admin.isBlocked) {
      return { success: false, message: 'Ce compte administrateur a été suspendu/bloqué par le Super Administrateur.' };
    }

    if (admin.password !== pass) {
      return { success: false, message: 'Mot de passe administrateur incorrect.' };
    }

    const updatedAdmin = { ...admin, lastLogin: new Date().toISOString() };
    setCurrentAdmin(updatedAdmin);
    setCurrentStudent(null);
    setAdmins(prev => prev.map(a => a.id === admin.id ? updatedAdmin : a));
    return { success: true, message: `Bienvenue, ${admin.name}` };
  };

  // 2FA Admin Login via 6-digit Code by Email
  const sendAdminLoginOtp = (email: string, pass: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const admin = admins.find(a => a.email.toLowerCase() === trimmedEmail);

    if (!admin) {
      return { success: false, message: 'Aucun compte administrateur associé à cette adresse email.' };
    }

    if (admin.isBlocked) {
      return { success: false, message: 'Ce compte administrateur a été suspendu par le Super Administrateur.' };
    }

    if (admin.password !== pass) {
      return { success: false, message: 'Mot de passe administrateur incorrect.' };
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const token: EmailVerificationToken = {
      id: `tok-2fa-${Date.now()}`,
      email: admin.email,
      code,
      purpose: 'password_reset',
      createdAt: Date.now(),
      expiresAt: Date.now() + 15 * 60 * 1000,
      used: false,
    };

    setTokens(prev => [...prev.filter(t => t.email.toLowerCase() !== admin.email.toLowerCase()), token]);

    // Send email notification to simulated inbox
    const newEmail: SimulatedEmailMessage = {
      id: `msg-2fa-${Date.now()}`,
      from: 'securite.ufrses@univ-thies.sn (Système de Sécurité UIDT)',
      to: admin.email,
      studentName: admin.name,
      recipientName: admin.name,
      subject: `[Code 2FA : ${code}] Validation de connexion à la Console Administrateur`,
      code,
      date: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setSimulatedInbox(prev => [newEmail, ...prev]);
    setLatestEmail(newEmail);

    // Dispatch real email via Gmail API if connected
    if (isGmailConnected()) {
      sendGmailSecurityCode({
        toEmail: admin.email,
        recipientName: admin.name,
        code,
        purpose: '2fa_login',
      }).catch(err => console.error('Gmail send error:', err));
    }

    return {
      success: true,
      message: `Un code de validation à 6 chiffres a été envoyé par email à ${admin.email}.`,
      adminName: admin.name,
      code,
    };
  };

  const verifyAdminLoginOtp = (email: string, code: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    const token = tokens.find(
      t => t.email.toLowerCase() === trimmedEmail &&
           t.code === cleanCode &&
           !t.used &&
           t.expiresAt > Date.now()
    );

    if (!token) {
      return { success: false, message: 'Code de validation incorrect ou expiré. Veuillez vérifier votre boîte mail.' };
    }

    token.used = true;

    const admin = admins.find(a => a.email.toLowerCase() === trimmedEmail);
    if (!admin) {
      return { success: false, message: 'Compte administrateur introuvable.' };
    }

    const updatedAdmin = { ...admin, lastLogin: new Date().toISOString() };
    setCurrentAdmin(updatedAdmin);
    setCurrentStudent(null);
    setAdmins(prev => prev.map(a => a.id === admin.id ? updatedAdmin : a));

    return {
      success: true,
      message: `Code 2FA validé avec succès ! Bienvenue ${admin.name}`,
    };
  };

  const loginStudent = (emailOrIne: string, pass: string) => {
    const query = emailOrIne.trim().toLowerCase();
    const student = students.find(
      s => s.email.toLowerCase() === query || s.ine.toLowerCase() === query
    );

    if (!student) {
      return { success: false, message: 'Aucun étudiant trouvé avec cet email ou numéro INE.' };
    }

    if (student.status === 'bloque') {
      return { success: false, message: 'Votre accès étudiant a été temporairement restreint. Contactez la scolarité.' };
    }

    if (student.password !== pass) {
      return { success: false, message: 'Mot de passe incorrect.' };
    }

    setCurrentStudent(student);
    setCurrentAdmin(null);
    return { success: true, message: `Connexion réussie ! Bienvenue ${student.fullName}` };
  };

  const registerStudent = (data: Omit<StudentUser, 'id' | 'registeredAt' | 'status'>) => {
    // Check email uniqueness
    if (students.some(s => s.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, message: 'Cette adresse email est déjà inscrite sur la plateforme.' };
    }
    // Check INE uniqueness
    if (students.some(s => s.ine.toLowerCase() === data.ine.trim().toLowerCase())) {
      return { success: false, message: 'Ce numéro INE universitaire est déjà associé à un compte.' };
    }

    const newStudent: StudentUser = {
      ...data,
      id: `std-${Date.now()}`,
      ine: data.ine.trim().toUpperCase(),
      registeredAt: new Date().toISOString(),
      status: 'actif',
    };

    setStudents(prev => [newStudent, ...prev]);
    setCurrentStudent(newStudent);
    setCurrentAdmin(null);

    return {
      success: true,
      message: 'Inscription validée avec succès ! Vous êtes désormais connecté.',
      student: newStudent,
    };
  };

  const logout = () => {
    setCurrentAdmin(null);
    setCurrentStudent(null);
    setActiveTab('accueil');
  };

  // Password reset flow (Étudiants et Administrateurs)
  const requestPasswordResetCode = (emailOrIne: string) => {
    const query = emailOrIne.trim().toLowerCase();
    
    // Check if target is a student
    const student = students.find(
      s => s.email.toLowerCase() === query || s.ine.toLowerCase() === query
    );

    // Check if target is an admin
    const admin = admins.find(
      a => a.email.toLowerCase() === query
    );

    if (!student && !admin) {
      return {
        success: false,
        message: 'Aucun compte (étudiant ou administrateur) ne correspond à cet identifiant (email ou INE).',
      };
    }

    const targetEmail = student ? student.email : admin!.email;
    const targetName = student ? student.fullName : admin!.name;
    const targetIne = student ? student.ine : undefined;

    // Generate random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const token: EmailVerificationToken = {
      id: `tok-${Date.now()}`,
      email: targetEmail,
      ine: targetIne,
      code,
      purpose: 'password_reset',
      createdAt: Date.now(),
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
      used: false,
    };

    setTokens(prev => [...prev.filter(t => t.email.toLowerCase() !== targetEmail.toLowerCase()), token]);

    // Create simulated email in inbox
    const newEmail: SimulatedEmailMessage = {
      id: `msg-${Date.now()}`,
      from: 'securite.ufrses@univ-thies.sn (UFR SES - Université Iba Der Thiam)',
      to: targetEmail,
      studentName: targetName,
      recipientName: targetName,
      subject: `Code de vérification pour réinitialisation du mot de passe : ${code}`,
      code,
      date: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setSimulatedInbox(prev => [newEmail, ...prev]);
    setLatestEmail(newEmail);

    // Dispatch real email via Gmail API if connected
    if (isGmailConnected()) {
      sendGmailSecurityCode({
        toEmail: targetEmail,
        recipientName: targetName,
        code,
        purpose: 'password_reset',
      }).catch(err => console.error('Gmail send error:', err));
    }

    return {
      success: true,
      message: `Un code de sécurité à 6 chiffres a été expédié à l'adresse ${targetEmail}.`,
      code,
    };
  };

  const verifyResetCode = (emailOrIne: string, code: string) => {
    const query = emailOrIne.trim().toLowerCase();
    const student = students.find(
      s => s.email.toLowerCase() === query || s.ine.toLowerCase() === query
    );
    const admin = admins.find(a => a.email.toLowerCase() === query);

    const targetEmail = student ? student.email : admin ? admin.email : query;

    const token = tokens.find(
      t => t.email.toLowerCase() === targetEmail.toLowerCase() && !t.used
    );

    if (!token) {
      return { success: false, message: 'Aucun code de vérification actif pour cet identifiant. Veuillez en demander un nouveau.' };
    }

    if (Date.now() > token.expiresAt) {
      return { success: false, message: 'Ce code a expiré (validité 15 min). Veuillez demander un nouveau code.' };
    }

    if (token.code !== code.trim()) {
      return { success: false, message: 'Code de vérification incorrect. Veuillez revérifier votre boîte mail.' };
    }

    return { success: true, message: 'Code validé avec succès ! Vous pouvez maintenant saisir votre nouveau mot de passe.' };
  };

  const completePasswordReset = (emailOrIne: string, newPass: string) => {
    const query = emailOrIne.trim().toLowerCase();
    const student = students.find(
      s => s.email.toLowerCase() === query || s.ine.toLowerCase() === query
    );
    const admin = admins.find(a => a.email.toLowerCase() === query);

    if (!student && !admin) {
      return { success: false, message: 'Compte introuvable.' };
    }

    if (!newPass || newPass.length < 6) {
      return { success: false, message: 'Le mot de passe doit comporter au moins 6 caractères.' };
    }

    const targetEmail = student ? student.email : admin!.email;

    if (student) {
      setStudents(prev =>
        prev.map(s => (s.id === student.id ? { ...s, password: newPass } : s))
      );
      if (currentStudent && currentStudent.id === student.id) {
        setCurrentStudent(prev => (prev ? { ...prev, password: newPass } : null));
      }
    }

    if (admin) {
      setAdmins(prev =>
        prev.map(a => (a.id === admin.id ? { ...a, password: newPass } : a))
      );
      if (currentAdmin && currentAdmin.id === admin.id) {
        setCurrentAdmin(prev => (prev ? { ...prev, password: newPass } : null));
      }
    }

    // Invalidate tokens
    setTokens(prev =>
      prev.map(t =>
        t.email.toLowerCase() === targetEmail.toLowerCase() ? { ...t, used: true } : t
      )
    );

    return { success: true, message: 'Votre mot de passe a été réinitialisé avec succès !' };
  };

  const clearSimulatedInbox = () => {
    setSimulatedInbox([]);
    setLatestEmail(null);
  };

  // Resources Actions
  const addResource = (resource: Omit<AcademicResource, 'id' | 'createdAt' | 'downloadsCount'>) => {
    const newRes: AcademicResource = {
      ...resource,
      id: `res-${Date.now()}`,
      createdAt: new Date().toISOString(),
      downloadsCount: 0,
    };
    setResources(prev => [newRes, ...prev]);
  };

  const updateResource = (id: string, updated: Partial<AcademicResource>) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
  };

  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const incrementDownload = (id: string) => {
    setResources(prev =>
      prev.map(r => r.id === id ? { ...r, downloadsCount: r.downloadsCount + 1 } : r)
    );
  };

  // Historical Figures Actions (Revue Historique)
  const addHistoricalFigure = (data: Omit<HistoricalFigure, 'id' | 'createdAt'>) => {
    const newFig: HistoricalFigure = {
      ...data,
      id: `fig-${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: currentAdmin ? currentAdmin.name : 'Administrateur',
    };
    setHistoricalFigures(prev => [newFig, ...prev]);
    return { success: true, message: 'Figure historique ajoutée à la revue de l\'Amicale.' };
  };

  const updateHistoricalFigure = (id: string, updated: Partial<HistoricalFigure>) => {
    setHistoricalFigures(prev => prev.map(f => f.id === id ? { ...f, ...updated } : f));
  };

  const deleteHistoricalFigure = (id: string) => {
    setHistoricalFigures(prev => prev.filter(f => f.id !== id));
    return { success: true, message: 'Figure historique supprimée avec succès.' };
  };

  // Amicale News Actions (Actualités & Événements)
  const addAmicaleNews = (data: Omit<AmicaleNewsArticle, 'id' | 'createdAt'>) => {
    const newArticle: AmicaleNewsArticle = {
      ...data,
      id: `art-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAmicaleNews(prev => [newArticle, ...prev]);
    return { success: true, message: 'Nouvelle rédaction / actualité publiée avec succès.' };
  };

  const updateAmicaleNews = (id: string, updated: Partial<AmicaleNewsArticle>) => {
    setAmicaleNews(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
  };

  const deleteAmicaleNews = (id: string) => {
    setAmicaleNews(prev => prev.filter(a => a.id !== id));
    return { success: true, message: 'Publication supprimée.' };
  };

  // Admin Management Actions
  const addAdmin = (data: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => {
    const emailLower = data.email.trim().toLowerCase();
    if (admins.some(a => a.email.toLowerCase() === emailLower)) {
      return { success: false, message: 'Cet email administrateur est déjà utilisé.' };
    }

    const newAdmin: AdminUser = {
      ...data,
      id: `admin-${Date.now()}`,
      email: emailLower,
      createdAt: new Date().toISOString(),
      isBlocked: false,
    };

    setAdmins(prev => [...prev, newAdmin]);
    return { success: true, message: `Administrateur ${newAdmin.name} ajouté avec succès.` };
  };

  const updateAdmin = (id: string, updated: Partial<AdminUser>) => {
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
    if (currentAdmin && currentAdmin.id === id) {
      setCurrentAdmin(prev => prev ? { ...prev, ...updated } : null);
    }
  };

  const isSuperAdminAccount = (email: string) => {
    const e = email.toLowerCase().trim();
    return e === 'adminhyjazi@gmail.com' || e === 'idrissa.hyjazi@univ-thies.sn';
  };

  const toggleBlockAdmin = (id: string) => {
    const target = admins.find(a => a.id === id);
    if (!target) return { success: false, message: 'Administrateur introuvable.' };

    if (isSuperAdminAccount(target.email)) {
      return { success: false, message: 'Impossible de bloquer le Super Administrateur principal.' };
    }

    const nextState = !target.isBlocked;
    setAdmins(prev =>
      prev.map(a => a.id === id ? { ...a, isBlocked: nextState } : a)
    );

    return {
      success: true,
      message: nextState
        ? `L'administrateur ${target.name} a été bloqué.`
        : `L'administrateur ${target.name} a été débloqué.`,
    };
  };

  const deleteAdmin = (id: string) => {
    const target = admins.find(a => a.id === id);
    if (!target) return { success: false, message: 'Administrateur introuvable.' };

    if (isSuperAdminAccount(target.email)) {
      return { success: false, message: 'Impossible de supprimer le Super Administrateur fondateur.' };
    }

    setAdmins(prev => prev.filter(a => a.id !== id));
    return { success: true, message: `Administrateur ${target.name} supprimé avec succès.` };
  };

  // Email Modification for Students & Admins
  const updateStudentEmail = (newEmail: string) => {
    if (!currentStudent) return { success: false, message: 'Aucun étudiant connecté.' };
    const emailLower = newEmail.trim().toLowerCase();
    if (!emailLower.includes('@') || !emailLower.includes('.')) {
      return { success: false, message: 'Veuillez saisir une adresse email valide.' };
    }
    if (students.some(s => s.id !== currentStudent.id && s.email.toLowerCase() === emailLower)) {
      return { success: false, message: 'Cette adresse email est déjà utilisée par un autre étudiant.' };
    }
    if (admins.some(a => a.email.toLowerCase() === emailLower)) {
      return { success: false, message: 'Cette adresse email est déjà utilisée sur la plateforme.' };
    }

    const updated = { ...currentStudent, email: emailLower };
    setCurrentStudent(updated);
    setStudents(prev => prev.map(s => s.id === currentStudent.id ? updated : s));
    return { success: true, message: `Votre adresse email a été modifiée avec succès : ${emailLower}` };
  };

  const updateAdminEmail = (newEmail: string) => {
    if (!currentAdmin) return { success: false, message: 'Aucun administrateur connecté.' };
    const emailLower = newEmail.trim().toLowerCase();
    if (!emailLower.includes('@') || !emailLower.includes('.')) {
      return { success: false, message: 'Veuillez saisir une adresse email valide.' };
    }
    if (admins.some(a => a.id !== currentAdmin.id && a.email.toLowerCase() === emailLower)) {
      return { success: false, message: 'Cette adresse email est déjà attribuée à un autre compte administrateur.' };
    }
    if (students.some(s => s.email.toLowerCase() === emailLower)) {
      return { success: false, message: 'Cette adresse email est déjà associée à un compte étudiant.' };
    }

    const updated = { ...currentAdmin, email: emailLower };
    setCurrentAdmin(updated);
    setAdmins(prev => prev.map(a => a.id === currentAdmin.id ? updated : a));
    return { success: true, message: `Votre adresse email de connexion administrateur a été modifiée avec succès : ${emailLower}` };
  };

  // Student Actions
  const updateStudent = (id: string, updated: Partial<StudentUser>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    if (currentStudent && currentStudent.id === id) {
      setCurrentStudent(prev => prev ? { ...prev, ...updated } : null);
    }
  };

  const toggleBlockStudent = (id: string) => {
    setStudents(prev =>
      prev.map(s =>
        s.id === id ? { ...s, status: s.status === 'actif' ? 'bloque' : 'actif' } : s
      )
    );
  };

  // Site Images Actions
  const updateSiteImages = (images: Partial<SiteImages>) => {
    setSiteImages(prev => ({
      ...prev,
      ...images,
      filieres: {
        ...prev.filieres,
        ...(images.filieres || {}),
      },
    }));
  };

  const updateFiliereImage = (filiereId: FiliereId, imageUrl: string) => {
    setSiteImages(prev => ({
      ...prev,
      filieres: {
        ...prev.filieres,
        [filiereId]: imageUrl,
      },
    }));
  };

  const resetImagesToDefault = () => {
    setSiteImages(INITIAL_SITE_IMAGES);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedFiliereId,
        setSelectedFiliereId,
        activitesSubTab,
        setActivitesSubTab,
        filieres,
        resources,
        admins,
        students,
        siteImages,
        historicalFigures,
        amicaleNews,
        currentAdmin,
        currentStudent,
        isAuthenticated: !!currentAdmin || !!currentStudent,
        isAdmin: !!currentAdmin,
        isStudent: !!currentStudent,
        isGmailActive,
        gmailUserEmail,
        connectGmail,
        disconnectGmailAccount,
        dispatchCodeToRealGmail,
        loginAdmin,
        sendAdminLoginOtp,
        verifyAdminLoginOtp,
        loginStudent,
        updateStudentEmail,
        updateAdminEmail,
        registerStudent,
        logout,
        requestPasswordResetCode,
        verifyResetCode,
        completePasswordReset,
        simulatedInbox,
        clearSimulatedInbox,
        showEmailModal,
        setShowEmailModal,
        latestEmail,
        addResource,
        updateResource,
        deleteResource,
        incrementDownload,
        addHistoricalFigure,
        updateHistoricalFigure,
        deleteHistoricalFigure,
        addAmicaleNews,
        updateAmicaleNews,
        deleteAmicaleNews,
        addAdmin,
        updateAdmin,
        toggleBlockAdmin,
        deleteAdmin,
        updateStudent,
        toggleBlockStudent,
        updateSiteImages,
        updateFiliereImage,
        resetImagesToDefault,
        previewResource,
        setPreviewResource,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
