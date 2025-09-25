// Main Menu JavaScript
// Handles menu interactions and audio

class MainMenu {
    constructor() {
        this.menuMusic = null;
        this.init();
    }

    init() {
        this.setupAudio();
        this.setupEventListeners();
        this.addHoverEffects();
    }

    setupAudio() {
        this.menuMusic = document.getElementById('menu-music');
        if (this.menuMusic) {
            this.menuMusic.volume = 0.3;
            this.menuMusic.loop = true;
            
            // Auto-play music when page loads
            document.addEventListener('click', () => {
                if (this.menuMusic.paused) {
                    this.menuMusic.play().catch(e => console.log('Audio play failed:', e));
                }
            }, { once: true });
        }
    }

    setupEventListeners() {
        // Tutorial button
        const tutorialBtn = document.getElementById('tutorial-btn');
        if (tutorialBtn) {
            tutorialBtn.addEventListener('click', () => this.showTutorial());
        }

        // Credits button
        const creditsBtn = document.getElementById('credits-btn');
        if (creditsBtn) {
            creditsBtn.addEventListener('click', () => this.showCredits());
        }

        // Close modal buttons
        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }

    addHoverEffects() {
        const buttons = document.querySelectorAll('.unity-btn, .header-btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                this.playHoverSound();
            });

            btn.addEventListener('click', () => {
                this.playClickSound();
            });
        });
    }

    showTutorial() {
        const modal = document.getElementById('tutorial-modal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    showCredits() {
        const modal = document.getElementById('credits-modal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    playHoverSound() {
        // Create a subtle hover sound effect
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    playClickSound() {
        // Create a click sound effect
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

// Initialize main menu when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MainMenu();
});

// Global function for scene loading (called by buttons)
window.loadScene = function(sceneName) {
    if (window.SceneManager) {
        window.SceneManager.loadScene(sceneName);
    } else {
        console.error('SceneManager not found');
    }
};