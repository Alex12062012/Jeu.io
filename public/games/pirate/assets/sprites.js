// Objet contenant toutes les animations et leurs frames
const animations = {
  attack: [],
  idle: [],
  jump: [],
  run: [],
  x: []
};

// Fonction pour charger toutes les images d'une animation
function loadAnimation(name, frameCount) {
  const frames = [];
  for (let i = 0; i <= frameCount; i++) {
    const img = new Image();
    img.src = `./assets/sprites/pirate/${name}/${name}_${i}.png`;
    frames.push(img);
  }
  return frames;
}

// Précharger toutes les animations
animations.attack = loadAnimation("attack", 4);
animations.idle   = loadAnimation("idle", 3);
animations.jump   = loadAnimation("jump", 5);
animations.run    = loadAnimation("run", 5);
animations.x      = loadAnimation("x", 3);

// Exporter pour être utilisé dans ton jeu
export default animations;
