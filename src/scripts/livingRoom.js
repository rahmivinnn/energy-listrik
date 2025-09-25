// Scene 2 - Level 1: Ruang Tamu (Dasar Listrik)
class LivingRoomScene {
  constructor() {
    this.container = document.getElementById('living-room-container');
    this.gameState = {
      livingRoomPower: false,
      cablePuzzleSolved: false,
      tvPuzzleSolved: false,
      energyKeysCollected: 0,
      currentCircuit: {
        'battery-positive': null,
        'switch': null,
        'lamp': null,
        'battery-negative': null
      },
      tvSteps: {
        1: false, // Colok kabel
        2: false, // Nyalakan saklar utama
        3: false, // Tekan tombol power
        4: false  // Atur channel
      },
      currentTvStep: 1
    };
    
    this.audioContext = null;
    this.sounds = {};
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.initAudio();
    this.updateInventory();
  }
  
  show() {
    this.container.style.display = 'block';
    // Hide other containers
    document.getElementById('main-menu-container').style.display = 'none';
    document.getElementById('puzzle-game-container').style.display = 'none';
    document.getElementById('game-progress').style.display = 'block';
    
    // Update keys display
    if (window.gameState) {
      window.gameState.updateKeysDisplay();
    }
    
    // Show first time tooltip if needed
    this.showFirstTimeTooltip();
  }
  
  hide() {
    this.container.style.display = 'none';
    document.getElementById('game-progress').style.display = 'none';
  }
  
  setupEventListeners() {
    // Interactive objects
    document.getElementById('cable-area').addEventListener('click', () => {
      this.openCablePuzzle();
    });
    
    document.getElementById('tv-area').addEventListener('click', () => {
      if (this.gameState.cablePuzzleSolved) {
        this.openTvPuzzle();
      } else {
        this.showHint('Perbaiki rangkaian listrik terlebih dahulu!');
      }
    });
    
    // Cable puzzle events
    document.querySelector('#cable-puzzle-overlay .close-puzzle').addEventListener('click', () => {
      this.closeCablePuzzle();
    });
    
    document.getElementById('check-circuit').addEventListener('click', () => {
      this.validateCircuit();
    });
    
    document.getElementById('reset-circuit').addEventListener('click', () => {
      this.resetCircuit();
    });
    
    // TV puzzle events
    document.querySelector('#tv-puzzle-overlay .close-puzzle').addEventListener('click', () => {
      this.closeTvPuzzle();
    });
    
    // TV steps
    document.querySelectorAll('.tv-step').forEach(step => {
      step.addEventListener('click', (e) => {
        const stepNumber = parseInt(e.currentTarget.dataset.step);
        this.handleTvStep(stepNumber);
      });
    });
    
    // Continue button
    document.getElementById('continue-to-kitchen').addEventListener('click', () => {
      this.transitionToKitchen();
    });
    
    // Setup drag and drop for cable puzzle
    this.setupDragAndDrop();
  }
  
  initAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      // Load sound effects (placeholder - would load actual audio files)
      this.sounds = {
        success: 'sfx_click_success.wav',
        buzz: 'sfx_buzz.wav',
        lightOn: 'anim_light_on.json'
      };
    } catch (error) {
      console.warn('Audio context not available:', error);
    }
  }
  
  playSound(soundName) {
    // Placeholder for audio playback
    console.log(`Playing sound: ${soundName}`);
  }
  
  openCablePuzzle() {
    document.getElementById('cable-puzzle-overlay').style.display = 'flex';
    this.resetCircuit();
  }
  
  closeCablePuzzle() {
    document.getElementById('cable-puzzle-overlay').style.display = 'none';
  }
  
  openTvPuzzle() {
    document.getElementById('tv-puzzle-overlay').style.display = 'flex';
    this.updateTvSteps();
  }
  
  closeTvPuzzle() {
    document.getElementById('tv-puzzle-overlay').style.display = 'none';
  }
  
  setupDragAndDrop() {
    const components = document.querySelectorAll('.component');
    const slots = document.querySelectorAll('.component-slot');
    
    components.forEach(component => {
      component.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', component.dataset.type);
        component.classList.add('dragging');
      });
      
      component.addEventListener('dragend', () => {
        component.classList.remove('dragging');
      });
      
      // Touch events for mobile
      component.addEventListener('touchstart', (e) => {
        this.handleTouchStart(e, component);
      });
    });
    
    slots.forEach(slot => {
      slot.addEventListener('dragover', (e) => {
        e.preventDefault();
        const componentType = e.dataTransfer.getData('text/plain');
        if (this.isValidDrop(componentType, slot.dataset.type)) {
          slot.classList.add('valid-drop');
        } else {
          slot.classList.add('invalid-drop');
        }
      });
      
      slot.addEventListener('dragleave', () => {
        slot.classList.remove('valid-drop', 'invalid-drop');
      });
      
      slot.addEventListener('drop', (e) => {
        e.preventDefault();
        const componentType = e.dataTransfer.getData('text/plain');
        this.handleDrop(componentType, slot);
        slot.classList.remove('valid-drop', 'invalid-drop');
      });
    });
  }
  
  handleTouchStart(e, component) {
    // Simplified touch handling for mobile
    const touch = e.touches[0];
    const componentType = component.dataset.type;
    
    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      
      if (elementBelow && elementBelow.classList.contains('component-slot')) {
        if (this.isValidDrop(componentType, elementBelow.dataset.type)) {
          elementBelow.classList.add('valid-drop');
        } else {
          elementBelow.classList.add('invalid-drop');
        }
      }
    };
    
    const handleTouchEnd = (e) => {
      const touch = e.changedTouches[0];
      const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      
      if (elementBelow && elementBelow.classList.contains('component-slot')) {
        this.handleDrop(componentType, elementBelow);
      }
      
      // Clean up
      document.querySelectorAll('.component-slot').forEach(slot => {
        slot.classList.remove('valid-drop', 'invalid-drop');
      });
      
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  }
  
  isValidDrop(componentType, slotType) {
    return componentType === slotType;
  }
  
  handleDrop(componentType, slot) {
    if (this.isValidDrop(componentType, slot.dataset.type)) {
      // Clear previous component in this slot
      slot.innerHTML = '';
      
      // Add component to slot
      const componentEmoji = this.getComponentEmoji(componentType);
      slot.innerHTML = componentEmoji;
      slot.classList.add('filled');
      
      // Update circuit state
      this.gameState.currentCircuit[componentType] = slot;
      
      // Magnetic snapping effect
      slot.style.transform = 'scale(1.1)';
      setTimeout(() => {
        slot.style.transform = 'scale(1)';
      }, 200);
      
      this.playSound('success');
    } else {
      // Invalid drop - show red glow and shake
      slot.classList.add('invalid-drop');
      this.playSound('buzz');
      
      setTimeout(() => {
        slot.classList.remove('invalid-drop');
      }, 500);
    }
  }
  
  getComponentEmoji(type) {
    const emojis = {
      'battery-positive': '🔋+',
      'battery-negative': '🔋-',
      'switch': '🔘',
      'lamp': '💡'
    };
    return emojis[type] || '❓';
  }
  
  validateCircuit() {
    const circuit = this.gameState.currentCircuit;
    
    // Check if all components are placed
    const allPlaced = Object.values(circuit).every(slot => slot !== null);
    
    if (!allPlaced) {
      this.showEducationalMessage('Lengkapi semua komponen terlebih dahulu!', false);
      return;
    }
    
    // Check correct order: (+) battery → switch → lamp → (–) battery
    const slots = document.querySelectorAll('.component-slot');
    const order = Array.from(slots).map(slot => {
      if (slot.classList.contains('filled')) {
        return slot.dataset.type;
      }
      return null;
    });
    
    const correctOrder = ['battery-positive', 'switch', 'lamp', 'battery-negative'];
    const isCorrect = order.every((type, index) => type === correctOrder[index]);
    
    if (isCorrect) {
      this.solveCablePuzzle();
    } else {
      this.showCircuitError();
    }
  }
  
  solveCablePuzzle() {
    this.gameState.cablePuzzleSolved = true;
    this.gameState.livingRoomPower = true;
    
    // Visual feedback - lamp lights up
    const lampSlot = document.querySelector('.component-slot[data-type="lamp"]');
    lampSlot.style.background = 'radial-gradient(circle, #ffeb3b, #ffc107)';
    lampSlot.style.boxShadow = '0 0 20px #ffeb3b';
    
    // Update room lamp
    document.getElementById('lamp-object').style.background = '#ffeb3b';
    document.getElementById('lamp-object').style.boxShadow = '0 0 15px #ffeb3b';
    
    // Play success sound
    this.playSound('success');
    
    // Show educational message
    this.showEducationalMessage(
      'Listrik mengalir dalam rangkaian tertutup. Saklar memutus/menghubungkan arus.',
      true
    );
    
    // Award energy key
    setTimeout(() => {
      this.awardEnergyKey();
      this.closeCablePuzzle();
      
      // Enable TV area
      const tvArea = document.getElementById('tv-area');
      tvArea.style.opacity = '1';
      tvArea.style.pointerEvents = 'auto';
      
      // Show clue
      this.showHint('Cek rekaman di TV tua.');
    }, 2000);
  }
  
  showCircuitError() {
    // Visual feedback for wrong circuit
    const cables = document.querySelectorAll('.component-slot.filled');
    cables.forEach(cable => {
      cable.style.border = '2px solid #ff4444';
      cable.style.animation = 'shake 0.5s ease-in-out';
    });
    
    setTimeout(() => {
      cables.forEach(cable => {
        cable.style.border = '2px dashed #666';
        cable.style.animation = '';
      });
    }, 1000);
    
    this.playSound('buzz');
    this.showEducationalMessage(
      'Rangkaian terbuka atau salah sambung. Arus tidak mengalir.',
      false
    );
  }
  
  resetCircuit() {
    // Clear all slots
    document.querySelectorAll('.component-slot').forEach(slot => {
      slot.innerHTML = '';
      slot.classList.remove('filled', 'valid-drop', 'invalid-drop');
      slot.style.background = '';
      slot.style.boxShadow = '';
      slot.style.border = '';
    });
    
    // Reset circuit state
    Object.keys(this.gameState.currentCircuit).forEach(key => {
      this.gameState.currentCircuit[key] = null;
    });
  }
  
  handleTvStep(stepNumber) {
    if (stepNumber !== this.gameState.currentTvStep) {
      this.showHint('Pastikan semua perangkat mendapat aliran listrik.');
      return;
    }
    
    // Mark step as completed
    this.gameState.tvSteps[stepNumber] = true;
    const stepElement = document.querySelector(`.tv-step[data-step="${stepNumber}"]`);
    stepElement.setAttribute('data-completed', 'true');
    
    // Update TV display
    const tvDisplay = document.getElementById('tv-display');
    
    switch (stepNumber) {
      case 1:
        tvDisplay.textContent = 'Kabel terhubung';
        break;
      case 2:
        tvDisplay.textContent = 'Listrik mengalir';
        break;
      case 3:
        tvDisplay.textContent = 'TV menyala';
        break;
      case 4:
        tvDisplay.textContent = 'Memutar rekaman...';
        this.playScientistRecording();
        break;
    }
    
    this.gameState.currentTvStep++;
    
    if (stepNumber === 4) {
      this.solveTvPuzzle();
    }
  }
  
  updateTvSteps() {
    document.querySelectorAll('.tv-step').forEach((step, index) => {
      const stepNumber = index + 1;
      if (stepNumber < this.gameState.currentTvStep) {
        step.setAttribute('data-completed', 'true');
      } else if (stepNumber > this.gameState.currentTvStep) {
        step.classList.add('disabled');
      }
    });
  }
  
  playScientistRecording() {
    const tvDisplay = document.getElementById('tv-display');
    const message = 'Jika kau menemukan ini, berarti kau berhasil menghidupkan ruang tamuku...';
    
    // Simulate audio playback with text animation
    let index = 0;
    const typeWriter = () => {
      if (index < message.length) {
        tvDisplay.textContent = message.substring(0, index + 1);
        index++;
        setTimeout(typeWriter, 100);
      }
    };
    
    typeWriter();
  }
  
  solveTvPuzzle() {
    this.gameState.tvPuzzleSolved = true;
    
    setTimeout(() => {
      this.closeTvPuzzle();
      this.showSuccessMessage();
    }, 3000);
  }
  
  awardEnergyKey() {
    this.gameState.energyKeysCollected++;
    this.updateInventory();
    
    // Add energy key to global state
    if (window.gameState) {
      window.gameState.addEnergyKey();
    }
    
    // Animate key flying to inventory
    const keyAnimation = document.createElement('div');
    keyAnimation.innerHTML = '🗝️';
    keyAnimation.style.position = 'fixed';
    keyAnimation.style.fontSize = '24px';
    keyAnimation.style.zIndex = '1001';
    keyAnimation.style.left = '50%';
    keyAnimation.style.top = '50%';
    keyAnimation.style.transform = 'translate(-50%, -50%)';
    keyAnimation.style.transition = 'all 1s ease-out';
    
    document.body.appendChild(keyAnimation);
    
    setTimeout(() => {
      keyAnimation.style.left = '95px';
      keyAnimation.style.top = '80px';
      keyAnimation.style.transform = 'scale(0.8)';
    }, 100);
    
    setTimeout(() => {
      document.body.removeChild(keyAnimation);
    }, 1100);
  }
  
  updateInventory() {
    const keySlots = document.querySelectorAll('.key-slot');
    keySlots.forEach((slot, index) => {
      if (index < this.gameState.energyKeysCollected) {
        slot.classList.add('filled');
      }
    });
  }
  
  showEducationalMessage(message, isSuccess) {
    const popover = document.getElementById('educational-popover');
    const text = popover.querySelector('.popover-text');
    
    text.textContent = message;
    popover.style.display = 'block';
    popover.style.left = '50%';
    popover.style.top = '50%';
    popover.style.transform = 'translate(-50%, -50%)';
    
    if (isSuccess) {
      popover.style.borderColor = '#00ff88';
    } else {
      popover.style.borderColor = '#ff4444';
    }
    
    setTimeout(() => {
      popover.style.display = 'none';
    }, 3000);
  }
  
  showHint(message) {
    const hint = document.createElement('div');
    hint.className = 'hint-bubble';
    hint.textContent = message;
    hint.style.position = 'fixed';
    hint.style.top = '20px';
    hint.style.right = '20px';
    hint.style.background = 'rgba(0, 0, 0, 0.8)';
    hint.style.color = 'white';
    hint.style.padding = '10px 15px';
    hint.style.borderRadius = '10px';
    hint.style.border = '2px solid #00ff88';
    hint.style.zIndex = '1001';
    hint.style.fontSize = '14px';
    hint.style.maxWidth = '200px';
    
    document.body.appendChild(hint);
    
    setTimeout(() => {
      if (hint.parentNode) {
        document.body.removeChild(hint);
      }
    }, 3000);
  }
  
  showSuccessMessage() {
    const overlay = document.getElementById('success-message');
    const text = overlay.querySelector('.success-text');
    
    text.textContent = 'Selamat! Kamu berhasil menyalakan listrik di ruang tamu dan menemukan Kunci Energi Pertama!';
    overlay.style.display = 'flex';
  }
  
  showFirstTimeTooltip() {
    // Show tooltip for first time players
    const tooltip = document.createElement('div');
    tooltip.className = 'first-time-tooltip';
    tooltip.innerHTML = `
      <div class="tooltip-content">
        Klik area yang berkilau untuk berinteraksi dengan objek.
      </div>
    `;
    tooltip.style.position = 'fixed';
    tooltip.style.bottom = '20px';
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translateX(-50%)';
    tooltip.style.background = 'rgba(0, 0, 0, 0.9)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '15px';
    tooltip.style.borderRadius = '10px';
    tooltip.style.border = '2px solid #00ff88';
    tooltip.style.zIndex = '1001';
    
    document.body.appendChild(tooltip);
    
    setTimeout(() => {
      if (tooltip.parentNode) {
        document.body.removeChild(tooltip);
      }
    }, 5000);
  }
  
  transitionToKitchen() {
    // Hide success message
    document.getElementById('success-message').style.display = 'none';
    
    console.log('Transitioning to Kitchen...');
    
    // Mark living room as completed
    if (window.gameState) {
      window.gameState.completeLevel('Level1_LivingRoom');
      
      // Transition to kitchen using FSM
      setTimeout(() => {
        window.gameState.transitionTo('Level2_Kitchen');
      }, 1500);
    } else {
      // Fallback if gameState not available
      alert('Level 2: Dapur akan segera tersedia!');
      
      // Return to main menu for now
      this.hide();
      document.getElementById('main-menu-container').style.display = 'block';
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LivingRoomScene;
} else {
  window.LivingRoomScene = LivingRoomScene;
}