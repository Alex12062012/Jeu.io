/**
 * Map.js - Génération et gestion de la carte
 */

class Map {
    constructor(width, height, numIslands) {
        this.width = width;
        this.height = height;
        this.islands = [];
        
        this.generateIslands(numIslands);
    }

    /**
     * Génère les îles de manière procédurale
     */
    generateIslands(numIslands) {
        const minRadius = 100;
        const maxRadius = 250;
        const margin = 300;

        // Île centrale (plus grande)
        const centerIsland = new Island(
            this.width / 2,
            this.height / 2,
            maxRadius
        );
        this.islands.push(centerIsland);

        // Générer les autres îles
        let attempts = 0;
        const maxAttempts = numIslands * 10;

        while (this.islands.length < numIslands && attempts < maxAttempts) {
            attempts++;

            const radius = Utils.random(minRadius, maxRadius);
            const x = Utils.random(margin + radius, this.width - margin - radius);
            const y = Utils.random(margin + radius, this.height - margin - radius);

            const newIsland = new Island(x, y, radius);

            // Vérifier qu'elle ne chevauche pas les autres
            let overlaps = false;
            for (const island of this.islands) {
                const dist = Utils.distance(newIsland.x, newIsland.y, island.x, island.y);
                const minDist = newIsland.radius + island.radius + 100; // Espace entre les îles

                if (dist < minDist) {
                    overlaps = true;
                    break;
                }
            }

            if (!overlaps) {
                this.islands.push(newIsland);
            }
        }

        console.log(`✅ ${this.islands.length} îles générées`);
    }

    /**
     * Trouve l'île la plus proche d'un point
     */
    getNearestIsland(x, y) {
        let nearest = null;
        let minDist = Infinity;

        for (const island of this.islands) {
            const dist = Utils.distance(x, y, island.x, island.y);
            if (dist < minDist) {
                minDist = dist;
                nearest = island;
            }
        }

        return nearest;
    }

    /**
     * Vérifie si un point est sur une île
     */
    isOnIsland(x, y) {
        for (const island of this.islands) {
            if (island.containsPoint(x, y)) {
                return true;
            }
        }
        return false;
    }
}
