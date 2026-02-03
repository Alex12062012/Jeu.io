/**
 * Renderer.js - Moteur de rendu du jeu avec animations sprites
 */

class Renderer {
    constructor(canvas, animations) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.camera = { x: 0, y: 0, zoom: 1 };
        this.animations = animations; // objet contenant toutes les animations

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    centerCamera(x, y) {
        this.camera.x = x - this.canvas.width / 2;
        this.camera.y = y - this.canvas.height / 2;
    }

    worldToScreen(x, y) {
        return { x: (x - this.camera.x) * this.camera.zoom, y: (y - this.camera.y) * this.camera.zoom };
    }

    screenToWorld(x, y) {
        return { x: x / this.camera.zoom + this.camera.x, y: y / this.camera.zoom + this.camera.y };
    }

    drawBackground(mapWidth, mapHeight) {
        const screenPos = this.worldToScreen(0, 0);
        const screenSize = { w: mapWidth * this.camera.zoom, h: mapHeight * this.camera.zoom };

        this.ctx.fillStyle = '#0a4d68';
        this.ctx.fillRect(screenPos.x, screenPos.y, screenSize.w, screenSize.h);

        this.ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        this.ctx.lineWidth = 1;
        const gridSize = 50;
        for (let x = 0; x < mapWidth; x += gridSize) {
            const pos = this.worldToScreen(x, 0);
            this.ctx.beginPath();
            this.ctx.moveTo(pos.x, screenPos.y);
            this.ctx.lineTo(pos.x, screenPos.y + screenSize.h);
            this.ctx.stroke();
        }
        for (let y = 0; y < mapHeight; y += gridSize) {
            const pos = this.worldToScreen(0, y);
            this.ctx.beginPath();
            this.ctx.moveTo(screenPos.x, pos.y);
            this.ctx.lineTo(screenPos.x + screenSize.w, pos.y);
            this.ctx.stroke();
        }
    }

    drawIsland(island) {
        const pos = this.worldToScreen(island.x, island.y);
        const radius = island.radius * this.camera.zoom;

        this.ctx.fillStyle = 'rgba(0,0,0,0.2)';
        this.ctx.beginPath();
        this.ctx.arc(pos.x + 5, pos.y + 5, radius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#88b04b';
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = '#f4e4c1';
        this.ctx.lineWidth = 8 * this.camera.zoom;
        this.ctx.stroke();

        this.ctx.fillStyle = '#769f3a';
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, radius * 0.6, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawSafeZone(safeZone) {
        const pos = this.worldToScreen(safeZone.x, safeZone.y);
        const radius = safeZone.radius * this.camera.zoom;

        this.ctx.strokeStyle = 'rgba(39,174,96,0.5)';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([10,5]);
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI*2);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        this.ctx.fillStyle = 'rgba(231,76,60,0.1)';
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.beginPath();
        this.ctx.arc(pos.x,pos.y,radius,0,Math.PI*2);
        this.ctx.fill();
        this.ctx.globalCompositeOperation = 'source-over';
    }

    drawEntity(entity) {
        const pos = this.worldToScreen(entity.x, entity.y);
        const radius = entity.size * this.camera.zoom;

        // Ombre
        this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
        this.ctx.beginPath();
        this.ctx.arc(pos.x + 3, pos.y + 3, radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Sprite du pirate
        if (this.animations && this.animations[entity.currentAnim]) {
            const anim = this.animations[entity.currentAnim];
            const frameIndex = Math.floor(entity.frame) % anim.length;
            const img = anim[frameIndex];
            this.ctx.drawImage(img, pos.x - radius, pos.y - radius, radius*2, radius*2);

            // Avancer la frame
            entity.frame += 0.2;
        } else {
            // fallback cercle
            this.ctx.fillStyle = entity.color;
            this.ctx.beginPath();
            this.ctx.arc(pos.x,pos.y,radius,0,Math.PI*2);
            this.ctx.fill();
        }

        // Épée
        if (entity.isAttacking) {
            const weaponLength = entity.weaponRange * this.camera.zoom;
            const endX = pos.x + Math.cos(entity.angle)*(radius+weaponLength);
            const endY = pos.y + Math.sin(entity.angle)*(radius+weaponLength);
            this.ctx.strokeStyle = '#95a5a6';
            this.ctx.lineWidth = 4*this.camera.zoom;
            this.ctx.beginPath();
            this.ctx.moveTo(pos.x,pos.y);
            this.ctx.lineTo(endX,endY);
            this.ctx.stroke();
            this.ctx.fillStyle = '#7f8c8d';
            this.ctx.beginPath();
            this.ctx.arc(endX,endY,3*this.camera.zoom,0,Math.PI*2);
            this.ctx.fill();
        }

        // Barre de vie
        if (entity.health < entity.maxHealth) {
            const barWidth = radius*2;
            const barHeight = 5*this.camera.zoom;
            const barX = pos.x - radius;
            const barY = pos.y - radius - 10*this.camera.zoom;
            this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
            this.ctx.fillRect(barX,barY,barWidth,barHeight);
            const healthPercent = entity.health / entity.maxHealth;
            this.ctx.fillStyle = healthPercent > 0.5 ? '#27ae60' : (healthPercent>0.25 ? '#f39c12' : '#e74c3c');
            this.ctx.fillRect(barX,barY,barWidth*healthPercent,barHeight);
        }

        // Nom
        this.ctx.fillStyle = 'white';
        this.ctx.font = `bold ${12*this.camera.zoom}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'bottom';
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 3;
        this.ctx.strokeText(entity.name,pos.x,pos.y-radius-15*this.camera.zoom);
        this.ctx.fillText(entity.name,pos.x,pos.y-radius-15*this.camera.zoom);
    }

    drawCoin(coin) {
        const pos = this.worldToScreen(coin.x, coin.y);
        const radius = coin.size*this.camera.zoom;
        this.ctx.fillStyle = '#f1c40f';
        this.ctx.beginPath();
        this.ctx.arc(pos.x,pos.y,radius,0,Math.PI*2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#f39c12';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.fillStyle = '#f39c12';
        this.ctx.font = `bold ${radius*1.5}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('$', pos.x, pos.y);
    }
}
