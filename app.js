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
    // ==================== Supabase 配置 ====================
    // 安全地从配置获取或使用环境变量
    let SUPABASE_URL, SUPABASE_ANON_KEY;
    
    try {
        // 首先尝试从页面配置获取
        const configElement = document.getElementById('supabase-config');
        if (configElement) {
            const config = JSON.parse(configElement.textContent);
            SUPABASE_URL = config.supabaseUrl;
            SUPABASE_ANON_KEY = config.supabaseKey;
        }
    } catch (e) {
        console.warn('解析页面配置失败，使用环境变量');
    }
    
    // 如果没有配置，尝试从环境变量获取
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        // 对于Vercel部署，通过构建时注入
        SUPABASE_URL = window.__ENV__?.SUPABASE_URL || '';
        SUPABASE_ANON_KEY = window.__ENV__?.SUPABASE_ANON_KEY || '';
    }
    
    // 如果还是没有，显示错误（生产环境应该配置环境变量）
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error('❌ Supabase配置缺失！请在Vercel设置环境变量。');
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
    
    // 修改的数字范围配置（根据你的要求）
    const RANGE_CONFIG = {
        '0-9': { 
            min: 0, 
            max: 9,
            targetMin: 5,  // 目标和最小
            targetMax: 10  // 目标和最大
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
    
    // ==================== 管理员配置 ====================
    const ADMIN_EMAILS = ['yyssyun90@gmail.com'];
    let isAdminUser = false;
    
    // ==================== 工具函数 ====================
    function setLanguage(lang) {
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
    
    // 显示成就解锁通知
    function showAchievementUnlock(achievement) {
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
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // ==================== 管理员功能 ====================
    function checkIfAdmin() {
        if (!currentUser) return false;
        
        const email = currentUser.email.toLowerCase();
        const isInAdminList = ADMIN_EMAILS.some(adminEmail => 
            adminEmail.toLowerCase() === email
        );
        
        const userRole = currentUser.user_metadata?.role;
        const isAdminInMetadata = userRole === 'admin' || userRole === 'superadmin';
        
        return isInAdminList || isAdminInMetadata;
    }
    
    async function loadPendingTeachers() {
        try {
            const container = document.getElementById('pending-teachers-list');
            container.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">加载中...</div>';
            
            const { data: scores, error } = await supabase
                .from('scores')
                .select('user_id, player_name, created_at')
                .order('created_at', { ascending: false })
                .limit(20);
            
            if (error) throw error;
            
            if (!scores || scores.length === 0) {
                container.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">暂无用户数据</div>';
                return;
            }
            
            let html = '<h4>最近活跃用户：</h4>';
            
            const uniqueUsers = {};
            scores.forEach(score => {
                if (!uniqueUsers[score.user_id]) {
                    uniqueUsers[score.user_id] = score;
                }
            });
            
            const userList = Object.values(uniqueUsers).slice(0, 10);
            
            userList.forEach((user, index) => {
                html += `
                    <div style="padding: 10px; margin-bottom: 10px; background: white; border-radius: 8px; border-left: 4px solid #4CAF50;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong>${user.player_name}</strong><br>
                                <small style="color: #666;">ID: ${user.user_id.substring(0, 8)}...</small><br>
                                <small style="color: #666;">最后活动: ${new Date(user.created_at).toLocaleDateString()}</small>
                            </div>
                            <div>
                                <button class="btn admin-instruction-btn" data-user-id="${user.user_id}" data-user-name="${user.player_name}" 
                                        style="background: #4CAF50; padding: 5px 10px; font-size: 0.9em;">
                                    管理
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += `
                <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
                    <h4>📝 管理员操作指南：</h4>
                    <ol style="margin-left: 20px; color: #666;">
                        <li>登录 Supabase 控制台</li>
                        <li>进入 <strong>Authentication → Users</strong></li>
                        <li>搜索用户邮箱或ID</li>
                        <li>编辑用户元数据，设置教师权限</li>
                    </ol>
                </div>
            `;
            
            container.innerHTML = html;
            
            // 为所有管理按钮添加事件监听器
            container.querySelectorAll('.admin-instruction-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const userId = this.getAttribute('data-user-id');
                    const userName = this.getAttribute('data-user-name');
                    showAdminInstructions(userId, userName);
                });
            });
            
        } catch (error) {
            console.error('加载用户列表失败:', error);
            document.getElementById('pending-teachers-list').innerHTML = 
                '<div style="text-align: center; padding: 40px; color: #ff4444;">加载失败</div>';
        }
    }
    
    // 管理员操作指南函数
    function showAdminInstructions(userId, username) {
        const instructions = `
            📋 用户管理指南：
            
            用户：${username}
            ID：${userId}
            
            操作步骤：
            1. 登录 Supabase 控制台
            2. 进入 Authentication → Users
            3. 搜索用户ID或邮箱
            4. 点击编辑按钮
            5. 在 user_metadata 中添加：
               {
                 "role": "teacher",
                 "approved": true
               }
            6. 保存更改
        `;
        
        if (confirm(instructions + '\n\n确定要查看详细指南吗？')) {
            alert(`
                详细操作步骤：
                
                1. 访问：https://app.supabase.com
                2. 选择你的项目
                3. 点击左侧菜单的 Authentication
                4. 点击 Users
                5. 在搜索框输入用户ID或邮箱
                6. 找到用户后点击 Edit
                7. 找到 user_metadata 字段
                8. 添加或修改为：
                   {
                     "username": "${username}",
                     "role": "teacher",
                     "approved": true,
                     "approved_at": "${new Date().toISOString()}",
                     "approved_by": "${currentUser ? currentUser.email : 'admin'}"
                   }
                9. 点击 Save
            `);
        }
    }
    
    async function loadSystemStatistics() {
        try {
            const container = document.getElementById('system-statistics');
            container.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">加载中...</div>';
            
            const { data: scores, error: scoresError } = await supabase
                .from('scores')
                .select('*');
            
            if (scoresError) throw scoresError;
            
            const totalGames = scores?.length || 0;
            const totalScore = scores?.reduce((sum, item) => sum + item.score, 0) || 0;
            const avgScore = totalGames > 0 ? (totalScore / totalGames).toFixed(1) : 0;
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayGames = scores?.filter(score => 
                new Date(score.created_at) >= today
            ).length || 0;
            
            const modes = {};
            scores?.forEach(score => {
                modes[score.mode] = (modes[score.mode] || 0) + 1;
            });
            
            let html = `
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="color: #666; font-size: 0.9em;">总游戏次数</div>
                        <div style="color: #2196F3; font-size: 1.5em; font-weight: bold;">${totalGames}</div>
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="color: #666; font-size: 0.9em;">平均得分</div>
                        <div style="color: #4CAF50; font-size: 1.5em; font-weight: bold;">${avgScore}</div>
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="color: #666; font-size: 0.9em;">今日游戏</div>
                        <div style="color: #FF9800; font-size: 1.5em; font-weight: bold;">${todayGames}</div>
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="color: #666; font-size: 0.9em;">更新时间</div>
                        <div style="color: #9C27B0; font-size: 1.2em; font-weight:bold;">${new Date().toLocaleTimeString()}</div>
                    </div>
                </div>
            `;
            
            if (Object.keys(modes).length > 0) {
                html += `
                    <div style="margin-top: 20px;">
                        <h4>游戏模式统计：</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-top: 10px;">
                `;
                
                Object.entries(modes).forEach(([mode, count]) => {
                    const percentage = totalGames > 0 ? ((count / totalGames) * 100).toFixed(1) : 0;
                    html += `
                        <div style="background: #e3f2fd; padding: 10px; border-radius: 8px; text-align: center;">
                            <div style="color: #666; font-size: 0.8em;">${mode}</div>
                            <div style="color: #2196F3; font-size: 1.2em; font-weight: bold;">${count}</div>
                            <div style="color: #666; font-size: 0.8em;">${percentage}%</div>
                        </div>
                    `;
                });
                
                html += `</div></div>`;
            }
            
            const recentGames = scores?.slice(0, 5) || [];
            if (recentGames.length > 0) {
                html += `
                    <div style="margin-top: 20px;">
                        <h4>最近游戏记录：</h4>
                        <div style="max-height: 200px; overflow-y: auto; margin-top: 10px;">
                `;
                
                recentGames.forEach((game, index) => {
                    html += `
                        <div style="padding: 8px; margin-bottom: 5px; background: white; border-radius: 6px; border-left: 4px solid #4CAF50;">
                            <div><strong>${game.player_name}</strong> - ${game.mode}模式</div>
                            <div style="font-size: 0.8em; color: #666;">
                                得分: ${game.score} | 正确率: ${game.accuracy}% | 用时: ${game.time_used}秒
                            </div>
                        </div>
                    `;
                });
                
                html += `</div></div>`;
            }
            
            container.innerHTML = html;
            
        } catch (error) {
            console.error('加载系统统计失败:', error);
            container.innerHTML = '<div style="text-align: center; padding: 40px; color: #ff4444;">加载失败</div>';
        }
    }
    
    // ==================== 输入验证函数 ====================
    function sanitizeInput(input, maxLength = 100) {
        if (typeof input !== 'string') input = String(input);
        return input
            .substring(0, maxLength)
            .replace(/[<>]/g, '')
            .trim();
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validatePassword(password) {
        return password.length >= 6;
    }
    
    // ==================== 修改的数字网格生成函数 ====================
    function generateNumberGrid() {
        const gameGrid = document.getElementById('game-grid');
        const range = document.getElementById('number-range').value;
        const config = RANGE_CONFIG[range];
        
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
    
    // ==================== 核心游戏函数 ====================
    function selectMode(mode) {
        currentMode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
        
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
                startBtn.querySelector('span').textContent = translations[currentLanguage][textKey];
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
        
        const range = document.getElementById('number-range').value;
        const modeConfig = { ...MODE_CONFIG[currentMode] };
        
        if (currentMode === 'custom') {
            modeConfig.questions = parseInt(document.getElementById('custom-questions').value) || 20;
            modeConfig.time = parseInt(document.getElementById('custom-time').value) || 60;
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
    }
    
    function resetGame() {
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
    }
    
    function generateNewTarget() {
        const range = document.getElementById('number-range').value;
        const config = RANGE_CONFIG[range];
        
        // 根据范围生成新的目标和
        const targetRange = config.targetMax - config.targetMin;
        currentTarget = Math.floor(Math.random() * (targetRange + 1)) + config.targetMin;
        document.getElementById('target-sum').textContent = currentTarget;
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
        const startCheckTime = new Date();
        const num1 = parseInt(selectedCards[0].dataset.value);
        const num2 = parseInt(selectedCards[1].dataset.value);
        const sum = num1 + num2;
        const isCorrect = sum === currentTarget;
        const responseTime = (new Date() - startCheckTime) / 1000;
        
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
    }
    
    function updateTimer() {
        if (!gameActive || !timerInterval) return;
        
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
    }
    
    function updateElapsedTime() {
        if (!gameActive) return;
        
        const elapsed = Math.floor((new Date() - startTime) / 1000);
        document.getElementById('time').textContent = elapsed;
        
        if (currentMode === 'standard') {
            const progress = (completedQuestions / MODE_CONFIG.standard.questions) * 100;
            document.getElementById('progress-bar').style.width = `${progress}%`;
        }
    }
    
    function updateDisplay() {
        document.getElementById('score').textContent = score;
        const modeConfig = MODE_CONFIG[currentMode];
        if (modeConfig.questions) {
            document.getElementById('completed').textContent = `${completedQuestions}/${modeConfig.questions}`;
        } else {
            document.getElementById('completed').textContent = completedQuestions;
        }
        const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;
        document.getElementById('accuracy').textContent = accuracy + '%';
    }
    
    function endGame(reason) {
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
    }
    
    function restartGame() {
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
    }
    
    // ==================== 数据备份和恢复 ====================
    function backupLocalData() {
        try {
            const backupData = {
                wrongQuestions: wrongQuestions,
                achievements: Array.from(achievements.entries()),
                achievementProgress: achievementProgress,
                timestamp: new Date().toISOString()
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
            
            const { error } = await supabase
                .from('user_backups')
                .upsert({
                    user_id: currentUser.id,
                    backup_data: backupData,
                    updated_at: new Date().toISOString()
                });
            
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
            const { data, error } = await supabase
                .from('user_backups')
                .select('backup_data')
                .eq('user_id', currentUser.id)
                .single();
            
            if (error) throw error;
            
            if (!data || !data.backup_data) {
                showMessage(currentLanguage === 'zh' ? '云端没有找到备份数据' : 'No backup data found in cloud', 'info');
                return false;
            }
            
            const backupData = data.backup_data;
            
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
    
    // ==================== 修复的时间计算函数 ====================
    function calculateElapsedTime(reason) {
        if (!startTime) return 0;
        
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
    }
    
    // ==================== 错题去重功能 ====================
    function recordWrongQuestion(num1, num2, target) {
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
                count: 1  // 错误次数
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
    }
    
    // ==================== 成就系统增强 ====================
    function checkAndTriggerAchievements() {
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
    }
    
    function updateAchievements() {
        ACHIEVEMENTS.forEach(ach => {
            const achieved = ach.condition();
            achievements.set(ach.id, achieved);
        });
        saveAchievements();
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
    }
    
    // ==================== 错题本功能增强 ====================
    function showWrongBook() {
        loadWrongQuestions();
        const container = document.getElementById('wrong-questions-list');
        container.innerHTML = '';
        
        if (wrongQuestions.length === 0) {
            container.innerHTML = `<div style="text-align:center;padding:20px;color:#666;">${currentLanguage === 'zh' ? '错题本为空' : 'Wrong questions list is empty'}</div>`;
        } else {
            // 按错误次数排序
            const sortedQuestions = [...wrongQuestions].sort((a, b) => b.count - a.count);
            
            sortedQuestions.forEach((question, index) => {
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
        
        document.getElementById('wrongbook-modal').style.display = 'flex';
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
    
    // ==================== 云端同步错题 ====================
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
            const { error } = await supabase
                .from('user_wrong_questions')
                .upsert({
                    user_id: currentUser.id,
                    wrong_questions: wrongQuestions,
                    count: wrongQuestions.length,
                    updated_at: new Date().toISOString()
                });
            
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
            const { data, error } = await supabase
                .from('user_wrong_questions')
                .select('wrong_questions')
                .eq('user_id', currentUser.id)
                .single();
            
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
    
    function updateHintCooldown() {
        if (hintCooldown > 0) {
            hintCooldown--;
            updateHintButton();
        }
    }
    
    function updateHintButton() {
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
    }
    
    function refreshNumbers() {
        const gameGrid = document.getElementById('game-grid');
        gameGrid.style.opacity = '0.5';
        setTimeout(() => {
            generateNumberGrid();
            gameGrid.style.opacity = '1';
        }, 500);
    }
    
    function showFeedback(text, type) {
        const feedback = document.getElementById('match-feedback');
        feedback.textContent = text;
        feedback.style.color = type === 'success' ? '#4CAF50' : '#ff4444';
        feedback.style.opacity = '1';
        setTimeout(() => { feedback.style.opacity = '0'; }, 1000);
    }
    
    // ==================== 用户认证系统 ====================
    async function checkAuth() {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (user) {
                currentUser = user;
                updateUserInfo();
                await loadWrongQuestionsFromCloud();
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
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                document.getElementById('auth-error').textContent = error.message;
                return false;
            }
            currentUser = data.user;
            updateUserInfo();
            closeAuthModal();
            showMessage(currentLanguage === 'zh' ? '登录成功！' : 'Login successful!', 'success');
            
            await loadWrongQuestionsFromCloud();
            return true;
        } catch (error) {
            console.error('登录失败:', error);
            document.getElementById('auth-error').textContent = error.message;
            return false;
        }
    }
    
    async function register(email, password, username, role = 'student', school = '', state = '') {
        try {
            const userMetadata = { 
                username: username || email.split('@')[0],
                role: role 
            };
            
            if (role === 'teacher') {
                userMetadata.school = school;
                userMetadata.state = state;
                userMetadata.approved = false; // 需要审核
            }
            
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: userMetadata }
            });
            
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
            return true;
        } catch (error) {
            console.error('注册失败:', error);
            document.getElementById('auth-error').textContent = error.message;
            return false;
        }
    }
    
    async function logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                showMessage((currentLanguage === 'zh' ? '退出失败: ' : 'Logout failed: ') + error.message, 'error');
                return;
            }
            currentUser = null;
            document.getElementById('user-info').style.display = 'none';
            document.getElementById('teacher-tools-btn').style.display = 'none';
            document.getElementById('admin-tools-btn').style.display = 'none';
            showMessage(currentLanguage === 'zh' ? '已退出登录' : 'Logged out', 'info');
        } catch (error) {
            console.error('退出失败:', error);
            showMessage((currentLanguage === 'zh' ? '退出失败: ' : 'Logout failed: ') + error.message, 'error');
        }
    }
    
    function updateUserInfo() {
        if (!currentUser) return;
        
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
        
        isAdminUser = checkIfAdmin();
        if (isAdminUser) {
            document.getElementById('admin-tools-btn').style.display = 'flex';
        } else {
            document.getElementById('admin-tools-btn').style.display = 'none';
        }
    }
    
    function showAuthModal() {
        document.getElementById('auth-modal').style.display = 'flex';
        updateAuthUI();
    }
    
    function closeAuthModal() {
        document.getElementById('auth-modal').style.display = 'none';
        document.getElementById('auth-email').value = '';
        document.getElementById('auth-password').value = '';
        document.getElementById('auth-username').value = '';
        document.getElementById('auth-school').value = '';
        document.getElementById('auth-state').value = '';
        document.getElementById('auth-error').textContent = '';
    }
    
    function updateAuthUI() {
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
    }
    
    function toggleAuthMode() {
        authMode = authMode === 'login' ? 'register' : 'login';
        updateAuthUI();
    }
    
    async function handleAuth() {
        const email = sanitizeInput(document.getElementById('auth-email').value.trim(), 100);
        const password = document.getElementById('auth-password').value.trim();
        const username = sanitizeInput(document.getElementById('auth-username').value.trim(), 50);
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
            document.getElementById('auth-error').textContent = currentLanguage === 'zh' ? '密码长度至少为6位' : 'Password must be at least 6 characters long';
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
            let playerName = sanitizeInput(nameInput.value.trim(), 50);
            
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
            
            const { data, error } = await supabase
                .from('scores')
                .insert([scoreData])
                .select();
            
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
            showMessage(currentLanguage === 'zh' ? '保存成绩失败，请检查网络连接' : 'Save score failed, please check network connection', 'error');
        } finally {
            isSavingScore = false;
        }
    }
    
    // ==================== 其他功能 ====================
    function showStatistics() {
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
    }
    
    // ==================== 修复的排行榜功能 ====================
    async function showLeaderboardTab(tab, event) {
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
        
        try {
            let data = await queryScoresDirectly(tab);
            
            if (!data || data.length === 0) {
                content.innerHTML = `<div style="text-align:center;padding:40px;color:#666;">${currentLanguage === 'zh' ? '暂无排行榜数据' : 'No leaderboard data'}</div>`;
                return;
            }
            
            renderLeaderboard(data, tab, content);
            
        } catch (error) {
            console.error('获取排行榜失败:', error);
            content.innerHTML = `<div style="text-align:center;padding:40px;color:#666;">${currentLanguage === 'zh' ? '加载失败: ' : 'Load failed: '}${error.message}</div>`;
        }
    }
    
    async function queryScoresDirectly(tab) {
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
        
        const { data, error } = await query.limit(20);
        
        if (error) {
            console.error('直接查询失败:', error);
            return [];
        }
        
        return data || [];
    }
    
    function renderLeaderboard(data, tab, content) {
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
    }
    
    async function showMyLeaderboardHistory() {
        if (!currentUser) {
            document.getElementById('leaderboard-content').innerHTML = 
                `<div style="text-align:center;padding:40px;color:#666;">${currentLanguage === 'zh' ? '请先登录查看个人历史' : 'Please login to view personal history'}</div>`;
            return;
        }
        
        try {
            const { data, error } = await supabase
                .from('scores')
                .select('*')
                .eq('user_id', currentUser.id)
                .order('created_at', { ascending: false })
                .limit(10);
            
            if (error) {
                document.getElementById('leaderboard-content').innerHTML = 
                    `<div style="text-align:center;padding:40px;color:#666;">${currentLanguage === 'zh' ? '加载失败: ' : 'Load failed: '}${error.message}</div>`;
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
            const { data: scores, error } = await supabase
                .from('scores')
                .select('*')
                .eq('user_id', currentUser.id);
            
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
    }
    
    // ==================== 教师工具功能 ====================
    function downloadExcelTemplate() {
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
    }
    
    function parseUploadedFile(file, callback) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const content = e.target.result;
                let students = [];
                
                if (file.name.endsWith('.csv')) {
                    const rows = content.split('\n').filter(row => row.trim());
                    if (rows.length < 2) {
                        callback([]);
                        return;
                    }
                    
                    const headers = rows[0].split(',').map(h => h.replace(/"/g, '').trim());
                    
                    for (let i = 1; i < rows.length; i++) {
                        const row = rows[i].split(',');
                        if (row.length >= 3) {
                            const student = {
                                email: row[0].replace(/"/g, '').trim(),
                                name: row[1].replace(/"/g, '').trim(),
                                class: row[2].replace(/"/g, '').trim(),
                                notes: row[3] ? row[3].replace(/"/g, '').trim() : ''
                            };
                            
                            if (student.email && student.name && student.class) {
                                students.push(student);
                            }
                        }
                    }
                } else {
                    showMessage('请上传CSV格式的文件', 'error');
                    callback([]);
                    return;
                }
                
                callback(students);
            } catch (error) {
                console.error('解析文件失败:', error);
                showMessage('文件解析失败，请检查格式', 'error');
                callback([]);
            }
        };
        
        reader.onerror = function() {
            showMessage('读取文件失败', 'error');
            callback([]);
        };
        
        reader.readAsText(file, 'UTF-8');
    }
    
    async function batchCreateStudents(students, defaultPassword, className) {
        if (!currentUser) {
            showMessage('请先登录教师账号', 'error');
            return { success: 0, total: 0, results: [] };
        }
        
        const userRole = currentUser.user_metadata?.role;
        const isApprovedTeacher = userRole === 'teacher' && currentUser.user_metadata?.approved === true;
        
        if (!isApprovedTeacher) {
            showMessage('只有已批准的教师可以使用此功能', 'error');
            return { success: 0, total: 0, results: [] };
        }
        
        const results = [];
        let successCount = 0;
        
        const progressBar = document.getElementById('upload-progress-bar');
        const progressStatus = document.getElementById('upload-status');
        const progressContainer = document.getElementById('upload-progress');
        
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
        
        for (let i = 0; i < students.length; i++) {
            const student = students[i];
            const progress = ((i + 1) / students.length) * 100;
            
            progressBar.style.width = `${progress}%`;
            progressStatus.textContent = `创建中... ${i + 1}/${students.length} (${student.name})`;
            
            try {
                const { data: existingUser } = await supabase.auth.admin.getUserById(student.email);
                
                if (existingUser) {
                    results.push({
                        student: student,
                        success: false,
                        message: '邮箱已存在',
                        account: null
                    });
                    continue;
                }
                
                const { data, error } = await supabase.auth.admin.createUser({
                    email: student.email,
                    password: defaultPassword,
                    email_confirm: true,
                    user_metadata: {
                        username: student.name,
                        name: student.name,
                        class: student.class,
                        role: 'student',
                        created_by: currentUser.email,
                        created_at: new Date().toISOString(),
                        notes: student.notes || ''
                    }
                });
                
                if (error) {
                    results.push({
                        student: student,
                        success: false,
                        message: error.message,
                        account: null
                    });
                } else {
                    successCount++;
                    results.push({
                        student: student,
                        success: true,
                        message: '创建成功',
                        account: {
                            email: student.email,
                            password: defaultPassword,
                            name: student.name
                        }
                    });
                }
            } catch (error) {
                results.push({
                    student: student,
                    success: false,
                    message: '网络错误',
                    account: null
                });
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        progressBar.style.width = '100%';
        progressStatus.textContent = `完成！成功创建 ${successCount}/${students.length} 个账号`;
        
        return {
            success: successCount,
            total: students.length,
            results: results
        };
    }
    
    function displayBatchResults(results) {
        const resultDiv = document.getElementById('upload-result');
        const cardsContainer = document.getElementById('account-cards-container');
        const cardsDiv = document.getElementById('account-cards');
        
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = '';
        
        let successHtml = '<h4 style="color: #4CAF50;">✅ 创建成功的账号：</h4>';
        let errorHtml = '<h4 style="color: #ff4444; margin-top: 20px;">❌ 创建失败的账号：</h4>';
        
        const successAccounts = [];
        
        results.forEach((result, index) => {
            const student = result.student;
            const item = `
                <div style="padding: 8px 12px; margin: 5px 0; background: ${result.success ? '#e8f5e9' : '#ffebee'}; border-radius: 6px; border-left: 4px solid ${result.success ? '#4CAF50' : '#ff4444'};">
                    <strong>${student.name}</strong> (${student.email}) - ${student.class}<br>
                    <small style="color: ${result.success ? '#2e7d32' : '#c62828'};">${result.message}</small>
                </div>
            `;
            
            if (result.success) {
                successHtml += item;
                successAccounts.push(result.account);
            } else {
                errorHtml += item;
            }
        });
        
        resultDiv.innerHTML = successHtml + errorHtml;
        
        if (successAccounts.length > 0) {
            cardsContainer.innerHTML = '';
            successAccounts.forEach(account => {
                const card = document.createElement('div');
                card.className = 'account-card';
                card.style.cssText = `
                    background: white;
                    border: 2px solid #4CAF50;
                    border-radius: 10px;
                    padding: 15px;
                    text-align: center;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                `;
                card.innerHTML = `
                    <div style="font-weight: bold; color: #333; margin-bottom: 5px;">${account.name}</div>
                    <div style="color: #666; font-size: 0.9em; margin-bottom: 10px;">${account.email}</div>
                    <hr style="margin: 10px 0; border-color: #eee;">
                    <div style="text-align: left;">
                        <div style="margin-bottom: 5px;"><strong>登录账号：</strong>${account.email}</div>
                        <div><strong>初始密码：</strong>${account.password}</div>
                    </div>
                    <div style="margin-top: 10px; color: #ff9800; font-size: 0.8em;">
                        ⚠️ 首次登录后请修改密码
                    </div>
                `;
                cardsContainer.appendChild(card);
            });
            
            cardsDiv.style.display = 'block';
        }
    }
    
    function printAccountCards() {
        const printContent = document.getElementById('account-cards-container').innerHTML;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>学生账号卡片</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .account-card { 
                            page-break-inside: avoid; 
                            border: 1px solid #ccc; 
                            border-radius: 8px; 
                            padding: 15px; 
                            margin-bottom: 15px;
                            width: 250px;
                            display: inline-block;
                            margin-right: 15px;
                        }
                        @media print {
                            .account-card { 
                                border: 1px solid #000 !important;
                            }
                        }
                    </style>
                </head>
                <body>
                    <h1 style="text-align: center; margin-bottom: 20px;">学生账号卡片</h1>
                    <div style="text-align: center; color: #666; margin-bottom: 20px;">
                        生成时间：${new Date().toLocaleString()}
                    </div>
                    ${printContent}
                </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    }
    
    async function loadStudentList() {
        try {
            const studentsList = document.getElementById('students-list');
            studentsList.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">加载中...</div>';
            
            studentsList.innerHTML = `
                <div style="padding: 20px;">
                    <div style="text-align: center; color: #666; margin-bottom: 20px;">
                        学生管理功能需要管理员权限访问用户数据库
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                        <h4>替代方案：</h4>
                        <ul style="margin-left: 20px; color: #666;">
                            <li>在 Supabase 控制台的 Authentication → Users 中管理</li>
                            <li>使用批量注册功能创建学生账号</li>
                            <li>通过学生的游戏记录追踪学习进度</li>
                        </ul>
                    </div>
                </div>
            `;
            
        } catch (error) {
            console.error('加载学生列表失败:', error);
            document.getElementById('students-list').innerHTML = 
                '<div style="text-align: center; padding: 40px; color: #ff4444;">加载失败</div>';
        }
    }
    
    async function loadClassStatistics() {
        try {
            const classStats = document.getElementById('class-statistics');
            classStats.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">加载中...</div>';
            
            const { data, error } = await supabase
                .from('scores')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);
            
            if (error) throw error;
            
            if (!data || data.length === 0) {
                classStats.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">暂无学生成绩数据</div>';
                return;
            }
            
            const totalGames = data.length;
            const avgScore = data.reduce((sum, item) => sum + item.score, 0) / totalGames;
            const avgAccuracy = data.reduce((sum, item) => sum + item.accuracy, 0) / totalGames;
            
            classStats.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="color: #666; font-size: 0.9em;">总游戏次数</div>
                        <div style="color: #2196F3; font-size: 1.5em; font-weight: bold;">${totalGames}</div>
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="color: #666; font-size: 0.9em;">平均得分</div>
                        <div style="color: #4CAF50; font-size: 1.5em; font-weight: bold;">${avgScore.toFixed(1)}</div>
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="color: #666; font-size: 0.9em;">平均正确率</div>
                        <div style="color: #FF9800; font-size: 1.5em; font-weight: bold;">${avgAccuracy.toFixed(1)}%</div>
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="color: #666; font-size: 0.9em;">数据更新时间</div>
                        <div style="color: #9C27B0; font-size: 1.2em; font-weight:bold;">${new Date().toLocaleString()}</div>
                    </div>
                </div>
                <div style="margin-top: 20px;">
                    <h4>最近游戏记录：</h4>
                    <div style="max-height: 300px; overflow-y: auto; margin-top: 10px;">
                        ${data.slice(0, 10).map((item, index) => `
                            <div style="padding: 10px; margin-bottom: 5px; background: white; border-radius: 6px; border-left: 4px solid #4CAF50;">
                                <div><strong>${item.player_name}</strong> - ${item.mode}模式</div>
                                <div style="font-size: 0.9em; color: #666;">
                                    得分: ${item.score} | 正确率: ${item.accuracy}% | 用时: ${item.time_used}秒
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
        } catch (error) {
            console.error('加载班级统计失败:', error);
            document.getElementById('class-statistics').innerHTML = 
                '<div style="text-align: center; padding: 40px; color: #ff4444;">加载失败</div>';
        }
    }
    
    // ==================== 初始化教师工具 ====================
    function initTeacherTools() {
        const downloadBtn = document.getElementById('download-template-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', downloadExcelTemplate);
        }
        
        const uploadBtn = document.getElementById('upload-excel-btn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', async () => {
                if (isBatchRegistering) {
                    showMessage('正在批量注册中，请稍后', 'info');
                    return;
                }
                
                const fileInput = document.getElementById('excel-file');
                const defaultPassword = document.getElementById('default-password').value;
                const className = document.getElementById('class-name').value;
                
                if (!fileInput.files || fileInput.files.length === 0) {
                    showMessage('请选择要上传的文件', 'error');
                    return;
                }
                
                if (!defaultPassword) {
                    showMessage('请输入默认密码', 'error');
                    return;
                }
                
                if (!className) {
                    showMessage('请输入班级名称', 'error');
                    return;
                }
                
                isBatchRegistering = true;
                
                parseUploadedFile(fileInput.files[0], async (students) => {
                    if (students.length === 0) {
                        showMessage('文件中没有找到有效的学生数据', 'error');
                        isBatchRegistering = false;
                        return;
                    }
                    
                    const result = await batchCreateStudents(students, defaultPassword, className);
                    displayBatchResults(result.results);
                    isBatchRegistering = false;
                });
            });
        }
        
        const printBtn = document.getElementById('print-cards-btn');
        if (printBtn) {
            printBtn.addEventListener('click', printAccountCards);
        }
        
        const refreshBtn = document.getElementById('refresh-students-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', loadStudentList);
        }
        
        document.querySelectorAll('[data-tab]').forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.style.display = 'none';
                });
                document.getElementById(`${tabId}-tab`).style.display = 'block';
                
                if (tabId === 'manage-students') {
                    loadStudentList();
                } else if (tabId === 'class-stats') {
                    loadClassStatistics();
                }
            });
        });
    }
    
    // ==================== 初始化管理员工具 ====================
    function initAdminTools() {
        const adminBtn = document.getElementById('admin-tools-btn');
        if (adminBtn) {
            adminBtn.addEventListener('click', async () => {
                if (!currentUser) {
                    showAuthModal();
                    showMessage('请先登录管理员账号', 'info');
                    return;
                }
                
                isAdminUser = checkIfAdmin();
                if (!isAdminUser) {
                    showMessage('只有管理员可以访问此功能', 'error');
                    return;
                }
                
                document.getElementById('admin-tools-modal').style.display = 'flex';
                loadPendingTeachers();
            });
        }
        
        const closeAdminBtn = document.getElementById('close-admin-tools');
        if (closeAdminBtn) {
            closeAdminBtn.addEventListener('click', () => {
                document.getElementById('admin-tools-modal').style.display = 'none';
            });
        }
        
        const refreshTeachersBtn = document.getElementById('refresh-teachers-btn');
        if (refreshTeachersBtn) {
            refreshTeachersBtn.addEventListener('click', loadPendingTeachers);
        }
        
        const refreshStatsBtn = document.getElementById('refresh-stats-btn');
        if (refreshStatsBtn) {
            refreshStatsBtn.addEventListener('click', loadSystemStatistics);
        }
        
        document.querySelectorAll('#admin-tools-modal [data-tab]').forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                this.parentElement.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                document.querySelectorAll('#admin-tools-modal .tab-content').forEach(content => {
                    content.style.display = 'none';
                });
                document.getElementById(`${tabId}-tab`).style.display = 'block';
                
                if (tabId === 'system-stats') {
                    loadSystemStatistics();
                }
            });
        });
    }
    
    // ==================== 初始化 ====================
    async function init() {
        // 添加时间警告样式
        const style = document.createElement('style');
        style.textContent = `
            .time-warning { animation: blink 1s infinite; color: #ff4444 !important; }
            @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        `;
        document.head.appendChild(style);
        
        // 初始化Supabase客户端
        try {
            if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
                throw new Error('Supabase配置缺失');
            }
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase客户端初始化成功');
        } catch (error) {
            console.error('Supabase初始化失败:', error);
            showMessage('系统配置错误，请联系管理员', 'error');
            return;
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
        initAdminTools();
        initTeacherTools();
        
        // 定期备份本地数据
        setInterval(() => {
            backupLocalData();
        }, 5 * 60 * 1000);
        
        console.log('🎮 数学加法消消乐 - 云端版已加载');
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
        saveScore,
        showAdminInstructions // 暴露管理员函数
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
