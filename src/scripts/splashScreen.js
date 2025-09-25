// Splash Screen and Video Cutscene Controller
export class SplashScreenController {
  constructor() {
    this.currentVideoIndex = 0;
    this.videos = [
            'public/Video/opening.mp4',
            'public/Video/opening.mp4',
            'public/Video/opening.mp4',
            'public/Video/ilmuwan.mp4',
            'public/Video/video.mp4',
            'public/Video/video action.mp4',
            'public/Video/final.mp4'
        ];
    this.splashScreen = document.getElementById('splash-screen');
    this.transitionContainer = document.getElementById('transition-container');
    this.videoContainer = document.getElementById('video-container');
    this.video = document.getElementById('cutscene-video');
    this.skipButton = document.getElementById('skip-button');
    this.gameWindow = document.getElementById('root-window');
    
    // Debug: Log all elements
    console.log('SplashScreen elements:', {
      splashScreen: this.splashScreen,
      transitionContainer: this.transitionContainer,
      videoContainer: this.videoContainer,
      video: this.video,
      skipButton: this.skipButton,
      gameWindow: this.gameWindow
    });
    
    console.log('Videos array:', this.videos);
    
    // Make skip button always visible for testing
    if (this.skipButton) {
      this.skipButton.style.display = 'block';
      this.skipButton.style.visibility = 'visible';
      this.skipButton.style.zIndex = '9999';
    }
    
    // Setup dramatic sound for video playback
    this.setupDramaticSound();
    this.setupBackgroundMusic();
    
    this.init();
  }

  init() {
    // Start background music
    this.startBackgroundMusic();
    
    console.log('SplashScreen init completed, waiting 5 seconds...');
    
    // Show splash screen for 5 seconds, then start video sequence
    setTimeout(() => {
      console.log('5 seconds passed, starting video sequence...');
      console.log('Current splash screen display:', this.splashScreen ? this.splashScreen.style.display : 'null');
      this.startVideoSequence();
    }, 5000);

    // Skip button functionality
    if (this.skipButton) {
      console.log('Skip button found, adding event listener');
      this.skipButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Skip button event triggered!');
        this.skipToGame();
      });
      
      // Also add a backup click handler
      this.skipButton.onclick = (e) => {
        e.preventDefault();
        console.log('Skip button onclick triggered!');
        this.skipToGame();
      };
    } else {
      console.error('Skip button not found!');
    }
    


    // Video ended event
    this.video.addEventListener('ended', () => {
      this.nextVideo();
    });

    // Keyboard skip (Space or Enter)
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        if (this.videoContainer.style.display !== 'none') {
          this.skipToGame();
        }
      }
    });
  }

  startVideoSequence() {
    console.log('startVideoSequence called');
    console.log('transitionContainer:', this.transitionContainer);
    console.log('videoContainer:', this.videoContainer);
    
    // Show transition with particles
    this.transitionContainer.style.display = 'block';
    this.createEnergyParticles();
    
    // Fade in transition
    setTimeout(() => {
      this.transitionContainer.classList.add('active');
    }, 50);
    
    // Hide splash screen
    setTimeout(() => {
      this.splashScreen.style.opacity = '0';
    }, 400);
    
    // Complete transition to video
    setTimeout(() => {
      this.splashScreen.style.display = 'none';
      this.transitionContainer.classList.remove('active');
      
      setTimeout(() => {
        this.transitionContainer.style.display = 'none';
        this.videoContainer.style.display = 'block';
        this.playCurrentVideo();
      }, 800);
    }, 1200);
  }
  
  createEnergyParticles() {
    const particleContainer = document.getElementById('energy-particles');
    particleContainer.innerHTML = ''; // Clear existing particles
    
    // Create multiple particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random size and position
      const size = Math.random() * 8 + 4; // 4-12px
      const leftPos = Math.random() * 100; // 0-100%
      const delay = Math.random() * 2; // 0-2s delay
      
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = leftPos + '%';
      particle.style.animationDelay = delay + 's';
      
      particleContainer.appendChild(particle);
    }
  }

  playCurrentVideo() {
    if (this.currentVideoIndex < this.videos.length) {
      // Play dramatic sound when starting video
      this.playDramaticSound();
      
      console.log('Setting video src to:', this.videos[this.currentVideoIndex]);
      this.video.src = this.videos[this.currentVideoIndex];
      console.log('Video element src set to:', this.video.src);
      
      // Ensure video controls are completely hidden
      this.video.controls = false;
      this.video.setAttribute('controls', 'false');
      this.video.removeAttribute('controls');
      
      // Disable right-click context menu
      this.video.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
      });
      
      // Prevent seeking and other interactions
      this.video.addEventListener('seeking', (e) => {
        e.preventDefault();
      });
      
      this.video.load();
      
      // Play dramatic sound when video starts
      this.playDramaticSound();
      
      this.video.play().catch(e => {
        console.log('Video autoplay failed:', e);
        // If autoplay fails, show a play button or skip to next
        this.nextVideo();
      });
    } else {
      this.startGame();
    }
  }

  nextVideo() {
    this.currentVideoIndex++;
    if (this.currentVideoIndex < this.videos.length) {
      this.playCurrentVideo();
    } else {
      this.startGame();
    }
  }

  skipToGame() {
    console.log('Skip button clicked! Navigating to main menu...');
    this.currentVideoIndex = this.videos.length; // Skip all videos
    
    // Immediate navigation without animation
    window.location.href = 'main-menu.html';
  }

  startGame() {
    // Hide video container
    this.videoContainer.style.opacity = '0';
    setTimeout(() => {
      this.videoContainer.style.display = 'none';
      
      // Go directly to main menu
      window.location.href = 'main-menu.html';
    }, 500);
  }
  
  showPuzzleGame() {
    // Initialize and show puzzle game
    if (!window.puzzleGame) {
      window.puzzleGame = new PuzzleGame();
    }
    
    window.puzzleGame.show();
    
    // Add event listener for puzzle completion or skip
    this.setupPuzzleGameListeners();
  }
  
  setupPuzzleGameListeners() {
    const puzzleContainer = document.getElementById('puzzle-game-container');
    const skipPuzzleBtn = document.getElementById('skip-puzzle');
    
    // Skip puzzle button
    if (skipPuzzleBtn) {
      skipPuzzleBtn.addEventListener('click', () => {
        window.location.href = 'main-menu.html';
      });
    }
    
    // Check for puzzle completion every second
    const checkCompletion = setInterval(() => {
      if (window.puzzleGame && window.puzzleGame.gameCompleted) {
        clearInterval(checkCompletion);
        setTimeout(() => {
          this.startMainGame();
        }, 3000); // Wait 3 seconds after completion
      }
    }, 1000);
  }
  
  setupDramaticSound() {
    // Use global audio manager for dramatic sound
    // No need to create separate audio elements
  }

  setupBackgroundMusic() {
    // Use global audio manager for background music
    // No need to create separate audio elements
  }

  startBackgroundMusic() {
    // Start background music using global audio manager
    if (window.audioManager) {
      window.audioManager.playMusic();
    }
  }

  stopBackgroundMusic() {
    // Stop background music using global audio manager
    if (window.audioManager) {
      window.audioManager.stopMusic();
    }
  }
  
  playDramaticSound() {
    // Play dramatic sound using global audio manager
    if (window.audioManager) {
      window.audioManager.playDramaticSound();
    }
  }
  
  startMainGame() {
    // Stop splash screen background music
    this.stopBackgroundMusic();
    
    // Hide puzzle game
    if (window.puzzleGame) {
      window.puzzleGame.hide();
    }
    
    // Start the regular SimCity game
    this.gameWindow.style.display = 'block';
    this.gameWindow.style.opacity = '0';
    
    // Fade in game
    setTimeout(() => {
      this.gameWindow.style.transition = 'opacity 1s ease-in';
      this.gameWindow.style.opacity = '1';
      
      // Initialize the game
      if (window.game) {
        window.game.startGame();
      }
    }, 100);
  }
}

// Initialize splash screen when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSplashScreen);
} else {
  initSplashScreen();
}

function initSplashScreen() {
  console.log('=== SplashScreen.js initializing ===');
  console.log('DOM readyState:', document.readyState);
  
  try {
    const controller = new SplashScreenController();
    console.log('SplashScreenController created successfully');
  } catch (error) {
    console.error('Error creating SplashScreenController:', error);
  }
}