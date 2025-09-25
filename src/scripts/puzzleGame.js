// Puzzle Game Implementation
export class PuzzleGame {
  constructor() {
    this.gameCompleted = false;
    this.timer = 180; // 3 minutes
    this.timerInterval = null;
    this.puzzlePieces = [
      { id: 'piece_0_0', row: 0, col: 0, placed: false },
      { id: 'piece_0_1', row: 0, col: 1, placed: false },
      { id: 'piece_0_2', row: 0, col: 2, placed: false },
      { id: 'piece_1_0', row: 1, col: 0, placed: false },
      { id: 'piece_1_1', row: 1, col: 1, placed: false },
      { id: 'piece_1_2', row: 1, col: 2, placed: false }
    ];
    
    this.container = document.getElementById('puzzle-game-container');
    this.init();
  }

  init() {
    this.setupPuzzlePieces();
    this.setupEventListeners();
    this.updateMotivationalText();
    this.setupInstructionsPopup();
  }

  setupInstructionsPopup() {
    const startPuzzleBtn = document.getElementById('start-puzzle-btn');
    if (startPuzzleBtn) {
      startPuzzleBtn.addEventListener('click', () => {
        this.hideInstructionsPopup();
        this.startTimer();
      });
    }
  }

  showInstructionsPopup() {
    const popup = document.getElementById('puzzle-instructions-popup');
    if (popup) {
      popup.style.display = 'flex';
    }
  }

  hideInstructionsPopup() {
    const popup = document.getElementById('puzzle-instructions-popup');
    if (popup) {
      popup.style.display = 'none';
    }
  }

  setupPuzzlePieces() {
    const piecesContainer = document.getElementById('puzzle-pieces-container');
    if (!piecesContainer) return;
    
    piecesContainer.innerHTML = '';
    
    // Shuffle pieces for random placement
    const shuffledPieces = [...this.puzzlePieces].sort(() => Math.random() - 0.5);
    
    shuffledPieces.forEach(piece => {
      const pieceElement = document.createElement('div');
      pieceElement.className = 'puzzle-piece';
      pieceElement.id = piece.id;
      pieceElement.draggable = true;
      pieceElement.dataset.row = piece.row;
      pieceElement.dataset.col = piece.col;
      
      // Set background image
      pieceElement.style.backgroundImage = `url(public/puzzle_piece_${piece.row}_${piece.col}.png)`;
      pieceElement.style.backgroundSize = 'cover';
      pieceElement.style.backgroundPosition = 'center';
      
      // Add drag event listeners
      pieceElement.addEventListener('dragstart', this.handleDragStart.bind(this));
      pieceElement.addEventListener('dragend', this.handleDragEnd.bind(this));
      
      // Touch events for mobile
      pieceElement.addEventListener('touchstart', this.handleTouchStart.bind(this));
      
      piecesContainer.appendChild(pieceElement);
    });
    
    // Setup drop zones
    const slots = document.querySelectorAll('.puzzle-slot');
    slots.forEach(slot => {
      slot.addEventListener('dragover', this.handleDragOver.bind(this));
      slot.addEventListener('drop', this.handleDrop.bind(this));
    });
  }

  setupEventListeners() {
    const skipButton = document.getElementById('skip-puzzle');
    const restartButton = document.getElementById('restart-puzzle');
    
    if (skipButton) {
      skipButton.addEventListener('click', () => {
        this.redirectToMainMenu();
      });
    }
    
    if (restartButton) {
      restartButton.addEventListener('click', () => {
        this.restartPuzzle();
      });
    }
  }

  handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    e.target.style.opacity = '0.5';
  }

  handleDragEnd(e) {
    e.target.style.opacity = '1';
  }

  handleDragOver(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
  }

  handleDrop(e) {
    e.preventDefault();
    e.target.classList.remove('drag-over');
    
    const pieceId = e.dataTransfer.getData('text/plain');
    const piece = document.getElementById(pieceId);
    const slot = e.target;
    
    if (this.isValidDrop(piece, slot)) {
      // Move piece to slot
      slot.appendChild(piece);
      piece.style.position = 'relative';
      piece.style.top = '0';
      piece.style.left = '0';
      
      // Mark as placed
      const pieceData = this.puzzlePieces.find(p => p.id === pieceId);
      if (pieceData) {
        pieceData.placed = true;
      }
      
      // Check if puzzle is complete
      this.checkCompletion();
      
      // Play success sound
      this.playSound('success');
    } else {
      // Invalid drop - show feedback
      slot.classList.add('invalid-drop');
      setTimeout(() => {
        slot.classList.remove('invalid-drop');
      }, 500);
      
      this.playSound('error');
    }
  }

  handleTouchStart(e) {
    // Simple touch handling for mobile
    const piece = e.target;
    piece.style.zIndex = '1000';
    
    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      piece.style.position = 'fixed';
      piece.style.left = (touch.clientX - 50) + 'px';
      piece.style.top = (touch.clientY - 50) + 'px';
    };
    
    const handleTouchEnd = (e) => {
      const touch = e.changedTouches[0];
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      
      if (elementBelow && elementBelow.classList.contains('puzzle-slot')) {
        if (this.isValidDrop(piece, elementBelow)) {
          elementBelow.appendChild(piece);
          piece.style.position = 'relative';
          piece.style.top = '0';
          piece.style.left = '0';
          piece.style.zIndex = '1';
          
          const pieceData = this.puzzlePieces.find(p => p.id === piece.id);
          if (pieceData) {
            pieceData.placed = true;
          }
          
          this.checkCompletion();
          this.playSound('success');
        } else {
          // Reset position
          piece.style.position = 'relative';
          piece.style.top = '0';
          piece.style.left = '0';
          piece.style.zIndex = '1';
          this.playSound('error');
        }
      } else {
        // Reset position
        piece.style.position = 'relative';
        piece.style.top = '0';
        piece.style.left = '0';
        piece.style.zIndex = '1';
      }
      
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }

  isValidDrop(piece, slot) {
    const pieceRow = parseInt(piece.dataset.row);
    const pieceCol = parseInt(piece.dataset.col);
    const slotRow = parseInt(slot.dataset.row);
    const slotCol = parseInt(slot.dataset.col);
    
    return pieceRow === slotRow && pieceCol === slotCol;
  }

  checkCompletion() {
    const allPlaced = this.puzzlePieces.every(piece => piece.placed);
    
    if (allPlaced) {
      this.completePuzzle();
    }
  }

  completePuzzle() {
    this.gameCompleted = true;
    this.stopTimer();
    
    // Show completion message
    const motivationText = document.getElementById('motivation-message');
    if (motivationText) {
      motivationText.textContent = '🎉 Puzzle selesai! Energi berhasil diselamatkan!';
      motivationText.style.color = '#4CAF50';
      motivationText.style.fontWeight = 'bold';
    }
    
    // Show restart button
    const restartButton = document.getElementById('restart-puzzle');
    if (restartButton) {
      restartButton.style.display = 'block';
    }
    
    this.playSound('victory');
    
    // Show animation screen after 3 seconds
    setTimeout(() => {
      this.showAnimationScreen();
    }, 3000);
  }
  
  showAnimationScreen() {
    // Hide puzzle container
    const puzzleContainer = document.getElementById('puzzle-game-container');
    if (puzzleContainer) {
      puzzleContainer.style.display = 'none';
    }
    
    // Create animation screen
    const animationScreen = document.createElement('div');
    animationScreen.id = 'animation-screen';
    animationScreen.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: url('public/Image/lv room.png') center/cover no-repeat;
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 1s ease-in-out;
    `;
    
    // Add GIF animation
    const gifElement = document.createElement('img');
    gifElement.src = 'public/Image/gif.gif';
    gifElement.style.cssText = `
      max-width: 300px;
      max-height: 300px;
      width: auto;
      height: auto;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    
    animationScreen.appendChild(gifElement);
    document.body.appendChild(animationScreen);
    
    // Fade in animation screen
    setTimeout(() => {
      animationScreen.style.opacity = '1';
    }, 100);
    
    // Auto redirect to main menu after 5 seconds
    setTimeout(() => {
      this.redirectToMainMenu();
    }, 5000);
  }
  
  redirectToMainMenu() {
    // Remove animation screen if exists
    const animationScreen = document.getElementById('animation-screen');
    if (animationScreen) {
      animationScreen.remove();
    }
    
    // Redirect to main menu
    window.location.href = 'main-menu.html';
  }

  restartPuzzle() {
    this.gameCompleted = false;
    this.timer = 180;
    
    // Reset all pieces
    this.puzzlePieces.forEach(piece => {
      piece.placed = false;
    });
    
    // Reset UI
    const motivationText = document.getElementById('motivation-message');
    if (motivationText) {
      motivationText.textContent = 'Ayo susun puzzle untuk menyelamatkan energi!';
      motivationText.style.color = '';
      motivationText.style.fontWeight = '';
    }
    
    const restartButton = document.getElementById('restart-puzzle');
    if (restartButton) {
      restartButton.style.display = 'none';
    }
    
    // Recreate puzzle pieces
    this.setupPuzzlePieces();
    this.startTimer();
  }

  startTimer() {
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      this.timer--;
      this.updateTimerDisplay();
      
      if (this.timer <= 0) {
        this.timeUp();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) {
      const minutes = Math.floor(this.timer / 60);
      const seconds = this.timer % 60;
      timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      // Change color when time is running out
      if (this.timer <= 30) {
        timerDisplay.style.color = '#f44336';
      } else if (this.timer <= 60) {
        timerDisplay.style.color = '#ff9800';
      } else {
        timerDisplay.style.color = '#4CAF50';
      }
    }
  }

  timeUp() {
    this.stopTimer();
    const motivationText = document.getElementById('motivation-message');
    if (motivationText) {
      motivationText.textContent = '⏰ Waktu habis! Coba lagi atau lewati puzzle.';
      motivationText.style.color = '#f44336';
    }
    
    const restartButton = document.getElementById('restart-puzzle');
    if (restartButton) {
      restartButton.style.display = 'block';
    }
  }

  updateMotivationalText() {
    const messages = [
      'Ayo susun puzzle untuk menyelamatkan energi!',
      'Setiap potongan puzzle adalah langkah menuju energi bersih!',
      'Kamu bisa melakukannya! Susun dengan teliti!',
      'Energi masa depan ada di tanganmu!'
    ];
    
    const motivationText = document.getElementById('motivation-message');
    if (motivationText) {
      let messageIndex = 0;
      setInterval(() => {
        if (!this.gameCompleted && this.timer > 0) {
          motivationText.textContent = messages[messageIndex];
          messageIndex = (messageIndex + 1) % messages.length;
        }
      }, 5000);
    }
  }

  playSound(type) {
    // Use global audio manager for sound effects
    if (window.audioManager) {
      switch (type) {
        case 'success':
          window.audioManager.playSuccessSound();
          break;
        case 'error':
          window.audioManager.playErrorSound();
          break;
        case 'victory':
          window.audioManager.playDramaticSound();
          break;
        case 'click':
          window.audioManager.playClickSound();
          break;
      }
    }
  }

  show() {
    if (this.container) {
      this.container.style.display = 'block';
      this.container.style.opacity = '0';
      
      // Fade in
      setTimeout(() => {
        this.container.style.transition = 'opacity 0.5s ease-in';
        this.container.style.opacity = '1';
        
        // Show instructions popup after fade in
        setTimeout(() => {
          this.showInstructionsPopup();
        }, 300);
      }, 50);
      
      // Don't start timer immediately, wait for user to close popup
    }
  }

  hide() {
    if (this.container) {
      this.container.style.opacity = '0';
      setTimeout(() => {
        this.container.style.display = 'none';
      }, 500);
      
      this.stopTimer();
    }
  }
}

// Make PuzzleGame available globally
if (typeof window !== 'undefined') {
  window.PuzzleGame = PuzzleGame;
}