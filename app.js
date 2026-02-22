// ==================== app.js ====================
// 数学加法消消乐 - 区域学校多租户版
// 版本: 5.0.0 (最终生产版)
// 依赖: Supabase, 现代浏览器
// ====================

(function() {
    'use strict';

    // ==================== 全局配置 ====================
    const CONFIG = {
        SUPABASE_URLS: [
            'https://ytoailyxejdgtpfwcdci.supabase.co'
        ],
        SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0b2FpbHl4ZWpkZ3RwZndjZGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDE5NzQsImV4cCI6MjA4NTExNzk3NH0.DvvP8whiE3rW1bDh4qW2zOLTGsknfQ2Utt8wVOxZjV0',
        SYNC_INTERVAL: 300000,
        MAX_HISTORY: 100,
        MAX_WRONG: 200,
        GRID_SIZE: 10,
        DEFAULT_QUESTIONS: 30,
        DEFAULT_TIME: 90,
        VERSION: '5.0.0'
    };

    // ==================== 多语言翻译 ====================
    const TRANSLATIONS = {
        zh: {
            gameTitle: '🧮 数学加法消消乐',
            gameSubtitle: '区域学校版 | 云端同步 | 实时排行榜',
            history: '历史记录',
            statistics: '统计',
            achievements: '成就',
            wrongBook: '错题本',
            leaderboard: '排行榜',
            profile: '个人资料',
            modeStandard: '📚 挑战30',
            modeStandardDesc: '完成30题，比拼用时',
            modeChallenge: '⚡ 激情90秒',
            modeChallengeDesc: '90秒时间，比拼题数',
            modePractice: '🎯 练习模式',
            modePracticeDesc: '无时间限制，专心学习',
            modeCustom: '⚙️ 自定义',
            modeCustomDesc: '自设参数，灵活练习',
            numberRange: '数字范围',
            rangeEasy: '0-9 (简单)',
            rangeStandard: '0-14 (标准)',
            rangeChallenge: '5-18 (挑战)',
            startGame: '开始游戏',
            startPractice: '开始练习',
            questionCount: '题目数量',
            timeLimit: '时间限制(秒)',
            scoreLabel: '得分',
            completedLabel: '完成题数',
            timeLeft: '剩余时间',
            timeUsed: '已用时间',
            accuracyLabel: '正确率',
            targetSum: '目标和',
            hintButton: '提示',
            refreshButton: '刷新',
            endGameButton: '结束',
            user: '用户',
            logout: '退出',
            loginTitle: '用户登录',
            registerTitle: '用户注册',
            emailLabel: '邮箱地址',
            passwordLabel: '密码',
            usernameLabel: '用户名',
            loginButton: '登录',
            registerButton: '注册',
            noAccount: '还没有账号？',
            registerNow: '立即注册',
            hasAccount: '已有账号？',
            loginNow: '立即登录',
            needLogin: '请先登录',
            offlineMode: '离线模式',
            connecting: '连接服务器...',
            connectionFailed: '连接失败',
            retryConnection: '重试连接',
            cloudConnected: '已连接云端',
            syncSuccess: '同步成功',
            syncFailed: '同步失败',
            gameComplete: '恭喜完成30题！',
            gameTimeout: '时间到！',
            gameGiveup: '游戏结束',
            gameEnd: '游戏结束!',
            finalScore: '最终得分',
            finalCompleted: '完成题数',
            finalTime: '用时',
            finalAccuracy: '正确率',
            playerNamePlaceholder: '请输入名字',
            saveScore: '保存成绩',
            playAgain: '再玩一次',
            viewLeaderboard: '查看排行榜',
            viewStatistics: '查看统计',
            noData: '暂无数据',
            correct: '✓ 正确',
            wrong: '✗ 错误',
            seconds: '秒',
            noValidCombination: '没有可匹配的组合',
            maxTwoCards: '最多选择2张卡片',
            hintCooldown: '提示冷却中',
            hintActivated: '提示已激活',
            scoreSaved: '成绩已保存',
            loginFirst: '请先登录',
            loginToStart: '请先登录再开始游戏',
            teacherTools: '教师工具',
            adminTools: '管理工具',
            applyForTeacher: '教师申请',
            cloudSync: '云同步',
            refresh: '刷新',
            show: '显示',
            myBest: '我的最佳',
            bestScore: '最佳得分',
            bestAccuracy: '最佳正确率',
            bestTime: '最快用时',
            loading: '加载中...',
            pleaseWait: '请稍候',
            confirmClear: '确定清空吗？',
            yes: '确定',
            no: '取消'
        },
        en: {
            gameTitle: '🧮 Math Addition Match',
            gameSubtitle: 'School Edition | Cloud Sync | Leaderboard',
            history: 'History',
            statistics: 'Statistics',
            achievements: 'Achievements',
            wrongBook: 'Wrong Questions',
            leaderboard: 'Leaderboard',
            profile: 'Profile',
            modeStandard: '📚 Challenge 30',
            modeStandardDesc: 'Complete 30 questions',
            modeChallenge: '⚡ 90s Sprint',
            modeChallengeDesc: '90 seconds challenge',
            modePractice: '🎯 Practice',
            modePracticeDesc: 'No time limit',
            modeCustom: '⚙️ Custom',
            modeCustomDesc: 'Set your own',
            numberRange: 'Number Range',
            rangeEasy: '0-9 (Easy)',
            rangeStandard: '0-14 (Standard)',
            rangeChallenge: '5-18 (Challenge)',
            startGame: 'Start Game',
            startPractice: 'Start Practice',
            questionCount: 'Questions',
            timeLimit: 'Time (sec)',
            scoreLabel: 'Score',
            completedLabel: 'Completed',
            timeLeft: 'Time Left',
            timeUsed: 'Time Used',
            accuracyLabel: 'Accuracy',
            targetSum: 'Target Sum',
            hintButton: 'Hint',
            refreshButton: 'Refresh',
            endGameButton: 'End',
            user: 'User',
            logout: 'Logout',
            loginTitle: 'Login',
            registerTitle: 'Register',
            emailLabel: 'Email',
            passwordLabel: 'Password',
            usernameLabel: 'Username',
            loginButton: 'Login',
            registerButton: 'Register',
            noAccount: 'No account?',
            registerNow: 'Register',
            hasAccount: 'Have account?',
            loginNow: 'Login',
            needLogin: 'Please login',
            offlineMode: 'Offline Mode',
            connecting: 'Connecting...',
            connectionFailed: 'Connection failed',
            retryConnection: 'Retry',
            cloudConnected: 'Connected',
            syncSuccess: 'Sync success',
            syncFailed: 'Sync failed',
            gameComplete: 'Congratulations!',
            gameTimeout: 'Time\'s up!',
            gameGiveup: 'Game Over',
            gameEnd: 'Game Over!',
            finalScore: 'Final Score',
            finalCompleted: 'Completed',
            finalTime: 'Time',
            finalAccuracy: 'Accuracy',
            playerNamePlaceholder: 'Enter your name',
            saveScore: 'Save Score',
            playAgain: 'Play Again',
            viewLeaderboard: 'Leaderboard',
            viewStatistics: 'Statistics',
            noData: 'No Data',
            correct: '✓ Correct',
            wrong: '✗ Wrong',
            seconds: 's',
            noValidCombination: 'No valid combination',
            maxTwoCards: 'Select 2 cards max',
            hintCooldown: 'Cooldown',
            hintActivated: 'Hint activated',
            scoreSaved: 'Score saved',
            loginFirst: 'Login first',
            loginToStart: 'Login to start',
            teacherTools: 'Teacher Tools',
            adminTools: 'Admin Tools',
            applyForTeacher: 'Apply Teacher',
            cloudSync: 'Cloud Sync',
            refresh: 'Refresh',
            show: 'Show',
            myBest: 'My Best',
            bestScore: 'Best Score',
            bestAccuracy: 'Best Accuracy',
            bestTime: 'Fastest Time',
            loading: 'Loading...',
            pleaseWait: 'Please wait',
            confirmClear: 'Confirm clear?',
            yes: 'Yes',
            no: 'No'
        }
    };

    // ==================== 游戏配置 ====================
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

    // ==================== 成就配置 ====================
    const ACHIEVEMENTS = [
        { id: 'victory_bronze', name: '初出茅庐', desc: '完成第1局', icon: '🥉', requirement: { type: 'games', value: 1 } },
        { id: 'victory_silver', name: '小试牛刀', desc: '完成10局', icon: '🥈', requirement: { type: 'games', value: 10 } },
        { id: 'victory_gold', name: '常胜将军', desc: '完成50局', icon: '🥇', requirement: { type: 'games', value: 50 } },
        { id: 'score_bronze', name: '得分新秀', desc: '单局30分', icon: '🥉', requirement: { type: 'score', value: 30 } },
        { id: 'score_silver', name: '得分高手', desc: '单局50分', icon: '🥈', requirement: { type: 'score', value: 50 } },
        { id: 'score_gold', name: '得分王者', desc: '单局100分', icon: '🥇', requirement: { type: 'score', value: 100 } },
        { id: 'accuracy_bronze', name: '稳扎稳打', desc: '正确率60%', icon: '🥉', requirement: { type: 'accuracy', value: 60 } },
        { id: 'accuracy_silver', name: '精准打击', desc: '正确率75%', icon: '🥈', requirement: { type: 'accuracy', value: 75 } },
        { id: 'accuracy_gold', name: '百发百中', desc: '正确率90%', icon: '🥇', requirement: { type: 'accuracy', value: 90 } }
    ];

    // ==================== 状态管理 ====================
    const state = {
        // 游戏状态
        score: 0,
        selectedCards: [],
        timeLeft: 90,
        timer: null,
        completed: 0,
        correct: 0,
        attempts: 0,
        startTime: null,
        currentTarget: 10,
        currentMode: 'standard',
        gameActive: false,
        hintCooldown: 0,
        hintTimer: null,
        history: [],
        wrongQuestions: [],
        timeouts: new Set(),
        
        // 用户状态
        currentUser: null,
        isTeacher: false,
        isAdmin: false,
        
        // 连接状态
        supabase: null,
        supabaseReady: false,
        offlineMode: false,
        
        // 语言
        currentLang: 'zh',
        
        // 成就
        achievements: new Map(),
        stats: {
            games: 0,
            totalScore: 0,
            bestScore: 0,
            bestAccuracy: 0,
            totalQuestions: 0,
            totalCorrect: 0
        },
        
        // 排行榜
        leaderboard: {
            mode: 'challenge',
            difficulty: 'easy',
            page: 1,
            totalPages: 1,
            data: []
        },
        
        lastAnswer: null,
        fastestAnswer: 999
    };

    // ==================== 工具函数 ====================
    const t = (key) => {
        return TRANSLATIONS[state.currentLang]?.[key] || key;
    };

    const showMessage = (text, type = 'info', duration = 2000) => {
        const msg = document.createElement('div');
        msg.className = 'message-popup';
        msg.textContent = text;
        msg.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#ff4444' : '#2196F3'};
            color: white; padding: 12px 24px; border-radius: 30px;
            z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-size: 16px; max-width: 90%; text-align: center;
        `;
        document.body.appendChild(msg);
        setTimeout(() => {
            msg.style.opacity = '0';
            msg.style.transform = 'translateX(-50%) translateY(-20px)';
            msg.style.transition = 'all 0.3s';
            setTimeout(() => msg.remove(), 300);
        }, duration);
    };

    const setLanguage = (lang) => {
        if (!['zh', 'en'].includes(lang)) return;
        state.currentLang = lang;
        localStorage.setItem('mathGameLang', lang);
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (key) el.textContent = t(key);
        });
        document.getElementById('language-text').textContent = t('languageText');
    };

    const debounce = (fn, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };

    const shuffleArray = (arr) => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (pwd) => pwd.length >= 6;

    // ==================== Supabase初始化 ====================
    const initSupabase = async () => {
        if (window.location.protocol === 'file:') {
            state.offlineMode = true;
            showMessage(t('offlineMode'), 'warning');
            return false;
        }

        try {
            const config = document.getElementById('supabase-config');
            const { supabaseUrl, supabaseKey } = config ? JSON.parse(config.textContent) : CONFIG;
            
            state.supabase = window.supabase.createClient(supabaseUrl, supabaseKey, {
                auth: { autoRefreshToken: true, persistSession: true }
            });

            const { error } = await state.supabase.auth.getSession();
            if (error) throw error;

            state.supabaseReady = true;
            state.offlineMode = false;
            await checkAuth();
            return true;
        } catch (err) {
            console.error('Supabase init failed:', err);
            state.offlineMode = true;
            showMessage(t('connectionFailed'), 'error');
            return false;
        }
    };

    // ==================== 用户认证 ====================
    const checkAuth = async () => {
        if (!state.supabase || state.offlineMode) return false;
        
        try {
            const { data: { user }, error } = await state.supabase.auth.getUser();
            if (error) return false;
            
            if (user) {
                state.currentUser = user;
                const { data: profile } = await state.supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                
                if (profile) {
                    state.isTeacher = profile.role === 'teacher';
                    state.isAdmin = profile.role === 'admin';
                    if (profile.school_id) {
                        const themeNum = (parseInt(profile.school_id) % 4) + 1;
                        document.body.classList.add(`school-theme-${themeNum}`);
                    }
                }
                updateUserInfo();
                await loadUserData();
            }
            return !!user;
        } catch (err) {
            console.error('Auth check failed:', err);
            return false;
        }
    };

    const login = async (email, password) => {
        if (!validateEmail(email)) return showMessage('Invalid email', 'error');
        if (!validatePassword(password)) return showMessage('Password too short', 'error');
        if (!state.supabase || state.offlineMode) return showMessage(t('offlineMode'), 'error');

        try {
            const { data, error } = await state.supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password.trim()
            });
            if (error) throw error;
            
            state.currentUser = data.user;
            await checkAuth();
            closeModal('auth-modal');
            showMessage(t('syncSuccess'), 'success');
        } catch (err) {
            document.getElementById('auth-error').textContent = err.message;
        }
    };

    const register = async (email, password, username) => {
        if (!validateEmail(email)) return showMessage('Invalid email', 'error');
        if (!validatePassword(password)) return showMessage('Password too short', 'error');
        if (!state.supabase || state.offlineMode) return showMessage(t('offlineMode'), 'error');

        try {
            const { data, error } = await state.supabase.auth.signUp({
                email: email.trim(),
                password: password.trim(),
                options: { data: { username: username || email.split('@')[0] } }
            });
            if (error) throw error;
            
            showMessage('Registration successful!', 'success');
            toggleAuthMode();
        } catch (err) {
            document.getElementById('auth-error').textContent = err.message;
        }
    };

    const logout = async () => {
        if (state.supabase && !state.offlineMode) {
            await state.supabase.auth.signOut();
        }
        state.currentUser = null;
        state.isTeacher = false;
        state.isAdmin = false;
        updateUserInfo();
        showMessage(t('logout'), 'info');
    };

    const updateUserInfo = () => {
        const userInfo = document.getElementById('user-info');
        const userName = document.getElementById('user-name');
        const userAvatar = document.getElementById('user-avatar');
        const teacherTools = document.getElementById('teacher-tools-section');
        const adminTools = document.getElementById('admin-tools-section');
        const teacherBtn = document.getElementById('teacher-tools-btn');
        const adminBtn = document.getElementById('admin-tools-btn');
        const applyBtn = document.getElementById('teacher-application-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const syncBtn = document.getElementById('sync-status-btn');

        if (!state.currentUser) {
            if (userInfo) userInfo.style.display = 'none';
            if (teacherTools) teacherTools.style.display = 'none';
            if (adminTools) adminTools.style.display = 'none';
            if (applyBtn) applyBtn.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (syncBtn) syncBtn.style.display = 'none';
            return;
        }

        if (userInfo) {
            userInfo.style.display = 'flex';
            userName.textContent = state.currentUser.user_metadata?.username || state.currentUser.email?.split('@')[0];
            userAvatar.textContent = state.currentUser.email?.charAt(0).toUpperCase() || '?';
        }

        if (teacherTools) teacherTools.style.display = state.isTeacher || state.isAdmin ? 'block' : 'none';
        if (adminTools) adminTools.style.display = state.isAdmin ? 'block' : 'none';
        if (applyBtn) applyBtn.style.display = (state.currentUser && !state.isTeacher && !state.isAdmin) ? 'block' : 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (syncBtn) syncBtn.style.display = 'block';
    };

    const loadUserData = async () => {
        if (!state.supabase || !state.currentUser || state.offlineMode) return;
        
        try {
            const { data: games } = await state.supabase
                .from('game_records')
                .select('*')
                .eq('user_id', state.currentUser.id)
                .order('created_at', { ascending: false })
                .limit(CONFIG.MAX_HISTORY);
            
            if (games) state.history = games;

            const { data: wrong } = await state.supabase
                .from('wrong_questions')
                .select('*')
                .eq('user_id', state.currentUser.id)
                .order('created_at', { ascending: false });
            
            if (wrong) state.wrongQuestions = wrong;

            showMessage(t('syncSuccess'), 'success');
        } catch (err) {
            console.error('Load user data failed:', err);
        }
    };

    // ==================== 游戏核心 ====================
    const selectMode = (mode) => {
        state.currentMode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`mode-${mode}`)?.classList.add('active');
        
        const customSettings = document.getElementById('custom-settings');
        if (customSettings) customSettings.style.display = mode === 'custom' ? 'flex' : 'none';
        
        const startBtn = document.getElementById('start-btn');
        if (startBtn) startBtn.innerHTML = `<span>${t(mode === 'practice' ? 'startPractice' : 'startGame')}</span>`;
    };

    const getRangeConfig = () => {
        const select = document.getElementById('number-range');
        return RANGE_CONFIG[select?.value] || RANGE_CONFIG['0-14'];
    };

    const startGame = () => {
        if (!state.currentUser && !state.offlineMode) {
            showMessage(t('loginToStart'), 'info');
            openModal('auth-modal');
            return;
        }

        resetGame();

        const config = getRangeConfig();
        const modeConfig = { ...MODE_CONFIG[state.currentMode] };

        if (state.currentMode === 'custom') {
            const q = document.getElementById('custom-questions');
            const t = document.getElementById('custom-time');
            modeConfig.questions = Math.min(100, Math.max(5, parseInt(q?.value) || 20));
            modeConfig.time = Math.min(300, Math.max(10, parseInt(t?.value) || 60));
        }

        if (modeConfig.hasTimeLimit) state.timeLeft = modeConfig.time;

        // 切换UI
        ['game-info', 'progress-container', 'target-container', 'game-controls', 'game-grid'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = id === 'game-grid' ? 'grid' : 'block';
        });
        document.querySelector('.mode-selection').style.display = 'none';
        document.querySelector('.game-setting').style.display = 'none';

        const grid = document.getElementById('game-grid');
        if (grid) {
            grid.style.gridTemplateColumns = `repeat(${window.innerWidth < 500 ? 4 : 5}, 1fr)`;
            grid.innerHTML = '';
        }

        generateTarget();
        generateGrid();

        state.startTime = new Date();
        state.lastAnswer = null;
        state.gameActive = true;

        if (modeConfig.hasTimeLimit) {
            document.getElementById('time').textContent = state.timeLeft;
            state.timer = setInterval(updateTimer, 1000);
        } else {
            state.timer = setInterval(updateElapsed, 1000);
        }

        state.hintTimer = setInterval(updateHintCooldown, 1000);
    };

    const resetGame = () => {
        if (state.timer) clearInterval(state.timer);
        if (state.hintTimer) clearInterval(state.hintTimer);
        state.timeouts.forEach(clearTimeout);
        state.timeouts.clear();

        state.score = 0;
        state.selectedCards = [];
        state.completed = 0;
        state.correct = 0;
        state.attempts = 0;
        state.gameActive = false;
        state.fastestAnswer = 999;
        state.lastAnswer = null;

        ['score', 'completed', 'accuracy', 'progress-bar'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (id === 'score') el.textContent = '0';
                else if (id === 'completed') el.textContent = '0/30';
                else if (id === 'accuracy') el.textContent = '100%';
                else if (id === 'progress-bar') el.style.width = '0%';
            }
        });

        const grid = document.getElementById('game-grid');
        if (grid) grid.innerHTML = '';
    };

    const generateGrid = (ensureValid = true) => {
        const grid = document.getElementById('game-grid');
        if (!grid) return;

        const config = getRangeConfig();
        let numbers = [];
        let attempts = 0;
        const maxAttempts = 100;

        do {
            numbers = [];
            for (let i = 0; i < CONFIG.GRID_SIZE; i++) {
                numbers.push(Math.floor(Math.random() * (config.max - config.min + 1)) + config.min);
            }
            attempts++;
        } while (ensureValid && !hasAnyCombination(state.currentTarget, numbers) && attempts < maxAttempts);

        shuffleArray(numbers);
        
        const fragment = document.createDocumentFragment();
        numbers.forEach(num => {
            const card = document.createElement('div');
            card.className = 'number-card';
            card.textContent = num;
            card.dataset.value = num;
            card.addEventListener('click', handleCardClick);
            fragment.appendChild(card);
        });

        grid.innerHTML = '';
        grid.appendChild(fragment);
    };

    const handleCardClick = (e) => {
        const card = e.currentTarget;
        selectCard(card);
    };

    const selectCard = (card) => {
        if (!state.gameActive || card.classList.contains('disappear')) return;

        if (card.classList.contains('selected')) {
            card.classList.remove('selected');
            state.selectedCards = state.selectedCards.filter(c => c !== card);
            return;
        }

        if (state.selectedCards.length >= 2) {
            showMessage(t('maxTwoCards'), 'error');
            return;
        }

        card.classList.add('selected');
        state.selectedCards.push(card);

        if (state.selectedCards.length === 2) {
            state.attempts++;
            setTimeout(checkMatch, 300);
        }
    };

    const checkMatch = () => {
        if (state.selectedCards.length !== 2) return;

        const num1 = parseInt(state.selectedCards[0].dataset.value);
        const num2 = parseInt(state.selectedCards[1].dataset.value);
        const sum = num1 + num2;
        const isCorrect = sum === state.currentTarget;

        const now = new Date();
        if (state.lastAnswer) {
            const time = (now - state.lastAnswer) / 1000;
            if (time < state.fastestAnswer) state.fastestAnswer = time;
        }
        state.lastAnswer = now;

        const record = {
            id: `${Date.now()}_${Math.random().toString(36)}`,
            target: state.currentTarget,
            num1, num2,
            isCorrect,
            timestamp: now.toISOString()
        };
        state.history.unshift(record);
        if (state.history.length > CONFIG.MAX_HISTORY) state.history.pop();

        if (isCorrect) {
            handleCorrect(record);
        } else {
            handleWrong();
        }
    };

    const handleCorrect = (record) => {
        state.correct++;
        state.completed++;
        
        removeFromWrong(record.num1, record.num2, record.target);

        showFeedback(t('correct'), 'success');

        state.selectedCards.forEach(c => c.classList.add('disappear'));
        
        setTimeout(() => {
            state.selectedCards.forEach(c => c.remove());
            state.selectedCards = [];

            const remaining = document.querySelectorAll('.number-card:not(.disappear)');
            if (remaining.length < 2) {
                generateGrid();
            } else if (!hasValidCombination(state.currentTarget, remaining)) {
                showMessage(t('noValidCombination'), 'info');
                setTimeout(refreshNumbers, 500);
            }
        }, 500);

        state.score += 10;
        updateDisplay();

        const modeConfig = MODE_CONFIG[state.currentMode];
        if (state.currentMode === 'standard' && state.completed >= (modeConfig.questions || 30)) {
            endGame('complete');
            return;
        }

        checkAchievements();
        setTimeout(generateTarget, 800);
    };

    const handleWrong = () => {
        addToWrong();
        showFeedback(t('wrong'), 'error');
        
        state.selectedCards.forEach(c => c.classList.remove('selected'));
        state.selectedCards = [];

        const remaining = document.querySelectorAll('.number-card:not(.disappear)');
        if (!hasValidCombination(state.currentTarget, remaining)) {
            showMessage(t('noValidCombination'), 'info');
            setTimeout(refreshNumbers, 500);
        }
    };

    const addToWrong = () => {
        if (state.selectedCards.length !== 2) return;

        const wrong = {
            id: `${Date.now()}_${Math.random().toString(36)}`,
            target: state.currentTarget,
            num1: parseInt(state.selectedCards[0].dataset.value),
            num2: parseInt(state.selectedCards[1].dataset.value),
            timestamp: new Date().toISOString()
        };

        const existing = state.wrongQuestions.findIndex(w => 
            w.target === wrong.target && 
            ((w.num1 === wrong.num1 && w.num2 === wrong.num2) ||
             (w.num1 === wrong.num2 && w.num2 === wrong.num1))
        );

        if (existing >= 0) {
            state.wrongQuestions[existing].attempts = (state.wrongQuestions[existing].attempts || 1) + 1;
        } else {
            state.wrongQuestions.unshift(wrong);
        }

        if (state.wrongQuestions.length > CONFIG.MAX_WRONG) state.wrongQuestions.pop();
    };

    const removeFromWrong = (num1, num2, target) => {
        const index = state.wrongQuestions.findIndex(w => 
            w.target === target && 
            ((w.num1 === num1 && w.num2 === num2) ||
             (w.num1 === num2 && w.num2 === num1))
        );
        if (index >= 0) state.wrongQuestions.splice(index, 1);
    };

    const hasValidCombination = (target, cards) => {
        if (!cards?.length || cards.length < 2) return false;
        const nums = Array.from(cards).map(c => parseInt(c.dataset.value));
        for (let i = 0; i < nums.length; i++) {
            for (let j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] === target) return true;
            }
        }
        return false;
    };

    const hasAnyCombination = (target, nums) => {
        if (!nums?.length || nums.length < 2) return false;
        for (let i = 0; i < nums.length; i++) {
            for (let j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] === target) return true;
            }
        }
        return false;
    };

    const showFeedback = (text, type) => {
        const fb = document.getElementById('match-feedback');
        if (!fb) return;
        fb.textContent = text;
        fb.style.color = type === 'success' ? '#4CAF50' : '#ff4444';
        fb.style.opacity = '1';
        setTimeout(() => fb.style.opacity = '0', 1000);
    };

    const updateTimer = () => {
        if (!state.gameActive) return;
        state.timeLeft--;
        if (state.timeLeft < 0) state.timeLeft = 0;
        document.getElementById('time').textContent = state.timeLeft;
        if (state.timeLeft <= 0) endGame('timeout');
    };

    const updateElapsed = () => {
        if (!state.gameActive || !state.startTime) return;
        const elapsed = Math.floor((new Date() - state.startTime) / 1000);
        document.getElementById('time').textContent = formatTime(elapsed);
    };

    const updateDisplay = () => {
        document.getElementById('score').textContent = state.score;

        const modeConfig = MODE_CONFIG[state.currentMode];
        const completedEl = document.getElementById('completed');
        const progressBar = document.getElementById('progress-bar');

        if (modeConfig.questions) {
            completedEl.textContent = `${state.completed}/${modeConfig.questions}`;
            if (progressBar) {
                progressBar.style.width = `${(state.completed / modeConfig.questions) * 100}%`;
            }
        } else {
            completedEl.textContent = state.completed.toString();
        }

        const accuracy = state.attempts > 0 ? Math.round((state.correct / state.attempts) * 100) : 100;
        document.getElementById('accuracy').textContent = `${accuracy}%`;
    };

    const generateTarget = () => {
        const config = getRangeConfig();
        const minPossible = config.min * 2;
        const maxPossible = config.max * 2;
        const targetMin = Math.max(config.targetMin, minPossible);
        const targetMax = Math.min(config.targetMax, maxPossible);
        
        if (targetMin > targetMax) return;
        
        state.currentTarget = Math.floor(Math.random() * (targetMax - targetMin + 1)) + targetMin;
        document.getElementById('target-sum').textContent = state.currentTarget;

        setTimeout(() => {
            if (state.gameActive) checkAutoRefresh();
        }, 300);
    };

    const checkAutoRefresh = () => {
        if (!state.gameActive) return;
        const remaining = document.querySelectorAll('.number-card:not(.disappear)');
        if (!hasValidCombination(state.currentTarget, remaining)) {
            showMessage(t('noValidCombination'), 'info');
            setTimeout(refreshNumbers, 500);
        }
    };

    const refreshNumbers = () => {
        const grid = document.getElementById('game-grid');
        if (!grid) return;
        grid.style.opacity = '0.5';
        setTimeout(() => {
            generateGrid();
            grid.style.opacity = '1';
        }, 500);
    };

    const updateHintCooldown = () => {
        if (state.hintCooldown > 0) {
            state.hintCooldown--;
            updateHintButton();
        }
    };

    const updateHintButton = () => {
        const btn = document.getElementById('hint-btn');
        if (!btn) return;
        if (state.hintCooldown > 0) {
            btn.innerHTML = `<span>💡 ${state.hintCooldown}${t('seconds')}</span>`;
            btn.disabled = true;
        } else {
            btn.innerHTML = `<span>${t('hintButton')}</span>`;
            btn.disabled = false;
        }
    };

    const showHint = () => {
        if (state.hintCooldown > 0) {
            showMessage(`${t('hintCooldown')} ${state.hintCooldown}${t('seconds')}`, 'info');
            return;
        }

        const cards = document.querySelectorAll('.number-card:not(.disappear)');
        const nums = Array.from(cards).map(c => parseInt(c.dataset.value));
        
        for (let i = 0; i < nums.length; i++) {
            for (let j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] === state.currentTarget) {
                    cards[i].style.animation = 'pulse 1s';
                    cards[j].style.animation = 'pulse 1s';
                    setTimeout(() => {
                        cards[i].style.animation = '';
                        cards[j].style.animation = '';
                    }, 1000);
                    
                    state.hintCooldown = 10;
                    updateHintButton();
                    showMessage(t('hintActivated'), 'success');
                    return;
                }
            }
        }
        showMessage('No hint available', 'info');
    };

    const endGame = (reason) => {
        if (!state.gameActive) return;

        state.gameActive = false;
        if (state.timer) clearInterval(state.timer);
        if (state.hintTimer) clearInterval(state.hintTimer);

        const elapsed = state.startTime ? Math.floor((new Date() - state.startTime) / 1000) : 0;
        const accuracy = state.attempts > 0 ? Math.round((state.correct / state.attempts) * 100) : 100;

        document.getElementById('final-score').textContent = state.score;
        document.getElementById('final-completed').textContent = state.completed;
        document.getElementById('final-time').textContent = `${elapsed}${t('seconds')}`;
        document.getElementById('final-accuracy').textContent = `${accuracy}%`;

        const titles = {
            'complete': t('gameComplete'),
            'timeout': t('gameTimeout'),
            'giveup': t('gameGiveup')
        };
        document.getElementById('result-title').textContent = titles[reason] || t('gameEnd');

        openModal('game-over');

        updateStats();
        saveLocal();
        checkAchievements();
    };

    const updateStats = () => {
        state.stats.games++;
        state.stats.totalQuestions += state.completed;
        state.stats.totalCorrect += state.correct;
        if (state.score > state.stats.bestScore) state.stats.bestScore = state.score;
        
        const accuracy = state.attempts > 0 ? Math.round((state.correct / state.attempts) * 100) : 100;
        if (accuracy > state.stats.bestAccuracy) state.stats.bestAccuracy = accuracy;
        
        if (state.fastestAnswer < state.stats.fastestAnswer) state.stats.fastestAnswer = state.fastestAnswer;
    };

    const checkAchievements = () => {
        ACHIEVEMENTS.forEach(ach => {
            if (state.achievements.get(ach.id)) return;

            let achieved = false;
            switch (ach.requirement.type) {
                case 'games':
                    achieved = state.stats.games >= ach.requirement.value;
                    break;
                case 'score':
                    achieved = state.stats.bestScore >= ach.requirement.value;
                    break;
                case 'accuracy':
                    achieved = state.stats.bestAccuracy >= ach.requirement.value;
                    break;
            }

            if (achieved) {
                state.achievements.set(ach.id, true);
                showMessage(`🏆 ${ach.name}`, 'success', 3000);
            }
        });
    };

    // ==================== 排行榜 ====================
    const loadLeaderboard = async () => {
        const content = document.getElementById('leaderboard-content');
        if (!content) return;

        if (state.offlineMode || !state.supabase) {
            content.innerHTML = `<div class="empty-state">${t('offlineMode')}</div>`;
            return;
        }

        try {
            const { data, error } = await state.supabase
                .from('game_records')
                .select(`
                    *,
                    profiles:user_id (username)
                `)
                .eq('mode', state.leaderboard.mode)
                .eq('difficulty', state.leaderboard.difficulty)
                .order('score', { ascending: false })
                .limit(10);

            if (error) throw error;

            if (!data?.length) {
                content.innerHTML = `<div class="empty-state">${t('noData')}</div>`;
                return;
            }

            let html = '<table class="leaderboard-table"><thead><tr><th>#</th><th>' + t('player') + '</th><th>' + t('score') + '</th><th>' + t('accuracy') + '</th><th>' + t('time') + '</th></tr></thead><tbody>';
            
            data.forEach((item, i) => {
                const isCurrent = state.currentUser && item.user_id === state.currentUser.id;
                html += `<tr${isCurrent ? ' class="current-user"' : ''}>
                    <td>${i + 1}</td>
                    <td>${item.profiles?.username || 'Anonymous'}</td>
                    <td>${item.score}</td>
                    <td>${item.accuracy}%</td>
                    <td>${item.total_time || 0}s</td>
                </tr>`;
            });
            
            html += '</tbody></table>';
            content.innerHTML = html;

            // 更新分页
            document.getElementById('page-1').classList.add('active');
            document.getElementById('prev-page').disabled = true;
            document.getElementById('next-page').disabled = true;

        } catch (err) {
            console.error('Leaderboard error:', err);
            content.innerHTML = `<div class="empty-state">${t('connectionFailed')}</div>`;
        }
    };

    // ==================== 模态框管理 ====================
    const openModal = (id) => {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'flex';
            if (id === 'leaderboard-modal') loadLeaderboard();
            if (id === 'wrongbook-modal') showWrongBook();
            if (id === 'history-modal') showHistory();
            if (id === 'statistics-modal') showStatistics();
            if (id === 'achievements-modal') showAchievements();
            if (id === 'profile-modal') showProfile();
        }
    };

    const closeModal = (id) => {
        const modal = document.getElementById(id);
        if (modal) modal.style.display = 'none';
    };

    // ==================== 各个模态框内容 ====================
    const showHistory = () => {
        const tbody = document.getElementById('history-table-body');
        if (!tbody) return;

        if (!state.history.length) {
            tbody.innerHTML = `<tr><td colspan="6" class="empty-state">${t('noData')}</td></tr>`;
            return;
        }

        tbody.innerHTML = state.history.slice(0, 20).map((h, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${h.target}</td>
                <td>${h.num1}</td>
                <td>${h.num2}</td>
                <td style="color: ${h.isCorrect ? '#4CAF50' : '#ff4444'}">${h.isCorrect ? t('correct') : t('wrong')}</td>
                <td>${new Date(h.timestamp).toLocaleTimeString()}</td>
            </tr>
        `).join('');
    };

    const showStatistics = () => {
        const content = document.getElementById('statistics-content');
        if (!content) return;

        const accuracy = state.stats.totalQuestions > 0 
            ? Math.round((state.stats.totalCorrect / state.stats.totalQuestions) * 100) 
            : 0;

        content.innerHTML = `
            <div class="profile-stats">
                <div class="profile-stat">
                    <div class="profile-stat-label">${t('totalGames')}</div>
                    <div class="profile-stat-value">${state.stats.games}</div>
                </div>
                <div class="profile-stat">
                    <div class="profile-stat-label">${t('totalQuestions')}</div>
                    <div class="profile-stat-value">${state.stats.totalQuestions}</div>
                </div>
                <div class="profile-stat">
                    <div class="profile-stat-label">${t('totalCorrect')}</div>
                    <div class="profile-stat-value">${state.stats.totalCorrect}</div>
                </div>
                <div class="profile-stat">
                    <div class="profile-stat-label">${t('avgAccuracy')}</div>
                    <div class="profile-stat-value">${accuracy}%</div>
                </div>
                <div class="profile-stat">
                    <div class="profile-stat-label">${t('bestScore')}</div>
                    <div class="profile-stat-value">${state.stats.bestScore}</div>
                </div>
                <div class="profile-stat">
                    <div class="profile-stat-label">${t('bestAccuracy')}</div>
                    <div class="profile-stat-value">${state.stats.bestAccuracy}%</div>
                </div>
            </div>
        `;
    };

    const showAchievements = () => {
        const grid = document.getElementById('achievements-grid');
        if (!grid) return;

        grid.innerHTML = ACHIEVEMENTS.map(ach => {
            const unlocked = state.achievements.get(ach.id);
            return `
                <div class="achievement-card ${unlocked ? '' : 'locked'}">
                    <div class="achievement-icon">${ach.icon}</div>
                    <div class="achievement-name">${ach.name}</div>
                    <div class="achievement-desc">${ach.desc}</div>
                </div>
            `;
        }).join('');
    };

    const showWrongBook = () => {
        const list = document.getElementById('wrong-questions-list');
        if (!list) return;

        if (!state.wrongQuestions.length) {
            list.innerHTML = `<div class="empty-state">${t('noData')}</div>`;
            return;
        }

        list.innerHTML = state.wrongQuestions.map(w => `
            <div class="wrong-question-item">
                <span>${w.target} = ${w.num1} + ${w.num2}</span>
                <small>${new Date(w.timestamp).toLocaleDateString()}</small>
            </div>
        `).join('');
    };

    const showProfile = () => {
        if (!state.currentUser) {
            closeModal('profile-modal');
            openModal('auth-modal');
            return;
        }

        document.getElementById('profile-avatar').textContent = state.currentUser.email?.charAt(0).toUpperCase() || '?';
        document.getElementById('profile-email').textContent = state.currentUser.email;
        document.getElementById('profile-role').textContent = state.isTeacher ? 'Teacher' : state.isAdmin ? 'Admin' : 'Student';
        document.getElementById('profile-game-count').textContent = state.stats.games;
        document.getElementById('profile-high-score').textContent = state.stats.bestScore;
        
        const accuracy = state.stats.totalQuestions > 0 
            ? Math.round((state.stats.totalCorrect / state.stats.totalQuestions) * 100) 
            : 0;
        document.getElementById('profile-avg-accuracy').textContent = `${accuracy}%`;
    };

    // ==================== 保存成绩 ====================
    const saveScore = async (e) => {
        if (e) e.preventDefault();

        const name = document.getElementById('player-name').value.trim() || 
                    state.currentUser?.user_metadata?.username || 
                    'Anonymous';

        if (!state.currentUser && !state.offlineMode) {
            showMessage(t('loginFirst'), 'error');
            openModal('auth-modal');
            return;
        }

        const record = {
            user_id: state.currentUser?.id,
            score: state.score,
            questions_completed: state.completed,
            correct_count: state.correct,
            accuracy: state.attempts > 0 ? (state.correct / state.attempts * 100) : 100,
            mode: state.currentMode,
            difficulty: getRangeConfig().difficulty,
            total_time: state.startTime ? Math.floor((new Date() - state.startTime) / 1000) : 0,
            created_at: new Date().toISOString()
        };

        state.history.unshift(record);
        if (state.history.length > CONFIG.MAX_HISTORY) state.history.pop();

        if (state.supabase && !state.offlineMode && state.currentUser) {
            try {
                await state.supabase.from('game_records').insert([record]);
            } catch (err) {
                console.error('Save failed:', err);
            }
        }

        saveLocal();
        showMessage(t('scoreSaved'), 'success');
        closeModal('game-over');
        restartGame();
    };

    const saveLocal = () => {
        try {
            localStorage.setItem('mathGame', JSON.stringify({
                version: CONFIG.VERSION,
                stats: state.stats,
                achievements: Array.from(state.achievements.entries()),
                history: state.history.slice(0, 50),
                wrong: state.wrongQuestions.slice(0, 100)
            }));
        } catch (e) {
            console.warn('Save failed:', e);
        }
    };

    const loadLocal = () => {
        try {
            const saved = localStorage.getItem('mathGame');
            if (!saved) return;
            
            const data = JSON.parse(saved);
            if (data.version === CONFIG.VERSION) {
                state.stats = data.stats || state.stats;
                state.achievements = new Map(data.achievements || []);
                state.history = data.history || [];
                state.wrongQuestions = data.wrong || [];
            }
        } catch (e) {
            console.warn('Load failed:', e);
        }
    };

    const restartGame = () => {
        closeModal('game-over');
        document.querySelector('.mode-selection').style.display = 'grid';
        document.querySelector('.game-setting').style.display = 'block';
        ['game-info', 'progress-container', 'target-container', 'game-controls', 'game-grid'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        document.getElementById('player-name').value = '';
        resetGame();
    };

    const clearHistory = () => {
        if (confirm(t('confirmClear'))) {
            state.history = [];
            saveLocal();
            showHistory();
            showMessage('Cleared', 'success');
        }
    };

    const clearWrong = () => {
        if (confirm(t('confirmClear'))) {
            state.wrongQuestions = [];
            saveLocal();
            showWrongBook();
            showMessage('Cleared', 'success');
        }
    };

    // ==================== 认证相关 ====================
    let authMode = 'login';

    const toggleAuthMode = () => {
        authMode = authMode === 'login' ? 'register' : 'login';
        const title = document.getElementById('auth-title');
        const submitBtn = document.getElementById('auth-submit-btn');
        const switchText = document.getElementById('auth-switch-text');
        const switchLink = document.getElementById('auth-switch-link');
        const usernameGroup = document.getElementById('auth-username-group');

        if (title) title.innerHTML = `<span>${t(authMode === 'login' ? 'loginTitle' : 'registerTitle')}</span>`;
        if (submitBtn) submitBtn.innerHTML = `<span>${t(authMode === 'login' ? 'loginButton' : 'registerButton')}</span>`;
        if (switchText) switchText.innerHTML = `<span>${t(authMode === 'login' ? 'noAccount' : 'hasAccount')}</span>`;
        if (switchLink) switchLink.innerHTML = `<span>${t(authMode === 'login' ? 'registerNow' : 'loginNow')}</span>`;
        if (usernameGroup) usernameGroup.style.display = authMode === 'login' ? 'none' : 'block';
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('auth-email').value.trim();
        const password = document.getElementById('auth-password').value.trim();
        const username = document.getElementById('auth-username')?.value.trim();

        if (!email || !password) {
            document.getElementById('auth-error').textContent = 'Email and password required';
            return;
        }

        if (authMode === 'login') {
            await login(email, password);
        } else {
            await register(email, password, username);
        }
    };

    // ==================== 事件绑定 ====================
    const bindEvents = () => {
        // 语言切换
        document.getElementById('language-btn')?.addEventListener('click', () => {
            setLanguage(state.currentLang === 'zh' ? 'en' : 'zh');
        });

        // 侧边栏按钮
        const navMap = [
            ['history-btn', () => openModal('history-modal')],
            ['statistics-btn', () => openModal('statistics-modal')],
            ['achievements-btn', () => openModal('achievements-modal')],
            ['wrongbook-btn', () => openModal('wrongbook-modal')],
            ['leaderboard-btn', () => openModal('leaderboard-modal')],
            ['profile-btn', () => openModal('profile-modal')],
            ['teacher-tools-btn', () => openModal('teacher-tools-modal')],
            ['admin-tools-btn', () => openModal('admin-tools-modal')],
            ['teacher-application-btn', () => showMessage(t('applyForTeacher'), 'info')],
            ['logout-btn', logout]
        ];
        navMap.forEach(([id, fn]) => {
            document.getElementById(id)?.addEventListener('click', fn);
        });

        // 游戏模式
        ['standard', 'challenge', 'practice', 'custom'].forEach(mode => {
            document.getElementById(`mode-${mode}`)?.addEventListener('click', () => selectMode(mode));
        });

        // 游戏控制
        document.getElementById('start-btn')?.addEventListener('click', startGame);
        document.getElementById('hint-btn')?.addEventListener('click', showHint);
        document.getElementById('refresh-btn')?.addEventListener('click', refreshNumbers);
        document.getElementById('endgame-btn')?.addEventListener('click', () => endGame('giveup'));

        // 认证
        document.getElementById('auth-form')?.addEventListener('submit', handleAuth);
        document.getElementById('auth-switch-link')?.addEventListener('click', toggleAuthMode);

        // 关闭按钮
        const closeMap = [
            'auth-modal', 'history-modal', 'statistics-modal', 'achievements-modal',
            'wrongbook-modal', 'leaderboard-modal', 'profile-modal', 'teacher-tools-modal',
            'admin-tools-modal', 'game-over'
        ];
        closeMap.forEach(id => {
            document.getElementById(`close-${id}`)?.addEventListener('click', () => closeModal(id));
        });

        // 游戏结束按钮
        document.getElementById('save-score-form')?.addEventListener('submit', saveScore);
        document.getElementById('play-again-btn')?.addEventListener('click', restartGame);
        document.getElementById('view-leaderboard-btn')?.addEventListener('click', () => {
            closeModal('game-over');
            openModal('leaderboard-modal');
        });
        document.getElementById('view-statistics-btn')?.addEventListener('click', () => {
            closeModal('game-over');
            openModal('statistics-modal');
        });

        // 历史记录操作
        document.getElementById('clear-history-btn')?.addEventListener('click', clearHistory);

        // 错题本操作
        document.getElementById('sync-wrong-btn')?.addEventListener('click', () => showMessage('Sync coming soon', 'info'));
        document.getElementById('clear-wrong-btn')?.addEventListener('click', clearWrong);

        // 排行榜
        document.getElementById('sync-leaderboard-btn')?.addEventListener('click', loadLeaderboard);
        document.getElementById('leaderboard-login-btn')?.addEventListener('click', () => {
            closeModal('leaderboard-modal');
            openModal('auth-modal');
        });

        // 排行榜分页
        document.getElementById('prev-page')?.addEventListener('click', () => {
            if (state.leaderboard.page > 1) {
                state.leaderboard.page--;
                loadLeaderboard();
            }
        });
        document.getElementById('next-page')?.addEventListener('click', () => {
            if (state.leaderboard.page < state.leaderboard.totalPages) {
                state.leaderboard.page++;
                loadLeaderboard();
            }
        });
        [1, 2, 3].forEach(i => {
            document.getElementById(`page-${i}`)?.addEventListener('click', () => {
                state.leaderboard.page = i;
                loadLeaderboard();
            });
        });

        // 排行榜标签切换
        document.querySelectorAll('.game-mode-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.game-mode-tabs .tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.leaderboard.mode = btn.dataset.gameMode;
                loadLeaderboard();
            });
        });

        document.querySelectorAll('.difficulty-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.difficulty-tabs .tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.leaderboard.difficulty = btn.dataset.difficulty;
                loadLeaderboard();
            });
        });

        // 点击背景关闭
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.style.display = 'none';
            });
        });

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal[style*="flex"], .game-over[style*="flex"]').forEach(m => {
                    m.style.display = 'none';
                });
            }
        });

        // 窗口大小改变
        window.addEventListener('resize', debounce(() => {
            if (state.gameActive) {
                const grid = document.getElementById('game-grid');
                if (grid) {
                    grid.style.gridTemplateColumns = `repeat(${window.innerWidth < 500 ? 4 : 5}, 1fr)`;
                }
            }
        }, 250));
    };

    // ==================== 初始化 ====================
    const init = async () => {
        console.log('Math Game v' + CONFIG.VERSION);

        // 加载语言
        const savedLang = localStorage.getItem('mathGameLang') || 'zh';
        setLanguage(savedLang);

        // 加载本地数据
        loadLocal();

        // 初始化Supabase
        await initSupabase();

        // 绑定事件
        bindEvents();

        // 默认模式
        selectMode('standard');

        // 隐藏加载
        setTimeout(() => {
            document.getElementById('loading-overlay')?.classList.add('hide-loading');
            document.body.classList.add('loaded');
        }, 500);

        // 定期自动保存
        setInterval(saveLocal, 60000);
    };

    // ==================== 导出全局 ====================
    window.MathGame = {
        init,
        selectMode,
        startGame,
        showHint,
        refreshNumbers,
        endGame,
        restartGame,
        logout,
        showAuthModal: () => openModal('auth-modal'),
        isOfflineMode: () => state.offlineMode
    };

    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 100));
    } else {
        setTimeout(init, 100);
    }

})();
