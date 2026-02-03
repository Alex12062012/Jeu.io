/**
 * gameList.js - Gestion de la liste des jeux disponibles
 */

const GameList = {
    games: [
        {
            id: 'pirate',
            name: 'Pirate.io',
            icon: '🏴‍☠️',
            description: 'Deviens le plus grand pirate des sept mers ! Combat en Battle Royale avec des bots.',
            url: 'games/pirate/index.html',
            status: 'available',
            badges: ['new', 'popular'],
            players: 'Solo + Bots'
        },
        {
            id: 'ninja',
            name: 'Ninja.io',
            icon: '🥷',
            description: 'Combat de ninjas rapide et intense. Bientôt disponible !',
            url: '#',
            status: 'coming-soon',
            badges: [],
            players: 'Bientôt'
        },
        {
            id: 'tank',
            name: 'Tank.io',
            icon: '🚛',
            description: 'Détruisez tout avec votre tank ! En développement.',
            url: '#',
            status: 'coming-soon',
            badges: [],
            players: 'Bientôt'
        }
    ],

    /**
     * Initialise la liste des jeux
     */
    init() {
        this.renderGamesList();
        this.renderStats();
    },

    /**
     * Affiche la liste des jeux
     */
    renderGamesList() {
        const container = document.getElementById('gamesList');
        if (!container) return;

        container.innerHTML = '';

        this.games.forEach(game => {
            const card = this.createGameCard(game);
            container.appendChild(card);
        });
    },

    /**
     * Crée une carte de jeu
     */
    createGameCard(game) {
        const card = document.createElement('div');
        card.className = 'game-card';

        const isAvailable = game.status === 'available';

        card.innerHTML = `
            <div class="game-card-image">
                ${game.icon}
            </div>
            <div class="game-card-content">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <h3 class="game-card-title">${game.name}</h3>
                    ${game.badges.map(badge => 
                        `<span class="badge badge-${badge}">${badge === 'new' ? 'Nouveau' : 'Populaire'}</span>`
                    ).join('')}
                </div>
                <p class="game-card-description">${game.description}</p>
                <div class="game-card-stats">
                    <span>👥 ${game.players}</span>
                    <span>${isAvailable ? '🟢 Disponible' : '🟡 Bientôt'}</span>
                </div>
                <div class="game-card-footer">
                    <button class="btn ${isAvailable ? 'btn-success' : 'btn-secondary'}" 
                            ${!isAvailable ? 'disabled' : ''}
                            onclick="GameList.playGame('${game.id}')">
                        ${isAvailable ? '🎮 Jouer' : '⏳ Bientôt'}
                    </button>
                </div>
            </div>
        `;

        return card;
    },

    /**
     * Lance un jeu
     */
    playGame(gameId) {
        const game = this.games.find(g => g.id === gameId);
        
        if (!game || game.status !== 'available') {
            alert('Ce jeu n\'est pas encore disponible !');
            return;
        }

        // Vérifier que l'utilisateur est connecté
        if (!Auth.isLoggedIn()) {
            alert('Erreur de connexion. Rechargez la page.');
            return;
        }

        // Rediriger vers le jeu
        window.location.href = game.url;
    },

    /**
     * Affiche les statistiques de l'utilisateur
     */
    renderStats() {
        const container = document.getElementById('statsContainer');
        if (!container) return;

        const user = Auth.getCurrentUser();
        if (!user || !user.games || Object.keys(user.games).length === 0) {
            container.innerHTML = '<p class="text-light">Jouez à des jeux pour voir vos stats ici !</p>';
            return;
        }

        const statsHTML = `
            <div class="stats-grid">
                ${Object.entries(user.games).map(([gameName, stats]) => {
                    const game = this.games.find(g => g.id === gameName);
                    return `
                        <div class="stat-item">
                            <h4>${game ? game.icon + ' ' + game.name : gameName}</h4>
                            <div class="stat-value">${stats.highScore || 0}</div>
                            <p class="text-small text-light">Meilleur score</p>
                        </div>
                        <div class="stat-item">
                            <h4>Parties jouées</h4>
                            <div class="stat-value">${stats.gamesPlayed || 0}</div>
                            <p class="text-small text-light">${game ? game.name : gameName}</p>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        container.innerHTML = statsHTML;
    },

    /**
     * Met à jour les stats après une partie
     */
    updateStats() {
        this.renderStats();
    }
};
