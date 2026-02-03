/**
 * SSO.js - Système d'authentification unique partagé
 * Gère l'identité utilisateur entre jeu.io et tous les jeux
 */

const SSO = {
    STORAGE_KEY: 'jeuio_user',

    /**
     * Génère un UUID v4 simple
     */
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    /**
     * Génère un nom de joueur aléatoire
     */
    generateRandomName() {
        const adjectives = ['Brave', 'Fierce', 'Wild', 'Swift', 'Bold', 'Dark', 'Red', 'Blue'];
        const nouns = ['Pirate', 'Corsair', 'Buccaneer', 'Sailor', 'Captain', 'Raider', 'Viking'];
        const number = Math.floor(Math.random() * 999);
        return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${number}`;
    },

    /**
     * Initialise ou récupère l'utilisateur
     */
    init() {
        let user = this.getUser();
        
        if (!user) {
            // Créer un nouveau utilisateur
            user = {
                userId: this.generateUUID(),
                username: this.generateRandomName(),
                createdAt: Date.now(),
                games: {}
            };
            this.saveUser(user);
        }
        
        return user;
    },

    /**
     * Récupère l'utilisateur depuis localStorage
     */
    getUser() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Erreur lecture SSO:', e);
            return null;
        }
    },

    /**
     * Sauvegarde l'utilisateur dans localStorage
     */
    saveUser(user) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
            return true;
        } catch (e) {
            console.error('Erreur sauvegarde SSO:', e);
            return false;
        }
    },

    /**
     * Met à jour le pseudo (utilisable uniquement dans les jeux)
     */
    updateUsername(newUsername) {
        const user = this.getUser();
        if (!user) return false;
        
        // Validation basique
        if (!newUsername || newUsername.length < 2 || newUsername.length > 20) {
            return false;
        }
        
        user.username = newUsername.trim();
        return this.saveUser(user);
    },

    /**
     * Met à jour les stats d'un jeu
     */
    updateGameStats(gameName, stats) {
        const user = this.getUser();
        if (!user) return false;
        
        if (!user.games[gameName]) {
            user.games[gameName] = {};
        }
        
        Object.assign(user.games[gameName], stats);
        return this.saveUser(user);
    },

    /**
     * Récupère les stats d'un jeu
     */
    getGameStats(gameName) {
        const user = this.getUser();
        return user?.games?.[gameName] || null;
    },

    /**
     * Vérifie si l'utilisateur est connecté
     */
    isLoggedIn() {
        return this.getUser() !== null;
    },

    /**
     * Réinitialise l'utilisateur (pour debug)
     */
    reset() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
};

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SSO;
}
