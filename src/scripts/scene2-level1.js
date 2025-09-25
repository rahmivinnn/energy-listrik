// Scene 2 Level 1: 客厅基础电路

class Scene2Level1 {
    constructor() {
        this.container = document.getElementById('scene2-level1-container');
        this.gameState = {
            livingRoomPower: false,
            cablePuzzleCompleted: false,
            tvPuzzleCompleted: false,
            energyKeys: 0,
            currentStep: 1
        };
        
        this.circuitComponents = new Map();
        this.connections = [];
        this.draggedComponent = null;
        this.tvSequence = ['cable', 'switch', 'power', 'channel'];
        this.currentTvStep = 0;
        
        this.init();
    }

    init() {
        // Pastikan container ditampilkan
        if (this.container) {
            this.container.style.display = 'block';
            this.container.style.opacity = '1';
        }
        
        // Pastikan puzzle-game-container disembunyikan di scene ini
        const puzzleContainer = document.getElementById('puzzle-game-container');
        if (puzzleContainer) {
            puzzleContainer.style.display = 'none';
        }
        
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.setupAudio();
        this.setupBackgroundMusic();
        this.setupCharacterGuide();
        this.showHint('点击电缆工作台开始修复电路');
    }

    setupEventListeners() {
        // 交互对象点击事件
        document.getElementById('cable-table-obj').addEventListener('click', () => {
            this.openCablePuzzle();
        });

        document.getElementById('tv-obj').addEventListener('click', () => {
            if (this.gameState.cablePuzzleCompleted) {
                this.openTvPuzzle();
            } else {
                this.showHint('请先修复电路连接');
                this.triggerCharacterReaction('energy_tip');
            }
        });
        
        // Lampu click untuk tips hemat energi
        document.getElementById('lamp-obj').addEventListener('click', () => {
            if (this.gameState.livingRoomPower) {
                this.triggerCharacterReaction('energy_tip');
            } else {
                this.showHint('Lampu belum bisa dinyalakan. Perbaiki sirkuit dulu!');
            }
        });
        
        // Switch click untuk interaksi
        document.getElementById('switch-obj').addEventListener('click', () => {
            const switchObj = document.getElementById('switch-obj');
            if (this.gameState.cablePuzzleCompleted) {
                switchObj.classList.toggle('active');
                this.triggerCharacterReaction('energy_tip');
            } else {
                this.showHint('Perbaiki sirkuit terlebih dahulu!');
            }
        });

        // Puzzle 关闭按钮
        document.getElementById('cable-puzzle-close').addEventListener('click', () => {
            this.closeCablePuzzle();
        });

        document.getElementById('tv-puzzle-close').addEventListener('click', () => {
            this.closeTvPuzzle();
        });

        // 电路测试按钮
        document.getElementById('test-circuit').addEventListener('click', () => {
            this.testCircuit();
        });

        document.getElementById('reset-circuit').addEventListener('click', () => {
            this.resetCircuit();
        });

        // TV 控制步骤
        document.querySelectorAll('.control-step').forEach((step, index) => {
            step.addEventListener('click', () => {
                this.handleTvStep(index + 1);
            });
        });

        // 提示关闭
        document.getElementById('hint-close').addEventListener('click', () => {
            this.hideHint();
        });

        // 角色助手点击事件
        document.getElementById('character-guide').addEventListener('click', () => {
            this.showCharacterTip();
        });
        
        // Battery click untuk tips
        document.getElementById('battery-obj').addEventListener('click', () => {
            this.triggerCharacterReaction('energy_tip');
        });

        // 成功消息继续
        document.getElementById('success-continue').addEventListener('click', () => {
            this.hideSuccessMessage();
        });

        // 教育弹窗
        document.getElementById('edu-close').addEventListener('click', () => {
            this.hideEducationalPopup();
        });

        document.getElementById('edu-expand-btn').addEventListener('click', () => {
            this.expandEducationalContent();
        });
    }

    setupDragAndDrop() {
        const components = document.querySelectorAll('.component');
        const slots = document.querySelectorAll('.grid-slot');

        components.forEach(component => {
            component.addEventListener('dragstart', (e) => {
                this.handleDragStart(e);
            });

            component.addEventListener('dragend', (e) => {
                this.handleDragEnd(e);
            });
        });

        slots.forEach(slot => {
            slot.addEventListener('dragover', (e) => {
                this.handleDragOver(e);
            });

            slot.addEventListener('drop', (e) => {
                this.handleDrop(e);
            });

            slot.addEventListener('dragleave', (e) => {
                this.handleDragLeave(e);
            });
        });
    }

    setupAudio() {
        this.sounds = {
            success: document.getElementById('sfx-click-success'),
            buzz: document.getElementById('sfx-buzz'),
            ding: document.getElementById('sfx-ding')
        };
    }

    setupBackgroundMusic() {
        // Setup background music dari HTML audio element
        this.backgroundMusic = document.getElementById('background-music');
        this.dramaticSound = document.getElementById('dramatic-sound');
        
        // Set volume untuk background music
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = 0.3; // Set volume to 30%
            
            // Start background music
            this.backgroundMusic.play().catch(e => {
                console.log('Background music autoplay prevented:', e);
                // Jika autoplay diblokir, play saat user pertama kali berinteraksi
                document.addEventListener('click', () => {
                    this.backgroundMusic.play();
                }, { once: true });
            });
        }
        
        // Set volume untuk dramatic sound
        if (this.dramaticSound) {
            this.dramaticSound.volume = 0.5; // Set volume to 50%
        }
    }

    playDramaticSound() {
        if (this.dramaticSound) {
            this.dramaticSound.volume = 0.7;
            this.dramaticSound.currentTime = 0;
            this.dramaticSound.play();
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

    toggleBackgroundMusic() {
        if (this.backgroundMusic) {
            if (this.backgroundMusic.paused) {
                this.backgroundMusic.play();
            } else {
                this.backgroundMusic.pause();
            }
        }
    }

    setMusicVolume(volume) {
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = Math.max(0, Math.min(1, volume));
        }
    }

    setDramaticSoundVolume(volume) {
        if (this.dramaticSound) {
            this.dramaticSound.volume = Math.max(0, Math.min(1, volume));
        }
    }

    // 显示场景
    show() {
        this.container.style.display = 'block';
        setTimeout(() => {
            this.container.style.opacity = '1';
        }, 100);
    }

    // 隐藏场景
    hide() {
        this.container.style.opacity = '0';
        setTimeout(() => {
            this.container.style.display = 'none';
        }, 500);
    }

    // 电缆 Puzzle 相关方法
    openCablePuzzle() {
        document.getElementById('cable-puzzle-overlay').classList.remove('hidden');
        this.triggerCharacterReaction('puzzle_start');
        this.hideHint();
    }

    closeCablePuzzle() {
        document.getElementById('cable-puzzle-overlay').classList.add('hidden');
    }

    handleDragStart(e) {
        this.draggedComponent = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.draggedComponent = null;
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.target.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.target.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.target.classList.remove('drag-over');

        if (!this.draggedComponent) return;

        const componentType = this.draggedComponent.dataset.component;
        const slotType = e.target.dataset.type;

        // 检查是否是正确的组件类型
        if (componentType === slotType) {
            // 正确放置
            this.placeComponent(e.target, this.draggedComponent);
            this.playSound('ding');
        } else {
            // 错误放置
            e.target.classList.add('error');
            this.playSound('buzz');
            setTimeout(() => {
                e.target.classList.remove('error');
            }, 500);
            this.showHint('组件类型不匹配，请检查连接');
        }
    }

    placeComponent(slot, component) {
        // 清空槽位
        slot.innerHTML = slot.querySelector('.slot-label').outerHTML;
        
        // 创建放置的组件
        const placedComponent = document.createElement('div');
        placedComponent.className = 'placed-component';
        placedComponent.innerHTML = component.querySelector('.component-icon').outerHTML;
        placedComponent.dataset.type = component.dataset.component;
        
        slot.appendChild(placedComponent);
        slot.classList.add('filled');
        
        // 记录组件位置
        this.circuitComponents.set(slot.dataset.slot, component.dataset.component);
        
        // 隐藏原组件
        component.style.display = 'none';
        
        // 更新连接线
        this.updateConnections();
    }

    updateConnections() {
        const svg = document.getElementById('connection-svg');
        svg.innerHTML = ''; // 清空现有连接
        
        const slots = document.querySelectorAll('.grid-slot.filled');
        if (slots.length < 2) return;
        
        // 绘制连接线
        for (let i = 0; i < slots.length - 1; i++) {
            const startSlot = slots[i];
            const endSlot = slots[i + 1];
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            const startRect = startSlot.getBoundingClientRect();
            const endRect = endSlot.getBoundingClientRect();
            const svgRect = svg.getBoundingClientRect();
            
            line.setAttribute('x1', startRect.left + startRect.width / 2 - svgRect.left);
            line.setAttribute('y1', startRect.top + startRect.height / 2 - svgRect.top);
            line.setAttribute('x2', endRect.left + endRect.width / 2 - svgRect.left);
            line.setAttribute('y2', endRect.top + endRect.height / 2 - svgRect.top);
            line.setAttribute('class', 'connection-line');
            
            svg.appendChild(line);
        }
    }

    testCircuit() {
        const requiredSequence = ['battery-positive', 'switch', 'lamp', 'battery-negative'];
        const currentSequence = [];
        
        // 获取当前组件序列
        document.querySelectorAll('.grid-slot').forEach(slot => {
            if (this.circuitComponents.has(slot.dataset.slot)) {
                currentSequence.push(this.circuitComponents.get(slot.dataset.slot));
            }
        });
        
        // 检查序列是否正确
        const isCorrect = requiredSequence.length === currentSequence.length &&
                         requiredSequence.every((component, index) => component === currentSequence[index]);
        
        if (isCorrect) {
            this.completeCablePuzzle();
        } else {
            this.showCircuitError();
        }
    }

    completeCablePuzzle() {
        this.gameState.cablePuzzleCompleted = true;
        this.gameState.livingRoomPower = true;
        
        // 更新UI
        this.updatePowerStatus();
        this.updateTaskStatus('task-cable', true);
        this.unlockTask('task-tv');
        
        // 点亮灯泡
        this.activateLamp();
        
        // 触发角色反应
        this.triggerCharacterReaction('puzzle_success');
        
        // 播放dramatic sound untuk puzzle completion
        this.playDramaticSound();
        
        // 播放成功音效
        this.playSound('success');
        
        // 显示教育信息
        this.showEducationalPopup(
            '电路基础知识',
            '电流在闭合回路中流动。电池提供电压，开关控制电流通断，灯泡消耗电能发光。',
            '在直流电路中，电流从电池正极出发，经过导线、开关、用电器，最后回到电池负极，形成完整的回路。开关的作用是控制电路的通断，当开关闭合时电路导通，断开时电路断开。'
        );
        
        // 奖励能量钥匙
        this.awardEnergyKey();
        
        // 关闭puzzle
        setTimeout(() => {
            this.closeCablePuzzle();
            this.showHint('电路修复成功！现在可以检查电视了');
        }, 3000);
    }

    showCircuitError() {
        // 显示错误效果
        document.querySelectorAll('.connection-line').forEach(line => {
            line.classList.add('error');
        });
        
        this.playSound('buzz');
        this.showHint('电路连接错误。正确顺序：电池(+) → 开关 → 灯泡 → 电池(-)');
        
        setTimeout(() => {
            document.querySelectorAll('.connection-line').forEach(line => {
                line.classList.remove('error');
            });
        }, 1000);
    }

    resetCircuit() {
        // 重置所有组件
        this.circuitComponents.clear();
        
        // 清空槽位
        document.querySelectorAll('.grid-slot').forEach(slot => {
            slot.classList.remove('filled', 'error');
            const label = slot.querySelector('.slot-label');
            slot.innerHTML = '';
            slot.appendChild(label);
        });
        
        // 显示所有组件
        document.querySelectorAll('.component').forEach(component => {
            component.style.display = 'flex';
        });
        
        // 清空连接线
        document.getElementById('connection-svg').innerHTML = '';
    }

    // TV Puzzle 相关方法
    openTvPuzzle() {
        document.getElementById('tv-puzzle-overlay').classList.remove('hidden');
        this.updateTvSteps();
    }

    closeTvPuzzle() {
        document.getElementById('tv-puzzle-overlay').classList.add('hidden');
    }

    handleTvStep(stepNumber) {
        const expectedStep = this.currentTvStep + 1;
        
        if (stepNumber === expectedStep) {
            // 正确步骤
            this.completeTvStep(stepNumber);
        } else if (stepNumber > expectedStep) {
            // 跳过步骤
            this.showHint('请按顺序完成每个步骤');
        }
        // 如果是已完成的步骤，不做任何操作
    }

    completeTvStep(stepNumber) {
        const stepElement = document.getElementById(`step-${this.tvSequence[stepNumber - 1]}`);
        stepElement.classList.add('completed');
        stepElement.querySelector('.step-status').textContent = '✅';
        
        this.currentTvStep = stepNumber;
        this.playSound('ding');
        
        // 更新屏幕内容
        this.updateTvScreen(stepNumber);
        
        // 激活下一步
        if (stepNumber < this.tvSequence.length) {
            const nextStep = document.getElementById(`step-${this.tvSequence[stepNumber]}`);
            nextStep.classList.remove('disabled');
            nextStep.querySelector('.step-status').textContent = '⏳';
        } else {
            // 所有步骤完成
            this.completeTvPuzzle();
        }
    }

    updateTvScreen(step) {
        const screenContent = document.getElementById('screen-content');
        const screenStatic = document.getElementById('screen-static');
        
        switch (step) {
            case 1:
                screenContent.textContent = '电源已连接...';
                break;
            case 2:
                screenContent.textContent = '主电源开启...';
                break;
            case 3:
                screenStatic.style.display = 'none';
                screenContent.textContent = '电视启动中...';
                screenContent.classList.add('active');
                break;
            case 4:
                screenContent.innerHTML = `
                    <div style="color: #00ff00; font-family: monospace;">
                        <h3>科学家的记录</h3>
                        <p>"如果你看到这条消息，说明你成功修复了客厅的电路..."</p>
                        <p>"能源效率是关键，记住这一点..."</p>
                        <p>"厨房里有更多挑战等着你..."</p>
                    </div>
                `;
                break;
        }
    }

    updateTvSteps() {
        // 重置所有步骤状态
        document.querySelectorAll('.control-step').forEach((step, index) => {
            if (index === 0) {
                step.classList.remove('disabled');
                step.querySelector('.step-status').textContent = '⏳';
            } else {
                step.classList.add('disabled');
                step.querySelector('.step-status').textContent = '🔒';
            }
        });
    }

    completeTvPuzzle() {
        this.gameState.tvPuzzleCompleted = true;
        
        // 更新任务状态
        this.updateTaskStatus('task-tv', true);
        
        // 触发角色反应
        this.triggerCharacterReaction('tv_success');
        
        // 播放dramatic sound untuk victory
        this.playDramaticSound();
        
        // 播放成功音效
        this.playSound('success');
        
        // 显示成功消息
        this.showSuccessMessage(
            '关卡完成！',
            '你成功修复了客厅的电路系统，并获得了科学家的重要信息。现在可以前往厨房继续你的能源探索之旅！'
        );
        
        // 奖励能量钥匙（如果还没有获得）
        if (this.gameState.energyKeys === 0) {
            this.awardEnergyKey();
        }
        
        // 激活电视
        this.activateTV();
        
        // 关闭TV puzzle
        setTimeout(() => {
            this.closeTvPuzzle();
        }, 2000);
        
        // 触发关卡完成反应
        this.triggerCharacterReaction('level_complete');
        
        // 解锁下一关
        setTimeout(() => {
            this.unlockNextLevel();
        }, 5000);
    }

    // UI 更新方法
    updatePowerStatus() {
        const statusElement = document.getElementById('living-room-power-status');
        if (this.gameState.livingRoomPower) {
            statusElement.textContent = '✅ 客厅供电正常';
            statusElement.classList.add('powered');
        } else {
            statusElement.textContent = '❌ 客厅断电';
            statusElement.classList.remove('powered');
        }
    }

    updateTaskStatus(taskId, completed) {
        const taskElement = document.getElementById(taskId);
        if (completed) {
            taskElement.classList.add('completed');
            taskElement.querySelector('.task-status').textContent = '✅';
        }
    }

    unlockTask(taskId) {
        const taskElement = document.getElementById(taskId);
        taskElement.querySelector('.task-status').textContent = '⏳';
    }

    awardEnergyKey() {
        this.gameState.energyKeys++;
        
        const keyContainer = document.getElementById('energy-keys-container');
        const keyElement = document.createElement('div');
        keyElement.className = 'energy-key';
        keyElement.innerHTML = '🔑';
        keyElement.style.animation = 'keyFloat 2s ease-in-out infinite';
        
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
        
        // 自动隐藏
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

    // 音频方法
    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(e => {
                console.log('Audio play failed:', e);
            });
        }
    }

    // 关卡完成和过渡
    unlockNextLevel() {
        // 这里可以添加过渡到下一关的逻辑
        console.log('准备进入 Scene 3 - Level 2: 厨房');
        
        // 可以触发场景管理器切换到下一关
        if (window.gameManager) {
            window.gameManager.loadScene('scene3-level2');
        }
    }

    // 角色助手系统
    setupCharacterGuide() {
        this.characterTips = [
            "Halo! Saya akan membantu kamu belajar hemat energi!",
            "Klik pada meja kabel untuk mulai memperbaiki sirkuit listrik.",
            "Ingat, hemat energi dimulai dari hal-hal kecil!",
            "Matikan peralatan yang tidak digunakan untuk menghemat listrik.",
            "Setelah memperbaiki kabel, coba nyalakan TV!",
            "Bagus! Kamu sudah belajar dasar-dasar penghematan energi."
        ];
        this.currentTipIndex = 0;
        
        // Tampilkan tip pertama setelah 2 detik
        setTimeout(() => {
            this.showCharacterTip();
        }, 2000);
        
        // Auto-hide speech bubble setelah 5 detik
        this.speechTimeout = null;
    }
    
    showCharacterTip() {
        const speechBubble = document.getElementById('character-speech');
        const speechText = document.getElementById('speech-text');
        const characterGuide = document.getElementById('character-guide');
        
        if (this.currentTipIndex < this.characterTips.length) {
            speechText.textContent = this.characterTips[this.currentTipIndex];
            speechBubble.classList.remove('hidden');
            characterGuide.classList.add('talking');
            
            // Clear previous timeout
            if (this.speechTimeout) {
                clearTimeout(this.speechTimeout);
            }
            
            // Auto-hide after 5 seconds
            this.speechTimeout = setTimeout(() => {
                this.hideCharacterSpeech();
            }, 5000);
            
            this.currentTipIndex++;
        } else {
            // Cycle back to encouraging messages
            const encouragingTips = [
                "Kamu hebat! Terus belajar hemat energi ya!",
                "Setiap langkah kecil membuat perbedaan besar!",
                "Ingat, bumi ini milik kita bersama!"
            ];
            const randomTip = encouragingTips[Math.floor(Math.random() * encouragingTips.length)];
            speechText.textContent = randomTip;
            speechBubble.classList.remove('hidden');
            characterGuide.classList.add('talking');
            
            if (this.speechTimeout) {
                clearTimeout(this.speechTimeout);
            }
            
            this.speechTimeout = setTimeout(() => {
                this.hideCharacterSpeech();
            }, 4000);
        }
    }
    
    hideCharacterSpeech() {
        const speechBubble = document.getElementById('character-speech');
        const characterGuide = document.getElementById('character-guide');
        
        speechBubble.classList.add('hidden');
        characterGuide.classList.remove('talking');
        
        if (this.speechTimeout) {
            clearTimeout(this.speechTimeout);
            this.speechTimeout = null;
        }
    }
    
    triggerCharacterReaction(type) {
        const characterGuide = document.getElementById('character-guide');
        const speechBubble = document.getElementById('character-speech');
        const speechText = document.getElementById('speech-text');
        
        let message = "";
        
        switch(type) {
            case 'puzzle_start':
                message = "Bagus! Mari kita perbaiki sirkuit ini bersama-sama!";
                characterGuide.classList.add('excited');
                break;
            case 'puzzle_success':
                message = "Hebat! Kamu berhasil memperbaiki sirkuitnya!";
                characterGuide.classList.add('excited');
                break;
            case 'tv_success':
                message = "Luar biasa! TV sudah menyala. Jangan lupa matikan saat tidak digunakan ya!";
                characterGuide.classList.add('excited');
                break;
            case 'lamp_on':
                message = "Wah, lampunya menyala! Tapi ingat, gunakan lampu LED untuk hemat energi!";
                characterGuide.classList.add('excited');
                break;
            case 'level_complete':
                message = "Selamat! Kamu telah menyelesaikan Level 1. Siap ke level berikutnya?";
                characterGuide.classList.add('excited');
                break;
            case 'energy_tip':
                const energyTips = [
                    "Tahukah kamu? Mematikan peralatan elektronik saat tidak digunakan bisa menghemat 10% listrik!",
                    "Gunakan lampu LED karena lebih hemat energi dibanding lampu biasa!",
                    "Cabut charger dari stop kontak saat tidak digunakan untuk menghindari vampire power!"
                ];
                message = energyTips[Math.floor(Math.random() * energyTips.length)];
                break;
            default:
                return;
        }
        
        speechText.textContent = message;
        speechBubble.classList.remove('hidden');
        characterGuide.classList.add('talking');
        
        // Remove excited state after animation
        setTimeout(() => {
            characterGuide.classList.remove('excited');
        }, 2000);
        
        // Auto-hide after 4 seconds
        if (this.speechTimeout) {
            clearTimeout(this.speechTimeout);
        }
        
        this.speechTimeout = setTimeout(() => {
            this.hideCharacterSpeech();
        }, 4000);
    }

    activateLamp() {
        const lamp = document.getElementById('lamp-obj');
        const lampGlow = document.getElementById('lamp-glow');
        
        lamp.classList.add('powered');
        lamp.classList.add('energy-efficient');
        if (lampGlow) {
            lampGlow.style.opacity = '1';
            lampGlow.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.8)';
        }
        
        // Trigger power-on animation
        lamp.style.animation = 'powerOn 0.5s ease-out';
        
        // Show character tip about energy efficiency
        setTimeout(() => {
            this.triggerCharacterReaction('lamp_on');
        }, 1000);
    }

    activateTV() {
        // 激活电视屏幕
        const tvScreen = document.getElementById('tv-screen');
        const tvObj = document.getElementById('tv-obj');
        
        if (tvObj) {
            tvObj.classList.add('powered');
            tvObj.style.animation = 'powerOn 0.5s ease-out';
        }
        
        if (tvScreen) {
            tvScreen.style.background = 'linear-gradient(45deg, #4A90E2, #87CEEB)';
            tvScreen.style.boxShadow = '0 0 20px rgba(74, 144, 226, 0.6)';
            
            // 添加电视内容
            tvScreen.innerHTML = `
                <div style="color: white; text-align: center; padding: 10px; font-size: 12px;">
                    📺 能源新闻<br>
                    <small>节能减排，从我做起</small>
                </div>
            `;
        }
    }

    // 获取游戏状态
    getGameState() {
        return { ...this.gameState };
    }

    // 设置游戏状态
    setGameState(state) {
        this.gameState = { ...this.gameState, ...state };
        this.updatePowerStatus();
    }
}

// 导出类
window.Scene2Level1 = Scene2Level1;

// 当DOM加载完成时初始化
document.addEventListener('DOMContentLoaded', () => {
    if (!window.scene2Level1) {
        window.scene2Level1 = new Scene2Level1();
    }
});