/**
 * Game.js - Boucle principale du jeu
 */

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer(this.canvas);
        this.inputManager = new InputManager();
        this.inputManager.setCanvas(this.canvas);

        // État du jeu
        this.state = 'menu'; // menu, playing, gameover
        this.gameTime = 0;
        this.lastFrameTime = 0;

        // Entités
        this.player = null;
        this.bots = [];
        this.coins = [];
        this.entities = []; // Tous les personnages (joueur + bots)

        // Monde
        this.map = null;
        this.safeZone = null;

        // Configuration
        this.config = {
            mapWidth: 3000,
            mapHeight: 3000,
            numBots: 15,
            numIslands: 8,
            safeZoneStartRadius: 1200,
            safeZoneShrinkInterval: 30, // secondes
            safeZoneShrinkAmount: 150,
            minSafeZoneRadius: 300
        };

        // Stats
        this.stats = {
            kills: 0,
            coins: 0,
            startTime: 0,
            survivalTime: 0
        };

        // UI
        this.hud = null;
        this.leaderboard = null;
        this.nameEditor = null;

        // Bind methods
        this.update = this.update.bind(this);
    }

    /**
     * Initialise le jeu
     */
    init() {
        console.log('🎮 Initialisation de Pirate.io...');

        // Initialiser les composants UI
        this.hud = new HUD(this);
        this.leaderboard = new Leaderboard(this);
        this.nameEditor = new NameEditor(this);

        // Charger les stats depuis SSO
        this.loadUserStats();

        // Afficher le menu
        this.showMenu();

        console.log('✅ Pirate.io initialisé');
    }

    /**
     * Charge les stats de l'utilisateur
     */
    loadUserStats() {
        const stats = SSO.getGameStats('pirate');
        if (stats) {
            document.getElementById('bestScore').textContent = stats.highScore || 0;
            document.getElementById('gamesPlayed').textContent = stats.gamesPlayed || 0;
        }
    }

    /**
     * Sauvegarde les stats de l'utilisateur
     */
    saveUserStats() {
        const currentStats = SSO.getGameStats('pirate') || { highScore: 0, gamesPlayed: 0 };
        
        const newHighScore = Math.max(currentStats.highScore, this.stats.coins);
        const newGamesPlayed = currentStats.gamesPlayed + 1;

        SSO.updateGameStats('pirate', {
            highScore: newHighScore,
            gamesPlayed: newGamesPlayed
        });

        this.loadUserStats();
    }

    /**
     * Affiche le menu
     */
    showMenu() {
        this.state = 'menu';
        document.getElementById('menuScreen').classList.add('active');
        document.getElementById('gameScreen').classList.remove('active');
        document.getElementById('gameOverScreen').classList.remove('active');

        // Charger le pseudo de l'utilisateur
        const user = SSO.getUser();
        if (user) {
            document.getElementById('usernameInput').value = user.username;
        }
    }

    /**
     * Démarre une nouvelle partie
     */
    startGame() {
        console.log('🎮 Démarrage de la partie...');

        // Changer d'écran
        this.state = 'playing';
        document.getElementById('menuScreen').classList.remove('active');
        document.getElementById('gameScreen').classList.add('active');
        document.getElementById('gameOverScreen').classList.remove('active');

        // Réinitialiser les stats
        this.stats = {
            kills: 0,
            coins: 0,
            startTime: Date.now(),
            survivalTime: 0
        };
        this.gameTime = 0;

        // Créer le monde
        this.createWorld();

        // Créer le joueur
        this.createPlayer();

        // Créer les bots
        this.createBots();

        // Démarrer la boucle de jeu
        this.lastFrameTime = performance.now();
        this.update();

        console.log('✅ Partie démarrée');
    }

    /**
     * Crée le monde de jeu
     */
    createWorld() {
        this.map = new Map(
            this.config.mapWidth,
            this.config.mapHeight,
            this.config.numIslands
        );

        this.safeZone = new SafeZone(
            this.config.mapWidth / 2,
            this.config.mapHeight / 2,
            this.config.safeZoneStartRadius,
            this.config.safeZoneShrinkInterval,
            this.config.safeZoneShrinkAmount,
            this.config.minSafeZoneRadius
        );
    }

    /**
     * Crée le joueur
     */
    createPlayer() {
        const user = SSO.getUser();
        const spawnPos = this.getRandomSpawnPosition();

        this.player = new Player(
            spawnPos.x,
            spawnPos.y,
            user ? user.username : 'Joueur',
            this
        );

        this.entities = [this.player];
    }

    /**
     * Crée les bots
     */
    createBots() {
        this.bots = [];

        for (let i = 0; i < this.config.numBots; i++) {
            const spawnPos = this.getRandomSpawnPosition();
            const bot = new Bot(spawnPos.x, spawnPos.y, `Bot${i + 1}`, this);
            this.bots.push(bot);
            this.entities.push(bot);
        }
    }

    /**
     * Obtient une position de spawn aléatoire valide
     */
    getRandomSpawnPosition() {
        // Spawn sur une île aléatoire
        const island = Utils.randomChoice(this.map.islands);
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * island.radius * 0.7;

        return {
            x: island.x + Math.cos(angle) * distance,
            y: island.y + Math.sin(angle) * distance
        };
    }

    /**
     * Boucle de jeu principale
     */
    update(timestamp) {
        if (this.state !== 'playing') return;

        // Calculer delta time
        const deltaTime = (timestamp - this.lastFrameTime) / 1000;
        this.lastFrameTime = timestamp;
        this.gameTime += deltaTime;
        this.stats.survivalTime = Math.floor((Date.now() - this.stats.startTime) / 1000);

        // Mettre à jour le jeu
        this.updateGame(deltaTime);

        // Rendu
        this.render();

        // Continuer la boucle
        requestAnimationFrame(this.update);
    }

    /**
     * Met à jour la logique du jeu
     */
    updateGame(deltaTime) {
        // Mettre à jour la zone de sécurité
        this.safeZone.update(deltaTime);

        // Mettre à jour le joueur
        if (this.player && this.player.isAlive) {
            this.player.update(deltaTime, this.inputManager);

            // Vérifier si le joueur est hors de la zone
            this.safeZone.checkEntity(this.player, deltaTime);
        }

        // Mettre à jour les bots
        for (let i = this.bots.length - 1; i >= 0; i--) {
            const bot = this.bots[i];

            if (bot.isAlive) {
                bot.update(deltaTime);
                this.safeZone.checkEntity(bot, deltaTime);
            } else {
                // Supprimer le bot mort après un délai
                bot.deathTimer = (bot.deathTimer || 0) + deltaTime;
                if (bot.deathTimer > 2) {
                    this.bots.splice(i, 1);
                    this.entities = this.entities.filter(e => e !== bot);
                }
            }
        }

        // Mettre à jour les pièces
        for (let i = this.coins.length - 1; i >= 0; i--) {
            const coin = this.coins[i];

            // Vérifier si le joueur ramasse la pièce
            if (this.player && this.player.isAlive) {
                const dist = Utils.distance(this.player.x, this.player.y, coin.x, coin.y);
                if (dist < this.player.size + coin.size) {
                    this.stats.coins += coin.value;
                    this.coins.splice(i, 1);
                }
            }
        }

        // Mettre à jour le HUD
        this.hud.update();

        // Mettre à jour le leaderboard
        this.leaderboard.update();

        // Vérifier la fin de partie
        this.checkGameOver();
    }

    /**
     * Rendu du jeu
     */
    render() {
        // Effacer le canvas
        this.renderer.clear();

        // Centrer la caméra sur le joueur
        if (this.player && this.player.isAlive) {
            this.renderer.centerCamera(this.player.x, this.player.y);
        }

        // Dessiner l'arrière-plan
        this.renderer.drawBackground(this.config.mapWidth, this.config.mapHeight);

        // Dessiner les îles
        for (const island of this.map.islands) {
            this.renderer.drawIsland(island);
        }

        // Dessiner la zone de sécurité
        this.renderer.drawSafeZone(this.safeZone);

        // Dessiner les pièces
        for (const coin of this.coins) {
            this.renderer.drawCoin(coin);
        }

        // Dessiner les entités (tri par Y pour effet de profondeur)
        const sortedEntities = [...this.entities].sort((a, b) => a.y - b.y);
        for (const entity of sortedEntities) {
            if (entity.isAlive) {
                this.renderer.drawEntity(entity);
            }
        }
    }

    /**
     * Vérifie si la partie est terminée
     */
    checkGameOver() {
        if (!this.player || !this.player.isAlive) {
            this.gameOver(false);
            return;
        }

        // Victoire si tous les bots sont morts
        const aliveBots = this.bots.filter(b => b.isAlive).length;
        if (aliveBots === 0) {
            this.gameOver(true);
        }
    }

    /**
     * Termine la partie
     */
    gameOver(victory) {
        if (this.state !== 'playing') return;

        console.log(victory ? '🏆 VICTOIRE !' : '💀 DÉFAITE');

        this.state = 'gameover';

        // Sauvegarder les stats
        this.saveUserStats();

        // Afficher l'écran de game over
        setTimeout(() => {
            this.showGameOver(victory);
        }, 1000);
    }

    /**
     * Affiche l'écran de game over
     */
    showGameOver(victory) {
        document.getElementById('gameScreen').classList.remove('active');
        document.getElementById('gameOverScreen').classList.add('active');

        // Titre
        const title = document.getElementById('gameOverTitle');
        if (victory) {
            title.textContent = '🏆 VICTOIRE !';
            title.classList.add('victory');
        } else {
            title.textContent = '💀 GAME OVER';
            title.classList.remove('victory');
        }

        // Stats finales
        const aliveCount = this.entities.filter(e => e.isAlive).length;
        const totalEntities = this.entities.length;
        const rank = totalEntities - aliveCount + 1;

        document.getElementById('finalRank').textContent = `#${rank} / ${totalEntities}`;
        document.getElementById('finalKills').textContent = this.stats.kills;
        document.getElementById('finalCoins').textContent = this.stats.coins;
        document.getElementById('finalTime').textContent = Utils.formatTime(this.stats.survivalTime);
    }

    /**
     * Gère l'événement de kill
     */
    onKill(killer, victim) {
        // Si c'est le joueur qui a tué
        if (killer === this.player) {
            this.stats.kills++;
            this.hud.showKillMessage(`Vous avez éliminé ${victim.name}!`, true);
        } else {
            this.hud.showKillMessage(`${killer.name} a éliminé ${victim.name}`);
        }

        // Faire apparaître des pièces à la position de la victime
        this.spawnCoins(victim.x, victim.y, 3 + Math.floor(Math.random() * 3));
    }

    /**
     * Fait apparaître des pièces
     */
    spawnCoins(x, y, count) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const distance = 30 + Math.random() * 20;
            
            this.coins.push({
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                size: 8,
                value: 10
            });
        }
    }

    /**
     * Retourne au menu
     */
    returnToMenu() {
        this.state = 'menu';
        this.showMenu();
        
        // Nettoyer
        this.player = null;
        this.bots = [];
        this.entities = [];
        this.coins = [];
    }

    /**
     * Retourne au hub
     */
    returnToHub() {
        window.location.href = '../../index.html';
    }
}
