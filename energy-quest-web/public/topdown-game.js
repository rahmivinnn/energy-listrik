// Energy Quest - Top Down Game
// A real, playable top-down adventure game

class TopDownGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Game state
        this.gameState = 'start'; // start, playing, paused, gameOver, levelComplete
        this.score = 0;
        this.energy = 0;
        this.maxEnergy = 100;
        this.level = 1;
        this.timeLeft = 60;
        this.gameSpeed = 1;
        
        // Player
        this.player = {
            x: this.width / 2,
            y: this.height / 2,
            size: 20,
            speed: 3,
            color: '#00ff88',
            dashCooldown: 0,
            dashDuration: 0,
            invulnerable: 0
        };
        
        // Game objects
        this.energyItems = [];
        this.wasteItems = [];
        this.particles = [];
        this.powerUps = [];
        
        // Input handling
        this.keys = {};
        this.lastTime = 0;
        
        // Game settings
        this.spawnRate = 0.02;
        this.wasteSpawnRate = 0.01;
        this.powerUpSpawnRate = 0.005;
        
        // Level progression - Integrated with main game
        this.levelTargets = {
            1: { energy: 50, time: 60 } // Level 4 of main game
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.gameLoop();
        this.showMessage('Tekan SPACE untuk dash!', 'info', 3000);
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            if (e.code === 'Escape') {
                this.togglePause();
            }
            
            if (e.code === 'Space' && this.gameState === 'playing') {
                this.playerDash();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Button events
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartGame();
        });
        
        document.getElementById('menu-btn').addEventListener('click', () => {
            this.goToMainGame();
        });
        
        document.getElementById('pause-menu-btn').addEventListener('click', () => {
            this.goToMainGame();
        });
        
        document.getElementById('back-to-menu-btn').addEventListener('click', () => {
            this.goToMainGame();
        });
        
        document.getElementById('resume-btn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('next-level-btn').addEventListener('click', () => {
            this.goToMainGame(); // Return to main game after completing level 4
        });
        
        document.getElementById('back-to-main-btn').addEventListener('click', () => {
            this.goToMainGame();
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.energy = 0;
        this.level = 1;
        this.timeLeft = this.levelTargets[this.level].time;
        this.player.x = this.width / 2;
        this.player.y = this.height / 2;
        this.energyItems = [];
        this.wasteItems = [];
        this.particles = [];
        this.powerUps = [];
        
        document.getElementById('start-screen').classList.add('hidden');
        this.startGameTimer();
        this.showMessage('Kumpulkan energi hijau!', 'success', 2000);
    }
    
    restartGame() {
        this.startGame();
        document.getElementById('game-over-screen').classList.add('hidden');
    }
    
    goToMainGame() {
        // Return to main game menu
        window.location.href = '../index.html';
    }
    
    goToMenu() {
        this.gameState = 'start';
        document.getElementById('start-screen').classList.remove('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
        document.getElementById('pause-screen').classList.add('hidden');
        document.getElementById('level-complete-screen').classList.add('hidden');
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pause-screen').classList.remove('hidden');
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pause-screen').classList.add('hidden');
        }
    }
    
    nextLevel() {
        this.level++;
        this.timeLeft = this.levelTargets[this.level].time;
        this.energy = 0;
        this.energyItems = [];
        this.wasteItems = [];
        this.particles = [];
        this.powerUps = [];
        this.gameSpeed = Math.min(1 + (this.level - 1) * 0.2, 2);
        
        document.getElementById('level-complete-screen').classList.add('hidden');
        this.startGameTimer();
        this.showMessage(`Level ${this.level}!`, 'success', 2000);
    }
    
    startGameTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }
        
        this.gameTimer = setInterval(() => {
            if (this.gameState === 'playing') {
                this.timeLeft--;
                this.updateUI();
                
                if (this.timeLeft <= 0) {
                    this.checkLevelComplete();
                }
            }
        }, 1000);
    }
    
    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        if (this.gameState === 'playing') {
            this.update(deltaTime);
        }
        
        this.render();
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        this.updatePlayer(deltaTime);
        this.updateObjects(deltaTime);
        this.updateParticles(deltaTime);
        this.spawnObjects();
        this.checkCollisions();
        this.updateUI();
    }
    
    updatePlayer(deltaTime) {
        // Movement
        let dx = 0;
        let dy = 0;
        
        if (this.keys['KeyW'] || this.keys['ArrowUp']) dy -= 1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) dy += 1;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) dx -= 1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) dx += 1;
        
        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }
        
        // Apply movement
        const speed = this.player.speed * this.gameSpeed;
        this.player.x += dx * speed;
        this.player.y += dy * speed;
        
        // Keep player in bounds
        this.player.x = Math.max(this.player.size, Math.min(this.width - this.player.size, this.player.x));
        this.player.y = Math.max(this.player.size, Math.min(this.height - this.player.size, this.player.y));
        
        // Update cooldowns
        if (this.player.dashCooldown > 0) this.player.dashCooldown--;
        if (this.player.dashDuration > 0) this.player.dashDuration--;
        if (this.player.invulnerable > 0) this.player.invulnerable--;
    }
    
    playerDash() {
        if (this.player.dashCooldown <= 0 && this.energy >= 10) {
            this.player.dashDuration = 10;
            this.player.dashCooldown = 60;
            this.energy -= 10;
            
            // Add dash particles
            for (let i = 0; i < 8; i++) {
                this.particles.push({
                    x: this.player.x,
                    y: this.player.y,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    life: 20,
                    color: '#00ff88',
                    size: 3
                });
            }
            
            this.showMessage('DASH!', 'success', 1000);
        }
    }
    
    updateObjects(deltaTime) {
        // Update energy items
        this.energyItems.forEach((item, index) => {
            item.rotation += 0.1;
            item.pulse += 0.2;
            
            if (item.life <= 0) {
                this.energyItems.splice(index, 1);
            } else {
                item.life--;
            }
        });
        
        // Update waste items
        this.wasteItems.forEach((item, index) => {
            item.rotation += 0.05;
            item.y += item.speed * this.gameSpeed;
            
            if (item.y > this.height + item.size) {
                this.wasteItems.splice(index, 1);
            }
        });
        
        // Update power-ups
        this.powerUps.forEach((item, index) => {
            item.rotation += 0.08;
            item.pulse += 0.15;
            
            if (item.life <= 0) {
                this.powerUps.splice(index, 1);
            } else {
                item.life--;
            }
        });
    }
    
    updateParticles(deltaTime) {
        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            particle.vy += 0.1; // gravity
            
            if (particle.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
    }
    
    spawnObjects() {
        // Spawn energy items
        if (Math.random() < this.spawnRate * this.gameSpeed) {
            this.spawnEnergyItem();
        }
        
        // Spawn waste items
        if (Math.random() < this.wasteSpawnRate * this.gameSpeed) {
            this.spawnWasteItem();
        }
        
        // Spawn power-ups
        if (Math.random() < this.powerUpSpawnRate * this.gameSpeed) {
            this.spawnPowerUp();
        }
    }
    
    spawnEnergyItem() {
        this.energyItems.push({
            x: Math.random() * (this.width - 40) + 20,
            y: Math.random() * (this.height - 40) + 20,
            size: 15,
            rotation: 0,
            pulse: 0,
            life: 300,
            type: 'energy'
        });
    }
    
    spawnWasteItem() {
        this.wasteItems.push({
            x: Math.random() * this.width,
            y: -20,
            size: 20,
            rotation: 0,
            speed: 1 + Math.random() * 2,
            type: 'waste'
        });
    }
    
    spawnPowerUp() {
        const powerUpTypes = ['speed', 'energy', 'time', 'shield'];
        const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        
        this.powerUps.push({
            x: Math.random() * (this.width - 40) + 20,
            y: Math.random() * (this.height - 40) + 20,
            size: 18,
            rotation: 0,
            pulse: 0,
            life: 600,
            type: type
        });
    }
    
    checkCollisions() {
        // Check energy item collisions
        this.energyItems.forEach((item, index) => {
            if (this.checkCollision(this.player, item)) {
                this.collectEnergyItem(item, index);
            }
        });
        
        // Check waste item collisions
        this.wasteItems.forEach((item, index) => {
            if (this.checkCollision(this.player, item) && this.player.invulnerable <= 0) {
                this.hitWasteItem(item, index);
            }
        });
        
        // Check power-up collisions
        this.powerUps.forEach((item, index) => {
            if (this.checkCollision(this.player, item)) {
                this.collectPowerUp(item, index);
            }
        });
    }
    
    checkCollision(obj1, obj2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (obj1.size + obj2.size) / 2;
    }
    
    collectEnergyItem(item, index) {
        this.energyItems.splice(index, 1);
        this.energy = Math.min(this.maxEnergy, this.energy + 5);
        this.score += 10;
        
        // Add collection particles
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: item.x,
                y: item.y,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                life: 30,
                color: '#00ff88',
                size: 2
            });
        }
        
        this.showMessage('+5 Energi!', 'success', 1000);
    }
    
    hitWasteItem(item, index) {
        this.wasteItems.splice(index, 1);
        this.energy = Math.max(0, this.energy - 10);
        this.player.invulnerable = 60;
        
        // Add hit particles
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: item.x,
                y: item.y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 25,
                color: '#ff4444',
                size: 3
            });
        }
        
        this.showMessage('-10 Energi!', 'error', 1500);
    }
    
    collectPowerUp(item, index) {
        this.powerUps.splice(index, 1);
        this.score += 25;
        
        // Apply power-up effect
        switch (item.type) {
            case 'speed':
                this.player.speed = Math.min(5, this.player.speed + 0.5);
                this.showMessage('Speed Boost!', 'success', 2000);
                break;
            case 'energy':
                this.energy = Math.min(this.maxEnergy, this.energy + 20);
                this.showMessage('+20 Energi!', 'success', 2000);
                break;
            case 'time':
                this.timeLeft += 10;
                this.showMessage('+10 Detik!', 'success', 2000);
                break;
            case 'shield':
                this.player.invulnerable = 180;
                this.showMessage('Shield!', 'success', 2000);
                break;
        }
        
        // Add collection particles
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: item.x,
                y: item.y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 40,
                color: '#00ccff',
                size: 3
            });
        }
    }
    
    checkLevelComplete() {
        const target = this.levelTargets[this.level];
        if (this.energy >= target.energy) {
            this.completeLevel();
        } else {
            this.gameOver();
        }
    }
    
    completeLevel() {
        this.gameState = 'levelComplete';
        clearInterval(this.gameTimer);
        
        const levelScore = this.energy * 10 + this.timeLeft * 5;
        this.score += levelScore;
        
        document.getElementById('level-score').textContent = levelScore;
        document.getElementById('level-energy').textContent = this.energy;
        document.getElementById('time-bonus').textContent = this.timeLeft;
        
        document.getElementById('level-complete-screen').classList.remove('hidden');
        
        // Show success message for main game integration
        this.showMessage('Kunci Energi 4 Didapat! Akses ke Ruang Rahasia terbuka!', 'success', 5000);
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        clearInterval(this.gameTimer);
        
        document.getElementById('final-score-value').textContent = this.score;
        document.getElementById('final-level').textContent = this.level;
        document.getElementById('final-energy').textContent = this.energy;
        
        document.getElementById('game-over-screen').classList.remove('hidden');
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('energy').textContent = this.energy;
        document.getElementById('level').textContent = this.level;
        document.getElementById('time').textContent = this.timeLeft;
        
        const energyPercent = (this.energy / this.maxEnergy) * 100;
        document.getElementById('energy-fill').style.width = energyPercent + '%';
        document.getElementById('energy-text').textContent = `${this.energy}/${this.maxEnergy}`;
    }
    
    showMessage(text, type, duration) {
        const messageEl = document.getElementById('message');
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
        messageEl.classList.remove('hidden');
        
        setTimeout(() => {
            messageEl.classList.add('hidden');
        }, duration);
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw objects
        this.drawEnergyItems();
        this.drawWasteItems();
        this.drawPowerUps();
        this.drawParticles();
        this.drawPlayer();
        
        // Draw UI overlay
        this.drawUIOverlay();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x < this.width; x += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.height; y += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }
    
    drawPlayer() {
        this.ctx.save();
        this.ctx.translate(this.player.x, this.player.y);
        
        // Player body
        this.ctx.fillStyle = this.player.color;
        if (this.player.invulnerable > 0) {
            this.ctx.fillStyle = this.player.invulnerable % 10 < 5 ? '#ff4444' : this.player.color;
        }
        
        // Dash effect
        if (this.player.dashDuration > 0) {
            this.ctx.shadowColor = '#00ff88';
            this.ctx.shadowBlur = 20;
        }
        
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.player.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Player direction indicator
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(0, -this.player.size / 3, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawEnergyItems() {
        this.energyItems.forEach(item => {
            this.ctx.save();
            this.ctx.translate(item.x, item.y);
            this.ctx.rotate(item.rotation);
            
            const pulse = Math.sin(item.pulse) * 0.2 + 1;
            const size = item.size * pulse;
            
            // Glow effect
            this.ctx.shadowColor = '#00ff88';
            this.ctx.shadowBlur = 15;
            
            this.ctx.fillStyle = '#00ff88';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Inner core
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, size / 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    drawWasteItems() {
        this.wasteItems.forEach(item => {
            this.ctx.save();
            this.ctx.translate(item.x, item.y);
            this.ctx.rotate(item.rotation);
            
            // Glow effect
            this.ctx.shadowColor = '#ff4444';
            this.ctx.shadowBlur = 10;
            
            this.ctx.fillStyle = '#ff4444';
            this.ctx.fillRect(-item.size / 2, -item.size / 2, item.size, item.size);
            
            // Inner pattern
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = '#ff6666';
            this.ctx.fillRect(-item.size / 4, -item.size / 4, item.size / 2, item.size / 2);
            
            this.ctx.restore();
        });
    }
    
    drawPowerUps() {
        this.powerUps.forEach(item => {
            this.ctx.save();
            this.ctx.translate(item.x, item.y);
            this.ctx.rotate(item.rotation);
            
            const pulse = Math.sin(item.pulse) * 0.3 + 1;
            const size = item.size * pulse;
            
            // Glow effect
            this.ctx.shadowColor = '#00ccff';
            this.ctx.shadowBlur = 20;
            
            this.ctx.fillStyle = '#00ccff';
            this.ctx.beginPath();
            this.ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Symbol
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = `${size / 2}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            let symbol = '?';
            switch (item.type) {
                case 'speed': symbol = '⚡'; break;
                case 'energy': symbol = '⚡'; break;
                case 'time': symbol = '⏰'; break;
                case 'shield': symbol = '🛡️'; break;
            }
            
            this.ctx.fillText(symbol, 0, 0);
            
            this.ctx.restore();
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life / 30;
            this.ctx.fillStyle = particle.color;
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = 5;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    drawUIOverlay() {
        // Draw energy bar outline
        this.ctx.strokeStyle = '#00ff88';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(20, this.height - 40, 200, 20);
        
        // Draw time bar
        const timePercent = this.timeLeft / this.levelTargets[this.level].time;
        this.ctx.fillStyle = timePercent > 0.3 ? '#00ff88' : '#ff4444';
        this.ctx.fillRect(20, this.height - 40, 200 * timePercent, 20);
        
        // Draw level progress
        const energyPercent = this.energy / this.levelTargets[this.level].energy;
        this.ctx.fillStyle = '#00ccff';
        this.ctx.fillRect(20, this.height - 60, 200 * energyPercent, 15);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new TopDownGame();
});

// Prevent context menu on canvas
document.getElementById('game-canvas').addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.game) {
        // Adjust canvas size if needed
        const canvas = document.getElementById('game-canvas');
        const container = document.getElementById('game-container');
        const rect = container.getBoundingClientRect();
        
        // Maintain aspect ratio
        const aspectRatio = 800 / 600;
        let newWidth = Math.min(800, rect.width - 40);
        let newHeight = newWidth / aspectRatio;
        
        if (newHeight > rect.height - 40) {
            newHeight = rect.height - 40;
            newWidth = newHeight * aspectRatio;
        }
        
        canvas.style.width = newWidth + 'px';
        canvas.style.height = newHeight + 'px';
    }
});