/**
 * Entity.js - Classe de base pour toutes les entités (joueur et bots)
 */

class Entity {
    constructor(x, y, name, game) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.name = name;
        
        // Physique
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 150;
        this.size = 25;
        this.angle = 0;
        
        // Santé
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.isAlive = true;
        
        // Combat
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.attackCooldownTime = 0.5; // secondes
        this.attackDamage = 20;
        this.weaponRange = 40;
        
        // Dash
        this.canDash = true;
        this.dashCooldown = 0;
        this.dashCooldownTime = 3; // secondes
        this.dashSpeed = 500;
        this.dashDuration = 0.2;
        this.isDashing = false;
        this.dashTimer = 0;
        
        // Visuel
        this.color = this.getRandomColor();
    }

    /**
     * Met à jour l'entité
     */
    update(deltaTime) {
        if (!this.isAlive) return;

        // Mettre à jour les cooldowns
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }
        
        if (this.dashCooldown > 0) {
            this.dashCooldown -= deltaTime;
            if (this.dashCooldown <= 0) {
                this.canDash = true;
            }
        }

        // Mettre à jour le dash
        if (this.isDashing) {
            this.dashTimer -= deltaTime;
            if (this.dashTimer <= 0) {
                this.isDashing = false;
            }
        }

        // Appliquer la vélocité
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;

        // Friction
        this.velocityX *= 0.9;
        this.velocityY *= 0.9;

        // Garder dans les limites de la carte
        this.x = Utils.clamp(this.x, this.size, this.game.config.mapWidth - this.size);
        this.y = Utils.clamp(this.y, this.size, this.game.config.mapHeight - this.size);

        // Vérifier les collisions avec les îles
        this.checkIslandCollisions();
    }

    /**
     * Déplacement
     */
    move(dirX, dirY) {
        if (this.isDashing) return;

        const currentSpeed = this.speed;
        this.velocityX = dirX * currentSpeed;
        this.velocityY = dirY * currentSpeed;
    }

    /**
     * Dash
     */
    dash(dirX, dirY) {
        if (!this.canDash || this.isDashing) return;

        this.isDashing = true;
        this.dashTimer = this.dashDuration;
        this.dashCooldown = this.dashCooldownTime;
        this.canDash = false;

        this.velocityX = dirX * this.dashSpeed;
        this.velocityY = dirY * this.dashSpeed;
    }

    /**
     * Attaque
     */
    attack(targetX, targetY) {
        if (this.attackCooldown > 0 || this.isDashing) return;

        this.isAttacking = true;
        this.attackCooldown = this.attackCooldownTime;
        this.angle = Math.atan2(targetY - this.y, targetX - this.x);

        // Vérifier si on touche une entité
        this.checkAttackHit();

        // Arrêter l'animation d'attaque après un court délai
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }

    /**
     * Vérifie si l'attaque touche une entité
     */
    checkAttackHit() {
        for (const entity of this.game.entities) {
            if (entity === this || !entity.isAlive) continue;

            const dist = Utils.distance(this.x, this.y, entity.x, entity.y);
            const attackRange = this.size + this.weaponRange + entity.size;

            if (dist < attackRange) {
                // Vérifier l'angle d'attaque
                const angleToTarget = Math.atan2(entity.y - this.y, entity.x - this.x);
                const angleDiff = Math.abs(Utils.normalizeAngle(angleToTarget - this.angle));

                if (angleDiff < Math.PI / 3) { // Cône d'attaque de 60°
                    this.hit(entity);
                }
            }
        }
    }

    /**
     * Inflige des dégâts à une entité
     */
    hit(target) {
        target.takeDamage(this.attackDamage, this);
    }

    /**
     * Prend des dégâts
     */
    takeDamage(amount, attacker) {
        if (!this.isAlive) return;

        this.health -= amount;

        if (this.health <= 0) {
            this.health = 0;
            this.die(attacker);
        }
    }

    /**
     * Mort de l'entité
     */
    die(killer) {
        this.isAlive = false;
        this.velocityX = 0;
        this.velocityY = 0;

        if (killer && this.game.onKill) {
            this.game.onKill(killer, this);
        }
    }

    /**
     * Vérifie les collisions avec les îles
     */
    checkIslandCollisions() {
        for (const island of this.game.map.islands) {
            const dist = Utils.distance(this.x, this.y, island.x, island.y);
            const minDist = this.size + island.radius;

            if (dist < minDist) {
                // Repousser l'entité
                const angle = Math.atan2(this.y - island.y, this.x - island.x);
                const overlap = minDist - dist;
                this.x += Math.cos(angle) * overlap;
                this.y += Math.sin(angle) * overlap;
            }
        }
    }

    /**
     * Génère une couleur aléatoire
     */
    getRandomColor() {
        const colors = [
            '#e74c3c', '#3498db', '#2ecc71', '#f39c12', 
            '#9b59b6', '#1abc9c', '#e67e22', '#95a5a6'
        ];
        return Utils.randomChoice(colors);
    }
}
