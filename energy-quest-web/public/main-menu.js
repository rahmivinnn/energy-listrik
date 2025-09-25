// Main Menu Controller
export class MainMenuController {
    constructor() {
        this.backgroundMusic = null;
        this.isMusicPlaying = false;
        this.init();
    }

    init() {
        console.log('MainMenuController initialized');
        this.setupEventListeners();
        this.startBackgroundMusic();
    }

    setupEventListeners() {
        // Add any event listeners here
        console.log('Event listeners setup');
    }

    startBackgroundMusic() {
        try {
            if (window.audioManager) {
                this.backgroundMusic = window.audioManager.playBackgroundMusic();
                this.isMusicPlaying = true;
                console.log('Background music started');
            }
        } catch (error) {
            console.error('Error starting background music:', error);
        }
    }

    stopBackgroundMusic() {
        try {
            if (this.backgroundMusic && window.audioManager) {
                window.audioManager.stopBackgroundMusic();
                this.isMusicPlaying = false;
                console.log('Background music stopped');
            }
        } catch (error) {
            console.error('Error stopping background music:', error);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mainMenu = new MainMenuController();
});

// Global functions for navigation
function loadMainGame() {
    if (window.mainMenu) {
        window.mainMenu.stopBackgroundMusic();
    }
    window.location.href = 'public/energy-game.html';
}

function loadExperiments() {
    if (window.mainMenu) {
        window.mainMenu.stopBackgroundMusic();
    }
    window.location.href = 'public/energy-experiments.html';
}

function loadQuiz() {
    if (window.mainMenu) {
        window.mainMenu.stopBackgroundMusic();
    }
    window.location.href = 'public/quiz.html';
}

function loadZones() {
    if (window.mainMenu) {
        window.mainMenu.stopBackgroundMusic();
    }
    window.location.href = 'public/energy-game-zones.html';
}
