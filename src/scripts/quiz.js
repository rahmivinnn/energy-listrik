// Quiz Game Controller
class QuizGame {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isAnswered = false;
        
        // Quiz questions data
        this.questions = [
            {
                question: "Apa yang dimaksud dengan rangkaian listrik tertutup?",
                options: [
                    "Rangkaian di mana arus listrik tidak bisa mengalir.",
                    "Rangkaian di mana semua komponen terhubung secara lengkap sehingga arus bisa mengalir.",
                    "Rangkaian yang hanya menggunakan baterai tanpa saklar.",
                    "Rangkaian yang terbuka di salah satu ujungnya."
                ],
                correct: 1
            },
            {
                question: "Fungsi saklar dalam rangkaian listrik adalah...",
                options: [
                    "Menyimpan energi listrik.",
                    "Memutus atau menghubungkan arus listrik.",
                    "Menghasilkan cahaya seperti lampu.",
                    "Mengukur daya listrik."
                ],
                correct: 1
            },
            {
                question: "Jika lampu tidak menyala dalam puzzle kabel, apa kemungkinan penyebabnya?",
                options: [
                    "Rangkaian tertutup dengan benar.",
                    "Rangkaian terbuka atau salah sambung.",
                    "Baterai terlalu kuat.",
                    "Saklar sudah rusak permanen."
                ],
                correct: 1
            },
            {
                question: "Untuk menyalakan TV tua di ruang tamu, urutan langkah yang benar adalah...",
                options: [
                    "Tekan tombol power → colok kabel → nyalakan saklar utama.",
                    "Colok kabel → nyalakan saklar utama → tekan tombol power → atur channel.",
                    "Atur channel → colok kabel → tekan tombol power.",
                    "Nyalakan saklar utama → atur channel → colok kabel."
                ],
                correct: 1
            },
            {
                question: "Apa pesan edukatif yang muncul jika berhasil menyelesaikan puzzle kabel?",
                options: [
                    "Listrik mengalir hanya di rangkaian terbuka.",
                    "Listrik mengalir dalam rangkaian tertutup, dan saklar memutus arus.",
                    "Baterai harus diganti setiap hari.",
                    "Lampu menyala tanpa arus listrik."
                ],
                correct: 1
            },
            {
                question: "Cara menghemat energi di dapur adalah...",
                options: [
                    "Membiarkan pintu kulkas terbuka lama.",
                    "Menutup pintu kulkas dengan cepat.",
                    "Menyalakan semua lampu sepanjang hari.",
                    "Menggunakan rice cooker mode boros."
                ],
                correct: 1
            },
            {
                question: "Jika Power Meter berwarna merah di Level 2, itu berarti...",
                options: [
                    "Penggunaan energi efisien.",
                    "Penggunaan energi boros.",
                    "Game sudah selesai.",
                    "Kunci Energi didapatkan."
                ],
                correct: 1
            },
            {
                question: "Apa reward setelah menyelesaikan puzzle efisiensi di dapur?",
                options: [
                    "Kunci Energi Pertama.",
                    "Kunci Energi Kedua dan clue dari radio.",
                    "Blueprint alat rahasia.",
                    "Lencana Peneliti Muda."
                ],
                correct: 1
            },
            {
                question: "Di laboratorium kecil, tujuan utama adalah...",
                options: [
                    "Menyalakan semua perangkat tanpa batas.",
                    "Mengatur konsumsi listrik agar tagihan ≤ Rp300.000.",
                    "Membiarkan tagihan melebihi Rp300.000.",
                    "Hanya mematikan lampu saja."
                ],
                correct: 1
            },
            {
                question: "Rumus perhitungan energi listrik adalah...",
                options: [
                    "Energi (kWh) = P × t × 1000.",
                    "Energi (kWh) = (P × t) / 1000.",
                    "Energi (kWh) = P + t / 1000.",
                    "Energi (kWh) = P - t × 1000."
                ],
                correct: 1
            },
            {
                question: "Jika sebuah lampu 100 Watt digunakan selama 5 jam, berapa energi yang terpakai?",
                options: [
                    "0.5 kWh.",
                    "500 kWh.",
                    "5 kWh.",
                    "0.05 kWh."
                ],
                correct: 0
            },
            {
                question: "Apa yang terjadi jika tagihan listrik melebihi batas di simulator Level 3?",
                options: [
                    "Ruangan menjadi terang dan HUD hijau.",
                    "Lampu laboratorium meredup dan HUD merah.",
                    "Pintu rahasia langsung terbuka.",
                    "Game berpindah ke Level 1."
                ],
                correct: 1
            },
            {
                question: "Untuk membuka pintu besar di Ruang Bawah Tanah, dibutuhkan...",
                options: [
                    "Satu Kunci Energi.",
                    "Tiga Kunci Energi.",
                    "Lima Kunci Energi.",
                    "Tidak ada kunci, langsung kuis."
                ],
                correct: 1
            },
            {
                question: "Apa fungsi Fisher-Yates Shuffle di game ini?",
                options: [
                    "Mengacak urutan level.",
                    "Mengacak soal kuis agar urutan berbeda setiap kali.",
                    "Mengacak warna Power Meter.",
                    "Mengacak animasi opening."
                ],
                correct: 1
            },
            {
                question: "Cara menghemat energi saat menggunakan AC adalah...",
                options: [
                    "Menyalakannya 24 jam tanpa henti.",
                    "Mengatur ON/OFF sesuai kebutuhan dan efisien.",
                    "Membiarkannya boros untuk kenyamanan.",
                    "Tidak pernah mematikannya."
                ],
                correct: 1
            },
            {
                question: "Jika rice cooker 500 Watt digunakan 2 jam, berapa kWh yang terpakai?",
                options: [
                    "1 kWh.",
                    "1000 kWh.",
                    "0.1 kWh.",
                    "10 kWh."
                ],
                correct: 0
            },
            {
                question: "Pesan akhir dari ilmuwan di ending scene adalah...",
                options: [
                    "Boroslah energi untuk masa depan.",
                    "Gunakan energi dengan bijak untuk masa depan.",
                    "Lupakan efisiensi energi.",
                    "Kembali ke Level 1."
                ],
                correct: 1
            },
            {
                question: "Apa yang dimaksud dengan efisiensi energi?",
                options: [
                    "Menggunakan energi sebanyak mungkin.",
                    "Menggunakan energi secara bijak agar tidak terbuang sia-sia.",
                    "Hanya mematikan lampu di malam hari.",
                    "Membeli perangkat baru setiap bulan."
                ],
                correct: 1
            },
            {
                question: "Di puzzle TV, jika salah urutan, apa feedback-nya?",
                options: [
                    "TV menyala dan menampilkan rekaman.",
                    "TV tetap mati, pesan: Pastikan aliran listrik benar.",
                    "Pintu dapur terbuka otomatis.",
                    "Power Meter naik ke hijau."
                ],
                correct: 1
            },
            {
                question: "Jika kulkas dibiarkan terbuka lama, apa dampaknya di game?",
                options: [
                    "Power Meter turun ke hijau.",
                    "Power Meter naik (boros energi).",
                    "Mendapatkan Kunci Energi ekstra.",
                    "Ruangan menjadi lebih terang."
                ],
                correct: 1
            }
        ];
        
        this.init();
    }
    
    init() {
        this.setupAudio();
        this.setupEventListeners();
        this.displayQuestion();
        this.updateProgress();
        
        // Start background music
        this.startBackgroundMusic();
    }
    
    setupAudio() {
        this.bgMusic = document.getElementById('quiz-bg-music');
        this.correctSound = document.getElementById('correct-sound');
        this.wrongSound = document.getElementById('wrong-sound');
        this.completeSound = document.getElementById('complete-sound');
        
        if (this.bgMusic) {
            this.bgMusic.volume = 0.3;
        }
    }
    
    startBackgroundMusic() {
        if (this.bgMusic) {
            this.bgMusic.play().catch(e => {
                console.log('Background music autoplay failed:', e);
                // Add click listener to start music on user interaction
                document.addEventListener('click', () => {
                    this.bgMusic.play();
                }, { once: true });
            });
        }
    }
    
    setupEventListeners() {
        // Navigation buttons
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        const finishBtn = document.getElementById('finish-btn');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousQuestion());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextQuestion());
        if (submitBtn) submitBtn.addEventListener('click', () => this.submitQuiz());
        if (finishBtn) finishBtn.addEventListener('click', () => this.submitQuiz());
        
        // Results buttons
        const retryBtn = document.getElementById('retry-btn');
        const backMenuBtn = document.getElementById('back-menu-btn');
        const backToMenuBtn = document.getElementById('back-to-menu');
        
        if (retryBtn) retryBtn.addEventListener('click', () => this.retryQuiz());
        if (backMenuBtn) backMenuBtn.addEventListener('click', () => this.backToMenu());
        if (backToMenuBtn) backToMenuBtn.addEventListener('click', () => this.backToMenu());
    }
    
    displayQuestion() {
        const question = this.questions[this.currentQuestion];
        const questionText = document.getElementById('question-text');
        const optionsContainer = document.getElementById('options-container');
        
        questionText.textContent = `${this.currentQuestion + 1}. ${question.question}`;
        
        // Clear previous options
        optionsContainer.innerHTML = '';
        
        // Create option buttons
        question.options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'option-btn';
            optionBtn.textContent = `${String.fromCharCode(97 + index)}) ${option}`;
            optionBtn.addEventListener('click', () => this.selectOption(index));
            
            // Restore previous selection
            if (this.userAnswers[this.currentQuestion] === index) {
                optionBtn.classList.add('selected');
            }
            
            optionsContainer.appendChild(optionBtn);
        });
        
        this.updateNavigationButtons();
        this.isAnswered = this.userAnswers[this.currentQuestion] !== undefined;
    }
    
    selectOption(optionIndex) {
        // Remove previous selection
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selection to clicked option
        const selectedBtn = document.querySelectorAll('.option-btn')[optionIndex];
        selectedBtn.classList.add('selected');
        
        // Store answer
        this.userAnswers[this.currentQuestion] = optionIndex;
        this.isAnswered = true;
        
        this.updateNavigationButtons();
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        const finishBtn = document.getElementById('finish-btn');
        
        // Previous button
        if (prevBtn) {
            prevBtn.disabled = this.currentQuestion === 0;
        }
        
        // Next/Submit button
        if (this.currentQuestion === this.questions.length - 1) {
            if (nextBtn) nextBtn.style.display = 'none';
            if (submitBtn) {
                submitBtn.style.display = 'inline-block';
                submitBtn.disabled = !this.isAnswered;
            }
            if (finishBtn) {
                finishBtn.style.display = 'inline-block';
                finishBtn.disabled = !this.isAnswered;
            }
        } else {
            if (nextBtn) {
                nextBtn.style.display = 'inline-block';
                nextBtn.disabled = !this.isAnswered;
            }
            if (submitBtn) submitBtn.style.display = 'none';
            if (finishBtn) finishBtn.style.display = 'none';
        }
    }
    
    updateProgress() {
        const questionCounter = document.getElementById('question-counter');
        const progressFill = document.getElementById('progress-fill');
        
        questionCounter.textContent = `Soal ${this.currentQuestion + 1} dari ${this.questions.length}`;
        
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        progressFill.style.width = `${progress}%`;
    }
    
    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.displayQuestion();
            this.updateProgress();
        }
    }
    
    nextQuestion() {
        if (this.currentQuestion < this.questions.length - 1 && this.isAnswered) {
            this.currentQuestion++;
            this.displayQuestion();
            this.updateProgress();
        }
    }
    
    submitQuiz() {
        // Calculate score
        this.score = 0;
        this.userAnswers.forEach((answer, index) => {
            if (answer === this.questions[index].correct) {
                this.score++;
            }
        });
        
        // Show results
        this.showResults();
        
        // Play completion sound
        if (this.completeSound) {
            this.completeSound.play();
        }
        
        // Stop background music
        if (this.bgMusic) {
            this.bgMusic.pause();
        }
    }
    
    showResults() {
        const resultsContainer = document.getElementById('quiz-results');
        const finalScore = document.getElementById('final-score');
        const scorePercentage = document.getElementById('score-percentage');
        const scoreMessage = document.getElementById('score-message');
        
        finalScore.textContent = this.score;
        const percentage = Math.round((this.score / this.questions.length) * 100);
        scorePercentage.textContent = `${percentage}%`;
        
        // Score message based on performance
        let message = '';
        if (percentage >= 90) {
            message = '🏆 Luar biasa! Anda adalah ahli hemat energi!';
        } else if (percentage >= 80) {
            message = '🌟 Sangat baik! Pengetahuan energi Anda sangat bagus!';
        } else if (percentage >= 70) {
            message = '👍 Baik! Anda memahami konsep dasar hemat energi.';
        } else if (percentage >= 60) {
            message = '📚 Cukup baik, tapi masih perlu belajar lebih banyak.';
        } else {
            message = '💪 Jangan menyerah! Pelajari lagi materi hemat energi.';
        }
        
        // Save quiz completion status if score is 70% or higher
        if (percentage >= 70) {
            localStorage.setItem('quizCompleted', 'true');
            message += ' 🎮 Game Map & Puzzle dan Energy Experiments telah terbuka!';
        }
        
        scoreMessage.textContent = message;
        resultsContainer.style.display = 'flex';
    }
    
    retryQuiz() {
        // Reset quiz state
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isAnswered = false;
        
        // Hide results
        document.getElementById('quiz-results').style.display = 'none';
        
        // Restart quiz
        this.displayQuestion();
        this.updateProgress();
        this.startBackgroundMusic();
    }
    
    backToMenu() {
        // Stop background music
        if (this.bgMusic) {
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
        }
        
        // Navigate to main menu
        window.location.href = 'main-menu.html';
    }
}

// Navigation function
function goBackToMenu() {
    // Stop background music
    const bgMusic = document.getElementById('background-music');
    if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
    }
    
    // Navigate back to main menu
    window.location.href = 'main-menu.html';
}

// Initialize quiz when DOM is loaded
let quiz;
document.addEventListener('DOMContentLoaded', () => {
    quiz = new QuizGame();
    quiz.init();
});