class MainMenu {
    constructor() {
        this.container = null;
        this.isFirstTime = true;
        this.currentState = 'MainMenu';
        this.audioContext = null;
        this.sounds = {
            hover: null,
            click: null
        };
        this.settings = {
            sound: true,
            music: true,
            subtitle: true,
            textSize: 'medium'
        };
        this.init();
    }

    init() {
        this.container = document.getElementById('main-menu-container');
        this.setupEventListeners();
        this.loadSettings();
        this.initAudio();
        this.updateFSMDisplay();
    }

    initAudio() {
        // Initialize Web Audio API for sound effects
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    playSound(type) {
        if (!this.settings.sound || !this.audioContext) return;
        
        // Create simple beep sounds since we don't have actual audio files
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        if (type === 'hover') {
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        } else if (type === 'click') {
            oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.2);
        }
    }

    setupEventListeners() {
        // Menu item interactions
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.playSound('hover');
            });

            item.addEventListener('click', (e) => {
                this.playSound('click');
                this.handleMenuClick(e.target.closest('.menu-item').dataset.action);
            });
        });

        // Settings modal
        const settingsModal = document.getElementById('settings-modal');
        const closeSettings = document.getElementById('close-settings');
        
        closeSettings.addEventListener('click', () => {
            this.closeSettingsModal();
        });

        // Click outside modal to close
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                this.closeSettingsModal();
            }
        });

        // Settings toggles
        document.getElementById('sound-toggle').addEventListener('change', (e) => {
            this.settings.sound = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('music-toggle').addEventListener('change', (e) => {
            this.settings.music = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('subtitle-toggle').addEventListener('change', (e) => {
            this.settings.subtitle = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('text-size-select').addEventListener('change', (e) => {
            this.settings.textSize = e.target.value;
            this.applyTextSize();
            this.saveSettings();
        });

        // First time tooltip click handler
        document.addEventListener('click', () => {
            if (this.isFirstTime) {
                this.hideTooltip();
            }
        });
    }

    handleMenuClick(action) {
        // Add button press animation
        const menuItem = document.querySelector(`[data-action="${action}"]`);
        menuItem.style.transform = 'scale(0.95)';
        setTimeout(() => {
            menuItem.style.transform = '';
        }, 150);

        switch (action) {
            case 'start-game':
                this.startGame();
                break;
            case 'continue':
                this.continueGame();
                break;
            case 'settings':
                this.openSettingsModal();
                break;
            case 'about':
                this.showAbout();
                break;
        }
    }

    startGame() {
        this.hideTooltip();
        
        // Use gameState FSM to transition to living room
        if (window.gameState) {
            window.gameState.transitionTo('Level1_LivingRoom');
        } else {
            // Fallback if gameState not available
            if (!window.livingRoomScene) {
                window.livingRoomScene = new LivingRoomScene();
            }
            window.livingRoomScene.show();
        }
    }

    continueGame() {
        console.log('Continue game functionality not implemented yet');
    }

    openSettingsModal() {
        const modal = document.getElementById('settings-modal');
        modal.style.display = 'flex';
        
        // Update toggle states
        document.getElementById('sound-toggle').checked = this.settings.sound;
        document.getElementById('music-toggle').checked = this.settings.music;
        document.getElementById('subtitle-toggle').checked = this.settings.subtitle;
        document.getElementById('text-size-select').value = this.settings.textSize;
    }

    closeSettingsModal() {
        const modal = document.getElementById('settings-modal');
        modal.style.display = 'none';
    }

    showAbout() {
        alert('Energy Quest - Game Edukasi Penghematan Energi\n\nDikembangkan untuk meningkatkan kesadaran tentang pentingnya menghemat energi.');
    }

    hideTooltip() {
        const tooltip = document.getElementById('first-time-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                tooltip.style.display = 'none';
            }, 300);
        }
        this.isFirstTime = false;
    }

    updateFSMState(newState) {
        this.currentState = newState;
        this.updateFSMDisplay();
    }

    updateFSMDisplay() {
        const stateDisplay = document.getElementById('current-state');
        if (stateDisplay) {
            stateDisplay.textContent = this.currentState;
        }
    }

    applyTextSize() {
        const root = document.documentElement;
        switch (this.settings.textSize) {
            case 'small':
                root.style.setProperty('--text-scale', '0.9');
                break;
            case 'medium':
                root.style.setProperty('--text-scale', '1.0');
                break;
            case 'large':
                root.style.setProperty('--text-scale', '1.1');
                break;
        }
    }

    loadSettings() {
        const saved = localStorage.getItem('energyQuestSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
            this.applyTextSize();
        }
    }

    saveSettings() {
        localStorage.setItem('energyQuestSettings', JSON.stringify(this.settings));
    }

    show() {
        if (this.container) {
            this.container.style.display = 'block';
            
            // Show tooltip on first time
            if (this.isFirstTime) {
                const tooltip = document.getElementById('first-time-tooltip');
                if (tooltip) {
                    tooltip.style.display = 'block';
                    tooltip.style.opacity = '1';
                }
            }
        }
    }

    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }

    updateKeysCount(count) {
        const keysCount = document.querySelector('.keys-count');
        if (keysCount) {
            keysCount.textContent = `${count}/3`;
        }
    }
}

// Export for use in other modules
window.MainMenu = MainMenu;

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.mainMenu = new MainMenu();
    });
} else {
    window.mainMenu = new MainMenu();
}