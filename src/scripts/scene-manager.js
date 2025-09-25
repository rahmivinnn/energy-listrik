// Unity-Style Scene Manager for Energy Quest
class SceneManager {
    constructor() {
        this.currentScene = 'MainMenu';
        this.scenes = {
            'MainMenu': {
                element: null,
                loaded: false
            },
            'PuzzleScene': {
                element: null,
                loaded: false
            },
            'Level1': {
                element: null,
                loaded: false
            },
            'Level2': {
                element: null,
                loaded: false
            },
            'Level3': {
                element: null,
                loaded: false
            },
            'Level4': {
                element: null,
                loaded: false
            },
            'Level5': {
                element: null,
                loaded: false
            }
        };
        this.isTransitioning = false;
        this.init();
    }

    init() {
        // Create scene container if it doesn't exist
        if (!document.getElementById('scene-container')) {
            const sceneContainer = document.createElement('div');
            sceneContainer.id = 'scene-container';
            sceneContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
                background: #0a0a0a;
                opacity: 0;
                visibility: hidden;
                transition: all 0.5s ease;
            `;
            document.body.appendChild(sceneContainer);
        }

        // Initialize main menu as current scene
        this.scenes['MainMenu'].element = document.getElementById('main-menu-container');
        this.scenes['MainMenu'].loaded = true;
    }

    async loadScene(sceneName) {
        if (this.isTransitioning || !this.scenes[sceneName]) {
            console.warn(`Scene ${sceneName} not found or transition in progress`);
            return;
        }

        this.isTransitioning = true;
        
        // Play transition sound effect (if available)
        this.playTransitionSound();

        try {
            // Fade out current scene
            await this.fadeOut();
            
            // Hide current scene
            this.hideCurrentScene();
            
            // Load new scene if not already loaded
            if (!this.scenes[sceneName].loaded) {
                await this.createScene(sceneName);
            }
            
            // Show new scene
            this.showScene(sceneName);
            
            // Fade in new scene
            await this.fadeIn();
            
            this.currentScene = sceneName;
            
        } catch (error) {
            console.error('Error loading scene:', error);
        } finally {
            this.isTransitioning = false;
        }
    }

    async createScene(sceneName) {
        const sceneContainer = document.getElementById('scene-container');
        
        let sceneHTML = '';
        
        switch(sceneName) {
            case 'PuzzleScene':
                sceneHTML = this.createPuzzleScene();
                break;
            case 'Level1':
                sceneHTML = this.createLevel1Scene();
                break;
            case 'Level2':
                sceneHTML = this.createLevel2Scene();
                break;
            case 'Level3':
                sceneHTML = this.createLevel3Scene();
                break;
            case 'Level4':
                sceneHTML = this.createLevel4Scene();
                break;
            case 'Level5':
                sceneHTML = this.createLevel5Scene();
                break;
            default:
                sceneHTML = this.createDefaultScene(sceneName);
        }
        
        sceneContainer.innerHTML = sceneHTML;
        this.scenes[sceneName].element = sceneContainer;
        this.scenes[sceneName].loaded = true;
        
        // Initialize scene-specific functionality
        this.initializeSceneEvents(sceneName);
    }

    createPuzzleScene() {
        return `
            <div class="scene-content puzzle-scene">
                <div class="scene-header">
                    <h1 class="scene-title">🧩 PUZZLE MODE</h1>
                    <p class="scene-subtitle">Solve Energy Puzzles</p>
                </div>
                <div class="scene-body">
                    <div class="puzzle-grid">
                        <div class="puzzle-item">
                            <i class="fas fa-lightbulb"></i>
                            <h3>Light Puzzle</h3>
                            <p>Connect the circuits to light up the room</p>
                        </div>
                        <div class="puzzle-item">
                            <i class="fas fa-plug"></i>
                            <h3>Power Puzzle</h3>
                            <p>Manage power distribution efficiently</p>
                        </div>
                        <div class="puzzle-item">
                            <i class="fas fa-battery-half"></i>
                            <h3>Battery Puzzle</h3>
                            <p>Optimize battery usage and charging</p>
                        </div>
                    </div>
                </div>
                <button class="back-btn" onclick="sceneManager.loadScene('MainMenu')">
                    <i class="fas fa-arrow-left"></i> Back to Menu
                </button>
            </div>
        `;
    }

    createLevel1Scene() {
        return `
            <div class="scene-content level-scene">
                <div class="scene-header">
                    <h1 class="scene-title">⚡ LEVEL 1</h1>
                    <p class="scene-subtitle">Basic Energy Conservation</p>
                </div>
                <div class="scene-body">
                    <div class="level-info">
                        <div class="objective">
                            <h3><i class="fas fa-target"></i> Objective</h3>
                            <p>Learn the basics of energy conservation by turning off unnecessary lights and appliances.</p>
                        </div>
                        <div class="energy-meter">
                            <h3><i class="fas fa-tachometer-alt"></i> Energy Usage</h3>
                            <div class="meter-bar">
                                <div class="meter-fill" style="width: 30%;"></div>
                            </div>
                            <p>30% - Good!</p>
                        </div>
                    </div>
                    <div class="level-actions">
                        <button class="action-btn start-btn">
                            <i class="fas fa-play"></i> Start Level
                        </button>
                        <button class="action-btn tutorial-btn">
                            <i class="fas fa-question-circle"></i> Tutorial
                        </button>
                    </div>
                </div>
                <button class="back-btn" onclick="sceneManager.loadScene('MainMenu')">
                    <i class="fas fa-arrow-left"></i> Back to Menu
                </button>
            </div>
        `;
    }

    createLevel2Scene() {
        return `
            <div class="scene-content level-scene">
                <div class="scene-header">
                    <h1 class="scene-title">🏠 LEVEL 2</h1>
                    <p class="scene-subtitle">Home Energy Management</p>
                </div>
                <div class="scene-body">
                    <div class="level-info">
                        <div class="objective">
                            <h3><i class="fas fa-target"></i> Objective</h3>
                            <p>Manage energy consumption in different rooms of a house efficiently.</p>
                        </div>
                        <div class="energy-meter">
                            <h3><i class="fas fa-tachometer-alt"></i> Energy Usage</h3>
                            <div class="meter-bar">
                                <div class="meter-fill" style="width: 45%;"></div>
                            </div>
                            <p>45% - Moderate</p>
                        </div>
                    </div>
                    <div class="level-actions">
                        <button class="action-btn start-btn">
                            <i class="fas fa-play"></i> Start Level
                        </button>
                        <button class="action-btn tutorial-btn">
                            <i class="fas fa-question-circle"></i> Tutorial
                        </button>
                    </div>
                </div>
                <button class="back-btn" onclick="sceneManager.loadScene('MainMenu')">
                    <i class="fas fa-arrow-left"></i> Back to Menu
                </button>
            </div>
        `;
    }

    createLevel3Scene() {
        return `
            <div class="scene-content level-scene">
                <div class="scene-header">
                    <h1 class="scene-title">🏭 LEVEL 3</h1>
                    <p class="scene-subtitle">Industrial Energy Optimization</p>
                </div>
                <div class="scene-body">
                    <div class="level-info">
                        <div class="objective">
                            <h3><i class="fas fa-target"></i> Objective</h3>
                            <p>Optimize energy usage in an industrial setting with multiple machines and systems.</p>
                        </div>
                        <div class="energy-meter">
                            <h3><i class="fas fa-tachometer-alt"></i> Energy Usage</h3>
                            <div class="meter-bar">
                                <div class="meter-fill" style="width: 65%;"></div>
                            </div>
                            <p>65% - High</p>
                        </div>
                    </div>
                    <div class="level-actions">
                        <button class="action-btn start-btn">
                            <i class="fas fa-play"></i> Start Level
                        </button>
                        <button class="action-btn tutorial-btn">
                            <i class="fas fa-question-circle"></i> Tutorial
                        </button>
                    </div>
                </div>
                <button class="back-btn" onclick="sceneManager.loadScene('MainMenu')">
                    <i class="fas fa-arrow-left"></i> Back to Menu
                </button>
            </div>
        `;
    }

    createLevel4Scene() {
        return `
            <div class="scene-content level-scene">
                <div class="scene-header">
                    <h1 class="scene-title">🌍 LEVEL 4</h1>
                    <p class="scene-subtitle">City-Wide Energy Grid</p>
                </div>
                <div class="scene-body">
                    <div class="level-info">
                        <div class="objective">
                            <h3><i class="fas fa-target"></i> Objective</h3>
                            <p>Manage the energy grid of an entire city, balancing supply and demand.</p>
                        </div>
                        <div class="energy-meter">
                            <h3><i class="fas fa-tachometer-alt"></i> Energy Usage</h3>
                            <div class="meter-bar">
                                <div class="meter-fill" style="width: 80%;"></div>
                            </div>
                            <p>80% - Very High</p>
                        </div>
                    </div>
                    <div class="level-actions">
                        <button class="action-btn start-btn">
                            <i class="fas fa-play"></i> Start Level
                        </button>
                        <button class="action-btn tutorial-btn">
                            <i class="fas fa-question-circle"></i> Tutorial
                        </button>
                    </div>
                </div>
                <button class="back-btn" onclick="sceneManager.loadScene('MainMenu')">
                    <i class="fas fa-arrow-left"></i> Back to Menu
                </button>
            </div>
        `;
    }

    createLevel5Scene() {
        return `
            <div class="scene-content level-scene">
                <div class="scene-header">
                    <h1 class="scene-title">🚀 LEVEL 5</h1>
                    <p class="scene-subtitle">Future Energy Technologies</p>
                </div>
                <div class="scene-body">
                    <div class="level-info">
                        <div class="objective">
                            <h3><i class="fas fa-target"></i> Objective</h3>
                            <p>Master advanced energy technologies including renewable sources and smart grids.</p>
                        </div>
                        <div class="energy-meter">
                            <h3><i class="fas fa-tachometer-alt"></i> Energy Usage</h3>
                            <div class="meter-bar">
                                <div class="meter-fill" style="width: 95%;"></div>
                            </div>
                            <p>95% - Maximum Challenge</p>
                        </div>
                    </div>
                    <div class="level-actions">
                        <button class="action-btn start-btn">
                            <i class="fas fa-play"></i> Start Level
                        </button>
                        <button class="action-btn tutorial-btn">
                            <i class="fas fa-question-circle"></i> Tutorial
                        </button>
                    </div>
                </div>
                <button class="back-btn" onclick="sceneManager.loadScene('MainMenu')">
                    <i class="fas fa-arrow-left"></i> Back to Menu
                </button>
            </div>
        `;
    }

    createDefaultScene(sceneName) {
        return `
            <div class="scene-content default-scene">
                <div class="scene-header">
                    <h1 class="scene-title">🎮 ${sceneName.toUpperCase()}</h1>
                    <p class="scene-subtitle">Coming Soon</p>
                </div>
                <div class="scene-body">
                    <div class="coming-soon">
                        <i class="fas fa-cog fa-spin"></i>
                        <h3>Under Development</h3>
                        <p>This scene is currently being developed. Check back soon!</p>
                    </div>
                </div>
                <button class="back-btn" onclick="sceneManager.loadScene('MainMenu')">
                    <i class="fas fa-arrow-left"></i> Back to Menu
                </button>
            </div>
        `;
    }

    initializeSceneEvents(sceneName) {
        // Add event listeners for scene-specific interactions
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (btn.classList.contains('start-btn')) {
                    this.startLevel(sceneName);
                } else if (btn.classList.contains('tutorial-btn')) {
                    this.showTutorial(sceneName);
                }
            });
        });

        // Add hover effects
        const interactiveElements = document.querySelectorAll('.puzzle-item, .action-btn');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'scale(1.05)';
                element.style.boxShadow = '0 10px 30px rgba(0, 191, 255, 0.3)';
            });
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'scale(1)';
                element.style.boxShadow = 'none';
            });
        });
    }

    startLevel(sceneName) {
        console.log(`Starting ${sceneName}...`);
        // Here you would implement the actual level gameplay
        alert(`Starting ${sceneName}! (Gameplay implementation coming soon)`);
    }

    showTutorial(sceneName) {
        console.log(`Showing tutorial for ${sceneName}...`);
        // Here you would show tutorial content
        alert(`Tutorial for ${sceneName}! (Tutorial implementation coming soon)`);
    }

    hideCurrentScene() {
        if (this.currentScene === 'MainMenu') {
            const mainMenu = document.getElementById('main-menu-container');
            if (mainMenu) {
                mainMenu.style.display = 'none';
            }
        } else {
            const sceneContainer = document.getElementById('scene-container');
            if (sceneContainer) {
                sceneContainer.style.visibility = 'hidden';
                sceneContainer.style.opacity = '0';
            }
        }
    }

    showScene(sceneName) {
        if (sceneName === 'MainMenu') {
            const mainMenu = document.getElementById('main-menu-container');
            if (mainMenu) {
                mainMenu.style.display = 'flex';
            }
            const sceneContainer = document.getElementById('scene-container');
            if (sceneContainer) {
                sceneContainer.style.visibility = 'hidden';
                sceneContainer.style.opacity = '0';
            }
        } else {
            const mainMenu = document.getElementById('main-menu-container');
            if (mainMenu) {
                mainMenu.style.display = 'none';
            }
            const sceneContainer = document.getElementById('scene-container');
            if (sceneContainer) {
                sceneContainer.style.visibility = 'visible';
                sceneContainer.style.opacity = '1';
            }
        }
    }

    async fadeOut() {
        return new Promise(resolve => {
            const overlay = this.createTransitionOverlay();
            overlay.style.opacity = '1';
            setTimeout(resolve, 250);
        });
    }

    async fadeIn() {
        return new Promise(resolve => {
            setTimeout(() => {
                const overlay = document.getElementById('transition-overlay');
                if (overlay) {
                    overlay.style.opacity = '0';
                    setTimeout(() => {
                        overlay.remove();
                        resolve();
                    }, 250);
                } else {
                    resolve();
                }
            }, 100);
        });
    }

    createTransitionOverlay() {
        let overlay = document.getElementById('transition-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'transition-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, #0a0a0a, #1a1a2e, #16213e);
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.25s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #FFD700;
                font-family: 'Orbitron', sans-serif;
                font-size: 1.5rem;
            `;
            overlay.innerHTML = '<i class="fas fa-bolt fa-spin"></i> Loading...';
            document.body.appendChild(overlay);
        }
        return overlay;
    }

    playTransitionSound() {
        // Play transition sound effect if audio is available
        try {
            const audio = new Audio();
            audio.volume = 0.3;
            // You can add a transition sound file here
            // audio.src = 'path/to/transition-sound.mp3';
            // audio.play();
        } catch (error) {
            // Silently fail if audio is not available
        }
    }

    // Public method to load scene (called from HTML)
    static loadScene(sceneName) {
        if (window.sceneManager) {
            window.sceneManager.loadScene(sceneName);
        }
    }
}

// Initialize scene manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sceneManager = new SceneManager();
});

// Global function for easy access
function loadScene(sceneName) {
    SceneManager.loadScene(sceneName);
}