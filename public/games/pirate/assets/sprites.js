// sprites.js - Chargement des animations du pirate

const animations = {
    attack: [],
    idle: [],
    jump: [],
    run: [],
    x: []
};

/**
 * Précharge une image depuis le dossier assets/sprites
 * @param {string} filename 
 * @returns {HTMLImageElement}
 */
function loadImage(filename) {
    const img = new Image();
    img.src = `assets/sprites/${filename}`;
    return img;
}

// Chargement des frames d'attaque (attack0 → attack4)
for (let i = 0; i <= 4; i++) {
    animations.attack.push(loadImage(`attack${i}.png`));
}

// Chargement des frames idle (idle0 → idle3)
for (let i = 0; i <= 3; i++) {
    animations.idle.push(loadImage(`idle${i}.png`));
}

// Chargement des frames jump (jump0 → jump5)
for (let i = 0; i <= 5; i++) {
    animations.jump.push(loadImage(`jump${i}.png`));
}

// Chargement des frames run (run0 → run5)
for (let i = 0; i <= 5; i++) {
    animations.run.push(loadImage(`run${i}.png`));
}

// Chargement des frames x (x0 → x3)
for (let i = 0; i <= 3; i++) {
    animations.x.push(loadImage(`x${i}.png`));
}

// Export pour pouvoir utiliser dans Renderer ou Player
export default animations;
