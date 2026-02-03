/**
 * InputManager.js - Gestion des entrées clavier et souris
 */

class InputManager {
    constructor() {
        this.keys = {};
        this.mouse = {
            x: 0,
            y: 0,
            isDown: false,
            button: null
        };
        
        this.canvas = null;
        this.init();
    }

    /**
     * Initialise les écouteurs d'événements
     */
    init() {
        // Clavier
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Souris
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        
        // Désactiver le menu contextuel
        window.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    /**
     * Définit le canvas pour calculer les positions relatives
     */
    setCanvas(canvas) {
        this.canvas = canvas;
    }

    /**
     * Gère l'appui sur une touche
     */
    handleKeyDown(e) {
        this.keys[e.key.toLowerCase()] = true;
        this.keys[e.code] = true;
        
        // Empêcher le scroll avec les flèches
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
            e.preventDefault();
        }
    }

    /**
     * Gère le relâchement d'une touche
     */
    handleKeyUp(e) {
        this.keys[e.key.toLowerCase()] = false;
        this.keys[e.code] = false;
    }

    /**
     * Gère le mouvement de la souris
     */
    handleMouseMove(e) {
        if (this.canvas) {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        }
    }

    /**
     * Gère le clic de souris
     */
    handleMouseDown(e) {
        this.mouse.isDown = true;
        this.mouse.button = e.button;
    }

    /**
     * Gère le relâchement de la souris
     */
    handleMouseUp(e) {
        this.mouse.isDown = false;
        this.mouse.button = null;
    }

    /**
     * Vérifie si une touche est enfoncée
     */
    isKeyDown(key) {
        return this.keys[key.toLowerCase()] || this.keys[key] || false;
    }

    /**
     * Vérifie si la souris est cliquée
     */
    isMouseDown() {
        return this.mouse.isDown;
    }

    /**
     * Récupère la position de la souris
     */
    getMousePosition() {
        return { x: this.mouse.x, y: this.mouse.y };
    }

    /**
     * Vérifie les touches de déplacement (ZQSD + Flèches)
     */
    getMovementInput() {
        const input = {
            up: this.isKeyDown('z') || this.isKeyDown('w') || this.isKeyDown('ArrowUp'),
            down: this.isKeyDown('s') || this.isKeyDown('ArrowDown'),
            left: this.isKeyDown('q') || this.isKeyDown('a') || this.isKeyDown('ArrowLeft'),
            right: this.isKeyDown('d') || this.isKeyDown('ArrowRight'),
            dash: this.isKeyDown('Space') || this.isKeyDown(' ')
        };
        
        return input;
    }

    /**
     * Réinitialise les inputs
     */
    reset() {
        this.keys = {};
        this.mouse.isDown = false;
    }
}
