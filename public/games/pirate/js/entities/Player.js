/**
 * Player.js - Classe du joueur contrôlé par l'utilisateur
 */

class Player extends Entity {
    constructor(x, y, name, game) {
        super(x, y, name, game);
        
        // Le joueur a des stats légèrement meilleures
        this.color = '#f1c40f'; // Jaune/doré pour se distinguer
        this.size = 28;
    }

    /**
     * Met à jour le joueur
     */
    update(deltaTime, inputManager) {
        if (!this.isAlive) return;

        // Récupérer les inputs de mouvement
        const movement = inputManager.getMovementInput();
        
        // Calculer la direction de mouvement
        let dirX = 0;
        let dirY = 0;

        if (movement.up) dirY -= 1;
        if (movement.down) dirY += 1;
        if (movement.left) dirX -= 1;
        if (movement.right) dirX += 1;

        // Normaliser la direction
        const magnitude = Math.sqrt(dirX * dirX + dirY * dirY);
        if (magnitude > 0) {
            dirX /= magnitude;
            dirY /= magnitude;
        }

        // Dash
        if (movement.dash && this.canDash && magnitude > 0) {
            this.dash(dirX, dirY);
        }

        // Déplacement
        if (magnitude > 0) {
            this.move(dirX, dirY);
            // Mettre à jour l'angle de vue
            this.angle = Math.atan2(dirY, dirX);
        }

        // Attaque avec la souris
        if (inputManager.isMouseDown() && this.attackCooldown <= 0) {
            const mousePos = inputManager.getMousePosition();
            const worldPos = this.game.renderer.screenToWorld(mousePos.x, mousePos.y);
            this.attack(worldPos.x, worldPos.y);
        }

        // Appeler la mise à jour de la classe parente
        super.update(deltaTime);
    }

    /**
     * Override de la méthode die pour gérer la mort du joueur
     */
    die(killer) {
        super.die(killer);
        console.log('💀 Le joueur est mort');
    }
}
