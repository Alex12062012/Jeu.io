/**
 * Weapon.js - Système d'armes
 * (Pour l'instant tous utilisent l'épée de base, mais préparé pour extensions futures)
 */

class Weapon {
    constructor(type = 'sword') {
        this.type = type;
        this.damage = 20;
        this.range = 40;
        this.cooldown = 0.5;
        
        this.loadWeaponStats(type);
    }

    /**
     * Charge les stats selon le type d'arme
     */
    loadWeaponStats(type) {
        const weapons = {
            sword: {
                damage: 20,
                range: 40,
                cooldown: 0.5
            },
            axe: {
                damage: 30,
                range: 35,
                cooldown: 0.8
            },
            spear: {
                damage: 15,
                range: 60,
                cooldown: 0.6
            }
        };

        const stats = weapons[type] || weapons.sword;
        Object.assign(this, stats);
    }

    /**
     * Obtient les dégâts de l'arme
     */
    getDamage() {
        return this.damage;
    }

    /**
     * Obtient la portée de l'arme
     */
    getRange() {
        return this.range;
    }

    /**
     * Obtient le cooldown de l'arme
     */
    getCooldown() {
        return this.cooldown;
    }
}
