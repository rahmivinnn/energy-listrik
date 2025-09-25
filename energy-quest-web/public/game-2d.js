// Game 2D - Energy Quest
// Finite State Machine Implementation

class Game2D {
    constructor() {
        this.currentState = 'opening';
        this.currentLevel = 1;
        this.currentPuzzle = 1;
        this.score = 0;
        this.energyKeys = 0;
        this.progress = {
            level1: { puzzle1: false, puzzle2: false },
            level2: { completed: false },
            level3: { completed: false },
            level4: { completed: false }
        };
        
        // Quiz questions bank (20 questions)
        this.quizQuestions = [
            {
                question: "Apa yang dimaksud dengan rangkaian listrik tertutup?",
                answers: ["Rangkaian yang tidak ada arus listrik", "Rangkaian yang memiliki jalur lengkap untuk aliran listrik", "Rangkaian yang rusak", "Rangkaian yang tidak memiliki sumber listrik"],
                correct: 1
            },
            {
                question: "Manakah cara terbaik untuk menghemat energi di dapur?",
                answers: ["Membuka kulkas terus-menerus", "Menggunakan semua peralatan bersamaan", "Mematikan lampu saat ada cahaya alami", "Menyalakan semua peralatan sepanjang hari"],
                correct: 2
            },
            {
                question: "Satuan untuk mengukur daya listrik adalah?",
                answers: ["Volt", "Ampere", "Watt", "Ohm"],
                correct: 2
            },
            {
                question: "Apa fungsi saklar dalam rangkaian listrik?",
                answers: ["Menambah tegangan", "Memutus dan menyambung aliran listrik", "Mengurangi arus", "Menyimpan energi"],
                correct: 1
            },
            {
                question: "Mengapa penting untuk mematikan peralatan elektronik saat tidak digunakan?",
                answers: ["Agar terlihat rapi", "Untuk menghemat energi dan mengurangi tagihan listrik", "Agar tidak bising", "Tidak ada alasan khusus"],
                correct: 1
            },
            {
                question: "Apa yang terjadi jika rangkaian listrik terbuka?",
                answers: ["Arus listrik tetap mengalir", "Arus listrik tidak dapat mengalir", "Tegangan meningkat", "Daya bertambah"],
                correct: 1
            },
            {
                question: "Manakah peralatan yang paling boros energi di rumah?",
                answers: ["Lampu LED", "Kipas angin", "AC (Air Conditioner)", "Radio"],
                correct: 2
            },
            {
                question: "Rumus untuk menghitung energi listrik adalah?",
                answers: ["E = P × t", "E = V × I", "E = I × R", "E = V / R"],
                correct: 0
            },
            {
                question: "Apa keuntungan menggunakan lampu LED dibanding lampu pijar?",
                answers: ["Lebih terang", "Lebih murah harganya", "Lebih hemat energi dan tahan lama", "Lebih mudah dipasang"],
                correct: 2
            },
            {
                question: "Bagaimana cara mengurangi konsumsi energi kulkas?",
                answers: ["Membuka pintu kulkas sesering mungkin", "Menaruh makanan panas langsung ke kulkas", "Tidak membuka pintu kulkas terlalu lama", "Menyetel suhu serendah mungkin"],
                correct: 2
            },
            {
                question: "Apa yang dimaksud dengan efisiensi energi?",
                answers: ["Menggunakan energi sebanyak-banyaknya", "Menggunakan energi seminimal mungkin untuk hasil maksimal", "Tidak menggunakan energi sama sekali", "Menggunakan energi hanya di malam hari"],
                correct: 1
            },
            {
                question: "Komponen apa yang berfungsi sebagai sumber energi dalam rangkaian?",
                answers: ["Saklar", "Lampu", "Baterai", "Kabel"],
                correct: 2
            },
            {
                question: "Mengapa jendela sebaiknya dibuka saat siang hari?",
                answers: ["Untuk sirkulasi udara saja", "Untuk mengurangi penggunaan lampu dan AC", "Untuk membuat rumah berantakan", "Tidak ada manfaatnya"],
                correct: 1
            },
            {
                question: "Apa yang terjadi pada tagihan listrik jika kita boros energi?",
                answers: ["Tagihan akan turun", "Tagihan akan naik", "Tagihan tetap sama", "Tidak ada pengaruh"],
                correct: 1
            },
            {
                question: "Manakah yang termasuk sumber energi terbarukan?",
                answers: ["Batu bara", "Minyak bumi", "Energi matahari", "Gas alam"],
                correct: 2
            },
            {
                question: "Apa fungsi meteran listrik di rumah?",
                answers: ["Mengatur tegangan", "Mengukur konsumsi energi listrik", "Menyimpan listrik", "Menghasilkan listrik"],
                correct: 1
            },
            {
                question: "Bagaimana cara menghemat energi saat menggunakan setrika?",
                answers: ["Menyetrika satu per satu", "Mengumpulkan pakaian dan menyetrika sekaligus", "Menyalakan setrika sepanjang hari", "Menggunakan suhu tertinggi selalu"],
                correct: 1
            },
            {
                question: "Apa yang dimaksud dengan standby power?",
                answers: ["Daya cadangan", "Daya yang dikonsumsi peralatan saat dalam mode siaga", "Daya maksimum", "Daya minimum"],
                correct: 1
            },
            {
                question: "Mengapa penting untuk mencabut charger dari stop kontak saat tidak digunakan?",
                answers: ["Agar tidak hilang", "Untuk mencegah konsumsi energi phantom", "Agar terlihat rapi", "Tidak ada alasan khusus"],
                correct: 1
            },
            {
                question: "Apa dampak positif dari menghemat energi?",
                answers: ["Tagihan listrik naik", "Polusi bertambah", "Mengurangi emisi karbon dan menghemat biaya", "Tidak ada dampak"],
                correct: 2
            }
        ];
        
        this.selectedQuestions = [];
        this.currentQuestionIndex = 0;
        this.quizScore = 0;
        this.quizTimer = 15;
        this.timerInterval = null;
        
        // Level 1 state
        this.circuitState = {
            connections: [],
            switchOn: false,
            tvSteps: {
                plugged: false,
                switchOn: false,
                powerOn: false,
                channelSet: false
            }
        };
        
        // Level 2 state
        this.kitchenState = {
            powerConsumption: 0,
            appliances: {
                window: false,
                light: true,
                fridge: { open: false, timer: 0 },
                riceCooker: 'normal',
                iron: false
            }
        };
        
        // Level 3 state
        this.labState = {
            appliances: {
                ac: { on: false, power: 1500, time: 0 },
                lamp: { on: false, power: 60, time: 0 },
                fan: { on: false, power: 75, time: 0 },
                tv: { on: false, power: 200, time: 0 },
                refrigerator: { on: true, power: 150, time: 24 }
            },
            totalCost: 0,
            totalEnergy: 0,
            targetCost: 300000,
            completed: false
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.showScene('opening');
        this.updateProgress();
        
        // Initialize audio if available
        if (window.AudioManager) {
            window.AudioManager.init();
        }
    }
    
    setupEventListeners() {
        // Opening scene
        document.getElementById('start-game').addEventListener('click', () => {
            this.startGame();
        });
        
        // Level navigation
        document.querySelectorAll('.next-level').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const level = parseInt(e.target.dataset.level);
                this.goToLevel(level);
            });
        });
        
        document.querySelectorAll('.next-puzzle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const puzzle = parseInt(e.target.dataset.puzzle);
                this.goToPuzzle(puzzle);
            });
        });
        
        // Tutorial buttons
        document.querySelectorAll('.tutorial-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const level = e.target.dataset.level;
                this.showTutorial(level);
            });
        });
        
        // Level 1 - Circuit
        this.setupLevel1Events();
        
        // Level 1 - TV
        this.setupTVEvents();
        
        // Level 2 - Kitchen
        this.setupLevel2Events();
        
        // Level 3 - Lab
        this.setupLevel3Events();
        
        // Level 4 - Quiz
        this.setupQuizEvents();
        
        // Restart game
        document.getElementById('restart-game').addEventListener('click', () => {
            this.restartGame();
        });
    }
    
    // FSM State Management
    showScene(sceneName) {
        document.querySelectorAll('.scene').forEach(scene => {
            scene.classList.remove('active');
        });
        
        const targetScene = document.getElementById(sceneName + '-scene');
        if (targetScene) {
            targetScene.classList.add('active');
            this.currentState = sceneName;
        }
    }
    
    startGame() {
        this.showScene('level1');
        this.currentLevel = 1;
        this.showPuzzle(1);
    }
    
    goToLevel(level) {
        this.currentLevel = level;
        this.showScene(`level${level}`);
        
        if (level === 4) {
            this.initializeQuiz();
        } else {
            this.showPuzzle(1);
        }
    }
    
    showPuzzle(puzzleNum) {
        const levelContainer = document.querySelector(`#level${this.currentLevel}-scene`);
        const puzzles = levelContainer.querySelectorAll('.puzzle-container');
        
        puzzles.forEach(puzzle => puzzle.classList.remove('active'));
        
        const targetPuzzle = levelContainer.querySelector(`#puzzle${this.currentLevel}-${puzzleNum}`);
        if (targetPuzzle) {
            targetPuzzle.classList.add('active');
            this.currentPuzzle = puzzleNum;
        }
    }
    
    goToPuzzle(puzzleNum) {
        this.showPuzzle(puzzleNum);
    }
    
    updateProgress() {
        const progressBar = document.querySelector('.progress-fill');
        const totalLevels = 4;
        const completedLevels = this.energyKeys;
        const progressPercent = (completedLevels / totalLevels) * 100;
        
        if (progressBar) {
            progressBar.style.width = progressPercent + '%';
        }
    }
    
    showFeedback(message, type = 'info') {
        const feedback = document.querySelector('.feedback');
        if (feedback) {
            feedback.textContent = message;
            feedback.className = `feedback ${type}`;
            feedback.style.display = 'flex';
            
            setTimeout(() => {
                feedback.style.display = 'none';
            }, 3000);
        }
    }
    
    showTutorial(level) {
        const tutorials = {
            '1': 'Level 1: Sambungkan kabel untuk membuat rangkaian tertutup. Pastikan arus mengalir dari baterai positif → saklar → lampu → baterai negatif.',
            '2': 'Level 2: Kelola peralatan dapur dengan bijak. Buka jendela untuk cahaya alami, matikan lampu yang tidak perlu, dan jangan biarkan kulkas terbuka terlalu lama.',
            '3': 'Level 3: Simulasi tagihan listrik. Atur penggunaan peralatan agar total biaya tidak melebihi Rp300.000. Gunakan rumus: Energi (kWh) = (Daya × Waktu) / 1000',
            '4': 'Level 4: Kuis evaluasi dengan 10 soal acak. Jawab dengan benar untuk menyelesaikan permainan. Setiap soal memiliki batas waktu 15 detik.'
        };
        
        alert(tutorials[level] || 'Tutorial tidak tersedia.');
    }
    
    // Level 1 - Circuit Puzzle
    setupLevel1Events() {
        // Switch toggle
        const circuitSwitch = document.getElementById('circuit-switch');
        if (circuitSwitch) {
            circuitSwitch.addEventListener('click', () => {
                this.toggleSwitch();
            });
        }
        
        // Check circuit button
        const checkBtn = document.getElementById('check-circuit-btn');
        if (checkBtn) {
            checkBtn.addEventListener('click', () => {
                this.checkCircuit();
            });
        }
        
        // Cable drag and drop
        this.setupCableDragDrop();
        
        // Setup TV events
        this.setupTVEvents();
    }
    
    setupCableDragDrop() {
        const cables = document.querySelectorAll('.cable');
        const terminals = document.querySelectorAll('.terminal');
        
        cables.forEach(cable => {
            cable.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', cable.id);
                cable.classList.add('dragging');
            });
            
            cable.addEventListener('dragend', () => {
                cable.classList.remove('dragging');
            });
        });
        
        terminals.forEach(terminal => {
            terminal.addEventListener('dragover', (e) => {
                e.preventDefault();
                terminal.classList.add('drag-over');
            });
            
            terminal.addEventListener('dragleave', () => {
                terminal.classList.remove('drag-over');
            });
            
            terminal.addEventListener('drop', (e) => {
                e.preventDefault();
                terminal.classList.remove('drag-over');
                
                const cableId = e.dataTransfer.getData('text/plain');
                const cable = document.getElementById(cableId);
                
                this.connectCableToTerminal(cable, terminal);
            });
        });
    }
    
    connectCableToTerminal(cable, terminal) {
        const terminalType = terminal.dataset.terminal;
        const cableType = cable.id;
        
        // Check valid connections
        const validConnections = {
            'cable1': 'battery-positive',
            'cable2': 'switch-bulb',
            'cable3': 'battery-negative'
        };
        
        if (validConnections[cableType] === terminalType) {
            cable.classList.add('connected');
            terminal.classList.add('connected');
            this.circuitState.connections.push(cableType);
            
            this.showFeedback(`Kabel ${cableType} terhubung dengan benar!`, 'success');
        } else {
            this.showFeedback('Koneksi salah! Coba lagi.', 'error');
            // Visual feedback for wrong connection
            cable.style.backgroundColor = '#ff4444';
            setTimeout(() => {
                cable.style.backgroundColor = '';
            }, 1000);
        }
    }
    
    toggleSwitch() {
        this.circuitState.switchOn = !this.circuitState.switchOn;
        const switchElement = document.getElementById('circuit-switch');
        
        if (this.circuitState.switchOn) {
            switchElement.dataset.state = 'on';
            switchElement.textContent = 'ON';
        } else {
            switchElement.dataset.state = 'off';
            switchElement.textContent = 'OFF';
        }
        
        this.checkCircuit();
    }
    
    checkCircuit() {
        const bulb = document.querySelector('.bulb');
        const connectedCables = document.querySelectorAll('.cable.connected');
        
        if (connectedCables.length >= 3 && this.circuitState.switchOn) {
            bulb.classList.add('lit');
            this.showFeedback('Bagus! Listrik hanya mengalir dalam rangkaian tertutup. Lampu menyala karena ada jalur lengkap untuk aliran listrik.', 'success');
            
            // Play success sound
            this.playSound('success');
            
            setTimeout(() => {
                this.completePuzzle(1, 1);
            }, 2000);
        } else if (connectedCables.length >= 3 && !this.circuitState.switchOn) {
            bulb.classList.remove('lit');
            this.showFeedback('Rangkaian terbuka! Nyalakan saklar untuk melengkapi rangkaian.', 'error');
            this.playSound('error');
        } else {
            bulb.classList.remove('lit');
            this.showFeedback('Sambungkan semua kabel terlebih dahulu!', 'error');
            this.playSound('error');
        }
    }
    
    // Level 1 - TV Puzzle
    setupTVEvents() {
        const powerCable = document.getElementById('power-cable');
        const wallSwitch = document.getElementById('wall-switch');
        const powerBtn = document.getElementById('power-btn');
        const channelBtn = document.getElementById('channel-btn');
        const outlet = document.getElementById('outlet');
        
        // Drag and drop for power cable
        if (powerCable && outlet) {
            powerCable.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', 'power-cable');
            });
            
            outlet.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            
            outlet.addEventListener('drop', (e) => {
                e.preventDefault();
                this.plugTV();
            });
            
            // Alternative click method
            powerCable.addEventListener('click', () => {
                this.plugTV();
            });
        }
        
        if (wallSwitch) {
            wallSwitch.addEventListener('click', () => {
                this.toggleWallSwitch();
            });
        }
        
        if (powerBtn) {
            powerBtn.addEventListener('click', () => {
                this.toggleTVPower();
            });
        }
        
        if (channelBtn) {
            channelBtn.addEventListener('click', () => {
                this.setTVChannel();
            });
        }
    }
    
    plugTV() {
        if (!this.circuitState.tvSteps.plugged) {
            this.circuitState.tvSteps.plugged = true;
            const powerCable = document.getElementById('power-cable');
            powerCable.style.display = 'none'; // Hide cable after plugging
            
            this.showFeedback('Kabel TV telah dicolokkan ke stop kontak.', 'success');
            this.playSound('success');
            this.updateTVSteps();
        }
    }
    
    toggleWallSwitch() {
        if (this.circuitState.tvSteps.plugged) {
            this.circuitState.tvSteps.switchOn = !this.circuitState.tvSteps.switchOn;
            const wallSwitch = document.getElementById('wall-switch');
            const powerBtn = document.getElementById('power-btn');
            
            if (this.circuitState.tvSteps.switchOn) {
                wallSwitch.dataset.state = 'on';
                wallSwitch.textContent = 'ON';
                wallSwitch.style.backgroundColor = '#4CAF50';
                powerBtn.disabled = false;
                
                this.showFeedback('Saklar dinding dinyalakan. Listrik mengalir ke TV.', 'success');
                this.playSound('success');
            } else {
                wallSwitch.dataset.state = 'off';
                wallSwitch.textContent = 'OFF';
                wallSwitch.style.backgroundColor = '#f44336';
                powerBtn.disabled = true;
                
                this.showFeedback('Saklar dinding dimatikan.', 'info');
            }
            
            this.updateTVSteps();
        } else {
            this.showFeedback('Colokkan kabel TV terlebih dahulu!', 'error');
            this.playSound('error');
        }
    }
    
    toggleTVPower() {
        if (this.circuitState.tvSteps.plugged && this.circuitState.tvSteps.switchOn) {
            this.circuitState.tvSteps.powerOn = true;
            const powerBtn = document.getElementById('power-btn');
            const channelBtn = document.getElementById('channel-btn');
            const screen = document.getElementById('tv-screen');
            
            powerBtn.disabled = true;
            channelBtn.disabled = false;
            screen.textContent = 'TV Hidup - Pilih Channel';
            screen.style.backgroundColor = '#333';
            screen.style.color = '#fff';
            
            this.showFeedback('TV dinyalakan! Sekarang atur channel.', 'success');
            this.playSound('success');
            this.updateTVSteps();
        } else {
            this.showFeedback('Pastikan kabel sudah dicolok dan saklar dinyalakan terlebih dahulu!', 'error');
            this.playSound('error');
        }
    }
    
    setTVChannel() {
        if (this.circuitState.tvSteps.powerOn) {
            this.circuitState.tvSteps.channelSet = true;
            const screen = document.getElementById('tv-screen');
            const channelBtn = document.getElementById('channel-btn');
            
            screen.innerHTML = '<div style="padding: 10px; text-align: center;"><h4>📺 PESAN RAHASIA 📺</h4><p>"Carilah kunci energi di setiap level untuk membuka rahasia efisiensi energi!"</p><p>- Ilmuwan Energi</p></div>';
            screen.style.backgroundColor = '#1a472a';
            screen.style.color = '#4ade80';
            channelBtn.disabled = true;
            
            this.showFeedback('Pesan dari ilmuwan diterima! Kunci Energi 1 didapat!', 'success');
            this.playSound('success');
            
            // Show level 1 reward
            document.getElementById('level1-reward').style.display = 'block';
            
            setTimeout(() => {
                this.completePuzzle(1, 2);
            }, 3000);
        } else {
            this.showFeedback('Nyalakan TV terlebih dahulu!', 'error');
            this.playSound('error');
        }
    }
    
    // Sound effects
    playSound(type) {
        // Create audio context for sound effects
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const audioContext = new (AudioContext || webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            switch(type) {
                case 'success':
                    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
                    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
                    break;
                case 'error':
                    oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
                    oscillator.frequency.setValueAtTime(196, audioContext.currentTime + 0.1); // G3
                    break;
                default:
                    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
            }
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }
    }
    
    updateTVSteps() {
        const steps = document.querySelectorAll('.step');
        const tvSteps = this.circuitState.tvSteps;
        
        steps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            
            switch(index) {
                case 0:
                    if (tvSteps.plugged) step.classList.add('completed');
                    else if (!tvSteps.plugged) step.classList.add('active');
                    break;
                case 1:
                    if (tvSteps.switchOn) step.classList.add('completed');
                    else if (tvSteps.plugged && !tvSteps.switchOn) step.classList.add('active');
                    break;
                case 2:
                    if (tvSteps.powerOn) step.classList.add('completed');
                    else if (tvSteps.switchOn && !tvSteps.powerOn) step.classList.add('active');
                    break;
                case 3:
                    if (tvSteps.channelSet) step.classList.add('completed');
                    else if (tvSteps.powerOn && !tvSteps.channelSet) step.classList.add('active');
                    break;
            }
        });
    }
    
    // Level 2 - Kitchen Management
    setupLevel2Events() {
        const windowBtn = document.querySelector('[data-appliance="window"]');
        const lightBtn = document.querySelector('[data-appliance="lights"]');
        const fridgeBtn = document.querySelector('[data-appliance="fridge"]');
        const riceCookerSelect = document.querySelector('[data-appliance="rice-cooker"]');
        const ironBtn = document.querySelector('[data-appliance="iron"]');
        
        if (windowBtn) {
            windowBtn.addEventListener('click', () => {
                this.toggleWindow();
            });
        }
        
        if (lightBtn) {
            lightBtn.addEventListener('click', () => {
                this.toggleLight();
            });
        }
        
        if (fridgeBtn) {
            fridgeBtn.addEventListener('click', () => {
                this.toggleFridge();
            });
        }
        
        if (riceCookerSelect) {
            riceCookerSelect.addEventListener('change', (e) => {
                this.setRiceCookerMode(e.target.value);
            });
        }
        
        if (ironBtn) {
            ironBtn.addEventListener('click', () => {
                this.toggleIron();
            });
        }
        
        // Start kitchen simulation
        this.startKitchenSimulation();
    }
    
    toggleWindow() {
        this.kitchenState.appliances.window = !this.kitchenState.appliances.window;
        const windowBtn = document.querySelector('[data-appliance="window"]');
        const windowContainer = document.getElementById('window');
        
        if (this.kitchenState.appliances.window) {
            windowBtn.textContent = 'Tutup Jendela';
            windowBtn.dataset.state = 'open';
            windowContainer.style.backgroundColor = '#e8f5e8';
            windowContainer.style.boxShadow = '0 0 20px rgba(255, 255, 0, 0.3)';
            this.showFeedback('Jendela dibuka. Cahaya alami masuk, bisa matikan lampu!', 'success');
            this.playSound('success');
        } else {
            windowBtn.textContent = 'Buka Jendela';
            windowBtn.dataset.state = 'closed';
            windowContainer.style.backgroundColor = '';
            windowContainer.style.boxShadow = '';
            this.showFeedback('Jendela ditutup.', 'info');
        }
        
        this.updatePowerMeter();
    }
    
    toggleLight() {
        this.kitchenState.appliances.light = !this.kitchenState.appliances.light;
        const lightBtn = document.querySelector('[data-appliance="lights"]');
        const lightContainer = document.getElementById('lights');
        
        if (this.kitchenState.appliances.light) {
            lightBtn.textContent = 'Matikan Lampu';
            lightBtn.dataset.state = 'on';
            lightContainer.style.backgroundColor = '#fff3cd';
            lightContainer.style.boxShadow = '0 0 15px rgba(255, 255, 0, 0.5)';
            this.showFeedback('Lampu dinyalakan.', 'info');
        } else {
            lightBtn.textContent = 'Nyalakan Lampu';
            lightBtn.dataset.state = 'off';
            lightContainer.style.backgroundColor = '';
            lightContainer.style.boxShadow = '';
            if (this.kitchenState.appliances.window) {
                this.showFeedback('Bagus! Memanfaatkan cahaya alami untuk menghemat energi.', 'success');
                this.playSound('success');
            } else {
                this.showFeedback('Lampu dimatikan.', 'info');
            }
        }
        
        this.updatePowerMeter();
    }
    
    toggleFridge() {
        this.kitchenState.appliances.fridge.open = !this.kitchenState.appliances.fridge.open;
        const fridgeBtn = document.querySelector('[data-appliance="fridge"]');
        const fridgeContainer = document.getElementById('fridge');
        
        if (this.kitchenState.appliances.fridge.open) {
            fridgeBtn.textContent = 'Tutup Kulkas';
            fridgeBtn.dataset.state = 'open';
            fridgeContainer.style.backgroundColor = '#d1ecf1';
            fridgeContainer.style.boxShadow = '0 0 15px rgba(0, 123, 255, 0.3)';
            this.showFeedback('Kulkas dibuka. Jangan biarkan terbuka terlalu lama!', 'warning');
            this.startFridgeTimer();
        } else {
            fridgeBtn.textContent = 'Buka Kulkas';
            fridgeBtn.dataset.state = 'closed';
            fridgeContainer.style.backgroundColor = '';
            fridgeContainer.style.boxShadow = '';
            this.showFeedback('Kulkas ditutup.', 'success');
            this.playSound('success');
            this.stopFridgeTimer();
        }
    }
    
    startFridgeTimer() {
        this.kitchenState.appliances.fridge.timer = 0;
        const timerInterval = setInterval(() => {
            this.kitchenState.appliances.fridge.timer++;
            const timerDisplay = document.getElementById('fridge-timer');
            if (timerDisplay) {
                timerDisplay.textContent = `Terbuka: ${this.kitchenState.appliances.fridge.timer}s`;
            }
            
            if (this.kitchenState.appliances.fridge.timer > 10) {
                this.showFeedback('Kulkas terbuka terlalu lama! Energi terbuang sia-sia.', 'error');
            }
            
            this.updatePowerMeter();
        }, 1000);
        
        this.fridgeTimerInterval = timerInterval;
    }
    
    stopFridgeTimer() {
        if (this.fridgeTimerInterval) {
            clearInterval(this.fridgeTimerInterval);
        }
        
        const timerDisplay = document.getElementById('fridge-timer');
        if (timerDisplay) {
            timerDisplay.textContent = '';
        }
        
        if (this.kitchenState.appliances.fridge.timer <= 5) {
            this.showFeedback('Bagus! Kulkas tidak dibuka terlalu lama.', 'success');
        }
        
        this.updatePowerMeter();
    }
    
    setRiceCookerMode(mode) {
        this.kitchenState.appliances.riceCooker = mode;
        const riceCookerContainer = document.getElementById('rice-cooker');
        
        if (mode === 'eco') {
            riceCookerContainer.style.backgroundColor = '#d4edda';
            riceCookerContainer.style.boxShadow = '0 0 15px rgba(40, 167, 69, 0.3)';
            this.showFeedback('Mode hemat dipilih! Menghemat 37% energi.', 'success');
            this.playSound('success');
        } else {
            riceCookerContainer.style.backgroundColor = '#fff3cd';
            riceCookerContainer.style.boxShadow = '0 0 15px rgba(255, 193, 7, 0.3)';
            this.showFeedback('Mode normal dipilih.', 'info');
        }
        
        this.updatePowerMeter();
    }
    
    toggleIron() {
        this.kitchenState.appliances.iron = !this.kitchenState.appliances.iron;
        const ironBtn = document.querySelector('[data-appliance="iron"]');
        const ironContainer = document.getElementById('iron');
        
        if (this.kitchenState.appliances.iron) {
            ironBtn.textContent = 'Matikan Setrika';
            ironBtn.dataset.state = 'on';
            ironContainer.style.backgroundColor = '#f8d7da';
            ironContainer.style.boxShadow = '0 0 15px rgba(220, 53, 69, 0.3)';
            this.showFeedback('Setrika dinyalakan. Konsumsi energi tinggi!', 'warning');
        } else {
            ironBtn.textContent = 'Nyalakan Setrika';
            ironBtn.dataset.state = 'off';
            ironContainer.style.backgroundColor = '';
            ironContainer.style.boxShadow = '';
            this.showFeedback('Setrika dimatikan. Hemat energi!', 'success');
            this.playSound('success');
        }
        
        this.updatePowerMeter();
    }
    
    startKitchenSimulation() {
        setInterval(() => {
            this.updatePowerMeter();
        }, 1000);
    }
    
    updatePowerMeter() {
        let consumption = 0;
        const appliances = this.kitchenState.appliances;
        
        // Calculate power consumption
        if (appliances.light && !appliances.window) consumption += 60;
        if (appliances.light && appliances.window) consumption += 30; // Reduced with natural light
        if (appliances.fridge.open) consumption += 200 + (appliances.fridge.timer * 10);
        if (appliances.riceCooker === 'normal') consumption += 400;
        if (appliances.riceCooker === 'eco') consumption += 250;
        if (appliances.iron) consumption += 1000;
        
        this.kitchenState.powerConsumption = consumption;
        
        // Update meter display
        const meterFill = document.querySelector('.meter-fill');
        const meterLabel = document.querySelector('.meter-label');
        
        if (meterFill && meterLabel) {
            const percentage = Math.min((consumption / 1500) * 100, 100);
            meterFill.style.width = percentage + '%';
            
            if (consumption < 300) {
                meterLabel.textContent = 'Efisien';
                meterLabel.className = 'meter-label efficient';
            } else if (consumption < 800) {
                meterLabel.textContent = 'Normal';
                meterLabel.className = 'meter-label';
            } else {
                meterLabel.textContent = 'Boros';
                meterLabel.className = 'meter-label wasteful';
            }
        }
        
        // Check completion
        if (consumption < 400 && appliances.window && !appliances.light) {
            setTimeout(() => {
                this.completePuzzle(2, 1);
            }, 2000);
        }
    }
    
    // Level 3 - Lab Simulation
    setupLevel3Events() {
        const toggles = document.querySelectorAll('.lab-appliance input[type="checkbox"]');
        
        toggles.forEach(toggle => {
            const applianceElement = toggle.closest('.lab-appliance');
            const appliance = applianceElement.dataset.appliance;
            
            // Set the appliance data attribute on the toggle
            toggle.dataset.appliance = appliance;
            
            toggle.addEventListener('change', (e) => {
                this.toggleLabAppliance(appliance, e.target.checked);
                this.playSound('click');
            });
        });
        
        this.startLabSimulation();
    }
    
    toggleLabAppliance(appliance, isOn) {
        if (this.labState.appliances[appliance]) {
            this.labState.appliances[appliance].on = isOn;
            
            // Add visual feedback
            const applianceElement = document.querySelector(`[data-appliance="${appliance}"]`);
            if (applianceElement) {
                if (isOn) {
                    applianceElement.classList.add('active');
                    applianceElement.style.background = 'linear-gradient(135deg, #e8f5e8, #c8e6c9)';
                    applianceElement.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
                } else {
                    applianceElement.classList.remove('active');
                    applianceElement.style.background = '';
                    applianceElement.style.boxShadow = '';
                }
            }
            
            if (isOn) {
                this.labState.appliances[appliance].time = 1;
            } else {
                this.labState.appliances[appliance].time = 0;
            }
        }
        
        this.updateLabCalculation();
    }
    
    startLabSimulation() {
        // Clear any existing interval
        if (this.labSimulationInterval) {
            clearInterval(this.labSimulationInterval);
        }
        
        this.labSimulationInterval = setInterval(() => {
            // Update usage time for active appliances
            Object.keys(this.labState.appliances).forEach(key => {
                const appliance = this.labState.appliances[key];
                if (appliance.on && appliance.time < 24) {
                    appliance.time += 0.2; // Faster simulation for better UX
                }
            });
            
            this.updateLabCalculation();
        }, 500); // Update more frequently for smoother animation
    }
    
    updateLabCalculation() {
        let totalEnergy = 0;
        const appliances = this.labState.appliances;
        
        // Calculate energy consumption: E = P × t / 1000 (kWh)
        Object.keys(appliances).forEach(key => {
            const appliance = appliances[key];
            if (appliance.on) {
                const energy = (appliance.power * appliance.time) / 1000;
                totalEnergy += energy;
            }
        });
        
        // Calculate cost (assuming Rp 1,500 per kWh)
        const costPerKWh = 1500;
        this.labState.totalCost = totalEnergy * costPerKWh;
        this.labState.totalEnergy = totalEnergy;
        
        // Update display
        this.updateLabDisplay();
        
        // Check completion - more realistic target achievement
        const efficiency = (this.labState.targetCost - this.labState.totalCost) / this.labState.targetCost;
        if (this.labState.totalCost <= this.labState.targetCost && totalEnergy > 0) {
            const labStatus = document.querySelector('.lab-status');
            if (labStatus && !this.labState.completed) {
                labStatus.textContent = `Target tercapai! Efisiensi: ${(efficiency * 100).toFixed(1)}%`;
                labStatus.className = 'lab-status success';
                this.labState.completed = true;
                this.playSound('success');
                
                setTimeout(() => {
                    this.completePuzzle(3, 1);
                }, 2000);
            }
        }
    }
    
    updateLabDisplay() {
        // Update usage time displays with animation
        Object.keys(this.labState.appliances).forEach(key => {
            const timeDisplay = document.querySelector(`[data-appliance="${key}"] .usage-time`);
            if (timeDisplay) {
                const time = this.labState.appliances[key].time;
                const newText = `${time.toFixed(1)} jam`;
                
                if (timeDisplay.textContent !== newText) {
                    timeDisplay.style.transform = 'scale(1.1)';
                    timeDisplay.textContent = newText;
                    
                    setTimeout(() => {
                        timeDisplay.style.transform = 'scale(1)';
                    }, 200);
                }
            }
        });
        
        // Update calculation panel
        const totalConsumptionDisplay = document.getElementById('total-consumption');
        const estimatedBillDisplay = document.getElementById('estimated-bill');
        
        if (totalConsumptionDisplay) {
            const totalEnergy = this.labState.totalEnergy || 0;
            totalConsumptionDisplay.textContent = totalEnergy.toFixed(3) + ' kWh';
            
            // Add visual feedback based on consumption
            if (totalEnergy > 200) {
                totalConsumptionDisplay.style.color = '#f44336';
                totalConsumptionDisplay.style.fontWeight = 'bold';
            } else if (totalEnergy > 100) {
                totalConsumptionDisplay.style.color = '#ff9800';
                totalConsumptionDisplay.style.fontWeight = 'bold';
            } else {
                totalConsumptionDisplay.style.color = '#4caf50';
                totalConsumptionDisplay.style.fontWeight = 'normal';
            }
        }
        
        if (estimatedBillDisplay) {
            const cost = this.labState.totalCost || 0;
            estimatedBillDisplay.textContent = 'Rp ' + cost.toLocaleString('id-ID');
            
            // Add visual feedback based on cost
            if (cost > this.labState.targetCost) {
                estimatedBillDisplay.style.color = '#f44336';
                estimatedBillDisplay.style.fontWeight = 'bold';
                estimatedBillDisplay.style.animation = 'pulse 1s infinite';
            } else if (cost > this.labState.targetCost * 0.8) {
                estimatedBillDisplay.style.color = '#ff9800';
                estimatedBillDisplay.style.fontWeight = 'bold';
                estimatedBillDisplay.style.animation = 'none';
            } else {
                estimatedBillDisplay.style.color = '#4caf50';
                estimatedBillDisplay.style.fontWeight = 'normal';
                estimatedBillDisplay.style.animation = 'none';
            }
        }
        
        // Update lab status with enhanced feedback
        const labStatus = document.querySelector('.lab-status');
        if (labStatus && !this.labState.completed) {
            const cost = this.labState.totalCost || 0;
            const percentage = (cost / this.labState.targetCost * 100).toFixed(1);
            
            if (cost > this.labState.targetCost) {
                labStatus.textContent = `Tagihan terlalu tinggi! (${percentage}% dari target)`;
                labStatus.className = 'lab-status error';
            } else if (cost > this.labState.targetCost * 0.8) {
                labStatus.textContent = `Hampir mencapai target (${percentage}% dari target)`;
                labStatus.className = 'lab-status warning';
            } else if (cost > 0) {
                labStatus.textContent = `Konsumsi energi efisien (${percentage}% dari target)`;
                labStatus.className = 'lab-status success';
            } else {
                labStatus.textContent = 'Nyalakan beberapa peralatan untuk memulai simulasi';
                labStatus.className = 'lab-status info';
            }
        }
    }
    
    // Level 4 - Quiz
    setupQuizEvents() {
        const nextQuestionBtn = document.getElementById('next-question');
        const startQuizBtn = document.getElementById('start-quiz');
        
        if (nextQuestionBtn) {
            nextQuestionBtn.addEventListener('click', () => {
                this.nextQuestion();
                this.playSound('click');
            });
        }
        
        if (startQuizBtn) {
            startQuizBtn.addEventListener('click', () => {
                this.initializeQuiz();
                this.playSound('success');
            });
        }
    }
    
    // Enhanced Fisher-Yates Shuffle Algorithm with better randomization
    shuffleArray(array) {
        const shuffled = [...array];
        
        // Use crypto.getRandomValues for better randomness if available
        const getRandomValue = () => {
            if (window.crypto && window.crypto.getRandomValues) {
                const randomArray = new Uint32Array(1);
                window.crypto.getRandomValues(randomArray);
                return randomArray[0] / (0xFFFFFFFF + 1);
            }
            return Math.random();
        };
        
        // Fisher-Yates shuffle with enhanced randomization
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(getRandomValue() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        return shuffled;
    }
    
    initializeQuiz() {
        // Enhanced quiz initialization with better question selection
        const shuffledQuestions = this.shuffleArray(this.quizQuestions);
        this.selectedQuestions = shuffledQuestions.slice(0, 10);
        this.currentQuestionIndex = 0;
        this.quizScore = 0;
        this.quizStartTime = Date.now();
        
        // Hide start button and show quiz container
        const startQuizBtn = document.getElementById('start-quiz');
        const quizContent = document.querySelector('.quiz-content');
        
        if (startQuizBtn) {
            startQuizBtn.style.display = 'none';
        }
        
        if (quizContent) {
            quizContent.style.display = 'block';
            quizContent.style.animation = 'fadeIn 0.5s ease-in';
        }
        
        this.showQuestion();
    }
    
    showQuestion() {
        if (this.currentQuestionIndex >= this.selectedQuestions.length) {
            this.endQuiz();
            return;
        }
        
        const question = this.selectedQuestions[this.currentQuestionIndex];
        
        // Update question display with animations
        const questionText = document.getElementById('question-text');
        const questionNumber = document.getElementById('question-number');
        const answersContainer = document.querySelector('.answers-container');
        const questionContainer = document.querySelector('.question-container');
        
        // Add slide animation to question container
        if (questionContainer) {
            questionContainer.style.animation = 'slideInRight 0.5s ease-out';
        }
        
        if (questionText) {
            questionText.textContent = question.question;
            questionText.style.animation = 'fadeIn 0.3s ease-in';
        }
        
        if (questionNumber) {
            const progressText = `Soal ${this.currentQuestionIndex + 1} dari ${this.selectedQuestions.length}`;
            const progressPercentage = ((this.currentQuestionIndex + 1) / this.selectedQuestions.length) * 100;
            questionNumber.innerHTML = `
                <div class="progress-text">${progressText}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                </div>
            `;
        }
        
        // Clear previous answers with enhanced animations
        if (answersContainer) {
            answersContainer.innerHTML = '';
            
            question.answers.forEach((answer, index) => {
                const answerBtn = document.createElement('button');
                answerBtn.className = 'answer-btn';
                answerBtn.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
                answerBtn.style.animationDelay = `${index * 0.1}s`;
                answerBtn.style.animation = 'slideInUp 0.4s ease-out forwards';
                answerBtn.addEventListener('click', () => {
                    this.selectAnswer(index);
                });
                
                answersContainer.appendChild(answerBtn);
            });
        }
        
        // Start timer
        this.startQuizTimer();
        
        // Hide next button
        const nextBtn = document.getElementById('next-question');
        if (nextBtn) {
            nextBtn.style.display = 'none';
        }
    }
    
    startQuizTimer() {
        this.quizTimer = 15;
        const timerDisplay = document.getElementById('quiz-timer');
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.timerInterval = setInterval(() => {
            this.quizTimer--;
            
            if (timerDisplay) {
                timerDisplay.textContent = this.quizTimer;
            }
            
            if (this.quizTimer <= 0) {
                clearInterval(this.timerInterval);
                this.selectAnswer(-1); // Time's up
            }
        }, 1000);
    }
    
    selectAnswer(selectedIndex) {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        const question = this.selectedQuestions[this.currentQuestionIndex];
        const answerBtns = document.querySelectorAll('.answer-btn');
        const feedbackDiv = document.querySelector('.quiz-feedback');
        
        // Disable all buttons with enhanced styling
        answerBtns.forEach(btn => {
            btn.disabled = true;
            btn.style.pointerEvents = 'none';
        });
        
        // Show correct/incorrect with enhanced animations
        answerBtns.forEach((btn, index) => {
            if (index === question.correct) {
                btn.classList.add('correct');
                btn.style.animation = 'pulse 0.6s ease-in-out';
            } else if (index === selectedIndex) {
                btn.classList.add('incorrect');
                btn.style.animation = 'shake 0.5s ease-in-out';
            } else {
                btn.style.opacity = '0.5';
                btn.style.transform = 'scale(0.95)';
            }
        });
        
        // Show enhanced feedback with sound
        const isCorrect = selectedIndex === question.correct;
        const isTimeout = selectedIndex === -1;
        
        if (feedbackDiv) {
            if (isCorrect) {
                this.quizScore++;
                this.playSound('success');
                feedbackDiv.innerHTML = '<div class="feedback-icon">✓</div><div class="feedback-text">Benar! Jawaban Anda tepat.</div>';
                feedbackDiv.className = 'quiz-feedback correct';
            } else {
                this.playSound('error');
                const correctAnswer = String.fromCharCode(65 + question.correct);
                if (isTimeout) {
                    feedbackDiv.innerHTML = `<div class="feedback-icon">⏰</div><div class="feedback-text">Waktu habis! Jawaban yang benar adalah ${correctAnswer}.</div>`;
                } else {
                    feedbackDiv.innerHTML = `<div class="feedback-icon">✗</div><div class="feedback-text">Salah! Jawaban yang benar adalah ${correctAnswer}.</div>`;
                }
                feedbackDiv.className = 'quiz-feedback incorrect';
            }
            feedbackDiv.style.display = 'block';
            feedbackDiv.style.animation = 'bounceIn 0.5s ease-out';
        }
        
        // Show next button with animation
        const nextBtn = document.getElementById('next-question');
        if (nextBtn) {
            nextBtn.style.display = 'block';
            nextBtn.style.animation = 'bounceIn 0.5s ease-out';
        }
        
        // Update score display with animation
        const scoreDisplay = document.querySelector('.quiz-score');
        if (scoreDisplay) {
            scoreDisplay.textContent = `Skor: ${this.quizScore}/${this.currentQuestionIndex + 1}`;
            scoreDisplay.style.animation = 'pulse 0.3s ease-in-out';
        }
    }
    
    nextQuestion() {
        this.currentQuestionIndex++;
        
        // Hide feedback
        const feedbackDiv = document.querySelector('.quiz-feedback');
        if (feedbackDiv) {
            feedbackDiv.style.display = 'none';
        }
        
        this.showQuestion();
    }
    
    endQuiz() {
        const quizContainer = document.querySelector('.quiz-container');
        const finalScore = this.quizScore;
        const totalQuestions = this.selectedQuestions.length;
        const percentage = (finalScore / totalQuestions) * 100;
        
        if (quizContainer) {
            quizContainer.innerHTML = `
                <div class="quiz-complete">
                    <h3>Kuis Selesai!</h3>
                    <div class="final-score">
                        <p>Skor Anda: ${finalScore}/${totalQuestions}</p>
                        <p>Persentase: ${percentage.toFixed(1)}%</p>
                    </div>
                    ${percentage >= 70 ? 
                        '<p class="text-success">Selamat! Anda lulus kuis evaluasi.</p>' : 
                        '<p class="text-error">Anda perlu belajar lebih lanjut tentang efisiensi energi.</p>'
                    }
                </div>
            `;
        }
        
        if (percentage >= 70) {
            setTimeout(() => {
                this.completePuzzle(4, 1);
            }, 2000);
        } else {
            // Allow retry
            setTimeout(() => {
                const retryBtn = document.createElement('button');
                retryBtn.textContent = 'Coba Lagi';
                retryBtn.className = 'btn-primary';
                retryBtn.addEventListener('click', () => {
                    this.initializeQuiz();
                });
                quizContainer.appendChild(retryBtn);
            }, 3000);
        }
    }
    
    // Puzzle Completion
    completePuzzle(level, puzzle) {
        this.progress[`level${level}`][`puzzle${puzzle}`] = true;
        this.energyKeys++;
        this.score += 100;
        
        // Show reward
        const rewardDiv = document.querySelector(`#level${level}-scene .level-reward`);
        if (rewardDiv) {
            rewardDiv.classList.add('show');
            
            const keyElement = rewardDiv.querySelector('.key-energy');
            if (keyElement) {
                keyElement.textContent = `🔑 Kunci Energi ${level} Didapat!`;
            }
        }
        
        this.updateProgress();
        
        // Check if all levels completed
        if (this.energyKeys >= 4) {
            setTimeout(() => {
                this.showScene('ending');
                this.showFinalResults();
            }, 3000);
        } else {
            // Show next level button
            setTimeout(() => {
                const nextLevelBtn = document.querySelector(`#level${level}-scene .next-level`);
                if (nextLevelBtn) {
                    nextLevelBtn.style.display = 'block';
                }
            }, 2000);
        }
    }
    
    showFinalResults() {
        const endingScene = document.getElementById('ending-scene');
        const finalScoreDiv = endingScene.querySelector('.final-score');
        
        if (finalScoreDiv) {
            finalScoreDiv.innerHTML = `
                <h2>🎉 Selamat! 🎉</h2>
                <p>Anda telah menyelesaikan semua level Energy Quest!</p>
                <p><strong>Total Skor: ${this.score}</strong></p>
                <p><strong>Kunci Energi: ${this.energyKeys}/4</strong></p>
                <p>Anda telah mempelajari dasar-dasar efisiensi energi dan cara menghemat listrik di rumah.</p>
                <p>Terapkan pengetahuan ini dalam kehidupan sehari-hari untuk membantu menjaga lingkungan!</p>
            `;
        }
    }
    
    restartGame() {
        // Reset all states
        this.currentState = 'opening';
        this.currentLevel = 1;
        this.currentPuzzle = 1;
        this.score = 0;
        this.energyKeys = 0;
        this.progress = {
            level1: { puzzle1: false, puzzle2: false },
            level2: { completed: false },
            level3: { completed: false },
            level4: { completed: false }
        };
        
        // Reset circuit state
        this.circuitState = {
            connections: [],
            switchOn: false,
            tvSteps: {
                plugged: false,
                switchOn: false,
                powerOn: false,
                channelSet: false
            }
        };
        
        // Reset kitchen state
        this.kitchenState = {
            powerConsumption: 0,
            appliances: {
                window: false,
                light: true,
                fridge: { open: false, timer: 0 },
                riceCooker: 'normal',
                iron: false
            }
        };
        
        // Reset lab state
        this.labState = {
            appliances: {
                ac: { on: false, power: 1500, time: 0 },
                light: { on: true, power: 60, time: 8 },
                fan: { on: false, power: 75, time: 0 },
                tv: { on: false, power: 150, time: 0 },
                fridge: { on: true, power: 200, time: 24 }
            },
            totalCost: 0,
            targetCost: 300000
        };
        
        // Clear intervals
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        if (this.fridgeTimerInterval) {
            clearInterval(this.fridgeTimerInterval);
        }
        
        // Reset UI
        document.querySelectorAll('.level-reward').forEach(reward => {
            reward.classList.remove('show');
        });
        
        document.querySelectorAll('.next-level').forEach(btn => {
            btn.style.display = 'none';
        });
        
        // Show opening scene
        this.showScene('opening');
        this.updateProgress();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game2D = new Game2D();
});

// Save progress to localStorage
function saveProgress() {
    if (window.game2D) {
        localStorage.setItem('energy-quest-progress', JSON.stringify({
            progress: window.game2D.progress,
            score: window.game2D.score,
            energyKeys: window.game2D.energyKeys
        }));
    }
}

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('energy-quest-progress');
    if (saved && window.game2D) {
        const data = JSON.parse(saved);
        window.game2D.progress = data.progress || window.game2D.progress;
        window.game2D.score = data.score || 0;
        window.game2D.energyKeys = data.energyKeys || 0;
        window.game2D.updateProgress();
    }
}

// Auto-save progress
setInterval(saveProgress, 10000); // Save every 10 seconds