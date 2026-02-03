/**
 * NameEditor.js - Éditeur de pseudo
 */

class NameEditor {
    constructor(game) {
        this.game = game;
        this.input = document.getElementById('usernameInput');
        this.saveBtn = document.getElementById('saveUsernameBtn');
        
        this.init();
    }

    /**
     * Initialise l'éditeur
     */
    init() {
        // Événement sur le bouton sauvegarder
        this.saveBtn.addEventListener('click', () => {
            this.saveName();
        });

        // Événement sur la touche Entrée
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveName();
            }
        });

        // Charger le nom actuel
        this.loadCurrentName();
    }

    /**
     * Charge le nom actuel depuis SSO
     */
    loadCurrentName() {
        const user = SSO.getUser();
        if (user) {
            this.input.value = user.username;
        }
    }

    /**
     * Sauvegarde le nouveau nom
     */
    saveName() {
        const newName = this.input.value.trim();

        // Validation
        if (!newName) {
            alert('Le pseudo ne peut pas être vide !');
            return;
        }

        if (newName.length < 2) {
            alert('Le pseudo doit contenir au moins 2 caractères !');
            return;
        }

        if (newName.length > 20) {
            alert('Le pseudo ne peut pas dépasser 20 caractères !');
            return;
        }

        // Sauvegarder via SSO
        const success = SSO.updateUsername(newName);

        if (success) {
            // Afficher un message de succès
            this.showSuccessMessage();

            // Mettre à jour l'affichage si le joueur existe
            if (this.game.player) {
                this.game.player.name = newName;
            }
        } else {
            alert('Erreur lors de la sauvegarde du pseudo.');
        }
    }

    /**
     * Affiche un message de succès
     */
    showSuccessMessage() {
        const originalText = this.saveBtn.textContent;
        this.saveBtn.textContent = '✅ Sauvegardé !';
        this.saveBtn.disabled = true;

        setTimeout(() => {
            this.saveBtn.textContent = originalText;
            this.saveBtn.disabled = false;
        }, 2000);
    }

    /**
     * Obtient le nom actuel
     */
    getCurrentName() {
        const user = SSO.getUser();
        return user ? user.username : 'Joueur';
    }
}
