// Main Game JavaScript
class MainGame {
    constructor() {
        this.gameCompleted = false;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.questions = [
            {
                question: "Apa yang terjadi jika kita tidak mencabut charger dari stop kontak setelah selesai mengisi daya?",
                options: [
                    "Tidak ada dampak apa-apa",
                    "Charger tetap mengonsumsi listrik meski tidak digunakan",
                    "Charger akan rusak",
                    "Stop kontak akan panas"
                ],
                correct: 1
            },
            {
                question: "Manakah cara terbaik untuk menghemat energi listrik di rumah?",
                options: [
                    "Menyalakan semua lampu sepanjang hari",
                    "Menggunakan lampu LED dan mematikan perangkat yang tidak digunakan",
                    "Membiarkan TV menyala terus",
                    "Menggunakan AC dengan suhu paling dingin"
                ],
                correct: 1
            },
            {
                question: "Berapa persen energi yang bisa dihemat dengan mengganti lampu pijar dengan lampu LED?",
                options: [
                    "10-20%",
                    "30-40%",
                    "50-60%",
                    "80-90%"
                ],
                correct: 3
            },
            {
                question: "Apa yang dimaksud dengan 'phantom load' atau 'vampire power'?",
                options: [
                    "Listrik yang digunakan hantu",
                    "Konsumsi listrik perangkat elektronik saat dalam mode standby",
                    "Listrik yang hilang di kabel",
                    "Listrik yang digunakan di malam hari"
                ],
                correct: 1
            },
            {
                question: "Manakah perangkat rumah tangga yang paling boros energi?",
                options: [
                    "Lampu LED",
                    "Kulkas",
                    "AC (Air Conditioner)",
                    "Radio"
                ],
                correct: 2
            }
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.shuffleQuestions();
        
        // Initialize audio
        if (window.audioManager) {
            window.audioManager.playMusic();
        }
    }
    
    setupEventListeners() {
        // Game controls
        document.getElementById('reset-btn').addEventListener('click', () => this.resetGame());
        document.getElementById('hint-btn').addEventListener('click', () => this.showHint());
        document.getElementById('continue-btn').addEventListener('click', () => this.startQuiz());
        
        // Quiz controls
        document.getElementById('prev-question').addEventListener('click', () => this.previousQuestion());
        document.getElementById('next-question').addEventListener('click', () => this.nextQuestion());
        document.getElementById('back-to-menu').addEventListener('click', () => this.backToMenu());
    }
    
    setupDragAndDrop() {
        const cable = document.getElementById('cable');
        const stopKontak = document.getElementById('stop-kontak');
        const powerSource = document.getElementById('power-source');
        
        // Make cable draggable
        cable.draggable = true;
        
        cable.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', 'cable');
            cable.style.opacity = '0.5';
        });
        
        cable.addEventListener('dragend', () => {
            cable.style.opacity = '1';
        });
        
        // Make stop kontak a drop zone
        stopKontak.addEventListener('dragover', (e) => {
            e.preventDefault();
            stopKontak.style.borderColor = '#4CAF50';
            stopKontak.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
        });
        
        stopKontak.addEventListener('dragleave', () => {
            if (!stopKontak.classList.contains('connected')) {
                stopKontak.style.borderColor = '#9C27B0';
                stopKontak.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            }
        });
        
        stopKontak.addEventListener('drop', (e) => {
            e.preventDefault();
            const data = e.dataTransfer.getData('text/plain');
            
            if (data === 'cable') {
                this.connectCable();
            }
        });
        
        // Click alternative for mobile
        let cableSelected = false;
        
        cable.addEventListener('click', () => {
            if (!cableSelected) {
                cableSelected = true;
                cable.style.border = '3px solid #4CAF50';
                cable.style.transform = 'scale(1.1)';
                
                // Show instruction
                this.showMessage('Sekarang klik pada stop kontak untuk menghubungkan kabel!');
            }
        });
        
        stopKontak.addEventListener('click', () => {
            if (cableSelected) {
                this.connectCable();
                cableSelected = false;
            }
        });
    }
    
    connectCable() {
        const stopKontak = document.getElementById('stop-kontak');
        const lamp = document.getElementById('lamp');
        const cable = document.getElementById('cable');
        
        // Visual feedback
        stopKontak.classList.add('connected');
        stopKontak.style.borderColor = '#4CAF50';
        stopKontak.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
        
        // Reset cable style
        cable.style.border = '3px solid #FF9800';
        cable.style.transform = 'scale(1)';
        
        // Turn on the lamp
        setTimeout(() => {
            lamp.classList.remove('lamp-off');
            lamp.classList.add('lamp-on');
            
            // Play success sound
            if (window.audioManager) {
                window.audioManager.playSuccessSound();
            }
            
            // Show success message
            setTimeout(() => {
                this.showSuccessMessage();
            }, 1000);
        }, 500);
    }
    
    showSuccessMessage() {
        this.gameCompleted = true;
        document.getElementById('success-message').style.display = 'flex';
    }
    
    startQuiz() {
        document.getElementById('success-message').style.display = 'none';
        document.getElementById('game-container').style.display = 'none';
        document.getElementById('quiz-container').style.display = 'flex';
        
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.showQuestion();
    }
    
    // Fisher-Yates (Yacht) Shuffle Algorithm
    shuffleQuestions() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
    }
    
    showQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        
        document.getElementById('question-number').textContent = 
            `Pertanyaan ${this.currentQuestionIndex + 1} dari ${this.questions.length}`;
        document.getElementById('question-text').textContent = question.question;
        
        const answersContainer = document.getElementById('answers-container');
        answersContainer.innerHTML = '';
        
        // Shuffle answers using Fisher-Yates
        const shuffledOptions = [...question.options];
        const correctAnswer = question.options[question.correct];
        
        for (let i = shuffledOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
        }
        
        // Find new correct index after shuffle
        const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
        
        shuffledOptions.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'answer-option';
            optionElement.textContent = option;
            optionElement.dataset.index = index;
            optionElement.dataset.correct = index === newCorrectIndex ? 'true' : 'false';
            
            optionElement.addEventListener('click', () => this.selectAnswer(optionElement, index));
            
            answersContainer.appendChild(optionElement);
        });
        
        // Update navigation buttons
        document.getElementById('prev-question').disabled = this.currentQuestionIndex === 0;
        document.getElementById('next-question').disabled = true;
        document.getElementById('next-question').textContent = 
            this.currentQuestionIndex === this.questions.length - 1 ? 'Selesai' : 'Lanjut';
    }
    
    selectAnswer(selectedElement, answerIndex) {
        // Remove previous selection
        document.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Mark selected
        selectedElement.classList.add('selected');
        
        // Store answer
        this.userAnswers[this.currentQuestionIndex] = {
            selected: answerIndex,
            correct: selectedElement.dataset.correct === 'true'
        };
        
        // Enable next button
        document.getElementById('next-question').disabled = false;
        
        // Play click sound
        if (window.audioManager) {
            window.audioManager.playClickSound();
        }
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.showQuestion();
        } else {
            this.showResults();
        }
    }
    
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.showQuestion();
            
            // Restore previous answer if exists
            if (this.userAnswers[this.currentQuestionIndex]) {
                const answerOptions = document.querySelectorAll('.answer-option');
                const selectedIndex = this.userAnswers[this.currentQuestionIndex].selected;
                answerOptions[selectedIndex].classList.add('selected');
                document.getElementById('next-question').disabled = false;
            }
        }
    }
    
    showResults() {
        const correctAnswers = this.userAnswers.filter(answer => answer.correct).length;
        const totalQuestions = this.questions.length;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        
        document.getElementById('quiz-content').style.display = 'none';
        document.getElementById('quiz-results').style.display = 'flex';
        
        document.getElementById('score-text').textContent = 
            `Kamu menjawab ${correctAnswers} dari ${totalQuestions} pertanyaan dengan benar (${percentage}%)`;
        
        // Show breakdown
        const breakdown = document.getElementById('score-breakdown');
        breakdown.innerHTML = `
            <div class="score-item">
                <span>Jawaban Benar:</span>
                <span>${correctAnswers}</span>
            </div>
            <div class="score-item">
                <span>Jawaban Salah:</span>
                <span>${totalQuestions - correctAnswers}</span>
            </div>
            <div class="score-item">
                <span>Total Skor:</span>
                <span>${percentage}%</span>
            </div>
        `;
        
        // Play appropriate sound
        if (window.audioManager) {
            if (percentage >= 80) {
                window.audioManager.playSuccessSound();
            } else {
                window.audioManager.playErrorSound();
            }
        }
    }
    
    resetGame() {
        // Reset game state
        this.gameCompleted = false;
        
        // Reset visual elements
        const stopKontak = document.getElementById('stop-kontak');
        const lamp = document.getElementById('lamp');
        const cable = document.getElementById('cable');
        
        stopKontak.classList.remove('connected');
        stopKontak.style.borderColor = '#9C27B0';
        stopKontak.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        
        lamp.classList.remove('lamp-on');
        lamp.classList.add('lamp-off');
        
        cable.style.border = '3px solid #FF9800';
        cable.style.transform = 'scale(1)';
        
        // Hide success message
        document.getElementById('success-message').style.display = 'none';
        
        this.showMessage('Game direset! Coba lagi menghubungkan kabel ke stop kontak.');
    }
    
    showHint() {
        if (!this.gameCompleted) {
            this.showMessage('💡 Petunjuk: Seret kabel dari tengah ke stop kontak di kanan, atau klik kabel lalu klik stop kontak!');
        }
    }
    
    showMessage(message) {
        // Create temporary message
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            z-index: 1000;
            font-size: 1.1em;
            font-weight: 500;
            max-width: 80%;
            text-align: center;
        `;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
    
    backToMenu() {
        window.location.href = 'main-menu.html';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mainGame = new MainGame();
    
    // Hide puzzle-game-container to prevent it from showing on main game
    const puzzleContainer = document.getElementById('puzzle-game-container');
    if (puzzleContainer) {
        puzzleContainer.style.display = 'none';
    }
});

// Handle page visibility for audio
document.addEventListener('visibilitychange', () => {
    if (window.audioManager) {
        if (document.hidden) {
            window.audioManager.stopMusic();
        } else {
            window.audioManager.playMusic();
        }
    }
});