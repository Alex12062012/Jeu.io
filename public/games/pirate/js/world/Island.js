/**
 * Island.js - Classe représentant une île
 */

class Island {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    /**
     * Vérifie si un point est sur l'île
     */
    containsPoint(x, y) {
        const dist = Utils.distance(this.x, this.y, x, y);
        return dist < this.radius;
    }

    /**
     * Vérifie la collision avec une île
     */
    collidesWith(otherIsland) {
        const dist = Utils.distance(this.x, this.y, otherIsland.x, otherIsland.y);
        return dist < (this.radius + otherIsland.radius);
    }
}
