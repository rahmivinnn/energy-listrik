// Scene 4 Level 3: 实验室电费模拟系统
class Scene4Level3 {
    constructor() {
        this.devices = {
            lamp: { power: 15, time: 6, name: 'LED灯具', icon: '💡' },
            ac: { power: 1000, time: 8, name: '小型空调', icon: '❄️' },
            tv: { power: 120, time: 4, name: '液晶电视', icon: '📺' },
            fridge: { power: 150, time: 24, name: '冰箱', icon: '🧊' },
            'rice-cooker': { power: 300, time: 1, name: '电饭煲', icon: '🍚' },
            computer: { power: 150, time: 6, name: '台式电脑', icon: '💻' }
        };
        
        this.tariffRate = 1467; // Rp per kWh
        this.budgetLimit = 300000; // Rp
        this.currentBill = 0;
        this.totalKwh = 0;
        
        this.presets = {
            saving: {
                lamp: 4, ac: 4, tv: 2, fridge: 24, 'rice-cooker': 0.5, computer: 4
            },
            normal: {
                lamp: 6, ac: 8, tv: 4, fridge: 24, 'rice-cooker': 1, computer: 6
            },
            comfort: {
                lamp: 8, ac: 12, tv: 6, fridge: 24, 'rice-cooker': 1.5, computer: 8
            }
        };
        
        this.objectives = {
            billLimit: false,
            efficiency: false,
            calculation: false
        };
        
        this.energyKeys = [];
        this.isLevelComplete = false;
        this.chart = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupAudio();
        this.calculateBill();
        this.updateChart();
        this.showInitialHint();
        this.loadEnergyKeys();
        
        // 播放环境音效
        this.playAmbientSound();
        
        console.log('Scene 4 Level 3 initialized');
    }
    
    setupEventListeners() {
        // 设备滑块事件
        Object.keys(this.devices).forEach(deviceId => {
            const slider = document.getElementById(`${deviceId}-slider`);
            if (slider) {
                slider.addEventListener('input', (e) => {
                    this.updateDeviceTime(deviceId, parseFloat(e.target.value));
                });
                
                slider.addEventListener('change', () => {
                    this.playClickSound();
                });
            }
        });
        
        // 设备详情点击事件
        document.querySelectorAll('.device-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('time-slider')) {
                    const deviceId = item.dataset.device;
                    this.showDeviceDetail(deviceId);
                }
            });
        });
        
        // 预设按钮事件
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = btn.dataset.preset;
                this.applyPreset(preset);
                this.playClickSound();
            });
        });
        
        // 弹窗关闭事件
        document.getElementById('detail-close')?.addEventListener('click', () => {
            this.hideDeviceDetail();
        });
        
        document.getElementById('edu-close')?.addEventListener('click', () => {
            this.hideEducationalPopup();
        });
        
        document.getElementById('edu-expand-btn')?.addEventListener('click', () => {
            this.toggleEducationalDetail();
        });
        
        document.getElementById('hint-close')?.addEventListener('click', () => {
            this.hideHint();
        });
        
        document.getElementById('warning-close')?.addEventListener('click', () => {
            this.hideWarning();
        });
        
        document.getElementById('success-continue')?.addEventListener('click', () => {
            this.continueToNextLevel();
        });
        
        // 公式显示点击事件
        document.querySelector('.formula-display')?.addEventListener('click', () => {
            this.showEducationalPopup();
        });
    }
    
    setupAudio() {
        this.sounds = {
            ding: document.getElementById('sfx-ding'),
            buzz: document.getElementById('sfx-buzz'),
            click: document.getElementById('sfx-click'),
            ambient: document.getElementById('ambient-lab')
        };
        
        // 设置音量
        Object.values(this.sounds).forEach(sound => {
            if (sound) sound.volume = 0.3;
        });
        
        if (this.sounds.ambient) {
            this.sounds.ambient.volume = 0.1;
        }
        
        // Setup background music
        this.setupBackgroundMusic();
        
        // Play ambient sound
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

    playAmbientSound() {
        if (this.sounds.ambient) {
            this.sounds.ambient.play().catch(e => {
                console.log('Ambient sound play failed:', e);
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
    
    updateDeviceTime(deviceId, time) {
        if (this.devices[deviceId]) {
            this.devices[deviceId].time = time;
            
            // 更新显示
            const timeDisplay = document.getElementById(`${deviceId}-time`);
            const energyDisplay = document.getElementById(`${deviceId}-energy`);
            
            if (timeDisplay) {
                timeDisplay.textContent = time.toFixed(1);
            }
            
            if (energyDisplay) {
                const monthlyEnergy = this.calculateDeviceMonthlyEnergy(deviceId);
                energyDisplay.textContent = monthlyEnergy.toFixed(1);
            }
            
            // 重新计算总电费
            this.calculateBill();
            this.updateChart();
            this.checkObjectives();
        }
    }
    
    calculateDeviceMonthlyEnergy(deviceId) {
        const device = this.devices[deviceId];
        if (!device) return 0;
        
        // 能耗(kWh) = (功率W × 时间h × 30天) ÷ 1000
        return (device.power * device.time * 30) / 1000;
    }
    
    calculateBill() {
        this.totalKwh = 0;
        
        // 计算总能耗
        Object.keys(this.devices).forEach(deviceId => {
            this.totalKwh += this.calculateDeviceMonthlyEnergy(deviceId);
        });
        
        // 计算总电费
        this.currentBill = this.totalKwh * this.tariffRate;
        
        // 更新显示
        this.updateBillDisplay();
    }
    
    updateBillDisplay() {
        const totalKwhElement = document.getElementById('total-kwh');
        const billAmountElement = document.getElementById('monthly-bill-amount');
        const billStatusElement = document.getElementById('bill-status');
        
        if (totalKwhElement) {
            totalKwhElement.textContent = this.totalKwh.toFixed(1);
        }
        
        if (billAmountElement) {
            billAmountElement.textContent = `Rp ${this.currentBill.toLocaleString('id-ID')}`;
            
            // 根据电费状态改变颜色
            if (this.currentBill <= this.budgetLimit) {
                billAmountElement.className = 'bill-value success';
            } else if (this.currentBill <= this.budgetLimit * 1.2) {
                billAmountElement.className = 'bill-value warning';
            } else {
                billAmountElement.className = 'bill-value error';
            }
        }
        
        if (billStatusElement) {
            const statusIcon = billStatusElement.querySelector('.status-icon');
            const statusText = billStatusElement.querySelector('.status-text');
            
            if (this.currentBill <= this.budgetLimit) {
                statusIcon.textContent = '✅';
                statusText.textContent = '预算达标';
                statusText.className = 'status-text success';
            } else {
                statusIcon.textContent = '⚠️';
                statusText.textContent = '超出预算';
                statusText.className = 'status-text error';
            }
        }
    }
    
    applyPreset(presetName) {
        const preset = this.presets[presetName];
        if (!preset) return;
        
        // 移除之前的活跃状态
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 添加当前活跃状态
        document.querySelector(`[data-preset="${presetName}"]`)?.classList.add('active');
        
        // 应用预设值
        Object.keys(preset).forEach(deviceId => {
            const slider = document.getElementById(`${deviceId}-slider`);
            if (slider) {
                slider.value = preset[deviceId];
                this.updateDeviceTime(deviceId, preset[deviceId]);
            }
        });
        
        // 显示提示
        this.showHint(`已应用${this.getPresetName(presetName)}配置`);
    }
    
    getPresetName(presetName) {
        const names = {
            saving: '节能模式',
            normal: '标准模式',
            comfort: '舒适模式'
        };
        return names[presetName] || presetName;
    }
    
    showDeviceDetail(deviceId) {
        const device = this.devices[deviceId];
        if (!device) return;
        
        const popup = document.getElementById('device-detail-popup');
        const deviceName = document.getElementById('detail-device-name');
        const devicePower = document.getElementById('detail-power');
        const deviceHours = document.getElementById('detail-hours');
        const deviceMonthly = document.getElementById('detail-monthly');
        const deviceCost = document.getElementById('detail-cost');
        const calculationDetail = document.getElementById('calculation-detail');
        
        if (popup && deviceName && devicePower && deviceHours && deviceMonthly && deviceCost && calculationDetail) {
            const monthlyEnergy = this.calculateDeviceMonthlyEnergy(deviceId);
            const monthlyCost = monthlyEnergy * this.tariffRate;
            
            deviceName.textContent = `${device.icon} ${device.name}`;
            devicePower.textContent = `${device.power}W`;
            deviceHours.textContent = `${device.time}小时/天`;
            deviceMonthly.textContent = `${monthlyEnergy.toFixed(1)} kWh/月`;
            deviceCost.textContent = `Rp ${monthlyCost.toLocaleString('id-ID')}`;
            
            // 生成计算步骤
            const steps = [
                `1. 每日能耗 = ${device.power}W × ${device.time}h = ${(device.power * device.time).toFixed(1)}Wh`,
                `2. 每日能耗(kWh) = ${(device.power * device.time).toFixed(1)}Wh ÷ 1000 = ${((device.power * device.time) / 1000).toFixed(3)}kWh`,
                `3. 月能耗 = ${((device.power * device.time) / 1000).toFixed(3)}kWh × 30天 = ${monthlyEnergy.toFixed(1)}kWh`,
                `4. 月电费 = ${monthlyEnergy.toFixed(1)}kWh × Rp${this.tariffRate} = Rp${monthlyCost.toLocaleString('id-ID')}`
            ];
            
            calculationDetail.innerHTML = steps.join('<br>');
            
            popup.classList.remove('hidden');
            this.playClickSound();
        }
    }
    
    hideDeviceDetail() {
        const popup = document.getElementById('device-detail-popup');
        if (popup) {
            popup.classList.add('hidden');
        }
    }
    
    updateChart() {
        const canvas = document.getElementById('energy-chart');
        const legend = document.getElementById('chart-legend');
        
        if (!canvas || !legend) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // 清除画布
        ctx.clearRect(0, 0, width, height);
        
        // 计算设备能耗数据
        const deviceData = [];
        let totalEnergy = 0;
        
        Object.keys(this.devices).forEach(deviceId => {
            const energy = this.calculateDeviceMonthlyEnergy(deviceId);
            deviceData.push({
                id: deviceId,
                name: this.devices[deviceId].name,
                icon: this.devices[deviceId].icon,
                energy: energy,
                percentage: 0 // 稍后计算
            });
            totalEnergy += energy;
        });
        
        // 计算百分比
        deviceData.forEach(item => {
            item.percentage = totalEnergy > 0 ? (item.energy / totalEnergy) * 100 : 0;
        });
        
        // 绘制饼图
        this.drawPieChart(ctx, deviceData, width, height);
        
        // 更新图例
        this.updateChartLegend(legend, deviceData);
    }
    
    drawPieChart(ctx, data, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 20;
        
        const colors = [
            '#00d4ff', '#ff6b6b', '#4ecdc4', '#45b7d1',
            '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'
        ];
        
        let currentAngle = -Math.PI / 2; // 从顶部开始
        
        data.forEach((item, index) => {
            if (item.energy > 0) {
                const sliceAngle = (item.percentage / 100) * 2 * Math.PI;
                
                // 绘制扇形
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
                ctx.closePath();
                
                ctx.fillStyle = colors[index % colors.length];
                ctx.fill();
                
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // 绘制标签
                if (item.percentage > 5) { // 只显示大于5%的标签
                    const labelAngle = currentAngle + sliceAngle / 2;
                    const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
                    const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
                    
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(`${item.percentage.toFixed(1)}%`, labelX, labelY);
                }
                
                currentAngle += sliceAngle;
            }
        });
    }
    
    updateChartLegend(legend, data) {
        const colors = [
            '#00d4ff', '#ff6b6b', '#4ecdc4', '#45b7d1',
            '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'
        ];
        
        legend.innerHTML = '';
        
        data.forEach((item, index) => {
            if (item.energy > 0) {
                const legendItem = document.createElement('div');
                legendItem.className = 'legend-item';
                
                legendItem.innerHTML = `
                    <div class="legend-color" style="background-color: ${colors[index % colors.length]}"></div>
                    <span>${item.icon} ${item.name}: ${item.energy.toFixed(1)}kWh</span>
                `;
                
                legend.appendChild(legendItem);
            }
        });
    }
    
    checkObjectives() {
        const prevObjectives = { ...this.objectives };
        
        // 检查电费目标
        this.objectives.billLimit = this.currentBill <= this.budgetLimit;
        
        // 检查效率目标（至少使用一个预设或手动优化）
        this.objectives.efficiency = this.hasOptimizedUsage();
        
        // 检查计算理解目标（查看过设备详情或教育弹窗）
        this.objectives.calculation = this.hasViewedCalculations();
        
        // 更新目标显示
        this.updateObjectiveDisplay();
        
        // 检查是否完成所有目标
        if (this.objectives.billLimit && this.objectives.efficiency && this.objectives.calculation) {
            if (!this.isLevelComplete) {
                this.completeLevel();
            }
        } else if (this.currentBill > this.budgetLimit && prevObjectives.billLimit) {
            // 如果之前达标但现在超标，显示警告
            this.showWarning();
        }
    }
    
    hasOptimizedUsage() {
        // 检查是否有设备使用时间被优化（不是默认值）
        const defaultTimes = { lamp: 6, ac: 8, tv: 4, fridge: 24, 'rice-cooker': 1, computer: 6 };
        
        return Object.keys(this.devices).some(deviceId => {
            return Math.abs(this.devices[deviceId].time - defaultTimes[deviceId]) > 0.1;
        });
    }
    
    hasViewedCalculations() {
        // 这个会在显示设备详情或教育弹窗时设置
        return this.objectives.calculation;
    }
    
    updateObjectiveDisplay() {
        const objectives = {
            'obj-bill-limit': this.objectives.billLimit,
            'obj-efficiency': this.objectives.efficiency,
            'obj-calculation': this.objectives.calculation
        };
        
        Object.keys(objectives).forEach(objId => {
            const element = document.getElementById(objId);
            if (element) {
                const statusSpan = element.querySelector('.obj-status');
                if (statusSpan) {
                    statusSpan.textContent = objectives[objId] ? '✅' : '⏳';
                }
                
                element.className = objectives[objId] ? 'objective completed' : 'objective';
            }
        });
    }
    
    completeLevel() {
        this.isLevelComplete = true;
        
        // 播放成功音效和dramatic sound
        this.playSuccessSound();
        this.playDramaticSound();
        
        // 添加能量钥匙
        this.addEnergyKey(3);
        
        // 显示成功消息
        setTimeout(() => {
            this.showSuccessMessage();
        }, 1000);
        
        console.log('Scene 4 Level 3 completed!');
    }
    
    showSuccessMessage() {
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
            successMessage.classList.remove('hidden');
        }
    }
    
    showWarning() {
        const warningMessage = document.getElementById('warning-message');
        const warningText = document.getElementById('warning-text');
        const suggestionsList = document.getElementById('warning-suggestions-list');
        
        if (warningMessage && warningText && suggestionsList) {
            const overBudget = this.currentBill - this.budgetLimit;
            warningText.textContent = `当前月电费为Rp${this.currentBill.toLocaleString('id-ID')}，超出预算Rp${overBudget.toLocaleString('id-ID')}。请调整设备使用时间。`;
            
            // 生成建议
            const suggestions = this.generateSuggestions();
            suggestionsList.innerHTML = '';
            suggestions.forEach(suggestion => {
                const li = document.createElement('li');
                li.textContent = suggestion;
                suggestionsList.appendChild(li);
            });
            
            warningMessage.classList.remove('hidden');
            this.playBuzzSound();
        }
    }
    
    generateSuggestions() {
        const suggestions = [];
        
        // 分析高耗电设备
        const deviceConsumption = Object.keys(this.devices).map(deviceId => ({
            id: deviceId,
            name: this.devices[deviceId].name,
            consumption: this.calculateDeviceMonthlyEnergy(deviceId),
            cost: this.calculateDeviceMonthlyEnergy(deviceId) * this.tariffRate
        })).sort((a, b) => b.consumption - a.consumption);
        
        // 针对前3个高耗电设备给出建议
        deviceConsumption.slice(0, 3).forEach(device => {
            if (device.id === 'ac' && this.devices.ac.time > 6) {
                suggestions.push('减少空调使用时间，或设置定时关闭');
            } else if (device.id === 'computer' && this.devices.computer.time > 8) {
                suggestions.push('电脑不使用时及时关闭，避免长时间待机');
            } else if (device.id === 'tv' && this.devices.tv.time > 4) {
                suggestions.push('减少电视观看时间，选择节能模式');
            } else if (device.id === 'lamp' && this.devices.lamp.time > 6) {
                suggestions.push('充分利用自然光，减少灯具使用时间');
            }
        });
        
        if (suggestions.length === 0) {
            suggestions.push('尝试使用节能模式预设配置');
            suggestions.push('关闭不必要的电器设备');
        }
        
        return suggestions;
    }
    
    hideWarning() {
        const warningMessage = document.getElementById('warning-message');
        if (warningMessage) {
            warningMessage.classList.add('hidden');
        }
    }
    
    showEducationalPopup() {
        const popup = document.getElementById('educational-popup');
        if (popup) {
            popup.classList.remove('hidden');
            this.objectives.calculation = true;
            this.checkObjectives();
        }
    }
    
    hideEducationalPopup() {
        const popup = document.getElementById('educational-popup');
        if (popup) {
            popup.classList.add('hidden');
        }
    }
    
    toggleEducationalDetail() {
        const detail = document.getElementById('edu-detail');
        const btn = document.getElementById('edu-expand-btn');
        
        if (detail && btn) {
            if (detail.classList.contains('expanded')) {
                detail.classList.remove('expanded');
                btn.textContent = '了解更多';
            } else {
                detail.classList.add('expanded');
                btn.textContent = '收起';
            }
        }
    }
    
    showHint(message) {
        const hintBubble = document.getElementById('hint-bubble');
        const hintText = document.getElementById('hint-text');
        
        if (hintBubble && hintText) {
            hintText.textContent = message;
            hintBubble.classList.remove('hidden');
            
            // 3秒后自动隐藏
            setTimeout(() => {
                this.hideHint();
            }, 3000);
        }
    }
    
    showInitialHint() {
        setTimeout(() => {
            this.showHint('调整设备使用时间，将月电费控制在Rp300,000以内');
        }, 1000);
    }
    
    hideHint() {
        const hintBubble = document.getElementById('hint-bubble');
        if (hintBubble) {
            hintBubble.classList.add('hidden');
        }
    }
    
    addEnergyKey(keyNumber) {
        if (!this.energyKeys.includes(keyNumber)) {
            this.energyKeys.push(keyNumber);
            this.updateEnergyKeysDisplay();
            this.saveEnergyKeys();
        }
    }
    
    updateEnergyKeysDisplay() {
        const container = document.getElementById('energy-keys-container');
        if (container) {
            container.innerHTML = '';
            this.energyKeys.forEach(keyNumber => {
                const keyElement = document.createElement('div');
                keyElement.className = 'energy-key';
                keyElement.textContent = `🔑${keyNumber}`;
                keyElement.title = `能量钥匙 ${keyNumber}`;
                container.appendChild(keyElement);
            });
        }
    }
    
    loadEnergyKeys() {
        const saved = localStorage.getItem('energyKeys');
        if (saved) {
            this.energyKeys = JSON.parse(saved);
            this.updateEnergyKeysDisplay();
        }
    }
    
    saveEnergyKeys() {
        localStorage.setItem('energyKeys', JSON.stringify(this.energyKeys));
    }
    
    continueToNextLevel() {
        // 隐藏成功消息
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
            successMessage.classList.add('hidden');
        }
        
        // 停止环境音效
        this.stopAmbientSound();
        
        // 转到下一个场景
        this.transitionToNextScene();
    }
    
    transitionToNextScene() {
        // 隐藏当前场景
        const currentScene = document.getElementById('scene4-level3-container');
        if (currentScene) {
            currentScene.classList.add('hidden');
        }
        
        // 这里应该加载Scene 5 Level 4
        // 暂时显示提示信息
        console.log('Transitioning to Scene 5 Level 4...');
        
        // 可以在这里添加场景转换逻辑
        // 例如：loadScene5Level4();
    }
    
    // 音效方法
    playSuccessSound() {
        if (this.sounds.ding) {
            this.sounds.ding.currentTime = 0;
            this.sounds.ding.play().catch(e => console.log('Audio play failed:', e));
        }
    }
    
    playBuzzSound() {
        if (this.sounds.buzz) {
            this.sounds.buzz.currentTime = 0;
            this.sounds.buzz.play().catch(e => console.log('Audio play failed:', e));
        }
    }
    
    playClickSound() {
        if (this.sounds.click) {
            this.sounds.click.currentTime = 0;
            this.sounds.click.play().catch(e => console.log('Audio play failed:', e));
        }
    }
    
    playAmbientSound() {
        if (this.sounds.ambient) {
            this.sounds.ambient.play().catch(e => console.log('Audio play failed:', e));
        }
    }
    
    stopAmbientSound() {
        if (this.sounds.ambient) {
            this.sounds.ambient.pause();
            this.sounds.ambient.currentTime = 0;
        }
    }
}

// 初始化Scene 4 Level 3
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否在正确的页面
    if (document.getElementById('scene4-level3-container')) {
        window.scene4Level3 = new Scene4Level3();
    }
});

// 导出类以供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Scene4Level3;
}