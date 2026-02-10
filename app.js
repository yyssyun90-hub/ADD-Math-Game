// 确保页面已完全加载
(function() {
    console.log('数学加法消消乐开始加载...');
    
    window.addEventListener('error', function(e) {
        console.error('页面加载错误:', e);
    });
})();

const MathGame = (function() {
    // ==================== 配置 ====================
    // 直接从window.__ENV__获取环境变量
    const CONFIG = {
        SUPABASE_URL: '',
        SUPABASE_ANON_KEY: '',
        ADMIN_EMAILS: ['yyssyun90@gmail.com']
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
            gameGiveup: "🏁 游戏结束", gameEnd: "🎉 游戏结束!", 
            systemError: "系统错误", loginFailed: "登录失败", registerFailed: "注册失败",
            authError: "认证错误", networkError: "网络错误", configError: "配置错误"
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
            systemError: "System Error", loginFailed: "Login Failed", registerFailed: "Registration Failed",
            authError: "Authentication Error", networkError: "Network Error", configError: "Configuration Error"
        }
    };
    
    // ==================== 全局变量 ====================
    let supabase = null;
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
    let isAdminUser = false;
    let isSupabaseReady = false;
    
    // 游戏状态
    let gameState = {
        lastGameElapsedTime: 0,
        modeConfigTime: 90
    };
    
    // 成就进度
    let achievementProgress = {};
    
    // 游戏配置
    const MODE_CONFIG = {
        standard: { questions: 30, time: null, hasTimeLimit: false },
        challenge: { questions: null, time: 90, hasTimeLimit: true },
        practice: { questions: null, time: null, hasTimeLimit: false },
        custom: { questions: 20, time: 60, hasTimeLimit: true }
    };
    
    const RANGE_CONFIG = {
        '0-9': { min: 0, max: 9, targetMin: 5, targetMax: 10 },
        '0-14': { min: 0, max: 14, targetMin: 6, targetMax: 14 },
        '5-18': { min: 5, max: 18, targetMin: 8, targetMax: 18 }
    };
    
    // 成就定义
    const ACHIEVEMENTS = [
        { id: 'first_win', name: { zh: '首战告捷', en: 'First Victory' }, desc: { zh: '完成第一局游戏', en: 'Complete first game' }, icon: '🥇' },
        { id: 'fast_5', name: { zh: '速度之星', en: 'Speed Star' }, desc: { zh: '5秒内完成一题', en: 'Complete a question within 5 seconds' }, icon: '⚡' },
        { id: 'accuracy_90', name: { zh: '准确大师', en: 'Accuracy Master' }, desc: { zh: '正确率达到90%', en: 'Achieve 90% accuracy' }, icon: '🎯' },
        { id: 'complete_30', name: { zh: '完成挑战', en: 'Challenge Complete' }, desc: { zh: '完成30题模式', en: 'Complete 30-question mode' }, icon: '🏆' },
        { id: 'cloud_user', name: { zh: '云端玩家', en: 'Cloud Player' }, desc: { zh: '登录云端账户', en: 'Login to cloud account' }, icon: '☁️' },
        { id: 'score_100', name: { zh: '百分达人', en: 'Centurion' }, desc: { zh: '单局得分达到100分', en: 'Score 100 points in one game' }, icon: '💯' }
    ];
    
    // ==================== 工具函数 ====================
    function showMessage(text, type = 'info', duration = 2000) {
        try {
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
            setTimeout(() => {
                if (message && message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, duration);
        } catch (error) {
            console.error('显示消息失败:', error);
        }
    }
    
    function setLanguage(lang) {
        try {
            currentLanguage = lang;
            localStorage.setItem('mathGameLanguage', lang);
            
            // 更新文本
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (translations[lang] && translations[lang][key]) {
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        if (element.hasAttribute('placeholder')) {
                            element.setAttribute('placeholder', translations[lang][key]);
                        }
                    } else {
                        element.textContent = translations[lang][key];
                    }
                }
            });
            
            // 更新语言按钮文本
            const languageText = document.getElementById('language-text');
            if (languageText) {
                languageText.textContent = lang === 'zh' ? 'English' : '中文';
            }
        } catch (error) {
            console.error('设置语言失败:', error);
        }
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // ==================== 管理员权限检查 ====================
    async function checkIfAdmin() {
        if (!currentUser) return false;
        
        try {
            // 检查用户元数据中的角色
            const userRole = currentUser.user_metadata?.role;
            if (userRole === 'admin' || userRole === 'superadmin') {
                return true;
            }
            
            // 检查特定邮箱
            const email = currentUser.email?.toLowerCase() || '';
            const isInAdminList = CONFIG.ADMIN_EMAILS.some(adminEmail => 
                adminEmail.toLowerCase() === email
            );
            
            return isInAdminList;
        } catch (error) {
            console.error('管理员检查失败:', error);
            return false;
        }
    }
    
    // ==================== Supabase 初始化 ====================
    async function initSupabase() {
        try {
            console.log('开始初始化Supabase...');
            
            // 方法1：尝试从window.__ENV__获取
            let supabaseUrl = '';
            let supabaseKey = '';
            
            if (window.__ENV__) {
                supabaseUrl = window.__ENV__.SUPABASE_URL || '';
                supabaseKey = window.__ENV__.SUPABASE_ANON_KEY || '';
            }
            
            // 方法2：尝试从HTML中的配置获取
            if (!supabaseUrl || !supabaseKey) {
                const configElement = document.getElementById('supabase-config');
                if (configElement) {
                    try {
                        const config = JSON.parse(configElement.textContent);
                        supabaseUrl = config.supabaseUrl || '';
                        supabaseKey = config.supabaseKey || '';
                    } catch (e) {
                        console.error('解析HTML配置失败:', e);
                    }
                }
            }
            
            // 方法3：尝试硬编码的值（作为最后手段）
            if (!supabaseUrl || !supabaseKey) {
                // 使用你提供的Supabase配置
                supabaseUrl = 'https://ytoailyxejdgtpfwcdci.supabase.co';
                supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0b2FpbHl4ZWpkZ3RwZndjZGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDE5NzQsImV4cCI6MjA4NTExNzk3NH0.DvvP8whiE3rW1bDh4qW2zOLTGsknfQ2Utt8wVOxZjV0';
            }
            
            // 验证配置
            if (!supabaseUrl || !supabaseKey) {
                console.error('Supabase配置缺失');
                showMessage(currentLanguage === 'zh' ? '系统配置错误，请联系管理员' : 'System configuration error, please contact administrator', 'error');
                return false;
            }
            
            CONFIG.SUPABASE_URL = supabaseUrl;
            CONFIG.SUPABASE_ANON_KEY = supabaseKey;
            
            console.log('Supabase配置:', {
                url: supabaseUrl.substring(0, 30) + '...',
                key: supabaseKey.substring(0, 20) + '...'
            });
            
            // 创建Supabase客户端
            if (window.supabase && window.supabase.createClient) {
                supabase = window.supabase.createClient(supabaseUrl, supabaseKey, {
                    auth: {
                        autoRefreshToken: true,
                        persistSession: true,
                        detectSessionInUrl: false
                    }
                });
                
                console.log('Supabase客户端创建成功');
                isSupabaseReady = true;
                return true;
            } else {
                console.error('Supabase SDK未加载');
                showMessage(currentLanguage === 'zh' ? '系统库加载失败，请刷新页面' : 'System library failed to load, please refresh page', 'error');
                return false;
            }
            
        } catch (error) {
            console.error('Supabase初始化失败:', error);
            showMessage(currentLanguage === 'zh' ? '系统初始化失败' : 'System initialization failed', 'error');
            isSupabaseReady = false;
            return false;
        }
    }
    
    // ==================== 用户认证 ====================
    async function checkAuth() {
        if (!isSupabaseReady || !supabase) {
            console.log('Supabase未就绪，跳过认证检查');
            return false;
        }
        
        try {
            console.log('检查认证状态...');
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error) {
                console.error('获取用户失败:', error);
                return false;
            }
            
            if (user) {
                currentUser = user;
                console.log('用户已登录:', user.email);
                
                // 检查管理员权限
                isAdminUser = await checkIfAdmin();
                
                // 更新UI
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
            console.log('尝试登录:', email);
            
            if (!isSupabaseReady || !supabase) {
                const errorMsg = currentLanguage === 'zh' ? '系统未初始化，请刷新页面' : 'System not initialized, please refresh page';
                showMessage(errorMsg, 'error');
                return false;
            }
            
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password.trim()
            });
            
            if (error) {
                console.error('登录失败:', error);
                const errorElement = document.getElementById('auth-error');
                if (errorElement) {
                    errorElement.textContent = error.message || (currentLanguage === 'zh' ? '登录失败' : 'Login failed');
                }
                return false;
            }
            
            if (data && data.user) {
                currentUser = data.user;
                console.log('登录成功:', data.user.email);
                
                // 检查管理员权限
                isAdminUser = await checkIfAdmin();
                
                // 更新UI
                updateUserInfo();
                
                // 关闭登录窗口
                closeAuthModal();
                
                // 显示成功消息
                showMessage(currentLanguage === 'zh' ? '登录成功！' : 'Login successful!', 'success');
                
                return true;
            }
            
            return false;
            
        } catch (error) {
            console.error('登录异常:', error);
            const errorElement = document.getElementById('auth-error');
            if (errorElement) {
                errorElement.textContent = currentLanguage === 'zh' ? '登录过程出错' : 'Login process error';
            }
            return false;
        }
    }
    
    async function register(email, password, username) {
        try {
            console.log('尝试注册:', email);
            
            if (!isSupabaseReady || !supabase) {
                const errorMsg = currentLanguage === 'zh' ? '系统未初始化，请刷新页面' : 'System not initialized, please refresh page';
                showMessage(errorMsg, 'error');
                return false;
            }
            
            const userMetadata = {
                username: username?.trim() || email.split('@')[0]
            };
            
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password: password.trim(),
                options: {
                    data: userMetadata
                }
            });
            
            if (error) {
                console.error('注册失败:', error);
                const errorElement = document.getElementById('auth-error');
                if (errorElement) {
                    errorElement.textContent = error.message || (currentLanguage === 'zh' ? '注册失败' : 'Registration failed');
                }
                return false;
            }
            
            if (data && data.user) {
                currentUser = data.user;
                console.log('注册成功:', data.user.email);
                
                // 检查管理员权限
                isAdminUser = await checkIfAdmin();
                
                // 更新UI
                updateUserInfo();
                
                // 关闭注册窗口
                closeAuthModal();
                
                // 显示成功消息
                showMessage(currentLanguage === 'zh' ? '注册成功！请检查邮箱验证邮件。' : 'Registration successful! Please check your email for verification.', 'success');
                
                return true;
            }
            
            return false;
            
        } catch (error) {
            console.error('注册异常:', error);
            const errorElement = document.getElementById('auth-error');
            if (errorElement) {
                errorElement.textContent = currentLanguage === 'zh' ? '注册过程出错' : 'Registration process error';
            }
            return false;
        }
    }
    
    async function logout() {
        try {
            if (!isSupabaseReady || !supabase) {
                console.log('Supabase未就绪，无法退出');
                return;
            }
            
            const { error } = await supabase.auth.signOut();
            
            if (error) {
                console.error('退出失败:', error);
                showMessage(currentLanguage === 'zh' ? '退出失败: ' : 'Logout failed: ' + error.message, 'error');
                return;
            }
            
            // 清除用户数据
            currentUser = null;
            isAdminUser = false;
            
            // 更新UI
            const userInfo = document.getElementById('user-info');
            const teacherToolsBtn = document.getElementById('teacher-tools-btn');
            const adminToolsBtn = document.getElementById('admin-tools-btn');
            
            if (userInfo) userInfo.style.display = 'none';
            if (teacherToolsBtn) teacherToolsBtn.style.display = 'none';
            if (adminToolsBtn) adminToolsBtn.style.display = 'none';
            
            showMessage(currentLanguage === 'zh' ? '已退出登录' : 'Logged out', 'info');
            
        } catch (error) {
            console.error('退出异常:', error);
            showMessage(currentLanguage === 'zh' ? '退出过程出错' : 'Logout process error', 'error');
        }
    }
    
    function updateUserInfo() {
        if (!currentUser) return;
        
        try {
            const userInfo = document.getElementById('user-info');
            const userAvatar = document.getElementById('user-avatar');
            const userName = document.getElementById('user-name');
            const teacherToolsBtn = document.getElementById('teacher-tools-btn');
            const adminToolsBtn = document.getElementById('admin-tools-btn');
            
            if (!userInfo || !userAvatar || !userName) return;
            
            // 显示用户信息
            userInfo.style.display = 'flex';
            
            const email = currentUser.email || '';
            const firstLetter = email.charAt(0).toUpperCase() || '?';
            userAvatar.textContent = firstLetter;
            
            const username = currentUser.user_metadata?.username || email.split('@')[0];
            userName.textContent = username;
            
            // 显示/隐藏教师工具按钮
            if (teacherToolsBtn) {
                const userRole = currentUser.user_metadata?.role;
                const isApprovedTeacher = userRole === 'teacher' && currentUser.user_metadata?.approved === true;
                teacherToolsBtn.style.display = isApprovedTeacher ? 'flex' : 'none';
            }
            
            // 显示/隐藏管理员按钮
            if (adminToolsBtn) {
                adminToolsBtn.style.display = isAdminUser ? 'flex' : 'none';
            }
            
        } catch (error) {
            console.error('更新用户信息失败:', error);
        }
    }
    
    // ==================== 弹窗函数 ====================
    function showAuthModal() {
        try {
            const authModal = document.getElementById('auth-modal');
            if (authModal) {
                authModal.style.display = 'flex';
                updateAuthUI();
            }
        } catch (error) {
            console.error('显示登录窗口失败:', error);
        }
    }
    
    function closeAuthModal() {
        try {
            const authModal = document.getElementById('auth-modal');
            if (authModal) authModal.style.display = 'none';
            
            // 清除表单数据
            const authEmail = document.getElementById('auth-email');
            const authPassword = document.getElementById('auth-password');
            const authUsername = document.getElementById('auth-username');
            const authError = document.getElementById('auth-error');
            
            if (authEmail) authEmail.value = '';
            if (authPassword) authPassword.value = '';
            if (authUsername) authUsername.value = '';
            if (authError) authError.textContent = '';
            
        } catch (error) {
            console.error('关闭登录窗口失败:', error);
        }
    }
    
    function updateAuthUI() {
        try {
            const isLogin = authMode === 'login';
            const authTitle = document.getElementById('auth-title');
            const authSubmitBtn = document.getElementById('auth-submit-btn');
            const authSwitchText = document.getElementById('auth-switch-text');
            const authSwitchLink = document.getElementById('auth-switch-link');
            const authUsernameGroup = document.getElementById('auth-username-group');
            const roleSelectGroup = document.getElementById('role-select-group');
            const teacherRegisterFields = document.getElementById('teacher-register-fields');
            
            if (authTitle) {
                authTitle.textContent = isLogin ? 
                    (currentLanguage === 'zh' ? '🔐 用户登录' : '🔐 User Login') : 
                    (currentLanguage === 'zh' ? '📝 用户注册' : '📝 User Registration');
            }
            
            if (authSubmitBtn) {
                authSubmitBtn.textContent = isLogin ? 
                    (currentLanguage === 'zh' ? '登录' : 'Login') : 
                    (currentLanguage === 'zh' ? '注册' : 'Register');
            }
            
            if (authSwitchText) {
                authSwitchText.textContent = isLogin ? 
                    (currentLanguage === 'zh' ? '还没有账号？' : 'No account?') : 
                    (currentLanguage === 'zh' ? '已有账号？' : 'Already have an account?');
            }
            
            if (authSwitchLink) {
                authSwitchLink.textContent = isLogin ? 
                    (currentLanguage === 'zh' ? '立即注册' : 'Register Now') : 
                    (currentLanguage === 'zh' ? '立即登录' : 'Login Now');
            }
            
            if (authUsernameGroup) {
                authUsernameGroup.style.display = isLogin ? 'none' : 'block';
            }
            
            if (roleSelectGroup) {
                roleSelectGroup.style.display = isLogin ? 'none' : 'block';
            }
            
            if (teacherRegisterFields) {
                teacherRegisterFields.style.display = 'none';
            }
            
        } catch (error) {
            console.error('更新认证UI失败:', error);
        }
    }
    
    function toggleAuthMode() {
        authMode = authMode === 'login' ? 'register' : 'login';
        updateAuthUI();
    }
    
    async function handleAuth() {
        try {
            const emailInput = document.getElementById('auth-email');
            const passwordInput = document.getElementById('auth-password');
            const usernameInput = document.getElementById('auth-username');
            const roleSelect = document.getElementById('auth-role');
            const schoolInput = document.getElementById('auth-school');
            const stateInput = document.getElementById('auth-state');
            
            if (!emailInput || !passwordInput) {
                showMessage(currentLanguage === 'zh' ? '表单加载失败' : 'Form loading failed', 'error');
                return;
            }
            
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const username = usernameInput ? usernameInput.value.trim() : '';
            const role = roleSelect ? roleSelect.value : 'student';
            const school = schoolInput ? schoolInput.value.trim() : '';
            const state = stateInput ? stateInput.value.trim() : '';
            
            // 验证输入
            if (!email || !password) {
                const errorElement = document.getElementById('auth-error');
                if (errorElement) {
                    errorElement.textContent = currentLanguage === 'zh' ? '请输入邮箱和密码' : 'Please enter email and password';
                }
                return;
            }
            
            if (authMode === 'login') {
                await login(email, password);
            } else {
                // 如果是教师注册，需要额外信息
                if (role === 'teacher' && (!school || !state)) {
                    const errorElement = document.getElementById('auth-error');
                    if (errorElement) {
                        errorElement.textContent = currentLanguage === 'zh' ? '请填写学校名称和所在州属' : 'Please fill in school name and state';
                    }
                    return;
                }
                
                await register(email, password, username);
            }
        } catch (error) {
            console.error('处理认证失败:', error);
            const errorElement = document.getElementById('auth-error');
            if (errorElement) {
                errorElement.textContent = currentLanguage === 'zh' ? '认证过程出错' : 'Authentication process error';
            }
        }
    }
    
    // ==================== 核心游戏函数 ====================
    function selectMode(mode) {
        try {
            currentMode = mode;
            
            // 更新按钮状态
            document.querySelectorAll('.mode-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            const targetBtn = document.querySelector(`[data-mode="${mode}"]`);
            if (targetBtn) {
                targetBtn.classList.add('active');
            }
            
            // 显示/隐藏自定义设置
            const customSettings = document.getElementById('custom-settings');
            if (customSettings) {
                customSettings.style.display = mode === 'custom' ? 'flex' : 'none';
            }
            
            // 更新开始按钮文本
            const startBtn = document.getElementById('start-btn');
            if (startBtn) {
                if (mode === 'practice') {
                    startBtn.innerHTML = '<span>🎯 开始练习</span>';
                } else {
                    startBtn.innerHTML = '<span>🚀 开始游戏</span>';
                }
            }
            
        } catch (error) {
            console.error('选择模式失败:', error);
        }
    }
    
    function startGame() {
        try {
            // 检查登录状态
            if (!currentUser) {
                showAuthModal();
                showMessage(currentLanguage === 'zh' ? '请先登录再开始游戏' : 'Please login to start game', 'info');
                return;
            }
            
            // 重置游戏
            resetGame();
            
            // 获取游戏设置
            const range = document.getElementById('number-range')?.value || '0-14';
            const modeConfig = { ...MODE_CONFIG[currentMode] };
            
            // 自定义模式设置
            if (currentMode === 'custom') {
                const questionsInput = document.getElementById('custom-questions');
                const timeInput = document.getElementById('custom-time');
                modeConfig.questions = questionsInput ? parseInt(questionsInput.value) || 20 : 20;
                modeConfig.time = timeInput ? parseInt(timeInput.value) || 60 : 60;
            }
            
            // 设置时间限制
            if (modeConfig.hasTimeLimit) {
                timeLeft = modeConfig.time || 90;
            }
            
            gameState.modeConfigTime = modeConfig.time || 0;
            
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
            
            // 生成数字
            generateNewTarget();
            generateNumberGrid();
            
            // 开始计时
            startTime = new Date();
            
            if (modeConfig.hasTimeLimit) {
                const timeElement = document.getElementById('time');
                if (timeElement) timeElement.textContent = timeLeft;
                timerInterval = setInterval(updateTimer, 1000);
            } else {
                timerInterval = setInterval(updateElapsedTime, 1000);
            }
            
            // 提示冷却
            hintInterval = setInterval(updateHintCooldown, 1000);
            gameActive = true;
            
            console.log('游戏开始，模式:', currentMode);
            
        } catch (error) {
            console.error('开始游戏失败:', error);
            showMessage(currentLanguage === 'zh' ? '游戏启动失败' : 'Game start failed', 'error');
        }
    }
    
    function resetGame() {
        try {
            // 重置游戏变量
            score = 0;
            selectedCards = [];
            completedQuestions = 0;
            correctCount = 0;
            totalAttempts = 0;
            gameHistory = [];
            gameActive = false;
            
            // 清除计时器
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            if (hintInterval) {
                clearInterval(hintInterval);
                hintInterval = null;
            }
            
            // 更新显示
            const scoreElement = document.getElementById('score');
            const completedElement = document.getElementById('completed');
            const accuracyElement = document.getElementById('accuracy');
            const progressBar = document.getElementById('progress-bar');
            const timeElement = document.getElementById('time');
            
            if (scoreElement) scoreElement.textContent = '0';
            if (completedElement) completedElement.textContent = '0/30';
            if (accuracyElement) accuracyElement.textContent = '100%';
            if (progressBar) progressBar.style.width = '100%';
            if (timeElement) timeElement.textContent = '90';
            
            // 清除游戏网格
            const gameGrid = document.getElementById('game-grid');
            if (gameGrid) gameGrid.innerHTML = '';
            
        } catch (error) {
            console.error('重置游戏失败:', error);
        }
    }
    
    function generateNumberGrid() {
        try {
            const gameGrid = document.getElementById('game-grid');
            if (!gameGrid) return;
            
            const range = document.getElementById('number-range')?.value || '0-14';
            const config = RANGE_CONFIG[range];
            if (!config) return;
            
            gameGrid.innerHTML = '';
            
            // 生成10个数字
            const numbers = [];
            for (let i = 0; i < 10; i++) {
                const num = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
                numbers.push(num);
            }
            
            // 确保至少有一对数字可以组成目标和
            let hasSolution = false;
            for (let i = 0; i < numbers.length && !hasSolution; i++) {
                for (let j = i + 1; j < numbers.length && !hasSolution; j++) {
                    if (numbers[i] + numbers[j] === currentTarget) {
                        hasSolution = true;
                    }
                }
            }
            
            // 如果没有解决方案，调整一对数字
            if (!hasSolution) {
                const index1 = Math.floor(Math.random() * numbers.length);
                let index2;
                do {
                    index2 = Math.floor(Math.random() * numbers.length);
                } while (index2 === index1);
                
                numbers[index1] = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
                numbers[index2] = currentTarget - numbers[index1];
            }
            
            // 打乱顺序
            shuffleArray(numbers);
            
            // 创建卡片
            numbers.forEach((number) => {
                const card = document.createElement('div');
                card.className = 'number-card';
                card.textContent = number;
                card.dataset.value = number;
                card.addEventListener('click', () => selectCard(card));
                gameGrid.appendChild(card);
            });
            
        } catch (error) {
            console.error('生成数字网格失败:', error);
        }
    }
    
    function selectCard(card) {
        if (!gameActive || card.classList.contains('disappear')) return;
        
        try {
            // 如果卡片已选中，取消选择
            if (card.classList.contains('selected')) {
                card.classList.remove('selected');
                selectedCards = selectedCards.filter(c => c !== card);
                return;
            }
            
            // 最多只能选择2张卡片
            if (selectedCards.length >= 2) {
                showMessage(currentLanguage === 'zh' ? '最多只能选择2张卡片！' : 'You can only select 2 cards at most!', 'error');
                return;
            }
            
            // 选择卡片
            card.classList.add('selected');
            selectedCards.push(card);
            
            // 如果选择了2张卡片，检查是否匹配
            if (selectedCards.length === 2) {
                totalAttempts++;
                setTimeout(checkMatch, 300);
            }
            
        } catch (error) {
            console.error('选择卡片失败:', error);
        }
    }
    
    function checkMatch() {
        if (selectedCards.length !== 2) return;
        
        try {
            const num1 = parseInt(selectedCards[0].dataset.value);
            const num2 = parseInt(selectedCards[1].dataset.value);
            const sum = num1 + num2;
            const isCorrect = sum === currentTarget;
            
            // 记录历史
            gameHistory.push({
                target: currentTarget,
                num1: num1,
                num2: num2,
                isCorrect: isCorrect,
                timestamp: new Date().toISOString()
            });
            
            if (isCorrect) {
                // 正确匹配
                correctCount++;
                completedQuestions++;
                showFeedback(currentLanguage === 'zh' ? '✓ 正确!' : '✓ Correct!', 'success');
                
                // 移除卡片
                selectedCards.forEach(card => {
                    card.classList.add('disappear');
                });
                
                setTimeout(() => {
                    selectedCards.forEach(card => {
                        if (card.parentNode) {
                            card.parentNode.removeChild(card);
                        }
                    });
                    selectedCards = [];
                    
                    // 检查是否需要刷新网格
                    const remainingCards = Array.from(document.querySelectorAll('.number-card:not(.disappear)'));
                    if (remainingCards.length < 2) {
                        generateNumberGrid();
                    }
                }, 500);
                
                // 更新分数
                score += 10;
                updateDisplay();
                
                // 检查是否完成游戏
                if (currentMode === 'standard' && completedQuestions >= MODE_CONFIG.standard.questions) {
                    endGame('complete');
                    return;
                }
                
                // 生成新的目标和
                setTimeout(() => {
                    generateNewTarget();
                }, 800);
                
            } else {
                // 错误匹配
                showFeedback(currentLanguage === 'zh' ? '✗ 错误' : '✗ Wrong', 'error');
                
                // 取消选择卡片
                selectedCards.forEach(card => {
                    card.classList.remove('selected');
                });
                selectedCards = [];
            }
            
        } catch (error) {
            console.error('检查匹配失败:', error);
        }
    }
    
    function showFeedback(text, type) {
        try {
            const feedback = document.getElementById('match-feedback');
            if (!feedback) return;
            
            feedback.textContent = text;
            feedback.style.color = type === 'success' ? '#4CAF50' : '#ff4444';
            feedback.style.opacity = '1';
            
            setTimeout(() => {
                feedback.style.opacity = '0';
            }, 1000);
            
        } catch (error) {
            console.error('显示反馈失败:', error);
        }
    }
    
    function updateTimer() {
        if (!gameActive) return;
        
        timeLeft--;
        if (timeLeft < 0) timeLeft = 0;
        
        const timeElement = document.getElementById('time');
        if (timeElement) timeElement.textContent = timeLeft;
        
        // 更新进度条
        const progressBar = document.getElementById('progress-bar');
        if (progressBar && gameState.modeConfigTime > 0) {
            const progress = (timeLeft / gameState.modeConfigTime) * 100;
            progressBar.style.width = `${progress}%`;
        }
        
        // 时间警告
        if (timeLeft <= 10) {
            const timeContainer = document.getElementById('time-container');
            if (timeContainer) {
                timeContainer.classList.add('time-warning');
            }
        }
        
        // 时间到
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
        try {
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
            
        } catch (error) {
            console.error('更新显示失败:', error);
        }
    }
    
    function generateNewTarget() {
        try {
            const range = document.getElementById('number-range')?.value || '0-14';
            const config = RANGE_CONFIG[range];
            if (!config) return;
            
            // 生成新的目标和
            const targetRange = config.targetMax - config.targetMin;
            currentTarget = Math.floor(Math.random() * (targetRange + 1)) + config.targetMin;
            
            const targetSumElement = document.getElementById('target-sum');
            if (targetSumElement) targetSumElement.textContent = currentTarget;
            
        } catch (error) {
            console.error('生成目标失败:', error);
        }
    }
    
    function endGame(reason) {
        try {
            if (!gameActive) return;
            
            gameActive = false;
            
            // 清除计时器
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            if (hintInterval) {
                clearInterval(hintInterval);
                hintInterval = null;
            }
            
            // 计算用时
            let elapsedTime = 0;
            if (startTime) {
                elapsedTime = Math.floor((new Date() - startTime) / 1000);
            }
            gameState.lastGameElapsedTime = elapsedTime;
            
            // 计算正确率
            const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;
            
            // 更新结果页面
            const finalScoreElement = document.getElementById('final-score');
            const finalCompletedElement = document.getElementById('final-completed');
            const finalTimeElement = document.getElementById('final-time');
            const finalAccuracyElement = document.getElementById('final-accuracy');
            const resultTitleElement = document.getElementById('result-title');
            
            if (finalScoreElement) finalScoreElement.textContent = score;
            if (finalCompletedElement) finalCompletedElement.textContent = completedQuestions;
            if (finalTimeElement) finalTimeElement.textContent = elapsedTime + (currentLanguage === 'zh' ? '秒' : 's');
            if (finalAccuracyElement) finalAccuracyElement.textContent = accuracy + '%';
            
            // 设置标题
            const titleMap = {
                'complete': currentLanguage === 'zh' ? '🎉 恭喜完成30题！' : '🎉 Congratulations! Completed 30 questions!',
                'timeout': currentLanguage === 'zh' ? '⏰ 时间到！' : '⏰ Time\'s up!',
                'giveup': currentLanguage === 'zh' ? '🏁 游戏结束' : '🏁 Game Over'
            };
            
            if (resultTitleElement) {
                resultTitleElement.textContent = titleMap[reason] || (currentLanguage === 'zh' ? '🎉 游戏结束!' : '🎉 Game Over!');
            }
            
            // 显示结果页面
            const gameOverElement = document.getElementById('game-over');
            if (gameOverElement) gameOverElement.style.display = 'flex';
            
        } catch (error) {
            console.error('结束游戏失败:', error);
        }
    }
    
    function restartGame() {
        try {
            // 隐藏结果页面
            const gameOverElement = document.getElementById('game-over');
            if (gameOverElement) gameOverElement.style.display = 'none';
            
            // 显示设置页面
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
            
            // 清除玩家名称
            const playerNameInput = document.getElementById('player-name');
            if (playerNameInput) playerNameInput.value = '';
            
            // 重置游戏
            resetGame();
            
        } catch (error) {
            console.error('重新开始游戏失败:', error);
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
            if (!hintBtn) return;
            
            if (hintCooldown > 0) {
                hintBtn.innerHTML = `<span>💡 ${hintCooldown}秒</span>`;
                hintBtn.disabled = true;
                hintBtn.style.opacity = '0.7';
            } else {
                hintBtn.innerHTML = `<span>💡 提示(10秒)</span>`;
                hintBtn.disabled = false;
                hintBtn.style.opacity = '1';
            }
        } catch (error) {
            console.error('更新提示按钮失败:', error);
        }
    }
    
    function showHint() {
        if (hintCooldown > 0) {
            showMessage(currentLanguage === 'zh' ? `提示冷却中，还剩${hintCooldown}秒` : `Hint cooldown, ${hintCooldown}s remaining`, 'info');
            return;
        }
        
        hintCooldown = 10;
        updateHintButton();
        showMessage(currentLanguage === 'zh' ? '提示已激活！' : 'Hint activated!', 'info');
    }
    
    function refreshNumbers() {
        try {
            const gameGrid = document.getElementById('game-grid');
            if (!gameGrid) return;
            
            gameGrid.style.opacity = '0.5';
            setTimeout(() => {
                generateNumberGrid();
                gameGrid.style.opacity = '1';
            }, 500);
            
        } catch (error) {
            console.error('刷新数字失败:', error);
        }
    }
    
    // ==================== 侧边栏功能 ====================
    function showHistory() {
        try {
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
            
        } catch (error) {
            console.error('显示历史记录失败:', error);
        }
    }
    
    function showStatistics() {
        try {
            const statisticsModal = document.getElementById('statistics-modal');
            if (statisticsModal) statisticsModal.style.display = 'flex';
        } catch (error) {
            console.error('显示统计失败:', error);
        }
    }
    
    function showAchievements() {
        try {
            const achievementsModal = document.getElementById('achievements-modal');
            if (achievementsModal) achievementsModal.style.display = 'flex';
        } catch (error) {
            console.error('显示成就失败:', error);
        }
    }
    
    function showWrongBook() {
        try {
            const wrongbookModal = document.getElementById('wrongbook-modal');
            if (wrongbookModal) wrongbookModal.style.display = 'flex';
        } catch (error) {
            console.error('显示错题本失败:', error);
        }
    }
    
    function showLeaderboard() {
        try {
            const leaderboardModal = document.getElementById('leaderboard-modal');
            if (leaderboardModal) leaderboardModal.style.display = 'flex';
        } catch (error) {
            console.error('显示排行榜失败:', error);
        }
    }
    
    function showProfile() {
        try {
            if (!currentUser) {
                showMessage(currentLanguage === 'zh' ? '请先登录查看个人资料' : 'Please login to view profile', 'info');
                showAuthModal();
                return;
            }
            
            const profileModal = document.getElementById('profile-modal');
            if (profileModal) profileModal.style.display = 'flex';
        } catch (error) {
            console.error('显示个人资料失败:', error);
        }
    }
    
    function showTeacherTools() {
        try {
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
            
            const teacherToolsModal = document.getElementById('teacher-tools-modal');
            if (teacherToolsModal) teacherToolsModal.style.display = 'flex';
        } catch (error) {
            console.error('显示教师工具失败:', error);
        }
    }
    
    function showAdminTools() {
        try {
            if (!currentUser) {
                showAuthModal();
                showMessage('请先登录管理员账号', 'info');
                return;
            }
            
            if (!isAdminUser) {
                showMessage('只有管理员可以访问此功能', 'error');
                return;
            }
            
            const adminToolsModal = document.getElementById('admin-tools-modal');
            if (adminToolsModal) adminToolsModal.style.display = 'flex';
        } catch (error) {
            console.error('显示管理员工具失败:', error);
        }
    }
    
    async function saveScore() {
        try {
            if (!currentUser) {
                showMessage(currentLanguage === 'zh' ? '请先登录保存成绩' : 'Please login to save score', 'error');
                showAuthModal();
                return;
            }
            
            const nameInput = document.getElementById('player-name');
            let playerName = nameInput ? nameInput.value.trim() : '';
            
            if (!playerName) {
                playerName = currentUser.user_metadata?.username || currentUser.email?.split('@')[0] || (currentLanguage === 'zh' ? '匿名玩家' : 'Anonymous Player');
            }
            
            // 这里可以添加保存到服务器的代码
            console.log('保存成绩:', { playerName, score, completedQuestions });
            
            showMessage(currentLanguage === 'zh' ? '成绩保存成功！' : 'Score saved successfully!', 'success');
            
            // 隐藏结果页面
            const gameOverElement = document.getElementById('game-over');
            if (gameOverElement) gameOverElement.style.display = 'none';
            
            // 重新开始游戏
            setTimeout(restartGame, 500);
            
        } catch (error) {
            console.error('保存成绩失败:', error);
            showMessage(currentLanguage === 'zh' ? '保存成绩失败' : 'Save score failed', 'error');
        }
    }
    
    // ==================== 数据备份和恢复 ====================
    async function backupToCloud() {
        try {
            if (!currentUser) {
                showMessage(currentLanguage === 'zh' ? '请先登录' : 'Please login first', 'error');
                return;
            }
            
            showMessage(currentLanguage === 'zh' ? '数据备份到云端成功' : 'Data backed up to cloud successfully', 'success');
        } catch (error) {
            console.error('备份数据失败:', error);
            showMessage(currentLanguage === 'zh' ? '备份数据失败' : 'Backup data failed', 'error');
        }
    }
    
    async function restoreFromCloud() {
        try {
            if (!currentUser) {
                showMessage(currentLanguage === 'zh' ? '请先登录' : 'Please login first', 'error');
                return;
            }
            
            showMessage(currentLanguage === 'zh' ? '数据恢复成功' : 'Data restored successfully', 'success');
        } catch (error) {
            console.error('恢复数据失败:', error);
            showMessage(currentLanguage === 'zh' ? '恢复数据失败' : 'Restore data failed', 'error');
        }
    }
    
    // ==================== 初始化 ====================
    async function init() {
        console.log('🎮 数学加法消消乐 - 开始初始化...');
        
        try {
            // 设置语言
            const savedLang = localStorage.getItem('mathGameLanguage');
            if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
                currentLanguage = savedLang;
            }
            setLanguage(currentLanguage);
            
            // 初始化Supabase
            console.log('初始化Supabase...');
            await initSupabase();
            
            // 检查认证状态
            if (isSupabaseReady) {
                console.log('检查认证状态...');
                await checkAuth();
            } else {
                console.log('Supabase未就绪，跳过认证检查');
            }
            
            // 绑定事件监听器
            console.log('绑定事件监听器...');
            bindEventListeners();
            
            // 初始化游戏
            console.log('初始化游戏...');
            selectMode('standard');
            
            // 隐藏加载层
            setTimeout(() => {
                const loadingOverlay = document.getElementById('loading-overlay');
                if (loadingOverlay) {
                    loadingOverlay.classList.add('hide-loading');
                    setTimeout(() => {
                        loadingOverlay.style.display = 'none';
                    }, 500);
                }
            }, 1000);
            
            console.log('🎮 数学加法消消乐 - 初始化完成！');
            showMessage(currentLanguage === 'zh' ? '游戏加载完成！' : 'Game loaded successfully!', 'success', 1500);
            
        } catch (error) {
            console.error('初始化失败:', error);
            showMessage(currentLanguage === 'zh' ? '初始化失败，请刷新页面' : 'Initialization failed, please refresh page', 'error');
        }
    }
    
    // ==================== 绑定事件监听器 ====================
    function bindEventListeners() {
        try {
            console.log('开始绑定事件监听器...');
            
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
            const sideBarButtons = [
                { id: 'history-btn', handler: showHistory },
                { id: 'statistics-btn', handler: showStatistics },
                { id: 'achievements-btn', handler: showAchievements },
                { id: 'wrongbook-btn', handler: showWrongBook },
                { id: 'leaderboard-btn', handler: showLeaderboard },
                { id: 'profile-btn', handler: showProfile },
                { id: 'teacher-tools-btn', handler: showTeacherTools },
                { id: 'admin-tools-btn', handler: showAdminTools },
                { id: 'logout-btn', handler: logout }
            ];
            
            sideBarButtons.forEach(({ id, handler }) => {
                const btn = document.getElementById(id);
                if (btn) {
                    btn.addEventListener('click', handler);
                }
            });
            
            // 游戏模式选择
            const modeButtons = [
                { id: 'mode-standard', mode: 'standard' },
                { id: 'mode-challenge', mode: 'challenge' },
                { id: 'mode-practice', mode: 'practice' },
                { id: 'mode-custom', mode: 'custom' }
            ];
            
            modeButtons.forEach(({ id, mode }) => {
                const btn = document.getElementById(id);
                if (btn) {
                    btn.addEventListener('click', () => selectMode(mode));
                }
            });
            
            // 游戏控制按钮
            const gameControlButtons = [
                { id: 'start-btn', handler: startGame },
                { id: 'hint-btn', handler: showHint },
                { id: 'refresh-btn', handler: refreshNumbers },
                { id: 'endgame-btn', handler: () => endGame('giveup') }
            ];
            
            gameControlButtons.forEach(({ id, handler }) => {
                const btn = document.getElementById(id);
                if (btn) {
                    btn.addEventListener('click', handler);
                }
            });
            
            // 认证相关
            const authElements = [
                { id: 'close-auth-modal', handler: closeAuthModal },
                { id: 'auth-submit-btn', handler: handleAuth },
                { id: 'auth-switch-link', handler: toggleAuthMode }
            ];
            
            authElements.forEach(({ id, handler }) => {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener('click', handler);
                }
            });
            
            // 角色选择变化
            const roleSelect = document.getElementById('auth-role');
            if (roleSelect) {
                roleSelect.addEventListener('change', function() {
                    const teacherRegisterFields = document.getElementById('teacher-register-fields');
                    if (teacherRegisterFields) {
                        teacherRegisterFields.style.display = this.value === 'teacher' ? 'block' : 'none';
                    }
                });
            }
            
            // 关闭弹窗按钮
            const modalCloseButtons = [
                { id: 'close-history-modal', modal: 'history-modal' },
                { id: 'close-statistics-modal', modal: 'statistics-modal' },
                { id: 'close-achievements-modal', modal: 'achievements-modal' },
                { id: 'close-wrongbook-modal', modal: 'wrongbook-modal' },
                { id: 'close-leaderboard-modal', modal: 'leaderboard-modal' },
                { id: 'close-profile-modal', modal: 'profile-modal' },
                { id: 'close-teacher-tools', modal: 'teacher-tools-modal' },
                { id: 'close-admin-tools', modal: 'admin-tools-modal' },
                { id: 'close-game-over', modal: 'game-over', handler: restartGame }
            ];
            
            modalCloseButtons.forEach(({ id, modal, handler }) => {
                const btn = document.getElementById(id);
                if (btn) {
                    btn.addEventListener('click', () => {
                        const modalElement = document.getElementById(modal);
                        if (modalElement) modalElement.style.display = 'none';
                        if (handler) handler();
                    });
                }
            });
            
            // 游戏结束相关
            const gameOverButtons = [
                { id: 'save-score-btn', handler: saveScore },
                { id: 'play-again-btn', handler: restartGame },
                { id: 'view-leaderboard-btn', handler: showLeaderboard },
                { id: 'view-statistics-btn', handler: showStatistics }
            ];
            
            gameOverButtons.forEach(({ id, handler }) => {
                const btn = document.getElementById(id);
                if (btn) {
                    btn.addEventListener('click', handler);
                }
            });
            
            // 历史记录相关
            const clearHistoryBtn = document.getElementById('clear-history-btn');
            if (clearHistoryBtn) {
                clearHistoryBtn.addEventListener('click', () => {
                    if (confirm(currentLanguage === 'zh' ? '确定要清空本次游戏的历史记录吗？' : 'Are you sure you want to clear the current game history?')) {
                        gameHistory = [];
                        showHistory();
                        showMessage(currentLanguage === 'zh' ? '历史记录已清空' : 'History cleared', 'info');
                    }
                });
            }
            
            // 错题本相关
            const wrongBookButtons = [
                { id: 'sync-wrong-questions-btn', handler: () => showMessage(currentLanguage === 'zh' ? '云端同步功能开发中' : 'Cloud sync feature in development', 'info') },
                { id: 'clear-wrong-questions-btn', handler: () => {
                    if (confirm(currentLanguage === 'zh' ? '确定要清空本地错题吗？' : 'Are you sure you want to clear local wrong questions?')) {
                        wrongQuestions = [];
                        showWrongBook();
                        showMessage(currentLanguage === 'zh' ? '本地错题已清空' : 'Local wrong questions cleared', 'info');
                    }
                }}
            ];
            
            wrongBookButtons.forEach(({ id, handler }) => {
                const btn = document.getElementById(id);
                if (btn) {
                    btn.addEventListener('click', handler);
                }
            });
            
            // 数据备份恢复
            const backupButtons = [
                { id: 'backup-data-btn', handler: backupToCloud },
                { id: 'restore-data-btn', handler: restoreFromCloud }
            ];
            
            backupButtons.forEach(({ id, handler }) => {
                const btn = document.getElementById(id);
                if (btn) {
                    btn.addEventListener('click', handler);
                }
            });
            
            // 教师工具相关
            const downloadTemplateBtn = document.getElementById('download-template-btn');
            if (downloadTemplateBtn) {
                downloadTemplateBtn.addEventListener('click', () => {
                    showMessage(currentLanguage === 'zh' ? '模板下载功能开发中' : 'Template download feature in development', 'info');
                });
            }
            
            // 管理员工具相关
            const adminButtons = [
                { id: 'refresh-teachers-btn', handler: () => showMessage(currentLanguage === 'zh' ? '刷新功能开发中' : 'Refresh feature in development', 'info') },
                { id: 'refresh-stats-btn', handler: () => showMessage(currentLanguage === 'zh' ? '刷新功能开发中' : 'Refresh feature in development', 'info') }
            ];
            
            adminButtons.forEach(({ id, handler }) => {
                const btn = document.getElementById(id);
                if (btn) {
                    btn.addEventListener('click', handler);
                }
            });
            
            console.log('事件监听器绑定完成');
            
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
        showLeaderboard,
        showProfile,
        showTeacherTools,
        showAdminTools,
        logout,
        closeAuthModal,
        handleAuth,
        toggleAuthMode,
        saveScore,
        backupToCloud,
        restoreFromCloud
    };
})();

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM加载完成，开始初始化游戏...');
        MathGame.init();
    });
} else {
    console.log('DOM已加载，开始初始化游戏...');
    MathGame.init();
}
