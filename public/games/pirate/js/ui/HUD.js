/**
 * HUD.js - Interface en jeu (Heads-Up Display)
 */

class HUD {
    constructor(game) {
        this.game = game;
        
        // Éléments DOM
        this.playerName = document.getElementById('playerName');
        this.healthFill = document.getElementById('healthFill');
        this.healthText = document.getElementById('healthText');
        this.killCount = document.getElementById('killCount');
        this.coinCount = document.getElementById('coinCount');
        this.gameTimer = document.getElementById('gameTimer');
        this.zoneStatus = document.getElementById('zoneStatus');
        this.zoneTimer = document.getElementById('zoneTimer');
        this.killFeed = document.getElementById('killFeed');
    }

    /**
     * Met à jour le HUD
     */
    update() {
        if (this.game.state !== 'playing' || !this.game.player) return;

        // Info joueur
        this.playerName.textContent = this.game.player.name;

        // Santé
        const healthPercent = (this.game.player.health / this.game.player.maxHealth) * 100;
        this.healthFill.style.width = `${healthPercent}%`;
        this.healthText.textContent = `${Math.ceil(this.game.player.health)}/${this.game.player.maxHealth}`;

        // Stats
        this.killCount.textContent = this.game.stats.kills;
        this.coinCount.textContent = this.game.stats.coins;

        // Timer
        this.gameTimer.textContent = Utils.formatTime(this.game.stats.survivalTime);

        // Zone
        this.updateZoneStatus();
    }

    /**
     * Met à jour le statut de la zone
     */
    updateZoneStatus() {
        const status = this.game.safeZone.getStatus();
        const timeLeft = this.game.safeZone.getTimeUntilShrink();

        // Texte du statut
        if (status === 'danger') {
            this.zoneStatus.textContent = '⚠️ Danger !';
            this.zoneStatus.className = 'zone-status danger';
        } else if (status === 'warning') {
            this.zoneStatus.textContent = '⚠️ Attention';
            this.zoneStatus.className = 'zone-status warning';
        } else {
            this.zoneStatus.textContent = '✅ Sécurisée';
            this.zoneStatus.className = 'zone-status';
        }

        // Timer
        this.zoneTimer.textContent = `Rétrécit dans ${timeLeft}s`;

        // Vérifier si le joueur est dans la zone
        if (!this.game.safeZone.isInSafeZone(this.game.player)) {
            this.zoneStatus.textContent = '💀 HORS ZONE !';
            this.zoneStatus.className = 'zone-status danger';
        }
    }

    /**
     * Affiche un message de kill
     */
    showKillMessage(message, isPlayerKill = false) {
        const killMessage = document.createElement('div');
        killMessage.className = isPlayerKill ? 'kill-message player-kill' : 'kill-message';
        killMessage.textContent = message;

        this.killFeed.appendChild(killMessage);

        // Retirer après 3 secondes
        setTimeout(() => {
            killMessage.remove();
        }, 3000);

        // Limiter le nombre de messages
        const messages = this.killFeed.children;
        if (messages.length > 5) {
            messages[0].remove();
        }
    }

    /**
     * Affiche un message temporaire
     */
    showMessage(message, duration = 3000) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'zone-warning';
        messageDiv.textContent = message;
        document.getElementById('hud').appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, duration);
    }

    /**
     * Réinitialise le HUD
     */
    reset() {
        this.killCount.textContent = '0';
        this.coinCount.textContent = '0';
        this.gameTimer.textContent = '0:00';
        this.killFeed.innerHTML = '';
    }
}
