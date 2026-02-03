/**
 * Utils.js - Fonctions utilitaires partagées
 */

const Utils = {
    /**
     * Calcule la distance entre deux points
     */
    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },

    /**
     * Calcule l'angle entre deux points (en radians)
     */
    angleBetween(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },

    /**
     * Normalise un angle entre 0 et 2PI
     */
    normalizeAngle(angle) {
        while (angle < 0) angle += Math.PI * 2;
        while (angle > Math.PI * 2) angle -= Math.PI * 2;
        return angle;
    },

    /**
     * Interpolation linéaire
     */
    lerp(start, end, t) {
        return start + (end - start) * t;
    },

    /**
     * Clamp une valeur entre min et max
     */
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    /**
     * Génère un nombre aléatoire entre min et max
     */
    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    /**
     * Génère un entier aléatoire entre min et max (inclus)
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Choisit un élément aléatoire dans un tableau
     */
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Vérifie si deux cercles se chevauchent
     */
    circlesCollide(x1, y1, r1, x2, y2, r2) {
        const dist = this.distance(x1, y1, x2, y2);
        return dist < (r1 + r2);
    },

    /**
     * Vérifie si un point est dans un cercle
     */
    pointInCircle(px, py, cx, cy, radius) {
        return this.distance(px, py, cx, cy) < radius;
    },

    /**
     * Formatte un nombre avec des séparateurs
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },

    /**
     * Formatte un temps en MM:SS
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    /**
     * Débounce une fonction
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
