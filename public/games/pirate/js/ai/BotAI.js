/**
 * BotAI.js - Intelligence artificielle des bots
 */

class BotAI {
    constructor(bot, game) {
        this.bot = bot;
        this.game = game;
        
        // Comportement
        this.state = 'wander'; // wander, chase, attack, flee
        this.target = null;
        this.wanderTarget = { x: bot.x, y: bot.y };
        
        // Timers
        this.decisionTimer = 0;
        this.decisionInterval = 0.5; // Prend une décision toutes les 0.5s
        
        // Paramètres de personnalité
        this.aggression = Utils.random(0.5, 1.0); // Plus agressif = attaque plus
        this.caution = Utils.random(0.3, 0.8); // Plus prudent = fuit plus vite
        this.awareness = Utils.random(200, 400); // Distance de détection
    }

    /**
     * Met à jour l'IA
     */
    update(deltaTime) {
        this.decisionTimer += deltaTime;

        // Prendre une décision
        if (this.decisionTimer >= this.decisionInterval) {
            this.makeDecision();
            this.decisionTimer = 0;
        }

        // Exécuter le comportement actuel
        this.executeBehavior(deltaTime);
    }

    /**
     * Prend une décision sur le comportement à adopter
     */
    makeDecision() {
        // Trouver les ennemis à proximité
        const nearbyEnemies = this.findNearbyEnemies();

        // État de santé
        const healthPercent = this.bot.health / this.bot.maxHealth;

        // Décider du comportement
        if (healthPercent < this.caution && nearbyEnemies.length > 0) {
            // Vie faible + ennemis proches = fuir
            this.state = 'flee';
            this.target = nearbyEnemies[0];
        } else if (nearbyEnemies.length > 0) {
            // Ennemis détectés
            const closest = nearbyEnemies[0];
            const distance = closest.distance;

            if (distance < 100 && this.aggression > 0.6) {
                // Assez proche = attaquer
                this.state = 'attack';
                this.target = closest.entity;
            } else if (distance < this.awareness) {
                // Dans le rayon de détection = poursuivre
                this.state = 'chase';
                this.target = closest.entity;
            } else {
                // Trop loin = errer
                this.state = 'wander';
                this.target = null;
            }
        } else {
            // Pas d'ennemis = errer
            this.state = 'wander';
            this.target = null;
        }

        // Vérifier la zone de sécurité
        if (!this.game.safeZone.isInSafeZone(this.bot)) {
            // Hors de la zone = se diriger vers le centre
            this.state = 'flee';
            this.target = {
                x: this.game.safeZone.x,
                y: this.game.safeZone.y,
                isZoneCenter: true
            };
        }
    }

    /**
     * Exécute le comportement actuel
     */
    executeBehavior(deltaTime) {
        switch (this.state) {
            case 'wander':
                this.wander();
                break;
            case 'chase':
                this.chase();
                break;
            case 'attack':
                this.attack();
                break;
            case 'flee':
                this.flee();
                break;
        }
    }

    /**
     * Comportement: Errer
     */
    wander() {
        // Vérifier si on est arrivé à destination
        const dist = Utils.distance(this.bot.x, this.bot.y, this.wanderTarget.x, this.wanderTarget.y);
        
        if (dist < 50) {
            // Choisir une nouvelle destination aléatoire sur une île
            const island = Utils.randomChoice(this.game.map.islands);
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * island.radius * 0.7;
            
            this.wanderTarget = {
                x: island.x + Math.cos(angle) * distance,
                y: island.y + Math.sin(angle) * distance
            };
        }

        // Se diriger vers la destination
        this.bot.moveTowards(this.wanderTarget.x, this.wanderTarget.y);
    }

    /**
     * Comportement: Poursuivre
     */
    chase() {
        if (!this.target || !this.target.isAlive) {
            this.state = 'wander';
            return;
        }

        this.bot.moveTowards(this.target.x, this.target.y);
    }

    /**
     * Comportement: Attaquer
     */
    attack() {
        if (!this.target || !this.target.isAlive) {
            this.state = 'wander';
            return;
        }

        this.bot.attackTarget(this.target);
    }

    /**
     * Comportement: Fuir
     */
    flee() {
        if (this.target && this.target.isZoneCenter) {
            // Fuir vers le centre de la zone de sécurité
            this.bot.moveTowards(this.target.x, this.target.y);
        } else if (this.target) {
            // Fuir l'ennemi
            this.bot.fleeFrom(this.target.x, this.target.y);
        } else {
            // Fuir vers le centre de la zone
            this.bot.moveTowards(this.game.safeZone.x, this.game.safeZone.y);
        }
    }

    /**
     * Trouve les ennemis à proximité
     */
    findNearbyEnemies() {
        const enemies = [];

        for (const entity of this.game.entities) {
            if (entity === this.bot || !entity.isAlive) continue;

            const dist = Utils.distance(this.bot.x, this.bot.y, entity.x, entity.y);
            
            if (dist < this.awareness) {
                enemies.push({
                    entity: entity,
                    distance: dist
                });
            }
        }

        // Trier par distance (plus proche en premier)
        enemies.sort((a, b) => a.distance - b.distance);

        return enemies;
    }

    /**
     * Vérifie si une position est sûre
     */
    isSafePosition(x, y) {
        // Vérifier si dans la zone de sécurité
        if (!this.game.safeZone.isInSafeZone({ x, y })) {
            return false;
        }

        // Vérifier s'il n'y a pas trop d'ennemis proches
        let nearbyEnemies = 0;
        for (const entity of this.game.entities) {
            if (entity === this.bot || !entity.isAlive) continue;

            const dist = Utils.distance(x, y, entity.x, entity.y);
            if (dist < 150) {
                nearbyEnemies++;
            }
        }

        return nearbyEnemies < 2;
    }
}
