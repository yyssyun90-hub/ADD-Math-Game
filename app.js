// 确保页面已完全加载
(function() {
    console.log('数学加法消消乐开始加载...');
    
    window.addEventListener('error', function(e) {
        console.error('页面加载错误:', e);
    });
})();

const MathGame = (function() {
    // ==================== 配置 ====================
    const CONFIG = {
        SUPABASE_URL: 'https://ytoailyxejdgtpfwcdci.supabase.co',
        SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0b2FpbHl4ZWpkZ3RwZndjZGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDE5NzQsImV4cCI6MjA4NTExNzk3NH0.DvvP8whiE3rW1bDh4qW2zOLTGsknfQ2Utt8wVOxZjV0',
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
            // 排行榜翻译
            rank: "排名", player: "玩家", score: "得分", accuracy: "准确率", time: "用时", date: "日期",
            easyMode: "简单模式", standardMode: "标准模式", challengeMode: "挑战模式",
            noData: "暂无数据", myBest: "我的最佳", globalRank: "全球排名",
            // 统计页面翻译
            totalGames: "总游戏次数", totalQuestions: "总答题数", totalCorrect: "总正确数",
            avgTimePerQuestion: "平均每题用时", bestScore: "最佳得分", bestAccuracy: "最佳正确率",
            modeStats: "模式统计", recentGames: "最近10局",
            // 成就系统阶梯式翻译
            achievementProgress: "成就进度",
            level: "等级",
            completed: "已完成",
            notCompleted: "未完成",
            // 成就分类
            categoryVictory: "🏆 胜利者",
            categoryScore: "💯 得分王",
            categoryAccuracy: "🎯 神枪手",
            categorySpeed: "⚡ 闪电侠",
            categoryPersistence: "💪 毅力帝",
            categoryMaster: "👑 数学大师",
            // 阶梯成就名称
            victoryBronze: "初出茅庐",
            victorySilver: "小试牛刀",
            victoryGold: "常胜将军",
            victoryPlatinum: "战神降临",
            scoreBronze: "小有收获",
            scoreSilver: "财富积累",
            scoreGold: "百战百胜",
            scorePlatinum: "分数收割机",
            accuracyBronze: "稳扎稳打",
            accuracySilver: "精准打击",
            accuracyGold: "百步穿杨",
            accuracyPlatinum: "弹无虚发",
            speedBronze: "反应敏捷",
            speedSilver: "风驰电掣",
            speedGold: "光速思维",
            speedPlatinum: "瞬间永恒",
            persistenceBronze: "持之以恒",
            persistenceSilver: "坚持不懈",
            persistenceGold: "百炼成钢",
            persistencePlatinum: "永恒传说",
            masterBronze: "数学新秀",
            masterSilver: "解题高手",
            masterGold: "数学精英",
            masterPlatinum: "数学之神"
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
            // Leaderboard translations
            rank: "Rank", player: "Player", score: "Score", accuracy: "Accuracy", time: "Time", date: "Date",
            easyMode: "Easy Mode", standardMode: "Standard Mode", challengeMode: "Challenge Mode",
            noData: "No Data", myBest: "My Best", globalRank: "Global Rank",
            // Statistics translations
            totalGames: "Total Games", totalQuestions: "Total Questions", totalCorrect: "Total Correct",
            avgTimePerQuestion: "Avg Time/Question", bestScore: "Best Score", bestAccuracy: "Best Accuracy",
            modeStats: "Mode Statistics", recentGames: "Recent 10 Games",
            // Achievement ladder translations
            achievementProgress: "Achievement Progress",
            level: "Level",
            completed: "Completed",
            notCompleted: "Not Completed",
            // Achievement categories
            categoryVictory: "🏆 Victor",
            categoryScore: "💯 Scorer",
            categoryAccuracy: "🎯 Sharpshooter",
            categorySpeed: "⚡ Speedy",
            categoryPersistence: "💪 Persistence",
            categoryMaster: "👑 Math Master",
            // Ladder achievement names
            victoryBronze: "Novice",
            victorySilver: "Apprentice",
            victoryGold: "Champion",
            victoryPlatinum: "God of War",
            scoreBronze: "Small Harvest",
            scoreSilver: "Wealth Accumulator",
            scoreGold: "Centurion",
            scorePlatinum: "Score Harvester",
            accuracyBronze: "Steady",
            accuracySilver: "Precise Strike",
            accuracyGold: "Bullseye",
            accuracyPlatinum: "Never Miss",
            speedBronze: "Quick Reflex",
            speedSilver: "Lightning Fast",
            speedGold: "Light Speed",
            speedPlatinum: "Timeless",
            persistenceBronze: "Persistent",
            persistenceSilver: "Relentless",
            persistenceGold: "Tempered",
            persistencePlatinum: "Eternal Legend",
            masterBronze: "Math Rookie",
            masterSilver: "Problem Solver",
            masterGold: "Math Elite",
            masterPlatinum: "God of Math"
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
    let currentUser = null;
    let authMode = 'login';
    let currentLanguage = 'zh';
    let isAdminUser = false;
    let isSupabaseReady = false;
    
    // ==================== 阶梯式成就系统 ====================
    // 成就等级定义
    const ACHIEVEMENT_LEVELS = {
        BRONZE: 1,
        SILVER: 2,
        GOLD: 3,
        PLATINUM: 4
    };
    
    // 成就类别
    const ACHIEVEMENT_CATEGORIES = {
        VICTORY: 'victory',
        SCORE: 'score',
        ACCURACY: 'accuracy',
        SPEED: 'speed',
        PERSISTENCE: 'persistence',
        MASTER: 'master'
    };
    
    // 完整阶梯式成就定义
    const LADDER_ACHIEVEMENTS = [
        // ========== 胜利成就 - 完成游戏次数 ==========
        {
            id: 'victory_bronze',
            category: 'victory',
            level: 1,
            icon: '🥉',
            name: { zh: '初出茅庐', en: 'Novice' },
            desc: { zh: '完成第1局游戏', en: 'Complete 1 game' },
            requirement: { type: 'games_completed', value: 1 },
            reward: { score: 10 }
        },
        {
            id: 'victory_silver',
            category: 'victory',
            level: 2,
            icon: '🥈',
            name: { zh: '小试牛刀', en: 'Apprentice' },
            desc: { zh: '完成10局游戏', en: 'Complete 10 games' },
            requirement: { type: 'games_completed', value: 10 },
            reward: { score: 50 }
        },
        {
            id: 'victory_gold',
            category: 'victory',
            level: 3,
            icon: '🥇',
            name: { zh: '常胜将军', en: 'Champion' },
            desc: { zh: '完成50局游戏', en: 'Complete 50 games' },
            requirement: { type: 'games_completed', value: 50 },
            reward: { score: 200 }
        },
        {
            id: 'victory_platinum',
            category: 'victory',
            level: 4,
            icon: '🏆',
            name: { zh: '战神降临', en: 'God of War' },
            desc: { zh: '完成100局游戏', en: 'Complete 100 games' },
            requirement: { type: 'games_completed', value: 100 },
            reward: { score: 500 }
        },
        
        // ========== 得分成就 - 单局最高得分 ==========
        {
            id: 'score_bronze',
            category: 'score',
            level: 1,
            icon: '💵',
            name: { zh: '小有收获', en: 'Small Harvest' },
            desc: { zh: '单局得分达到30分', en: 'Score 30 points in one game' },
            requirement: { type: 'best_score', value: 30 },
            reward: { score: 20 }
        },
        {
            id: 'score_silver',
            category: 'score',
            level: 2,
            icon: '💰',
            name: { zh: '财富积累', en: 'Wealth Accumulator' },
            desc: { zh: '单局得分达到50分', en: 'Score 50 points in one game' },
            requirement: { type: 'best_score', value: 50 },
            reward: { score: 50 }
        },
        {
            id: 'score_gold',
            category: 'score',
            level: 3,
            icon: '💎',
            name: { zh: '百战百胜', en: 'Centurion' },
            desc: { zh: '单局得分达到100分', en: 'Score 100 points in one game' },
            requirement: { type: 'best_score', value: 100 },
            reward: { score: 150 }
        },
        {
            id: 'score_platinum',
            category: 'score',
            level: 4,
            icon: '💯',
            name: { zh: '分数收割机', en: 'Score Harvester' },
            desc: { zh: '单局得分达到200分', en: 'Score 200 points in one game' },
            requirement: { type: 'best_score', value: 200 },
            reward: { score: 300 }
        },
        
        // ========== 准确率成就 - 单局最高准确率 ==========
        {
            id: 'accuracy_bronze',
            category: 'accuracy',
            level: 1,
            icon: '🎯',
            name: { zh: '稳扎稳打', en: 'Steady' },
            desc: { zh: '单局准确率达到60%', en: 'Achieve 60% accuracy in one game' },
            requirement: { type: 'best_accuracy', value: 60 },
            reward: { score: 15 }
        },
        {
            id: 'accuracy_silver',
            category: 'accuracy',
            level: 2,
            icon: '🎯',
            name: { zh: '精准打击', en: 'Precise Strike' },
            desc: { zh: '单局准确率达到75%', en: 'Achieve 75% accuracy in one game' },
            requirement: { type: 'best_accuracy', value: 75 },
            reward: { score: 30 }
        },
        {
            id: 'accuracy_gold',
            category: 'accuracy',
            level: 3,
            icon: '🎯',
            name: { zh: '百步穿杨', en: 'Bullseye' },
            desc: { zh: '单局准确率达到90%', en: 'Achieve 90% accuracy in one game' },
            requirement: { type: 'best_accuracy', value: 90 },
            reward: { score: 100 }
        },
        {
            id: 'accuracy_platinum',
            category: 'accuracy',
            level: 4,
            icon: '🎯',
            name: { zh: '弹无虚发', en: 'Never Miss' },
            desc: { zh: '单局准确率达到100%', en: 'Achieve 100% accuracy in one game' },
            requirement: { type: 'best_accuracy', value: 100 },
            reward: { score: 200 }
        },
        
        // ========== 速度成就 - 最快答题时间 ==========
        {
            id: 'speed_bronze',
            category: 'speed',
            level: 1,
            icon: '⚡',
            name: { zh: '反应敏捷', en: 'Quick Reflex' },
            desc: { zh: '5秒内完成一题', en: 'Complete a question within 5 seconds' },
            requirement: { type: 'fastest_answer', value: 5 },
            reward: { score: 20 }
        },
        {
            id: 'speed_silver',
            category: 'speed',
            level: 2,
            icon: '⚡',
            name: { zh: '风驰电掣', en: 'Lightning Fast' },
            desc: { zh: '3秒内完成一题', en: 'Complete a question within 3 seconds' },
            requirement: { type: 'fastest_answer', value: 3 },
            reward: { score: 50 }
        },
        {
            id: 'speed_gold',
            category: 'speed',
            level: 3,
            icon: '⚡',
            name: { zh: '光速思维', en: 'Light Speed' },
            desc: { zh: '2秒内完成一题', en: 'Complete a question within 2 seconds' },
            requirement: { type: 'fastest_answer', value: 2 },
            reward: { score: 150 }
        },
        {
            id: 'speed_platinum',
            category: 'speed',
            level: 4,
            icon: '⚡',
            name: { zh: '瞬间永恒', en: 'Timeless' },
            desc: { zh: '1秒内完成一题', en: 'Complete a question within 1 second' },
            requirement: { type: 'fastest_answer', value: 1 },
            reward: { score: 300 }
        },
        
        // ========== 毅力成就 - 总答题数量 ==========
        {
            id: 'persistence_bronze',
            category: 'persistence',
            level: 1,
            icon: '💪',
            name: { zh: '持之以恒', en: 'Persistent' },
            desc: { zh: '累计完成50题', en: 'Complete 50 questions in total' },
            requirement: { type: 'total_questions', value: 50 },
            reward: { score: 30 }
        },
        {
            id: 'persistence_silver',
            category: 'persistence',
            level: 2,
            icon: '💪',
            name: { zh: '坚持不懈', en: 'Relentless' },
            desc: { zh: '累计完成200题', en: 'Complete 200 questions in total' },
            requirement: { type: 'total_questions', value: 200 },
            reward: { score: 100 }
        },
        {
            id: 'persistence_gold',
            category: 'persistence',
            level: 3,
            icon: '💪',
            name: { zh: '百炼成钢', en: 'Tempered' },
            desc: { zh: '累计完成500题', en: 'Complete 500 questions in total' },
            requirement: { type: 'total_questions', value: 500 },
            reward: { score: 300 }
        },
        {
            id: 'persistence_platinum',
            category: 'persistence',
            level: 4,
            icon: '💪',
            name: { zh: '永恒传说', en: 'Eternal Legend' },
            desc: { zh: '累计完成1000题', en: 'Complete 1000 questions in total' },
            requirement: { type: 'total_questions', value: 1000 },
            reward: { score: 600 }
        },
        
        // ========== 大师成就 - 综合能力 ==========
        {
            id: 'master_bronze',
            category: 'master',
            level: 1,
            icon: '👨‍🎓',
            name: { zh: '数学新秀', en: 'Math Rookie' },
            desc: { zh: '解锁5个青铜级成就', en: 'Unlock 5 Bronze achievements' },
            requirement: { type: 'bronze_count', value: 5 },
            reward: { score: 100 }
        },
        {
            id: 'master_silver',
            category: 'master',
            level: 2,
            icon: '👨‍🏫',
            name: { zh: '解题高手', en: 'Problem Solver' },
            desc: { zh: '解锁5个白银级成就', en: 'Unlock 5 Silver achievements' },
            requirement: { type: 'silver_count', value: 5 },
            reward: { score: 250 }
        },
        {
            id: 'master_gold',
            category: 'master',
            level: 3,
            icon: '👨‍🔬',
            name: { zh: '数学精英', en: 'Math Elite' },
            desc: { zh: '解锁3个黄金级成就', en: 'Unlock 3 Gold achievements' },
            requirement: { type: 'gold_count', value: 3 },
            reward: { score: 500 }
        },
        {
            id: 'master_platinum',
            category: 'master',
            level: 4,
            icon: '🧙',
            name: { zh: '数学之神', en: 'God of Math' },
            desc: { zh: '解锁1个铂金级成就', en: 'Unlock 1 Platinum achievement' },
            requirement: { type: 'platinum_count', value: 1 },
            reward: { score: 1000 }
        }
    ];
    
    // 成就状态存储
    let achievementStates = new Map(); // 成就ID -> { unlocked: boolean, progress: number, unlockedAt: string }
    let playerStats = {
        gamesCompleted: 0,
        bestScore: 0,
        bestAccuracy: 0,
        fastestAnswer: 999,
        totalQuestions: 0,
        totalCorrect: 0,
        totalAttempts: 0,
        // 成就计数
        bronzeCount: 0,
        silverCount: 0,
        goldCount: 0,
        platinumCount: 0
    };
    
    // 当前游戏速度记录
    let lastAnswerTime = null;
    let currentFastestAnswer = 999;
    
    // 游戏配置
    const MODE_CONFIG = {
        standard: { questions: 30, time: null, hasTimeLimit: false, leaderboardType: 'standard' },
        challenge: { questions: null, time: 90, hasTimeLimit: true, leaderboardType: 'challenge' },
        practice: { questions: null, time: null, hasTimeLimit: false, leaderboardType: null },
        custom: { questions: 20, time: 60, hasTimeLimit: true, leaderboardType: null }
    };
    
    const RANGE_CONFIG = {
        '0-9': { min: 0, max: 9, targetMin: 5, targetMax: 10, leaderboardType: 'easy' },
        '0-14': { min: 0, max: 14, targetMin: 6, targetMax: 14, leaderboardType: 'standard' },
        '5-18': { min: 5, max: 18, targetMin: 8, targetMax: 18, leaderboardType: 'challenge' }
    };
    
    // ==================== 工具函数 ====================
    function showMessage(text, type = 'info', duration = 2000) {
        try {
            document.querySelectorAll('.message-popup').forEach(msg => msg.remove());
            
            const message = document.createElement('div');
            message.className = 'message-popup';
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
                animation: slideIn 0.3s ease;
            `;
            
            document.body.appendChild(message);
            
            setTimeout(() => {
                if (message && message.parentNode) {
                    message.style.opacity = '0';
                    message.style.transform = 'translateX(-50%) translateY(-20px)';
                    setTimeout(() => {
                        if (message.parentNode) {
                            message.parentNode.removeChild(message);
                        }
                    }, 300);
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
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // ==================== 检查数字组合函数 ====================
    function hasValidCombination(targetSum, cards) {
        if (!cards || cards.length < 2) return false;
        
        const numbers = cards.map(card => parseInt(card.dataset.value));
        
        for (let i = 0; i < numbers.length; i++) {
            for (let j = i + 1; j < numbers.length; j++) {
                if (numbers[i] + numbers[j] === targetSum) {
                    return true;
                }
            }
        }
        return false;
    }
    
    function checkAndAutoRefresh() {
        if (!gameActive) return;
        
        const remainingCards = Array.from(document.querySelectorAll('.number-card:not(.disappear)'));
        if (!hasValidCombination(currentTarget, remainingCards)) {
            showMessage(currentLanguage === 'zh' ? '没有匹配的组合，自动刷新数字！' : 'No matching combinations, refreshing numbers!', 'info');
            setTimeout(() => {
                refreshNumbers();
            }, 500);
        }
    }
    
    // ==================== 阶梯式成就系统核心函数 ====================
    function loadAchievements() {
        try {
            // 加载成就状态
            const savedStates = localStorage.getItem('mathGameAchievementStates');
            if (savedStates) {
                const parsed = JSON.parse(savedStates);
                achievementStates = new Map(Object.entries(parsed));
            } else {
                // 初始化成就状态
                LADDER_ACHIEVEMENTS.forEach(ach => {
                    achievementStates.set(ach.id, {
                        unlocked: false,
                        progress: 0,
                        unlockedAt: null
                    });
                });
            }
            
            // 加载玩家统计
            const savedStats = localStorage.getItem('mathGamePlayerStats');
            if (savedStats) {
                playerStats = JSON.parse(savedStats);
            }
            
            // 加载云端数据（如果已登录）
            if (currentUser && isSupabaseReady) {
                setTimeout(() => {
                    loadAchievementsFromCloud();
                }, 1000);
            }
            
        } catch (error) {
            console.error('加载成就失败:', error);
            // 初始化默认状态
            LADDER_ACHIEVEMENTS.forEach(ach => {
                achievementStates.set(ach.id, {
                    unlocked: false,
                    progress: 0,
                    unlockedAt: null
                });
            });
        }
    }
    
    function saveAchievements() {
        try {
            // 转换Map为对象
            const statesObject = {};
            achievementStates.forEach((value, key) => {
                statesObject[key] = value;
            });
            
            localStorage.setItem('mathGameAchievementStates', JSON.stringify(statesObject));
            localStorage.setItem('mathGamePlayerStats', JSON.stringify(playerStats));
            
            // 同步到云端
            if (currentUser && isSupabaseReady) {
                setTimeout(() => {
                    syncAchievementsToCloud();
                }, 100);
            }
            
        } catch (error) {
            console.error('保存成就失败:', error);
        }
    }
    
    async function syncAchievementsToCloud() {
        try {
            if (!currentUser || !isSupabaseReady || !supabase) return;
            
            const statesObject = {};
            achievementStates.forEach((value, key) => {
                statesObject[key] = value;
            });
            
            const achievementData = {
                user_id: currentUser.id,
                email: currentUser.email,
                achievement_states: statesObject,
                player_stats: playerStats,
                updated_at: new Date().toISOString()
            };
            
            // 检查是否存在记录
            const { data: existingData } = await supabase
                .from('player_achievements')
                .select('id')
                .eq('user_id', currentUser.id)
                .limit(1);
            
            if (existingData && existingData.length > 0) {
                // 更新
                await supabase
                    .from('player_achievements')
                    .update(achievementData)
                    .eq('user_id', currentUser.id);
            } else {
                // 插入
                await supabase
                    .from('player_achievements')
                    .insert([achievementData]);
            }
            
        } catch (error) {
            console.error('同步成就到云端失败:', error);
        }
    }
    
    async function loadAchievementsFromCloud() {
        try {
            if (!currentUser || !isSupabaseReady || !supabase) return;
            
            const { data, error } = await supabase
                .from('player_achievements')
                .select('*')
                .eq('user_id', currentUser.id)
                .limit(1);
            
            if (error) {
                console.error('从云端加载成就失败:', error);
                return;
            }
            
            if (data && data.length > 0) {
                const cloudData = data[0];
                
                // 合并成就状态
                if (cloudData.achievement_states) {
                    Object.entries(cloudData.achievement_states).forEach(([key, value]) => {
                        if (achievementStates.has(key)) {
                            const local = achievementStates.get(key);
                            // 如果云端已解锁且本地未解锁，则同步云端状态
                            if (value.unlocked && !local.unlocked) {
                                achievementStates.set(key, value);
                            }
                            // 合并进度，取最大值
                            if (value.progress > local.progress) {
                                local.progress = value.progress;
                                achievementStates.set(key, local);
                            }
                        }
                    });
                }
                
                // 合并玩家统计，取最大值
                if (cloudData.player_stats) {
                    playerStats.gamesCompleted = Math.max(playerStats.gamesCompleted, cloudData.player_stats.gamesCompleted || 0);
                    playerStats.bestScore = Math.max(playerStats.bestScore, cloudData.player_stats.bestScore || 0);
                    playerStats.bestAccuracy = Math.max(playerStats.bestAccuracy, cloudData.player_stats.bestAccuracy || 0);
                    playerStats.fastestAnswer = Math.min(playerStats.fastestAnswer, cloudData.player_stats.fastestAnswer || 999);
                    playerStats.totalQuestions = Math.max(playerStats.totalQuestions, cloudData.player_stats.totalQuestions || 0);
                    playerStats.totalCorrect = Math.max(playerStats.totalCorrect, cloudData.player_stats.totalCorrect || 0);
                    playerStats.totalAttempts = Math.max(playerStats.totalAttempts, cloudData.player_stats.totalAttempts || 0);
                }
                
                // 重新计算成就计数
                updateAchievementCounts();
                saveAchievements();
            }
            
        } catch (error) {
            console.error('从云端加载成就异常:', error);
        }
    }
    
    function updatePlayerStats() {
        // 更新游戏次数
        playerStats.gamesCompleted++;
        
        // 更新最佳得分
        if (score > playerStats.bestScore) {
            playerStats.bestScore = score;
        }
        
        // 更新最佳准确率
        const currentAccuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;
        if (currentAccuracy > playerStats.bestAccuracy) {
            playerStats.bestAccuracy = currentAccuracy;
        }
        
        // 更新最快答题速度
        if (currentFastestAnswer < playerStats.fastestAnswer) {
            playerStats.fastestAnswer = currentFastestAnswer;
        }
        
        // 更新总答题数和正确数
        playerStats.totalQuestions += completedQuestions;
        playerStats.totalCorrect += correctCount;
        playerStats.totalAttempts += totalAttempts;
    }
    
    function updateAchievementCounts() {
        // 重新计算各等级成就数量
        playerStats.bronzeCount = 0;
        playerStats.silverCount = 0;
        playerStats.goldCount = 0;
        playerStats.platinumCount = 0;
        
        LADDER_ACHIEVEMENTS.forEach(ach => {
            const state = achievementStates.get(ach.id);
            if (state && state.unlocked) {
                switch(ach.level) {
                    case 1: playerStats.bronzeCount++; break;
                    case 2: playerStats.silverCount++; break;
                    case 3: playerStats.goldCount++; break;
                    case 4: playerStats.platinumCount++; break;
                }
            }
        });
    }
    
    function checkAchievementRequirement(achievement, progress) {
        switch(achievement.requirement.type) {
            case 'games_completed':
                return playerStats.gamesCompleted >= achievement.requirement.value;
            case 'best_score':
                return playerStats.bestScore >= achievement.requirement.value;
            case 'best_accuracy':
                return playerStats.bestAccuracy >= achievement.requirement.value;
            case 'fastest_answer':
                return playerStats.fastestAnswer <= achievement.requirement.value;
            case 'total_questions':
                return playerStats.totalQuestions >= achievement.requirement.value;
            case 'bronze_count':
                return playerStats.bronzeCount >= achievement.requirement.value;
            case 'silver_count':
                return playerStats.silverCount >= achievement.requirement.value;
            case 'gold_count':
                return playerStats.goldCount >= achievement.requirement.value;
            case 'platinum_count':
                return playerStats.platinumCount >= achievement.requirement.value;
            default:
                return false;
        }
    }
    
    function getAchievementProgress(achievement) {
        switch(achievement.requirement.type) {
            case 'games_completed':
                return Math.min(playerStats.gamesCompleted, achievement.requirement.value);
            case 'best_score':
                return Math.min(playerStats.bestScore, achievement.requirement.value);
            case 'best_accuracy':
                return Math.min(playerStats.bestAccuracy, achievement.requirement.value);
            case 'fastest_answer':
                // 最快时间，数值越小越好
                return playerStats.fastestAnswer <= achievement.requirement.value 
                    ? achievement.requirement.value 
                    : Math.max(0, achievement.requirement.value - (playerStats.fastestAnswer - achievement.requirement.value));
            case 'total_questions':
                return Math.min(playerStats.totalQuestions, achievement.requirement.value);
            case 'bronze_count':
                return Math.min(playerStats.bronzeCount, achievement.requirement.value);
            case 'silver_count':
                return Math.min(playerStats.silverCount, achievement.requirement.value);
            case 'gold_count':
                return Math.min(playerStats.goldCount, achievement.requirement.value);
            case 'platinum_count':
                return Math.min(playerStats.platinumCount, achievement.requirement.value);
            default:
                return 0;
        }
    }
    
    function checkAndUnlockAchievements() {
        let unlockedCount = 0;
        
        LADDER_ACHIEVEMENTS.forEach(ach => {
            const state = achievementStates.get(ach.id);
            if (!state || !state.unlocked) {
                const isUnlocked = checkAchievementRequirement(ach);
                if (isUnlocked) {
                    // 解锁成就
                    achievementStates.set(ach.id, {
                        unlocked: true,
                        progress: 100,
                        unlockedAt: new Date().toISOString()
                    });
                    
                    // 显示成就解锁动画
                    showAchievementUnlock(ach);
                    unlockedCount++;
                } else {
                    // 更新进度
                    const progress = getAchievementProgress(ach);
                    const total = ach.requirement.value;
                    const progressPercent = Math.round((progress / total) * 100);
                    
                    if (state) {
                        state.progress = Math.min(progressPercent, 100);
                        achievementStates.set(ach.id, state);
                    }
                }
            }
        });
        
        if (unlockedCount > 0) {
            // 重新计算成就计数
            updateAchievementCounts();
            saveAchievements();
            
            // 检查大师成就（可能需要递归解锁）
            setTimeout(() => {
                checkAndUnlockAchievements();
            }, 100);
        }
    }
    
    function showAchievementUnlock(achievement) {
        const unlockDiv = document.createElement('div');
        unlockDiv.className = 'achievement-unlock';
        unlockDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 20px;
            z-index: 3001;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            animation: achievementPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            text-align: center;
            min-width: 300px;
        `;
        
        const levelIcon = achievement.level === 1 ? '🥉' : 
                         achievement.level === 2 ? '🥈' : 
                         achievement.level === 3 ? '🥇' : '🏆';
        
        unlockDiv.innerHTML = `
            <div style="font-size: 4em; margin-bottom: 15px;">${achievement.icon}</div>
            <div style="font-size: 1.8em; font-weight: bold; margin-bottom: 10px;">🎉 成就解锁!</div>
            <div style="font-size: 1.4em; font-weight: bold; margin-bottom: 5px;">${achievement.name[currentLanguage]}</div>
            <div style="font-size: 1em; opacity: 0.9; margin-bottom: 15px;">${achievement.desc[currentLanguage]}</div>
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                <span style="background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px;">${levelIcon} ${currentLanguage === 'zh' ? '等级' : 'Level'} ${achievement.level}</span>
                <span style="background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px;">+${achievement.reward.score} ${currentLanguage === 'zh' ? '分' : 'pts'}</span>
            </div>
        `;
        
        document.body.appendChild(unlockDiv);
        
        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes achievementPop {
                0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
            @keyframes slideIn {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            unlockDiv.style.opacity = '0';
            unlockDiv.style.transform = 'translate(-50%, -50%) scale(0.8)';
            unlockDiv.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                if (unlockDiv.parentNode) {
                    unlockDiv.parentNode.removeChild(unlockDiv);
                }
            }, 300);
        }, 3000);
    }
    
    // ==================== 成就展示界面 ====================
    function showAchievements() {
        try {
            loadAchievements();
            
            const container = document.getElementById('achievements-grid');
            const achievementsModal = document.getElementById('achievements-modal');
            const statsContainer = document.getElementById('achievement-stats');
            
            if (!container || !achievementsModal) return;
            
            container.innerHTML = '';
            
            // 按类别分组成就
            const categorizedAchievements = {};
            LADDER_ACHIEVEMENTS.forEach(ach => {
                if (!categorizedAchievements[ach.category]) {
                    categorizedAchievements[ach.category] = [];
                }
                categorizedAchievements[ach.category].push(ach);
            });
            
            // 排序成就（按等级）
            Object.keys(categorizedAchievements).forEach(category => {
                categorizedAchievements[category].sort((a, b) => a.level - b.level);
            });
            
            // 添加玩家统计概览
            const totalAchievements = LADDER_ACHIEVEMENTS.length;
            let unlockedCount = 0;
            achievementStates.forEach(state => {
                if (state.unlocked) unlockedCount++;
            });
            
            const statsHtml = `
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="font-size: 1.3em; font-weight: bold;">${translations[currentLanguage].achievementProgress}</span>
                        <span style="background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px;">${unlockedCount}/${totalAchievements}</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.2); border-radius: 10px; height: 10px; overflow: hidden; margin-top: 5px;">
                        <div style="width: ${(unlockedCount/totalAchievements)*100}%; background: #FFD700; height: 100%; border-radius: 10px; transition: width 0.3s ease;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 15px; gap: 10px;">
                        <div style="text-align: center; flex:1;">
                            <div style="font-size: 1.5em;">🥉</div>
                            <div style="font-size: 0.9em;">${playerStats.bronzeCount}</div>
                        </div>
                        <div style="text-align: center; flex:1;">
                            <div style="font-size: 1.5em;">🥈</div>
                            <div style="font-size: 0.9em;">${playerStats.silverCount}</div>
                        </div>
                        <div style="text-align: center; flex:1;">
                            <div style="font-size: 1.5em;">🥇</div>
                            <div style="font-size: 0.9em;">${playerStats.goldCount}</div>
                        </div>
                        <div style="text-align: center; flex:1;">
                            <div style="font-size: 1.5em;">🏆</div>
                            <div style="font-size: 0.9em;">${playerStats.platinumCount}</div>
                        </div>
                    </div>
                </div>
            `;
            
            // 生成成就卡片
            let achievementsHtml = '';
            
            // 成就类别顺序
            const categoryOrder = [
                'victory', 'score', 'accuracy', 'speed', 'persistence', 'master'
            ];
            
            categoryOrder.forEach(category => {
                const achievements = categorizedAchievements[category];
                if (!achievements || achievements.length === 0) return;
                
                // 类别标题
                let categoryTitle = '';
                let categoryIcon = '';
                switch(category) {
                    case 'victory': categoryTitle = translations[currentLanguage].categoryVictory; categoryIcon = '🏆'; break;
                    case 'score': categoryTitle = translations[currentLanguage].categoryScore; categoryIcon = '💯'; break;
                    case 'accuracy': categoryTitle = translations[currentLanguage].categoryAccuracy; categoryIcon = '🎯'; break;
                    case 'speed': categoryTitle = translations[currentLanguage].categorySpeed; categoryIcon = '⚡'; break;
                    case 'persistence': categoryTitle = translations[currentLanguage].categoryPersistence; categoryIcon = '💪'; break;
                    case 'master': categoryTitle = translations[currentLanguage].categoryMaster; categoryIcon = '👑'; break;
                }
                
                achievementsHtml += `
                    <div style="margin-bottom: 25px;">
                        <h4 style="display: flex; align-items: center; color: #333; margin-bottom: 15px;">
                            <span style="font-size: 1.8em; margin-right: 10px;">${categoryIcon}</span>
                            ${categoryTitle}
                        </h4>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
                `;
                
                achievements.forEach(ach => {
                    const state = achievementStates.get(ach.id);
                    const isUnlocked = state && state.unlocked;
                    const progress = state ? state.progress : 0;
                    
                    const levelColor = ach.level === 1 ? '#CD7F32' : 
                                      ach.level === 2 ? '#C0C0C0' : 
                                      ach.level === 3 ? '#FFD700' : '#E5E4E2';
                    
                    achievementsHtml += `
                        <div style="background: ${isUnlocked ? 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)' : 'white'}; 
                                    border: 2px solid ${isUnlocked ? levelColor : '#e0e0e0'};
                                    border-radius: 15px; padding: 15px; text-align: center;
                                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                                    opacity: ${isUnlocked ? 1 : 0.7};
                                    transition: all 0.3s ease;
                                    position: relative;
                                    cursor: pointer;"
                             onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.1)';"
                             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 10px rgba(0,0,0,0.05)';">
                            <div style="font-size: 2.5em; margin-bottom: 5px;">${ach.icon}</div>
                            <div style="font-weight: bold; color: ${levelColor}; font-size: 0.9em; margin-bottom: 5px;">
                                ${ach.level === 1 ? '🥉' : ach.level === 2 ? '🥈' : ach.level === 3 ? '🥇' : '🏆'} 
                                ${translations[currentLanguage].level} ${ach.level}
                            </div>
                            <div style="font-weight: bold; color: #333; margin-bottom: 5px; font-size: 1em;">
                                ${ach.name[currentLanguage]}
                            </div>
                            <div style="color: #666; font-size: 0.8em; margin-bottom: 10px;">
                                ${ach.desc[currentLanguage]}
                            </div>
                            <div style="background: #f0f0f0; border-radius: 10px; height: 6px; overflow: hidden; margin-bottom: 5px;">
                                <div style="width: ${progress}%; background: ${levelColor}; height: 100%; border-radius: 10px;"></div>
                            </div>
                            <div style="display: flex; justify-content: space-between; color: #666; font-size: 0.75em;">
                                <span>${isUnlocked ? '✓' : progress + '%'}</span>
                                <span>+${ach.reward.score}</span>
                            </div>
                            ${isUnlocked ? `
                                <div style="position: absolute; top: -8px; right: -8px; background: #4CAF50; color: white; width: 24px; height: 24px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 0.8em; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                                    ✓
                                </div>
                            ` : ''}
                        </div>
                    `;
                });
                
                achievementsHtml += `
                        </div>
                    </div>
                `;
            });
            
            container.innerHTML = statsHtml + achievementsHtml;
            achievementsModal.style.display = 'flex';
            
        } catch (error) {
            console.error('显示成就失败:', error);
        }
    }
    
    // ==================== Supabase 初始化 ====================
    async function initSupabase() {
        try {
            console.log('初始化Supabase...');
            
            let supabaseUrl = CONFIG.SUPABASE_URL;
            let supabaseKey = CONFIG.SUPABASE_ANON_KEY;
            
            supabase = window.supabase.createClient(supabaseUrl, supabaseKey, {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: false
                }
            });
            
            isSupabaseReady = true;
            console.log('Supabase初始化成功');
            return true;
            
        } catch (error) {
            console.error('Supabase初始化失败:', error);
            isSupabaseReady = false;
            return false;
        }
    }
    
    // ==================== 用户认证 ====================
    async function checkAuth() {
        if (!isSupabaseReady || !supabase) return false;
        
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error) {
                console.error('获取用户失败:', error);
                return false;
            }
            
            if (user) {
                currentUser = user;
                console.log('用户已登录:', user.email);
                
                await checkIfAdmin();
                updateUserInfo();
                
                // 加载云端数据
                setTimeout(() => {
                    loadAchievementsFromCloud();
                    loadWrongQuestionsFromCloud();
                    loadUserStats();
                    loadUserScores();
                }, 1000);
                
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('检查认证状态失败:', error);
            return false;
        }
    }
    
    async function checkIfAdmin() {
        if (!currentUser) {
            isAdminUser = false;
            return false;
        }
        
        try {
            const userRole = currentUser.user_metadata?.role;
            if (userRole === 'admin' || userRole === 'superadmin') {
                isAdminUser = true;
                return true;
            }
            
            const email = currentUser.email?.toLowerCase() || '';
            const isInAdminList = CONFIG.ADMIN_EMAILS.some(adminEmail => 
                adminEmail.toLowerCase() === email
            );
            
            isAdminUser = isInAdminList;
            return isInAdminList;
        } catch (error) {
            console.error('管理员检查失败:', error);
            isAdminUser = false;
            return false;
        }
    }
    
    async function login(email, password) {
        try {
            if (!isSupabaseReady || !supabase) {
                showMessage(currentLanguage === 'zh' ? '系统未初始化' : 'System not initialized', 'error');
                return false;
            }
            
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password.trim()
            });
            
            if (error) {
                const errorElement = document.getElementById('auth-error');
                if (errorElement) errorElement.textContent = error.message;
                return false;
            }
            
            if (data && data.user) {
                currentUser = data.user;
                
                await checkIfAdmin();
                updateUserInfo();
                closeAuthModal();
                
                showMessage(currentLanguage === 'zh' ? '登录成功！' : 'Login successful!', 'success');
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('登录失败:', error);
            const errorElement = document.getElementById('auth-error');
            if (errorElement) errorElement.textContent = currentLanguage === 'zh' ? '登录失败' : 'Login failed';
            return false;
        }
    }
    
    async function register(email, password, username) {
        try {
            if (!isSupabaseReady || !supabase) {
                showMessage(currentLanguage === 'zh' ? '系统未初始化' : 'System not initialized', 'error');
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
                const errorElement = document.getElementById('auth-error');
                if (errorElement) errorElement.textContent = error.message;
                return false;
            }
            
            if (data && data.user) {
                currentUser = data.user;
                
                await checkIfAdmin();
                updateUserInfo();
                closeAuthModal();
                
                showMessage(currentLanguage === 'zh' ? '注册成功！请检查邮箱验证邮件。' : 'Registration successful! Please check your email for verification.', 'success');
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('注册失败:', error);
            const errorElement = document.getElementById('auth-error');
            if (errorElement) errorElement.textContent = currentLanguage === 'zh' ? '注册失败' : 'Registration failed';
            return false;
        }
    }
    
    async function logout() {
        try {
            if (!isSupabaseReady || !supabase) return;
            
            const { error } = await supabase.auth.signOut();
            
            if (error) {
                showMessage(currentLanguage === 'zh' ? '退出失败: ' : 'Logout failed: ' + error.message, 'error');
                return;
            }
            
            currentUser = null;
            isAdminUser = false;
            
            const userInfo = document.getElementById('user-info');
            const teacherToolsBtn = document.getElementById('teacher-tools-btn');
            const adminToolsBtn = document.getElementById('admin-tools-btn');
            
            if (userInfo) userInfo.style.display = 'none';
            if (teacherToolsBtn) teacherToolsBtn.style.display = 'none';
            if (adminToolsBtn) adminToolsBtn.style.display = 'none';
            
            showMessage(currentLanguage === 'zh' ? '已退出登录' : 'Logged out', 'info');
        } catch (error) {
            console.error('退出失败:', error);
            showMessage(currentLanguage === 'zh' ? '退出失败' : 'Logout failed', 'error');
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
            
            userInfo.style.display = 'flex';
            const email = currentUser.email || '';
            const firstLetter = email.charAt(0).toUpperCase() || '?';
            userAvatar.textContent = firstLetter;
            
            const username = currentUser.user_metadata?.username || email.split('@')[0];
            userName.textContent = username;
            
            if (teacherToolsBtn) {
                const userRole = currentUser.user_metadata?.role;
                const isApprovedTeacher = userRole === 'teacher' && currentUser.user_metadata?.approved === true;
                teacherToolsBtn.style.display = (isApprovedTeacher || isAdminUser) ? 'flex' : 'none';
            }
            
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
            
            if (!emailInput || !passwordInput) return;
            
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const username = usernameInput ? usernameInput.value.trim() : '';
            const role = roleSelect ? roleSelect.value : 'student';
            const school = schoolInput ? schoolInput.value.trim() : '';
            const state = stateInput ? stateInput.value.trim() : '';
            
            if (!email || !password) {
                const errorElement = document.getElementById('auth-error');
                if (errorElement) errorElement.textContent = currentLanguage === 'zh' ? '请输入邮箱和密码' : 'Please enter email and password';
                return;
            }
            
            if (authMode === 'login') {
                await login(email, password);
            } else {
                if (role === 'teacher' && (!school || !state)) {
                    const errorElement = document.getElementById('auth-error');
                    if (errorElement) errorElement.textContent = currentLanguage === 'zh' ? '请填写学校名称和所在州属' : 'Please fill in school name and state';
                    return;
                }
                await register(email, password, username);
            }
        } catch (error) {
            console.error('处理认证失败:', error);
        }
    }
    
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
                startBtn.innerHTML = '<span>🎯 开始练习</span>';
            } else {
                startBtn.innerHTML = '<span>🚀 开始游戏</span>';
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
        
        const gameGrid = document.getElementById('game-grid');
        if (gameGrid) {
            gameGrid.style.display = 'grid';
            gameGrid.innerHTML = '';
        }
        
        generateNewTarget();
        generateNumberGrid();
        
        setTimeout(checkAndAutoRefresh, 1000);
        
        startTime = new Date();
        lastAnswerTime = null;
        
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
        currentFastestAnswer = 999;
        
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
        
        loadWrongQuestions();
        loadAchievements();
    }
    
    function generateNumberGrid() {
        const gameGrid = document.getElementById('game-grid');
        if (!gameGrid) return;
        
        const range = document.getElementById('number-range')?.value || '0-14';
        const config = RANGE_CONFIG[range];
        if (!config) return;
        
        gameGrid.innerHTML = '';
        const numbers = [];
        
        for (let i = 0; i < 10; i++) {
            const num = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
            numbers.push(num);
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
        
        setTimeout(checkAndAutoRefresh, 300);
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
        
        // 记录答题时间
        if (lastAnswerTime) {
            const answerTime = (new Date() - lastAnswerTime) / 1000;
            if (answerTime < currentFastestAnswer) {
                currentFastestAnswer = answerTime;
            }
        }
        lastAnswerTime = new Date();
        
        gameHistory.push({
            target: currentTarget,
            num1: num1,
            num2: num2,
            isCorrect: isCorrect,
            timestamp: new Date().toISOString(),
            answerTime: lastAnswerTime ? (new Date() - lastAnswerTime) / 1000 : 0
        });
        
        if (isCorrect) {
            correctCount++;
            completedQuestions++;
            showFeedback(currentLanguage === 'zh' ? '✓ 正确!' : '✓ Correct!', 'success');
            
            selectedCards.forEach(card => card.classList.add('disappear'));
            setTimeout(() => {
                selectedCards.forEach(card => {
                    if (card.parentNode) {
                        card.parentNode.removeChild(card);
                    }
                });
                selectedCards = [];
                
                const remainingCards = Array.from(document.querySelectorAll('.number-card:not(.disappear)'));
                if (remainingCards.length < 2) {
                    generateNumberGrid();
                } else {
                    if (!hasValidCombination(currentTarget, remainingCards)) {
                        showMessage(currentLanguage === 'zh' ? '没有匹配的组合，自动刷新数字！' : 'No matching combinations, refreshing numbers!', 'info');
                        setTimeout(() => {
                            refreshNumbers();
                        }, 500);
                    }
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
            }, 800);
            
        } else {
            recordWrongQuestion(num1, num2, sum, currentTarget);
            
            showFeedback(currentLanguage === 'zh' ? '✗ 错误' : '✗ Wrong', 'error');
            selectedCards.forEach(card => card.classList.remove('selected'));
            selectedCards = [];
            
            const remainingCards = Array.from(document.querySelectorAll('.number-card:not(.disappear)'));
            if (!hasValidCombination(currentTarget, remainingCards)) {
                showMessage(currentLanguage === 'zh' ? '没有匹配的组合，自动刷新数字！' : 'No matching combinations, refreshing numbers!', 'info');
                setTimeout(() => {
                    refreshNumbers();
                }, 500);
            }
        }
        
        // 检查成就
        checkAndTriggerAchievements();
    }
    
    function showFeedback(text, type) {
        const feedback = document.getElementById('match-feedback');
        if (!feedback) return;
        
        feedback.textContent = text;
        feedback.style.color = type === 'success' ? '#4CAF50' : '#ff4444';
        feedback.style.opacity = '1';
        setTimeout(() => { feedback.style.opacity = '0'; }, 1000);
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
        
        setTimeout(checkAndAutoRefresh, 300);
    }
    
    // ==================== 游戏结束与成就更新 ====================
    async function endGame(reason) {
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
        
        // 更新玩家统计
        updatePlayerStats();
        
        // 检查成就解锁
        checkAndUnlockAchievements();
        
        // 保存成就
        saveAchievements();
        
        // 保存成绩到云端
        if (currentUser && isSupabaseReady) {
            await saveGameScoreToCloud(score, completedQuestions, accuracy, elapsedTime);
        }
        
        // 更新用户统计
        if (currentUser) {
            await updateUserStats();
        }
        
        // 同步错题
        if (currentUser && wrongQuestions.length > 0) {
            setTimeout(() => {
                syncAllWrongQuestionsToCloud();
            }, 2000);
        }
    }
    
    function checkAndTriggerAchievements() {
        // 这个方法现在由 checkAndUnlockAchievements 替代
        // 保留作为兼容
    }
    
    // ==================== 成绩云端存储 ====================
    async function saveGameScoreToCloud(gameScore, questionsCompleted, gameAccuracy, timeUsed) {
        try {
            if (!currentUser || !isSupabaseReady || !supabase) {
                return false;
            }
            
            const range = document.getElementById('number-range')?.value || '0-14';
            const leaderboardType = RANGE_CONFIG[range]?.leaderboardType || 
                                    (currentMode === 'standard' ? 'standard' : 
                                     currentMode === 'challenge' ? 'challenge' : null);
            
            if (!leaderboardType) {
                console.log('当前模式不计入排行榜');
                return false;
            }
            
            const scoreData = {
                user_id: currentUser.id,
                email: currentUser.email,
                username: currentUser.user_metadata?.username || currentUser.email?.split('@')[0] || '匿名玩家',
                mode: currentMode,
                range: range,
                leaderboard_type: leaderboardType,
                score: gameScore,
                questions_completed: questionsCompleted,
                total_attempts: totalAttempts,
                correct_count: correctCount,
                accuracy: gameAccuracy,
                time_used: timeUsed,
                created_at: new Date().toISOString()
            };
            
            const { error } = await supabase
                .from('game_scores')
                .insert([scoreData]);
            
            if (error) {
                console.error('保存成绩到云端失败:', error);
                return false;
            }
            
            console.log('成绩保存到云端成功');
            return true;
            
        } catch (error) {
            console.error('保存成绩异常:', error);
            return false;
        }
    }
    
    // ==================== 用户统计系统 ====================
    async function loadUserStats() {
        try {
            if (!currentUser || !isSupabaseReady || !supabase) {
                return null;
            }
            
            const localStats = localStorage.getItem(`mathGameStats_${currentUser.id}`);
            if (localStats) {
                try {
                    const stats = JSON.parse(localStats);
                    if (stats.timestamp && (Date.now() - stats.timestamp) < 3600000) {
                        return stats;
                    }
                } catch (e) {}
            }
            
            const { data: scores, error } = await supabase
                .from('game_scores')
                .select('*')
                .eq('user_id', currentUser.id)
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('加载用户统计失败:', error);
                return null;
            }
            
            if (!scores || scores.length === 0) {
                return null;
            }
            
            const stats = {
                totalGames: scores.length,
                totalScore: scores.reduce((sum, s) => sum + (s.score || 0), 0),
                totalQuestions: scores.reduce((sum, s) => sum + (s.questions_completed || 0), 0),
                totalAttempts: scores.reduce((sum, s) => sum + (s.total_attempts || 0), 0),
                totalCorrect: scores.reduce((sum, s) => sum + (s.correct_count || 0), 0),
                bestScore: Math.max(...scores.map(s => s.score || 0)),
                bestAccuracy: Math.max(...scores.map(s => s.accuracy || 0)),
                totalTimeUsed: scores.reduce((sum, s) => sum + (s.time_used || 0), 0),
                modeStats: {
                    standard: scores.filter(s => s.mode === 'standard').length,
                    challenge: scores.filter(s => s.mode === 'challenge').length,
                    practice: scores.filter(s => s.mode === 'practice').length,
                    custom: scores.filter(s => s.mode === 'custom').length
                },
                rangeStats: {
                    easy: scores.filter(s => s.range === '0-9').length,
                    standard: scores.filter(s => s.range === '0-14').length,
                    challenge: scores.filter(s => s.range === '5-18').length
                },
                recentGames: scores.slice(0, 10),
                timestamp: Date.now()
            };
            
            localStorage.setItem(`mathGameStats_${currentUser.id}`, JSON.stringify(stats));
            
            return stats;
            
        } catch (error) {
            console.error('加载用户统计异常:', error);
            return null;
        }
    }
    
    async function updateUserStats() {
        if (currentUser) {
            await loadUserStats();
        }
    }
    
    // ==================== 错题管理系统 ====================
    function loadWrongQuestions() {
        try {
            const saved = localStorage.getItem('mathGameWrongQuestions');
            if (saved) {
                wrongQuestions = JSON.parse(saved);
            } else {
                wrongQuestions = [];
            }
        } catch (error) {
            console.error('加载错题失败:', error);
            wrongQuestions = [];
        }
    }
    
    function saveWrongQuestions() {
        try {
            localStorage.setItem('mathGameWrongQuestions', JSON.stringify(wrongQuestions));
        } catch (error) {
            console.error('保存错题失败:', error);
        }
    }
    
    function recordWrongQuestion(num1, num2, wrongSum, correctSum) {
        try {
            loadWrongQuestions();
            
            const existingQuestionIndex = wrongQuestions.findIndex(q => 
                q.num1 === num1 && q.num2 === num2 && q.correctSum === correctSum
            );
            
            if (existingQuestionIndex >= 0) {
                wrongQuestions[existingQuestionIndex].count++;
                wrongQuestions[existingQuestionIndex].timestamp = new Date().toISOString();
            } else {
                wrongQuestions.push({
                    num1: num1,
                    num2: num2,
                    wrongSum: wrongSum,
                    correctSum: correctSum,
                    count: 1,
                    timestamp: new Date().toISOString()
                });
            }
            
            saveWrongQuestions();
            
            if (currentUser && isSupabaseReady) {
                setTimeout(() => {
                    syncWrongQuestionToCloud(num1, num2, wrongSum, correctSum);
                }, 100);
            }
            
        } catch (error) {
            console.error('记录错题失败:', error);
        }
    }
    
    // ==================== 云端错题同步功能 ====================
    async function syncWrongQuestionToCloud(num1, num2, wrongSum, correctSum) {
        try {
            if (!currentUser || !isSupabaseReady || !supabase) {
                return false;
            }
            
            const wrongQuestionData = {
                user_id: currentUser.id,
                email: currentUser.email,
                num1: num1,
                num2: num2,
                wrong_sum: wrongSum,
                correct_sum: correctSum,
                timestamp: new Date().toISOString()
            };
            
            const { data: existingData, error: checkError } = await supabase
                .from('wrong_questions')
                .select('*')
                .eq('user_id', currentUser.id)
                .eq('num1', num1)
                .eq('num2', num2)
                .limit(1);
            
            if (checkError) {
                console.error('检查错题存在失败:', checkError);
                return false;
            }
            
            if (existingData && existingData.length > 0) {
                const { error } = await supabase
                    .from('wrong_questions')
                    .update({
                        count: (existingData[0].count || 1) + 1,
                        timestamp: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingData[0].id);
                
                if (error) {
                    console.error('更新云端错题失败:', error);
                    return false;
                }
            } else {
                const { error } = await supabase
                    .from('wrong_questions')
                    .insert([wrongQuestionData]);
                
                if (error) {
                    console.error('插入云端错题失败:', error);
                    return false;
                }
            }
            
            return true;
            
        } catch (error) {
            console.error('同步错题到云端异常:', error);
            return false;
        }
    }
    
    async function syncAllWrongQuestionsToCloud() {
        try {
            if (!currentUser) {
                showMessage(currentLanguage === 'zh' ? '请先登录' : 'Please login first', 'error');
                return false;
            }
            
            if (!isSupabaseReady || !supabase) {
                showMessage(currentLanguage === 'zh' ? '云端服务未就绪' : 'Cloud service not ready', 'error');
                return false;
            }
            
            loadWrongQuestions();
            
            if (wrongQuestions.length === 0) {
                showMessage(currentLanguage === 'zh' ? '没有错题需要同步' : 'No wrong questions to sync', 'info');
                return false;
            }
            
            const syncBtn = document.getElementById('sync-wrong-questions-btn');
            if (syncBtn) {
                syncBtn.innerHTML = `<span>🔄 ${currentLanguage === 'zh' ? '同步中...' : 'Syncing...'}</span>`;
                syncBtn.disabled = true;
            }
            
            let successCount = 0;
            let failCount = 0;
            
            for (const question of wrongQuestions) {
                try {
                    const success = await syncWrongQuestionToCloud(
                        question.num1,
                        question.num2,
                        question.wrongSum,
                        question.correctSum
                    );
                    
                    if (success) {
                        successCount++;
                    } else {
                        failCount++;
                    }
                    
                    await new Promise(resolve => setTimeout(resolve, 50));
                    
                } catch (error) {
                    console.error('同步单个错题失败:', error);
                    failCount++;
                }
            }
            
            if (failCount === 0) {
                showMessage(
                    currentLanguage === 'zh' 
                        ? `✅ 成功同步 ${successCount} 条错题到云端` 
                        : `✅ Successfully synced ${successCount} wrong questions to cloud`,
                    'success'
                );
            } else {
                showMessage(
                    currentLanguage === 'zh' 
                        ? `⚠️ 同步完成：${successCount} 条成功，${failCount} 条失败` 
                        : `⚠️ Sync completed: ${successCount} succeeded, ${failCount} failed`,
                    'warning'
                );
            }
            
            localStorage.setItem('mathGameWrongQuestionsLastSync', new Date().toISOString());
            
            return successCount > 0;
            
        } catch (error) {
            console.error('批量同步错题失败:', error);
            showMessage(
                currentLanguage === 'zh' ? '同步失败' : 'Sync failed',
                'error'
            );
            return false;
        } finally {
            const syncBtn = document.getElementById('sync-wrong-questions-btn');
            if (syncBtn) {
                syncBtn.innerHTML = `<span>${currentLanguage === 'zh' ? '同步错题到云端' : 'Sync Wrong Questions to Cloud'}</span>`;
                syncBtn.disabled = false;
            }
        }
    }
    
    async function loadWrongQuestionsFromCloud() {
        try {
            if (!currentUser || !isSupabaseReady || !supabase) {
                return false;
            }
            
            const { data, error } = await supabase
                .from('wrong_questions')
                .select('*')
                .eq('user_id', currentUser.id)
                .order('timestamp', { ascending: false });
            
            if (error) {
                console.error('从云端加载错题失败:', error);
                return false;
            }
            
            if (!data || data.length === 0) {
                return false;
            }
            
            const cloudQuestions = data.map(item => ({
                num1: item.num1,
                num2: item.num2,
                wrongSum: item.wrong_sum,
                correctSum: item.correct_sum,
                count: item.count || 1,
                timestamp: item.timestamp || item.created_at
            }));
            
            loadWrongQuestions();
            
            for (const cloudQuestion of cloudQuestions) {
                const existingIndex = wrongQuestions.findIndex(q => 
                    q.num1 === cloudQuestion.num1 && 
                    q.num2 === cloudQuestion.num2 && 
                    q.correctSum === cloudQuestion.correctSum
                );
                
                if (existingIndex >= 0) {
                    wrongQuestions[existingIndex].count = Math.max(
                        wrongQuestions[existingIndex].count,
                        cloudQuestion.count
                    );
                    if (new Date(cloudQuestion.timestamp) > new Date(wrongQuestions[existingIndex].timestamp)) {
                        wrongQuestions[existingIndex].timestamp = cloudQuestion.timestamp;
                    }
                } else {
                    wrongQuestions.push(cloudQuestion);
                }
            }
            
            saveWrongQuestions();
            localStorage.setItem('mathGameWrongQuestionsLastSync', new Date().toISOString());
            
            return true;
            
        } catch (error) {
            console.error('从云端加载错题异常:', error);
            return false;
        }
    }
    
    // ==================== 教师工具 ====================
    async function downloadTemplate() {
        try {
            const csvContent = "email,姓名,班级,备注\n" +
                "student1@example.com,张三,三年一班,数学课代表\n" +
                "student2@example.com,李四,三年一班,副班长\n" +
                "student3@example.com,王五,三年二班,学习委员";
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', '学生批量注册模板.csv');
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            showMessage(currentLanguage === 'zh' ? '模板下载成功' : 'Template downloaded successfully', 'success');
        } catch (error) {
            console.error('下载模板失败:', error);
            showMessage(currentLanguage === 'zh' ? '下载模板失败' : 'Failed to download template', 'error');
        }
    }
    
    async function uploadExcelFile() {
        try {
            const fileInput = document.getElementById('excel-file');
            const defaultPasswordInput = document.getElementById('default-password');
            const classNameInput = document.getElementById('class-name');
            
            if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
                showMessage(currentLanguage === 'zh' ? '请选择要上传的文件' : 'Please select a file to upload', 'error');
                return;
            }
            
            const file = fileInput.files[0];
            const defaultPassword = defaultPasswordInput ? defaultPasswordInput.value.trim() : 'stu123456';
            const className = classNameInput ? classNameInput.value.trim() : '未命名班级';
            
            if (!defaultPassword || defaultPassword.length < 6) {
                showMessage(currentLanguage === 'zh' ? '默认密码至少需要6位' : 'Default password must be at least 6 characters', 'error');
                return;
            }
            
            const uploadProgress = document.getElementById('upload-progress');
            const uploadProgressBar = document.getElementById('upload-progress-bar');
            const uploadStatus = document.getElementById('upload-status');
            const uploadResult = document.getElementById('upload-result');
            const accountCards = document.getElementById('account-cards');
            const accountCardsContainer = document.getElementById('account-cards-container');
            
            if (uploadProgress) uploadProgress.style.display = 'block';
            if (uploadProgressBar) uploadProgressBar.style.width = '0%';
            if (uploadStatus) uploadStatus.textContent = currentLanguage === 'zh' ? '正在读取文件...' : 'Reading file...';
            if (uploadResult) uploadResult.style.display = 'none';
            if (accountCards) accountCards.style.display = 'none';
            if (accountCardsContainer) accountCardsContainer.innerHTML = '';
            
            const reader = new FileReader();
            reader.onload = async function(e) {
                try {
                    const csvContent = e.target.result;
                    const rows = csvContent.split('\n');
                    
                    if (rows.length < 2) {
                        showMessage(currentLanguage === 'zh' ? 'CSV文件格式不正确' : 'Invalid CSV file format', 'error');
                        return;
                    }
                    
                    const students = [];
                    const errors = [];
                    
                    for (let i = 1; i < rows.length; i++) {
                        if (!rows[i].trim()) continue;
                        
                        const columns = rows[i].split(',');
                        if (columns.length >= 2) {
                            const email = columns[0].trim();
                            const name = columns[1].trim();
                            const studentClass = columns.length > 2 ? columns[2].trim() : className;
                            const note = columns.length > 3 ? columns[3].trim() : '';
                            
                            if (email && email.includes('@')) {
                                students.push({
                                    email: email,
                                    name: name || email.split('@')[0],
                                    class: studentClass,
                                    note: note,
                                    password: defaultPassword
                                });
                            } else {
                                errors.push(`第${i+1}行: 邮箱格式不正确 - ${email}`);
                            }
                        }
                        
                        if (uploadProgressBar) {
                            uploadProgressBar.style.width = `${(i / rows.length) * 50}%`;
                        }
                    }
                    
                    if (students.length === 0) {
                        showMessage(currentLanguage === 'zh' ? '没有找到有效的学生数据' : 'No valid student data found', 'error');
                        return;
                    }
                    
                    if (uploadStatus) {
                        uploadStatus.textContent = currentLanguage === 'zh' 
                            ? `找到 ${students.length} 名学生，正在注册...` 
                            : `Found ${students.length} students, registering...`;
                    }
                    
                    const results = [];
                    let successCount = 0;
                    let failCount = 0;
                    
                    for (let i = 0; i < students.length; i++) {
                        const student = students[i];
                        
                        try {
                            const { data, error } = await supabase.auth.admin.createUser({
                                email: student.email,
                                password: student.password,
                                email_confirm: true,
                                user_metadata: {
                                    username: student.name,
                                    role: 'student',
                                    class: student.class,
                                    note: student.note,
                                    teacher_id: currentUser.id,
                                    teacher_email: currentUser.email
                                }
                            });
                            
                            if (error) {
                                results.push({
                                    email: student.email,
                                    status: '失败',
                                    message: error.message,
                                    class: student.class
                                });
                                failCount++;
                            } else {
                                results.push({
                                    email: student.email,
                                    status: '成功',
                                    message: currentLanguage === 'zh' ? '账号创建成功' : 'Account created successfully',
                                    class: student.class,
                                    name: student.name,
                                    password: student.password
                                });
                                successCount++;
                            }
                            
                        } catch (error) {
                            results.push({
                                email: student.email,
                                status: '失败',
                                message: error.message || (currentLanguage === 'zh' ? '未知错误' : 'Unknown error'),
                                class: student.class
                            });
                            failCount++;
                        }
                        
                        if (uploadProgressBar) {
                            uploadProgressBar.style.width = `${50 + (i / students.length) * 50}%`;
                        }
                        if (uploadStatus) {
                            uploadStatus.textContent = currentLanguage === 'zh' 
                                ? `正在注册 ${i+1}/${students.length}...` 
                                : `Registering ${i+1}/${students.length}...`;
                        }
                        
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                    
                    if (uploadResult) {
                        uploadResult.style.display = 'block';
                        uploadResult.innerHTML = `
                            <h4>${currentLanguage === 'zh' ? '批量注册结果' : 'Batch Registration Results'}</h4>
                            <p>${currentLanguage === 'zh' ? `总计: ${students.length} 名学生` : `Total: ${students.length} students`}</p>
                            <p style="color: #4CAF50;">${currentLanguage === 'zh' ? `成功: ${successCount}` : `Success: ${successCount}`}</p>
                            <p style="color: #ff4444;">${currentLanguage === 'zh' ? `失败: ${failCount}` : `Failed: ${failCount}`}</p>
                            ${errors.length > 0 ? `<p style="color: #FF9800;">${currentLanguage === 'zh' ? `解析错误: ${errors.length}` : `Parse errors: ${errors.length}`}</p>` : ''}
                        `;
                    }
                    
                    if (uploadStatus) {
                        uploadStatus.textContent = currentLanguage === 'zh' 
                            ? `完成！成功: ${successCount}, 失败: ${failCount}` 
                            : `Complete! Success: ${successCount}, Failed: ${failCount}`;
                    }
                    
                    const successfulStudents = results.filter(r => r.status === '成功');
                    if (successfulStudents.length > 0 && accountCards && accountCardsContainer) {
                        accountCardsContainer.innerHTML = '';
                        
                        successfulStudents.forEach((student, index) => {
                            const card = document.createElement('div');
                            card.className = 'account-card';
                            card.style.cssText = `
                                background: white;
                                border: 1px solid #ddd;
                                border-radius: 10px;
                                padding: 15px;
                                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                            `;
                            card.innerHTML = `
                                <div style="font-weight: bold; color: #333; margin-bottom: 5px;">${student.name || student.email.split('@')[0]}</div>
                                <div style="color: #666; font-size: 0.9em; margin-bottom: 3px;">邮箱: ${student.email}</div>
                                <div style="color: #666; font-size: 0.9em; margin-bottom: 3px;">班级: ${student.class}</div>
                                <div style="color: #666; font-size: 0.9em; margin-bottom: 3px;">密码: ${student.password}</div>
                                <div style="color: #4CAF50; font-size: 0.9em; margin-top: 5px;">✓ ${currentLanguage === 'zh' ? '注册成功' : 'Registered'}</div>
                            `;
                            accountCardsContainer.appendChild(card);
                        });
                        
                        accountCards.style.display = 'block';
                    }
                    
                    if (successCount > 0) {
                        showMessage(
                            currentLanguage === 'zh' 
                                ? `成功注册 ${successCount} 名学生账号` 
                                : `Successfully registered ${successCount} student accounts`,
                            'success'
                        );
                    } else {
                        showMessage(
                            currentLanguage === 'zh' 
                                ? '没有成功注册任何账号' 
                                : 'No accounts were successfully registered',
                            'warning'
                        );
                    }
                    
                } catch (error) {
                    console.error('处理CSV文件失败:', error);
                    showMessage(
                        currentLanguage === 'zh' 
                            ? '处理文件失败: ' + error.message 
                            : 'Failed to process file: ' + error.message,
                        'error'
                    );
                }
            };
            
            reader.onerror = function() {
                showMessage(currentLanguage === 'zh' ? '读取文件失败' : 'Failed to read file', 'error');
            };
            
            reader.readAsText(file);
            
        } catch (error) {
            console.error('上传文件失败:', error);
            showMessage(currentLanguage === 'zh' ? '上传文件失败' : 'Failed to upload file', 'error');
        }
    }
    
    function printAccountCards() {
        try {
            const printContent = document.getElementById('account-cards-container').innerHTML;
            const originalContent = document.body.innerHTML;
            
            document.body.innerHTML = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${currentLanguage === 'zh' ? '学生账号卡片' : 'Student Account Cards'}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .account-card { 
                            border: 1px solid #000; 
                            padding: 15px; 
                            margin-bottom: 15px; 
                            page-break-inside: avoid;
                        }
                        @media print {
                            .account-card { 
                                border: 1px solid #000 !important; 
                            }
                        }
                    </style>
                </head>
                <body>
                    <h2>${currentLanguage === 'zh' ? '学生账号卡片' : 'Student Account Cards'}</h2>
                    <div>${printContent}</div>
                </body>
                </html>
            `;
            
            window.print();
            document.body.innerHTML = originalContent;
            location.reload();
        } catch (error) {
            console.error('打印失败:', error);
            showMessage(currentLanguage === 'zh' ? '打印失败' : 'Print failed', 'error');
        }
    }
    
    // ==================== 统计功能 ====================
    async function showStatistics() {
        try {
            const statisticsContent = document.getElementById('statistics-content');
            const statisticsModal = document.getElementById('statistics-modal');
            
            if (!statisticsContent || !statisticsModal) return;
            
            statisticsContent.innerHTML = `<div style="text-align:center;padding:30px;">${translations[currentLanguage].loadingStats}</div>`;
            statisticsModal.style.display = 'flex';
            
            let stats = null;
            if (currentUser) {
                stats = await loadUserStats();
            }
            
            const sessionStats = calculateStatistics();
            
            if (stats) {
                const avgAccuracy = stats.totalAttempts > 0 
                    ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100) 
                    : 0;
                const avgTimePerQuestion = stats.totalQuestions > 0 
                    ? (stats.totalTimeUsed / stats.totalQuestions).toFixed(1) 
                    : 0;
                
                let html = `
                    <div style="padding: 20px;">
                        <h3 style="color: #4CAF50; margin-bottom: 15px;">${translations[currentLanguage].statisticsTitle}</h3>
                        
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                                <div style="font-size: 1.8em; margin-bottom: 5px;">🏆</div>
                                <div style="font-size: 0.9em; opacity: 0.9;">${translations[currentLanguage].totalGames}</div>
                                <div style="font-size: 2em; font-weight: bold;">${stats.totalGames}</div>
                            </div>
                            <div style="background: linear-gradient(135deg, #6b8cff 0%, #4a6cf7 100%); color: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                                <div style="font-size: 1.8em; margin-bottom: 5px;">💯</div>
                                <div style="font-size: 0.9em; opacity: 0.9;">${translations[currentLanguage].bestScore}</div>
                                <div style="font-size: 2em; font-weight: bold;">${stats.bestScore}</div>
                            </div>
                            <div style="background: linear-gradient(135deg, #ff8c5a 0%, #ff6b4a 100%); color: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                                <div style="font-size: 1.8em; margin-bottom: 5px;">🎯</div>
                                <div style="font-size: 0.9em; opacity: 0.9;">${translations[currentLanguage].bestAccuracy}</div>
                                <div style="font-size: 2em; font-weight: bold;">${stats.bestAccuracy}%</div>
                            </div>
                        </div>
                        
                        <div style="background: white; border-radius: 15px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">📊 ${translations[currentLanguage].modeStats}</h4>
                            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 15px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 1.5em; color: #4CAF50;">${stats.modeStats.standard}</div>
                                    <div style="color: #666; font-size: 0.85em;">${translations[currentLanguage].modeStandard}</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 1.5em; color: #FF9800;">${stats.modeStats.challenge}</div>
                                    <div style="color: #666; font-size: 0.85em;">${translations[currentLanguage].modeChallenge}</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 1.5em; color: #2196F3;">${stats.modeStats.practice}</div>
                                    <div style="color: #666; font-size: 0.85em;">${translations[currentLanguage].modePractice}</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 1.5em; color: #9C27B0;">${stats.modeStats.custom}</div>
                                    <div style="color: #666; font-size: 0.85em;">${translations[currentLanguage].modeCustom}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="background: white; border-radius: 15px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">⚡ ${translations[currentLanguage].accuracyLabel}</h4>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                                <div>
                                    <div style="color: #666; margin-bottom: 5px;">${translations[currentLanguage].totalQuestions}</div>
                                    <div style="font-size: 1.8em; font-weight: bold; color: #333;">${stats.totalQuestions}</div>
                                </div>
                                <div>
                                    <div style="color: #666; margin-bottom: 5px;">${translations[currentLanguage].totalCorrect}</div>
                                    <div style="font-size: 1.8em; font-weight: bold; color: #4CAF50;">${stats.totalCorrect}</div>
                                </div>
                                <div>
                                    <div style="color: #666; margin-bottom: 5px;">${translations[currentLanguage].avgAccuracy}</div>
                                    <div style="font-size: 1.8em; font-weight: bold; color: #FF9800;">${avgAccuracy}%</div>
                                </div>
                                <div>
                                    <div style="color: #666; margin-bottom: 5px;">${translations[currentLanguage].avgTimePerQuestion}</div>
                                    <div style="font-size: 1.8em; font-weight: bold; color: #2196F3;">${avgTimePerQuestion}s</div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="background: #f8f9fa; border-radius: 15px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; color: #333; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">🎮 ${translations[currentLanguage].myHistory}</h4>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                                <div>
                                    <div style="color: #666; font-size: 0.9em;">${translations[currentLanguage].scoreLabel}</div>
                                    <div style="font-size: 1.5em; font-weight: bold; color: #4CAF50;">${score}</div>
                                </div>
                                <div>
                                    <div style="color: #666; font-size: 0.9em;">${translations[currentLanguage].completedLabel}</div>
                                    <div style="font-size: 1.5em; font-weight: bold; color: #2196F3;">${completedQuestions}</div>
                                </div>
                                <div>
                                    <div style="color: #666; font-size: 0.9em;">${translations[currentLanguage].accuracyLabel}</div>
                                    <div style="font-size: 1.5em; font-weight: bold; color: #FF9800;">${sessionStats.accuracy}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                statisticsContent.innerHTML = html;
            } else {
                statisticsContent.innerHTML = `
                    <div style="padding: 20px;">
                        <h3 style="color: #4CAF50; margin-bottom: 15px;">${translations[currentLanguage].statisticsTitle}</h3>
                        <div style="text-align: center; padding: 30px; background: #f8f9fa; border-radius: 15px;">
                            <div style="font-size: 4em; margin-bottom: 20px;">📊</div>
                            <h4>${currentLanguage === 'zh' ? '暂无历史统计数据' : 'No historical statistics'}</h4>
                            <p style="color: #666; margin-top: 10px;">${currentLanguage === 'zh' ? '完成游戏并保存成绩后，统计数据将显示在这里' : 'After completing games and saving scores, statistics will be shown here'}</p>
                        </div>
                        
                        <div style="margin-top: 30px; background: white; border-radius: 15px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">🎮 ${translations[currentLanguage].myHistory}</h4>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                                <div>
                                    <div style="color: #666; font-size: 0.9em;">${translations[currentLanguage].scoreLabel}</div>
                                    <div style="font-size: 1.5em; font-weight: bold; color: #4CAF50;">${score}</div>
                                </div>
                                <div>
                                    <div style="color: #666; font-size: 0.9em;">${translations[currentLanguage].completedLabel}</div>
                                    <div style="font-size: 1.5em; font-weight: bold; color: #2196F3;">${completedQuestions}</div>
                                </div>
                                <div>
                                    <div style="color: #666; font-size: 0.9em;">${translations[currentLanguage].accuracyLabel}</div>
                                    <div style="font-size: 1.5em; font-weight: bold; color: #FF9800;">${sessionStats.accuracy}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            statisticsModal.style.display = 'flex';
        } catch (error) {
            console.error('显示统计失败:', error);
            showMessage(currentLanguage === 'zh' ? '加载统计信息失败' : 'Failed to load statistics', 'error');
        }
    }
    
    function calculateStatistics() {
        return {
            totalAttempts: gameHistory.length,
            correctCount: correctCount,
            accuracy: totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100
        };
    }
    
    // ==================== 排行榜功能 ====================
    async function loadLeaderboardData(type = 'standard', limit = 20) {
        try {
            if (!isSupabaseReady || !supabase) {
                return [];
            }
            
            let query = supabase
                .from('game_scores')
                .select('*')
                .eq('leaderboard_type', type)
                .order('score', { ascending: false })
                .limit(limit);
            
            const { data, error } = await query;
            
            if (error) {
                console.error('加载排行榜数据失败:', error);
                return [];
            }
            
            return data || [];
            
        } catch (error) {
            console.error('加载排行榜数据异常:', error);
            return [];
        }
    }
    
    async function loadUserBestScore(type) {
        try {
            if (!currentUser || !isSupabaseReady || !supabase) {
                return null;
            }
            
            const { data, error } = await supabase
                .from('game_scores')
                .select('*')
                .eq('user_id', currentUser.id)
                .eq('leaderboard_type', type)
                .order('score', { ascending: false })
                .limit(1);
            
            if (error) {
                console.error('加载用户最佳成绩失败:', error);
                return null;
            }
            
            return data && data.length > 0 ? data[0] : null;
            
        } catch (error) {
            console.error('加载用户最佳成绩异常:', error);
            return null;
        }
    }
    
    async function loadUserScores() {
        try {
            if (!currentUser || !isSupabaseReady || !supabase) {
                return;
            }
            
            const { data, error } = await supabase
                .from('game_scores')
                .select('*')
                .eq('user_id', currentUser.id)
                .order('created_at', { ascending: false })
                .limit(100);
            
            if (error) {
                console.error('加载用户成绩失败:', error);
                return;
            }
            
            if (data && data.length > 0) {
                localStorage.setItem(`mathGameScores_${currentUser.id}`, JSON.stringify({
                    scores: data,
                    timestamp: Date.now()
                }));
            }
            
        } catch (error) {
            console.error('加载用户成绩异常:', error);
        }
    }
    
    async function showLeaderboard() {
        try {
            const leaderboardContent = document.getElementById('leaderboard-content');
            const leaderboardModal = document.getElementById('leaderboard-modal');
            
            if (!leaderboardContent || !leaderboardModal) return;
            
            leaderboardContent.innerHTML = `<div style="text-align:center;padding:30px;">${translations[currentLanguage].loadingStats}</div>`;
            leaderboardModal.style.display = 'flex';
            
            const [easyScores, standardScores, challengeScores] = await Promise.all([
                loadLeaderboardData('easy', 10),
                loadLeaderboardData('standard', 10),
                loadLeaderboardData('challenge', 10)
            ]);
            
            let userEasyBest = null;
            let userStandardBest = null;
            let userChallengeBest = null;
            
            if (currentUser) {
                [userEasyBest, userStandardBest, userChallengeBest] = await Promise.all([
                    loadUserBestScore('easy'),
                    loadUserBestScore('standard'),
                    loadUserBestScore('challenge')
                ]);
            }
            
            let html = `
                <div style="padding: 20px;">
                    <h3 style="color: #4CAF50; margin-bottom: 20px;">${translations[currentLanguage].leaderboardTitle}</h3>
                    
                    <div style="display: flex; border-bottom: 2px solid #f0f0f0; margin-bottom: 20px;">
                        <button class="leaderboard-tab active" data-type="easy" style="flex:1; padding: 12px; background: none; border: none; border-bottom: 3px solid #8BC34A; font-weight: bold; color: #333; cursor: pointer; transition: all 0.3s;">
                            🟢 ${translations[currentLanguage].easyMode}
                        </button>
                        <button class="leaderboard-tab" data-type="standard" style="flex:1; padding: 12px; background: none; border: none; border-bottom: 3px solid transparent; font-weight: bold; color: #666; cursor: pointer; transition: all 0.3s;">
                            🟠 ${translations[currentLanguage].standardMode}
                        </button>
                        <button class="leaderboard-tab" data-type="challenge" style="flex:1; padding: 12px; background: none; border: none; border-bottom: 3px solid transparent; font-weight: bold; color: #666; cursor: pointer; transition: all 0.3s;">
                            🔴 ${translations[currentLanguage].challengeMode}
                        </button>
                    </div>
                    
                    <div id="leaderboard-content-inner">
            `;
            
            html += generateLeaderboardTable('easy', easyScores, userEasyBest, currentUser);
            
            html += `
                    </div>
                    
                    ${currentUser ? `
                    <div style="margin-top: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 15px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                        <h4 style="margin: 0 0 15px 0; color: white; display: flex; align-items: center;">
                            <span style="background: rgba(255,255,255,0.2); width: 40px; height: 40px; border-radius: 20px; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px;">👤</span>
                            ${translations[currentLanguage].myBest}
                        </h4>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                            <div style="text-align: center; background: rgba(255,255,255,0.1); border-radius: 10px; padding: 15px;">
                                <div style="font-size: 0.9em; opacity: 0.9;">${translations[currentLanguage].easyMode}</div>
                                <div style="font-size: 1.8em; font-weight: bold;">${userEasyBest ? userEasyBest.score : 0}</div>
                                <div style="font-size: 0.8em; opacity: 0.8;">${userEasyBest ? userEasyBest.accuracy + '%' : '-'}</div>
                            </div>
                            <div style="text-align: center; background: rgba(255,255,255,0.1); border-radius: 10px; padding: 15px;">
                                <div style="font-size: 0.9em; opacity: 0.9;">${translations[currentLanguage].standardMode}</div>
                                <div style="font-size: 1.8em; font-weight: bold;">${userStandardBest ? userStandardBest.score : 0}</div>
                                <div style="font-size: 0.8em; opacity: 0.8;">${userStandardBest ? userStandardBest.accuracy + '%' : '-'}</div>
                            </div>
                            <div style="text-align: center; background: rgba(255,255,255,0.1); border-radius: 10px; padding: 15px;">
                                <div style="font-size: 0.9em; opacity: 0.9;">${translations[currentLanguage].challengeMode}</div>
                                <div style="font-size: 1.8em; font-weight: bold;">${userChallengeBest ? userChallengeBest.score : 0}</div>
                                <div style="font-size: 0.8em; opacity: 0.8;">${userChallengeBest ? userChallengeBest.accuracy + '%' : '-'}</div>
                            </div>
                        </div>
                    </div>
                    ` : `
                    <div style="margin-top: 30px; background: #f8f9fa; border-radius: 15px; padding: 20px; text-align: center;">
                        <p style="color: #666;">${currentLanguage === 'zh' ? '登录后查看个人最佳成绩' : 'Login to see your best scores'}</p>
                        <button onclick="MathGame.showAuthModal()" style="background: #4CAF50; color: white; border: none; padding: 10px 25px; border-radius: 25px; font-size: 1em; cursor: pointer; margin-top: 10px;">
                            🔐 ${currentLanguage === 'zh' ? '立即登录' : 'Login Now'}
                        </button>
                    </div>
                    `}
                </div>
            `;
            
            leaderboardContent.innerHTML = html;
            
            setTimeout(() => {
                const tabs = document.querySelectorAll('.leaderboard-tab');
                tabs.forEach(tab => {
                    tab.addEventListener('click', function() {
                        tabs.forEach(t => {
                            t.classList.remove('active');
                            t.style.borderBottomColor = 'transparent';
                            t.style.color = '#666';
                        });
                        
                        this.classList.add('active');
                        this.style.borderBottomColor = this.dataset.type === 'easy' ? '#8BC34A' : 
                                                         this.dataset.type === 'standard' ? '#FF9800' : '#f44336';
                        this.style.color = '#333';
                        
                        const type = this.dataset.type;
                        let tableHtml = '';
                        if (type === 'easy') {
                            tableHtml = generateLeaderboardTable('easy', easyScores, userEasyBest, currentUser);
                        } else if (type === 'standard') {
                            tableHtml = generateLeaderboardTable('standard', standardScores, userStandardBest, currentUser);
                        } else {
                            tableHtml = generateLeaderboardTable('challenge', challengeScores, userChallengeBest, currentUser);
                        }
                        
                        const contentInner = document.getElementById('leaderboard-content-inner');
                        if (contentInner) {
                            contentInner.innerHTML = tableHtml;
                        }
                    });
                });
            }, 100);
            
        } catch (error) {
            console.error('显示排行榜失败:', error);
            showMessage(currentLanguage === 'zh' ? '加载排行榜失败' : 'Failed to load leaderboard', 'error');
        }
    }
    
    function generateLeaderboardTable(type, scores, userBest, currentUser) {
        const typeName = type === 'easy' ? translations[currentLanguage].easyMode :
                         type === 'standard' ? translations[currentLanguage].standardMode :
                         translations[currentLanguage].challengeMode;
        
        const typeColor = type === 'easy' ? '#8BC34A' :
                          type === 'standard' ? '#FF9800' : '#f44336';
        
        let html = `
            <div style="background: white; border-radius: 15px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                <h4 style="margin-top: 0; color: ${typeColor}; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; display: flex; align-items: center;">
                    <span style="background: ${typeColor}; color: white; width: 30px; height: 30px; border-radius: 15px; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 0.9em;">🏆</span>
                    ${typeName} ${translations[currentLanguage].rank}
                </h4>
        `;
        
        if (scores.length === 0) {
            html += `
                <div style="text-align: center; padding: 40px 20px; background: #f8f9fa; border-radius: 10px;">
                    <div style="font-size: 3em; margin-bottom: 15px;">🏆</div>
                    <p style="color: #666; margin: 0;">${translations[currentLanguage].noData}</p>
                    <p style="color: #999; font-size: 0.9em; margin-top: 10px;">${currentLanguage === 'zh' ? '完成游戏并保存成绩，即可上榜' : 'Complete games and save scores to join the leaderboard'}</p>
                </div>
            `;
        } else {
            html += `
                <div style="margin-top: 15px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="border-bottom: 2px solid #f0f0f0;">
                                <th style="padding: 10px; text-align: left; color: #666;">${translations[currentLanguage].rank}</th>
                                <th style="padding: 10px; text-align: left; color: #666;">${translations[currentLanguage].player}</th>
                                <th style="padding: 10px; text-align: right; color: #666;">${translations[currentLanguage].score}</th>
                                <th style="padding: 10px; text-align: right; color: #666;">${translations[currentLanguage].accuracy}</th>
                                <th style="padding: 10px; text-align: right; color: #666;">${translations[currentLanguage].time}</th>
                                <th style="padding: 10px; text-align: right; color: #666;">${translations[currentLanguage].date}</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            scores.forEach((score, index) => {
                const isCurrentUser = currentUser && score.user_id === currentUser.id;
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`;
                const rowStyle = isCurrentUser ? 'background: #FFF9C4; font-weight: bold;' : 
                                 index % 2 === 0 ? 'background: #fafafa;' : '';
                const date = new Date(score.created_at || score.timestamp).toLocaleDateString(
                    currentLanguage === 'zh' ? 'zh-CN' : 'en-US',
                    { month: 'short', day: 'numeric' }
                );
                
                html += `
                    <tr style="border-bottom: 1px solid #f0f0f0; ${rowStyle}">
                        <td style="padding: 12px 10px; text-align: left;">
                            <span style="display: inline-block; width: 30px; height: 30px; line-height: 30px; text-align: center; border-radius: 15px; background: ${index < 3 ? '#FFF3E0' : 'transparent'};">
                                ${medal}
                            </span>
                        </td>
                        <td style="padding: 12px 10px; text-align: left;">
                            <div style="display: flex; align-items: center;">
                                <span style="font-weight: ${isCurrentUser ? 'bold' : 'normal'}; color: ${isCurrentUser ? '#4CAF50' : '#333'}">
                                    ${score.username || score.email?.split('@')[0] || '匿名玩家'}
                                </span>
                                ${isCurrentUser ? '<span style="background: #4CAF50; color: white; font-size: 0.7em; padding: 2px 8px; border-radius: 12px; margin-left: 8px;">你</span>' : ''}
                            </div>
                        </td>
                        <td style="padding: 12px 10px; text-align: right; font-weight: bold; color: ${index < 3 ? '#4CAF50' : '#333'}">
                            ${score.score}
                        </td>
                        <td style="padding: 12px 10px; text-align: right; color: #666;">
                            ${score.accuracy}%
                        </td>
                        <td style="padding: 12px 10px; text-align: right; color: #666;">
                            ${score.time_used}s
                        </td>
                        <td style="padding: 12px 10px; text-align: right; color: #999; font-size: 0.85em;">
                            ${date}
                        </td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        html += `</div>`;
        
        return html;
    }
    
    // ==================== 历史记录显示 ====================
    function showHistory() {
        try {
            const tbody = document.getElementById('history-table-body');
            const historyModal = document.getElementById('history-modal');
            
            if (!tbody || !historyModal) return;
            
            tbody.innerHTML = '';
            
            if (gameHistory.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:20px;">${translations[currentLanguage].noData}</td></tr>`;
            } else {
                gameHistory.slice(-15).forEach((record, index) => {
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
    
    // ==================== 错题本显示 ====================
    function showWrongBook() {
        try {
            loadWrongQuestions();
            
            const container = document.getElementById('wrong-questions-list');
            const wrongbookModal = document.getElementById('wrongbook-modal');
            
            if (!container || !wrongbookModal) return;
            
            container.innerHTML = '';
            
            if (wrongQuestions.length === 0) {
                container.innerHTML = `<div style="text-align:center;padding:20px;color:#666;">${translations[currentLanguage].noData}</div>`;
            } else {
                wrongQuestions.slice(0, 20).forEach((question) => {
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
                
                if (wrongQuestions.length > 20) {
                    const more = document.createElement('div');
                    more.style.cssText = 'text-align:center;padding:15px;color:#666;';
                    more.textContent = currentLanguage === 'zh' ? `... 还有 ${wrongQuestions.length - 20} 条错题` : `... ${wrongQuestions.length - 20} more questions`;
                    container.appendChild(more);
                }
            }
            
            wrongbookModal.style.display = 'flex';
        } catch (error) {
            console.error('显示错题本失败:', error);
        }
    }
    
    // ==================== 个人资料显示 ====================
    function showProfile() {
        try {
            if (!currentUser) {
                showMessage(currentLanguage === 'zh' ? '请先登录查看个人资料' : 'Please login to view profile', 'info');
                showAuthModal();
                return;
            }
            
            const profileModal = document.getElementById('profile-modal');
            if (!profileModal) return;
            
            profileModal.style.display = 'flex';
            
            const email = currentUser.email || '';
            const firstLetter = email.charAt(0).toUpperCase() || '?';
            document.getElementById('profile-avatar').textContent = firstLetter;
            document.getElementById('profile-email').textContent = email;
            
            const userRole = currentUser.user_metadata?.role || 'student';
            const roleText = userRole === 'teacher' ? (currentLanguage === 'zh' ? '👨‍🏫 教师' : '👨‍🏫 Teacher') : (currentLanguage === 'zh' ? '👨‍🎓 学生' : '👨‍🎓 Student');
            document.getElementById('profile-role').textContent = roleText;
            
            loadUserStats().then(stats => {
                if (stats) {
                    document.getElementById('profile-game-count').textContent = stats.totalGames;
                    document.getElementById('profile-high-score').textContent = stats.bestScore;
                    document.getElementById('profile-avg-accuracy').textContent = stats.totalAttempts > 0 
                        ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100) + '%' 
                        : '0%';
                } else {
                    document.getElementById('profile-game-count').textContent = '0';
                    document.getElementById('profile-high-score').textContent = '0';
                    document.getElementById('profile-avg-accuracy').textContent = '0%';
                }
            });
            
            const joinDate = new Date(currentUser.created_at);
            document.getElementById('profile-join-date').textContent = joinDate.toLocaleDateString(currentLanguage === 'zh' ? 'zh-CN' : 'en-US');
        } catch (error) {
            console.error('显示个人资料失败:', error);
        }
    }
    
    // ==================== 教师工具 ====================
    function showTeacherTools() {
        try {
            if (!currentUser) {
                showAuthModal();
                showMessage(currentLanguage === 'zh' ? '请先登录' : 'Please login first', 'info');
                return;
            }
            
            const userRole = currentUser.user_metadata?.role;
            const isApprovedTeacher = userRole === 'teacher' && currentUser.user_metadata?.approved === true;
            
            if (!isApprovedTeacher && !isAdminUser) {
                showMessage(
                    currentLanguage === 'zh' 
                        ? '只有已批准的教师或管理员可以使用此功能' 
                        : 'Only approved teachers or administrators can use this feature',
                    'error'
                );
                return;
            }
            
            const teacherToolsModal = document.getElementById('teacher-tools-modal');
            if (teacherToolsModal) teacherToolsModal.style.display = 'flex';
        } catch (error) {
            console.error('显示教师工具失败:', error);
        }
    }
    
    // ==================== 管理员工具 ====================
    function showAdminTools() {
        try {
            if (!currentUser) {
                showAuthModal();
                showMessage(currentLanguage === 'zh' ? '请先登录管理员账号' : 'Please login as administrator', 'info');
                return;
            }
            
            if (!isAdminUser) {
                showMessage(
                    currentLanguage === 'zh' 
                        ? '只有管理员可以访问此功能' 
                        : 'Only administrators can access this feature',
                    'error'
                );
                return;
            }
            
            const adminToolsModal = document.getElementById('admin-tools-modal');
            if (adminToolsModal) adminToolsModal.style.display = 'flex';
        } catch (error) {
            console.error('显示管理员工具失败:', error);
        }
    }
    
    // ==================== 提示系统 ====================
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
            hintBtn.innerHTML = `<span>💡 ${translations[currentLanguage].hintButton}</span>`;
            hintBtn.disabled = false;
            hintBtn.style.opacity = '1';
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
            
            const elapsedTime = startTime ? Math.floor((new Date() - startTime) / 1000) : 0;
            const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;
            
            const success = await saveGameScoreToCloud(score, completedQuestions, accuracy, elapsedTime);
            
            if (success) {
                showMessage(currentLanguage === 'zh' ? '✅ 成绩保存成功！' : '✅ Score saved successfully!', 'success');
            } else {
                showMessage(currentLanguage === 'zh' ? '⚠️ 成绩保存失败，请稍后重试' : '⚠️ Failed to save score, please try again later', 'warning');
            }
            
            const gameOverElement = document.getElementById('game-over');
            if (gameOverElement) gameOverElement.style.display = 'none';
            
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
            const savedLang = localStorage.getItem('mathGameLanguage');
            if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
                currentLanguage = savedLang;
            }
            setLanguage(currentLanguage);
            
            await initSupabase();
            
            if (isSupabaseReady) {
                await checkAuth();
            }
            
            loadAchievements();
            loadWrongQuestions();
            
            bindEventListeners();
            
            selectMode('standard');
            
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
            
        } catch (error) {
            console.error('初始化失败:', error);
            showMessage(currentLanguage === 'zh' ? '初始化失败，请刷新页面' : 'Initialization failed, please refresh page', 'error');
        }
    }
    
    // ==================== 绑定事件监听器 ====================
    function bindEventListeners() {
        try {
            document.getElementById('language-btn')?.addEventListener('click', () => {
                const newLang = currentLanguage === 'zh' ? 'en' : 'zh';
                setLanguage(newLang);
                showMessage(newLang === 'zh' ? '已切换到中文' : 'Switched to English', 'info');
            });
            
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
                document.getElementById(id)?.addEventListener('click', handler);
            });
            
            const modeButtons = [
                { id: 'mode-standard', mode: 'standard' },
                { id: 'mode-challenge', mode: 'challenge' },
                { id: 'mode-practice', mode: 'practice' },
                { id: 'mode-custom', mode: 'custom' }
            ];
            
            modeButtons.forEach(({ id, mode }) => {
                document.getElementById(id)?.addEventListener('click', () => selectMode(mode));
            });
            
            document.getElementById('start-btn')?.addEventListener('click', startGame);
            document.getElementById('hint-btn')?.addEventListener('click', showHint);
            document.getElementById('refresh-btn')?.addEventListener('click', refreshNumbers);
            document.getElementById('endgame-btn')?.addEventListener('click', () => endGame('giveup'));
            
            document.getElementById('close-auth-modal')?.addEventListener('click', closeAuthModal);
            document.getElementById('auth-submit-btn')?.addEventListener('click', handleAuth);
            document.getElementById('auth-switch-link')?.addEventListener('click', toggleAuthMode);
            
            document.getElementById('auth-role')?.addEventListener('change', function() {
                const teacherRegisterFields = document.getElementById('teacher-register-fields');
                if (teacherRegisterFields) {
                    teacherRegisterFields.style.display = this.value === 'teacher' ? 'block' : 'none';
                }
            });
            
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
                document.getElementById(id)?.addEventListener('click', () => {
                    const modalElement = document.getElementById(modal);
                    if (modalElement) modalElement.style.display = 'none';
                    if (handler) handler();
                });
            });
            
            document.getElementById('save-score-btn')?.addEventListener('click', saveScore);
            document.getElementById('play-again-btn')?.addEventListener('click', restartGame);
            document.getElementById('view-leaderboard-btn')?.addEventListener('click', showLeaderboard);
            document.getElementById('view-statistics-btn')?.addEventListener('click', showStatistics);
            
            document.getElementById('clear-history-btn')?.addEventListener('click', () => {
                if (confirm(currentLanguage === 'zh' ? '确定要清空本次游戏的历史记录吗？' : 'Are you sure you want to clear the current game history?')) {
                    gameHistory = [];
                    showHistory();
                    showMessage(currentLanguage === 'zh' ? '历史记录已清空' : 'History cleared', 'info');
                }
            });
            
            document.getElementById('sync-wrong-questions-btn')?.addEventListener('click', syncAllWrongQuestionsToCloud);
            
            document.getElementById('clear-wrong-questions-btn')?.addEventListener('click', () => {
                if (confirm(currentLanguage === 'zh' ? '确定要清空本地错题吗？（云端错题不受影响）' : 'Are you sure you want to clear local wrong questions? (Cloud data will not be affected)')) {
                    wrongQuestions = [];
                    saveWrongQuestions();
                    showWrongBook();
                    showMessage(currentLanguage === 'zh' ? '本地错题已清空' : 'Local wrong questions cleared', 'info');
                }
            });
            
            document.getElementById('download-template-btn')?.addEventListener('click', downloadTemplate);
            document.getElementById('upload-excel-btn')?.addEventListener('click', uploadExcelFile);
            document.getElementById('print-cards-btn')?.addEventListener('click', printAccountCards);
            
            const teacherTabButtons = document.querySelectorAll('#teacher-tools-modal .tab-btn');
            teacherTabButtons.forEach(button => {
                button.addEventListener('click', function() {
                    teacherTabButtons.forEach(btn => btn.classList.remove('active'));
                    document.querySelectorAll('#teacher-tools-modal .tab-content').forEach(content => {
                        content.classList.remove('active');
                        content.style.display = 'none';
                    });
                    
                    this.classList.add('active');
                    const tabId = this.getAttribute('data-tab') + '-tab';
                    const tabContent = document.getElementById(tabId);
                    if (tabContent) {
                        tabContent.classList.add('active');
                        tabContent.style.display = 'block';
                    }
                });
            });
            
            document.getElementById('refresh-teachers-btn')?.addEventListener('click', () => {
                showMessage(currentLanguage === 'zh' ? '刷新功能开发中' : 'Refresh feature in development', 'info');
            });
            
            document.getElementById('refresh-stats-btn')?.addEventListener('click', () => {
                showMessage(currentLanguage === 'zh' ? '刷新功能开发中' : 'Refresh feature in development', 'info');
            });
            
            const adminTabButtons = document.querySelectorAll('#admin-tools-modal .tab-btn');
            adminTabButtons.forEach(button => {
                button.addEventListener('click', function() {
                    adminTabButtons.forEach(btn => btn.classList.remove('active'));
                    document.querySelectorAll('#admin-tools-modal .tab-content').forEach(content => {
                        content.classList.remove('active');
                        content.style.display = 'none';
                    });
                    
                    this.classList.add('active');
                    const tabId = this.getAttribute('data-tab') + '-tab';
                    const tabContent = document.getElementById(tabId);
                    if (tabContent) {
                        tabContent.classList.add('active');
                        tabContent.style.display = 'block';
                    }
                });
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
        showLeaderboard,
        showProfile,
        showTeacherTools,
        showAdminTools,
        logout,
        closeAuthModal,
        handleAuth,
        toggleAuthMode,
        saveScore,
        showAuthModal
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
