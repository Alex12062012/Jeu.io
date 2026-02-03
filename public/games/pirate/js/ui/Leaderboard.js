/**
 * Leaderboard.js - Tableau des scores
 */

class Leaderboard {
    constructor(game) {
        this.game = game;
        this.container = document.getElementById('leaderboardList');
        this.updateInterval = 1; // Secondes entre chaque mise à jour
        this.timeSinceUpdate = 0;
    }

    /**
     * Met à jour le leaderboard
     */
    update() {
        this.timeSinceUpdate += 1 / 60; // Approximation (60 FPS)

        if (this.timeSinceUpdate >= this.updateInterval) {
            this.render();
            this.timeSinceUpdate = 0;
        }
    }

    /**
     * Affiche le leaderboard
     */
    render() {
        // Récupérer toutes les entités vivantes
        const aliveEntities = this.game.entities.filter(e => e.isAlive);

        // Trier par nombre de kills (on pourrait aussi utiliser les coins ou la taille)
        const sorted = aliveEntities.sort((a, b) => {
            // Pour l'instant, on utilise la taille comme indicateur de puissance
            return b.size - a.size;
        });

        // Prendre les 5 premiers
        const top5 = sorted.slice(0, 5);

        // Générer le HTML
        this.container.innerHTML = top5.map((entity, index) => {
            const isCurrentPlayer = entity === this.game.player;
            const rank = index + 1;
            const emoji = rank === 1 ? '👑' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '💀';

            return `
                <div class="leaderboard-entry ${isCurrentPlayer ? 'current-player' : ''}">
                    <span class="rank">${emoji} #${rank}</span>
                    <span class="name">${entity.name}</span>
                    <span class="score">${Math.floor(entity.size)}</span>
                </div>
            `;
        }).join('');
    }

    /**
     * Obtient le rang du joueur
     */
    getPlayerRank() {
        if (!this.game.player || !this.game.player.isAlive) {
            const totalEntities = this.game.entities.length;
            const aliveCount = this.game.entities.filter(e => e.isAlive).length;
            return totalEntities - aliveCount + 1;
        }

        const aliveEntities = this.game.entities.filter(e => e.isAlive);
        const sorted = aliveEntities.sort((a, b) => b.size - a.size);
        
        return sorted.indexOf(this.game.player) + 1;
    }

    /**
     * Réinitialise le leaderboard
     */
    reset() {
        this.container.innerHTML = '';
    }
}
