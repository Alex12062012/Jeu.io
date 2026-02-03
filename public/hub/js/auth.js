/**
 * auth.js - Gestion de l'authentification sur le hub
 */

const Auth = {
    currentUser: null,

    /**
     * Initialise l'authentification
     */
    init() {
        // Initialise ou récupère l'utilisateur via SSO
        this.currentUser = SSO.init();
        this.updateUI();
        this.attachEventListeners();
    },

    /**
     * Met à jour l'interface utilisateur avec les infos utilisateur
     */
    updateUI() {
        const usernameDisplay = document.getElementById('usernameDisplay');
        if (usernameDisplay && this.currentUser) {
            usernameDisplay.textContent = `👤 ${this.currentUser.username}`;
        }
    },

    /**
     * Attache les événements
     */
    attachEventListeners() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.resetUser());
        }
    },

    /**
     * Réinitialise l'utilisateur (génère un nouveau pseudo)
     */
    resetUser() {
        if (confirm('Voulez-vous vraiment générer un nouveau pseudo ? Vos statistiques seront perdues.')) {
            SSO.reset();
            location.reload();
        }
    },

    /**
     * Récupère l'utilisateur actuel
     */
    getCurrentUser() {
        return this.currentUser;
    },

    /**
     * Vérifie si l'utilisateur est connecté
     */
    isLoggedIn() {
        return this.currentUser !== null;
    }
};
