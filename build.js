const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Début du processus de build...\n');

// Vérifier si les dépendances sont installées
if (!fs.existsSync('./node_modules')) {
    console.log('📦 Installation des dépendances...');
    execSync('npm install', { stdio: 'inherit' });
}

// Vérifier si l'icône existe
if (!fs.existsSync('.icon/icon.png')) {
    console.log('⚠️  Attention: logonew.png introuvable. Créer un fichier d\'icône par défaut...');
    // Créer un fichier d'icône basique si nécessaire
    console.log('   Veuillez placer votre fichier logonew.png dans le dossier racine.');
}

// Build pour Windows uniquement
console.log('\n🔨 Construction de l\'application Windows...');

try {
    // Windows
    console.log('🪟 Build Windows...');
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('\n✅ Build Windows terminé avec succès!');
    console.log('📁 Le fichier d\'installation est dans le dossier "dist/"');
    
} catch (error) {
    console.error('❌ Erreur durant le build:', error.message);
    process.exit(1);
}