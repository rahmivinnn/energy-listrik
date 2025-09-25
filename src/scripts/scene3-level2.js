// Scene 3 Level 2: 厨房能效管理

class Scene3Level2 {
    constructor() {
        this.container = document.getElementById('scene3-level2-container');
        this.gameState = {
            powerLevel: 150, // 初始功率 (冰箱基础功耗)
            efficiencyScore: 0,
            naturalLightActive: false,
            targetEfficiency: 60, // 目标功率阈值
            levelCompleted: false,
            energyKeys: 0
        };
        
        this.devices = {
            window: { power: 0, status: 'closed', lightReduction: 8 },
            'main-light': { power: 15, status: 'off' },
            fridge: { power: 150, status: 'on', doorTimer: 0 },
            'rice-cooker': { power: 0, status: 'off', mode: 'normal', normalPower: 300, ecoPower: 210 },
            fan: { power: 0, status: 'off', normalPower: 45 },
            iron: { power: 0, status: 'off', normalPower: 1200, idleTimer: 0 }
        };
        
        this.timers = {
            fridgeWarning: null,
            ironIdle: null,
            efficiencyCheck: null
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAudio();
        this.setupKitchenGuide();
        this.startEfficiencyMonitoring();
        this.updatePowerMeter();
        this.updateDeviceStatus();
        this.showHelperTooltip('试试打开窗户来替代电灯照明', 3000);
    }

    setupEventListeners() {
        // 设备交互事件
        document.getElementById('window-obj').addEventListener('click', () => {
            this.toggleWindow();
        });

        document.getElementById('main-light-obj').addEventListener('click', () => {
            this.toggleMainLight();
        });

        document.getElementById('fridge-obj').addEventListener('click', () => {
            this.toggleFridge();
        });

        document.getElementById('rice-cooker-obj').addEventListener('click', () => {
            this.toggleRiceCooker();
        });

        document.getElementById('fan-obj').addEventListener('click', () => {
            this.toggleFan();
        });

        document.getElementById('iron-obj').addEventListener('click', () => {
            this.toggleIron();
        });

        // 电饭煲模式按钮
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.setRiceCookerMode(btn.dataset.mode);
            });
        });

        // UI 控制事件
        document.getElementById('hint-close').addEventListener('click', () => {
            this.hideHint();
        });

        document.getElementById('success-continue').addEventListener('click', () => {
            this.hideSuccessMessage();
            this.proceedToNextLevel();
        });

        document.getElementById('edu-close').addEventListener('click', () => {
            this.hideEducationalPopup();
        });

        document.getElementById('edu-expand-btn').addEventListener('click', () => {
            this.expandEducationalContent();
        });

        document.getElementById('helper-close').addEventListener('click', () => {
            this.hideHelperTooltip();
        });

        // Chef Eco karakter interaksi
        document.getElementById('kitchen-guide').addEventListener('click', () => {
            this.interactWithChefEco();
        });
    }

    setupAudio() {
        this.sounds = {
            ding: document.getElementById('sfx-ding'),
            buzz: document.getElementById('sfx-buzz'),
            click: document.getElementById('sfx-click'),
            ambient: document.getElementById('ambient-kitchen')
        };
        
        // Setup background music
        this.setupBackgroundMusic();
        
        // 播放环境音效
        this.playAmbientSound();
    }

    setupBackgroundMusic() {
        // Create background music element
        this.backgroundMusic = new Audio('public/audio/background_music.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;
        
        // Create dramatic sound element
        this.dramaticSound = new Audio('public/audio/dramatic_sound.mp3');
        this.dramaticSound.volume = 0.5;
        
        // Start background music
        this.backgroundMusic.play().catch(e => {
            console.log('Background music autoplay prevented:', e);
            // Play on first user interaction
            document.addEventListener('click', () => {
                this.backgroundMusic.play();
            }, { once: true });
        });
    }

    playDramaticSound() {
        if (this.dramaticSound) {
            this.dramaticSound.currentTime = 0;
            this.dramaticSound.play().catch(e => {
                console.log('Dramatic sound play failed:', e);
            });
        }
    }

    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
        }
    }

    resumeBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.play();
        }
    }

    // 显示场景
    show() {
        this.container.classList.remove('hidden');
        setTimeout(() => {
            this.container.style.opacity = '1';
        }, 100);
    }

    // 隐藏场景
    hide() {
        this.container.style.opacity = '0';
        setTimeout(() => {
            this.container.classList.add('hidden');
        }, 500);
    }

    // 设备交互方法
    toggleWindow() {
        const windowObj = document.getElementById('window-obj');
        const windowPanels = document.getElementById('window-panels');
        const device = this.devices.window;
        
        if (device.status === 'closed') {
            // 打开窗户
            device.status = 'open';
            windowPanels.classList.add('open');
            windowObj.classList.add('active');
            
            // 自然光效果
            this.gameState.naturalLightActive = true;
            this.adjustPowerForNaturalLight();
            
            this.playSound('click');
            this.addEfficiencyScore(10);
            this.showHint('自然光已激活！照明能耗降低', 3000);
            this.updateObjectiveStatus('obj-natural-light', true);
            this.triggerChefEcoReaction('window_opened');
            
            // 显示教育信息
            setTimeout(() => {
                this.showEducationalPopup(
                    '自然光的优势',
                    '利用自然光可以显著降低照明能耗，同时提供更好的照明质量。',
                    '自然光不仅免费，还能提供更均匀的照明，减少眼部疲劳。合理利用窗户朝向和窗帘控制，可以最大化自然光的利用效率。在白天充分利用自然光，可以减少30-50%的照明用电。'
                );
            }, 1000);
        } else {
            // 关闭窗户
            device.status = 'closed';
            windowPanels.classList.remove('open');
            windowObj.classList.remove('active');
            
            this.gameState.naturalLightActive = false;
            this.adjustPowerForNaturalLight();
            
            this.playSound('click');
            this.showHint('窗户已关闭，自然光效果消失');
        }
        
        this.updateDeviceStatus();
        this.updatePowerMeter();
    }

    toggleMainLight() {
        const lightObj = document.getElementById('main-light-obj');
        const device = this.devices['main-light'];
        
        if (device.status === 'off') {
            device.status = 'on';
            lightObj.classList.add('on');
            this.gameState.powerLevel += device.power;
            
            this.playSound('click');
            
            // 如果自然光已开启，提示用户
            if (this.gameState.naturalLightActive) {
                this.showHint('自然光充足时可以关闭电灯节能', 4000);
            }
        } else {
            device.status = 'off';
            lightObj.classList.remove('on');
            this.gameState.powerLevel -= device.power;
            
            this.playSound('click');
            this.addEfficiencyScore(5);
        }
        
        this.updateDeviceStatus();
        this.updatePowerMeter();
    }

    toggleFridge() {
        const fridgeObj = document.getElementById('fridge-obj');
        const fridgeDoor = document.getElementById('fridge-door');
        const device = this.devices.fridge;
        
        if (fridgeDoor.classList.contains('closed')) {
            // 打开冰箱门
            fridgeDoor.classList.remove('closed');
            fridgeDoor.classList.add('open');
            
            this.playSound('click');
            
            // 开始计时器
            this.startFridgeTimer();
        } else {
            // 关闭冰箱门
            fridgeDoor.classList.remove('open');
            fridgeDoor.classList.add('closed');
            
            this.playSound('click');
            
            // 检查关闭速度
            if (device.doorTimer < 2) {
                this.addEfficiencyScore(5);
                this.playSound('ding');
                this.showHint('快速关闭冰箱门，节能+5分！', 2000);
            }
            
            this.stopFridgeTimer();
        }
    }

    startFridgeTimer() {
        const device = this.devices.fridge;
        device.doorTimer = 0;
        
        const timerInterval = setInterval(() => {
            device.doorTimer++;
            
            if (device.doorTimer >= 5) {
                // 显示警告
                this.showFridgeWarning();
                this.gameState.powerLevel += 15; // 增加能耗
                this.updatePowerMeter();
                this.triggerChefEcoReaction('fridge_opened_long');
                
                if (device.doorTimer >= 10) {
                    // 自动关闭并扣分
                    document.getElementById('fridge-door').classList.remove('open');
                    document.getElementById('fridge-door').classList.add('closed');
                    this.hideFridgeWarning();
                    this.addEfficiencyScore(-10);
                    this.showHint('冰箱门开启过久，能效降低！', 3000);
                    clearInterval(timerInterval);
                }
            }
        }, 1000);
        
        this.timers.fridgeWarning = timerInterval;
    }

    stopFridgeTimer() {
        if (this.timers.fridgeWarning) {
            clearInterval(this.timers.fridgeWarning);
            this.timers.fridgeWarning = null;
        }
        
        this.hideFridgeWarning();
        
        // 恢复正常功耗
        if (this.devices.fridge.doorTimer >= 5) {
            this.gameState.powerLevel -= 15;
            this.updatePowerMeter();
        }
        
        this.devices.fridge.doorTimer = 0;
    }

    toggleRiceCooker() {
        const cookerObj = document.getElementById('rice-cooker-obj');
        const device = this.devices['rice-cooker'];
        
        if (device.status === 'off') {
            device.status = 'on';
            cookerObj.classList.add('on');
            
            const power = device.mode === 'eco' ? device.ecoPower : device.normalPower;
            device.power = power;
            this.gameState.powerLevel += power;
            
            this.playSound('click');
            this.showHint('电饭煲已启动。试试切换到节能模式！', 4000);
        } else {
            device.status = 'off';
            cookerObj.classList.remove('on');
            
            this.gameState.powerLevel -= device.power;
            device.power = 0;
            
            this.playSound('click');
            this.addEfficiencyScore(3);
        }
        
        this.updateDeviceStatus();
        this.updatePowerMeter();
    }

    setRiceCookerMode(mode) {
        const device = this.devices['rice-cooker'];
        const modeDisplay = document.getElementById('cooker-mode');
        const buttons = document.querySelectorAll('.mode-btn');
        
        // 更新按钮状态
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            }
        });
        
        // 更新模式
        const oldPower = device.power;
        device.mode = mode;
        
        if (device.status === 'on') {
            const newPower = mode === 'eco' ? device.ecoPower : device.normalPower;
            this.gameState.powerLevel = this.gameState.powerLevel - oldPower + newPower;
            device.power = newPower;
            
            if (mode === 'eco') {
                this.addEfficiencyScore(8);
                this.playSound('ding');
                this.showHint('节能模式已启用，功耗降低30%！', 3000);
                this.triggerChefEcoReaction('eco_mode_activated');
            }
        }
        
        modeDisplay.textContent = mode === 'eco' ? '节能' : '普通';
        this.updateDeviceStatus();
        this.updatePowerMeter();
    }

    toggleFan() {
        const fanObj = document.getElementById('fan-obj');
        const device = this.devices.fan;
        
        if (device.status === 'off') {
            device.status = 'on';
            fanObj.classList.add('on');
            device.power = device.normalPower;
            this.gameState.powerLevel += device.power;
            
            this.playSound('click');
        } else {
            device.status = 'off';
            fanObj.classList.remove('on');
            this.gameState.powerLevel -= device.power;
            device.power = 0;
            
            this.playSound('click');
            this.addEfficiencyScore(2);
        }
        
        this.updateDeviceStatus();
        this.updatePowerMeter();
    }

    toggleIron() {
        const ironObj = document.getElementById('iron-obj');
        const device = this.devices.iron;
        
        if (device.status === 'off') {
            device.status = 'on';
            ironObj.classList.add('on');
            device.power = device.normalPower;
            this.gameState.powerLevel += device.power;
            
            this.playSound('click');
            this.showHint('熨斗功率很高，不用时请及时关闭', 4000);
            
            // 开始空闲计时器
            this.startIronIdleTimer();
        } else {
            device.status = 'off';
            ironObj.classList.remove('on');
            this.gameState.powerLevel -= device.power;
            device.power = 0;
            
            this.playSound('click');
            this.addEfficiencyScore(5);
            
            this.stopIronIdleTimer();
        }
        
        this.updateDeviceStatus();
        this.updatePowerMeter();
    }

    startIronIdleTimer() {
        const device = this.devices.iron;
        device.idleTimer = 0;
        
        this.timers.ironIdle = setInterval(() => {
            device.idleTimer++;
            
            if (device.idleTimer >= 30) { // 30秒提醒
                this.showHint('熨斗空闲时间过长，建议关闭以节能', 3000);
                clearInterval(this.timers.ironIdle);
            }
        }, 1000);
    }

    stopIronIdleTimer() {
        if (this.timers.ironIdle) {
            clearInterval(this.timers.ironIdle);
            this.timers.ironIdle = null;
        }
        this.devices.iron.idleTimer = 0;
    }

    // 自然光功率调整
    adjustPowerForNaturalLight() {
        const lightDevice = this.devices['main-light'];
        
        if (this.gameState.naturalLightActive && lightDevice.status === 'on') {
            // 如果自然光开启且电灯也开着，建议关闭电灯
            setTimeout(() => {
                this.showHint('自然光充足，可以关闭电灯节能', 4000);
            }, 2000);
        }
    }

    // 功率表更新
    updatePowerMeter() {
        const powerLevel = document.getElementById('power-level');
        const currentPower = document.getElementById('current-power');
        
        // 限制功率范围
        const clampedPower = Math.max(0, Math.min(100, this.gameState.powerLevel));
        const percentage = clampedPower;
        
        // 更新显示
        currentPower.textContent = Math.round(this.gameState.powerLevel);
        powerLevel.style.height = `${percentage}%`;
        
        // 更新颜色区域
        if (percentage <= 60) {
            powerLevel.setAttribute('data-level', 'green');
            if (this.gameState.efficiencyScore > 50) {
                this.triggerChefEcoReaction('efficiency_achieved');
            }
        } else if (percentage <= 80) {
            powerLevel.setAttribute('data-level', 'yellow');
        } else {
            powerLevel.setAttribute('data-level', 'red');
            this.triggerChefEcoReaction('high_power_warning');
        }
        
        // 检查目标达成
        this.checkEfficiencyTarget();
    }

    // 设备状态更新
    updateDeviceStatus() {
        Object.keys(this.devices).forEach(deviceName => {
            const device = this.devices[deviceName];
            const deviceItem = document.querySelector(`[data-device="${deviceName}"]`);
            
            if (deviceItem) {
                const statusElement = deviceItem.querySelector('.device-status');
                const powerElement = deviceItem.querySelector('.device-power');
                
                // 添加null检查防止错误
                if (statusElement && powerElement) {
                    // 更新状态显示
                    let statusText = device.status;
                    if (deviceName === 'window') {
                        statusText = device.status === 'open' ? '开启' : '关闭';
                    } else if (deviceName === 'rice-cooker' && device.status === 'on') {
                        statusText = `运行(${device.mode === 'eco' ? '节能' : '普通'})`;
                    } else {
                        statusText = device.status === 'on' ? '运行' : '关闭';
                    }
                    
                    statusElement.textContent = statusText;
                    statusElement.className = `device-status ${device.status === 'on' || device.status === 'open' ? '' : 'off'}`;
                    
                    // 更新功率显示
                    powerElement.textContent = `${device.power}W`;
                }
            }
        });
    }

    // 效率监控
    startEfficiencyMonitoring() {
        this.timers.efficiencyCheck = setInterval(() => {
            this.checkEfficiencyTarget();
        }, 2000);
    }

    checkEfficiencyTarget() {
        if (this.gameState.powerLevel <= this.gameState.targetEfficiency) {
            this.updateObjectiveStatus('obj-power-meter', true);
            
            if (this.gameState.naturalLightActive) {
                this.addEfficiencyScore(2); // 持续奖励
            }
            
            // 检查是否完成所有目标
            if (this.gameState.efficiencyScore >= 50 && !this.gameState.levelCompleted) {
                this.completeLevel();
            }
        } else {
            this.updateObjectiveStatus('obj-power-meter', false);
        }
    }

    addEfficiencyScore(points) {
        this.gameState.efficiencyScore += points;
        this.gameState.efficiencyScore = Math.max(0, this.gameState.efficiencyScore);
        
        const scoreDisplay = document.getElementById('efficiency-points');
        scoreDisplay.textContent = this.gameState.efficiencyScore;
        
        // 动画效果
        scoreDisplay.style.transform = 'scale(1.2)';
        setTimeout(() => {
            scoreDisplay.style.transform = 'scale(1)';
        }, 300);
        
        if (this.gameState.efficiencyScore >= 30) {
            this.updateObjectiveStatus('obj-efficiency', true);
        }
    }

    completeLevel() {
        this.gameState.levelCompleted = true;
        
        // 停止所有计时器
        Object.values(this.timers).forEach(timer => {
            if (timer) clearInterval(timer);
        });
        
        // 播放成功音效和dramatic sound
        this.playSound('ding');
        this.playDramaticSound();
        
        // 奖励能量钥匙
        this.awardEnergyKey();
        
        // 显示成功消息
        this.showSuccessMessage(
            '厨房能效管理完成！',
            `你成功管理了厨房的能源使用，获得了${this.gameState.efficiencyScore}分效率得分。现在可以前往实验室学习更多能源知识！`
        );
        
        // 显示教育信息
        setTimeout(() => {
            this.showEducationalPopup(
                '能效管理总结',
                '通过合理使用设备和利用自然资源，可以显著降低能耗。',
                '能效管理的关键在于：1) 充分利用自然光源；2) 选择节能模式的设备；3) 及时关闭不必要的电器；4) 避免设备空转浪费。这些习惯在日常生活中同样适用，可以帮助节约电费并保护环境。'
            );
        }, 3000);
    }

    // UI 更新方法
    updateObjectiveStatus(objectiveId, completed) {
        const objective = document.getElementById(objectiveId);
        const status = objective.querySelector('.obj-status');
        
        if (completed) {
            objective.classList.add('completed');
            status.textContent = '✅';
        } else {
            objective.classList.remove('completed');
            status.textContent = '⏳';
        }
    }

    awardEnergyKey() {
        this.gameState.energyKeys++;
        
        const keyContainer = document.getElementById('energy-keys-container');
        const keyElement = document.createElement('div');
        keyElement.className = 'energy-key';
        keyElement.innerHTML = '🔑';
        
        keyContainer.appendChild(keyElement);
        
        // 播放获得钥匙的动画
        keyElement.style.transform = 'scale(0)';
        setTimeout(() => {
            keyElement.style.transform = 'scale(1)';
            keyElement.style.transition = 'transform 0.5s ease';
        }, 100);
    }

    // 消息和提示方法
    showHint(message, duration = 5000) {
        const hintBubble = document.getElementById('hint-bubble');
        const hintText = document.getElementById('hint-text');
        
        hintText.textContent = message;
        hintBubble.classList.remove('hidden');
        
        if (duration > 0) {
            setTimeout(() => {
                this.hideHint();
            }, duration);
        }
    }

    hideHint() {
        document.getElementById('hint-bubble').classList.add('hidden');
    }

    showSuccessMessage(title, text) {
        document.getElementById('success-title').textContent = title;
        document.getElementById('success-text').textContent = text;
        document.getElementById('success-message').classList.remove('hidden');
    }

    hideSuccessMessage() {
        document.getElementById('success-message').classList.add('hidden');
    }

    showEducationalPopup(title, content, detail) {
        document.getElementById('edu-title').textContent = title;
        document.getElementById('edu-content').textContent = content;
        document.getElementById('edu-detail').textContent = detail;
        document.getElementById('educational-popup').classList.remove('hidden');
    }

    hideEducationalPopup() {
        document.getElementById('educational-popup').classList.add('hidden');
    }

    expandEducationalContent() {
        const detail = document.getElementById('edu-detail');
        const btn = document.getElementById('edu-expand-btn');
        
        if (detail.classList.contains('expanded')) {
            detail.classList.remove('expanded');
            btn.textContent = '了解更多';
        } else {
            detail.classList.add('expanded');
            btn.textContent = '收起';
        }
    }

    showFridgeWarning() {
        const warning = document.getElementById('fridge-warning');
        const timer = document.getElementById('fridge-timer');
        
        warning.classList.remove('hidden');
        
        const updateTimer = () => {
            const remaining = Math.max(0, 10 - this.devices.fridge.doorTimer);
            timer.textContent = remaining;
        };
        
        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);
        
        setTimeout(() => {
            clearInterval(timerInterval);
        }, 5000);
    }

    hideFridgeWarning() {
        document.getElementById('fridge-warning').classList.add('hidden');
    }

    showHelperTooltip(message, duration = 0) {
        const tooltip = document.getElementById('helper-tooltip');
        const text = document.getElementById('helper-text');
        
        text.textContent = message;
        tooltip.classList.remove('hidden');
        
        if (duration > 0) {
            setTimeout(() => {
                this.hideHelperTooltip();
            }, duration);
        }
    }

    hideHelperTooltip() {
        document.getElementById('helper-tooltip').classList.add('hidden');
    }

    // 音频方法
    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(e => {
                console.log('Audio play failed:', e);
            });
        }
    }

    playAmbientSound() {
        if (this.sounds.ambient) {
            this.sounds.ambient.volume = 0.3;
            this.sounds.ambient.play().catch(e => {
                console.log('Ambient audio play failed:', e);
            });
        }
    }

    stopAmbientSound() {
        if (this.sounds.ambient) {
            this.sounds.ambient.pause();
        }
    }

    // 关卡过渡
    proceedToNextLevel() {
        console.log('准备进入 Scene 4 - Level 3: 实验室');
        
        if (window.gameManager) {
            window.gameManager.loadScene('scene4-level3');
        }
    }

    // 清理资源
    cleanup() {
        // 停止所有计时器
        Object.values(this.timers).forEach(timer => {
            if (timer) clearInterval(timer);
        });
        
        // 停止环境音效
        this.stopAmbientSound();
    }

    // 获取游戏状态
    getGameState() {
        return { 
            ...this.gameState,
            devices: { ...this.devices }
        };
    }

    // 设置游戏状态
    setGameState(state) {
        this.gameState = { ...this.gameState, ...state };
        if (state.devices) {
            this.devices = { ...this.devices, ...state.devices };
        }
        this.updatePowerMeter();
        this.updateDeviceStatus();
    }
    // === CHEF ECO CHARACTER METHODS ===
    setupKitchenGuide() {
        this.chefEco = {
            element: document.getElementById('kitchen-guide'),
            speechBubble: document.getElementById('guide-speech'),
            speechText: document.getElementById('guide-speech-text'),
            currentTipIndex: 0,
            isActive: false,
            tips: [
                "Halo! Saya Chef Eco, ahli hemat energi dapur!",
                "Coba buka jendela untuk menggunakan cahaya alami dan hemat listrik!",
                "Kulkas yang sering dibuka akan boros energi. Tutup dengan cepat!",
                "Rice cooker mode eco bisa menghemat hingga 30% energi!",
                "Matikan peralatan yang tidak digunakan untuk efisiensi maksimal!",
                "Kipas angin lebih hemat daripada AC untuk sirkulasi udara!",
                "Setrika yang dibiarkan menyala tanpa digunakan sangat boros!",
                "Kombinasi cahaya alami dan peralatan hemat energi = dapur eco-friendly!"
            ],
            contextualTips: {
                windowOpen: "Bagus! Cahaya alami menghemat 8W listrik!",
                fridgeOpen: "Hati-hati! Kulkas terbuka terlalu lama akan boros energi!",
                ecoMode: "Excellent! Mode eco menghemat energi tanpa mengurangi kualitas!",
                highPower: "Wah! Konsumsi listrik tinggi. Coba matikan beberapa peralatan!",
                efficient: "Perfect! Dapur Anda sudah sangat hemat energi!"
            }
        };
        
        // Auto-introduction setelah 2 detik
        setTimeout(() => {
            this.showChefEcoTip(this.chefEco.tips[0]);
        }, 2000);
        
        // Tips berkala setiap 15 detik
        setInterval(() => {
            if (!this.chefEco.isActive && Math.random() < 0.3) {
                this.showRandomTip();
            }
        }, 15000);
    }
    
    interactWithChefEco() {
        if (this.chefEco.isActive) {
            this.hideChefEcoSpeech();
            return;
        }
        
        // Berikan tip berdasarkan kondisi saat ini
        let tip = this.getContextualTip();
        this.showChefEcoTip(tip);
        
        // Tambahkan animasi excited
        this.chefEco.element.classList.add('excited');
        setTimeout(() => {
            this.chefEco.element.classList.remove('excited');
        }, 1200);
        
        // Play sound effect
        this.playSound('click');
    }
    
    showChefEcoTip(message) {
        this.chefEco.speechText.textContent = message;
        this.chefEco.speechBubble.classList.remove('hidden');
        this.chefEco.element.classList.add('speaking');
        this.chefEco.isActive = true;
        
        // Auto-hide setelah 5 detik
        setTimeout(() => {
            this.hideChefEcoSpeech();
        }, 5000);
    }
    
    hideChefEcoSpeech() {
        this.chefEco.speechBubble.classList.add('hidden');
        this.chefEco.element.classList.remove('speaking');
        this.chefEco.isActive = false;
    }
    
    getContextualTip() {
        const { contextualTips } = this.chefEco;
        
        // Cek kondisi saat ini dan berikan tip yang relevan
        if (this.gameState.powerLevel > 400) {
            return contextualTips.highPower;
        } else if (this.gameState.efficiencyScore > 80) {
            return contextualTips.efficient;
        } else if (this.devices.window.status === 'open') {
            return contextualTips.windowOpen;
        } else if (this.devices.fridge.doorTimer > 0) {
            return contextualTips.fridgeOpen;
        } else if (this.devices['rice-cooker'].mode === 'eco') {
            return contextualTips.ecoMode;
        } else {
            // Berikan tip umum berikutnya
            this.chefEco.currentTipIndex = (this.chefEco.currentTipIndex + 1) % this.chefEco.tips.length;
            return this.chefEco.tips[this.chefEco.currentTipIndex];
        }
    }
    
    showRandomTip() {
        const randomIndex = Math.floor(Math.random() * this.chefEco.tips.length);
        this.showChefEcoTip(this.chefEco.tips[randomIndex]);
    }
    
    // Trigger tips berdasarkan aksi pemain
    triggerChefEcoReaction(action) {
        if (this.chefEco.isActive) return;
        
        const { contextualTips } = this.chefEco;
        let tip = null;
        
        switch(action) {
            case 'window_opened':
                tip = contextualTips.windowOpen;
                break;
            case 'fridge_opened_long':
                tip = contextualTips.fridgeOpen;
                break;
            case 'eco_mode_activated':
                tip = contextualTips.ecoMode;
                break;
            case 'high_power_warning':
                tip = contextualTips.highPower;
                break;
            case 'efficiency_achieved':
                tip = contextualTips.efficient;
                break;
        }
        
        if (tip) {
            setTimeout(() => {
                this.showChefEcoTip(tip);
            }, 1000);
        }
    }
}

// 导出类
window.Scene3Level2 = Scene3Level2;

// 当DOM加载完成时初始化
document.addEventListener('DOMContentLoaded', () => {
    if (!window.scene3Level2) {
        window.scene3Level2 = new Scene3Level2();
    }
});