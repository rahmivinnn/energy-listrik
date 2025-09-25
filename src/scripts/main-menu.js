// Main Menu JavaScript
class MainMenu {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAudio();
        this.setupVideoEvents();
        this.animateButtons();
        
        // Start background music
        setTimeout(() => {
            this.startBackgroundMusic();
        }, 1000);
        
        console.log('Main Menu initialized');
    }

    setupEventListeners() {
        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Button hover sound effects
        const buttons = document.querySelectorAll('.menu-btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.playHoverSound();
            });
            
            button.addEventListener('click', () => {
                this.playClickSound();
            });
        });
    }

    setupAudio() {
        this.menuAudio = document.getElementById('menu-audio');
        this.hoverSound = new Audio();
        this.clickSound = new Audio();
        
        // Set volume levels
        if (this.menuAudio) {
            this.menuAudio.volume = 0.3;
        }
        
        // Setup dramatic sound for video
        this.dramaticSound = new Audio('public/audio/dramatic_sound.mp3');
        this.dramaticSound.volume = 0.4;
    }
    
    setupVideoEvents() {
        const backgroundVideo = document.querySelector('#background-video video');
        if (backgroundVideo) {
            // Play dramatic sound when video starts
            backgroundVideo.addEventListener('play', () => {
                this.playDramaticSound();
            });
            
            // Play dramatic sound when video loops
            backgroundVideo.addEventListener('ended', () => {
                setTimeout(() => {
                    this.playDramaticSound();
                }, 500);
            });
        }
    }
    
    playDramaticSound() {
        if (this.dramaticSound) {
            this.dramaticSound.currentTime = 0;
            this.dramaticSound.play().catch(e => {
                console.log('Dramatic sound play failed:', e);
            });
        }
        this.hoverSound.volume = 0.2;
        this.clickSound.volume = 0.4;
    }

    playHoverSound() {
        // Simple beep sound using Web Audio API
        try {
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
        } catch (e) {
            console.log('Audio context not available');
        }
    }

    playClickSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
            console.log('Audio context not available');
        }
    }

    animateButtons() {
        const buttons = document.querySelectorAll('.menu-btn');
        buttons.forEach((button, index) => {
            button.style.animationDelay = `${0.1 * index}s`;
            button.style.animation = 'fadeInUp 0.6s ease-out both';
        });
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }

    navigateToLevel(levelUrl) {
        // Add transition effect
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '0';
        
        setTimeout(() => {
            window.location.href = levelUrl;
        }, 500);
    }

    startBackgroundMusic() {
        if (this.menuAudio) {
            this.menuAudio.play().catch(e => {
                console.log('Background music autoplay prevented');
            });
        }
    }

    stopBackgroundMusic() {
        if (this.menuAudio) {
            this.menuAudio.pause();
        }
    }
}

// Global functions for HTML onclick events
function navigateToLevel(levelUrl) {
    if (window.mainMenu) {
        window.mainMenu.navigateToLevel(levelUrl);
    } else {
        window.location.href = levelUrl;
    }
}

function showInstructions() {
    if (window.mainMenu) {
        window.mainMenu.showModal('instructions-modal');
    }
}

function showCredits() {
    if (window.mainMenu) {
        window.mainMenu.showModal('credits-modal');
    }
}

function closeModal(modalId) {
    if (window.mainMenu) {
        window.mainMenu.closeModal(modalId);
    }
}

function loadQuiz() {
    // Stop background music
    if (window.mainMenu) {
        window.mainMenu.stopBackgroundMusic();
    }
    
    // Navigate to quiz page
    window.location.href = 'quiz.html';
}

function loadGame2D() {
    // Stop background music
    if (window.mainMenu) {
        window.mainMenu.stopBackgroundMusic();
    }
    
    // Navigate to 2D game page
    window.location.href = 'public/game-2d.html';
}

function loadMainGame() {
    // Stop background music
    if (window.mainMenu) {
        window.mainMenu.stopBackgroundMusic();
    }
    
    // Navigate to main game page
    window.location.href = 'main-game.html';
}

function loadQuiz() {
    // Stop background music
    if (window.mainMenu) {
        window.mainMenu.stopBackgroundMusic();
    }
    
    // Navigate to quiz page
    window.location.href = 'quiz.html';
}

function loadEnergyGame() {
    // Stop background music
    if (window.mainMenu) {
        window.mainMenu.stopBackgroundMusic();
    }
    
    // Navigate to energy game zones page
    window.location.href = 'energy-game-zones.html';
}

function loadExperiments() {
    console.log('Loading Energy Experiments...');
    
    // Add loading effect
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '0.3';
    
    setTimeout(() => {
        window.location.href = 'energy-experiments.html';
    }, 500);
}

function loadSimCity() {
    console.log('Loading SimCity 3D Game...');
    
    // Stop background music
    if (window.mainMenu) {
        window.mainMenu.stopBackgroundMusic();
    }
    
    // Add loading effect
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '0.3';
    
    setTimeout(() => {
        window.location.href = 'simcity.html';
    }, 500);
}

// Check if quiz is completed and show energy game button
function checkQuizCompletion() {
    const quizCompleted = localStorage.getItem('quizCompleted');
    const energyGameBtn = document.getElementById('energy-game-btn');
    const experimentsBtn = document.getElementById('experiments-btn');
    
    if (quizCompleted === 'true') {
        if (energyGameBtn) {
            energyGameBtn.style.display = 'block';
            
            // Add unlock animation
            setTimeout(() => {
                energyGameBtn.style.animation = 'unlockAnimation 1s ease-out';
            }, 500);
        }
        
        if (experimentsBtn) {
            experimentsBtn.style.display = 'block';
            
            // Add unlock animation
            setTimeout(() => {
                experimentsBtn.style.animation = 'unlockAnimation 1s ease-out';
            }, 500);
        }
    }
}

// Add unlock animation CSS
function addUnlockAnimationCSS() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes unlockAnimation {
            0% {
                transform: scale(0.8);
                opacity: 0;
            }
            50% {
                transform: scale(1.1);
                opacity: 0.8;
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }
        
        .energy-game-btn {
            position: relative;
        }
        
        .energy-game-btn::before {
            content: '🔓';
            position: absolute;
            top: -10px;
            right: -10px;
            font-size: 1.5em;
            animation: sparkle 2s infinite;
        }
        
        @keyframes sparkle {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.2); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mainMenu = new MainMenu();
    
    // Hide puzzle-game-container to prevent it from showing on main menu
    const puzzleContainer = document.getElementById('puzzle-game-container');
    if (puzzleContainer) {
        puzzleContainer.style.display = 'none';
    }
    
    // Add unlock animation CSS
    addUnlockAnimationCSS();
    
    // Check quiz completion status
    checkQuizCompletion();
    
    // Start background music after user interaction
    document.addEventListener('click', () => {
        window.mainMenu.startBackgroundMusic();
    }, { once: true });
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (window.mainMenu) {
        if (document.hidden) {
            window.mainMenu.stopBackgroundMusic();
        } else {
            window.mainMenu.startBackgroundMusic();
        }
    }
});

function loadSplashScreen() {
    console.log('Loading Splash Screen...');
    
    // Stop background music
    if (window.mainMenu) {
        window.mainMenu.stopBackgroundMusic();
    }
    
    // Add loading effect
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '0.3';
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// MainMenu class is available globally as window.mainMenu