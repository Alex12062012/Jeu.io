/**
 * SafeZone.js - Zone de sécurité qui rétrécit (Battle Royale)
 */

class SafeZone {
    constructor(x, y, startRadius, shrinkInterval, shrinkAmount, minRadius) {
        this.x = x;
        this.y = y;
        this.radius = startRadius;
        this.shrinkInterval = shrinkInterval;
        this.shrinkAmount = shrinkAmount;
        this.minRadius = minRadius;
        
        this.timeSinceLastShrink = 0;
        this.damagePerSecond = 5;
        this.isWarningShown = false;
    }

    /**
     * Met à jour la zone
     */
    update(deltaTime) {
        this.timeSinceLastShrink += deltaTime;

        // Rétrécir la zone
        if (this.timeSinceLastShrink >= this.shrinkInterval) {
            this.shrink();
            this.timeSinceLastShrink = 0;
            this.isWarningShown = false;
        }

        // Afficher un avertissement 5 secondes avant
        if (this.timeSinceLastShrink >= this.shrinkInterval - 5 && !this.isWarningShown) {
            this.showWarning();
            this.isWarningShown = true;
        }
    }

    /**
     * Rétrécit la zone
     */
    shrink() {
        if (this.radius > this.minRadius) {
            this.radius = Math.max(this.minRadius, this.radius - this.shrinkAmount);
            console.log(`🌊 La zone se rétrécit ! Nouveau rayon: ${Math.floor(this.radius)}m`);
        }
    }

    /**
     * Affiche un avertissement
     */
    showWarning() {
        console.log('⚠️ La zone va se rétrécir dans 5 secondes !');
        
        // Afficher un message visuel
        const warning = document.createElement('div');
        warning.className = 'zone-warning';
        warning.textContent = '⚠️ LA ZONE VA SE RÉTRÉCIR !';
        document.getElementById('hud').appendChild(warning);

        setTimeout(() => {
            warning.remove();
        }, 3000);
    }

    /**
     * Vérifie si une entité est dans la zone
     */
    isInSafeZone(entity) {
        const dist = Utils.distance(this.x, this.y, entity.x, entity.y);
        return dist < this.radius;
    }

    /**
     * Vérifie et applique des dégâts à une entité hors zone
     */
    checkEntity(entity, deltaTime) {
        if (!entity.isAlive) return;

        if (!this.isInSafeZone(entity)) {
            const damage = this.damagePerSecond * deltaTime;
            entity.takeDamage(damage, null);
        }
    }

    /**
     * Obtient le temps restant avant le prochain rétrécissement
     */
    getTimeUntilShrink() {
        return Math.ceil(this.shrinkInterval - this.timeSinceLastShrink);
    }

    /**
     * Obtient le statut de la zone
     */
    getStatus() {
        const timeLeft = this.getTimeUntilShrink();
        
        if (timeLeft <= 5) {
            return 'danger';
        } else if (timeLeft <= 10) {
            return 'warning';
        } else {
            return 'safe';
        }
    }
}
