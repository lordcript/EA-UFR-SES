import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure Google Auth Provider with Gmail Send scope
const provider = new GoogleAuthProvider();
export const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
SCOPES.forEach((scope) => provider.addScope(scope));

// In-memory token cache (never stored in localStorage for security)
let cachedAccessToken: string | null = null;
let currentUser: User | null = null;
let isSigningIn = false;

// Initialize auth state listener
export const initGmailAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    currentUser = user;
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    }
  });
};

// Sign in with Google to authorize sending emails via Gmail API
export const connectGmailAccount = async (): Promise<{
  user: User;
  accessToken: string;
} | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (!credential?.accessToken) {
      throw new Error("Impossible d'obtenir le jeton d'accès Google.");
    }

    cachedAccessToken = credential.accessToken;
    currentUser = result.user;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Erreur de connexion Google Gmail:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getGmailAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const getGmailUser = (): User | null => {
  return currentUser;
};

export const isGmailConnected = (): boolean => {
  return !!cachedAccessToken;
};

export const disconnectGmail = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  currentUser = null;
};

// URL-safe Base64 encoder for RFC 2822 email payload
function encodeBase64Url(str: string): string {
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Send a real security code email to the recipient's Gmail inbox via Gmail API.
 */
export const sendGmailSecurityCode = async (params: {
  toEmail: string;
  recipientName: string;
  code: string;
  purpose: '2fa_login' | 'password_reset';
}): Promise<{ success: boolean; message: string; messageId?: string }> => {
  const token = getGmailAccessToken();

  if (!token) {
    return {
      success: false,
      message:
        "Compte Google non connecté. Veuillez vous connecter avec Google pour activer l'envoi réel par Gmail.",
    };
  }

  const is2Fa = params.purpose === '2fa_login';
  const subject = is2Fa
    ? `[AE UFR SES Biblio] Code de Sécurité 2FA : ${params.code}`
    : `[AE UFR SES Biblio] Code de Réinitialisation de Mot de Passe : ${params.code}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
    <div style="background-color: #0f2b4c; padding: 24px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0; font-size: 20px; font-weight: bold; color: #ffffff;">AE UFR SES Biblio</h1>
      <p style="margin: 4px 0 0; font-size: 12px; color: #fde047;">Université Iba Der Thiam de Thiès · Sénégal</p>
    </div>
    <div style="padding: 28px;">
      <p style="font-size: 14px; margin-top: 0;">Bonjour <strong>${params.recipientName}</strong>,</p>
      <p style="font-size: 13px; line-height: 1.5; color: #475569;">
        ${
          is2Fa
            ? "Une tentative de connexion à la console administrateur a été initiée. Voici votre code de vérification à 6 chiffres (2FA) :"
            : "Une demande de réinitialisation de mot de passe a été initiée pour votre compte. Voici votre code de validation à 6 chiffres :"
        }
      </p>
      <div style="text-align: center; margin: 28px 0;">
        <span style="display: inline-block; background-color: #0f2b4c; color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: 6px; padding: 14px 28px; border-radius: 12px; font-family: monospace;">
          ${params.code}
        </span>
      </div>
      <p style="font-size: 12px; color: #64748b; line-height: 1.4;">
        Ce code est strictement confidentiel et reste valable pendant <strong>15 minutes</strong>. Ne le partagez avec personne.
      </p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
        Bibliothèque Numérique Officielle · Amicale des Étudiants de l'UFR SES<br />
        Université Iba Der Thiam (UIDT), Thiès, Sénégal
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  // Construct RFC 2822 message
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const rawMessage = [
    `To: ${params.toEmail}`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    htmlBody,
  ].join('\r\n');

  try {
    const encoded = encodeBase64Url(rawMessage);
    const response = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw: encoded }),
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(
        errData.error?.message || `Erreur API Gmail (${response.status})`
      );
    }

    const data = await response.json();
    return {
      success: true,
      message: `Email avec le code réel envoyé directement à ${params.toEmail} via l'API Gmail !`,
      messageId: data.id,
    };
  } catch (error: any) {
    console.error('Erreur envoi Gmail:', error);
    return {
      success: false,
      message: error.message || "Erreur lors de l'envoi via Gmail.",
    };
  }
};
