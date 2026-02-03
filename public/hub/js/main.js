/**
 * main.js - Point d'entrée principal du hub jeu.io
 */

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Initialisation du hub jeu.io...');

    // Initialiser l'authentification
    Auth.init();

    // Initialiser la liste des jeux
    GameList.init();

    console.log('✅ Hub jeu.io initialisé avec succès !');
    console.log('👤 Utilisateur:', Auth.getCurrentUser());
});

// Gestion du retour depuis un jeu
window.addEventListener('pageshow', (event) => {
    // Rafraîchir les stats si l'utilisateur revient d'un jeu
    if (event.persisted || performance.navigation.type === 2) {
        GameList.updateStats();
    }
});
