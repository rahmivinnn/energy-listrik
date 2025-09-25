// Scene 5 Level 4: 地下室最终评估 JavaScript - Quiz System

class Scene5Level4 {
    constructor() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.totalQuestions = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.skippedQuestions = 0;
        this.hintsUsed = 0;
        this.maxHints = 3;
        this.timeStarted = Date.now();
        this.selectedAnswer = null;
        this.gameState = 'playing'; // playing, completed
        this.energyKeys = 4; // From previous levels
        
        // Quiz questions database
        this.questions = [
            {
                id: 1,
                category: "基础电路",
                question: "在串联电路中，如果一个灯泡烧坏了，会发生什么？",
                image: null,
                options: [
                    "其他灯泡继续正常工作",
                    "所有灯泡都会熄灭",
                    "其他灯泡会变得更亮",
                    "只有相邻的灯泡会熄灭"
                ],
                correct: 1,
                explanation: "在串联电路中，电流只有一条路径。如果其中一个元件损坏，整个电路就会断开，所有设备都会停止工作。这就是为什么家庭电路通常使用并联连接的原因。",
                points: 10
            },
            {
                id: 2,
                category: "能源效率",
                question: "以下哪种做法最能有效节约家庭用电？",
                image: null,
                options: [
                    "白天开着所有灯",
                    "充分利用自然光，及时关闭不必要的电器",
                    "让电器保持待机状态",
                    "使用功率更大的电器"
                ],
                correct: 1,
                explanation: "充分利用自然光可以减少照明用电，及时关闭不必要的电器可以避免待机功耗。这些简单的习惯可以显著降低家庭电费。",
                points: 15
            },
            {
                id: 3,
                category: "电费计算",
                question: "一台1000W的空调每天使用8小时，按电价1.5元/kWh计算，一个月（30天）的电费大约是多少？",
                image: null,
                options: [
                    "240元",
                    "360元",
                    "480元",
                    "600元"
                ],
                correct: 1,
                explanation: "计算过程：1000W × 8小时 × 30天 = 240,000Wh = 240kWh，240kWh × 1.5元/kWh = 360元。掌握电费计算有助于合理规划用电。",
                points: 20
            },
            {
                id: 4,
                category: "安全用电",
                question: "发现电器冒烟时，正确的处理方式是什么？",
                image: null,
                options: [
                    "立即用水扑灭",
                    "继续使用观察情况",
                    "立即断电并远离，必要时使用干粉灭火器",
                    "打开窗户通风"
                ],
                correct: 2,
                explanation: "电器冒烟可能是短路或过热的征象，非常危险。应立即断电防止火灾，绝不能用水扑灭电器火灾，因为水导电会造成触电危险。",
                points: 25
            },
            {
                id: 5,
                category: "可再生能源",
                question: "太阳能发电的主要优势是什么？",
                image: null,
                options: [
                    "只能在白天使用",
                    "清洁可再生，减少碳排放",
                    "成本很高",
                    "效率很低"
                ],
                correct: 1,
                explanation: "太阳能是清洁的可再生能源，不产生污染物和温室气体。虽然初期投资较高，但长期来看是环保且经济的能源选择。",
                points: 15
            },
            {
                id: 6,
                category: "智能用电",
                question: "智能电表相比传统电表的主要优势是什么？",
                image: null,
                options: [
                    "只是外观更好看",
                    "可以实时监控用电量，帮助优化用电习惯",
                    "用电量会自动减少",
                    "电费会自动降低"
                ],
                correct: 1,
                explanation: "智能电表可以实时显示用电数据，帮助用户了解各时段的用电情况，从而调整用电习惯，实现节能减排。",
                points: 15
            }
        ];
        
        this.totalQuestions = this.questions.length;
        
        // Knowledge base for educational content
        this.knowledgeBase = {
            circuits: {
                title: "电路基础知识",
                content: `
                    <p><strong>串联电路：</strong>电流只有一条路径，各元件依次连接。</p>
                    <ul>
                        <li>电流处处相等</li>
                        <li>电压分配到各元件</li>
                        <li>一个元件损坏，整个电路断开</li>
                    </ul>
                    <p><strong>并联电路：</strong>电流有多条路径，各元件独立工作。</p>
                    <ul>
                        <li>电压处处相等</li>
                        <li>电流分配到各支路</li>
                        <li>一个元件损坏，其他元件正常工作</li>
                    </ul>
                `
            },
            efficiency: {
                title: "能源效率",
                content: `
                    <p><strong>节能小贴士：</strong></p>
                    <ul>
                        <li>充分利用自然光，减少人工照明</li>
                        <li>及时关闭不使用的电器</li>
                        <li>选择节能型电器</li>
                        <li>合理设置空调温度</li>
                        <li>定期清洁电器，保持良好散热</li>
                    </ul>
                    <p><strong>待机功耗：</strong>许多电器在待机状态下仍会消耗电能，累积起来不容忽视。</p>
                `
            },
            calculation: {
                title: "电费计算",
                content: `
                    <p><strong>基本公式：</strong></p>
                    <p>用电量(kWh) = 功率(kW) × 时间(h)</p>
                    <p>电费 = 用电量(kWh) × 电价(元/kWh)</p>
                    <p><strong>示例：</strong></p>
                    <p>100W灯泡使用10小时：</p>
                    <p>用电量 = 0.1kW × 10h = 1kWh</p>
                    <p>电费 = 1kWh × 0.6元/kWh = 0.6元</p>
                `
            },
            safety: {
                title: "安全用电",
                content: `
                    <p><strong>基本原则：</strong></p>
                    <ul>
                        <li>湿手不触摸电器开关</li>
                        <li>不超负荷使用插座</li>
                        <li>定期检查电线是否老化</li>
                        <li>使用合格的电器产品</li>
                    </ul>
                    <p><strong>紧急情况处理：</strong></p>
                    <ul>
                        <li>发现漏电：立即断电</li>
                        <li>电器起火：断电后用干粉灭火器</li>
                        <li>触电事故：先断电再施救</li>
                    </ul>
                `
            }
        };
        
        // Audio elements
        this.audio = {
            background: null,
            correct: null,
            wrong: null,
            complete: null,
            click: null
        };
        
        this.init();
    }
    
    init() {
        this.setupAudio();
        this.setupEventListeners();
        this.updateHUD();
        this.loadQuestion();
        this.startTimer();
        
        // Show welcome message
        setTimeout(() => {
            this.showWelcomeMessage();
        }, 500);
    }
    
    setupAudio() {
        try {
            // Use correct path for background music
            this.audio.background = new Audio('public/audio/background_music.mp3');
            this.audio.background.loop = true;
            this.audio.background.volume = 0.3;
            
            // Setup dramatic sound
            this.audio.dramatic = new Audio('public/audio/dramatic_sound.mp3');
            this.audio.dramatic.volume = 0.5;
            
            this.audio.correct = new Audio('public/audio/sfx_correct.wav');
            this.audio.wrong = new Audio('public/audio/sfx_wrong.wav');
            this.audio.complete = new Audio('public/audio/level_complete.mp3');
            this.audio.click = new Audio('public/audio/sfx_click.wav');
            
            // Start background music
            this.audio.background.play().catch(e => {
                console.log('Audio autoplay prevented:', e);
                // Play on first user interaction
                document.addEventListener('click', () => {
                    this.audio.background.play();
                }, { once: true });
            });
        } catch (error) {
            console.log('Audio setup failed:', error);
        }
    }

    playDramaticSound() {
        if (this.audio.dramatic) {
            this.audio.dramatic.currentTime = 0;
            this.audio.dramatic.play().catch(e => {
                console.log('Dramatic sound play failed:', e);
            });
        }
    }
    
    setupEventListeners() {
        // Answer option clicks
        document.querySelectorAll('.answer-option').forEach((option, index) => {
            option.addEventListener('click', () => this.selectAnswer(index));
        });
        
        // Control buttons
        document.getElementById('submit-answer').addEventListener('click', () => this.submitAnswer());
        document.getElementById('skip-question').addEventListener('click', () => this.skipQuestion());
        document.getElementById('use-hint').addEventListener('click', () => this.showHintPopup());
        
        // Knowledge items
        document.querySelectorAll('.knowledge-item').forEach(item => {
            item.addEventListener('click', () => {
                const topic = item.dataset.topic;
                this.showKnowledgePopup(topic);
            });
        });
        
        // Popup close buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('knowledge-close')) {
                this.closeKnowledgePopup();
            }
            if (e.target.classList.contains('next-btn')) {
                this.nextQuestion();
            }
            if (e.target.classList.contains('use-hint-btn')) {
                this.useHint();
            }
            if (e.target.classList.contains('cancel-hint-btn')) {
                this.closeHintPopup();
            }
        });
        
        // Final result buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('restart-quiz')) {
                this.restartQuiz();
            }
            if (e.target.classList.contains('return-menu')) {
                this.returnToMenu();
            }
        });
    }
    
    updateHUD() {
        // Update progress
        const progressPercent = (this.currentQuestionIndex / this.totalQuestions) * 100;
        document.querySelector('.progress-fill').style.width = `${progressPercent}%`;
        document.querySelector('.progress-fill').textContent = `${Math.round(progressPercent)}%`;
        document.querySelector('.progress-text').textContent = 
            `问题 ${this.currentQuestionIndex + 1} / ${this.totalQuestions}`;
        
        // Update score
        document.querySelector('.score-display span:first-child').textContent = this.score;
        
        // Update score breakdown
        document.querySelector('.score-item:nth-child(1) span:last-child').textContent = this.correctAnswers;
        document.querySelector('.score-item:nth-child(2) span:last-child').textContent = this.wrongAnswers;
        document.querySelector('.score-item:nth-child(3) span:last-child').textContent = this.skippedQuestions;
        
        // Update energy keys
        const keyElements = document.querySelectorAll('.energy-key');
        keyElements.forEach((key, index) => {
            if (index < this.energyKeys) {
                key.style.opacity = '1';
                key.innerHTML = '🔑';
            } else {
                key.style.opacity = '0.3';
                key.innerHTML = '🔒';
            }
        });
        
        // Update hint button
        const hintBtn = document.getElementById('use-hint');
        const hintsLeft = this.maxHints - this.hintsUsed;
        hintBtn.querySelector('.hint-text').textContent = `提示 (${hintsLeft})`;
        hintBtn.disabled = hintsLeft <= 0;
        
        // Update timer
        const elapsed = Math.floor((Date.now() - this.timeStarted) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.querySelector('.timer-display span:last-child').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    loadQuestion() {
        if (this.currentQuestionIndex >= this.totalQuestions) {
            this.completeQuiz();
            return;
        }
        
        const question = this.questions[this.currentQuestionIndex];
        
        // Update question header
        document.querySelector('.question-number').textContent = 
            `问题 ${this.currentQuestionIndex + 1}`;
        document.querySelector('.question-category').textContent = question.category;
        
        // Update question content
        document.querySelector('.question-text').textContent = question.question;
        
        // Handle question image
        const imageContainer = document.querySelector('.question-image');
        if (question.image) {
            imageContainer.innerHTML = `<img src="${question.image}" alt="Question illustration">`;
            imageContainer.style.display = 'block';
        } else {
            imageContainer.style.display = 'none';
        }
        
        // Update answer options
        const optionElements = document.querySelectorAll('.answer-option');
        optionElements.forEach((option, index) => {
            if (index < question.options.length) {
                option.style.display = 'block';
                option.querySelector('.option-letter').textContent = String.fromCharCode(65 + index);
                option.querySelector('.option-text').textContent = question.options[index];
                option.classList.remove('selected', 'correct', 'wrong');
            } else {
                option.style.display = 'none';
            }
        });
        
        // Reset selection
        this.selectedAnswer = null;
        document.getElementById('submit-answer').disabled = true;
        
        // Hide feedback
        document.querySelector('.answer-feedback').style.display = 'none';
        
        // Play question load sound
        if (this.audio.click) {
            this.audio.click.play().catch(e => console.log('Audio play failed'));
        }
    }
    
    selectAnswer(index) {
        // Clear previous selection
        document.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Select new answer
        const selectedOption = document.querySelectorAll('.answer-option')[index];
        selectedOption.classList.add('selected');
        this.selectedAnswer = index;
        
        // Enable submit button
        document.getElementById('submit-answer').disabled = false;
        
        // Play click sound
        if (this.audio.click) {
            this.audio.click.play().catch(e => console.log('Audio play failed'));
        }
    }
    
    submitAnswer() {
        if (this.selectedAnswer === null) return;
        
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = this.selectedAnswer === question.correct;
        
        // Update statistics
        if (isCorrect) {
            this.correctAnswers++;
            this.score += question.points;
        } else {
            this.wrongAnswers++;
        }
        
        // Show visual feedback
        this.showAnswerFeedback(isCorrect, question);
        
        // Play audio feedback
        if (isCorrect && this.audio.correct) {
            this.audio.correct.play().catch(e => console.log('Audio play failed'));
        } else if (!isCorrect && this.audio.wrong) {
            this.audio.wrong.play().catch(e => console.log('Audio play failed'));
        }
        
        // Update HUD
        this.updateHUD();
    }
    
    skipQuestion() {
        this.skippedQuestions++;
        this.updateHUD();
        this.nextQuestion();
        
        // Play click sound
        if (this.audio.click) {
            this.audio.click.play().catch(e => console.log('Audio play failed'));
        }
    }
    
    showAnswerFeedback(isCorrect, question) {
        const feedback = document.querySelector('.answer-feedback');
        const feedbackContent = feedback.querySelector('.feedback-content');
        
        // Update feedback content
        const resultIcon = feedbackContent.querySelector('.feedback-icon');
        const resultTitle = feedbackContent.querySelector('.feedback-title');
        const explanation = feedbackContent.querySelector('.feedback-explanation p');
        
        if (isCorrect) {
            resultIcon.textContent = '✅';
            resultIcon.style.color = '#00ff00';
            resultTitle.textContent = '回答正确！';
            resultTitle.style.color = '#00ff00';
        } else {
            resultIcon.textContent = '❌';
            resultIcon.style.color = '#ff4444';
            resultTitle.textContent = '回答错误';
            resultTitle.style.color = '#ff4444';
        }
        
        explanation.textContent = question.explanation;
        
        // Show correct answer
        const optionElements = document.querySelectorAll('.answer-option');
        optionElements.forEach((option, index) => {
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === this.selectedAnswer && !isCorrect) {
                option.classList.add('wrong');
            }
        });
        
        // Show feedback overlay
        feedback.style.display = 'flex';
    }
    
    nextQuestion() {
        this.currentQuestionIndex++;
        this.loadQuestion();
        
        // Hide feedback
        document.querySelector('.answer-feedback').style.display = 'none';
    }
    
    showHintPopup() {
        if (this.hintsUsed >= this.maxHints) return;
        
        const popup = document.querySelector('.hint-popup');
        const question = this.questions[this.currentQuestionIndex];
        
        // Generate hint based on question
        let hintText = this.generateHint(question);
        
        popup.querySelector('.hint-popup-content p').textContent = hintText;
        popup.querySelector('.hint-cost').textContent = `使用提示将扣除 ${Math.floor(question.points * 0.3)} 分`;
        
        popup.style.display = 'flex';
    }
    
    generateHint(question) {
        const hints = {
            1: "想想串联电路的特点：电流只有一条路径...",
            2: "考虑哪些行为能真正减少电能消耗...",
            3: "记住公式：功率(kW) × 时间(h) × 电价 = 电费",
            4: "电器火灾绝对不能用水扑灭，要先考虑安全...",
            5: "想想什么是可再生能源的主要优势...",
            6: "智能设备的核心价值在于提供信息和数据..."
        };
        
        return hints[question.id] || "仔细思考题目中的关键信息...";
    }
    
    useHint() {
        const question = this.questions[this.currentQuestionIndex];
        const penalty = Math.floor(question.points * 0.3);
        
        this.hintsUsed++;
        this.score = Math.max(0, this.score - penalty);
        
        // Show hint in question area
        const hintDisplay = document.querySelector('.hint-display');
        hintDisplay.querySelector('p').textContent = this.generateHint(question);
        hintDisplay.style.display = 'block';
        
        this.updateHUD();
        this.closeHintPopup();
        
        // Auto-hide hint after 10 seconds
        setTimeout(() => {
            hintDisplay.style.display = 'none';
        }, 10000);
    }
    
    closeHintPopup() {
        document.querySelector('.hint-popup').style.display = 'none';
    }
    
    showKnowledgePopup(topic) {
        const popup = document.querySelector('.knowledge-popup');
        const knowledge = this.knowledgeBase[topic];
        
        if (knowledge) {
            popup.querySelector('h3').textContent = knowledge.title;
            popup.querySelector('.knowledge-content').innerHTML = knowledge.content;
            popup.style.display = 'flex';
        }
    }
    
    closeKnowledgePopup() {
        document.querySelector('.knowledge-popup').style.display = 'none';
    }
    
    completeQuiz() {
        this.gameState = 'completed';
        
        // Stop background music
        if (this.audio.background) {
            this.audio.background.pause();
        }
        
        // Play completion sound and dramatic sound
        if (this.audio.complete) {
            this.audio.complete.play().catch(e => console.log('Audio play failed'));
        }
        this.playDramaticSound();
        
        // Calculate final results
        const totalTime = Math.floor((Date.now() - this.timeStarted) / 1000);
        const accuracy = this.totalQuestions > 0 ? (this.correctAnswers / this.totalQuestions) * 100 : 0;
        const efficiency = this.hintsUsed === 0 ? 100 : Math.max(0, 100 - (this.hintsUsed * 20));
        
        // Determine performance rating
        let rating = 1;
        if (accuracy >= 90 && efficiency >= 80) rating = 5;
        else if (accuracy >= 80 && efficiency >= 60) rating = 4;
        else if (accuracy >= 70 && efficiency >= 40) rating = 3;
        else if (accuracy >= 60) rating = 2;
        
        // Show final results
        this.showFinalResults({
            totalTime,
            accuracy,
            efficiency,
            rating
        });
        
        // Award final energy key if performance is good
        if (rating >= 4) {
            this.energyKeys++;
        }
    }
    
    showFinalResults(results) {
        const resultsScreen = document.querySelector('.final-results');
        
        // Update final score
        resultsScreen.querySelector('.score-value').textContent = this.score;
        
        // Update breakdown
        const breakdownItems = resultsScreen.querySelectorAll('.breakdown-item');
        breakdownItems[0].querySelector('.breakdown-value').textContent = this.correctAnswers;
        breakdownItems[1].querySelector('.breakdown-value').textContent = this.wrongAnswers;
        breakdownItems[2].querySelector('.breakdown-value').textContent = this.skippedQuestions;
        breakdownItems[3].querySelector('.breakdown-value').textContent = this.hintsUsed;
        
        // Update performance rating
        const stars = resultsScreen.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < results.rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
        
        // Update rating text
        const ratingTexts = [
            "需要继续努力",
            "基础掌握良好",
            "表现不错",
            "优秀表现",
            "完美掌握！"
        ];
        resultsScreen.querySelector('.rating-text').textContent = ratingTexts[results.rating - 1];
        
        // Show achievement if earned
        const achievementSection = resultsScreen.querySelector('.achievement-unlock');
        if (results.rating >= 4) {
            achievementSection.style.display = 'block';
            achievementSection.querySelector('.achievement-info h4').textContent = 
                results.rating === 5 ? "能源大师" : "节能专家";
            achievementSection.querySelector('.achievement-info p').textContent = 
                results.rating === 5 ? "完美掌握所有能源知识！" : "优秀的能源管理能力！";
        } else {
            achievementSection.style.display = 'none';
        }
        
        // Update final message
        const finalMessage = resultsScreen.querySelector('.final-message p');
        if (results.rating >= 4) {
            finalMessage.textContent = "恭喜你！你已经掌握了重要的能源知识，可以在日常生活中应用这些技能，为环保事业贡献力量。继续保持这种学习精神！";
        } else {
            finalMessage.textContent = "虽然还有提升空间，但你已经迈出了重要的第一步。建议回顾相关知识点，在实践中不断学习和改进。";
        }
        
        // Show results screen
        resultsScreen.style.display = 'flex';
    }
    
    restartQuiz() {
        // Reset all variables
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.skippedQuestions = 0;
        this.hintsUsed = 0;
        this.timeStarted = Date.now();
        this.selectedAnswer = null;
        this.gameState = 'playing';
        
        // Hide results screen
        document.querySelector('.final-results').style.display = 'none';
        
        // Restart background music
        if (this.audio.background) {
            this.audio.background.currentTime = 0;
            this.audio.background.play().catch(e => console.log('Audio autoplay prevented'));
        }
        
        // Reload first question
        this.updateHUD();
        this.loadQuestion();
    }
    
    returnToMenu() {
        // Stop all audio
        Object.values(this.audio).forEach(audio => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });
        
        // Hide scene
        document.getElementById('scene5-level4-container').style.display = 'none';
        
        // Show main menu (assuming it exists)
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) {
            mainMenu.style.display = 'flex';
        } else {
            // Fallback: reload page
            window.location.reload();
        }
    }
    
    startTimer() {
        setInterval(() => {
            if (this.gameState === 'playing') {
                this.updateHUD();
            }
        }, 1000);
    }
    
    showWelcomeMessage() {
        // Create welcome overlay
        const welcomeOverlay = document.createElement('div');
        welcomeOverlay.className = 'welcome-overlay';
        welcomeOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2500;
        `;
        
        welcomeOverlay.innerHTML = `
            <div class="welcome-content" style="
                background: linear-gradient(135deg, rgba(10, 25, 50, 0.95), rgba(0, 40, 80, 0.9));
                border: 3px solid #00d4ff;
                border-radius: 25px;
                padding: 40px;
                max-width: 600px;
                width: 90%;
                text-align: center;
                box-shadow: 0 0 60px rgba(0, 212, 255, 0.6);
                backdrop-filter: blur(20px);
            ">
                <h2 style="color: #00d4ff; font-size: 2.2em; margin: 0 0 20px 0; text-shadow: 0 0 25px rgba(0, 212, 255, 0.8);">🎓 最终评估</h2>
                <p style="color: #ffffff; font-size: 1.2em; line-height: 1.6; margin: 0 0 25px 0;">
                    欢迎来到地下室！这里是你能源知识的最终考验。
                </p>
                <div style="background: rgba(0, 40, 80, 0.5); padding: 20px; border-radius: 15px; margin: 20px 0;">
                    <p style="color: #a0c4ff; margin: 0 0 15px 0;">📋 <strong>测试规则：</strong></p>
                    <ul style="color: #ffffff; text-align: left; margin: 0; padding-left: 20px;">
                        <li>共 ${this.totalQuestions} 道题目，涵盖所有学过的知识</li>
                        <li>每题有不同分值，答对得分，答错不扣分</li>
                        <li>可以使用 ${this.maxHints} 次提示，但会扣除部分分数</li>
                        <li>可以跳过难题，但不会得分</li>
                        <li>根据最终表现获得相应评级</li>
                    </ul>
                </div>
                <p style="color: #ffaa00; font-size: 1.1em; font-style: italic; margin: 20px 0;">💡 运用你学到的知识，展示你的能源智慧！</p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: linear-gradient(45deg, #00ff00, #00aa00);
                    border: none;
                    border-radius: 12px;
                    padding: 15px 30px;
                    color: #ffffff;
                    font-size: 1.2em;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">🚀 开始测试</button>
            </div>
        `;
        
        document.body.appendChild(welcomeOverlay);
    }
}

// Initialize Scene 5 Level 4 when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the scene 5 level 4 page
    if (document.getElementById('scene5-level4-container')) {
        window.scene5Level4 = new Scene5Level4();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Scene5Level4;
}