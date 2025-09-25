// Global Audio Manager
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.isMuted = localStorage.getItem('audioMuted') === 'true';
        this.volume = parseFloat(localStorage.getItem('audioVolume')) || 0.3;
        this.sounds = {};
        this.backgroundMusic = null;
        
        this.init();
    }

    init() {
        this.initAudioContext();
        this.createMuteButton();
        this.setupEventListeners();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createBackgroundMusic();
        } catch (e) {
            console.log('Web Audio API not supported:', e);
        }
    }

    createBackgroundMusic() {
        // Create background music using actual audio file
        this.backgroundMusic = new Audio('sound.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = this.isMuted ? 0 : this.volume;
        
        // Preload the audio
        this.backgroundMusic.preload = 'auto';
    }

    setupEventListeners() {
        // Auto-play when user interacts with page
        document.addEventListener('click', () => {
            this.play();
        }, { once: true });
    }

    createMuteButton() {
        const muteButton = document.createElement('button');
        muteButton.id = 'global-mute-btn';
        muteButton.innerHTML = this.getMuteIcon();
        muteButton.className = 'mute-button';
        muteButton.onclick = () => this.toggleMute();
        
        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .mute-button {
                position: fixed;
                top: 20px;
                left: 20px;
                width: 50px;
                height: 50px;
                border: none;
                border-radius: 50%;
                background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(240, 240, 240, 0.8));
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                color: #333;
                transition: all 0.3s ease;
                z-index: 1002;
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255, 255, 255, 0.3);
            }
            
            .mute-button:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
                background: linear-gradient(145deg, rgba(255, 255, 255, 1), rgba(245, 245, 245, 0.9));
            }
            
            .mute-button:active {
                transform: scale(0.95);
            }
            
            .mute-button.muted {
                background: linear-gradient(145deg, rgba(255, 100, 100, 0.9), rgba(200, 80, 80, 0.8));
                color: white;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(muteButton);
    }

    getMuteIcon() {
        if (this.isMuted) {
            return `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>`;
        } else {
            return `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>`;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.isMuted ? 0 : this.volume;
        }
        
        const button = document.getElementById('global-mute-btn');
        button.innerHTML = this.getMuteIcon();
        button.classList.toggle('muted', this.isMuted);
        
        // Save state
        localStorage.setItem('audioMuted', this.isMuted.toString());
        
        if (!this.isMuted) {
            this.play();
        }
    }

    loadMuteState() {
        const button = document.getElementById('global-mute-btn');
        if (button) {
            button.classList.toggle('muted', this.isMuted);
        }
    }

    play() {
        if (this.backgroundMusic && !this.isMuted) {
            this.backgroundMusic.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    playMusic() {
        this.play();
    }

    stopMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }

    // Sound effect methods
    playDramaticSound() {
        this.playTone(440, 0.2, 0.5); // A4 note
        setTimeout(() => this.playTone(554.37, 0.2, 0.3), 200); // C#5
        setTimeout(() => this.playTone(659.25, 0.2, 0.4), 400); // E5
    }

    playSuccessSound() {
        this.playTone(523.25, 0.1, 0.3); // C5
        setTimeout(() => this.playTone(659.25, 0.1, 0.3), 100); // E5
        setTimeout(() => this.playTone(783.99, 0.1, 0.3), 200); // G5
    }

    playErrorSound() {
        this.playTone(220, 0.3, 0.4); // A3
        setTimeout(() => this.playTone(196, 0.3, 0.4), 150); // G3
    }

    playClickSound() {
        this.playTone(800, 0.05, 0.2);
    }

    playTone(frequency, duration, volume) {
        if (!this.audioContext || this.isMuted) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            gainNode.gain.setValueAtTime(volume * this.volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (e) {
            console.log('Sound effect failed:', e);
        }
    }
}

// Initialize audio manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.audioManager = new AudioManager();
});

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}