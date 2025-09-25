// Energy Game Zones JavaScript
class EnergyGameZones {
    constructor() {
        this.currentZone = 'livingRoom';
        this.keysCollected = [];
        this.powerUsage = 0;
        this.maxPower = 500;
        this.gameState = {
            zone1Complete: false,
            zone2Complete: false,
            zone3Complete: false,
            allKeysCollected: false
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initZone1();
        this.updateHUD();
        this.showZone('livingRoom');
    }

    setupEventListeners() {
        // Zone navigation
        document.querySelectorAll('.zone-indicator').forEach(indicator => {
            indicator.addEventListener('click', (e) => {
                const zone = e.target.dataset.zone;
                this.navigateToZone(zone);
            });
        });

        // Zone 1: Cable connections
        this.setupZone1Listeners();
        
        // Zone 2: Appliance controls
        this.setupZone2Listeners();
        
        // Zone 3: Lab connections
        this.setupZone3Listeners();
        
        // Final door
        this.setupFinalDoorListeners();
    }

    // Zone 1: Living Room - Cable Puzzle
    setupZone1Listeners() {
        const cablePoints = document.querySelectorAll('#livingRoom .cable-point');
        const outlets = document.querySelectorAll('#livingRoom .power-outlet');
        
        cablePoints.forEach(point => {
            point.addEventListener('click', (e) => {
                this.handleCableConnection(e.target);
            });
        });
        
        outlets.forEach(outlet => {
            outlet.addEventListener('click', (e) => {
                this.handleOutletConnection(e.target.closest('.power-outlet'));
            });
        });
    }

    initZone1() {
        this.zone1Connections = {
            lamp1: null,
            lamp2: null,
            tv1: null
        };
        this.selectedCable = null;
    }

    handleCableConnection(cablePoint) {
        const device = cablePoint.dataset.cable;
        this.selectedCable = device;
        
        // Visual feedback
        document.querySelectorAll('.cable-point').forEach(cp => cp.classList.remove('selected'));
        cablePoint.classList.add('selected');
        
        // AI cursor animation
        this.animateAICursor(cablePoint);
        
        // Show connection hint
        this.showConnectionHint(device);
    }

    handleOutletConnection(outlet) {
        if (!this.selectedCable) return;
        
        const outletType = outlet.dataset.type;
        const isCorrect = this.checkCorrectConnection(this.selectedCable, outlet.id);
        
        // AI cursor moves to outlet
        this.animateAICursorToOutlet(outlet, () => {
            this.makeConnection(this.selectedCable, outlet.id, isCorrect);
        });
    }

    checkCorrectConnection(device, outletId) {
        const correctConnections = {
            lamp1: 'outlet1',
            lamp2: 'outlet3',
            tv1: 'outlet1'
        };
        return correctConnections[device] === outletId;
    }

    makeConnection(device, outletId, isCorrect) {
        this.zone1Connections[device] = outletId;
        
        // Draw cable
        this.drawCable(device, outletId, isCorrect);
        
        // Update device state
        const deviceElement = document.getElementById(device);
        deviceElement.dataset.connected = isCorrect.toString();
        
        // Visual feedback
        if (isCorrect) {
            this.showSuccessFeedback(device);
            this.addSparkleEffect(deviceElement);
        } else {
            this.showErrorFeedback(device);
        }
        
        // Check if zone 1 is complete
        this.checkZone1Complete();
        
        this.selectedCable = null;
        document.querySelectorAll('.cable-point').forEach(cp => cp.classList.remove('selected'));
    }

    drawCable(device, outletId, isCorrect) {
        const deviceElement = document.getElementById(device);
        const outletElement = document.getElementById(outletId);
        const cableLayer = document.getElementById('cableLayer');
        
        const deviceRect = deviceElement.getBoundingClientRect();
        const outletRect = outletElement.getBoundingClientRect();
        const layerRect = cableLayer.getBoundingClientRect();
        
        const startX = deviceRect.left + deviceRect.width / 2 - layerRect.left;
        const startY = deviceRect.bottom - layerRect.top;
        const endX = outletRect.left + outletRect.width / 2 - layerRect.left;
        const endY = outletRect.top - layerRect.top;
        
        // Remove existing cable for this device
        const existingCable = cableLayer.querySelector(`[data-device="${device}"]`);
        if (existingCable) {
            existingCable.remove();
        }
        
        // Create new cable
        const cable = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = `M ${startX} ${startY} Q ${(startX + endX) / 2} ${(startY + endY) / 2 - 50} ${endX} ${endY}`;
        
        cable.setAttribute('d', d);
        cable.setAttribute('data-device', device);
        cable.classList.add('cable');
        cable.classList.add(isCorrect ? 'correct' : 'wrong');
        
        cableLayer.appendChild(cable);
    }

    checkZone1Complete() {
        const allConnected = Object.values(this.zone1Connections).every(connection => connection !== null);
        const allCorrect = Object.keys(this.zone1Connections).every(device => {
            const deviceElement = document.getElementById(device);
            return deviceElement.dataset.connected === 'true';
        });
        
        if (allConnected && allCorrect) {
            this.completeZone1();
        }
    }

    completeZone1() {
        this.gameState.zone1Complete = true;
        this.showEnergyKey('energyKey1');
        this.updateMiniMap('zone1', 'completed');
        
        // Celebration effects
        this.addCelebrationEffects('livingRoom');
        
        setTimeout(() => {
            this.showZoneCompleteMessage('Zona 1 Selesai!', 'Kunci Energi 1 didapat!');
        }, 1000);
    }

    // Zone 2: Kitchen - Energy Efficiency
    setupZone2Listeners() {
        const appliances = document.querySelectorAll('#kitchen .appliance');
        
        appliances.forEach(appliance => {
            appliance.addEventListener('click', (e) => {
                this.handleApplianceToggle(e.target.closest('.appliance'));
            });
        });
    }

    handleApplianceToggle(appliance) {
        const isActive = appliance.dataset.active === 'true';
        const power = parseInt(appliance.dataset.power);
        
        // AI character animation
        this.animateCharacterToAppliance(appliance, () => {
            // Toggle appliance
            appliance.dataset.active = (!isActive).toString();
            appliance.classList.toggle('active', !isActive);
            
            // Update power usage
            if (!isActive) {
                this.powerUsage += power;
            } else {
                this.powerUsage -= power;
            }
            
            this.updatePowerMeter();
            this.updateCurrentUsage();
            this.checkZone2Complete();
        });
    }

    updatePowerMeter() {
        const powerFill = document.getElementById('powerFill');
        const powerValue = document.getElementById('powerValue');
        
        const percentage = Math.min((this.powerUsage / this.maxPower) * 100, 100);
        powerFill.style.width = `${percentage}%`;
        powerValue.textContent = `${this.powerUsage}W`;
    }

    updateCurrentUsage() {
        const currentUsage = document.getElementById('currentUsage');
        currentUsage.textContent = `${this.powerUsage}W`;
        
        // Color coding
        currentUsage.classList.remove('warning', 'danger');
        if (this.powerUsage > 200) {
            currentUsage.classList.add('danger');
        } else if (this.powerUsage > 150) {
            currentUsage.classList.add('warning');
        }
    }

    checkZone2Complete() {
        if (this.powerUsage <= 200 && this.powerUsage > 0) {
            this.completeZone2();
        }
    }

    completeZone2() {
        if (this.gameState.zone2Complete) return;
        
        this.gameState.zone2Complete = true;
        this.showEnergyKey('energyKey2');
        this.updateMiniMap('zone2', 'completed');
        
        // Celebration effects
        this.addCelebrationEffects('kitchen');
        
        setTimeout(() => {
            this.showZoneCompleteMessage('Zona 2 Selesai!', 'Efisiensi energi tercapai!');
        }, 1000);
    }

    // Zone 3: Laboratory - Bill Simulation
    setupZone3Listeners() {
        const devices = document.querySelectorAll('#lab .lab-device');
        const powerSources = document.querySelectorAll('#lab .power-source');
        
        devices.forEach(device => {
            device.addEventListener('click', (e) => {
                this.handleDeviceSelection(e.target.closest('.lab-device'));
            });
        });
        
        powerSources.forEach(source => {
            source.addEventListener('click', (e) => {
                this.handlePowerSourceSelection(e.target.closest('.power-source'));
            });
        });
    }

    handleDeviceSelection(device) {
        if (this.selectedDevice) {
            this.selectedDevice.classList.remove('selected');
        }
        
        this.selectedDevice = device;
        device.classList.add('selected');
        
        // Show connection hint
        this.showDeviceConnectionHint(device);
    }

    handlePowerSourceSelection(source) {
        if (!this.selectedDevice) return;
        
        const devicePower = parseInt(this.selectedDevice.dataset.power);
        const sourceCapacity = parseInt(source.dataset.capacity);
        
        // AI cursor animation
        this.animateConnectionCursor(this.selectedDevice, source, () => {
            this.makeDeviceConnection(this.selectedDevice, source, devicePower, sourceCapacity);
        });
    }

    makeDeviceConnection(device, source, devicePower, sourceCapacity) {
        const canConnect = sourceCapacity >= devicePower;
        
        if (canConnect) {
            device.dataset.connected = 'true';
            device.classList.add('connected');
            
            // Draw connection
            this.drawDeviceConnection(device, source);
            
            // Update bill simulation
            this.updateBillSimulation();
            
            this.showSuccessFeedback(device.id);
        } else {
            this.showErrorFeedback(device.id);
        }
        
        // Clear selection
        device.classList.remove('selected');
        this.selectedDevice = null;
        
        this.checkZone3Complete();
    }

    drawDeviceConnection(device, source) {
        const connectionLayer = document.getElementById('connectionLayer');
        
        const deviceRect = device.getBoundingClientRect();
        const sourceRect = source.getBoundingClientRect();
        const layerRect = connectionLayer.getBoundingClientRect();
        
        const startX = deviceRect.left + deviceRect.width / 2 - layerRect.left;
        const startY = deviceRect.bottom - layerRect.top;
        const endX = sourceRect.left + sourceRect.width / 2 - layerRect.left;
        const endY = sourceRect.top - layerRect.top;
        
        const connection = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        connection.setAttribute('x1', startX);
        connection.setAttribute('y1', startY);
        connection.setAttribute('x2', endX);
        connection.setAttribute('y2', endY);
        connection.setAttribute('stroke', '#4CAF50');
        connection.setAttribute('stroke-width', '4');
        connection.setAttribute('data-device', device.id);
        
        connectionLayer.appendChild(connection);
    }

    updateBillSimulation() {
        const connectedDevices = document.querySelectorAll('#lab .lab-device[data-connected="true"]');
        let totalPower = 0;
        
        connectedDevices.forEach(device => {
            totalPower += parseInt(device.dataset.power);
        });
        
        const billAmount = Math.round(totalPower * 0.5); // Simplified calculation
        const billElement = document.getElementById('billAmount');
        const ratingElement = document.getElementById('efficiencyRating');
        
        billElement.textContent = `Rp ${billAmount.toLocaleString()}`;
        
        // Efficiency rating
        let stars = '⭐⭐⭐';
        if (totalPower > 600) {
            stars = '⭐';
        } else if (totalPower > 400) {
            stars = '⭐⭐';
        }
        
        ratingElement.textContent = stars;
    }

    checkZone3Complete() {
        const connectedDevices = document.querySelectorAll('#lab .lab-device[data-connected="true"]');
        const totalDevices = document.querySelectorAll('#lab .lab-device').length;
        
        if (connectedDevices.length === totalDevices) {
            this.completeZone3();
        }
    }

    completeZone3() {
        if (this.gameState.zone3Complete) return;
        
        this.gameState.zone3Complete = true;
        this.showEnergyKey('energyKey3');
        this.updateMiniMap('zone3', 'completed');
        
        // Celebration effects
        this.addCelebrationEffects('lab');
        
        setTimeout(() => {
            this.showZoneCompleteMessage('Zona 3 Selesai!', 'Simulasi tagihan berhasil!');
        }, 1000);
    }

    // Final Door
    setupFinalDoorListeners() {
        const doorLever = document.getElementById('doorLever');
        
        doorLever.addEventListener('click', () => {
            this.handleDoorLever();
        });
    }

    handleDoorLever() {
        if (this.keysCollected.length === 3) {
            this.openFinalDoor();
        } else {
            this.showMessage('Kumpulkan semua kunci energi terlebih dahulu!');
        }
    }

    openFinalDoor() {
        const door = document.getElementById('mainDoor');
        const lever = document.getElementById('doorLever');
        
        lever.classList.add('active');
        door.classList.add('open');
        
        // Final celebration
        this.addFinalCelebrationEffects();
        
        setTimeout(() => {
            this.showSuccessModal();
        }, 2000);
    }

    // Utility Functions
    showZone(zoneId) {
        document.querySelectorAll('.zone').forEach(zone => {
            zone.classList.remove('active');
        });
        
        document.getElementById(zoneId).classList.add('active');
        this.currentZone = zoneId;
        
        this.updateMiniMap(this.getZoneNumber(zoneId), 'active');
    }

    navigateToZone(zoneName) {
        const zoneMap = {
            'living-room': 'livingRoom',
            'kitchen': 'kitchen',
            'lab': 'lab',
            'door': 'finalDoor'
        };
        
        const zoneId = zoneMap[zoneName];
        if (zoneId) {
            this.showZone(zoneId);
        }
    }

    getZoneNumber(zoneId) {
        const zoneNumbers = {
            'livingRoom': 'zone1',
            'kitchen': 'zone2',
            'lab': 'zone3',
            'finalDoor': 'final-door'
        };
        return zoneNumbers[zoneId];
    }

    updateMiniMap(zoneId, status) {
        const indicator = document.getElementById(zoneId);
        if (indicator) {
            indicator.classList.remove('active', 'completed');
            indicator.classList.add(status);
        }
    }

    showEnergyKey(keyId) {
        const key = document.getElementById(keyId);
        key.classList.remove('hidden');
        
        // Add to collected keys
        const keyNumber = keyId.replace('energyKey', '');
        this.keysCollected.push(keyNumber);
        
        // Update HUD
        this.updateHUD();
        
        // Key collection animation
        setTimeout(() => {
            key.addEventListener('click', () => {
                this.collectKey(keyId, keyNumber);
            });
        }, 500);
    }

    collectKey(keyId, keyNumber) {
        const key = document.getElementById(keyId);
        const hudKey = document.getElementById(`key${keyNumber}`);
        
        // Animation: key flies to HUD
        key.style.transition = 'all 1s ease';
        key.style.transform = 'scale(0.5) translate(500px, -300px)';
        key.style.opacity = '0';
        
        setTimeout(() => {
            key.classList.add('hidden');
            hudKey.classList.add('collected');
            
            // Check if all keys collected
            if (this.keysCollected.length === 3) {
                this.gameState.allKeysCollected = true;
                this.updateMiniMap('final-door', 'active');
                this.showMessage('Semua kunci terkumpul! Buka pintu akhir!');
            }
        }, 1000);
    }

    updateHUD() {
        this.updatePowerMeter();
        
        // Update key indicators
        this.keysCollected.forEach(keyNumber => {
            const hudKey = document.getElementById(`key${keyNumber}`);
            if (hudKey) {
                hudKey.classList.add('collected');
            }
        });
    }

    // Animation Functions
    animateAICursor(element) {
        const cursor = this.createAICursor();
        const rect = element.getBoundingClientRect();
        
        cursor.style.left = `${rect.left + rect.width / 2}px`;
        cursor.style.top = `${rect.top + rect.height / 2}px`;
        
        setTimeout(() => {
            cursor.remove();
        }, 1000);
    }

    animateAICursorToOutlet(outlet, callback) {
        const cursor = this.createAICursor();
        const rect = outlet.getBoundingClientRect();
        
        cursor.style.transition = 'all 0.5s ease';
        cursor.style.left = `${rect.left + rect.width / 2}px`;
        cursor.style.top = `${rect.top + rect.height / 2}px`;
        
        setTimeout(() => {
            cursor.remove();
            callback();
        }, 500);
    }

    animateCharacterToAppliance(appliance, callback) {
        // Simulate character movement
        const character = this.createCharacterIndicator();
        const rect = appliance.getBoundingClientRect();
        
        character.style.transition = 'all 1s ease';
        character.style.left = `${rect.left}px`;
        character.style.top = `${rect.top - 50}px`;
        
        setTimeout(() => {
            character.remove();
            callback();
        }, 1000);
    }

    animateConnectionCursor(device, source, callback) {
        const cursor = this.createAICursor();
        const deviceRect = device.getBoundingClientRect();
        const sourceRect = source.getBoundingClientRect();
        
        cursor.style.left = `${deviceRect.left + deviceRect.width / 2}px`;
        cursor.style.top = `${deviceRect.top + deviceRect.height / 2}px`;
        
        setTimeout(() => {
            cursor.style.transition = 'all 0.8s ease';
            cursor.style.left = `${sourceRect.left + sourceRect.width / 2}px`;
            cursor.style.top = `${sourceRect.top + sourceRect.height / 2}px`;
            
            setTimeout(() => {
                cursor.remove();
                callback();
            }, 800);
        }, 100);
    }

    createAICursor() {
        const cursor = document.createElement('div');
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, #FFD700, #FFA500);
            border-radius: 50%;
            z-index: 1000;
            pointer-events: none;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
            animation: cursorPulse 0.5s infinite;
        `;
        
        document.body.appendChild(cursor);
        return cursor;
    }

    createCharacterIndicator() {
        const character = document.createElement('div');
        character.textContent = '🚶‍♂️';
        character.style.cssText = `
            position: fixed;
            font-size: 30px;
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(character);
        return character;
    }

    // Visual Effects
    addSparkleEffect(element) {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, transparent 70%);
            border-radius: 50%;
            animation: sparkle 2s infinite;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 4000);
    }

    addCelebrationEffects(zoneId) {
        const zone = document.getElementById(zoneId);
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.createCelebrationParticle(zone);
            }, i * 100);
        }
    }

    createCelebrationParticle(container) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: ${['#FFD700', '#FFA500', '#4CAF50', '#2196F3'][Math.floor(Math.random() * 4)]};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: celebrationFloat 3s ease-out forwards;
            pointer-events: none;
            z-index: 100;
        `;
        
        container.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 3000);
    }

    addFinalCelebrationEffects() {
        const container = document.getElementById('finalDoor');
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createCelebrationParticle(container);
            }, i * 50);
        }
    }

    // Feedback Functions
    showSuccessFeedback(elementId) {
        this.showTemporaryMessage('✅ Berhasil!', 'success');
    }

    showErrorFeedback(elementId) {
        this.showTemporaryMessage('❌ Salah!', 'error');
    }

    showConnectionHint(device) {
        const hints = {
            lamp1: 'Hubungkan lampu 1 ke stop kontak yang tepat',
            lamp2: 'Hubungkan lampu 2 ke stop kontak yang tepat',
            tv1: 'Hubungkan TV ke stop kontak yang tepat'
        };
        
        this.showTemporaryMessage(hints[device], 'hint');
    }

    showDeviceConnectionHint(device) {
        const deviceName = device.querySelector('.device-label').textContent;
        this.showTemporaryMessage(`Pilih sumber daya untuk ${deviceName}`, 'hint');
    }

    showTemporaryMessage(message, type) {
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-weight: bold;
            z-index: 2000;
            animation: messageSlide 2s ease-out forwards;
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 2000);
    }

    showZoneCompleteMessage(title, subtitle) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                max-width: 400px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            ">
                <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
                <h2 style="color: #4CAF50; margin-bottom: 15px; font-size: 24px;">${title}</h2>
                <p style="color: #666; font-size: 16px; margin-bottom: 25px;">${subtitle}</p>
                <button onclick="this.closest('.modal').remove()" style="
                    padding: 12px 24px;
                    background: linear-gradient(45deg, #4CAF50, #45a049);
                    color: white;
                    border: none;
                    border-radius: 25px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                ">Lanjutkan</button>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    showMessage(message) {
        this.showTemporaryMessage(message, 'hint');
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        modal.classList.remove('hidden');
    }

    // Reset Functions
    resetZone1() {
        this.initZone1();
        document.getElementById('cableLayer').innerHTML = '';
        document.querySelectorAll('#livingRoom .lamp, #livingRoom .tv').forEach(device => {
            device.dataset.connected = 'false';
        });
        document.querySelectorAll('#livingRoom .cable-point').forEach(cp => {
            cp.classList.remove('selected');
        });
    }

    resetZone2() {
        this.powerUsage = 150; // Reset to fridge only
        document.querySelectorAll('#kitchen .appliance').forEach(appliance => {
            const isInitiallyActive = appliance.id === 'fridge';
            appliance.dataset.active = isInitiallyActive.toString();
            appliance.classList.toggle('active', isInitiallyActive);
        });
        this.updatePowerMeter();
        this.updateCurrentUsage();
    }

    resetZone3() {
        document.querySelectorAll('#lab .lab-device').forEach(device => {
            device.dataset.connected = 'false';
            device.classList.remove('connected', 'selected');
        });
        document.getElementById('connectionLayer').innerHTML = '';
        this.selectedDevice = null;
        this.updateBillSimulation();
    }

    // Navigation Functions
    nextZone() {
        const zoneOrder = ['livingRoom', 'kitchen', 'lab', 'finalDoor'];
        const currentIndex = zoneOrder.indexOf(this.currentZone);
        
        if (currentIndex < zoneOrder.length - 1) {
            this.showZone(zoneOrder[currentIndex + 1]);
        }
    }

    completeMission() {
        this.showSuccessModal();
    }

    returnToMenu() {
        // Navigate back to main menu
        window.location.href = 'main-menu.html';
    }
}

// Global Functions
function resetZone1() {
    game.resetZone1();
}

function resetZone2() {
    game.resetZone2();
}

function resetZone3() {
    game.resetZone3();
}

function nextZone() {
    game.nextZone();
}

function openFinalDoor() {
    game.showZone('finalDoor');
}

function completeMission() {
    game.completeMission();
}

function returnToMenu() {
    game.returnToMenu();
}

// CSS Animations (added via JavaScript)
const style = document.createElement('style');
style.textContent = `
    @keyframes cursorPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    @keyframes messageSlide {
        0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
        20% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        80% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
    }
    
    @keyframes celebrationFloat {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-200px) scale(0); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize Game
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new EnergyGameZones();
});