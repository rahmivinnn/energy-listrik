// Energy Experiments JavaScript
let currentExperiment = 1;
const totalExperiments = 10;
let experimentProgress = {};

// Initialize experiments
document.addEventListener('DOMContentLoaded', function() {
    initializeExperiments();
    updateNavigation();
    updateProgressBar();
});

function initializeExperiments() {
    // Initialize progress tracking
    for (let i = 1; i <= totalExperiments; i++) {
        experimentProgress[i] = {
            completed: false,
            score: 0,
            attempts: 0
        };
    }
    
    // Initialize experiment-specific data
    initializeSolarLab();
    initializeWindLab();
    initializeBatteryLab();
    initializeGridLab();
    initializeHydroLab();
    initializeGeoLab();
    initializeNuclearLab();
    initializeBiomassLab();
    initializeTidalLab();
    initializeFusionLab();
}

// Navigation Functions
function nextExperiment() {
    if (currentExperiment < totalExperiments) {
        document.getElementById(`exp${currentExperiment}`).classList.remove('active');
        currentExperiment++;
        document.getElementById(`exp${currentExperiment}`).classList.add('active');
        updateNavigation();
        updateProgressBar();
        
        // Play transition sound effect
        playTransitionSound();
    } else {
        // All experiments completed
        showCompletionModal();
    }
}

function previousExperiment() {
    if (currentExperiment > 1) {
        document.getElementById(`exp${currentExperiment}`).classList.remove('active');
        currentExperiment--;
        document.getElementById(`exp${currentExperiment}`).classList.add('active');
        updateNavigation();
        updateProgressBar();
        
        playTransitionSound();
    }
}

function updateNavigation() {
    document.getElementById('currentExp').textContent = currentExperiment;
    document.getElementById('prevBtn').disabled = currentExperiment === 1;
    document.getElementById('nextBtn').disabled = currentExperiment === totalExperiments;
    
    if (currentExperiment === totalExperiments) {
        document.getElementById('nextBtn').textContent = 'Complete ✓';
    } else {
        document.getElementById('nextBtn').textContent = 'Next ▶';
    }
}

function updateProgressBar() {
    const progress = (currentExperiment / totalExperiments) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

// Experiment 1: Solar Panel Efficiency
let solarData = {
    sunPosition: 0,
    panelAngles: [0, 45, 90],
    efficiency: [0, 0, 0]
};

function initializeSolarLab() {
    updateSolarOutput();
}

function rotatePanels() {
    solarData.panelAngles = solarData.panelAngles.map(angle => (angle + 15) % 360);
    
    document.querySelectorAll('.solar-panel').forEach((panel, index) => {
        panel.dataset.angle = solarData.panelAngles[index];
        panel.querySelector('.angle-indicator').textContent = `${solarData.panelAngles[index]}°`;
        panel.style.transform = `rotate(${solarData.panelAngles[index] * 0.5}deg)`;
    });
    
    updateSolarOutput();
    addVisualEffect(document.querySelector('.solar-lab'), 'pulse');
}

function changeSunPosition() {
    solarData.sunPosition = (solarData.sunPosition + 30) % 360;
    const sun = document.getElementById('sun1');
    const x = 100 + Math.cos(solarData.sunPosition * Math.PI / 180) * 80;
    const y = 20 + Math.sin(solarData.sunPosition * Math.PI / 180) * 40;
    
    sun.style.right = `${x}px`;
    sun.style.top = `${y}px`;
    
    updateSolarOutput();
}

function updateSolarOutput() {
    let totalOutput = 0;
    
    solarData.panelAngles.forEach((angle, index) => {
        const optimalAngle = solarData.sunPosition;
        const angleDiff = Math.abs(angle - optimalAngle);
        const efficiency = Math.max(0, 100 - angleDiff * 2);
        solarData.efficiency[index] = efficiency;
        totalOutput += efficiency;
    });
    
    const outputPercentage = Math.min(100, totalOutput / 3);
    document.getElementById('solarOutput').style.width = `${outputPercentage}%`;
    document.getElementById('solarValue').textContent = `${(totalOutput * 0.1).toFixed(1)} kWh`;
    
    if (outputPercentage > 80) {
        markExperimentComplete(1);
    }
}

// Experiment 2: Wind Turbine Power
let windData = {
    speed: 15,
    turbines: [1, 0.5, 1.5]
};

function initializeWindLab() {
    updateWindOutput();
}

function increaseWind() {
    windData.speed = Math.min(50, windData.speed + 5);
    updateWindDisplay();
    updateTurbineSpeed();
    updateWindOutput();
}

function decreaseWind() {
    windData.speed = Math.max(0, windData.speed - 5);
    updateWindDisplay();
    updateTurbineSpeed();
    updateWindOutput();
}

function updateWindDisplay() {
    document.getElementById('windSpeed').textContent = windData.speed;
}

function updateTurbineSpeed() {
    document.querySelectorAll('.turbine-blades').forEach((turbine, index) => {
        turbine.className = 'turbine-blades';
        
        if (windData.speed > 30) {
            turbine.classList.add('rotating-fast');
        } else if (windData.speed > 10) {
            turbine.classList.add('rotating');
        } else if (windData.speed > 5) {
            turbine.classList.add('rotating-slow');
        }
    });
}

function updateWindOutput() {
    const baseOutput = windData.speed * windData.speed * 0.1;
    const totalOutput = baseOutput * windData.turbines.reduce((a, b) => a + b, 0);
    
    const outputPercentage = Math.min(100, totalOutput / 50);
    document.getElementById('windOutput').style.width = `${outputPercentage}%`;
    document.getElementById('windValue').textContent = `${(totalOutput * 0.01).toFixed(1)} MW`;
    
    if (outputPercentage > 75) {
        markExperimentComplete(2);
    }
}

// Experiment 3: Battery Storage System
let batteryData = {
    batteries: [80, 45, 90],
    demand: 150,
    charging: false
};

function initializeBatteryLab() {
    updateBatteryDisplay();
    updateDemandDisplay();
}

function chargeBatteries() {
    batteryData.charging = true;
    batteryData.batteries = batteryData.batteries.map(charge => Math.min(100, charge + 10));
    updateBatteryDisplay();
    addVisualEffect(document.querySelector('.battery-bank'), 'glow');
    
    setTimeout(() => {
        batteryData.charging = false;
        checkBatteryBalance();
    }, 1000);
}

function dischargeBatteries() {
    batteryData.batteries = batteryData.batteries.map(charge => Math.max(0, charge - 15));
    updateBatteryDisplay();
    checkBatteryBalance();
}

function balanceLoad() {
    const totalCharge = batteryData.batteries.reduce((a, b) => a + b, 0);
    const avgCharge = totalCharge / 3;
    
    batteryData.batteries = batteryData.batteries.map(() => avgCharge);
    updateBatteryDisplay();
    
    if (Math.abs(batteryData.batteries[0] - batteryData.batteries[1]) < 5) {
        markExperimentComplete(3);
    }
}

function updateBatteryDisplay() {
    batteryData.batteries.forEach((charge, index) => {
        const battery = document.getElementById(`bat${index + 1}`);
        const level = battery.querySelector('.battery-level');
        const label = battery.querySelector('.battery-label');
        
        level.style.height = `${charge}%`;
        label.textContent = `Battery ${index + 1}: ${Math.round(charge)}%`;
        
        // Color coding
        if (charge > 70) {
            level.style.background = 'linear-gradient(to top, #00ff00, #88ff88)';
        } else if (charge > 30) {
            level.style.background = 'linear-gradient(to top, #ffff00, #ffff88)';
        } else {
            level.style.background = 'linear-gradient(to top, #ff0000, #ff8888)';
        }
    });
}

function updateDemandDisplay() {
    const demandPercentage = (batteryData.demand / 300) * 100;
    document.getElementById('demandLevel').style.width = `${demandPercentage}%`;
    document.getElementById('demandValue').textContent = `${batteryData.demand} kW`;
}

function checkBatteryBalance() {
    const totalCapacity = batteryData.batteries.reduce((a, b) => a + b, 0) * 10;
    if (totalCapacity >= batteryData.demand * 2) {
        addVisualEffect(document.querySelector('.battery-lab'), 'pulse');
    }
}

// Experiment 4: Smart Grid Management
let gridData = {
    sources: ['coal', 'solar', 'wind'],
    activeSource: 0,
    load: 75,
    efficiency: 92
};

function initializeGridLab() {
    updateGridDisplay();
    drawGridConnections();
}

function optimizeGrid() {
    gridData.efficiency = Math.min(100, gridData.efficiency + 5);
    gridData.load = Math.max(50, gridData.load - 10);
    updateGridDisplay();
    redrawGridConnections();
    
    if (gridData.efficiency > 95) {
        markExperimentComplete(4);
    }
}

function switchSource() {
    gridData.activeSource = (gridData.activeSource + 1) % gridData.sources.length;
    updateGridDisplay();
    redrawGridConnections();
}

function updateGridDisplay() {
    document.getElementById('gridLoad').textContent = `${gridData.load}%`;
    document.getElementById('gridEfficiency').textContent = `${gridData.efficiency}%`;
    
    // Highlight active power plant
    document.querySelectorAll('.power-plant').forEach((plant, index) => {
        if (index === gridData.activeSource) {
            plant.style.filter = 'drop-shadow(0 0 20px #00ffff)';
        } else {
            plant.style.filter = 'none';
        }
    });
}

function drawGridConnections() {
    const svg = document.getElementById('gridSvg');
    svg.innerHTML = '';
    
    // Draw connections from active source to zones
    const sourcePos = getElementPosition(document.getElementById(`plant${gridData.activeSource + 1}`));
    
    document.querySelectorAll('.zone').forEach(zone => {
        const zonePos = getElementPosition(zone);
        const line = createSVGLine(sourcePos.x, sourcePos.y, zonePos.x, zonePos.y);
        svg.appendChild(line);
    });
}

function redrawGridConnections() {
    drawGridConnections();
    addVisualEffect(document.querySelector('.grid-lab'), 'pulse');
}

// Experiment 5: Hydroelectric Dam
let hydroData = {
    waterLevel: 80,
    flowRate: 500,
    gatesOpen: false
};

function initializeHydroLab() {
    updateHydroDisplay();
}

function openGates() {
    hydroData.gatesOpen = true;
    hydroData.flowRate = Math.min(1000, hydroData.flowRate + 100);
    hydroData.waterLevel = Math.max(20, hydroData.waterLevel - 10);
    updateHydroDisplay();
    updateHydroOutput();
}

function closeGates() {
    hydroData.gatesOpen = false;
    hydroData.flowRate = Math.max(0, hydroData.flowRate - 150);
    hydroData.waterLevel = Math.min(100, hydroData.waterLevel + 5);
    updateHydroDisplay();
    updateHydroOutput();
}

function adjustFlow() {
    if (hydroData.gatesOpen) {
        hydroData.flowRate = Math.min(800, hydroData.flowRate + 50);
    } else {
        hydroData.flowRate = Math.max(100, hydroData.flowRate - 50);
    }
    updateHydroDisplay();
    updateHydroOutput();
}

function updateHydroDisplay() {
    document.getElementById('flowRate').textContent = hydroData.flowRate;
    document.getElementById('waterPressure').textContent = Math.round(hydroData.waterLevel * 0.85);
    
    const waterLevel = document.getElementById('waterLevel');
    waterLevel.style.height = `${hydroData.waterLevel}%`;
}

function updateHydroOutput() {
    const output = (hydroData.flowRate * hydroData.waterLevel) / 1000;
    const outputPercentage = Math.min(100, output / 80);
    
    document.getElementById('hydroOutput').style.width = `${outputPercentage}%`;
    document.getElementById('hydroValue').textContent = `${output.toFixed(1)} MW`;
    
    if (outputPercentage > 70) {
        markExperimentComplete(5);
    }
}

// Experiment 6: Geothermal Energy
let geoData = {
    depth: 1000,
    temperature: 180,
    pressure: 50
};

function initializeGeoLab() {
    updateGeoDisplay();
}

function deeperDrill() {
    geoData.depth += 200;
    geoData.temperature += 20;
    updateGeoDisplay();
    updateGeoOutput();
    
    addVisualEffect(document.querySelector('.drilling-site'), 'shake');
}

function increasePressure() {
    geoData.pressure = Math.min(100, geoData.pressure + 10);
    updateGeoDisplay();
    updateGeoOutput();
}

function updateGeoDisplay() {
    document.getElementById('geoTemp').textContent = geoData.temperature;
}

function updateGeoOutput() {
    const steamProduction = (geoData.temperature * geoData.pressure) / 100;
    const outputPercentage = Math.min(100, steamProduction / 200);
    
    document.getElementById('steamLevel').style.width = `${outputPercentage}%`;
    document.getElementById('steamValue').textContent = `${steamProduction.toFixed(1)} kg/s`;
    
    if (outputPercentage > 75) {
        markExperimentComplete(6);
    }
}

// Experiment 7: Nuclear Reactor
let nuclearData = {
    coreTemp: 300,
    controlRods: 50,
    fuelRods: 4,
    radiation: 'Safe'
};

function initializeNuclearLab() {
    updateNuclearDisplay();
}

function insertControlRods() {
    nuclearData.controlRods = Math.min(100, nuclearData.controlRods + 20);
    nuclearData.coreTemp = Math.max(200, nuclearData.coreTemp - 50);
    updateNuclearDisplay();
    updateNuclearOutput();
}

function withdrawControlRods() {
    nuclearData.controlRods = Math.max(0, nuclearData.controlRods - 20);
    nuclearData.coreTemp = Math.min(600, nuclearData.coreTemp + 50);
    updateNuclearDisplay();
    updateNuclearOutput();
}

function emergencyShutdown() {
    nuclearData.controlRods = 100;
    nuclearData.coreTemp = 200;
    nuclearData.radiation = 'Safe';
    updateNuclearDisplay();
    updateNuclearOutput();
    
    addVisualEffect(document.querySelector('.reactor-core'), 'shake');
}

function updateNuclearDisplay() {
    document.getElementById('coreTemp').textContent = nuclearData.coreTemp;
    
    if (nuclearData.coreTemp > 500) {
        nuclearData.radiation = 'High';
        document.getElementById('radiation').style.color = '#ff0000';
    } else if (nuclearData.coreTemp > 400) {
        nuclearData.radiation = 'Medium';
        document.getElementById('radiation').style.color = '#ffff00';
    } else {
        nuclearData.radiation = 'Safe';
        document.getElementById('radiation').style.color = '#00ff00';
    }
    
    document.getElementById('radiation').textContent = nuclearData.radiation;
    document.getElementById('coolant').textContent = nuclearData.coreTemp < 400 ? 'Normal' : 'Critical';
}

function updateNuclearOutput() {
    const efficiency = Math.max(0, 100 - nuclearData.controlRods);
    const output = (efficiency * nuclearData.coreTemp) / 100;
    const outputPercentage = Math.min(100, output / 300);
    
    document.getElementById('nuclearOutput').style.width = `${outputPercentage}%`;
    document.getElementById('nuclearValue').textContent = `${(output * 0.01).toFixed(2)} GW`;
    
    if (outputPercentage > 60 && nuclearData.radiation === 'Safe') {
        markExperimentComplete(7);
    }
}

// Experiment 8: Biomass Energy
let biomassData = {
    fuelType: 'wood',
    burnRate: 50,
    efficiency: 70
};

function initializeBiomassLab() {
    updateBiomassDisplay();
}

function addBiomass() {
    biomassData.burnRate = Math.min(100, biomassData.burnRate + 15);
    updateBiomassDisplay();
    updateBiomassOutput();
    
    addVisualEffect(document.querySelector('.combustion-chamber'), 'pulse');
}

function optimizeBurn() {
    biomassData.efficiency = Math.min(95, biomassData.efficiency + 10);
    updateBiomassDisplay();
    updateBiomassOutput();
}

function updateBiomassDisplay() {
    document.getElementById('carbonLevel').textContent = 'Neutral';
    document.getElementById('ashLevel').textContent = `${Math.round(100 - biomassData.efficiency)}%`;
}

function updateBiomassOutput() {
    const output = (biomassData.burnRate * biomassData.efficiency) / 100;
    const outputPercentage = Math.min(100, output / 80);
    
    document.getElementById('biomassOutput').style.width = `${outputPercentage}%`;
    document.getElementById('biomassValue').textContent = `${output.toFixed(1)} MW`;
    
    if (outputPercentage > 70) {
        markExperimentComplete(8);
    }
}

// Experiment 9: Tidal Energy
let tidalData = {
    tideHeight: 2.5,
    tideSpeed: 3.2,
    cycle: 'High'
};

function initializeTidalLab() {
    updateTidalDisplay();
    startTidalCycle();
}

function simulateHighTide() {
    tidalData.tideHeight = 4.0;
    tidalData.tideSpeed = 4.5;
    tidalData.cycle = 'High';
    updateTidalDisplay();
    updateTidalOutput();
}

function simulateLowTide() {
    tidalData.tideHeight = 1.0;
    tidalData.tideSpeed = 2.0;
    tidalData.cycle = 'Low';
    updateTidalDisplay();
    updateTidalOutput();
}

function updateTidalDisplay() {
    document.getElementById('tideHeight').textContent = tidalData.tideHeight.toFixed(1);
    document.getElementById('tideSpeed').textContent = tidalData.tideSpeed.toFixed(1);
    document.getElementById('tideCycle').textContent = tidalData.cycle;
}

function updateTidalOutput() {
    const output = tidalData.tideHeight * tidalData.tideSpeed * 10;
    const outputPercentage = Math.min(100, output / 180);
    
    document.getElementById('tidalOutput').style.width = `${outputPercentage}%`;
    document.getElementById('tidalValue').textContent = `${output.toFixed(1)} MW`;
    
    if (outputPercentage > 65) {
        markExperimentComplete(9);
    }
}

function startTidalCycle() {
    setInterval(() => {
        if (tidalData.cycle === 'High') {
            tidalData.tideHeight = Math.max(1.0, tidalData.tideHeight - 0.1);
            if (tidalData.tideHeight <= 1.5) {
                tidalData.cycle = 'Low';
            }
        } else {
            tidalData.tideHeight = Math.min(4.0, tidalData.tideHeight + 0.1);
            if (tidalData.tideHeight >= 3.5) {
                tidalData.cycle = 'High';
            }
        }
        updateTidalDisplay();
        updateTidalOutput();
    }, 2000);
}

// Experiment 10: Fusion Reactor
let fusionData = {
    plasmaTemp: 100000000, // 100 million degrees
    magneticField: 15,
    fusionRate: 0,
    containment: true
};

function initializeFusionLab() {
    updateFusionDisplay();
}

function increaseMagnetic() {
    fusionData.magneticField = Math.min(25, fusionData.magneticField + 2);
    updateFusionDisplay();
    updateFusionOutput();
}

function heatPlasma() {
    fusionData.plasmaTemp = Math.min(200000000, fusionData.plasmaTemp + 10000000);
    updateFusionDisplay();
    updateFusionOutput();
}

function initiateFusion() {
    if (fusionData.plasmaTemp > 150000000 && fusionData.magneticField > 20) {
        fusionData.fusionRate = 1000;
        updateFusionDisplay();
        updateFusionOutput();
        
        addVisualEffect(document.querySelector('.plasma-chamber'), 'pulse');
        markExperimentComplete(10);
    } else {
        addVisualEffect(document.querySelector('.fusion-lab'), 'shake');
    }
}

function updateFusionDisplay() {
    document.getElementById('plasmaTemp').textContent = `${Math.round(fusionData.plasmaTemp / 1000000)}M`;
    document.getElementById('magneticStr').textContent = fusionData.magneticField;
    document.getElementById('fusionRate').textContent = fusionData.fusionRate;
}

function updateFusionOutput() {
    const output = (fusionData.fusionRate * fusionData.plasmaTemp) / 100000000;
    const outputPercentage = Math.min(100, output / 2000);
    
    document.getElementById('fusionOutput').style.width = `${outputPercentage}%`;
    document.getElementById('fusionValue').textContent = `${(output * 0.001).toFixed(2)} TW`;
}

// Utility Functions
function markExperimentComplete(expNumber) {
    if (!experimentProgress[expNumber].completed) {
        experimentProgress[expNumber].completed = true;
        experimentProgress[expNumber].score = 100;
        
        // Visual feedback
        const experiment = document.getElementById(`exp${expNumber}`);
        addVisualEffect(experiment, 'glow');
        
        // Play success sound
        playSuccessSound();
        
        // Check if all experiments are completed
        const allCompleted = Object.values(experimentProgress).every(exp => exp.completed);
        if (allCompleted) {
            setTimeout(() => {
                showCompletionModal();
            }, 2000);
        }
    }
}

function addVisualEffect(element, effectClass) {
    element.classList.add(effectClass);
    setTimeout(() => {
        element.classList.remove(effectClass);
    }, 1000);
}

function getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

function createSVGLine(x1, y1, x2, y2) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#00ffff');
    line.setAttribute('stroke-width', '2');
    line.setAttribute('opacity', '0.7');
    return line;
}

function playTransitionSound() {
    // Create audio context for transition sound
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        console.log('Audio not supported');
    }
}

function playSuccessSound() {
    // Create audio context for success sound
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        console.log('Audio not supported');
    }
}

function showCompletionModal() {
    document.getElementById('completionModal').classList.remove('hidden');
}

function returnToMainMenu() {
    // Save completion status to localStorage
    localStorage.setItem('experimentsCompleted', 'true');
    localStorage.setItem('experimentProgress', JSON.stringify(experimentProgress));
    
    // Return to main menu
    window.location.href = 'main-menu.html';
}

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft' && currentExperiment > 1) {
        previousExperiment();
    } else if (event.key === 'ArrowRight' && currentExperiment < totalExperiments) {
        nextExperiment();
    } else if (event.key === 'Escape') {
        returnToMainMenu();
    }
});

// Auto-save progress
setInterval(() => {
    localStorage.setItem('experimentProgress', JSON.stringify(experimentProgress));
}, 30000); // Save every 30 seconds