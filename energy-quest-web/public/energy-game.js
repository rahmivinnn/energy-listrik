// Energy Game - Top-down 2D Anime Style JavaScript

class EnergyGame {
    constructor() {
        this.currentZone = 'living';
        this.energyKeys = {
            living: false,
            kitchen: false,
            lab: false
        };
        this.powerUsage = 0;
        this.maxPower = 100;
        this.gameCompleted = false;
        this.aiCursorActive = false;
        
        // Game state for each zone
        this.zoneStates = {
            living: {
                completed: false,
                connections: [],
                devicesOn: [],
                totalTrials: 10,
                completedTrials: 0,
                requiredDevices: ['lamp', 'tv', 'fan', 'computer', 'microwave', 'printer', 'radio', 'charger', 'blender', 'vacuum']
            },
            kitchen: {
                completed: false,
                efficiency: 0,
                devicesActive: []
            },
            lab: {
                completed: false,
                totalBill: 0,
                efficiency: 0,
                deviceSettings: {}
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateHUD();
        this.showZone('living');
        this.showCharacterSpeech('living');
        this.createAICursor();
        this.startBackgroundAnimations();
    }
    
    setupEventListeners() {
        // Zone navigation
        document.querySelectorAll('.map-zone').forEach(zone => {
            zone.addEventListener('click', (e) => {
                const zoneId = e.currentTarget.dataset.zone;
                if (!e.currentTarget.classList.contains('locked')) {
                    this.navigateToZone(zoneId);
                }
            });
        });
        
        // Living room cable connections
        document.querySelectorAll('.power-source, .outlet').forEach(element => {
            element.addEventListener('click', (e) => {
                if (this.currentZone === 'living') {
                    this.handleCableConnection(e.currentTarget);
                }
            });
        });
        
        // Kitchen device interactions
        document.querySelectorAll('.kitchen-device').forEach(device => {
            device.addEventListener('click', (e) => {
                if (this.currentZone === 'kitchen') {
                    this.handleKitchenDevice(e.currentTarget);
                }
            });
        });
        
        // Lab device sliders
        document.querySelectorAll('.power-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                if (this.currentZone === 'lab') {
                    this.handleLabDevice(e.currentTarget);
                }
            });
        });
        
        // Exit door
        document.querySelector('.exit-door')?.addEventListener('click', () => {
            this.handleExitDoor();
        });
    }
    
    navigateToZone(zoneId) {
        if (zoneId === this.currentZone) return;
        
        // Hide current zone
        document.querySelector(`.game-zone[data-zone="${this.currentZone}"]`)?.classList.remove('active');
        document.querySelector(`.map-zone[data-zone="${this.currentZone}"]`)?.classList.remove('active');
        
        // Show new zone
        this.currentZone = zoneId;
        document.querySelector(`.game-zone[data-zone="${zoneId}"]`)?.classList.add('active');
        document.querySelector(`.map-zone[data-zone="${zoneId}"]`)?.classList.add('active');
        
        // Update character speech
        this.showCharacterSpeech(zoneId);
        
        // Play zone transition sound
        this.playSound('zone-transition');
        
        // Show zone-specific feedback
        this.showFeedback(`Memasuki ${this.getZoneName(zoneId)}`, 'info');
    }
    
    showZone(zoneId) {
        document.querySelectorAll('.game-zone').forEach(zone => {
            zone.classList.remove('active');
        });
        
        document.querySelectorAll('.map-zone').forEach(zone => {
            zone.classList.remove('active');
        });
        
        document.querySelector(`.game-zone[data-zone="${zoneId}"]`)?.classList.add('active');
        document.querySelector(`.map-zone[data-zone="${zoneId}"]`)?.classList.add('active');
    }
    
    showCharacterSpeech(zoneId) {
        const speeches = {
            living: "Halo! Aku butuh bantuanmu untuk menghubungkan kabel listrik ke stop kontak agar lampu bisa menyala. Seret kabel dari sumber listrik ke stop kontak yang tepat!",
            kitchen: "Sekarang kita di dapur! Bantu aku mengoptimalkan penggunaan listrik dengan menyalakan dan mematikan perangkat yang tepat. Perhatikan meteran efisiensi energi!",
            lab: "Ini laboratoriumku! Mari simulasikan tagihan listrik dengan mengatur tingkat daya setiap perangkat. Cari kombinasi yang paling efisien!",
            exit: "Luar biasa! Kamu telah mengumpulkan semua Kunci Energi! Sekarang kita bisa membuka pintu dan menyelesaikan misi ini!"
        };
        
        const speechElement = document.querySelector('.character-speech p');
        if (speechElement) {
            speechElement.textContent = speeches[zoneId] || speeches.living;
            
            // Animate speech bubble
            speechElement.parentElement.style.transform = 'scale(0.8)';
            speechElement.parentElement.style.opacity = '0';
            
            setTimeout(() => {
                speechElement.parentElement.style.transform = 'scale(1)';
                speechElement.parentElement.style.opacity = '1';
            }, 100);
        }
    }
    
    handleCableConnection(element) {
        const isSource = element.classList.contains('power-source');
        const isOutlet = element.classList.contains('outlet');
        
        if (isSource || isOutlet) {
            this.showAICursor(element);
            
            setTimeout(() => {
                this.connectCable(element);
                this.hideAICursor();
            }, 1000);
        }
    }
    
    connectCable(element) {
        const zoneState = this.zoneStates.living;
        
        if (element.classList.contains('power-source')) {
            // Start connection from power source
            zoneState.activeSource = element;
            element.classList.add('selected');
            this.showFeedback('Sumber listrik dipilih! Klik stop kontak untuk menghubungkan.', 'info');
            this.playSound('cable-select');
            
        } else if (element.classList.contains('outlet') && zoneState.activeSource) {
            // Complete connection to outlet
            const sourceId = zoneState.activeSource.dataset.source;
            const outletId = element.dataset.outlet;
            
            // Check if connection is valid (any outlet can connect to power source)
            const deviceId = outletId.replace('-outlet', '');
            
            // Check if device is already connected
            if (!zoneState.devicesOn.includes(deviceId)) {
                // Correct connection
                element.classList.add('connected');
                zoneState.activeSource.classList.add('connected');
                zoneState.connections.push({ source: sourceId, outlet: outletId });
                
                // Turn on connected device
                const device = document.querySelector(`[data-device="${deviceId}"]`);
                if (device) {
                    device.classList.add('on');
                    zoneState.devicesOn.push(deviceId);
                    zoneState.completedTrials++;
                }
                
                this.drawCable(zoneState.activeSource, element, true);
                this.showFeedback(`Koneksi berhasil! ${deviceId} menyala! (${zoneState.completedTrials}/${zoneState.totalTrials})`, 'success');
                this.playSound('cable-connect-success');
                
                // Add sparkle effect
                this.addSparkleEffect(element);
                
            } else {
                // Device already connected
                this.showFeedback('Perangkat sudah terhubung! Pilih perangkat lain.', 'error');
                this.playSound('cable-connect-error');
            }
            
            // Reset selection
            zoneState.activeSource.classList.remove('selected');
            zoneState.activeSource = null;
            
            // Check if zone is completed
            this.checkLivingRoomCompletion();
        }
    }
    
    drawCable(source, outlet, isCorrect) {
        const svg = document.getElementById('cable-svg');
        if (!svg) return;
        
        const sourceRect = source.getBoundingClientRect();
        const outletRect = outlet.getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();
        
        const x1 = sourceRect.left + sourceRect.width / 2 - svgRect.left;
        const y1 = sourceRect.top + sourceRect.height / 2 - svgRect.top;
        const x2 = outletRect.left + outletRect.width / 2 - svgRect.left;
        const y2 = outletRect.top + outletRect.height / 2 - svgRect.top;
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - 50} ${x2} ${y2}`;
        
        path.setAttribute('d', d);
        path.classList.add('cable');
        if (isCorrect) {
            path.classList.add('connected');
        }
        path.dataset.source = source.dataset.source;
        path.dataset.outlet = outlet.dataset.outlet;
        
        svg.appendChild(path);
    }
    
    removeCable(source, outlet) {
        const sourceId = source.dataset.source;
        const outletId = outlet.dataset.outlet;
        const cable = document.querySelector(`path[data-source="${sourceId}"][data-outlet="${outletId}"]`);
        if (cable) {
            cable.remove();
        }
    }
    
    checkLivingRoomCompletion() {
        const zoneState = this.zoneStates.living;
        
        // Check if all 10 trials are completed
        if (zoneState.completedTrials >= zoneState.totalTrials) {
            // Show completion message
            this.showFeedback('Selamat! Semua 10 percobaan telah selesai!', 'success');
            
            // Add delay before showing success popup
            setTimeout(() => {
                this.completeZone('living');
            }, 2000);
        } else {
            // Show progress message
            const remaining = zoneState.totalTrials - zoneState.completedTrials;
            this.showFeedback(`Masih ada ${remaining} percobaan lagi. Lanjutkan menghubungkan perangkat!`, 'info');
        }
    }
    
    handleKitchenDevice(device) {
        const deviceId = device.dataset.device;
        const zoneState = this.zoneStates.kitchen;
        
        this.showAICursor(device);
        
        setTimeout(() => {
            device.classList.toggle('active');
            
            if (device.classList.contains('active')) {
                zoneState.devicesActive.push(deviceId);
                this.showFeedback(`${device.querySelector('.device-label').textContent} dinyalakan`, 'success');
                this.playSound('device-on');
            } else {
                const index = zoneState.devicesActive.indexOf(deviceId);
                if (index > -1) {
                    zoneState.devicesActive.splice(index, 1);
                }
                this.showFeedback(`${device.querySelector('.device-label').textContent} dimatikan`, 'info');
                this.playSound('device-off');
            }
            
            this.updateKitchenEfficiency();
            this.hideAICursor();
        }, 800);
    }
    
    updateKitchenEfficiency() {
        const zoneState = this.zoneStates.kitchen;
        const activeDevices = zoneState.devicesActive.length;
        const totalDevices = document.querySelectorAll('.kitchen-device').length;
        
        // Calculate efficiency based on optimal usage
        const optimalDevices = 3; // Optimal number of devices to have on
        let efficiency;
        
        if (activeDevices === optimalDevices) {
            efficiency = 100;
        } else if (activeDevices < optimalDevices) {
            efficiency = (activeDevices / optimalDevices) * 80;
        } else {
            efficiency = Math.max(0, 100 - (activeDevices - optimalDevices) * 15);
        }
        
        zoneState.efficiency = efficiency;
        this.powerUsage = (activeDevices / totalDevices) * 100;
        
        // Update efficiency display
        const currentUsage = document.querySelector('.current-usage');
        if (currentUsage) {
            currentUsage.textContent = `${efficiency.toFixed(0)}% Efisien`;
        }
        
        this.updatePowerMeter();
        
        // Check completion
        if (efficiency >= 80) {
            this.completeZone('kitchen');
        }
    }
    
    handleLabDevice(slider) {
        const device = slider.closest('.lab-device');
        const deviceId = device.dataset.device;
        const value = parseInt(slider.value);
        
        // Update slider value display
        const valueDisplay = device.querySelector('.slider-value');
        if (valueDisplay) {
            valueDisplay.textContent = `${value}%`;
        }
        
        // Store device setting
        this.zoneStates.lab.deviceSettings[deviceId] = value;
        
        // Update bill simulation
        this.updateBillSimulation();
        
        // Play adjustment sound
        this.playSound('slider-adjust');
    }
    
    updateBillSimulation() {
        const settings = this.zoneStates.lab.deviceSettings;
        const deviceCosts = {
            'lab-lights': 0.5,
            'lab-ac': 2.0,
            'lab-tv': 1.0,
            'lab-fridge': 1.5,
            'lab-computer': 0.8
        };
        
        let totalCost = 0;
        const billContainer = document.querySelector('.bill-container');
        
        if (billContainer) {
            // Update individual device costs
            Object.keys(settings).forEach(deviceId => {
                const usage = settings[deviceId] || 0;
                const baseCost = deviceCosts[deviceId] || 1.0;
                const cost = (usage / 100) * baseCost * 24 * 30; // Monthly cost
                totalCost += cost;
                
                const billItem = billContainer.querySelector(`[data-device="${deviceId}"]`);
                if (billItem) {
                    billItem.textContent = `Rp ${cost.toFixed(0)}`;
                }
            });
            
            // Update total
            const billTotal = billContainer.querySelector('.bill-total .bill-amount');
            if (billTotal) {
                billTotal.textContent = `Rp ${totalCost.toFixed(0)}`;
            }
            
            // Update efficiency rating
            let efficiency = 0;
            if (totalCost < 200) efficiency = 100;
            else if (totalCost < 300) efficiency = 80;
            else if (totalCost < 400) efficiency = 60;
            else efficiency = 40;
            
            this.zoneStates.lab.efficiency = efficiency;
            this.zoneStates.lab.totalBill = totalCost;
            
            const efficiencyRating = billContainer.querySelector('.efficiency-rating .rating-value');
            if (efficiencyRating) {
                let ratingText, ratingClass;
                if (efficiency >= 90) {
                    ratingText = 'Sangat Efisien';
                    ratingClass = 'rating-excellent';
                } else if (efficiency >= 70) {
                    ratingText = 'Efisien';
                    ratingClass = 'rating-good';
                } else if (efficiency >= 50) {
                    ratingText = 'Cukup';
                    ratingClass = 'rating-fair';
                } else {
                    ratingText = 'Boros';
                    ratingClass = 'rating-poor';
                }
                
                efficiencyRating.textContent = ratingText;
                efficiencyRating.className = `rating-value ${ratingClass}`;
            }
            
            // Check completion
            if (efficiency >= 70) {
                this.completeZone('lab');
            }
        }
    }
    
    completeZone(zoneId) {
        if (this.zoneStates[zoneId].completed) return;
        
        this.zoneStates[zoneId].completed = true;
        this.energyKeys[zoneId] = true;
        
        // Update map zone visual
        const mapZone = document.querySelector(`.map-zone[data-zone="${zoneId}"]`);
        if (mapZone) {
            mapZone.classList.add('completed');
        }
        
        // Show zone reward
        this.showZoneReward(zoneId);
        
        // Update HUD
        this.updateHUD();
        
        // Play completion sound
        this.playSound('zone-complete');
        
        // Show completion feedback
        this.showFeedback(`${this.getZoneName(zoneId)} selesai! Kunci Energi didapat!`, 'success');
        
        // Unlock exit if all zones completed
        if (Object.values(this.energyKeys).every(key => key)) {
            this.unlockExit();
        }
    }
    
    showZoneReward(zoneId) {
        const reward = document.querySelector(`#${zoneId}-zone .zone-reward`);
        if (reward) {
            reward.classList.remove('hidden');
            
            // Add sparkle animation
            this.addSparkleEffect(reward);
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                reward.classList.add('hidden');
            }, 3000);
        }
    }
    
    unlockExit() {
        const exitDoor = document.querySelector('.exit-door');
        if (exitDoor) {
            exitDoor.classList.add('unlocked');
            
            // Update key slots
            document.querySelectorAll('.key-slot').forEach(slot => {
                slot.classList.add('unlocked');
            });
            
            // Show exit zone
            this.showZone('exit');
            this.showCharacterSpeech('exit');
            
            // Play unlock sound
            this.playSound('door-unlock');
            
            this.showFeedback('Semua Kunci Energi terkumpul! Pintu terbuka!', 'success');
        }
    }
    
    handleExitDoor() {
        if (Object.values(this.energyKeys).every(key => key)) {
            this.completeGame();
        } else {
            this.showFeedback('Kumpulkan semua Kunci Energi terlebih dahulu!', 'warning');
            this.playSound('door-locked');
        }
    }
    
    completeGame() {
        this.gameCompleted = true;
        
        // Show victory animation
        this.showVictoryAnimation();
        
        // Play victory sound
        this.playSound('victory');
        
        // Save game completion
        localStorage.setItem('energyGameCompleted', 'true');
        
        // Return to main menu after animation
        setTimeout(() => {
            this.returnToMainMenu();
        }, 5000);
    }
    
    showVictoryAnimation() {
        const victoryDiv = document.createElement('div');
        victoryDiv.className = 'victory-animation';
        victoryDiv.innerHTML = `
            <div class="victory-glow"></div>
            <div class="victory-text">
                <h2>🎉 Selamat! 🎉</h2>
                <p>Kamu telah berhasil menyelesaikan misi Energi!<br>
                Rumah sekarang terang dan efisien berkat bantuanmu!</p>
            </div>
        `;
        
        document.body.appendChild(victoryDiv);
        
        // Animate victory screen
        setTimeout(() => {
            victoryDiv.style.opacity = '1';
            victoryDiv.style.visibility = 'visible';
        }, 100);
    }
    
    returnToMainMenu() {
        // Redirect to main menu or quiz
        window.location.href = 'index.html';
    }
    
    updateHUD() {
        // Update energy keys display
        Object.keys(this.energyKeys).forEach(zoneId => {
            const keyElement = document.querySelector(`#energy-keys .energy-key[data-zone="${zoneId}"]`);
            if (keyElement) {
                if (this.energyKeys[zoneId]) {
                    keyElement.classList.add('unlocked');
                } else {
                    keyElement.classList.remove('unlocked');
                }
            }
        });
        
        this.updatePowerMeter();
    }
    
    updatePowerMeter() {
        const meterFill = document.querySelector('.meter-fill');
        const meterValue = document.querySelector('.meter-value');
        
        if (meterFill && meterValue) {
            const percentage = Math.min(100, Math.max(0, this.powerUsage));
            meterFill.style.width = `${percentage}%`;
            meterValue.textContent = `${percentage.toFixed(0)}%`;
        }
    }
    
    showAICursor(targetElement) {
        if (!targetElement) return;
        
        this.aiCursorActive = true;
        let cursor = document.querySelector('.ai-cursor');
        
        if (!cursor) {
            cursor = document.createElement('div');
            cursor.className = 'ai-cursor';
            cursor.innerHTML = `
                <div class="cursor-glow"></div>
                <div class="cursor-pointer">👆</div>
            `;
            document.body.appendChild(cursor);
        }
        
        cursor.classList.remove('hidden');
        
        const rect = targetElement.getBoundingClientRect();
        cursor.style.left = `${rect.left + rect.width / 2}px`;
        cursor.style.top = `${rect.top + rect.height / 2}px`;
    }
    
    hideAICursor() {
        this.aiCursorActive = false;
        const cursor = document.querySelector('.ai-cursor');
        if (cursor) {
            cursor.classList.add('hidden');
        }
    }
    
    createAICursor() {
        const cursor = document.createElement('div');
        cursor.className = 'ai-cursor hidden';
        cursor.innerHTML = `
            <div class="cursor-glow"></div>
            <div class="cursor-pointer">👆</div>
        `;
        document.body.appendChild(cursor);
    }
    
    addSparkleEffect(element) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-effect';
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'absolute';
        sparkle.style.fontSize = '2em';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1000';
        sparkle.style.animation = 'sparkleFloat 2s ease-out forwards';
        
        const rect = element.getBoundingClientRect();
        sparkle.style.left = `${rect.left + rect.width / 2}px`;
        sparkle.style.top = `${rect.top}px`;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 2000);
    }
    
    showFeedback(message, type = 'info') {
        const container = document.getElementById('feedback-container');
        if (!container) {
            const feedbackContainer = document.createElement('div');
            feedbackContainer.id = 'feedback-container';
            document.body.appendChild(feedbackContainer);
        }
        
        const feedback = document.createElement('div');
        feedback.className = `feedback-message ${type}`;
        feedback.textContent = message;
        
        document.getElementById('feedback-container').appendChild(feedback);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            feedback.classList.add('fade-out');
            setTimeout(() => {
                feedback.remove();
            }, 500);
        }, 3000);
    }
    
    playSound(soundType) {
        // Sound effects would be implemented here
        // For now, we'll use console.log to indicate sound events
        console.log(`🔊 Playing sound: ${soundType}`);
        
        // You can add actual audio implementation here:
        // const audio = new Audio(`sounds/${soundType}.mp3`);
        // audio.play().catch(e => console.log('Audio play failed:', e));
    }
    
    getZoneName(zoneId) {
        const names = {
            living: 'Ruang Tamu',
            kitchen: 'Dapur',
            lab: 'Laboratorium',
            exit: 'Pintu Keluar'
        };
        return names[zoneId] || zoneId;
    }
    
    startBackgroundAnimations() {
        // Add CSS animation for sparkle float
        const style = document.createElement('style');
        style.textContent = `
            @keyframes sparkleFloat {
                0% {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100px) scale(1.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new EnergyGame();
    
    // Make game instance globally available for debugging
    window.energyGame = game;
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnergyGame;
}