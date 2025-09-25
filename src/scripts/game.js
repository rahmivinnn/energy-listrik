import { SimCityRenderer } from './renderer.js';

// Main Game Class
export class Game {
    constructor() {
        this.currentScene = null;
        this.gameState = 'menu';
        this.score = 0;
        this.level = 1;
        this.energyKeys = 0;
        this.simCityRenderer = null;
        
        this.init();
    }
    
    async init() {
        console.log('Game initialized');
        // Initialize game systems
        this.setupEventListeners();
        
        // Initialize SimCity renderer if render target exists
        if (document.getElementById('render-target')) {
            await this.initSimCityRenderer();
        }
    }
    
    setupEventListeners() {
        // Add any global event listeners here
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.pauseGame();
            }
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        console.log('Game started');
    }
    
    pauseGame() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            console.log('Game paused');
            
            // Pause SimCity renderer if active
            if (this.simCityRenderer) {
                this.simCityRenderer.stop();
            }
        }
    }
    
    resumeGame() {
        if (this.gameState === 'paused') {
            this.gameState = 'playing';
            console.log('Game resumed');
            
            // Resume SimCity renderer if active
            if (this.simCityRenderer) {
                this.simCityRenderer.start();
            }
        }
    }
    
    endGame() {
        this.gameState = 'ended';
        console.log('Game ended');
    }
    
    loadScene(sceneName) {
        this.currentScene = sceneName;
        console.log(`Loading scene: ${sceneName}`);
    }
    
    updateScore(points) {
        this.score += points;
        console.log(`Score updated: ${this.score}`);
    }
    
    addEnergyKey() {
        this.energyKeys++;
        console.log(`Energy keys: ${this.energyKeys}`);
    }
    
    nextLevel() {
        this.level++;
        console.log(`Level up: ${this.level}`);
    }
    
    /**
     * Initialize SimCity Three.js renderer
     */
    async initSimCityRenderer() {
        try {
            this.simCityRenderer = new SimCityRenderer();
            console.log('SimCity renderer integrated with game');
        } catch (error) {
            console.error('Failed to initialize SimCity renderer:', error);
        }
    }
    
    /**
     * Get the SimCity renderer instance
     */
    getSimCityRenderer() {
        return this.simCityRenderer;
    }
    
    /**
     * Get the current city from SimCity renderer
     */
    getCity() {
        return this.simCityRenderer?.getCity();
    }
    
    /**
     * Dispose of game resources
     */
    dispose() {
        if (this.simCityRenderer) {
            this.simCityRenderer.dispose();
            this.simCityRenderer = null;
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});

// Export for use in other modules
export default Game;