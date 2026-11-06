# AE UFR SES Biblio - Application Laravel 11

Bibliothèque numérique officielle de l'**Amicale des Étudiants de l'UFR Sciences Économiques et Sociales (AE UFR SES Biblio)** - **Université Iba Der Thiam de Thiès (UIDT)**.

---

## 📋 Prérequis Serveur
- **PHP** : >= 8.2 (extensions requises: `pdo_mysql`, `mbstring`, `zip`, `gd`, `bcmath`, `curl`)
- **Base de données** : MySQL >= 8.0, MariaDB >= 10.5, ou PostgreSQL >= 14
- **Gestionnaire de paquets** : Composer >= 2.6
- **Serveur Web** : Nginx ou Apache 2.4

---

## ⚡ Installation et Déploiement

### 1. Configuration de l'Environnement (.env)
Le fichier `.env` est déjà configuré avec les paramètres officiels :
```ini
APP_NAME="AE UFR SES Biblio"
APP_ENV=local
APP_KEY=base64:enibn2BMBtkT/dodMt9NbvZRU3rX8CHDqyjh3Tz0yF4=
APP_DEBUG=true
APP_TIMEZONE=Africa/Dakar
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=uidt_user
DB_USERNAME=root
DB_PASSWORD=
DB_CHARSET=utf8mb4
DB_COLLATION=utf8mb4_unicode_ci

SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database
```

Assurez-vous que la base de données `uidt_user` existe sur votre serveur MySQL :
```sql
CREATE DATABASE IF NOT EXISTS uidt_user CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### 2. Dépendances et Clé d'Application
```bash
composer install
php artisan key:generate
```

---

### 3. Exécution des Migrations et Seeders (Garanti 100% sans conflit)
Pour initialiser proprement la base de données et charger toutes les données de démonstration :
```bash
php artisan migrate:fresh --seed
```
*OU étape par étape :*
```bash
# 1. Création des tables (users, filieres, students, academic_resources, sessions, cache, jobs, etc.)
php artisan migrate

# 2. Peuplement des données ordonnées (Admin, Filières, Étudiants, Ressources Pédagogiques)
php artisan db:seed
```

Vous pouvez également exécuter un seeder spécifique de manière isolée :
- `php artisan db:seed --class=UserSeeder` (Crée le Super Admin `adminhyjazi@gmail.com`)
- `php artisan db:seed --class=FiliereSeeder` (Crée les 5 filières: MIO, MTH, SEG, LAC, LEA)
- `php artisan db:seed --class=StudentSeeder` (Crée les comptes étudiants avec INE universitaire)
- `php artisan db:seed --class=AcademicResourceSeeder` (Crée les cours, TD, TP, examens dans tous les formats)
- `php artisan db:seed --class=AmicaleActivitySeeder` (Crée la revue historique et les actualités rédigées)
- `php artisan db:seed --class=SiteSettingSeeder` (Initialise les logos et paramètres)

---

### 4. Créer le lien symbolique du stockage
```bash
php artisan storage:link
```

---

### 5. Démarrer le Serveur Local
```bash
php artisan serve
```
L'application est immédiatement accessible sur `http://127.0.0.1:8000`.

---

## 🛡️ Comptes d'Accès par Défaut

| Rôle | Identifiant / Email | Mot de passe | Permissions |
| :--- | :--- | :--- | :--- |
| **Super Administrateur** | `adminhyjazi@gmail.com` | `adminhyjazi1234` | Accès total : gestion filières, étudiants, ressources, suppression |
| **Admin Scolarité** | `scolarite.ufrses@univ-thies.sn` | `scolariteUIDT2026` | Gestion pédagogique et validation des fiches |
| **Étudiant (MIO)** | INE: `N01284917245` (amadou.fall@univ-thies.sn) | `etudiantfall2026` | Accès documents MIO, téléchargements, profil |
| **Étudiant (SEG)** | INE: `N01934208119` (fatou.sow@univ-thies.sn) | `etudiantsow2026` | Accès documents SEG, téléchargements, profil |
| **Étudiant (LAC)** | INE: `N01429817553` (awa.diop@univ-thies.sn) | `etudiantdiop2026` | Accès documents LAC, téléchargements, profil |

---

## 🎓 Les Filières & Masters Officiels UFR SES
1. **MIO** : Management Informatisé des Organisations
2. **MTH** : Management du Tourisme et de l'Hôtellerie
3. **SEG** : Sciences Économiques et de Gestion
4. **LAC** : Langues, Arts et Civilisations
5. **LEA** : Langues Étrangères Appliquées
6. **MIDIA** : Master Ingénierie des Données et Intelligence Artificielle
7. **MACI** : Master Audit et Contrôle Interne
