// 确保页面已完全加载
(function() {
    console.log('数学加法消消乐开始加载...');
    
    window.addEventListener('error', function(e) {
        console.error('页面加载错误:', e);
    });
})();

const MathGame = (function() {
    // ==================== 配置和安全设置 ====================
    const CONFIG = {
        SUPABASE_URL: window.__ENV__?.SUPABASE_URL || '',
        SUPABASE_ANON_KEY: window.__ENV__?.SUPABASE_ANON_KEY || '',
        
        MAX_LOGIN_ATTEMPTS: 5,
        RATE_LIMIT_DELAY: 1000,
        SESSION_TIMEOUT: 30 * 60 * 1000,
        
        ADMIN_EMAILS: ['yyssyun90@gmail.com'],
        
        DEFAULT_NUMBER_RANGE: '0-14',
        DEFAULT_QUESTIONS: 30,
        DEFAULT_TIME_LIMIT: 90
    };
    
    // ==================== 多语言支持 ====================
    const translations = {
        zh: {
            gameTitle: "🧮 数学加法消消乐", gameSubtitle: "教学优化版 | 支持云端同步 | 实时排行榜",
            history: "📝 历史记录", statistics: "📊 统计", achievements: "⭐ 成就", wrongBook: "📖 错题本",
            leaderboard: "🏆 排行榜", profile: "👤 个人资料", modeStandard: "📚 标准模式",
            modeStandardDesc: "完成30题，比拼用时", modeChallenge: "⚡ 挑战模式",
            modeChallengeDesc: "90秒时间，比拼题数", modePractice: "🎯 练习模式",
            modePracticeDesc: "无时间限制，专心学习", modeCustom: "⚙️ 自定义",
            modeCustomDesc: "自设参数，灵活练习", numberRange: "数字范围:", rangeEasy: "0-9 (简单)",
            rangeStandard: "0-14 (标准)", rangeChallenge: "5-18 (挑战)", startGame: "🚀 开始游戏",
            startPractice: "🎯 开始练习", questionCount: "题目数量:", timeLimit: "时间限制(秒):",
            scoreLabel: "得分", completedLabel: "完成题数", timeLeft: "剩余时间", timeUsed: "已用时间",
            accuracyLabel: "正确率", targetSum: "目标和:", hintButton: "💡 提示(10秒)",
            refreshButton: "🔄 刷新数字", endGameButton: "⏹️ 结束游戏", user: "用户", logout: "退出",
            loginTitle: "🔐 用户登录", registerTitle: "📝 用户注册", emailLabel: "邮箱地址:",
            emailPlaceholder: "请输入邮箱地址", passwordLabel: "密码:", passwordPlaceholder: "请输入密码",
            usernameLabel: "用户名:", usernamePlaceholder: "请输入用户名（可选）", loginButton: "登录",
            registerButton: "注册", noAccount: "还没有账号？", registerNow: "立即注册",
            hasAccount: "已有账号？", loginNow: "立即登录", historyTitle: "📝 历史记录",
            statisticsTitle: "📊 统计分析", achievementsTitle: "⭐ 成就系统", wrongbookTitle: "📖 错题本",
            leaderboardTitle: "🏆 排行榜", profileTitle: "👤 个人资料", tableNumber: "#",
            tableTarget: "目标", tableNum1: "数字1", tableNum2: "数字2", tableResult: "结果",
            tableTime: "用时(秒)", clearHistory: "清空本次记录", viewAllHistory: "查看所有记录",
            standardBoard: "📚 标准模式", challengeBoard: "⚡ 挑战模式", scoreBoard: "🏆 高分榜",
            accuracyBoard: "🎯 准确率", myHistory: "📊 我的历史", gameCount: "游戏次数",
            highScore: "最高得分", avgAccuracy: "平均正确率", joinDate: "注册时间",
            syncWrongQuestions: "同步错题到云端", clearWrongQuestions: "清空本地错题",
            backupData: "备份数据到云端", restoreData: "从云端恢复数据", finalScore: "最终得分",
            finalCompleted: "完成题数", finalTime: "用时", finalAccuracy: "正确率",
            playerNamePlaceholder: "请输入你的名字", saveScore: "保存成绩", playAgain: "再玩一次",
            viewLeaderboard: "查看排行榜", viewStatistics: "查看统计", loadingStats: "加载统计信息中...",
            languageText: "English", gameComplete: "🎉 恭喜完成30题！", gameTimeout: "⏰ 时间到！",
            gameGiveup: "🏁 游戏结束", gameEnd: "🎉 游戏结束!"
        },
        en: {
            gameTitle: "🧮 Math Addition Match", gameSubtitle: "Educational Edition | Cloud Sync | Real-time Leaderboard",
            history: "📝 History", statistics: "📊 Statistics", achievements: "⭐ Achievements",
            wrongBook: "📖 Wrong Questions", leaderboard: "🏆 Leaderboard", profile: "👤 Profile",
            modeStandard: "📚 Standard Mode", modeStandardDesc: "Complete 30 questions, compete by time",
            modeChallenge: "⚡ Challenge Mode", modeChallengeDesc: "90 seconds, compete by question count",
            modePractice: "🎯 Practice Mode", modePracticeDesc: "No time limit, focus on learning",
            modeCustom: "⚙️ Custom Mode", modeCustomDesc: "Set your own parameters", numberRange: "Number Range:",
            rangeEasy: "0-9 (Easy)", rangeStandard: "0-14 (Standard)", rangeChallenge: "5-18 (Challenge)",
            startGame: "🚀 Start Game", startPractice: "🎯 Start Practice", questionCount: "Questions:",
            timeLimit: "Time Limit (seconds):", scoreLabel: "Score", completedLabel: "Completed",
            timeLeft: "Time Left", timeUsed: "Time Used", accuracyLabel: "Accuracy", targetSum: "Target Sum:",
            hintButton: "💡 Hint (10s)", refreshButton: "🔄 Refresh Numbers", endGameButton: "⏹️ End Game",
            user: "User", logout: "Logout", loginTitle: "🔐 User Login", registerTitle: "📝 User Registration",
            emailLabel: "Email:", emailPlaceholder: "Enter email address", passwordLabel: "Password:",
            passwordPlaceholder: "Enter password", usernameLabel: "Username:",
            usernamePlaceholder: "Enter username (optional)", loginButton: "Login", registerButton: "Register",
            noAccount: "No account?", registerNow: "Register Now", hasAccount: "Already have an account?",
            loginNow: "Login Now", historyTitle: "📝 History Records", statisticsTitle: "📊 Statistics Analysis",
            achievementsTitle: "⭐ Achievement System", wrongbookTitle: "📖 Wrong Questions",
            leaderboardTitle: "🏆 Leaderboard", profileTitle: "👤 Profile", tableNumber: "#",
            tableTarget: "Target", tableNum1: "Num1", tableNum2: "Num2", tableResult: "Result",
            tableTime: "Time(s)", clearHistory: "Clear Current History", viewAllHistory: "View All History",
            standardBoard: "📚 Standard Mode", challengeBoard: "⚡ Challenge Mode", scoreBoard: "🏆 High Score",
            accuracyBoard: "🎯 Accuracy", myHistory: "📊 My History", gameCount: "Games Played",
            highScore: "High Score", avgAccuracy: "Avg Accuracy", joinDate: "Join Date",
            syncWrongQuestions: "Sync Wrong Questions to Cloud", clearWrongQuestions: "Clear Local Wrong Questions",
            backupData: "Backup Data to Cloud", restoreData: "Restore Data from Cloud", finalScore: "Final Score",
            finalCompleted: "Completed", finalTime: "Time Used", finalAccuracy: "Accuracy",
            playerNamePlaceholder: "Enter your name", saveScore: "Save Score", playAgain: "Play Again",
            viewLeaderboard: "View Leaderboard", viewStatistics: "View Statistics",
            loadingStats: "Loading statistics...", languageText: "中文",
            gameComplete: "🎉 Congratulations! Completed 30 questions!", gameTimeout: "⏰ Time's up!",
            gameGiveup: "🏁 Game Over", gameEnd: "🎉 Game Over!"
        }
    };
    
    // ==================== 全局变量 ====================
    let supabase;
    let score = 0;
    let selectedCards = [];
    let timeLeft = 90;
    let timerInterval = null;
    let completedQuestions = 0;
    let correctCount = 0;
    let totalAttempts = 0;
    let startTime = null;
    let currentTarget = 10;
    let currentMode = 'standard';
    let gameActive = false;
    let hintCooldown = 0;
    let hintInterval = null;
    let gameHistory = [];
    let wrongQuestions = [];
    let achievements = new Map();
    let currentUser = null;
    let authMode = 'login';
    let currentLanguage = 'zh';
    
    // ==================== 管理员权限检查 ====================
    async function checkIfAdmin() {
        if (!currentUser) return false;
        
        try {
            // 方式1：检查用户元数据中的角色
            const userRole = currentUser.user_metadata?.role;
            if (userRole === 'admin' || userRole === 'superadmin') {
                console.log('管理员通过元数据角色验证');
                return true;
            }
            
            // 方式2：检查特定邮箱（备用方案）
            const email = currentUser.email?.toLowerCase() || '';
            const isInAdminList = CONFIG.ADMIN_EMAILS.some(adminEmail => 
                adminEmail.toLowerCase() === email
            );
            
            if (isInAdminList) {
                console.log('管理员通过邮箱白名单验证');
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('管理员检查失败:', error);
            return false;
        }
    }
    
    // ==================== 工具函数 ====================
    function setLanguage(lang) {
        try {
            currentLanguage = lang;
            localStorage.setItem('mathGameLanguage', lang);
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (translations[lang] && translations[lang][key]) {
                    if (element.hasAttribute('placeholder')) {
                        element.setAttribute('placeholder', translations[lang][key]);
                    } else {
                        element.textContent = translations[lang][key];
                    }
                }
            });
            const languageText = document.getElementById('language-text');
            if (languageText) {
                languageText.textContent = lang === 'zh' ? 'English' : '中文';
            }
        } catch (error) {
            console.error('设置语言失败:', error);
        }
    }
    
    function showMessage(text, type = 'info', duration = 2000) {
        const message = document.createElement('div');
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#ff4444' : '#2196F3'};
            color: white;
            padding: 12px 24px;
            border-radius: 10px;
            z-index: 3000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(message);
        setTimeout(() => message.remove(), duration);
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // ==================== 游戏配置 ====================
    const MODE_CONFIG = {
        standard: { questions: 30, time: null, hasTimeLimit: false },
        challenge: { questions: null, time: 90, hasTimeLimit: true },
        practice: { questions: null, time: null, hasTimeLimit: false },
        custom: { questions: 20, time: 60, hasTimeLimit: true }
    };
    
    const RANGE_CONFIG = {
        '0-9': { 
            min: 0, 
            max: 9,
            targetMin: 5,
            targetMax: 10
        },
        '0-14': { 
            min: 0, 
            max: 14,
            targetMin: 6,
            targetMax: 14
        },
        '5-18': { 
            min: 5, 
            max: 18,
            targetMin: 8,
            targetMax: 18
        }
    };
    
    // ==================== 核心游戏函数 ====================
    function selectMode(mode) {
        currentMode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        const targetBtn = document.querySelector(`[data-mode="${mode}"]`);
        if (targetBtn) targetBtn.classList.add('active');
        
        const customSettings = document.getElementById('custom-settings');
        if (mode === 'custom') {
            if (customSettings) customSettings.style.display = 'flex';
        } else {
            if (customSettings) customSettings.style.display = 'none';
        }
        
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            if (mode === 'practice') {
                startBtn.innerHTML = `<span data-i18n="startPractice">🎯 开始练习</span>`;
            } else {
                startBtn.innerHTML = `<span data-i18n="startGame">🚀 开始游戏</span>`;
            }
        }
    }
    
    function startGame() {
        if (!currentUser) {
            showAuthModal();
            showMessage(currentLanguage === 'zh' ? '请先登录再开始游戏' : 'Please login to start game', 'info');
            return;
        }
        
        resetGame();
        
        const range = document.getElementById('number-range')?.value || '0-14';
        const modeConfig = { ...MODE_CONFIG[currentMode] };
        
        if (currentMode === 'custom') {
            const questionsInput = document.getElementById('custom-questions');
            const timeInput = document.getElementById('custom-time');
            modeConfig.questions = questionsInput ? parseInt(questionsInput.value) || 20 : 20;
            modeConfig.time = timeInput ? parseInt(timeInput.value) || 60 : 60;
        }
        
        if (modeConfig.hasTimeLimit) {
            timeLeft = modeConfig.time || 90;
        }
        
        // 显示游戏界面
        const gameInfo = document.getElementById('game-info');
        const progressContainer = document.getElementById('progress-container');
        const targetContainer = document.getElementById('target-container');
        const gameControls = document.getElementById('game-controls');
        const modeSelection = document.querySelector('.mode-selection');
        const gameSetting = document.querySelector('.game-setting');
        
        if (gameInfo) gameInfo.style.display = 'grid';
        if (progressContainer) progressContainer.style.display = 'block';
        if (targetContainer) targetContainer.style.display = 'block';
        if (gameControls) gameControls.style.display = 'flex';
        if (modeSelection) modeSelection.style.display = 'none';
        if (gameSetting) gameSetting.style.display = 'none';
        
        // 初始化游戏网格
        const gameGrid = document.getElementById('game-grid');
        if (gameGrid) {
            gameGrid.style.display = 'grid';
            gameGrid.innerHTML = '';
        }
        
        generateNewTarget();
        generateNumberGrid();
        
        startTime = new Date();
        
        if (modeConfig.hasTimeLimit) {
            const timeElement = document.getElementById('time');
            if (timeElement) timeElement.textContent = timeLeft;
            timerInterval = setInterval(updateTimer, 1000);
        } else {
            timerInterval = setInterval(updateElapsedTime, 1000);
        }
        
        hintInterval = setInterval(updateHintCooldown, 1000);
        gameActive = true;
    }
    
    function resetGame() {
        score = 0;
        selectedCards = [];
        completedQuestions = 0;
        correctCount = 0;
        totalAttempts = 0;
        gameHistory = [];
        gameActive = false;
        
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        if (hintInterval) {
            clearInterval(hintInterval);
            hintInterval = null;
        }
        
        const scoreElement = document.getElementById('score');
        const completedElement = document.getElementById('completed');
        const accuracyElement = document.getElementById('accuracy');
        const progressBar = document.getElementById('progress-bar');
        
        if (scoreElement) scoreElement.textContent = '0';
        if (completedElement) completedElement.textContent = '0/30';
        if (accuracyElement) accuracyElement.textContent = '100%';
        if (progressBar) progressBar.style.width = '100%';
        
        const gameGrid = document.getElementById('game-grid');
        if (gameGrid) gameGrid.innerHTML = '';
    }
    
    function generateNumberGrid() {
        const gameGrid = document.getElementById('game-grid');
        if (!gameGrid) return;
        
        const range = document.getElementById('number-range')?.value || '0-14';
        const config = RANGE_CONFIG[range];
        if (!config) return;
        
        gameGrid.innerHTML = '';
        const numbers = [];
        let attempts = 0;
        let hasValidPair = false;
        
        // 确保至少有一对数字可以组成目标和
        while (!hasValidPair && attempts < 50) {
            numbers.length = 0;
            const targetRange = config.targetMax - config.targetMin;
            currentTarget = Math.floor(Math.random() * (targetRange + 1)) + config.targetMin;
            
            const num1 = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
            const num2 = currentTarget - num1;
            
            if (num2 >= config.min && num2 <= config.max) {
                numbers.push(num1, num2);
                hasValidPair = true;
            }
            attempts++;
        }
        
        if (!hasValidPair) {
            numbers.push(
                Math.floor(Math.random() * (config.max - config.min + 1)) + config.min,
                Math.floor(Math.random() * (config.max - config.min + 1)) + config.min
            );
        }
        
        while (numbers.length < 10) {
            numbers.push(Math.floor(Math.random() * (config.max - config.min + 1)) + config.min);
        }
        
        shuffleArray(numbers);
        
        numbers.forEach((number) => {
            const card = document.createElement('div');
            card.className = 'number-card';
            card.textContent = number;
            card.dataset.value = number;
            card.addEventListener('click', () => selectCard(card));
            gameGrid.appendChild(card);
        });
        
        const targetSumElement = document.getElementById('target-sum');
        if (targetSumElement) targetSumElement.textContent = currentTarget;
    }
    
    function hasSolution(numbers, target) {
        for (let i = 0; i < numbers.length; i++) {
            for (let j = i + 1; j < numbers.length; j++) {
                if (numbers[i] + numbers[j] === target) {
                    return true;
                }
            }
        }
        return false;
    }
    
    function selectCard(card) {
        if (!gameActive || card.classList.contains('disappear')) return;
        
        if (card.classList.contains('selected')) {
            card.classList.remove('selected');
            selectedCards = selectedCards.filter(c => c !== card);
            return;
        }
        
        if (selectedCards.length >= 2) {
            showMessage(currentLanguage === 'zh' ? '最多只能选择2张卡片！' : 'You can only select 2 cards at most!', 'error');
            return;
        }
        
        card.classList.add('selected');
        selectedCards.push(card);
        
        if (selectedCards.length === 2) {
            totalAttempts++;
            setTimeout(checkMatch, 300);
        }
    }
    
    function checkMatch() {
        if (selectedCards.length !== 2) return;
        
        const num1 = parseInt(selectedCards[0].dataset.value);
        const num2 = parseInt(selectedCards[1].dataset.value);
        const sum = num1 + num2;
        const isCorrect = sum === currentTarget;
        
        gameHistory.push({
            target: currentTarget,
            num1: num1,
            num2: num2,
            isCorrect: isCorrect,
            timestamp: new Date().toISOString()
        });
        
        if (isCorrect) {
            correctCount++;
            completedQuestions++;
            showFeedback(currentLanguage === 'zh' ? '✓ 正确!' : '✓ Correct!', 'success');
            
            selectedCards.forEach(card => card.classList.add('disappear'));
            setTimeout(() => {
                selectedCards.forEach(card => card.remove());
                const remainingCards = Array.from(document.querySelectorAll('.number-card:not(.disappear)'));
                const remainingNumbers = remainingCards.map(card => parseInt(card.dataset.value));
                if (!hasSolution(remainingNumbers, currentTarget)) {
                    setTimeout(generateNumberGrid, 500);
                }
            }, 500);
            
            score += 10;
            updateDisplay();
            
            if (currentMode === 'standard' && completedQuestions >= MODE_CONFIG.standard.questions) {
                endGame('complete');
                return;
            }
            
            setTimeout(() => {
                generateNewTarget();
                generateNumberGrid();
            }, 800);
        } else {
            showFeedback(currentLanguage === 'zh' ? '✗ 错误' : '✗ Wrong', 'error');
            recordWrongQuestion(num1, num2, currentTarget);
            selectedCards.forEach(card => card.classList.remove('selected'));
        }
        
        selectedCards = [];
    }
    
    function updateTimer() {
        if (!gameActive) return;
        
        timeLeft--;
        if (timeLeft < 0) timeLeft = 0;
        
        const timeElement = document.getElementById('time');
        if (timeElement) timeElement.textContent = timeLeft;
        
        if (timeLeft <= 10) {
            const timeContainer = document.getElementById('time-container');
            if (timeContainer) timeContainer.classList.add('time-warning');
        }
        
        if (timeLeft <= 0) {
            endGame('timeout');
        }
    }
    
    function updateElapsedTime() {
        if (!gameActive || !startTime) return;
        
        const elapsed = Math.floor((new Date() - startTime) / 1000);
        const timeElement = document.getElementById('time');
        if (timeElement) timeElement.textContent = elapsed;
    }
    
    function updateDisplay() {
        const scoreElement = document.getElementById('score');
        const completedElement = document.getElementById('completed');
        const accuracyElement = document.getElementById('accuracy');
        
        if (scoreElement) scoreElement.textContent = score;
        
        if (completedElement) {
            const modeConfig = MODE_CONFIG[currentMode];
            if (modeConfig.questions) {
                completedElement.textContent = `${completedQuestions}/${modeConfig.questions}`;
            } else {
                completedElement.textContent = completedQuestions.toString();
            }
        }
        
        if (accuracyElement) {
            const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;
            accuracyElement.textContent = accuracy + '%';
        }
    }
    
    function generateNewTarget() {
        const range = document.getElementById('number-range')?.value || '0-14';
        const config = RANGE_CONFIG[range];
        if (!config) return;
        
        const targetRange = config.targetMax - config.targetMin;
        currentTarget = Math.floor(Math.random() * (targetRange + 1)) + config.targetMin;
        
        const targetSumElement = document.getElementById('target-sum');
        if (targetSumElement) targetSumElement.textContent = currentTarget;
    }
    
    function endGame(reason) {
        if (!gameActive) return;
        
        gameActive = false;
        
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        if (hintInterval) {
            clearInterval(hintInterval);
            hintInterval = null;
        }
        
        let elapsedTime = 0;
        if (startTime) {
            elapsedTime = Math.floor((new Date() - startTime) / 1000);
        }
        
        const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;
        
        const finalScoreElement = document.getElementById('final-score');
        const finalCompletedElement = document.getElementById('final-completed');
        const finalTimeElement = document.getElementById('final-time');
        const finalAccuracyElement = document.getElementById('final-accuracy');
        const resultTitleElement = document.getElementById('result-title');
        
        if (finalScoreElement) finalScoreElement.textContent = score;
        if (finalCompletedElement) finalCompletedElement.textContent = completedQuestions;
        if (finalTimeElement) finalTimeElement.textContent = elapsedTime + (currentLanguage === 'zh' ? '秒' : 's');
        if (finalAccuracyElement) finalAccuracyElement.textContent = accuracy + '%';
        
        const titleMap = {
            'complete': currentLanguage === 'zh' ? '🎉 恭喜完成30题！' : '🎉 Congratulations! Completed 30 questions!',
            'timeout': currentLanguage === 'zh' ? '⏰ 时间到！' : '⏰ Time\'s up!',
            'giveup': currentLanguage === 'zh' ? '🏁 游戏结束' : '🏁 Game Over'
        };
        
        if (resultTitleElement) {
            resultTitleElement.textContent = titleMap[reason] || (currentLanguage === 'zh' ? '🎉 游戏结束!' : '🎉 Game Over!');
        }
        
        const gameOverElement = document.getElementById('game-over');
        if (gameOverElement) gameOverElement.style.display = 'flex';
    }
    
    function showFeedback(text, type) {
        const feedback = document.getElementById('match-feedback');
        if (!feedback) return;
        
        feedback.textContent = text;
        feedback.style.color = type === 'success' ? '#4CAF50' : '#ff4444';
        feedback.style.opacity = '1';
        setTimeout(() => { feedback.style.opacity = '0'; }, 1000);
    }
    
    function recordWrongQuestion(num1, num2, target) {
        const wrongId = `${Math.min(num1, num2)}_${Math.max(num1, num2)}_${target}`;
        
        const exists = wrongQuestions.some(question => 
            `${Math.min(question.num1, question.num2)}_${Math.max(question.num1, question.num2)}_${question.correctSum}` === wrongId
        );
        
        if (!exists) {
            wrongQuestions.push({
                id: wrongId,
                num1: num1,
                num2: num2,
                wrongSum: num1 + num2,
                correctSum: target,
                timestamp: new Date().toISOString(),
                count: 1
            });
            saveWrongQuestions();
        }
    }
    
    function saveWrongQuestions() {
        try {
            localStorage.setItem('mathGameWrongQuestions', JSON.stringify(wrongQuestions));
        } catch (e) {
            console.error('保存错题失败:', e);
        }
    }
    
    function loadWrongQuestions() {
        try {
            const saved = localStorage.getItem('mathGameWrongQuestions');
            if (saved) {
                wrongQuestions = JSON.parse(saved);
            } else {
                wrongQuestions = [];
            }
        } catch (e) {
            wrongQuestions = [];
        }
    }
    
    function updateHintCooldown() {
        if (hintCooldown > 0) {
            hintCooldown--;
            updateHintButton();
        }
    }
    
    function updateHintButton() {
        const hintBtn = document.getElementById('hint-btn');
        if (!hintBtn) return;
        
        if (hintCooldown > 0) {
            hintBtn.innerHTML = `<span>💡 ${hintCooldown}秒</span>`;
            hintBtn.disabled = true;
            hintBtn.style.opacity = '0.7';
        } else {
            hintBtn.innerHTML = `<span data-i18n="hintButton">💡 提示(10秒)</span>`;
            hintBtn.disabled = false;
            hintBtn.style.opacity = '1';
        }
    }
    
    function showHint() {
        if (hintCooldown > 0) {
            showMessage(currentLanguage === 'zh' ? `提示冷却中，还剩${hintCooldown}秒` : `Hint cooldown, ${hintCooldown}s remaining`, 'info');
            return;
        }
        
        const cards = Array.from(document.querySelectorAll('.number-card:not(.disappear)'));
        const values = cards.map(card => parseInt(card.dataset.value));
        
        for (let i = 0; i < values.length; i++) {
            for (let j = i + 1; j < values.length; j++) {
                if (values[i] + values[j] === currentTarget) {
                    cards[i].style.boxShadow = '0 0 20px #FFD700';
                    cards[j].style.boxShadow = '0 0 20px #FFD700';
                    setTimeout(() => {
                        cards[i].style.boxShadow = '';
                        cards[j].style.boxShadow = '';
                    }, 2000);
                    hintCooldown = 10;
                    updateHintButton();
                    return;
                }
            }
        }
        
        showMessage(currentLanguage === 'zh' ? '没有找到解决方案，自动刷新数字' : 'No solution found, refreshing numbers', 'info');
        refreshNumbers();
    }
    
    function refreshNumbers() {
        const gameGrid = document.getElementById('game-grid');
        if (!gameGrid) return;
        
        gameGrid.style.opacity = '0.5';
        setTimeout(() => {
            generateNumberGrid();
            gameGrid.style.opacity = '1';
        }, 500);
    }
    
    function restartGame() {
        const gameOverElement = document.getElementById('game-over');
        if (gameOverElement) gameOverElement.style.display = 'none';
        
        const modeSelection = document.querySelector('.mode-selection');
        const gameSetting = document.querySelector('.game-setting');
        const gameInfo = document.getElementById('game-info');
        const progressContainer = document.getElementById('progress-container');
        const targetContainer = document.getElementById('target-container');
        const gameControls = document.getElementById('game-controls');
        const gameGrid = document.getElementById('game-grid');
        
        if (modeSelection) modeSelection.style.display = 'grid';
        if (gameSetting) gameSetting.style.display = 'block';
        if (gameInfo) gameInfo.style.display = 'none';
        if (progressContainer) progressContainer.style.display = 'none';
        if (targetContainer) targetContainer.style.display = 'none';
        if (gameControls) gameControls.style.display = 'none';
        if (gameGrid) gameGrid.style.display = 'none';
        
        const playerNameInput = document.getElementById('player-name');
        if (playerNameInput) playerNameInput.value = '';
        
        resetGame();
    }
    
    // ==================== 用户认证 ====================
    async function checkAuth() {
        try {
            if (!supabase) return false;
            
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) throw error;
            
            if (user) {
                currentUser = user;
                updateUserInfo();
                return true;
            }
            return false;
        } catch (error) {
            console.error('检查认证状态失败:', error);
            return false;
        }
    }
    
    async function login(email, password) {
        try {
            if (!supabase) {
                showMessage('系统未初始化', 'error');
                return false;
            }
            
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                const errorElement = document.getElementById('auth-error');
                if (errorElement) errorElement.textContent = error.message;
                return false;
            }
            
            currentUser = data.user;
            updateUserInfo();
            closeAuthModal();
            showMessage(currentLanguage === 'zh' ? '登录成功！' : 'Login successful!', 'success');
            return true;
        } catch (error) {
            console.error('登录失败:', error);
            const errorElement = document.getElementById('auth-error');
            if (errorElement) errorElement.textContent = error.message || '登录失败';
            return false;
        }
    }
    
    async function register(email, password, username) {
        try {
            if (!supabase) {
                showMessage('系统未初始化', 'error');
                return false;
            }
            
            const userMetadata = { 
                username: username || email.split('@')[0]
            };
            
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: userMetadata }
            });
            
            if (error) {
                const errorElement = document.getElementById('auth-error');
                if (errorElement) errorElement.textContent = error.message;
                return false;
            }
            
            currentUser = data.user;
            updateUserInfo();
            closeAuthModal();
            showMessage(currentLanguage === 'zh' ? '注册成功！' : 'Registration successful!', 'success');
            return true;
        } catch (error) {
            console.error('注册失败:', error);
            const errorElement = document.getElementById('auth-error');
            if (errorElement) errorElement.textContent = error.message || '注册失败';
            return false;
        }
    }
    
    async function logout() {
        try {
            if (!supabase) return;
            
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            currentUser = null;
            const userInfo = document.getElementById('user-info');
            if (userInfo) userInfo.style.display = 'none';
            
            const teacherToolsBtn = document.getElementById('teacher-tools-btn');
            const adminToolsBtn = document.getElementById('admin-tools-btn');
            if (teacherToolsBtn) teacherToolsBtn.style.display = 'none';
            if (adminToolsBtn) adminToolsBtn.style.display = 'none';
            
            showMessage(currentLanguage === 'zh' ? '已退出登录' : 'Logged out', 'info');
        } catch (error) {
            console.error('退出失败:', error);
            showMessage((currentLanguage === 'zh' ? '退出失败: ' : 'Logout failed: ') + error.message, 'error');
        }
    }
    
    function updateUserInfo() {
        if (!currentUser) return;
        
        const userInfo = document.getElementById('user-info');
        const userAvatar = document.getElementById('user-avatar');
        const userName = document.getElementById('user-name');
        
        if (!userInfo || !userAvatar || !userName) return;
        
        userInfo.style.display = 'flex';
        const email = currentUser.email || '';
        const firstLetter = email.charAt(0).toUpperCase() || '?';
        userAvatar.textContent = firstLetter;
        
        const username = currentUser.user_metadata?.username || email.split('@')[0];
        userName.textContent = username;
        
        // 异步检查管理员权限
        setTimeout(async () => {
            const isAdmin = await checkIfAdmin();
            const adminToolsBtn = document.getElementById('admin-tools-btn');
            if (adminToolsBtn) {
                adminToolsBtn.style.display = isAdmin ? 'flex' : 'none';
            }
        }, 100);
    }
    
    function showAuthModal() {
        const authModal = document.getElementById('auth-modal');
        if (authModal) authModal.style.display = 'flex';
        updateAuthUI();
    }
    
    function closeAuthModal() {
        const authModal = document.getElementById('auth-modal');
        if (authModal) authModal.style.display = 'none';
        
        const authEmail = document.getElementById('auth-email');
        const authPassword = document.getElementById('auth-password');
        const authUsername = document.getElementById('auth-username');
        const authError = document.getElementById('auth-error');
        
        if (authEmail) authEmail.value = '';
        if (authPassword) authPassword.value = '';
        if (authUsername) authUsername.value = '';
        if (authError) authError.textContent = '';
    }
    
    function updateAuthUI() {
        const isLogin = authMode === 'login';
        const authTitle = document.getElementById('auth-title');
        const authSubmitBtn = document.getElementById('auth-submit-btn');
        const authSwitchText = document.getElementById('auth-switch-text');
        const authSwitchLink = document.getElementById('auth-switch-link');
        const authUsernameGroup = document.getElementById('auth-username-group');
        
        if (authTitle) {
            authTitle.innerHTML = `<span data-i18n="${isLogin ? 'loginTitle' : 'registerTitle'}">${isLogin ? '🔐 用户登录' : '📝 用户注册'}</span>`;
        }
        
        if (authSubmitBtn) {
            authSubmitBtn.innerHTML = `<span data-i18n="${isLogin ? 'loginButton' : 'registerButton'}">${isLogin ? '登录' : '注册'}</span>`;
        }
        
        if (authSwitchText) {
            authSwitchText.textContent = isLogin ? '还没有账号？' : '已有账号？';
        }
        
        if (authSwitchLink) {
            authSwitchLink.innerHTML = `<span data-i18n="${isLogin ? 'registerNow' : 'loginNow'}">${isLogin ? '立即注册' : '立即登录'}</span>`;
        }
        
        if (authUsernameGroup) {
            authUsernameGroup.style.display = isLogin ? 'none' : 'block';
        }
    }
    
    function toggleAuthMode() {
        authMode = authMode === 'login' ? 'register' : 'login';
        updateAuthUI();
    }
    
    async function handleAuth() {
        const emailInput = document.getElementById('auth-email');
        const passwordInput = document.getElementById('auth-password');
        const usernameInput = document.getElementById('auth-username');
        
        if (!emailInput || !passwordInput) return;
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const username = usernameInput ? usernameInput.value.trim() : '';
        
        if (!email || !password) {
            const authError = document.getElementById('auth-error');
            if (authError) authError.textContent = currentLanguage === 'zh' ? '请输入邮箱和密码' : 'Please enter email and password';
            return;
        }
        
        if (authMode === 'login') {
            await login(email, password);
        } else {
            await register(email, password, username);
        }
    }
    
    // ==================== 其他功能 ====================
    function showHistory() {
        const tbody = document.getElementById('history-table-body');
        const historyModal = document.getElementById('history-modal');
        
        if (!tbody || !historyModal) return;
        
        tbody.innerHTML = '';
        
        if (gameHistory.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:20px;">${currentLanguage === 'zh' ? '暂无历史记录' : 'No history records'}</td></tr>`;
        } else {
            gameHistory.forEach((record, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${record.target}</td>
                    <td>${record.num1}</td>
                    <td>${record.num2}</td>
                    <td style="color: ${record.isCorrect ? '#4CAF50' : '#ff4444'}; font-weight: bold;">
                        ${record.isCorrect ? (currentLanguage === 'zh' ? '✓ 正确' : '✓ Correct') : (currentLanguage === 'zh' ? '✗ 错误' : '✗ Wrong')}
                    </td>
                    <td>${new Date(record.timestamp).toLocaleTimeString()}</td>
                `;
                tbody.appendChild(row);
            });
        }
        
        historyModal.style.display = 'flex';
    }
    
    function showStatistics() {
        const statisticsModal = document.getElementById('statistics-modal');
        if (statisticsModal) statisticsModal.style.display = 'flex';
    }
    
    function showWrongBook() {
        loadWrongQuestions();
        const container = document.getElementById('wrong-questions-list');
        const wrongbookModal = document.getElementById('wrongbook-modal');
        
        if (!container || !wrongbookModal) return;
        
        container.innerHTML = '';
        
        if (wrongQuestions.length === 0) {
            container.innerHTML = `<div style="text-align:center;padding:20px;color:#666;">${currentLanguage === 'zh' ? '错题本为空' : 'Wrong questions list is empty'}</div>`;
        } else {
            wrongQuestions.forEach((question) => {
                const item = document.createElement('div');
                item.className = 'wrong-question-item';
                item.innerHTML = `
                    <div>
                        <strong style="color: #333;">${question.num1} + ${question.num2} = ${question.wrongSum}</strong><br>
                        <small style="color: #ff4444;">${currentLanguage === 'zh' ? `错误答案 (应为 ${question.correctSum})` : `Wrong answer (should be ${question.correctSum})`}</small><br>
                        <small style="color: #666;">${currentLanguage === 'zh' ? `错误次数: ${question.count}` : `Errors: ${question.count}`}</small>
                    </div>
                    <div>
                        <small style="color: #666;">${new Date(question.timestamp).toLocaleDateString()}</small>
                    </div>
                `;
                container.appendChild(item);
            });
        }
        
        wrongbookModal.style.display = 'flex';
    }
    
    function showLeaderboard() {
        const leaderboardModal = document.getElementById('leaderboard-modal');
        if (leaderboardModal) leaderboardModal.style.display = 'flex';
    }
    
    function showProfile() {
        if (!currentUser) {
            showMessage(currentLanguage === 'zh' ? '请先登录查看个人资料' : 'Please login to view profile', 'info');
            showAuthModal();
            return;
        }
        
        const profileModal = document.getElementById('profile-modal');
        if (profileModal) profileModal.style.display = 'flex';
    }
    
    async function saveScore() {
        if (!currentUser) {
            showMessage(currentLanguage === 'zh' ? '请先登录保存成绩' : 'Please login to save score', 'error');
            showAuthModal();
            return;
        }
        
        const nameInput = document.getElementById('player-name');
        let playerName = nameInput ? nameInput.value.trim() : '';
        
        if (!playerName) {
            playerName = currentUser.user_metadata?.username || currentUser.email?.split('@')[0] || '匿名玩家';
        }
        
        showMessage(currentLanguage === 'zh' ? '成绩保存功能开发中' : 'Score save feature in development', 'info');
        
        const gameOverElement = document.getElementById('game-over');
        if (gameOverElement) gameOverElement.style.display = 'none';
        
        setTimeout(restartGame, 500);
    }
    
    // ==================== 初始化 ====================
    async function init() {
        console.log('🎮 数学加法消消乐开始初始化...');
        
        // 设置语言
        const savedLang = localStorage.getItem('mathGameLanguage');
        if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
            currentLanguage = savedLang;
        }
        setLanguage(currentLanguage);
        
        // 尝试初始化Supabase
        if (CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY) {
            try {
                supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
                console.log('Supabase初始化成功');
                
                // 检查登录状态
                await checkAuth();
            } catch (error) {
                console.error('Supabase初始化失败:', error);
            }
        } else {
            console.warn('Supabase配置缺失，部分功能将不可用');
        }
        
        // 加载本地数据
        loadWrongQuestions();
        
        // 初始化游戏
        selectMode('standard');
        bindEventListeners();
        
        console.log('🎮 数学加法消消乐初始化完成');
    }
    
    // ==================== 绑定事件监听器 ====================
    function bindEventListeners() {
        // 语言切换
        const languageBtn = document.getElementById('language-btn');
        if (languageBtn) {
            languageBtn.addEventListener('click', () => {
                const newLang = currentLanguage === 'zh' ? 'en' : 'zh';
                setLanguage(newLang);
                showMessage(newLang === 'zh' ? '已切换到中文' : 'Switched to English', 'info');
            });
        }
        
        // 侧边栏按钮
        document.getElementById('history-btn')?.addEventListener('click', showHistory);
        document.getElementById('statistics-btn')?.addEventListener('click', showStatistics);
        document.getElementById('wrongbook-btn')?.addEventListener('click', showWrongBook);
        document.getElementById('leaderboard-btn')?.addEventListener('click', showLeaderboard);
        document.getElementById('profile-btn')?.addEventListener('click', showProfile);
        document.getElementById('logout-btn')?.addEventListener('click', logout);
        
        // 游戏模式选择
        document.getElementById('mode-standard')?.addEventListener('click', () => selectMode('standard'));
        document.getElementById('mode-challenge')?.addEventListener('click', () => selectMode('challenge'));
        document.getElementById('mode-practice')?.addEventListener('click', () => selectMode('practice'));
        document.getElementById('mode-custom')?.addEventListener('click', () => selectMode('custom'));
        
        // 游戏控制按钮
        document.getElementById('start-btn')?.addEventListener('click', startGame);
        document.getElementById('hint-btn')?.addEventListener('click', showHint);
        document.getElementById('refresh-btn')?.addEventListener('click', refreshNumbers);
        document.getElementById('endgame-btn')?.addEventListener('click', () => endGame('giveup'));
        
        // 认证相关
        document.getElementById('close-auth-modal')?.addEventListener('click', closeAuthModal);
        document.getElementById('auth-submit-btn')?.addEventListener('click', handleAuth);
        document.getElementById('auth-switch-link')?.addEventListener('click', toggleAuthMode);
        
        // 关闭弹窗按钮
        document.getElementById('close-history-modal')?.addEventListener('click', () => {
            const modal = document.getElementById('history-modal');
            if (modal) modal.style.display = 'none';
        });
        
        document.getElementById('close-statistics-modal')?.addEventListener('click', () => {
            const modal = document.getElementById('statistics-modal');
            if (modal) modal.style.display = 'none';
        });
        
        document.getElementById('close-wrongbook-modal')?.addEventListener('click', () => {
            const modal = document.getElementById('wrongbook-modal');
            if (modal) modal.style.display = 'none';
        });
        
        document.getElementById('close-leaderboard-modal')?.addEventListener('click', () => {
            const modal = document.getElementById('leaderboard-modal');
            if (modal) modal.style.display = 'none';
        });
        
        document.getElementById('close-profile-modal')?.addEventListener('click', () => {
            const modal = document.getElementById('profile-modal');
            if (modal) modal.style.display = 'none';
        });
        
        document.getElementById('close-game-over')?.addEventListener('click', () => {
            const modal = document.getElementById('game-over');
            if (modal) modal.style.display = 'none';
            restartGame();
        });
        
        // 游戏结束相关
        document.getElementById('save-score-btn')?.addEventListener('click', saveScore);
        document.getElementById('play-again-btn')?.addEventListener('click', restartGame);
        
        // 历史记录相关
        document.getElementById('clear-history-btn')?.addEventListener('click', () => {
            if (confirm(currentLanguage === 'zh' ? '确定要清空本次游戏的历史记录吗？' : 'Are you sure you want to clear the current game history?')) {
                gameHistory = [];
                showHistory();
                showMessage(currentLanguage === 'zh' ? '历史记录已清空' : 'History cleared', 'info');
            }
        });
        
        // 错题本相关
        document.getElementById('clear-wrong-questions-btn')?.addEventListener('click', () => {
            if (confirm(currentLanguage === 'zh' ? '确定要清空本地错题吗？' : 'Are you sure you want to clear local wrong questions?')) {
                wrongQuestions = [];
                saveWrongQuestions();
                showWrongBook();
                showMessage(currentLanguage === 'zh' ? '本地错题已清空' : 'Local wrong questions cleared', 'info');
            }
        });
    }
    
    // ==================== 公共接口 ====================
    return {
        init,
        selectMode,
        startGame,
        showHint,
        refreshNumbers,
        endGame: (reason) => endGame(reason),
        restartGame,
        showHistory,
        showStatistics,
        showWrongBook,
        showProfile,
        logout,
        closeAuthModal,
        handleAuth,
        toggleAuthMode,
        saveScore
    };
})();

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        MathGame.init();
    });
} else {
    MathGame.init();
}
