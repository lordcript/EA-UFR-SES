#!/usr/bin/env bash
# ==============================================================================
# SCRIPT DE DÉPLOIEMENT OFFICIEL EN PRODUCTION - AE UFR SES Biblio
# Université Iba Der Thiam de Thiès
# ==============================================================================

set -e

echo "🚀 [1/6] Démarrage du déploiement de AE UFR SES Biblio..."

# 1. Mode maintenance
php artisan down || true

# 2. Installation des dépendances Composer en mode production
echo "📦 [2/6] Installation des packages PHP via Composer..."
composer install --no-dev --optimize-autoloader --no-interaction

# 3. Migration et alimentation de la base de données
echo "🗄️ [3/6] Exécution des migrations et initialisation des données..."
php artisan migrate --force
php artisan db:seed --force

# 4. Création du lien symbolique de stockage pour les fichiers multimédias
echo "🔗 [4/6] Vérification du lien de stockage storage:link..."
php artisan storage:link || true

# 5. Optimisation et mise en cache des routes, vues et configurations
echo "⚡ [5/6] Optimisation des caches de production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 6. Fin de la maintenance
php artisan up

echo "✅ [6/6] Déploiement terminé avec succès sur l'environnement de production !"
echo "🌐 Identifiants administrateur : adminhyjazi@gmail.com / adminhyjazi1234"
