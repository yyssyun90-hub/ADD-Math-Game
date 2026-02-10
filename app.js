// 确保页面已完全加载
(function() {
    console.log('数学加法消消乐开始加载...');
    
    // 如果已经有加载错误，显示提示
    window.addEventListener('error', function(e) {
        console.error('页面加载错误:', e);
        // 可以在这里添加错误处理
    });
    
    // 主代码从这里开始...
    // 将你之前的代码放在这里
})();

const MathGame = (function() {
    // ==================== 配置和安全设置 ====================
    // 安全配置 - 通过环境变量注入
    const CONFIG = {
        // 从环境变量获取，不要硬编码
        SUPABASE_URL: window.__ENV__?.SUPABASE_URL || '',
        SUPABASE_ANON_KEY: window.__ENV__?.SUPABASE_ANON_KEY || '',
        
        // 安全设置
        MAX_LOGIN_ATTEMPTS: 5,
        RATE_LIMIT_DELAY: 1000,
        SESSION_TIMEOUT: 30 * 60 * 1000, // 30分钟
        
        // 管理员设置
        ADMIN_EMAILS: ['yyssyun90@gmail.com'],
        
        // 游戏设置
        DEFAULT_NUMBER_RANGE: '0-14',
        DEFAULT_QUESTIONS: 30,
        DEFAULT_TIME_LIMIT: 90
    };
    
    // 验证配置
    function validateConfig() {
        const errors = [];
        
        if (!CONFIG.SUPABASE_URL) errors.push('SUPABASE_URL 未配置');
        if (!CONFIG.SUPABASE_ANON_KEY) errors.push('SUPABASE_ANON_KEY 未配置');
        
        if (errors.length > 0) {
            console.error('配置错误:', errors);
            showMessage('系统配置错误，请联系管理员', 'error');
            return false;
        }
        
        return true;
    }
    
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
            gameGiveup: "🏁 游戏结束", gameEnd: "🎉 游戏结束!", 
            securityWarning: "安全警告", invalidInput: "输入无效",
            networkError: "网络错误，请检查连接", serverError: "服务器错误",
            rateLimitExceeded: "操作太频繁，请稍后再试", sessionExpired: "会话已过期，请重新登录",
            unauthorized: "未授权访问", configError: "系统配置错误"
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
            gameGiveup: "🏁 Game Over", gameEnd: "🎉 Game Over!",
            securityWarning: "Security Warning", invalidInput: "Invalid input",
            networkError: "Network error, please check connection", serverError: "Server error",
            rateLimitExceeded: "Rate limit exceeded, please try again later", sessionExpired: "Session expired, please login again",
            unauthorized: "Unauthorized access", configError: "System configuration error"
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
    
    // 安全相关变量
    let loginAttempts = 0;
    let lastApiCallTime = 0;
    let rateLimitQueue = [];
    let sessionTimer = null;
    
    // 并发控制
    let isSavingScore = false;
    let isSyncing = false;
    let isBatchRegistering = false;
    
    // 游戏状态管理
    let gameState = {
        lastGameElapsedTime: 0,
        modeConfigTime: 90,
        originalTimeLimit: 90
    };
    
    // 成就进度跟踪
    let achievementProgress = {};
    
    // 游戏配置
    const MODE_CONFIG = {
        standard: { questions: 30, time: null, hasTimeLimit: false },
        challenge: { questions: null, time: 90, hasTimeLimit: true },
        practice: { questions: null, time: null, hasTimeLimit: false },
        custom: { questions: 20, time: 60, hasTimeLimit: true }
    };
    
    // 数字范围配置
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
    
    // 成就定义
    const ACHIEVEMENTS = [
        { 
            id: 'first_win', 
            name: { zh: '首战告捷', en: 'First Victory' }, 
            desc: { zh: '完成第一局游戏', en: 'Complete first game' }, 
            icon: '🥇', 
            condition: () => achievementProgress.first_win >= 1,
            progressCondition: () => achievementProgress.first_win,
            maxProgress: 1
        },
        { 
            id: 'fast_5', 
            name: { zh: '速度之星', en: 'Speed Star' }, 
            desc: { zh: '5秒内完成一题', en: 'Complete a question within 5 seconds' }, 
            icon: '⚡', 
            condition: () => achievementProgress.fast_5 >= 1,
            progressCondition: () => achievementProgress.fast_5,
            maxProgress: 1
        },
        { 
            id: 'accuracy_90', 
            name: { zh: '准确大师', en: 'Accuracy Master' }, 
            desc: { zh: '正确率达到90%', en: 'Achieve 90% accuracy' }, 
            icon: '🎯', 
            condition: () => totalAttempts > 0 && (correctCount / totalAttempts) >= 0.9,
            progressCondition: () => totalAttempts > 0 ? (correctCount / totalAttempts) * 100 : 0,
            maxProgress: 90
        },
        { 
            id: 'complete_30', 
            name: { zh: '完成挑战', en: 'Challenge Complete' }, 
            desc: { zh: '完成30题模式', en: 'Complete 30-question mode' }, 
            icon: '🏆', 
            condition: () => currentMode === 'standard' && completedQuestions >= 30,
            progressCondition: () => completedQuestions,
            maxProgress: 30
        },
        { 
            id: 'cloud_user', 
            name: { zh: '云端玩家', en: 'Cloud Player' }, 
            desc: { zh: '登录云端账户', en: 'Login to cloud account' }, 
            icon: '☁️', 
            condition: () => !!currentUser,
            progressCondition: () => currentUser ? 100 : 0,
            maxProgress: 100
        },
        { 
            id: 'score_100', 
            name: { zh: '百分达人', en: 'Centurion' }, 
            desc: { zh: '单局得分达到100分', en: 'Score 100 points in one game' }, 
            icon: '💯', 
            condition: () => score >= 100,
            progressCondition: () => score,
            maxProgress: 100
        },
        { 
            id: 'time_master', 
            name: { zh: '时间管理', en: 'Time Master' }, 
            desc: { zh: '在挑战模式下完成20题', en: 'Complete 20 questions in challenge mode' }, 
            icon: '⏱️', 
            condition: () => currentMode === 'challenge' && completedQuestions >= 20,
            progressCondition: () => completedQuestions,
            maxProgress: 20
        },
        { 
            id: 'practice_master', 
            name: { zh: '练习达人', en: 'Practice Master' }, 
            desc: { zh: '练习模式完成50题', en: 'Complete 50 questions in practice mode' }, 
            icon: '📚', 
            condition: () => currentMode === 'practice' && completedQuestions >= 50,
            progressCondition: () => completedQuestions,
            maxProgress: 50
        }
    ];
    
    // ==================== 安全工具函数 ====================
    
    // 安全API调用包装器
    async function safeApiCall(apiFunction, errorMessage, options = {}) {
        const { retryCount = 0, timeout = 10000 } = options;
        
        // 速率限制检查
        if (!checkRateLimit()) {
            throw new Error('rate_limit_exceeded');
        }
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            
            const result = await apiFunction();
            
            clearTimeout(timeoutId);
            return result;
            
        } catch (error) {
            console.error(`API调用失败: ${errorMessage}`, error);
            
            // 根据错误类型处理
            if (error.name === 'AbortError') {
                throw new Error('request_timeout');
            } else if (error.message === 'rate_limit_exceeded') {
                throw new Error('rate_limit_exceeded');
            } else if (error.message?.includes('网络错误') || !navigator.onLine) {
                throw new Error('network_error');
            } else if (error.message?.includes('401') || error.message?.includes('未授权')) {
                throw new Error('unauthorized');
            } else {
                throw new Error(error.message || 'unknown_error');
            }
        }
    }
    
    // 速率限制检查
    function checkRateLimit() {
        const now = Date.now();
        const timeWindow = 60000; // 1分钟
        
        // 清理旧记录
        rateLimitQueue = rateLimitQueue.filter(time => now - time < timeWindow);
        
        // 检查是否超过限制（每分钟30次）
        if (rateLimitQueue.length >= 30) {
            return false;
        }
        
        rateLimitQueue.push(now);
        return true;
    }
    
    // 输入消毒和验证
    function sanitizeInput(input, maxLength = 100, allowedPattern = null) {
        if (input === null || input === undefined) return '';
        
        let sanitized = String(input)
            .substring(0, maxLength)
            .replace(/[<>'"`\\]/g, '')
            .trim();
        
        if (allowedPattern && !allowedPattern.test(sanitized)) {
            return '';
        }
        
        return sanitized;
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validatePassword(password) {
        // 密码至少6位，包含字母和数字
        return password.length >= 6 && /[a-zA-Z]/.test(password) && /\d/.test(password);
    }
    
    // 会话管理
    function startSessionTimer() {
        if (sessionTimer) clearTimeout(sessionTimer);
        
        sessionTimer = setTimeout(() => {
            if (currentUser) {
                showMessage(currentLanguage === 'zh' ? '会话已过期，请重新登录' : 'Session expired, please login again', 'info');
                logout();
            }
        }, CONFIG.SESSION_TIMEOUT);
    }
    
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
            
            // 方式3：检查数据库中的管理员表（如果有）
            // 注意：这里需要你创建对应的数据库表
            try {
                const { data, error } = await supabase
                    .from('admin_users')
                    .select('user_id')
                    .eq('user_id', currentUser.id)
                    .single();
                
                if (!error && data) {
                    console.log('管理员通过数据库验证');
                    return true;
                }
            } catch (dbError) {
                // 表可能不存在，忽略错误
                console.log('管理员表不存在或查询失败，继续其他验证方式');
            }
            
            return false;
            
        } catch (error) {
            console.error('管理员检查失败:', error);
            return false;
        }
    }
    
    // ==================== 消息显示函数 ====================
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
    
    // 显示安全警告
    function showSecurityWarning(message) {
        console.warn('安全警告:', message);
        
        if (currentUser && (await checkIfAdmin())) {
            // 管理员可以看到详细警告
            showMessage(`${currentLanguage === 'zh' ? '安全警告: ' : 'Security Warning: '}${message}`, 'error', 5000);
        } else {
            // 普通用户显示通用消息
            showMessage(currentLanguage === 'zh' ? '操作遇到安全限制' : 'Operation restricted for security', 'error', 3000);
        }
    }
    
    // ==================== 初始化Supabase ====================
    async function initSupabase() {
        try {
            if (!validateConfig()) {
                throw new Error('配置验证失败');
            }
            
            // 创建Supabase客户端
            supabase = window.supabase.createClient(
                CONFIG.SUPABASE_URL,
                CONFIG.SUPABASE_ANON_KEY,
                {
                    auth: {
                        autoRefreshToken: true,
                        persistSession: true,
                        detectSessionInUrl: true
                    },
                    global: {
                        headers: {
                            'X-Client-Info': 'math-game-web'
                        }
                    }
                }
            );
            
            console.log('Supabase客户端初始化成功');
            return true;
            
        } catch (error) {
            console.error('Supabase初始化失败:', error);
            showMessage(currentLanguage === 'zh' ? '系统初始化失败，请联系管理员' : 'System initialization failed, please contact administrator', 'error');
            return false;
        }
    }
    
    // ==================== 核心游戏函数 ====================
    // 注：核心游戏逻辑保持不变，但添加了错误处理
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    function generateNumberGrid() {
        try {
            const gameGrid = document.getElementById('game-grid');
            const range = document.getElementById('number-range').value;
            const config = RANGE_CONFIG[range];
            
            if (!config) {
                throw new Error('无效的数字范围配置');
            }
            
            gameGrid.innerHTML = '';
            const numbers = [];
            let attempts = 0;
            let hasValidPair = false;
            
            // 确保至少有一对数字可以组成目标和
            while (!hasValidPair && attempts < 50) {
                numbers.length = 0;
                
                // 根据范围生成目标和
                const targetRange = config.targetMax - config.targetMin;
                currentTarget = Math.floor(Math.random() * (targetRange + 1)) + config.targetMin;
                
                // 创建一对有效的数字
                const num1 = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
                const num2 = currentTarget - num1;
                
                if (num2 >= config.min && num2 <= config.max) {
                    numbers.push(num1, num2);
                    hasValidPair = true;
                }
                attempts++;
            }
            
            // 如果没有找到有效对，随机生成两个数字
            if (!hasValidPair) {
                numbers.push(
                    Math.floor(Math.random() * (config.max - config.min + 1)) + config.min,
                    Math.floor(Math.random() * (config.max - config.min + 1)) + config.min
                );
            }
            
            // 填充剩余的8个数字
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
            
            // 更新目标和显示
            document.getElementById('target-sum').textContent = currentTarget;
            
            // 检查是否有解决方案，如果没有，强制添加一对有效数字
            if (!hasSolution(numbers, currentTarget)) {
                const cards = document.querySelectorAll('.number-card');
                const indices = [];
                while (indices.length < 2) {
                    const idx = Math.floor(Math.random() * cards.length);
                    if (!indices.includes(idx)) indices.push(idx);
                }
                
                // 生成一对有效数字
                const num1 = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
                const num2 = currentTarget - num1;
                
                if (num2 >= config.min && num2 <= config.max) {
                    cards[indices[0]].textContent = num1;
                    cards[indices[0]].dataset.value = num1;
                    cards[indices[1]].textContent = num2;
                    cards[indices[1]].dataset.value = num2;
                }
            }
            
        } catch (error) {
            console.error('生成数字网格失败:', error);
            showMessage(currentLanguage === 'zh' ? '游戏初始化失败' : 'Game initialization failed', 'error');
        }
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
    
    function selectMode(mode) {
        try {
            currentMode = mode;
            document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
            const targetBtn = document.querySelector(`[data-mode="${mode}"]`);
            
            if (targetBtn) {
                targetBtn.classList.add('active');
            }
            
            const customSettings = document.getElementById('custom-settings');
            if (mode === 'custom') {
                customSettings.style.display = 'flex';
            } else {
                customSettings.style.display = 'none';
            }
            
            const startBtn = document.getElementById('start-btn');
            if (mode === 'practice') {
                startBtn.innerHTML = `<span data-i18n="startPractice">🎯 开始练习</span>`;
            } else {
                startBtn.innerHTML = `<span data-i18n="startGame">🚀 开始游戏</span>`;
            }
            
            if (translations[currentLanguage]) {
                const textKey = mode === 'practice' ? 'startPractice' : 'startGame';
                if (translations[currentLanguage][textKey]) {
                    const span = startBtn.querySelector('span');
                    if (span) span.textContent = translations[currentLanguage][textKey];
                }
            }
            
        } catch (error) {
            console.error('选择模式失败:', error);
        }
    }
    
    async function startGame() {
        try {
            if (!currentUser) {
                showAuthModal();
                showMessage(currentLanguage === 'zh' ? '请先登录再开始游戏' : 'Please login to start game', 'info');
                return;
            }
            
            resetGame();
            
            const range = document.getElementById('number-range').value;
            if (!RANGE_CONFIG[range]) {
                throw new Error('无效的数字范围');
            }
            
            const modeConfig = { ...MODE_CONFIG[currentMode] };
            
            if (currentMode === 'custom') {
                const questions = parseInt(document.getElementById('custom-questions').value) || 20;
                const time = parseInt(document.getElementById('custom-time').value) || 60;
                
                if (questions < 1 || questions > 100) {
                    throw new Error('题目数量必须在1-100之间');
                }
                if (time < 1 || time > 600) {
                    throw new Error('时间限制必须在1-600秒之间');
                }
                
                modeConfig.questions = questions;
                modeConfig.time = time;
            }
            
            if (modeConfig.hasTimeLimit) {
                timeLeft = modeConfig.time || 90;
            }
            
            gameState.modeConfigTime = modeConfig.time || 0;
            gameState.originalTimeLimit = timeLeft;
            
            document.getElementById('game-info').style.display = 'grid';
            document.getElementById('progress-container').style.display = 'block';
            document.getElementById('target-container').style.display = 'block';
            document.getElementById('game-controls').style.display = 'flex';
            document.querySelector('.mode-selection').style.display = 'none';
            document.querySelector('.game-setting').style.display = 'none';
            
            const gameGrid = document.getElementById('game-grid');
            gameGrid.style.display = 'grid';
            gameGrid.innerHTML = '';
            
            generateNewTarget();
            generateNumberGrid();
            
            startTime = new Date();
            gameState.lastGameElapsedTime = 0;
            
            const timeContainer = document.getElementById('time-container');
            if (modeConfig.hasTimeLimit) {
                document.getElementById('time').textContent = timeLeft;
                timerInterval = setInterval(updateTimer, 1000);
            } else {
                timerInterval = setInterval(updateElapsedTime, 1000);
            }
            
            hintInterval = setInterval(updateHintCooldown, 1000);
            gameActive = true;
            
            console.log('游戏开始:', { mode: currentMode, timeLeft: timeLeft, startTime: startTime });
            
        } catch (error) {
            console.error('开始游戏失败:', error);
            showMessage(
                currentLanguage === 'zh' ? '游戏启动失败: ' : 'Failed to start game: ' + error.message, 
                'error'
            );
        }
    }
    
    function resetGame() {
        try {
            score = 0;
            selectedCards = [];
            completedQuestions = 0;
            correctCount = 0;
            totalAttempts = 0;
            gameHistory = [];
            gameActive = false;
            
            if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
            if (hintInterval) { clearInterval(hintInterval); hintInterval = null; }
            
            document.getElementById('score').textContent = '0';
            const modeConfig = MODE_CONFIG[currentMode];
            const questionCount = modeConfig.questions || '∞';
            document.getElementById('completed').textContent = `0/${questionCount}`;
            document.getElementById('accuracy').textContent = '100%';
            document.getElementById('progress-bar').style.width = '100%';
            
            document.getElementById('game-grid').innerHTML = '';
            gameState.lastGameElapsedTime = 0;
            
        } catch (error) {
            console.error('重置游戏失败:', error);
        }
    }
    
    function generateNewTarget() {
        try {
            const range = document.getElementById('number-range').value;
            const config = RANGE_CONFIG[range];
            
            if (!config) {
                throw new Error('无效的数字范围');
            }
            
            // 根据范围生成新的目标和
            const targetRange = config.targetMax - config.targetMin;
            currentTarget = Math.floor(Math.random() * (targetRange + 1)) + config.targetMin;
            document.getElementById('target-sum').textContent = currentTarget;
            
        } catch (error) {
            console.error('生成目标失败:', error);
            currentTarget = 10; // 默认值
            document.getElementById('target-sum').textContent = currentTarget;
        }
    }
    
    function selectCard(card) {
        if (!gameActive || card.classList.contains('disappear')) return;
        
        try {
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
            
        } catch (error) {
            console.error('选择卡片失败:', error);
            selectedCards = [];
            document.querySelectorAll('.number-card.selected').forEach(card => {
                card.classList.remove('selected');
            });
        }
    }
    
    function checkMatch() {
        try {
            const startCheckTime = new Date();
            const num1 = parseInt(selectedCards[0].dataset.value);
            const num2 = parseInt(selectedCards[1].dataset.value);
            const sum = num1 + num2;
            const isCorrect = sum === currentTarget;
            const responseTime = (new Date() - startCheckTime) / 1000;
            
            // 验证输入
            if (isNaN(num1) || isNaN(num2)) {
                throw new Error('无效的数字');
            }
            
            gameHistory.push({
                target: currentTarget,
                num1: num1,
                num2: num2,
                isCorrect: isCorrect,
                time: responseTime,
                timestamp: new Date().toISOString()
            });
            
            // 更新成就进度
            if (isCorrect) {
                if (responseTime < 5 && !achievementProgress.fast_5) {
                    achievementProgress.fast_5 = 1;
                }
                
                if (!achievementProgress.first_win) {
                    achievementProgress.first_win = 1;
                }
            }
            
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
                if (responseTime < 3) score += 5;
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
            
            // 检查并触发成就解锁
            checkAndTriggerAchievements();
            
        } catch (error) {
            console.error('检查匹配失败:', error);
            selectedCards.forEach(card => card.classList.remove('selected'));
            selectedCards = [];
        }
    }
    
    function updateTimer() {
        if (!gameActive || !timerInterval) return;
        
        try {
            const modeConfig = MODE_CONFIG[currentMode];
            
            if (modeConfig.hasTimeLimit) {
                timeLeft--;
                if (timeLeft < 0) timeLeft = 0;
                
                document.getElementById('time').textContent = timeLeft;
                
                if (modeConfig.time) {
                    const progress = (timeLeft / modeConfig.time) * 100;
                    document.getElementById('progress-bar').style.width = `${progress}%`;
                }
                
                if (timeLeft <= 10) {
                    document.getElementById('time-container').classList.add('time-warning');
                }
                
                if (timeLeft <= 0) {
                    endGame('timeout');
                }
            } else {
                updateElapsedTime();
            }
            
        } catch (error) {
            console.error('更新计时器失败:', error);
        }
    }
    
    function updateElapsedTime() {
        if (!gameActive) return;
        
        try {
            const elapsed = Math.floor((new Date() - startTime) / 1000);
            document.getElementById('time').textContent = elapsed;
            
            if (currentMode === 'standard') {
                const progress = (completedQuestions / MODE_CONFIG.standard.questions) * 100;
                document.getElementById('progress-bar').style.width = `${progress}%`;
            }
            
        } catch (error) {
            console.error('更新用时失败:', error);
        }
    }
    
    function updateDisplay() {
        try {
            document.getElementById('score').textContent = score;
            const modeConfig = MODE_CONFIG[currentMode];
            if (modeConfig.questions) {
                document.getElementById('completed').textContent = `${completedQuestions}/${modeConfig.questions}`;
            } else {
                document.getElementById('completed').textContent = completedQuestions;
            }
            const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;
            document.getElementById('accuracy').textContent = accuracy + '%';
            
        } catch (error) {
            console.error('更新显示失败:', error);
        }
    }
    
    function endGame(reason) {
        try {
            if (!gameActive) return;
            
            gameActive = false;
            
            if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
            if (hintInterval) { clearInterval(hintInterval); hintInterval = null; }
            
            const elapsedTime = calculateElapsedTime(reason);
            gameState.lastGameElapsedTime = elapsedTime;
            
            const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;
            
            document.getElementById('final-score').textContent = score;
            document.getElementById('final-completed').textContent = completedQuestions;
            document.getElementById('final-time').textContent = elapsedTime + (currentLanguage === 'zh' ? '秒' : 's');
            document.getElementById('final-accuracy').textContent = accuracy + '%';
            
            const titleMap = {
                'complete': currentLanguage === 'zh' ? '🎉 恭喜完成30题！' : '🎉 Congratulations! Completed 30 questions!',
                'timeout': currentLanguage === 'zh' ? '⏰ 时间到！' : '⏰ Time\'s up!',
                'giveup': currentLanguage === 'zh' ? '🏁 游戏结束' : '🏁 Game Over'
            };
            document.getElementById('result-title').textContent = titleMap[reason] || 
                (currentLanguage === 'zh' ? '🎉 游戏结束!' : '🎉 Game Over!');
            
            document.getElementById('game-over').style.display = 'flex';
            updateAchievements();
            
            console.log('游戏结束:', {
                reason: reason,
                mode: currentMode,
                elapsedTime: elapsedTime,
                completed: completedQuestions,
                accuracy: accuracy
            });
            
        } catch (error) {
            console.error('结束游戏失败:', error);
            document.getElementById('game-over').style.display = 'flex';
            document.getElementById('result-title').textContent = currentLanguage === 'zh' ? '游戏异常结束' : 'Game ended abnormally';
        }
    }
    
    function restartGame() {
        try {
            document.getElementById('game-over').style.display = 'none';
            document.querySelector('.mode-selection').style.display = 'grid';
            document.querySelector('.game-setting').style.display = 'block';
            document.getElementById('game-info').style.display = 'none';
            document.getElementById('progress-container').style.display = 'none';
            document.getElementById('target-container').style.display = 'none';
            document.getElementById('game-controls').style.display = 'none';
            document.getElementById('game-grid').style.display = 'none';
            document.getElementById('player-name').value = '';
            resetGame();
            
        } catch (error) {
            console.error('重新开始游戏失败:', error);
            location.reload(); // 如果失败，刷新页面
        }
    }
    
    function calculateElapsedTime(reason) {
        if (!startTime) return 0;
        
        try {
            let elapsedTime = 0;
            const modeConfig = MODE_CONFIG[currentMode];
            
            if (currentMode === 'challenge') {
                const challengeTime = modeConfig.time; // 90秒
                
                if (reason === 'timeout') {
                    elapsedTime = challengeTime;
                } else if (reason === 'giveup') {
                    const actualElapsed = Math.floor((new Date() - startTime) / 1000);
                    elapsedTime = Math.min(actualElapsed, challengeTime);
                    
                    if (timeLeft >= 0) {
                        const calculatedElapsed = challengeTime - timeLeft;
                        elapsedTime = Math.min(calculatedElapsed, challengeTime);
                    }
                } else {
                    const actualElapsed = Math.floor((new Date() - startTime) / 1000);
                    elapsedTime = Math.min(actualElapsed, challengeTime);
                }
                
                elapsedTime = Math.min(elapsedTime, challengeTime);
            } else {
                elapsedTime = Math.floor((new Date() - startTime) / 1000);
            }
            
            return elapsedTime;
            
        } catch (error) {
            console.error('计算用时失败:', error);
            return 0;
        }
    }
    
    // ==================== 用户认证系统 ====================
    async function checkAuth() {
        try {
            const { data: { user }, error } = await safeApiCall(
                () => supabase.auth.getUser(),
                '获取用户信息失败'
            );
            
            if (user) {
                currentUser = user;
                updateUserInfo();
                await loadWrongQuestionsFromCloud();
                startSessionTimer();
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
            // 安全检查
            if (loginAttempts >= CONFIG.MAX_LOGIN_ATTEMPTS) {
                showSecurityWarning(currentLanguage === 'zh' ? '登录尝试次数过多' : 'Too many login attempts');
                return false;
            }
            
            if (!validateEmail(email)) {
                document.getElementById('auth-error').textContent = 
                    currentLanguage === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email address';
                loginAttempts++;
                return false;
            }
            
            const { data, error } = await safeApiCall(
                () => supabase.auth.signInWithPassword({ email, password }),
                '登录失败'
            );
            
            if (error) {
                document.getElementById('auth-error').textContent = error.message;
                loginAttempts++;
                return false;
            }
            
            currentUser = data.user;
            updateUserInfo();
            closeAuthModal();
            showMessage(currentLanguage === 'zh' ? '登录成功！' : 'Login successful!', 'success');
            
            loginAttempts = 0; // 重置登录尝试次数
            await loadWrongQuestionsFromCloud();
            startSessionTimer();
            return true;
            
        } catch (error) {
            console.error('登录失败:', error);
            loginAttempts++;
            
            const errorMessage = error.message || 'unknown_error';
            let displayMessage = '';
            
            switch(errorMessage) {
                case 'rate_limit_exceeded':
                    displayMessage = currentLanguage === 'zh' ? '操作太频繁，请稍后再试' : 'Rate limit exceeded, please try again later';
                    break;
                case 'network_error':
                    displayMessage = currentLanguage === 'zh' ? '网络错误，请检查连接' : 'Network error, please check connection';
                    break;
                case 'request_timeout':
                    displayMessage = currentLanguage === 'zh' ? '请求超时，请稍后再试' : 'Request timeout, please try again later';
                    break;
                default:
                    displayMessage = error.message || (currentLanguage === 'zh' ? '登录失败' : 'Login failed');
            }
            
            document.getElementById('auth-error').textContent = displayMessage;
            return false;
        }
    }
    
    async function register(email, password, username, role = 'student', school = '', state = '') {
        try {
            // 安全检查
            if (!validateEmail(email)) {
                document.getElementById('auth-error').textContent = 
                    currentLanguage === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email address';
                return false;
            }
            
            if (!validatePassword(password)) {
                document.getElementById('auth-error').textContent = 
                    currentLanguage === 'zh' ? '密码至少6位，必须包含字母和数字' : 'Password must be at least 6 characters with letters and numbers';
                return false;
            }
            
            if (role === 'teacher' && (!school || !state)) {
                document.getElementById('auth-error').textContent = 
                    currentLanguage === 'zh' ? '请填写学校名称和所在州属' : 'Please fill in school name and state';
                return false;
            }
            
            const sanitizedUsername = sanitizeInput(username, 50, /^[a-zA-Z0-9\u4e00-\u9fa5\s]+$/);
            const sanitizedSchool = sanitizeInput(school, 100);
            const sanitizedState = sanitizeInput(state, 50);
            
            const userMetadata = { 
                username: sanitizedUsername || email.split('@')[0],
                role: role 
            };
            
            if (role === 'teacher') {
                userMetadata.school = sanitizedSchool;
                userMetadata.state = sanitizedState;
                userMetadata.approved = false; // 需要审核
                userMetadata.registered_at = new Date().toISOString();
            }
            
            const { data, error } = await safeApiCall(
                () => supabase.auth.signUp({
                    email,
                    password,
                    options: { data: userMetadata }
                }),
                '注册失败'
            );
            
            if (error) {
                document.getElementById('auth-error').textContent = error.message;
                return false;
            }
            
            currentUser = data.user;
            updateUserInfo();
            closeAuthModal();
            
            if (role === 'teacher') {
                showMessage(currentLanguage === 'zh' ? '教师注册申请已提交，等待审核' : 'Teacher registration submitted, awaiting approval', 'success');
            } else {
                showMessage(currentLanguage === 'zh' ? '注册成功！请查看邮箱验证邮件。' : 'Registration successful! Please check your email for verification.', 'success');
            }
            
            startSessionTimer();
            return true;
            
        } catch (error) {
            console.error('注册失败:', error);
            
            const errorMessage = error.message || 'unknown_error';
            let displayMessage = '';
            
            switch(errorMessage) {
                case 'rate_limit_exceeded':
                    displayMessage = currentLanguage === 'zh' ? '注册操作太频繁' : 'Registration rate limit exceeded';
                    break;
                default:
                    displayMessage = error.message || (currentLanguage === 'zh' ? '注册失败' : 'Registration failed');
            }
            
            document.getElementById('auth-error').textContent = displayMessage;
            return false;
        }
    }
    
    async function logout() {
        try {
            const { error } = await safeApiCall(
                () => supabase.auth.signOut(),
                '退出登录失败'
            );
            
            if (error) {
                showMessage((currentLanguage === 'zh' ? '退出失败: ' : 'Logout failed: ') + error.message, 'error');
                return;
            }
            
            currentUser = null;
            document.getElementById('user-info').style.display = 'none';
            document.getElementById('teacher-tools-btn').style.display = 'none';
            document.getElementById('admin-tools-btn').style.display = 'none';
            
            if (sessionTimer) {
                clearTimeout(sessionTimer);
                sessionTimer = null;
            }
            
            showMessage(currentLanguage === 'zh' ? '已退出登录' : 'Logged out', 'info');
            
        } catch (error) {
            console.error('退出失败:', error);
            showMessage((currentLanguage === 'zh' ? '退出失败: ' : 'Logout failed: ') + error.message, 'error');
        }
    }
    
    function updateUserInfo() {
        if (!currentUser) return;
        
        try {
            document.getElementById('user-info').style.display = 'flex';
            const userAvatar = document.getElementById('user-avatar');
            const userName = document.getElementById('user-name');
            const email = currentUser.email || '';
            const firstLetter = email.charAt(0).toUpperCase() || '?';
            userAvatar.textContent = firstLetter;
            const username = currentUser.user_metadata?.username || email.split('@')[0];
            userName.textContent = username;
            
            const userRole = currentUser.user_metadata?.role;
            const isApprovedTeacher = userRole === 'teacher' && currentUser.user_metadata?.approved === true;
            
            if (isApprovedTeacher) {
                document.getElementById('teacher-tools-btn').style.display = 'flex';
            } else {
                document.getElementById('teacher-tools-btn').style.display = 'none';
            }
            
            // 异步检查管理员权限
            setTimeout(async () => {
                const isAdmin = await checkIfAdmin();
                if (isAdmin) {
                    document.getElementById('admin-tools-btn').style.display = 'flex';
                } else {
                    document.getElementById('admin-tools-btn').style.display = 'none';
                }
            }, 100);
            
        } catch (error) {
            console.error('更新用户信息失败:', error);
        }
    }
    
    // ==================== 成就系统 ====================
    function checkAndTriggerAchievements() {
        try {
            const previousAchievements = new Map(achievements);
            
            ACHIEVEMENTS.forEach(ach => {
                const achieved = ach.condition();
                const wasAchieved = achievements.get(ach.id) || false;
                
                if (achieved && !wasAchieved) {
                    achievements.set(ach.id, true);
                    showAchievementUnlock(ach);
                }
            });
            
            // 保存成就状态
            if (achievements.size !== previousAchievements.size || 
                Array.from(achievements.entries()).some(([key, value]) => previousAchievements.get(key) !== value)) {
                saveAchievements();
            }
            
        } catch (error) {
            console.error('检查成就失败:', error);
        }
    }
    
    function updateAchievements() {
        try {
            ACHIEVEMENTS.forEach(ach => {
                const achieved = ach.condition();
                achievements.set(ach.id, achieved);
            });
            saveAchievements();
            
        } catch (error) {
            console.error('更新成就失败:', error);
        }
    }
    
    function saveAchievements() {
        try {
            const achievementsData = {};
            achievements.forEach((value, key) => {
                achievementsData[key] = value;
            });
            localStorage.setItem('mathGameAchievements', JSON.stringify(achievementsData));
            localStorage.setItem('mathGameAchievementProgress', JSON.stringify(achievementProgress));
        } catch (e) {
            console.error('保存成就失败:', e);
        }
    }
    
    function loadAchievements() {
        try {
            const saved = localStorage.getItem('mathGameAchievements');
            if (saved) {
                const achievementsData = JSON.parse(saved);
                Object.keys(achievementsData).forEach(key => {
                    achievements.set(key, achievementsData[key]);
                });
            }
            
            const progressSaved = localStorage.getItem('mathGameAchievementProgress');
            if (progressSaved) {
                achievementProgress = JSON.parse(progressSaved);
            }
        } catch (e) {
            console.error('加载成就失败:', e);
            achievementProgress = {};
        }
    }
    
    function showAchievements() {
        try {
            updateAchievements();
            const container = document.getElementById('achievements-grid');
            container.innerHTML = '';
            
            ACHIEVEMENTS.forEach(ach => {
                const achieved = achievements.get(ach.id) || false;
                const progress = ach.progressCondition ? ach.progressCondition() : 0;
                const maxProgress = ach.maxProgress || 100;
                const progressPercent = Math.min((progress / maxProgress) * 100, 100);
                
                const card = document.createElement('div');
                card.className = `achievement-card ${achieved ? '' : 'locked'}`;
                card.innerHTML = `
                    <div class="achievement-icon">${ach.icon}</div>
                    <div class="achievement-name">${ach.name[currentLanguage] || ach.name.zh}</div>
                    <div class="achievement-desc">${ach.desc[currentLanguage] || ach.desc.zh}</div>
                    <div class="progress-indicator">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <div style="margin-top: 10px; font-size: 0.8em; color: ${achieved ? '#4CAF50' : '#999'}">
                        ${achieved ? (currentLanguage === 'zh' ? '✓ 已获得' : '✓ Achieved') : 
                            (currentLanguage === 'zh' ? `${Math.round(progressPercent)}% 完成` : `${Math.round(progressPercent)}% Complete`)}
                    </div>
                `;
                container.appendChild(card);
            });
            
            document.getElementById('achievements-modal').style.display = 'flex';
            
        } catch (error) {
            console.error('显示成就失败:', error);
            showMessage(currentLanguage === 'zh' ? '加载成就失败' : 'Failed to load achievements', 'error');
        }
    }
    
    function showAchievementUnlock(achievement) {
        try {
            const unlockDiv = document.createElement('div');
            unlockDiv.className = 'achievement-unlock';
            unlockDiv.innerHTML = `
                <div style="font-size: 3em;">${achievement.icon}</div>
                <div style="font-size: 1.5em; font-weight: bold; margin: 10px 0;">🎉 ${currentLanguage === 'zh' ? '成就解锁!' : 'Achievement Unlocked!'}</div>
                <div style="font-size: 1.2em; font-weight: bold;">${achievement.name[currentLanguage] || achievement.name.zh}</div>
                <div style="margin-top: 10px;">${achievement.desc[currentLanguage] || achievement.desc.zh}</div>
            `;
            document.body.appendChild(unlockDiv);
            setTimeout(() => unlockDiv.remove(), 2000);
            
        } catch (error) {
            console.error('显示成就解锁失败:', error);
        }
    }
    
    // ==================== 数据备份和恢复 ====================
    function backupLocalData() {
        try {
            const backupData = {
                wrongQuestions: wrongQuestions,
                achievements: Array.from(achievements.entries()),
                achievementProgress: achievementProgress,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            
            localStorage.setItem('mathGameBackup', JSON.stringify(backupData));
            console.log('本地数据备份完成');
            return backupData;
        } catch (error) {
            console.error('数据备份失败:', error);
            return null;
        }
    }
    
    async function backupToCloud() {
        if (!currentUser) {
            showMessage(currentLanguage === 'zh' ? '请先登录' : 'Please login first', 'error');
            return false;
        }
        
        if (isSyncing) {
            showMessage(currentLanguage === 'zh' ? '正在同步中，请稍后' : 'Syncing in progress, please wait', 'info');
            return false;
        }
        
        isSyncing = true;
        try {
            const backupData = backupLocalData();
            if (!backupData) {
                showMessage(currentLanguage === 'zh' ? '备份数据失败' : 'Backup data failed', 'error');
                return false;
            }
            
            const { error } = await safeApiCall(
                () => supabase
                    .from('user_backups')
                    .upsert({
                        user_id: currentUser.id,
                        backup_data: backupData,
                        updated_at: new Date().toISOString()
                    }),
                '云端备份失败'
            );
            
            if (error) throw error;
            
            showMessage(currentLanguage === 'zh' ? '数据备份到云端成功' : 'Data backed up to cloud successfully', 'success');
            return true;
        } catch (error) {
            console.error('云端备份失败:', error);
            showMessage(currentLanguage === 'zh' ? '云端备份失败' : 'Cloud backup failed', 'error');
            return false;
        } finally {
            isSyncing = false;
        }
    }
    
    async function restoreFromCloud() {
        if (!currentUser) {
            showMessage(currentLanguage === 'zh' ? '请先登录' : 'Please login first', 'error');
            return false;
        }
        
        if (isSyncing) {
            showMessage(currentLanguage === 'zh' ? '正在同步中，请稍后' : 'Syncing in progress, please wait', 'info');
            return false;
        }
        
        if (!confirm(currentLanguage === 'zh' ? 
            '确定要从云端恢复数据吗？这会覆盖当前本地数据。' : 
            'Are you sure you want to restore data from cloud? This will overwrite current local data.')) {
            return false;
        }
        
        isSyncing = true;
        try {
            const { data, error } = await safeApiCall(
                () => supabase
                    .from('user_backups')
                    .select('backup_data')
                    .eq('user_id', currentUser.id)
                    .single(),
                '从云端恢复失败'
            );
            
            if (error) throw error;
            
            if (!data || !data.backup_data) {
                showMessage(currentLanguage === 'zh' ? '云端没有找到备份数据' : 'No backup data found in cloud', 'info');
                return false;
            }
            
            const backupData = data.backup_data;
            
            // 验证备份数据
            if (!backupData.version || !backupData.timestamp) {
                throw new Error('备份数据格式无效');
            }
            
            // 恢复数据
            wrongQuestions = backupData.wrongQuestions || [];
            achievements = new Map(backupData.achievements || []);
            achievementProgress = backupData.achievementProgress || {};
            
            // 保存到本地存储
            localStorage.setItem('mathGameWrongQuestions', JSON.stringify(wrongQuestions));
            const achievementsData = {};
            achievements.forEach((value, key) => {
                achievementsData[key] = value;
            });
            localStorage.setItem('mathGameAchievements', JSON.stringify(achievementsData));
            localStorage.setItem('mathGameAchievementProgress', JSON.stringify(achievementProgress));
            
            showMessage(currentLanguage === 'zh' ? '数据恢复成功' : 'Data restored successfully', 'success');
            return true;
        } catch (error) {
            console.error('数据恢复失败:', error);
            showMessage(currentLanguage === 'zh' ? '数据恢复失败' : 'Data restore failed', 'error');
            return false;
        } finally {
            isSyncing = false;
        }
    }
    
    // ==================== 错题本功能 ====================
    function recordWrongQuestion(num1, num2, target) {
        try {
            // 创建错题标识
            const wrongId = `${Math.min(num1, num2)}_${Math.max(num1, num2)}_${target}`;
            
            // 检查是否已存在相同的错题
            const exists = wrongQuestions.some(question => 
                `${Math.min(question.num1, question.num2)}_${Math.max(question.num1, question.num2)}_${question.correctSum}` === wrongId
            );
            
            if (!exists) {
                const wrongQuestion = {
                    id: wrongId,
                    num1: num1,
                    num2: num2,
                    wrongSum: num1 + num2,
                    correctSum: target,
                    timestamp: new Date().toISOString(),
                    count: 1
                };
                wrongQuestions.push(wrongQuestion);
                saveWrongQuestions();
            } else {
                // 更新错误次数
                const existingQuestion = wrongQuestions.find(question => 
                    `${Math.min(question.num1, question.num2)}_${Math.max(question.num1, question.num2)}_${question.correctSum}` === wrongId
                );
                if (existingQuestion) {
                    existingQuestion.count++;
                    existingQuestion.timestamp = new Date().toISOString();
                    saveWrongQuestions();
                }
            }
        } catch (error) {
            console.error('记录错题失败:', error);
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
    
    function saveWrongQuestions() {
        try {
            localStorage.setItem('mathGameWrongQuestions', JSON.stringify(wrongQuestions));
        } catch (e) {
            console.error('保存错题失败:', e);
        }
    }
    
    async function syncWrongQuestionsToCloud() {
        if (!currentUser) {
            showMessage(currentLanguage === 'zh' ? '请先登录' : 'Please login first', 'error');
            return false;
        }
        
        if (isSyncing) {
            showMessage(currentLanguage === 'zh' ? '正在同步中，请稍后' : 'Syncing in progress, please wait', 'info');
            return false;
        }
        
        isSyncing = true;
        try {
            const { error } = await safeApiCall(
                () => supabase
                    .from('user_wrong_questions')
                    .upsert({
                        user_id: currentUser.id,
                        wrong_questions: wrongQuestions,
                        count: wrongQuestions.length,
                        updated_at: new Date().toISOString()
                    }),
                '错题同步失败'
            );
            
            if (error) throw error;
            
            showMessage(currentLanguage === 'zh' ? '错题同步到云端成功' : 'Wrong questions synced to cloud successfully', 'success');
            return true;
        } catch (error) {
            console.error('错题同步失败:', error);
            showMessage(currentLanguage === 'zh' ? '错题同步失败' : 'Wrong questions sync failed', 'error');
            return false;
        } finally {
            isSyncing = false;
        }
    }
    
    async function loadWrongQuestionsFromCloud() {
        if (!currentUser) return false;
        
        try {
            const { data, error } = await safeApiCall(
                () => supabase
                    .from('user_wrong_questions')
                    .select('wrong_questions')
                    .eq('user_id', currentUser.id)
                    .single(),
                '加载云端错题失败'
            );
            
            if (error && error.code !== 'PGRST116') throw error;
            
            if (data && data.wrong_questions) {
                wrongQuestions = data.wrong_questions;
                saveWrongQuestions();
                return true;
            }
        } catch (error) {
            console.error('从云端加载错题失败:', error);
        }
        return false;
    }
    
    // ==================== 辅助功能 ====================
    function showHint() {
        try {
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
            
        } catch (error) {
            console.error('显示提示失败:', error);
        }
    }
    
    function updateHintCooldown() {
        if (hintCooldown > 0) {
            hintCooldown--;
            updateHintButton();
        }
    }
    
    function updateHintButton() {
        try {
            const hintBtn = document.getElementById('hint-btn');
            if (hintCooldown > 0) {
                hintBtn.innerHTML = `<span>💡 ${hintCooldown}秒</span>`;
                hintBtn.disabled = true;
                hintBtn.style.opacity = '0.7';
            } else {
                hintBtn.innerHTML = `<span data-i18n="hintButton">💡 提示(10秒)</span>`;
                hintBtn.disabled = false;
                hintBtn.style.opacity = '1';
            }
        } catch (error) {
            console.error('更新提示按钮失败:', error);
        }
    }
    
    function refreshNumbers() {
        try {
            const gameGrid = document.getElementById('game-grid');
            gameGrid.style.opacity = '0.5';
            setTimeout(() => {
                generateNumberGrid();
                gameGrid.style.opacity = '1';
            }, 500);
        } catch (error) {
            console.error('刷新数字失败:', error);
        }
    }
    
    function showFeedback(text, type) {
        try {
            const feedback = document.getElementById('match-feedback');
            feedback.textContent = text;
            feedback.style.color = type === 'success' ? '#4CAF50' : '#ff4444';
            feedback.style.opacity = '1';
            setTimeout(() => { feedback.style.opacity = '0'; }, 1000);
        } catch (error) {
            console.error('显示反馈失败:', error);
        }
    }
    
    // ==================== 修复的成绩保存功能 ====================
    async function saveScore() {
        if (isSavingScore) {
            showMessage(currentLanguage === 'zh' ? '正在保存中，请稍后' : 'Saving in progress, please wait', 'info');
            return;
        }
        
        isSavingScore = true;
        
        try {
            const nameInput = document.getElementById('player-name');
            let playerName = sanitizeInput(nameInput.value.trim(), 50, /^[a-zA-Z0-9\u4e00-\u9fa5\s]+$/);
            
            if (!playerName && currentUser) {
                playerName = currentUser.user_metadata?.username;
                if (!playerName && currentUser.email) {
                    playerName = currentUser.email.split('@')[0];
                }
            }
            
            playerName = playerName || (currentLanguage === 'zh' ? '匿名玩家' : 'Anonymous Player');
            
            if (!currentUser) {
                showMessage(currentLanguage === 'zh' ? '请先登录保存成绩' : 'Please login to save score', 'error');
                showAuthModal();
                return;
            }
            
            let elapsedTime = gameState.lastGameElapsedTime || 0;
            
            if (currentMode === 'challenge') {
                const maxTime = MODE_CONFIG.challenge.time;
                if (elapsedTime > maxTime) {
                    console.warn('挑战模式时间异常，已修正:', elapsedTime, '->', maxTime);
                    elapsedTime = maxTime;
                }
            }
            
            const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;
            
            const scoreData = {
                user_id: currentUser.id,
                player_name: playerName,
                score: score,
                completed: completedQuestions,
                accuracy: accuracy,
                time_used: elapsedTime,
                mode: currentMode,
                number_range: document.getElementById('number-range').value,
                created_at: new Date().toISOString()
            };
            
            console.log('保存成绩:', scoreData);
            
            const { data, error } = await safeApiCall(
                () => supabase
                    .from('scores')
                    .insert([scoreData])
                    .select(),
                '保存成绩失败'
            );
            
            if (error) {
                console.error('保存成绩失败:', error);
                showMessage((currentLanguage === 'zh' ? '保存成绩失败: ' : 'Save score failed: ') + error.message, 'error');
                return;
            }
            
            console.log('成绩保存成功:', data);
            showMessage(currentLanguage === 'zh' ? '成绩保存成功！已上传到云端' : 'Score saved successfully! Uploaded to cloud', 'success');
            
            nameInput.value = '';
            document.getElementById('game-over').style.display = 'none';
            
            setTimeout(() => {
                restartGame();
            }, 500);
            
        } catch (error) {
            console.error('保存成绩异常:', error);
            
            let errorMessage = currentLanguage === 'zh' ? '保存成绩失败' : 'Save score failed';
            
            if (error.message === 'network_error') {
                errorMessage = currentLanguage === 'zh' ? '网络错误，请检查连接' : 'Network error, please check connection';
            } else if (error.message === 'rate_limit_exceeded') {
                errorMessage = currentLanguage === 'zh' ? '操作太频繁，请稍后再试' : 'Rate limit exceeded, please try again later';
            }
            
            showMessage(errorMessage, 'error');
        } finally {
            isSavingScore = false;
        }
    }
    
    // ==================== 其他功能 ====================
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
            document.getElementById('language-text').textContent = lang === 'zh' ? 'English' : '中文';
        } catch (error) {
            console.error('设置语言失败:', error);
        }
    }
    
    function showStatistics() {
        try {
            const stats = calculateStatistics();
            const content = document.getElementById('statistics-content');
            
            content.innerHTML = `
                <div style="padding: 20px;">
                    <h3 style="color: #4CAF50; margin-bottom: 15px;">${currentLanguage === 'zh' ? '📊 本次游戏统计' : '📊 Current Game Statistics'}</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                            <div style="color: #666; font-size: 0.9em;">${currentLanguage === 'zh' ? '总尝试次数' : 'Total Attempts'}</div>
                            <div style="color: #2196F3; font-size: 1.5em; font-weight: bold;">${stats.totalAttempts}</div>
                        </div>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                            <div style="color: #666; font-size: 0.9em;">${currentLanguage === 'zh' ? '正确次数' : 'Correct Answers'}</div>
                            <div style="color: #4CAF50; font-size: 1.5em; font-weight: bold;">${stats.correctCount}</div>
                        </div>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                            <div style="color: #666; font-size: 0.9em;">${currentLanguage === 'zh' ? '正确率' : 'Accuracy'}</div>
                            <div style="color: #FF9800; font-size: 1.5em; font-weight: bold;">${stats.accuracy}%</div>
                        </div>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                            <div style="color: #666; font-size: 0.9em;">${currentLanguage === 'zh' ? '平均答题时间' : 'Average Time'}</div>
                            <div style="color: #9C27B0; font-size: 1.5em; font-weight:bold;">${stats.avgTime.toFixed(2)}${currentLanguage === 'zh' ? '秒' : 's'}</div>
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('statistics-modal').style.display = 'flex';
        } catch (error) {
            console.error('显示统计失败:', error);
            showMessage(currentLanguage === 'zh' ? '加载统计失败' : 'Failed to load statistics', 'error');
        }
    }
    
    function calculateStatistics() {
        const stats = {
            totalAttempts: gameHistory.length,
            correctCount: correctCount,
            accuracy: totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100,
            avgTime: 0,
            minTime: Infinity,
            maxTime: 0
        };
        
        let totalTime = 0;
        gameHistory.forEach(record => {
            totalTime += record.time;
            if (record.time < stats.minTime) stats.minTime = record.time;
            if (record.time > stats.maxTime) stats.maxTime = record.time;
        });
        
        if (gameHistory.length > 0) {
            stats.avgTime = totalTime / gameHistory.length;
        }
        
        return stats;
    }
    
    function showHistory() {
        try {
            const tbody = document.getElementById('history-table-body');
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
                        <td>${record.time.toFixed(2)}</td>
                    `;
                    tbody.appendChild(row);
                });
            }
            
            document.getElementById('history-modal').style.display = 'flex';
        } catch (error) {
            console.error('显示历史记录失败:', error);
            showMessage(currentLanguage === 'zh' ? '加载历史记录失败' : 'Failed to load history', 'error');
        }
    }
    
    // ==================== 排行榜功能 ====================
    async function showLeaderboardTab(tab, event) {
        try {
            if (event) {
                const tabButtons = document.querySelectorAll('.tab-btn');
                tabButtons.forEach(btn => btn.classList.remove('active'));
                event.target.classList.add('active');
            }
            
            const content = document.getElementById('leaderboard-content');
            content.innerHTML = `<div style="text-align:center;padding:20px;">${currentLanguage === 'zh' ? '加载中...' : 'Loading...'}</div>`;
            
            if (tab === 'myhistory') {
                await showMyLeaderboardHistory();
                return;
            }
            
            let data = await queryScoresDirectly(tab);
            
            if (!data || data.length === 0) {
                content.innerHTML = `<div style="text-align:center;padding:40px;color:#666;">${currentLanguage === 'zh' ? '暂无排行榜数据' : 'No leaderboard data'}</div>`;
                return;
            }
            
            renderLeaderboard(data, tab, content);
            
        } catch (error) {
            console.error('获取排行榜失败:', error);
            const content = document.getElementById('leaderboard-content');
            content.innerHTML = `<div style="text-align:center;padding:40px;color:#666;">${currentLanguage === 'zh' ? '加载失败' : 'Load failed'}</div>`;
        }
    }
    
    async function queryScoresDirectly(tab) {
        try {
            let query = supabase.from('scores').select('*');
            
            switch(tab) {
                case 'standard':
                    query = query.eq('mode', 'standard')
                                .gte('completed', 30)
                                .order('time_used', { ascending: true });
                    break;
                case 'challenge':
                    query = query.eq('mode', 'challenge')
                                .lte('time_used', 90)
                                .order('completed', { ascending: false })
                                .order('time_used', { ascending: true });
                    break;
                case 'score':
                    query = query.order('score', { ascending: false });
                    break;
                case 'accuracy':
                    query = query.gte('completed', 10)
                                .order('accuracy', { ascending: false })
                                .order('completed', { ascending: false });
                    break;
            }
            
            const { data, error } = await safeApiCall(
                () => query.limit(20),
                '查询排行榜失败'
            );
            
            if (error) {
                console.error('直接查询失败:', error);
                return [];
            }
            
            return data || [];
        } catch (error) {
            console.error('查询分数失败:', error);
            return [];
        }
    }
    
    function renderLeaderboard(data, tab, content) {
        try {
            const descriptions = {
                'standard': currentLanguage === 'zh' ? '标准模式：完成30题的最短用时' : 'Standard Mode: Fastest time to complete 30 questions',
                'challenge': currentLanguage === 'zh' ? '挑战模式：90秒内完成最多题数' : 'Challenge Mode: Most questions completed in 90 seconds',
                'score': currentLanguage === 'zh' ? '高分榜：单局最高得分' : 'High Score: Highest score in a single game',
                'accuracy': currentLanguage === 'zh' ? '准确率榜：最高正确率（至少完成10题）' : 'Accuracy: Highest accuracy rate (minimum 10 questions)'
            };
            
            let html = `<div style="margin-bottom: 15px; color: #666; font-size: 0.9em;">${descriptions[tab] || ''}</div>`;
            html += '<table class="history-table">';
            html += `<thead><tr>
                <th>${currentLanguage === 'zh' ? '排名' : 'Rank'}</th>
                <th>${currentLanguage === 'zh' ? '玩家' : 'Player'}</th>
                <th>${currentLanguage === 'zh' ? '模式' : 'Mode'}</th>
                <th>${currentLanguage === 'zh' ? '得分' : 'Score'}</th>
                <th>${currentLanguage === 'zh' ? '题数' : 'Questions'}</th>
                <th>${currentLanguage === 'zh' ? '正确率' : 'Accuracy'}</th>
                <th>${currentLanguage === 'zh' ? '用时' : 'Time'}</th>
                <th>${currentLanguage === 'zh' ? '时间' : 'Date'}</th>
            </tr></thead><tbody>`;
            
            data.forEach((item, index) => {
                const username = item.player_name || (currentLanguage === 'zh' ? '匿名玩家' : 'Anonymous Player');
                const isCurrentUser = currentUser && item.user_id === currentUser.id;
                const rank = index + 1;
                
                let timeDisplay = `${item.time_used}${currentLanguage === 'zh' ? '秒' : 's'}`;
                if (tab === 'challenge' && item.time_used > 90) {
                    timeDisplay = `<span style="color:#ff4444;">${item.time_used}${currentLanguage === 'zh' ? '秒(异常)' : 's(invalid)'}</span>`;
                }
                
                html += `
                    <tr ${isCurrentUser ? 'style="background-color: #e3f2fd;"' : ''}>
                        <td>${rank}</td>
                        <td><strong>${username}</strong> ${isCurrentUser ? 
                            `<span style="color:#2196F3;">(${currentLanguage === 'zh' ? '我' : 'Me'})</span>` : ''}</td>
                        <td>${item.mode}</td>
                        <td><span style="color:#FF9800;font-weight:bold;">${item.score}</span></td>
                        <td>${item.completed}</td>
                        <td><span style="color:#4CAF50;font-weight:bold;">${item.accuracy}%</span></td>
                        <td>${timeDisplay}</td>
                        <td>${new Date(item.created_at).toLocaleDateString(currentLanguage === 'zh' ? 'zh-CN' : 'en-US')}</td>
                    </tr>
                `;
            });
            
            html += '</tbody></table>';
            content.innerHTML = html;
        } catch (error) {
            console.error('渲染排行榜失败:', error);
        }
    }
    
    async function showMyLeaderboardHistory() {
        try {
            if (!currentUser) {
                document.getElementById('leaderboard-content').innerHTML = 
                    `<div style="text-align:center;padding:40px;color:#666;">${currentLanguage === 'zh' ? '请先登录查看个人历史' : 'Please login to view personal history'}</div>`;
                return;
            }
            
            const { data, error } = await safeApiCall(
                () => supabase
                    .from('scores')
                    .select('*')
                    .eq('user_id', currentUser.id)
                    .order('created_at', { ascending: false })
                    .limit(10),
                '获取个人历史失败'
            );
            
            if (error) {
                document.getElementById('leaderboard-content').innerHTML = 
                    `<div style="text-align:center;padding:40px;color:#666;">${currentLanguage === 'zh' ? '加载失败' : 'Load failed'}</div>`;
                return;
            }
            
            if (data.length === 0) {
                document.getElementById('leaderboard-content').innerHTML = 
                    `<div style="text-align:center;padding:40px;color:#666;">${currentLanguage === 'zh' ? '暂无游戏记录' : 'No game records'}</div>`;
                return;
            }
            
            let html = '<table class="history-table">';
            html += `<thead><tr>
                <th>${currentLanguage === 'zh' ? '序号' : 'No.'}</th>
                <th>${currentLanguage === 'zh' ? '模式' : 'Mode'}</th>
                <th>${currentLanguage === 'zh' ? '得分' : 'Score'}</th>
                <th>${currentLanguage === 'zh' ? '题数' : 'Questions'}</th>
                <th>${currentLanguage === 'zh' ? '正确率' : 'Accuracy'}</th>
                <th>${currentLanguage === 'zh' ? '用时' : 'Time'}</th>
                <th>${currentLanguage === 'zh' ? '时间' : 'Date'}</th>
            </tr></thead><tbody>`;
            
            data.forEach((item, index) => {
                html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.mode}</td>
                        <td><span style="color:#FF9800;font-weight:bold;">${item.score}</span></td>
                        <td>${item.completed}</td>
                        <td><span style="color:#4CAF50;font-weight:bold;">${item.accuracy}%</span></td>
                        <td>${item.time_used}${currentLanguage === 'zh' ? '秒' : 's'}</td>
                        <td>${new Date(item.created_at).toLocaleDateString(currentLanguage === 'zh' ? 'zh-CN' : 'en-US')}</td>
                    </tr>
                `;
            });
            
            html += '</tbody></table>';
            document.getElementById('leaderboard-content').innerHTML = html;
        } catch (error) {
            console.error('获取个人历史失败:', error);
            document.getElementById('leaderboard-content').innerHTML = 
                `<div style="text-align:center;padding:40px;color:#666;">${currentLanguage === 'zh' ? '加载失败' : 'Load failed'}</div>`;
        }
    }
    
    // ==================== 个人资料功能 ====================
    async function showProfile() {
        try {
            if (!currentUser) {
                showMessage(currentLanguage === 'zh' ? '请先登录查看个人资料' : 'Please login to view profile', 'info');
                showAuthModal();
                return;
            }
            
            document.getElementById('profile-modal').style.display = 'flex';
            
            const email = currentUser.email;
            const firstLetter = email.charAt(0).toUpperCase() || '?';
            document.getElementById('profile-avatar').textContent = firstLetter;
            document.getElementById('profile-email').textContent = email;
            
            const userRole = currentUser.user_metadata?.role || 'student';
            const roleText = userRole === 'teacher' ? (currentLanguage === 'zh' ? '👨‍🏫 教师' : '👨‍🏫 Teacher') : (currentLanguage === 'zh' ? '👨‍🎓 学生' : '👨‍🎓 Student');
            document.getElementById('profile-role').textContent = roleText;
            
            document.getElementById('profile-game-count').textContent = '0';
            document.getElementById('profile-high-score').textContent = '0';
            document.getElementById('profile-avg-accuracy').textContent = '0%';
            
            const joinDate = new Date(currentUser.created_at);
            document.getElementById('profile-join-date').textContent = joinDate.toLocaleDateString(currentLanguage === 'zh' ? 'zh-CN' : 'en-US');
            
            try {
                const { data: scores, error } = await safeApiCall(
                    () => supabase
                        .from('scores')
                        .select('*')
                        .eq('user_id', currentUser.id),
                    '获取个人资料失败'
                );
                
                if (!error && scores && scores.length > 0) {
                    const gameCount = scores.length;
                    const highScore = Math.max(...scores.map(s => s.score));
                    const avgAccuracy = scores.reduce((sum, s) => sum + s.accuracy, 0) / gameCount;
                    
                    document.getElementById('profile-game-count').textContent = gameCount;
                    document.getElementById('profile-high-score').textContent = highScore;
                    document.getElementById('profile-avg-accuracy').textContent = avgAccuracy.toFixed(1) + '%';
                }
            } catch (error) {
                console.error('获取个人资料失败:', error);
            }
        } catch (error) {
            console.error('显示个人资料失败:', error);
            showMessage(currentLanguage === 'zh' ? '加载个人资料失败' : 'Failed to load profile', 'error');
        }
    }
    
    // ==================== 教师工具功能 ====================
    function downloadExcelTemplate() {
        try {
            const templateData = [
                ['email', '姓名', '班级', '备注'],
                ['student1@example.com', '张三', '三年一班', ''],
                ['student2@example.com', '李四', '三年一班', ''],
                ['student3@example.com', '王五', '三年二班', ''],
                ['注意：', '1. 请不要修改表头', '2. email必须唯一', '3. 班级名称保持一致', '4. 保存为CSV格式']
            ];
            
            const csvContent = templateData.map(row => 
                row.map(cell => `"${cell}"`).join(',')
            ).join('\n');
            
            const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', '学生账号模板.csv');
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (error) {
            console.error('下载模板失败:', error);
            showMessage(currentLanguage === 'zh' ? '下载模板失败' : 'Failed to download template', 'error');
        }
    }
    
    // ==================== 弹窗相关函数 ====================
    function showAuthModal() {
        try {
            document.getElementById('auth-modal').style.display = 'flex';
            updateAuthUI();
        } catch (error) {
            console.error('显示认证弹窗失败:', error);
        }
    }
    
    function closeAuthModal() {
        try {
            document.getElementById('auth-modal').style.display = 'none';
            document.getElementById('auth-email').value = '';
            document.getElementById('auth-password').value = '';
            document.getElementById('auth-username').value = '';
            document.getElementById('auth-school').value = '';
            document.getElementById('auth-state').value = '';
            document.getElementById('auth-error').textContent = '';
        } catch (error) {
            console.error('关闭认证弹窗失败:', error);
        }
    }
    
    function updateAuthUI() {
        try {
            const isLogin = authMode === 'login';
            document.getElementById('auth-title').innerHTML = `<span data-i18n="${isLogin ? 'loginTitle' : 'registerTitle'}">${isLogin ? (currentLanguage === 'zh' ? '🔐 用户登录' : '🔐 User Login') : (currentLanguage === 'zh' ? '📝 用户注册' : '📝 User Registration')}</span>`;
            document.getElementById('auth-submit-btn').innerHTML = `<span data-i18n="${isLogin ? 'loginButton' : 'registerButton'}">${isLogin ? (currentLanguage === 'zh' ? '登录' : 'Login') : (currentLanguage === 'zh' ? '注册' : 'Register')}</span>`;
            document.getElementById('auth-switch-text').textContent = isLogin 
                ? (currentLanguage === 'zh' ? '还没有账号？' : 'No account?')
                : (currentLanguage === 'zh' ? '已有账号？' : 'Already have an account?');
            document.getElementById('auth-switch-link').innerHTML = `<span data-i18n="${isLogin ? 'registerNow' : 'loginNow'}">${isLogin ? (currentLanguage === 'zh' ? '立即注册' : 'Register Now') : (currentLanguage === 'zh' ? '立即登录' : 'Login Now')}</span>`;
            document.getElementById('auth-username-group').style.display = isLogin ? 'none' : 'block';
            document.getElementById('role-select-group').style.display = isLogin ? 'none' : 'block';
            document.getElementById('teacher-register-fields').style.display = 'none';
            document.getElementById('auth-error').textContent = '';
        } catch (error) {
            console.error('更新认证UI失败:', error);
        }
    }
    
    function toggleAuthMode() {
        try {
            authMode = authMode === 'login' ? 'register' : 'login';
            updateAuthUI();
        } catch (error) {
            console.error('切换认证模式失败:', error);
        }
    }
    
    async function handleAuth() {
        try {
            const email = sanitizeInput(document.getElementById('auth-email').value.trim(), 100);
            const password = document.getElementById('auth-password').value.trim();
            const username = sanitizeInput(document.getElementById('auth-username').value.trim(), 50, /^[a-zA-Z0-9\u4e00-\u9fa5\s]+$/);
            const role = document.getElementById('auth-role') ? document.getElementById('auth-role').value : 'student';
            const school = document.getElementById('auth-school') ? document.getElementById('auth-school').value.trim() : '';
            const state = document.getElementById('auth-state') ? document.getElementById('auth-state').value.trim() : '';
            
            if (!email || !password) {
                document.getElementById('auth-error').textContent = currentLanguage === 'zh' ? '请输入邮箱和密码' : 'Please enter email and password';
                return;
            }
            
            if (!validateEmail(email)) {
                document.getElementById('auth-error').textContent = currentLanguage === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email address';
                return;
            }
            
            if (!validatePassword(password)) {
                document.getElementById('auth-error').textContent = currentLanguage === 'zh' ? '密码至少6位，必须包含字母和数字' : 'Password must be at least 6 characters with letters and numbers';
                return;
            }
            
            if (authMode === 'login') {
                await login(email, password);
            } else {
                if (role === 'teacher' && (!school || !state)) {
                    document.getElementById('auth-error').textContent = currentLanguage === 'zh' ? '请填写学校名称和所在州属' : 'Please fill in school name and state';
                    return;
                }
                await register(email, password, username, role, school, state);
            }
        } catch (error) {
            console.error('处理认证失败:', error);
            document.getElementById('auth-error').textContent = currentLanguage === 'zh' ? '认证过程出错' : 'Authentication process error';
        }
    }
    
    // ==================== 初始化 ====================
    async function init() {
        try {
            console.log('🎮 数学加法消消乐 - 安全增强版开始初始化...');
            
            // 检查环境变量
            if (!window.__ENV__) {
                window.__ENV__ = {};
            }
            
            // 初始化Supabase
            const supabaseInitialized = await initSupabase();
            if (!supabaseInitialized) {
                throw new Error('Supabase初始化失败');
            }
            
            // 设置语言
            const savedLang = localStorage.getItem('mathGameLanguage');
            if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
                currentLanguage = savedLang;
            } else {
                const browserLang = navigator.language.toLowerCase();
                currentLanguage = browserLang.startsWith('zh') ? 'zh' : 'en';
            }
            
            setLanguage(currentLanguage);
            
            // 检查登录状态
            const isLoggedIn = await checkAuth();
            if (!isLoggedIn) {
                console.log('未登录状态');
            }
            
            // 加载本地数据
            loadWrongQuestions();
            loadAchievements();
            
            // 初始化游戏
            selectMode('standard');
            bindEventListeners();
            
            // 定期备份本地数据
            setInterval(() => {
                backupLocalData();
            }, 5 * 60 * 1000);
            
            // 隐藏加载层
            setTimeout(() => {
                const loadingOverlay = document.getElementById('loading-overlay');
                if (loadingOverlay) {
                    loadingOverlay.classList.add('hide-loading');
                    document.body.classList.add('loaded');
                    
                    setTimeout(() => {
                        loadingOverlay.style.display = 'none';
                    }, 500);
                }
            }, 1000);
            
            console.log('🎮 数学加法消消乐 - 安全增强版已加载完成');
            
        } catch (error) {
            console.error('初始化失败:', error);
            
            // 显示错误信息
            const loadingOverlay = document.getElementById('loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.innerHTML = `
                    <div class="loading-content">
                        <h2>初始化失败</h2>
                        <p>${error.message}</p>
                        <p style="margin-top: 20px; font-size: 0.9em;">请检查网络连接或联系管理员</p>
                        <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            刷新页面
                        </button>
                    </div>
                `;
            }
        }
    }
    
    // ==================== 绑定事件监听器 ====================
    function bindEventListeners() {
        try {
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
            document.getElementById('achievements-btn')?.addEventListener('click', showAchievements);
            document.getElementById('wrongbook-btn')?.addEventListener('click', showWrongBook);
            document.getElementById('leaderboard-btn')?.addEventListener('click', () => {
                document.getElementById('leaderboard-modal').style.display = 'flex';
                showLeaderboardTab('standard');
            });
            document.getElementById('profile-btn')?.addEventListener('click', showProfile);
            document.getElementById('teacher-tools-btn')?.addEventListener('click', () => {
                if (!currentUser) {
                    showAuthModal();
                    showMessage('请先登录教师账号', 'info');
                    return;
                }
                
                const userRole = currentUser.user_metadata?.role;
                const isApprovedTeacher = userRole === 'teacher' && currentUser.user_metadata?.approved === true;
                
                if (!isApprovedTeacher) {
                    showMessage('只有已批准的教师可以使用此功能', 'error');
                    return;
                }
                
                document.getElementById('teacher-tools-modal').style.display = 'flex';
            });
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
            document.getElementById('auth-role')?.addEventListener('change', function() {
                if (this.value === 'teacher') {
                    document.getElementById('teacher-register-fields').style.display = 'block';
                } else {
                    document.getElementById('teacher-register-fields').style.display = 'none';
                }
            });
            
            // 关闭弹窗按钮
            document.getElementById('close-history-modal')?.addEventListener('click', () => document.getElementById('history-modal').style.display = 'none');
            document.getElementById('close-statistics-modal')?.addEventListener('click', () => document.getElementById('statistics-modal').style.display = 'none');
            document.getElementById('close-achievements-modal')?.addEventListener('click', () => document.getElementById('achievements-modal').style.display = 'none');
            document.getElementById('close-wrongbook-modal')?.addEventListener('click', () => document.getElementById('wrongbook-modal').style.display = 'none');
            document.getElementById('close-leaderboard-modal')?.addEventListener('click', () => document.getElementById('leaderboard-modal').style.display = 'none');
            document.getElementById('close-profile-modal')?.addEventListener('click', () => document.getElementById('profile-modal').style.display = 'none');
            document.getElementById('close-teacher-tools')?.addEventListener('click', () => document.getElementById('teacher-tools-modal').style.display = 'none');
            document.getElementById('close-admin-tools')?.addEventListener('click', () => document.getElementById('admin-tools-modal').style.display = 'none');
            document.getElementById('close-game-over')?.addEventListener('click', () => {
                document.getElementById('game-over').style.display = 'none';
                restartGame();
            });
            
            // 历史记录相关
            document.getElementById('clear-history-btn')?.addEventListener('click', () => {
                if (confirm(currentLanguage === 'zh' ? '确定要清空本次游戏的历史记录吗？' : 'Are you sure you want to clear the current game history?')) {
                    gameHistory = [];
                    showHistory();
                    showMessage(currentLanguage === 'zh' ? '历史记录已清空' : 'History cleared', 'info');
                }
            });
            
            // 错题本相关
            document.getElementById('sync-wrong-questions-btn')?.addEventListener('click', syncWrongQuestionsToCloud);
            document.getElementById('clear-wrong-questions-btn')?.addEventListener('click', () => {
                if (confirm(currentLanguage === 'zh' ? '确定要清空本地错题吗？' : 'Are you sure you want to clear local wrong questions?')) {
                    wrongQuestions = [];
                    saveWrongQuestions();
                    showWrongBook();
                    showMessage(currentLanguage === 'zh' ? '本地错题已清空' : 'Local wrong questions cleared', 'info');
                }
            });
            
            // 数据备份恢复
            document.getElementById('backup-data-btn')?.addEventListener('click', backupToCloud);
            document.getElementById('restore-data-btn')?.addEventListener('click', restoreFromCloud);
            
            // 排行榜选项卡
            document.getElementById('tab-standard')?.addEventListener('click', (e) => showLeaderboardTab('standard', e));
            document.getElementById('tab-challenge')?.addEventListener('click', (e) => showLeaderboardTab('challenge', e));
            document.getElementById('tab-score')?.addEventListener('click', (e) => showLeaderboardTab('score', e));
            document.getElementById('tab-accuracy')?.addEventListener('click', (e) => showLeaderboardTab('accuracy', e));
            document.getElementById('tab-myhistory')?.addEventListener('click', (e) => showLeaderboardTab('myhistory', e));
            
            // 游戏结束相关
            document.getElementById('save-score-btn')?.addEventListener('click', saveScore);
            document.getElementById('play-again-btn')?.addEventListener('click', restartGame);
            document.getElementById('view-leaderboard-btn')?.addEventListener('click', () => {
                document.getElementById('game-over').style.display = 'none';
                setTimeout(() => {
                    document.getElementById('leaderboard-modal').style.display = 'flex';
                    showLeaderboardTab('standard');
                }, 300);
            });
            document.getElementById('view-statistics-btn')?.addEventListener('click', () => {
                document.getElementById('game-over').style.display = 'none';
                setTimeout(() => {
                    showStatistics();
                }, 300);
            });
            
            // 管理员工具按钮
            document.getElementById('admin-tools-btn')?.addEventListener('click', async () => {
                if (!currentUser) {
                    showAuthModal();
                    showMessage('请先登录管理员账号', 'info');
                    return;
                }
                
                const isAdmin = await checkIfAdmin();
                if (!isAdmin) {
                    showMessage('只有管理员可以访问此功能', 'error');
                    return;
                }
                
                document.getElementById('admin-tools-modal').style.display = 'flex';
            });
            
        } catch (error) {
            console.error('绑定事件监听器失败:', error);
        }
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
        showAchievements,
        showWrongBook,
        showLeaderboardTab,
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
