/**
 * Bot.js - Classe des bots avec IA
 */

class Bot extends Entity {
    constructor(x, y, name, game) {
        super(x, y, name, game);
        
        // Comportement de l'IA
        this.ai = new BotAI(this, game);
        this.target = null;
        this.state = 'idle'; // idle, moving, attacking, fleeing
        
        // Temps avant changement de comportement
        this.actionTimer = 0;
        this.actionDuration = Utils.random(2, 5);
        
        // Position de destination
        this.destinationX = x;
        this.destinationY = y;
    }

    /**
     * Met à jour le bot
     */
    update(deltaTime) {
        if (!this.isAlive) return;

        // Mettre à jour le timer d'action
        this.actionTimer += deltaTime;

        // L'IA décide du comportement
        this.ai.update(deltaTime);

        // Appeler la mise à jour de la classe parente
        super.update(deltaTime);
    }

    /**
     * Déplacement vers une cible
     */
    moveTowards(targetX, targetY) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 10) { // Distance minimum
            const dirX = dx / dist;
            const dirY = dy / dist;
            this.move(dirX, dirY);
            this.angle = Math.atan2(dirY, dirX);
        }
    }

    /**
     * Fuite depuis une position
     */
    fleeFrom(targetX, targetY) {
        const dx = this.x - targetX;
        const dy = this.y - targetY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            const dirX = dx / dist;
            const dirY = dy / dist;
            this.move(dirX, dirY);
            this.angle = Math.atan2(dirY, dirX);
            
            // Utiliser le dash si disponible
            if (this.canDash && Math.random() < 0.1) {
                this.dash(dirX, dirY);
            }
        }
    }

    /**
     * Attaque une cible
     */
    attackTarget(target) {
        if (!target || !target.isAlive) return;

        const dist = Utils.distance(this.x, this.y, target.x, target.y);
        const attackRange = this.size + this.weaponRange + target.size;

        if (dist < attackRange + 50) {
            // Assez proche pour attaquer
            this.attack(target.x, target.y);
        } else {
            // Se rapprocher
            this.moveTowards(target.x, target.y);
        }
    }
}
