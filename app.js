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
            // 移除现有的消息
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
        
        // 使用双重循环检查是否有任意两个数字的和等于目标值
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
            // 加载本地错题
            loadWrongQuestions();
            
            // 查找是否已有相同错题
            const existingQuestionIndex = wrongQuestions.findIndex(q => 
                q.num1 === num1 && q.num2 === num2 && q.correctSum === correctSum
            );
            
            if (existingQuestionIndex >= 0) {
                // 更新已有错题的计数
                wrongQuestions[existingQuestionIndex].count++;
                wrongQuestions[existingQuestionIndex].timestamp = new Date().toISOString();
            } else {
                // 添加新错题
                wrongQuestions.push({
                    num1: num1,
                    num2: num2,
                    wrongSum: wrongSum,
                    correctSum: correctSum,
                    count: 1,
                    timestamp: new Date().toISOString()
                });
            }
            
            // 保存到本地存储
            saveWrongQuestions();
            
            // 如果有用户登录，尝试同步到云端
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
            
            // 构建错题数据
            const wrongQuestionData = {
                user_id: currentUser.id,
                email: currentUser.email,
                num1: num1,
                num2: num2,
                wrong_sum: wrongSum,
                correct_sum: correctSum,
                timestamp: new Date().toISOString()
            };
            
            // 检查是否已有相同错题
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
                // 更新已有记录
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
                // 插入新记录
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
            
            // 加载本地错题
            loadWrongQuestions();
            
            if (wrongQuestions.length === 0) {
                showMessage(currentLanguage === 'zh' ? '没有错题需要同步' : 'No wrong questions to sync', 'info');
                return false;
            }
            
            // 显示加载中
            const syncBtn = document.getElementById('sync-wrong-questions-btn');
            if (syncBtn) {
                const originalText = syncBtn.innerHTML;
                syncBtn.innerHTML = `<span>🔄 ${currentLanguage === 'zh' ? '同步中...' : 'Syncing...'}</span>`;
                syncBtn.disabled = true;
            }
            
            // 批量上传错题到云端
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
                    
                    // 避免请求太快
                    await new Promise(resolve => setTimeout(resolve, 50));
                    
                } catch (error) {
                    console.error('同步单个错题失败:', error);
                    failCount++;
                }
            }
            
            // 显示结果
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
            
            // 标记最后同步时间
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
            // 恢复按钮状态
            const syncBtn = document.getElementById('sync-wrong-questions-btn');
            if (syncBtn) {
                syncBtn.innerHTML = `<span>${currentLanguage === 'zh' ? '同步错题到云端' : 'Sync Wrong Questions to Cloud'}</span>`;
                syncBtn.disabled = false;
            }
        }
    }
    
    async function loadWrongQuestionsFromCloud() {
        try {
            if (!currentUser) {
                return false;
            }
            
            if (!isSupabaseReady || !supabase) {
                return false;
            }
            
            // 从Supabase获取错题
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
            
            // 转换数据格式
            const cloudQuestions = data.map(item => ({
                num1: item.num1,
                num2: item.num2,
                wrongSum: item.wrong_sum,
                correctSum: item.correct_sum,
                count: item.count || 1,
                timestamp: item.timestamp || item.created_at
            }));
            
            // 加载本地错题
            loadWrongQuestions();
            
            // 合并云端和本地错题
            for (const cloudQuestion of cloudQuestions) {
                const existingIndex = wrongQuestions.findIndex(q => 
                    q.num1 === cloudQuestion.num1 && 
                    q.num2 === cloudQuestion.num2 && 
                    q.correctSum === cloudQuestion.correctSum
                );
                
                if (existingIndex >= 0) {
                    // 合并计数，取较大值
                    wrongQuestions[existingIndex].count = Math.max(
                        wrongQuestions[existingIndex].count,
                        cloudQuestion.count
                    );
                    // 使用最新的时间戳
                    if (new Date(cloudQuestion.timestamp) > new Date(wrongQuestions[existingIndex].timestamp)) {
                        wrongQuestions[existingIndex].timestamp = cloudQuestion.timestamp;
                    }
                } else {
                    // 添加云端错题
                    wrongQuestions.push(cloudQuestion);
                }
            }
            
            // 保存到本地
            saveWrongQuestions();
            
            // 标记最后同步时间
            localStorage.setItem('mathGameWrongQuestionsLastSync', new Date().toISOString());
            
            return true;
            
        } catch (error) {
            console.error('从云端加载错题异常:', error);
            return false;
        }
    }
    
    // ==================== 教师工具 - 批量注册功能 ====================
    async function downloadTemplate() {
        try {
            // 创建CSV模板内容
            const csvContent = "email,姓名,班级,备注\n" +
                "student1@example.com,张三,三年一班,数学课代表\n" +
                "student2@example.com,李四,三年一班,副班长\n" +
                "student3@example.com,王五,三年二班,学习委员";
            
            // 创建Blob对象
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            
            // 创建下载链接
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', '学生批量注册模板.csv');
            link.style.visibility = 'hidden';
            
            // 添加到页面并触发点击
            document.body.appendChild(link);
            link.click();
            
            // 清理
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
            
            // 显示上传进度
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
            
            // 读取CSV文件
            const reader = new FileReader();
            reader.onload = async function(e) {
                try {
                    const csvContent = e.target.result;
                    const rows = csvContent.split('\n');
                    
                    if (rows.length < 2) {
                        showMessage(currentLanguage === 'zh' ? 'CSV文件格式不正确' : 'Invalid CSV file format', 'error');
                        return;
                    }
                    
                    // 解析CSV数据
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
                        
                        // 更新进度
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
                    
                    // 批量注册学生账号
                    const results = [];
                    let successCount = 0;
                    let failCount = 0;
                    
                    for (let i = 0; i < students.length; i++) {
                        const student = students[i];
                        
                        try {
                            // 调用Supabase注册函数
                            const { data, error } = await supabase.auth.admin.createUser({
                                email: student.email,
                                password: student.password,
                                email_confirm: true, // 自动确认邮箱
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
                                message: error.message || currentLanguage === 'zh' ? '未知错误' : 'Unknown error',
                                class: student.class
                            });
                            failCount++;
                        }
                        
                        // 更新进度
                        if (uploadProgressBar) {
                            uploadProgressBar.style.width = `${50 + (i / students.length) * 50}%`;
                        }
                        if (uploadStatus) {
                            uploadStatus.textContent = currentLanguage === 'zh' 
                                ? `正在注册 ${i+1}/${students.length}...` 
                                : `Registering ${i+1}/${students.length}...`;
                        }
                        
                        // 避免请求太快
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                    
                    // 显示结果
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
                    
                    // 显示成功注册的账号卡片
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
                    
                    // 显示最终消息
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
    
    // ==================== 成就系统 ====================
    function loadAchievements() {
        try {
            const saved = localStorage.getItem('mathGameAchievements');
            if (saved) {
                const data = JSON.parse(saved);
                achievements = new Map(Object.entries(data));
            }
            
            const progressSaved = localStorage.getItem('mathGameAchievementProgress');
            if (progressSaved) {
                achievementProgress = JSON.parse(progressSaved);
            }
        } catch (error) {
            console.error('加载成就失败:', error);
            achievements = new Map();
            achievementProgress = {};
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
        } catch (error) {
            console.error('保存成就失败:', error);
        }
    }
    
    function checkAchievementCondition(achievementId) {
        switch(achievementId) {
            case 'first_win':
                return achievementProgress.first_win || false;
            case 'fast_5':
                return achievementProgress.fast_5 || false;
            case 'accuracy_90':
                return totalAttempts > 0 && (correctCount / totalAttempts) >= 0.9;
            case 'complete_30':
                return currentMode === 'standard' && completedQuestions >= 30;
            case 'cloud_user':
                return !!currentUser;
            case 'score_100':
                return score >= 100;
            default:
                return false;
        }
    }
    
    function checkAndTriggerAchievements() {
        ACHIEVEMENTS.forEach(ach => {
            const achieved = checkAchievementCondition(ach.id);
            const wasAchieved = achievements.get(ach.id) || false;
            
            if (achieved && !wasAchieved) {
                achievements.set(ach.id, true);
                showAchievementUnlock(ach);
            }
        });
        saveAchievements();
    }
    
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
    
    // ==================== Supabase 初始化 ====================
    async function initSupabase() {
        try {
            console.log('初始化Supabase...');
            
            // 获取配置
            let supabaseUrl = '';
            let supabaseKey = '';
            
            // 从HTML配置获取
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
            
            // 备用配置
            if (!supabaseUrl || !supabaseKey) {
                supabaseUrl = 'https://ytoailyxejdgtpfwcdci.supabase.co';
                supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0b2FpbHl4ZWpkZ3RwZndjZGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDE5NzQsImV4cCI6MjA4NTExNzk3NH0.DvvP8whiE3rW1bDh4qW2zOLTGsknfQ2Utt8wVOxZjV0';
            }
            
            // 创建客户端
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
                
                // 检查管理员权限
                await checkIfAdmin();
                
                // 更新UI
                updateUserInfo();
                
                // 登录时自动从云端加载错题
                if (currentUser) {
                    setTimeout(() => {
                        loadWrongQuestionsFromCloud().then(success => {
                            if (success) {
                                console.log('登录时自动加载云端错题成功');
                            }
                        });
                    }, 1000);
                }
                
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
                
                // 检查管理员权限
                await checkIfAdmin();
                
                // 更新UI
                updateUserInfo();
                
                // 关闭登录窗口
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
                
                // 检查管理员权限
                await checkIfAdmin();
                
                // 更新UI
                updateUserInfo();
                
                // 关闭注册窗口
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
            
            // 检查教师权限 - 修改：允许管理员也能看到教师工具
            if (teacherToolsBtn) {
                const userRole = currentUser.user_metadata?.role;
                const isApprovedTeacher = userRole === 'teacher' && currentUser.user_metadata?.approved === true;
                // ✅ 允许管理员访问教师工具
                teacherToolsBtn.style.display = (isApprovedTeacher || isAdminUser) ? 'flex' : 'none';
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
        
        // 检查初始数字是否有匹配
        setTimeout(checkAndAutoRefresh, 1000);
        
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
        
        // ✅ 确保加载错题数据
        loadWrongQuestions();
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
        
        // 生成后检查是否有匹配组合
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
                    // ✅ 检查是否有匹配的数字组合
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
            // ✅ 记录错题
            recordWrongQuestion(num1, num2, sum, currentTarget);
            
            showFeedback(currentLanguage === 'zh' ? '✗ 错误' : '✗ Wrong', 'error');
            selectedCards.forEach(card => card.classList.remove('selected'));
            selectedCards = [];
            
            // ✅ 检查是否有匹配的数字组合
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
        
        // 生成新目标后检查是否有匹配
        setTimeout(checkAndAutoRefresh, 300);
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
        
        // ✅ 游戏结束时自动同步错题到云端
        if (currentUser && wrongQuestions.length > 0) {
            setTimeout(() => {
                syncAllWrongQuestionsToCloud().then(success => {
                    if (success) {
                        console.log('游戏结束时自动同步错题成功');
                    }
                });
            }, 2000);
        }
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
            hintBtn.innerHTML = `<span>💡 提示(10秒)</span>`;
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
            const statisticsContent = document.getElementById('statistics-content');
            const statisticsModal = document.getElementById('statistics-modal');
            
            if (!statisticsContent || !statisticsModal) return;
            
            const stats = calculateStatistics();
            
            statisticsContent.innerHTML = `
                <div style="padding: 20px;">
                    <h3 style="color: #4CAF50; margin-bottom: 15px;">${currentLanguage === 'zh' ? '📊 游戏统计' : '📊 Game Statistics'}</h3>
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
                            <div style="color: #666; font-size: 0.9em;">${currentLanguage === 'zh' ? '当前得分' : 'Current Score'}</div>
                            <div style="color: #9C27B0; font-size: 1.5em; font-weight:bold;">${score}</div>
                        </div>
                    </div>
                    <div style="margin-top: 20px;">
                        <h4>${currentLanguage === 'zh' ? '游戏详情' : 'Game Details'}</h4>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 10px;">
                            <p>${currentLanguage === 'zh' ? '当前模式' : 'Current Mode'}: ${currentMode}</p>
                            <p>${currentLanguage === 'zh' ? '已完成题数' : 'Completed Questions'}: ${completedQuestions}</p>
                            <p>${currentLanguage === 'zh' ? '当前目标和' : 'Current Target Sum'}: ${currentTarget}</p>
                            <p>${currentLanguage === 'zh' ? '游戏状态' : 'Game Status'}: ${gameActive ? (currentLanguage === 'zh' ? '进行中' : 'In Progress') : (currentLanguage === 'zh' ? '未开始' : 'Not Started')}</p>
                        </div>
                    </div>
                </div>
            `;
            
            statisticsModal.style.display = 'flex';
        } catch (error) {
            console.error('显示统计失败:', error);
        }
    }
    
    function calculateStatistics() {
        return {
            totalAttempts: gameHistory.length,
            correctCount: correctCount,
            accuracy: totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100
        };
    }
    
    function showAchievements() {
        try {
            loadAchievements();
            
            const container = document.getElementById('achievements-grid');
            const achievementsModal = document.getElementById('achievements-modal');
            
            if (!container || !achievementsModal) return;
            
            container.innerHTML = '';
            
            ACHIEVEMENTS.forEach(ach => {
                const achieved = achievements.get(ach.id) || false;
                const card = document.createElement('div');
                card.className = `achievement-card ${achieved ? '' : 'locked'}`;
                card.innerHTML = `
                    <div class="achievement-icon">${ach.icon}</div>
                    <div class="achievement-name">${ach.name[currentLanguage] || ach.name.zh}</div>
                    <div class="achievement-desc">${ach.desc[currentLanguage] || ach.desc.zh}</div>
                    <div style="margin-top: 10px; font-size: 0.8em; color: ${achieved ? '#4CAF50' : '#999'}">
                        ${achieved ? (currentLanguage === 'zh' ? '✓ 已获得' : '✓ Achieved') : (currentLanguage === 'zh' ? '未获得' : 'Not Achieved')}
                    </div>
                `;
                container.appendChild(card);
            });
            
            achievementsModal.style.display = 'flex';
        } catch (error) {
            console.error('显示成就失败:', error);
        }
    }
    
    function showWrongBook() {
        try {
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
        } catch (error) {
            console.error('显示错题本失败:', error);
        }
    }
    
    function showLeaderboard() {
        try {
            const leaderboardContent = document.getElementById('leaderboard-content');
            const leaderboardModal = document.getElementById('leaderboard-modal');
            
            if (!leaderboardContent || !leaderboardModal) return;
            
            leaderboardContent.innerHTML = `
                <div style="padding: 20px;">
                    <h3 style="color: #4CAF50; margin-bottom: 15px;">${currentLanguage === 'zh' ? '🏆 排行榜' : '🏆 Leaderboard'}</h3>
                    <div style="text-align: center; padding: 40px;">
                        <div style="font-size: 3em;">🏆</div>
                        <h4>${currentLanguage === 'zh' ? '排行榜功能开发中' : 'Leaderboard feature in development'}</h4>
                        <p style="color: #666;">${currentLanguage === 'zh' ? '该功能即将推出，敬请期待！' : 'This feature is coming soon, stay tuned!'}</p>
                    </div>
                </div>
            `;
            
            leaderboardModal.style.display = 'flex';
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
            if (!profileModal) return;
            
            profileModal.style.display = 'flex';
            
            const email = currentUser.email || '';
            const firstLetter = email.charAt(0).toUpperCase() || '?';
            document.getElementById('profile-avatar').textContent = firstLetter;
            document.getElementById('profile-email').textContent = email;
            
            const userRole = currentUser.user_metadata?.role || 'student';
            const roleText = userRole === 'teacher' ? (currentLanguage === 'zh' ? '👨‍🏫 教师' : '👨‍🏫 Teacher') : (currentLanguage === 'zh' ? '👨‍🎓 学生' : '👨‍🎓 Student');
            document.getElementById('profile-role').textContent = roleText;
            
            // 简单的统计信息
            document.getElementById('profile-game-count').textContent = '统计功能开发中';
            document.getElementById('profile-high-score').textContent = '统计功能开发中';
            document.getElementById('profile-avg-accuracy').textContent = '统计功能开发中';
            
            const joinDate = new Date(currentUser.created_at);
            document.getElementById('profile-join-date').textContent = joinDate.toLocaleDateString(currentLanguage === 'zh' ? 'zh-CN' : 'en-US');
        } catch (error) {
            console.error('显示个人资料失败:', error);
        }
    }
    
    // ==================== 修改：管理员可以使用教师工具 ====================
    function showTeacherTools() {
        try {
            if (!currentUser) {
                showAuthModal();
                showMessage(currentLanguage === 'zh' ? '请先登录' : 'Please login first', 'info');
                return;
            }
            
            const userRole = currentUser.user_metadata?.role;
            const isApprovedTeacher = userRole === 'teacher' && currentUser.user_metadata?.approved === true;
            
            // ✅ 修改：允许管理员也能访问教师工具
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
            
            showMessage(currentLanguage === 'zh' ? '成绩保存成功！' : 'Score saved successfully!', 'success');
            
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
            // 设置语言
            const savedLang = localStorage.getItem('mathGameLanguage');
            if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
                currentLanguage = savedLang;
            }
            setLanguage(currentLanguage);
            
            // 初始化Supabase
            await initSupabase();
            
            // 检查认证状态
            if (isSupabaseReady) {
                await checkAuth();
            }
            
            // 加载数据
            loadAchievements();
            loadWrongQuestions(); // ✅ 确保加载错题数据
            
            // 绑定事件监听器
            bindEventListeners();
            
            // 初始化游戏
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
            
        } catch (error) {
            console.error('初始化失败:', error);
            showMessage(currentLanguage === 'zh' ? '初始化失败，请刷新页面' : 'Initialization failed, please refresh page', 'error');
        }
    }
    
    // ==================== 绑定事件监听器 ====================
    function bindEventListeners() {
        try {
            // 语言切换
            document.getElementById('language-btn')?.addEventListener('click', () => {
                const newLang = currentLanguage === 'zh' ? 'en' : 'zh';
                setLanguage(newLang);
                showMessage(newLang === 'zh' ? '已切换到中文' : 'Switched to English', 'info');
            });
            
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
                document.getElementById(id)?.addEventListener('click', handler);
            });
            
            // 游戏模式选择
            const modeButtons = [
                { id: 'mode-standard', mode: 'standard' },
                { id: 'mode-challenge', mode: 'challenge' },
                { id: 'mode-practice', mode: 'practice' },
                { id: 'mode-custom', mode: 'custom' }
            ];
            
            modeButtons.forEach(({ id, mode }) => {
                document.getElementById(id)?.addEventListener('click', () => selectMode(mode));
            });
            
            // 游戏控制按钮
            document.getElementById('start-btn')?.addEventListener('click', startGame);
            document.getElementById('hint-btn')?.addEventListener('click', showHint);
            document.getElementById('refresh-btn')?.addEventListener('click', refreshNumbers);
            document.getElementById('endgame-btn')?.addEventListener('click', () => endGame('giveup'));
            
            // 认证相关
            document.getElementById('close-auth-modal')?.addEventListener('click', closeAuthModal);
            document.getElementById('auth-submit-btn')?.addEventListener('click', handleAuth);
            document.getElementById('auth-switch-link')?.addEventListener('click', toggleAuthMode);
            
            // 角色选择变化
            document.getElementById('auth-role')?.addEventListener('change', function() {
                const teacherRegisterFields = document.getElementById('teacher-register-fields');
                if (teacherRegisterFields) {
                    teacherRegisterFields.style.display = this.value === 'teacher' ? 'block' : 'none';
                }
            });
            
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
                document.getElementById(id)?.addEventListener('click', () => {
                    const modalElement = document.getElementById(modal);
                    if (modalElement) modalElement.style.display = 'none';
                    if (handler) handler();
                });
            });
            
            // 游戏结束相关
            document.getElementById('save-score-btn')?.addEventListener('click', saveScore);
            document.getElementById('play-again-btn')?.addEventListener('click', restartGame);
            document.getElementById('view-leaderboard-btn')?.addEventListener('click', showLeaderboard);
            document.getElementById('view-statistics-btn')?.addEventListener('click', showStatistics);
            
            // 历史记录相关
            document.getElementById('clear-history-btn')?.addEventListener('click', () => {
                if (confirm(currentLanguage === 'zh' ? '确定要清空本次游戏的历史记录吗？' : 'Are you sure you want to clear the current game history?')) {
                    gameHistory = [];
                    showHistory();
                    showMessage(currentLanguage === 'zh' ? '历史记录已清空' : 'History cleared', 'info');
                }
            });
            
            // ✅ 错题本相关 - 启用云端同步功能
            document.getElementById('sync-wrong-questions-btn')?.addEventListener('click', syncAllWrongQuestionsToCloud);
            
            document.getElementById('clear-wrong-questions-btn')?.addEventListener('click', () => {
                if (confirm(currentLanguage === 'zh' ? '确定要清空本地错题吗？（云端错题不受影响）' : 'Are you sure you want to clear local wrong questions? (Cloud data will not be affected)')) {
                    wrongQuestions = [];
                    saveWrongQuestions();
                    showWrongBook();
                    showMessage(currentLanguage === 'zh' ? '本地错题已清空' : 'Local wrong questions cleared', 'info');
                }
            });
            
            // ==================== 教师工具相关 - 修复：实现完整功能 ====================
            // ✅ 下载模板按钮
            document.getElementById('download-template-btn')?.addEventListener('click', downloadTemplate);
            
            // ✅ 上传Excel按钮
            document.getElementById('upload-excel-btn')?.addEventListener('click', uploadExcelFile);
            
            // ✅ 打印卡片按钮
            document.getElementById('print-cards-btn')?.addEventListener('click', printAccountCards);
            
            // ✅ 教师工具标签切换
            const teacherTabButtons = document.querySelectorAll('#teacher-tools-modal .tab-btn');
            teacherTabButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // 移除所有标签的active类
                    teacherTabButtons.forEach(btn => btn.classList.remove('active'));
                    // 隐藏所有标签内容
                    document.querySelectorAll('#teacher-tools-modal .tab-content').forEach(content => {
                        content.classList.remove('active');
                        content.style.display = 'none';
                    });
                    
                    // 激活当前标签
                    this.classList.add('active');
                    const tabId = this.getAttribute('data-tab') + '-tab';
                    const tabContent = document.getElementById(tabId);
                    if (tabContent) {
                        tabContent.classList.add('active');
                        tabContent.style.display = 'block';
                    }
                });
            });
            
            // ==================== 管理员工具相关 ====================
            document.getElementById('refresh-teachers-btn')?.addEventListener('click', () => {
                showMessage(currentLanguage === 'zh' ? '刷新功能开发中' : 'Refresh feature in development', 'info');
            });
            
            document.getElementById('refresh-stats-btn')?.addEventListener('click', () => {
                showMessage(currentLanguage === 'zh' ? '刷新功能开发中' : 'Refresh feature in development', 'info');
            });
            
            // ✅ 管理员工具标签切换
            const adminTabButtons = document.querySelectorAll('#admin-tools-modal .tab-btn');
            adminTabButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // 移除所有标签的active类
                    adminTabButtons.forEach(btn => btn.classList.remove('active'));
                    // 隐藏所有标签内容
                    document.querySelectorAll('#admin-tools-modal .tab-content').forEach(content => {
                        content.classList.remove('active');
                        content.style.display = 'none';
                    });
                    
                    // 激活当前标签
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
