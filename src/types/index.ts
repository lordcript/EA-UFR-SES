export type FiliereId = 'MIO' | 'MTH' | 'SEG' | 'LAC' | 'LEA' | 'MIDIA' | 'MACI';

export type ResourceType = 'cours' | 'examen' | 'td' | 'tp';

export type FileFormat = 'pdf' | 'video' | 'photo' | 'csv' | 'xlsx';

export interface Filiere {
  id: FiliereId;
  name: string;
  code: string;
  description: string;
  department: string;
  levels: string[];
  coverImage: string;
  badgeColor: string;
  iconName: string;
  isMasterSpecialise?: boolean;
}

export interface AcademicResource {
  id: string;
  filiereId: FiliereId;
  type: ResourceType;
  title: string;
  codeUE: string;
  moduleName: string;
  level: string;
  semester: string;
  format: FileFormat;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  author: string;
  academicYear: string;
  description?: string;
  createdAt: string;
  downloadsCount: number;
}

export interface StudentUser {
  id: string;
  ine: string; // Numéro INE universitaire (ex: N01284917245)
  email: string;
  fullName: string;
  filiereId: FiliereId;
  level: string;
  password: string;
  registeredAt: string;
  status: 'actif' | 'bloque';
  phone?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'superadmin' | 'admin' | 'responsable_filiere' | 'admin_secondaire';
  filiereAssigned?: FiliereId | 'ALL';
  isBlocked: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface SiteImages {
  heroBanner: string;
  amicaleLogo: string;
  authBanner: string;
  filieres: Record<FiliereId, string>;
}

export interface EmailVerificationToken {
  id: string;
  email: string;
  code: string;
  ine?: string;
  purpose: 'password_reset' | 'registration';
  createdAt: number;
  expiresAt: number;
  used: boolean;
}

export interface HistoricalFigure {
  id: string;
  fullName: string;
  titleOrRole: string; // e.g. "Président de l'Amicale (2020-2022)", "Doyen Fondateur UFR SES"
  period: string; // e.g. "Mandat 2020 - 2022"
  photoUrl: string;
  biography: string; // Commentaires et revue historique
  achievements?: string[];
  createdAt: string;
  createdBy?: string;
}

export interface AmicaleNewsArticle {
  id: string;
  title: string;
  theme: string; // e.g. "Journée d'intégration", "Conférence Académique", "Sport & Culture", "Gouvernance"
  category: 'actualite' | 'evenement' | 'communique' | 'redaction';
  summary: string;
  content: string; // Rédaction complète de l'article
  authorName: string;
  authorRole: string; // e.g. "Président Amicale", "Admin Secondaire", "Commission Pédagogique"
  date: string;
  photos: string[];
  videoUrl?: string; // Lien vidéo (YouTube ou fichier vidéo)
  tags: string[];
  createdAt: string;
}

