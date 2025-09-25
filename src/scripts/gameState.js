// Global Game State Management with FSM
class GameState {
  constructor() {
    this.currentLevel = 'MainMenu';
    this.previousLevel = null;
    this.gameProgress = {
      livingRoomCompleted: false,
      kitchenCompleted: false,
      bedroomCompleted: false,
      energyKeysCollected: 0,
      totalEnergyKeys: 3
    };
    
    this.fsm = {
      states: {
        'MainMenu': {
          canTransitionTo: ['Level1_LivingRoom', 'Settings', 'About']
        },
        'Level1_LivingRoom': {
          canTransitionTo: ['Level2_Kitchen', 'MainMenu']
        },
        'Level2_Kitchen': {
          canTransitionTo: ['Level3_Bedroom', 'Level1_LivingRoom', 'MainMenu']
        },
        'Level3_Bedroom': {
          canTransitionTo: ['GameComplete', 'Level2_Kitchen', 'MainMenu']
        },
        'GameComplete': {
          canTransitionTo: ['MainMenu']
        },
        'Settings': {
          canTransitionTo: ['MainMenu']
        },
        'About': {
          canTransitionTo: ['MainMenu']
        }
      }
    };
    
    this.listeners = [];
    this.init();
  }
  
  init() {
    // Load saved progress if available
    this.loadProgress();
    this.updateFSMDisplay();
  }
  
  // FSM State Management
  canTransition(fromState, toState) {
    const state = this.fsm.states[fromState];
    return state && state.canTransitionTo.includes(toState);
  }
  
  transitionTo(newState) {
    if (!this.canTransition(this.currentLevel, newState)) {
      console.warn(`Invalid transition from ${this.currentLevel} to ${newState}`);
      return false;
    }
    
    this.previousLevel = this.currentLevel;
    this.currentLevel = newState;
    
    console.log(`FSM: Transitioned from ${this.previousLevel} to ${this.currentLevel}`);
    
    // Update UI
    this.updateFSMDisplay();
    
    // Notify listeners
    this.notifyListeners('stateChange', {
      from: this.previousLevel,
      to: this.currentLevel
    });
    
    // Handle specific transitions
    this.handleStateTransition(newState);
    
    return true;
  }
  
  handleStateTransition(newState) {
    switch (newState) {
      case 'Level1_LivingRoom':
        this.showLivingRoom();
        break;
      case 'Level2_Kitchen':
        this.showKitchen();
        break;
      case 'Level3_Bedroom':
        this.showBedroom();
        break;
      case 'MainMenu':
        this.showMainMenu();
        break;
      case 'GameComplete':
        this.showGameComplete();
        break;
    }
  }
  
  showLivingRoom() {
    // Hide all other containers
    this.hideAllContainers();
    
    // Show living room
    if (!window.livingRoomScene) {
      window.livingRoomScene = new LivingRoomScene();
    }
    window.livingRoomScene.show();
  }
  
  showKitchen() {
    console.log('Kitchen scene not implemented yet');
    // Placeholder for kitchen scene
    alert('Level 2: Dapur akan segera tersedia!');
    this.transitionTo('MainMenu');
  }
  
  showBedroom() {
    console.log('Bedroom scene not implemented yet');
    // Placeholder for bedroom scene
    alert('Level 3: Kamar Tidur akan segera tersedia!');
    this.transitionTo('MainMenu');
  }
  
  showMainMenu() {
    this.hideAllContainers();
    
    if (window.mainMenu) {
      window.mainMenu.show();
    } else {
      document.getElementById('main-menu-container').style.display = 'block';
    }
  }
  
  showGameComplete() {
    this.hideAllContainers();
    
    // Show game completion screen
    const completionScreen = document.createElement('div');
    completionScreen.id = 'game-completion-screen';
    completionScreen.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1003;
    `;
    
    completionScreen.innerHTML = `
      <div style="text-align: center; color: white; padding: 40px;">
        <h1 style="font-size: 48px; margin-bottom: 20px;">🎉 Selamat! 🎉</h1>
        <h2 style="font-size: 24px; margin-bottom: 30px;">Kamu telah menyelesaikan Energy Quest!</h2>
        <p style="font-size: 18px; margin-bottom: 40px;">Semua kunci energi telah dikumpulkan dan listrik telah dipulihkan!</p>
        <button id="return-to-menu" style="
          background: #00ff88;
          color: black;
          border: none;
          padding: 15px 30px;
          border-radius: 10px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        ">Kembali ke Menu Utama</button>
      </div>
    `;
    
    document.body.appendChild(completionScreen);
    
    document.getElementById('return-to-menu').addEventListener('click', () => {
      document.body.removeChild(completionScreen);
      this.transitionTo('MainMenu');
    });
  }
  
  hideAllContainers() {
    const containers = [
      'main-menu-container',
      'living-room-container',
      'puzzle-game-container',
      'root-window'
    ];
    
    containers.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.style.display = 'none';
      }
    });
  }
  
  // Progress Management
  completeLevel(levelName) {
    switch (levelName) {
      case 'Level1_LivingRoom':
        this.gameProgress.livingRoomCompleted = true;
        break;
      case 'Level2_Kitchen':
        this.gameProgress.kitchenCompleted = true;
        break;
      case 'Level3_Bedroom':
        this.gameProgress.bedroomCompleted = true;
        break;
    }
    
    this.saveProgress();
    this.checkGameCompletion();
  }
  
  addEnergyKey() {
    this.gameProgress.energyKeysCollected = Math.min(
      this.gameProgress.energyKeysCollected + 1,
      this.gameProgress.totalEnergyKeys
    );
    
    this.saveProgress();
    this.updateKeysDisplay();
    this.checkGameCompletion();
  }
  
  checkGameCompletion() {
    const allLevelsComplete = 
      this.gameProgress.livingRoomCompleted &&
      this.gameProgress.kitchenCompleted &&
      this.gameProgress.bedroomCompleted;
    
    const allKeysCollected = 
      this.gameProgress.energyKeysCollected >= this.gameProgress.totalEnergyKeys;
    
    if (allLevelsComplete && allKeysCollected) {
      setTimeout(() => {
        this.transitionTo('GameComplete');
      }, 2000);
    }
  }
  
  // UI Updates
  updateFSMDisplay() {
    const fsmDisplay = document.getElementById('current-state');
    if (fsmDisplay) {
      fsmDisplay.textContent = this.currentLevel;
    }
  }
  
  updateKeysDisplay() {
    const keysCount = document.querySelector('.keys-count');
    if (keysCount) {
      keysCount.textContent = `${this.gameProgress.energyKeysCollected}/${this.gameProgress.totalEnergyKeys}`;
    }
  }
  
  // Event System
  addEventListener(event, callback) {
    this.listeners.push({ event, callback });
  }
  
  removeEventListener(event, callback) {
    this.listeners = this.listeners.filter(
      listener => !(listener.event === event && listener.callback === callback)
    );
  }
  
  notifyListeners(event, data) {
    this.listeners
      .filter(listener => listener.event === event)
      .forEach(listener => listener.callback(data));
  }
  
  // Persistence
  saveProgress() {
    try {
      localStorage.setItem('energyQuestProgress', JSON.stringify({
        currentLevel: this.currentLevel,
        gameProgress: this.gameProgress
      }));
    } catch (error) {
      console.warn('Could not save progress:', error);
    }
  }
  
  loadProgress() {
    try {
      const saved = localStorage.getItem('energyQuestProgress');
      if (saved) {
        const data = JSON.parse(saved);
        this.currentLevel = data.currentLevel || 'MainMenu';
        this.gameProgress = { ...this.gameProgress, ...data.gameProgress };
        this.updateKeysDisplay();
      }
    } catch (error) {
      console.warn('Could not load progress:', error);
    }
  }
  
  resetProgress() {
    this.currentLevel = 'MainMenu';
    this.gameProgress = {
      livingRoomCompleted: false,
      kitchenCompleted: false,
      bedroomCompleted: false,
      energyKeysCollected: 0,
      totalEnergyKeys: 3
    };
    
    this.saveProgress();
    this.updateFSMDisplay();
    this.updateKeysDisplay();
  }
  
  // Getters
  getCurrentLevel() {
    return this.currentLevel;
  }
  
  getProgress() {
    return { ...this.gameProgress };
  }
  
  isLevelCompleted(levelName) {
    switch (levelName) {
      case 'Level1_LivingRoom':
        return this.gameProgress.livingRoomCompleted;
      case 'Level2_Kitchen':
        return this.gameProgress.kitchenCompleted;
      case 'Level3_Bedroom':
        return this.gameProgress.bedroomCompleted;
      default:
        return false;
    }
  }
}

// Initialize global game state
if (typeof window !== 'undefined') {
  window.gameState = new GameState();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameState;
} else if (typeof window !== 'undefined') {
  window.GameState = GameState;
}