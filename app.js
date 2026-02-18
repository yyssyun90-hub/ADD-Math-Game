// 确保页面已完全加载
(function() {
    'use strict';
    
    console.log('🎮 数学加法消消乐 - 启动诊断...');
    
    // ==================== 全局错误捕获 ====================
    window.addEventListener('error', function(e) {
        console.error('❌ 全局错误:', e.error || e.message);
        
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff4444;
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            z-index: 99999;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            font-size: 14px;
            max-width: 90%;
            text-align: center;
            animation: slideDown 0.3s ease;
        `;
        errorDiv.textContent = `⚠️ 游戏加载遇到问题: ${e && e.message ? e.message : '未知错误'}。正在尝试恢复...`;
        document.body.appendChild(errorDiv);
        
        setTimeout(function() {
            if (errorDiv && errorDiv.parentNode) {
                errorDiv.style.opacity = '0';
                setTimeout(function() {
                    if (errorDiv.parentNode) {
                        errorDiv.parentNode.removeChild(errorDiv);
                    }
                }, 300);
            }
        }, 5000);
    });

    window.addEventListener('unhandledrejection', function(e) {
        console.error('❌ 未处理的Promise错误:', e && e.reason ? e.reason : '未知错误');
    });
})();

var MathGame = (function() {
    'use strict';
    
    // ==================== 配置 ====================
    var CONFIG = {
        SUPABASE_URLS: [
            'https://ytoailyxejdgtpfwcdci.supabase.co',
            'https://ytoailyxejdgtpfwcdci.supabase.co',
            'https://ytoailyxejdgtpfwcdci.supabase.co'
        ],
        SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0b2FpbHl4ZWpkZ3RwZndjZGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDE5NzQsImV4cCI6MjA4NTExNzk3NH0.DvvP8whiE3rW1bDh4qW2zOLTGsknfQ2Utt8wVOxZjV0',
        ADMIN_EMAILS: ['yyssyun90@gmail.com'],
        SYNC_INTERVAL: 300000,
        CACHE_EXPIRY: 3600000,
        OFFLINE_MODE: false,
        USE_MOCK_DATA: false,
        LEADERBOARD_CACHE_TIME: 300000 // 5分钟
    };
    
    // ==================== 多语言支持 ====================
    var translations = {
        zh: {
            gameTitle: "🧮 数学加法消消乐",
            gameSubtitle: "教学优化版 | 云端同步 | 实时排行榜",
            history: "📝 历史记录",
            statistics: "📊 统计",
            achievements: "⭐ 成就",
            wrongBook: "📖 错题本",
            leaderboard: "🏆 排行榜",
            profile: "👤 个人资料",
            
            modeStandard: "📚 挑战30",
            modeStandardDesc: "完成30题，比拼用时",
            modeChallenge: "⚡ 激情90秒",
            modeChallengeDesc: "90秒时间，比拼题数",
            modePractice: "🎯 练习模式",
            modePracticeDesc: "无时间限制，专心学习",
            modeCustom: "⚙️ 自定义",
            modeCustomDesc: "自设参数，灵活练习",
            
            numberRange: "数字范围:",
            rangeEasy: "0-9 (简单)",
            rangeStandard: "0-14 (标准)",
            rangeChallenge: "5-18 (挑战)",
            startGame: "🚀 开始游戏",
            startPractice: "🎯 开始练习",
            questionCount: "题目数量:",
            timeLimit: "时间限制(秒):",
            
            scoreLabel: "得分",
            completedLabel: "完成题数",
            timeLeft: "剩余时间",
            timeUsed: "已用时间",
            accuracyLabel: "正确率",
            targetSum: "目标和:",
            hintButton: "💡 提示",
            refreshButton: "🔄 刷新",
            endGameButton: "⏹️ 结束",
            
            user: "用户",
            logout: "退出",
            loginTitle: "🔐 用户登录",
            registerTitle: "📝 用户注册",
            emailLabel: "邮箱地址:",
            emailPlaceholder: "请输入邮箱地址",
            passwordLabel: "密码:",
            passwordPlaceholder: "请输入密码",
            usernameLabel: "用户名:",
            usernamePlaceholder: "请输入用户名（可选）",
            loginButton: "登录",
            registerButton: "注册",
            noAccount: "还没有账号？",
            registerNow: "立即注册",
            hasAccount: "已有账号？",
            loginNow: "立即登录",
            
            historyTitle: "📝 历史记录",
            statisticsTitle: "📊 统计分析",
            achievementsTitle: "⭐ 成就系统",
            wrongbookTitle: "📖 错题本",
            leaderboardTitle: "🏆 排行榜",
            profileTitle: "👤 个人资料",
            
            tableNumber: "#",
            tableTarget: "目标",
            tableNum1: "数字1",
            tableNum2: "数字2",
            tableResult: "结果",
            tableTime: "用时(秒)",
            clearHistory: "清空本次记录",
            
            cloudSync: "☁️ 云端同步",
            syncing: "🔄 同步中...",
            syncSuccess: "✅ 同步成功",
            syncFailed: "❌ 同步失败",
            lastSync: "上次同步",
            syncNow: "立即同步",
            autoSync: "自动同步",
            
            teacherApplication: "👨‍🏫 教师账号申请",
            applyForTeacher: "申请成为教师",
            schoolName: "学校名称",
            schoolNamePlaceholder: "请输入学校全称",
            stateRegion: "所在州属",
            stateRegionPlaceholder: "请输入州/省/地区",
            teachingSubject: "教授科目",
            teachingSubjectPlaceholder: "例如：数学",
            gradeLevel: "任教年级",
            gradeLevelPlaceholder: "例如：小学三年级",
            reason: "申请理由",
            reasonPlaceholder: "请简要说明申请教师账号的原因",
            contactPhone: "联系电话",
            contactPhonePlaceholder: "请输入联系电话",
            submitApplication: "提交申请",
            applicationSubmitted: "✅ 申请已提交！管理员会尽快审核并通过邮件通知您",
            applicationFailed: "❌ 申请提交失败，请稍后重试",
            alreadyApplied: "您已经提交过申请，请耐心等待审核",
            needLogin: "请先登录后再申请教师账号",
            cancel: "取消",
            
            teacherTools: "👨‍🏫 教师工具",
            teacherToolsTitle: "👨‍🏫 教师管理控制台",
            batchRegister: "📦 批量注册学生账号",
            downloadTemplate: "📥 下载模板",
            uploadExcel: "📤 上传Excel/CSV",
            defaultPassword: "🔑 默认密码",
            defaultPasswordPlaceholder: "留空则使用 stu123456",
            className: "🏫 班级名称",
            classNamePlaceholder: "例如：三年一班",
            uploadProgress: "上传进度",
            processing: "处理中...",
            accountCards: "📇 生成的账号卡片",
            printCards: "🖨️ 打印卡片",
            classManagement: "📚 班级管理",
            studentList: "👥 学生列表",
            studentStats: "📊 班级统计",
            teacherApproval: "✅ 教师审核",
            pendingTeachers: "⏳ 待审核教师",
            approvedTeachers: "✓ 已通过教师",
            rejectedTeachers: "✗ 未通过教师",
            approve: "✓ 批准",
            reject: "✗ 拒绝",
            viewDetails: "查看详情",
            applicant: "申请人",
            applyTime: "申请时间",
            status: "状态",
            pending: "待审核",
            approved: "已通过",
            rejected: "已拒绝",
            noPendingApplications: "暂无待审核的教师申请",
            noApprovedTeachers: "暂无已批准的教师",
            noRejectedTeachers: "暂无已拒绝的申请",
            syncWrongQuestions: "☁️ 同步错题到云端",
            clearWrongQuestions: "🗑️ 清空本地错题",
            
            adminTools: "👑 管理工具",
            adminToolsTitle: "👑 系统管理控制台",
            systemStats: "📊 系统统计",
            totalUsers: "👥 总用户数",
            totalTeachers: "👨‍🏫 教师数",
            totalStudents: "👨‍🎓 学生数",
            totalGames: "🎮 总游戏局数",
            totalQuestions: "❓ 总答题数",
            avgAccuracy: "🎯 平均正确率",
            teacherManagement: "👨‍🏫 教师管理",
            allTeachers: "所有教师",
            approveTeacher: "批准教师",
            removeTeacher: "移除教师",
            setAdmin: "设为管理员",
            removeAdmin: "移除管理员",
            systemLogs: "📋 系统日志",
            userActivity: "用户活动",
            errorLogs: "错误日志",
            syncLogs: "同步日志",
            dataManagement: "💾 数据管理",
            backupDatabase: "📀 备份数据库",
            restoreDatabase: "💿 恢复数据库",
            clearCache: "🧹 清理缓存",
            systemSettings: "⚙️ 系统设置",
            maintenanceMode: "🔧 维护模式",
            enableMaintenance: "开启维护模式",
            disableMaintenance: "关闭维护模式",
            siteAnnouncement: "📢 站点公告",
            announcementPlaceholder: "输入公告内容...",
            publishAnnouncement: "发布公告",
            
            leaderboardEasy: "🟢 简单模式",
            leaderboardStandard: "🟠 标准模式",
            leaderboardChallenge: "🔴 困难模式",
            leaderboardChallengeMode: "⚡ 激情90秒",
            leaderboardStandardMode: "📚 挑战30",
            leaderboardEasyScore: "🏆 高分榜",
            leaderboardStandardScore: "🏆 高分榜",
            leaderboardChallengeScore: "🏆 高分榜",
            leaderboardEasyAccuracy: "🎯 准确率榜",
            leaderboardStandardAccuracy: "🎯 准确率榜",
            leaderboardChallengeAccuracy: "🎯 准确率榜",
            leaderboardEasySpeed: "⚡ 速度榜",
            leaderboardStandardSpeed: "⚡ 速度榜",
            leaderboardChallengeSpeed: "⚡ 速度榜",
            rank: "排名",
            player: "玩家",
            score: "得分",
            accuracy: "准确率",
            time: "用时",
            date: "日期",
            easyMode: "简单模式",
            standardMode: "标准模式",
            challengeMode: "困难模式",
            noData: "暂无数据",
            myBest: "我的最佳",
            refresh: "刷新",
            
            totalGames: "总游戏次数",
            totalQuestions: "总答题数",
            totalCorrect: "总正确数",
            avgTimePerQuestion: "平均每题用时",
            bestScore: "最佳得分",
            bestAccuracy: "最佳正确率",
            modeStats: "模式统计",
            recentGames: "最近10局",
            loadingStats: "加载统计信息中...",
            noHistoryStats: "暂无历史统计数据",
            statsDescription: "完成游戏并保存成绩后，统计数据将显示在这里",
            
            finalScore: "最终得分",
            finalCompleted: "完成题数",
            finalTime: "用时",
            finalAccuracy: "正确率",
            playerNamePlaceholder: "请输入你的名字",
            saveScore: "保存成绩",
            playAgain: "再玩一次",
            viewLeaderboard: "查看排行榜",
            viewStatistics: "查看统计",
            gameComplete: "🎉 恭喜完成30题！",
            gameTimeout: "⏰ 时间到！",
            gameGiveup: "🏁 游戏结束",
            gameEnd: "🎉 游戏结束!",
            
            achievementProgress: "成就进度",
            level: "等级",
            completed: "已完成",
            notCompleted: "未完成",
            unlocked: "已解锁",
            locked: "未解锁",
            bronze: "青铜",
            silver: "白银",
            gold: "黄金",
            platinum: "铂金",
            categoryVictory: "🏆 胜利者勋章",
            categoryScore: "💯 得分王冠",
            categoryAccuracy: "🎯 神枪手徽章",
            categorySpeed: "⚡ 闪电侠印记",
            categoryPersistence: "💪 毅力帝荣耀",
            categoryMaster: "👑 数学大师称号",
            victoryBronze: "🥉 初出茅庐",
            victorySilver: "🥈 小试牛刀",
            victoryGold: "🥇 常胜将军",
            victoryPlatinum: "🏆 战神降临",
            scoreBronze: "🥉 小有收获",
            scoreSilver: "🥈 财富积累",
            scoreGold: "🥇 百战百胜",
            scorePlatinum: "💯 分数收割机",
            accuracyBronze: "🥉 稳扎稳打",
            accuracySilver: "🥈 精准打击",
            accuracyGold: "🥇 百步穿杨",
            accuracyPlatinum: "🎯 弹无虚发",
            speedBronze: "🥉 反应敏捷",
            speedSilver: "🥈 风驰电掣",
            speedGold: "🥇 光速思维",
            speedPlatinum: "⚡ 瞬间永恒",
            persistenceBronze: "🥉 持之以恒",
            persistenceSilver: "🥈 坚持不懈",
            persistenceGold: "🥇 百炼成钢",
            persistencePlatinum: "💪 永恒传说",
            masterBronze: "🥉 数学新秀",
            masterSilver: "🥈 解题高手",
            masterGold: "🥇 数学精英",
            masterPlatinum: "👑 数学之神",
            victoryBronzeDesc: "完成第1局游戏",
            victorySilverDesc: "完成10局游戏",
            victoryGoldDesc: "完成50局游戏",
            victoryPlatinumDesc: "完成100局游戏",
            scoreBronzeDesc: "单局得分达到30分",
            scoreSilverDesc: "单局得分达到50分",
            scoreGoldDesc: "单局得分达到100分",
            scorePlatinumDesc: "单局得分达到200分",
            accuracyBronzeDesc: "单局准确率达到60%",
            accuracySilverDesc: "单局准确率达到75%",
            accuracyGoldDesc: "单局准确率达到90%",
            accuracyPlatinumDesc: "单局准确率达到100%",
            speedBronzeDesc: "5秒内完成一题",
            speedSilverDesc: "3秒内完成一题",
            speedGoldDesc: "2秒内完成一题",
            speedPlatinumDesc: "1秒内完成一题",
            persistenceBronzeDesc: "累计完成50题",
            persistenceSilverDesc: "累计完成200题",
            persistenceGoldDesc: "累计完成500题",
            persistencePlatinumDesc: "累计完成1000题",
            masterBronzeDesc: "解锁5个青铜级成就",
            masterSilverDesc: "解锁5个白银级成就",
            masterGoldDesc: "解锁3个黄金级成就",
            masterPlatinumDesc: "解锁1个铂金级成就",
            
            wrongAnswer: "错误答案",
            shouldBe: "应为",
            errors: "错误次数",
            moreQuestions: "还有 {count} 条错题",
            
            confirm: "确定",
            close: "关闭",
            save: "保存",
            delete: "删除",
            confirmClearHistory: "确定要清空本次游戏的历史记录吗？",
            historyCleared: "历史记录已清空",
            confirmClearWrongQuestions: "确定要清空本地错题吗？（云端错题不受影响）",
            wrongQuestionsCleared: "本地错题已清空",
            switchedToChinese: "已切换到中文",
            switchedToEnglish: "已切换到英文",
            languageText: "English",
            
            loginPrompt: "立即登录，与其他玩家一较高下！",
            
            offlineMode: "📴 离线模式",
            connecting: "🔄 正在连接服务器...",
            connectionFailed: "❌ 连接失败，使用离线模式",
            retryConnection: "重试连接",
            usingMockData: "📁 使用演示数据",
            laptopCompatibilityMode: "💻 笔记本兼容模式已启用"
        },
        en: {
            gameTitle: "🧮 Math Addition Match",
            gameSubtitle: "Educational Edition | Cloud Sync | Real-time Leaderboard",
            history: "📝 History",
            statistics: "📊 Statistics",
            achievements: "⭐ Achievements",
            wrongBook: "📖 Wrong Questions",
            leaderboard: "🏆 Leaderboard",
            profile: "👤 Profile",
            
            modeStandard: "📚 Challenge 30",
            modeStandardDesc: "Complete 30 questions, compete by time",
            modeChallenge: "⚡ Passion 90s",
            modeChallengeDesc: "90 seconds, compete by question count",
            modePractice: "🎯 Practice Mode",
            modePracticeDesc: "No time limit, focus on learning",
            modeCustom: "⚙️ Custom Mode",
            modeCustomDesc: "Set your own parameters",
            
            numberRange: "Number Range:",
            rangeEasy: "0-9 (Easy)",
            rangeStandard: "0-14 (Standard)",
            rangeChallenge: "5-18 (Challenge)",
            startGame: "🚀 Start Game",
            startPractice: "🎯 Start Practice",
            questionCount: "Questions:",
            timeLimit: "Time Limit (seconds):",
            
            scoreLabel: "Score",
            completedLabel: "Completed",
            timeLeft: "Time Left",
            timeUsed: "Time Used",
            accuracyLabel: "Accuracy",
            targetSum: "Target Sum:",
            hintButton: "💡 Hint",
            refreshButton: "🔄 Refresh",
            endGameButton: "⏹️ End",
            
            user: "User",
            logout: "Logout",
            loginTitle: "🔐 User Login",
            registerTitle: "📝 User Registration",
            emailLabel: "Email:",
            emailPlaceholder: "Enter email address",
            passwordLabel: "Password:",
            passwordPlaceholder: "Enter password",
            usernameLabel: "Username:",
            usernamePlaceholder: "Enter username (optional)",
            loginButton: "Login",
            registerButton: "Register",
            noAccount: "No account?",
            registerNow: "Register Now",
            hasAccount: "Already have an account?",
            loginNow: "Login Now",
            
            historyTitle: "📝 History Records",
            statisticsTitle: "📊 Statistics Analysis",
            achievementsTitle: "⭐ Achievement System",
            wrongbookTitle: "📖 Wrong Questions",
            leaderboardTitle: "🏆 Leaderboard",
            profileTitle: "👤 Profile",
            
            tableNumber: "#",
            tableTarget: "Target",
            tableNum1: "Num1",
            tableNum2: "Num2",
            tableResult: "Result",
            tableTime: "Time(s)",
            clearHistory: "Clear Current History",
            
            cloudSync: "☁️ Cloud Sync",
            syncing: "🔄 Syncing...",
            syncSuccess: "✅ Sync Successful",
            syncFailed: "❌ Sync Failed",
            lastSync: "Last Sync",
            syncNow: "Sync Now",
            autoSync: "Auto Sync",
            
            teacherApplication: "👨‍🏫 Teacher Application",
            applyForTeacher: "Apply for Teacher",
            schoolName: "School Name",
            schoolNamePlaceholder: "Enter school name",
            stateRegion: "State/Region",
            stateRegionPlaceholder: "Enter state/region",
            teachingSubject: "Teaching Subject",
            teachingSubjectPlaceholder: "e.g. Mathematics",
            gradeLevel: "Grade Level",
            gradeLevelPlaceholder: "e.g. Grade 3",
            reason: "Reason",
            reasonPlaceholder: "Please briefly explain why you want to be a teacher",
            contactPhone: "Contact Phone",
            contactPhonePlaceholder: "Enter contact phone number",
            submitApplication: "Submit Application",
            applicationSubmitted: "✅ Application submitted! Admin will review and notify you via email",
            applicationFailed: "❌ Application failed, please try again later",
            alreadyApplied: "You have already submitted an application, please wait for review",
            needLogin: "Please login first to apply for teacher account",
            cancel: "Cancel",
            
            teacherTools: "👨‍🏫 Teacher Tools",
            teacherToolsTitle: "👨‍🏫 Teacher Management Console",
            batchRegister: "📦 Batch Register Students",
            downloadTemplate: "📥 Download Template",
            uploadExcel: "📤 Upload Excel/CSV",
            defaultPassword: "🔑 Default Password",
            defaultPasswordPlaceholder: "Leave empty to use stu123456",
            className: "🏫 Class Name",
            classNamePlaceholder: "e.g. Grade 3 Class 1",
            uploadProgress: "Upload Progress",
            processing: "Processing...",
            accountCards: "📇 Generated Account Cards",
            printCards: "🖨️ Print Cards",
            classManagement: "📚 Class Management",
            studentList: "👥 Student List",
            studentStats: "📊 Class Statistics",
            teacherApproval: "✅ Teacher Approval",
            pendingTeachers: "⏳ Pending Teachers",
            approvedTeachers: "✓ Approved Teachers",
            rejectedTeachers: "✗ Rejected Teachers",
            approve: "✓ Approve",
            reject: "✗ Reject",
            viewDetails: "View Details",
            applicant: "Applicant",
            applyTime: "Apply Time",
            status: "Status",
            pending: "Pending",
            approved: "Approved",
            rejected: "Rejected",
            noPendingApplications: "No pending teacher applications",
            noApprovedTeachers: "No approved teachers",
            noRejectedTeachers: "No rejected applications",
            syncWrongQuestions: "☁️ Sync Wrong Questions",
            clearWrongQuestions: "🗑️ Clear Local Wrong Questions",
            
            adminTools: "👑 Admin Tools",
            adminToolsTitle: "👑 System Administration Console",
            systemStats: "📊 System Statistics",
            totalUsers: "👥 Total Users",
            totalTeachers: "👨‍🏫 Teachers",
            totalStudents: "👨‍🎓 Students",
            totalGames: "🎮 Total Games",
            totalQuestions: "❓ Total Questions",
            avgAccuracy: "🎯 Average Accuracy",
            teacherManagement: "👨‍🏫 Teacher Management",
            allTeachers: "All Teachers",
            approveTeacher: "Approve Teacher",
            removeTeacher: "Remove Teacher",
            setAdmin: "Set as Admin",
            removeAdmin: "Remove Admin",
            systemLogs: "📋 System Logs",
            userActivity: "User Activity",
            errorLogs: "Error Logs",
            syncLogs: "Sync Logs",
            dataManagement: "💾 Data Management",
            backupDatabase: "📀 Backup Database",
            restoreDatabase: "💿 Restore Database",
            clearCache: "🧹 Clear Cache",
            systemSettings: "⚙️ System Settings",
            maintenanceMode: "🔧 Maintenance Mode",
            enableMaintenance: "Enable Maintenance",
            disableMaintenance: "Disable Maintenance",
            siteAnnouncement: "📢 Site Announcement",
            announcementPlaceholder: "Enter announcement...",
            publishAnnouncement: "Publish Announcement",
            
            leaderboardEasy: "🟢 Easy Mode",
            leaderboardStandard: "🟠 Standard Mode",
            leaderboardChallenge: "🔴 Hard Mode",
            leaderboardChallengeMode: "⚡ Passion 90s",
            leaderboardStandardMode: "📚 Challenge 30",
            leaderboardEasyScore: "🏆 High Score",
            leaderboardStandardScore: "🏆 High Score",
            leaderboardChallengeScore: "🏆 High Score",
            leaderboardEasyAccuracy: "🎯 Accuracy",
            leaderboardStandardAccuracy: "🎯 Accuracy",
            leaderboardChallengeAccuracy: "🎯 Accuracy",
            leaderboardEasySpeed: "⚡ Speed",
            leaderboardStandardSpeed: "⚡ Speed",
            leaderboardChallengeSpeed: "⚡ Speed",
            rank: "Rank",
            player: "Player",
            score: "Score",
            accuracy: "Accuracy",
            time: "Time",
            date: "Date",
            easyMode: "Easy Mode",
            standardMode: "Standard Mode",
            challengeMode: "Hard Mode",
            noData: "No Data",
            myBest: "My Best",
            refresh: "Refresh",
            
            totalGames: "Total Games",
            totalQuestions: "Total Questions",
            totalCorrect: "Total Correct",
            avgTimePerQuestion: "Avg Time/Question",
            bestScore: "Best Score",
            bestAccuracy: "Best Accuracy",
            modeStats: "Mode Statistics",
            recentGames: "Recent 10 Games",
            loadingStats: "Loading statistics...",
            noHistoryStats: "No historical statistics",
            statsDescription: "After completing games and saving scores, statistics will be shown here",
            
            finalScore: "Final Score",
            finalCompleted: "Completed",
            finalTime: "Time Used",
            finalAccuracy: "Accuracy",
            playerNamePlaceholder: "Enter your name",
            saveScore: "Save Score",
            playAgain: "Play Again",
            viewLeaderboard: "View Leaderboard",
            viewStatistics: "View Statistics",
            gameComplete: "🎉 Congratulations! Completed 30 questions!",
            gameTimeout: "⏰ Time's up!",
            gameGiveup: "🏁 Game Over",
            gameEnd: "🎉 Game Over!",
            
            achievementProgress: "Achievement Progress",
            level: "Level",
            completed: "Completed",
            notCompleted: "Not Completed",
            unlocked: "Unlocked",
            locked: "Locked",
            bronze: "Bronze",
            silver: "Silver",
            gold: "Gold",
            platinum: "Platinum",
            categoryVictory: "🏆 Victor Medal",
            categoryScore: "💯 Scorer Crown",
            categoryAccuracy: "🎯 Sharpshooter Badge",
            categorySpeed: "⚡ Speedy Mark",
            categoryPersistence: "💪 Persistence Glory",
            categoryMaster: "👑 Math Master Title",
            victoryBronze: "🥉 Novice",
            victorySilver: "🥈 Apprentice",
            victoryGold: "🥇 Champion",
            victoryPlatinum: "🏆 God of War",
            scoreBronze: "🥉 Small Harvest",
            scoreSilver: "🥈 Wealth Accumulator",
            scoreGold: "🥇 Centurion",
            scorePlatinum: "💯 Score Harvester",
            accuracyBronze: "🥉 Steady",
            accuracySilver: "🥈 Precise Strike",
            accuracyGold: "🥇 Bullseye",
            accuracyPlatinum: "🎯 Never Miss",
            speedBronze: "🥉 Quick Reflex",
            speedSilver: "🥈 Lightning Fast",
            speedGold: "🥇 Light Speed",
            speedPlatinum: "⚡ Timeless",
            persistenceBronze: "🥉 Persistent",
            persistenceSilver: "🥈 Relentless",
            persistenceGold: "🥇 Tempered",
            persistencePlatinum: "💪 Eternal Legend",
            masterBronze: "🥉 Math Rookie",
            masterSilver: "🥈 Problem Solver",
            masterGold: "🥇 Math Elite",
            masterPlatinum: "👑 God of Math",
            victoryBronzeDesc: "Complete 1 game",
            victorySilverDesc: "Complete 10 games",
            victoryGoldDesc: "Complete 50 games",
            victoryPlatinumDesc: "Complete 100 games",
            scoreBronzeDesc: "Score 30 points in one game",
            scoreSilverDesc: "Score 50 points in one game",
            scoreGoldDesc: "Score 100 points in one game",
            scorePlatinumDesc: "Score 200 points in one game",
            accuracyBronzeDesc: "Achieve 60% accuracy",
            accuracySilverDesc: "Achieve 75% accuracy",
            accuracyGoldDesc: "Achieve 90% accuracy",
            accuracyPlatinumDesc: "Achieve 100% accuracy",
            speedBronzeDesc: "Answer within 5 seconds",
            speedSilverDesc: "Answer within 3 seconds",
            speedGoldDesc: "Answer within 2 seconds",
            speedPlatinumDesc: "Answer within 1 second",
            persistenceBronzeDesc: "Complete 50 questions total",
            persistenceSilverDesc: "Complete 200 questions total",
            persistenceGoldDesc: "Complete 500 questions total",
            persistencePlatinumDesc: "Complete 1000 questions total",
            masterBronzeDesc: "Unlock 5 Bronze achievements",
            masterSilverDesc: "Unlock 5 Silver achievements",
            masterGoldDesc: "Unlock 3 Gold achievements",
            masterPlatinumDesc: "Unlock 1 Platinum achievement",
            
            wrongAnswer: "Wrong answer",
            shouldBe: "should be",
            errors: "Errors",
            moreQuestions: "... {count} more questions",
            
            confirm: "Confirm",
            close: "Close",
            save: "Save",
            delete: "Delete",
            confirmClearHistory: "Are you sure you want to clear the current game history?",
            historyCleared: "History cleared",
            confirmClearWrongQuestions: "Are you sure you want to clear local wrong questions? (Cloud data will not be affected)",
            wrongQuestionsCleared: "Local wrong questions cleared",
            switchedToChinese: "Switched to Chinese",
            switchedToEnglish: "Switched to English",
            languageText: "中文",
            
            loginPrompt: "Login now and compete with other players!",
            
            offlineMode: "📴 Offline Mode",
            connecting: "🔄 Connecting to server...",
            connectionFailed: "❌ Connection failed, using offline mode",
            retryConnection: "Retry Connection",
            usingMockData: "📁 Using Demo Data",
            laptopCompatibilityMode: "💻 Laptop Compatibility Mode Enabled"
        }
    };
    
    // ==================== 全局变量 ====================
    var supabase = null;
    var supabaseInitialized = false;
    var offlineMode = false;
    var mockDataEnabled = false;
    var connectionRetryCount = 0;
    var MAX_RETRY_COUNT = 3;
    
    var score = 0;
    var selectedCards = [];
    var timeLeft = 90;
    var timerInterval = null;
    var completedQuestions = 0;
    var correctCount = 0;
    var totalAttempts = 0;
    var startTime = null;
    var currentTarget = 10;
    var currentMode = 'standard';
    var gameActive = false;
    var hintCooldown = 0;
    var hintInterval = null;
    var gameHistory = [];
    var wrongQuestions = [];
    var currentUser = null;
    var authMode = 'login';
    var currentLanguage = 'zh';
    var isAdminUser = false;
    var isSuperAdmin = false;
    var isSchoolAdmin = false;
    var isTeacher = false;
    var isSupabaseReady = false;
    
    var syncState = {
        lastSyncTime: null,
        isSyncing: false,
        syncHistory: [],
        dataVersion: '1.0.0',
        pendingChanges: false,
        offlineMode: false
    };
    
    var autoSyncTimer = null;
    var syncTimeout = null;
    
    // 缓存DOM元素
    var cachedElements = {
        pagination: null,
        leaderboardTitle: null
    };
    
    // ==================== 排行榜状态管理 ====================
    var leaderboardState = {
        currentGameMode: 'challenge',
        currentDifficulty: 'easy',
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalCount: 0,
        sortBy: 'score'
    };
    
    var ACHIEVEMENT_LEVELS = {
        BRONZE: 1,
        SILVER: 2,
        GOLD: 3,
        PLATINUM: 4
    };
    
    var ACHIEVEMENT_CATEGORIES = {
        VICTORY: 'victory',
        SCORE: 'score',
        ACCURACY: 'accuracy',
        SPEED: 'speed',
        PERSISTENCE: 'persistence',
        MASTER: 'master'
    };
    
    var CATEGORY_ORDER = ['victory', 'score', 'accuracy', 'speed', 'persistence', 'master'];
    var CATEGORY_ICONS = { victory: '🏆', score: '💯', accuracy: '🎯', speed: '⚡', persistence: '💪', master: '👑' };
    var LEVEL_ICONS = { 1: '🥉', 2: '🥈', 3: '🥇', 4: '🏆' };
    var LEVEL_COLORS = { 1: '#CD7F32', 2: '#C0C0C0', 3: '#FFD700', 4: '#E5E4E2' };
    
    var LADDER_ACHIEVEMENTS = [
        { id: 'victory_bronze', category: 'victory', level: 1, icon: '🥉', nameKey: 'victoryBronze', descKey: 'victoryBronzeDesc', requirement: { type: 'games_completed', value: 1 }, reward: { score: 10 } },
        { id: 'victory_silver', category: 'victory', level: 2, icon: '🥈', nameKey: 'victorySilver', descKey: 'victorySilverDesc', requirement: { type: 'games_completed', value: 10 }, reward: { score: 50 } },
        { id: 'victory_gold', category: 'victory', level: 3, icon: '🥇', nameKey: 'victoryGold', descKey: 'victoryGoldDesc', requirement: { type: 'games_completed', value: 50 }, reward: { score: 200 } },
        { id: 'victory_platinum', category: 'victory', level: 4, icon: '🏆', nameKey: 'victoryPlatinum', descKey: 'victoryPlatinumDesc', requirement: { type: 'games_completed', value: 100 }, reward: { score: 500 } },
        { id: 'score_bronze', category: 'score', level: 1, icon: '🥉', nameKey: 'scoreBronze', descKey: 'scoreBronzeDesc', requirement: { type: 'best_score', value: 30 }, reward: { score: 20 } },
        { id: 'score_silver', category: 'score', level: 2, icon: '🥈', nameKey: 'scoreSilver', descKey: 'scoreSilverDesc', requirement: { type: 'best_score', value: 50 }, reward: { score: 50 } },
        { id: 'score_gold', category: 'score', level: 3, icon: '🥇', nameKey: 'scoreGold', descKey: 'scoreGoldDesc', requirement: { type: 'best_score', value: 100 }, reward: { score: 150 } },
        { id: 'score_platinum', category: 'score', level: 4, icon: '💯', nameKey: 'scorePlatinum', descKey: 'scorePlatinumDesc', requirement: { type: 'best_score', value: 200 }, reward: { score: 300 } },
        { id: 'accuracy_bronze', category: 'accuracy', level: 1, icon: '🥉', nameKey: 'accuracyBronze', descKey: 'accuracyBronzeDesc', requirement: { type: 'best_accuracy', value: 60 }, reward: { score: 15 } },
        { id: 'accuracy_silver', category: 'accuracy', level: 2, icon: '🥈', nameKey: 'accuracySilver', descKey: 'accuracySilverDesc', requirement: { type: 'best_accuracy', value: 75 }, reward: { score: 30 } },
        { id: 'accuracy_gold', category: 'accuracy', level: 3, icon: '🥇', nameKey: 'accuracyGold', descKey: 'accuracyGoldDesc', requirement: { type: 'best_accuracy', value: 90 }, reward: { score: 100 } },
        { id: 'accuracy_platinum', category: 'accuracy', level: 4, icon: '🎯', nameKey: 'accuracyPlatinum', descKey: 'accuracyPlatinumDesc', requirement: { type: 'best_accuracy', value: 100 }, reward: { score: 200 } },
        { id: 'speed_bronze', category: 'speed', level: 1, icon: '🥉', nameKey: 'speedBronze', descKey: 'speedBronzeDesc', requirement: { type: 'fastest_answer', value: 5 }, reward: { score: 20 } },
        { id: 'speed_silver', category: 'speed', level: 2, icon: '🥈', nameKey: 'speedSilver', descKey: 'speedSilverDesc', requirement: { type: 'fastest_answer', value: 3 }, reward: { score: 50 } },
        { id: 'speed_gold', category: 'speed', level: 3, icon: '🥇', nameKey: 'speedGold', descKey: 'speedGoldDesc', requirement: { type: 'fastest_answer', value: 2 }, reward: { score: 150 } },
        { id: 'speed_platinum', category: 'speed', level: 4, icon: '⚡', nameKey: 'speedPlatinum', descKey: 'speedPlatinumDesc', requirement: { type: 'fastest_answer', value: 1 }, reward: { score: 300 } },
        { id: 'persistence_bronze', category: 'persistence', level: 1, icon: '🥉', nameKey: 'persistenceBronze', descKey: 'persistenceBronzeDesc', requirement: { type: 'total_questions', value: 50 }, reward: { score: 30 } },
        { id: 'persistence_silver', category: 'persistence', level: 2, icon: '🥈', nameKey: 'persistenceSilver', descKey: 'persistenceSilverDesc', requirement: { type: 'total_questions', value: 200 }, reward: { score: 100 } },
        { id: 'persistence_gold', category: 'persistence', level: 3, icon: '🥇', nameKey: 'persistenceGold', descKey: 'persistenceGoldDesc', requirement: { type: 'total_questions', value: 500 }, reward: { score: 300 } },
        { id: 'persistence_platinum', category: 'persistence', level: 4, icon: '💪', nameKey: 'persistencePlatinum', descKey: 'persistencePlatinumDesc', requirement: { type: 'total_questions', value: 1000 }, reward: { score: 600 } },
        { id: 'master_bronze', category: 'master', level: 1, icon: '🥉', nameKey: 'masterBronze', descKey: 'masterBronzeDesc', requirement: { type: 'bronze_count', value: 5 }, reward: { score: 100 } },
        { id: 'master_silver', category: 'master', level: 2, icon: '🥈', nameKey: 'masterSilver', descKey: 'masterSilverDesc', requirement: { type: 'silver_count', value: 5 }, reward: { score: 250 } },
        { id: 'master_gold', category: 'master', level: 3, icon: '🥇', nameKey: 'masterGold', descKey: 'masterGoldDesc', requirement: { type: 'gold_count', value: 3 }, reward: { score: 500 } },
        { id: 'master_platinum', category: 'master', level: 4, icon: '👑', nameKey: 'masterPlatinum', descKey: 'masterPlatinumDesc', requirement: { type: 'platinum_count', value: 1 }, reward: { score: 1000 } }
    ];
    
    var achievementStates = new Map();
    var playerStats = {
        gamesCompleted: 0,
        bestScore: 0,
        bestAccuracy: 0,
        fastestAnswer: 999,
        totalQuestions: 0,
        totalCorrect: 0,
        totalAttempts: 0,
        bronzeCount: 0,
        silverCount: 0,
        goldCount: 0,
        platinumCount: 0
    };
    
    var lastAnswerTime = null;
    var currentFastestAnswer = 999;
    
    var MODE_CONFIG = {
        standard: { questions: 30, time: null, hasTimeLimit: false, leaderboardType: 'standard', displayName: '挑战30' },
        challenge: { questions: null, time: 90, hasTimeLimit: true, leaderboardType: 'challenge', displayName: '激情90秒' },
        practice: { questions: null, time: null, hasTimeLimit: false, leaderboardType: null, displayName: '练习模式' },
        custom: { questions: 20, time: 60, hasTimeLimit: true, leaderboardType: null, displayName: '自定义' }
    };
    
    var DIFFICULTY_CONFIG = {
        'easy': { range: '0-9', displayName: '简单模式', icon: '🟢' },
        'medium': { range: '0-14', displayName: '标准模式', icon: '🟠' },
        'hard': { range: '5-18', displayName: '困难模式', icon: '🔴' }
    };
    
    var RANGE_CONFIG = {
        '0-9': { min: 0, max: 9, targetMin: 5, targetMax: 10, difficulty: 'easy', displayName: '简单模式' },
        '0-14': { min: 0, max: 14, targetMin: 6, targetMax: 14, difficulty: 'medium', displayName: '标准模式' },
        '5-18': { min: 5, max: 18, targetMin: 8, targetMax: 18, difficulty: 'hard', displayName: '困难模式' }
    };
    
    // ==================== 工具函数 ====================
    function showMessage(text, type, duration) {
        if (!text) return;
        
        type = type || 'info';
        duration = duration || 2000;
        
        try {
            var messages = document.querySelectorAll('.message-popup');
            for (var i = 0; i < messages.length; i++) {
                if (messages[i] && messages[i].parentNode) {
                    messages[i].parentNode.removeChild(messages[i]);
                }
            }
            
            var message = document.createElement('div');
            message.className = 'message-popup';
            message.textContent = text;
            
            var bgColor;
            if (type === 'success') {
                bgColor = '#4CAF50';
            } else if (type === 'error') {
                bgColor = '#ff4444';
            } else {
                bgColor = '#2196F3';
            }
            
            message.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: ${bgColor};
                color: white;
                padding: 12px 24px;
                border-radius: 30px;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                font-size: clamp(14px, 4vw, 16px);
                max-width: 90%;
                text-align: center;
            `;
            
            document.body.appendChild(message);
            
            setTimeout(function() {
                if (message && message.parentNode) {
                    message.style.opacity = '0';
                    message.style.transform = 'translateX(-50%) translateY(-20px)';
                    message.style.transition = 'all 0.3s ease';
                    setTimeout(function() {
                        if (message && message.parentNode) {
                            message.parentNode.removeChild(message);
                        }
                    }, 300);
                }
            }, duration);
        } catch (error) {
            console.error('显示消息失败:', error);
        }
    }
    
    function getTranslation(key, defaultValue) {
        if (!key) return defaultValue || '';
        
        var lang = currentLanguage || 'zh';
        var trans = translations[lang];
        
        if (trans && trans[key] !== undefined) {
            return trans[key];
        }
        
        return defaultValue || key;
    }
    
    function setLanguage(lang) {
        try {
            if (lang !== 'zh' && lang !== 'en') return;
            currentLanguage = lang;
            
            try {
                localStorage.setItem('mathGameLanguage', lang);
            } catch (e) {
                console.warn('无法保存语言设置:', e);
            }
            
            var elements = document.querySelectorAll('[data-i18n]');
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                var key = element.getAttribute('data-i18n');
                var translation = getTranslation(key);
                
                if (translation) {
                    if (element.hasAttribute('placeholder')) {
                        element.setAttribute('placeholder', translation);
                    } else {
                        element.textContent = translation;
                    }
                }
            }
            
            var languageText = document.getElementById('language-text');
            if (languageText) {
                languageText.textContent = getTranslation('languageText', 'English');
            }
            
            updateModeDisplayNames();
            
            if (currentUser) {
                updateUserInfo();
            }
            
            var openModals = {
                'history-modal': showHistory,
                'statistics-modal': showStatistics,
                'achievements-modal': showAchievements,
                'wrongbook-modal': showWrongBook,
                'leaderboard-modal': showLeaderboard,
                'profile-modal': showProfile,
                'teacher-tools-modal': showTeacherTools,
                'admin-tools-modal': showAdminTools
            };
            
            for (var modalId in openModals) {
                if (openModals.hasOwnProperty(modalId)) {
                    var modal = document.getElementById(modalId);
                    if (modal && modal.style.display === 'flex') {
                        openModals[modalId]();
                    }
                }
            }
            
            var gameOverElement = document.getElementById('game-over');
            if (gameOverElement && gameOverElement.style.display === 'flex') {
                updateGameOverText();
            }
            
            console.log('语言已切换到: ' + lang);
        } catch (error) {
            console.error('设置语言失败:', error);
        }
    }
    
    function updateModeDisplayNames() {
        try {
            var modeStandard = document.querySelector('[data-mode="standard"] .mode-title');
            var modeChallenge = document.querySelector('[data-mode="challenge"] .mode-title');
            var modePractice = document.querySelector('[data-mode="practice"] .mode-title');
            var modeCustom = document.querySelector('[data-mode="custom"] .mode-title');
            
            if (modeStandard) modeStandard.textContent = getTranslation('modeStandard', '📚 挑战30');
            if (modeChallenge) modeChallenge.textContent = getTranslation('modeChallenge', '⚡ 激情90秒');
            if (modePractice) modePractice.textContent = getTranslation('modePractice', '🎯 练习模式');
            if (modeCustom) modeCustom.textContent = getTranslation('modeCustom', '⚙️ 自定义');
            
            var modeStandardDesc = document.querySelector('[data-mode="standard"] .mode-desc');
            var modeChallengeDesc = document.querySelector('[data-mode="challenge"] .mode-desc');
            var modePracticeDesc = document.querySelector('[data-mode="practice"] .mode-desc');
            var modeCustomDesc = document.querySelector('[data-mode="custom"] .mode-desc');
            
            if (modeStandardDesc) modeStandardDesc.textContent = getTranslation('modeStandardDesc', '完成30题，比拼用时');
            if (modeChallengeDesc) modeChallengeDesc.textContent = getTranslation('modeChallengeDesc', '90秒时间，比拼题数');
            if (modePracticeDesc) modePracticeDesc.textContent = getTranslation('modePracticeDesc', '无时间限制，专心学习');
            if (modeCustomDesc) modeCustomDesc.textContent = getTranslation('modeCustomDesc', '自设参数，灵活练习');
            
            var startBtn = document.getElementById('start-btn');
            if (startBtn) {
                if (currentMode === 'practice') {
                    startBtn.innerHTML = '<span>' + getTranslation('startPractice', '🎯 开始练习') + '</span>';
                } else {
                    startBtn.innerHTML = '<span>' + getTranslation('startGame', '🚀 开始游戏') + '</span>';
                }
            }
        } catch (error) {
            console.error('更新模式显示名称失败:', error);
        }
    }
    
    function updateGameOverText() {
        try {
            var resultTitle = document.getElementById('result-title');
            var saveScoreBtn = document.getElementById('save-score-btn');
            var playAgainBtn = document.getElementById('play-again-btn');
            var viewLeaderboardBtn = document.getElementById('view-leaderboard-btn');
            var viewStatisticsBtn = document.getElementById('view-statistics-btn');
            var playerNameInput = document.getElementById('player-name');
            
            if (saveScoreBtn) saveScoreBtn.innerHTML = '<span>' + getTranslation('saveScore', '保存成绩') + '</span>';
            if (playAgainBtn) playAgainBtn.innerHTML = '<span>' + getTranslation('playAgain', '再玩一次') + '</span>';
            if (viewLeaderboardBtn) viewLeaderboardBtn.innerHTML = '<span>' + getTranslation('viewLeaderboard', '查看排行榜') + '</span>';
            if (viewStatisticsBtn) viewStatisticsBtn.innerHTML = '<span>' + getTranslation('viewStatistics', '查看统计') + '</span>';
            if (playerNameInput) playerNameInput.placeholder = getTranslation('playerNamePlaceholder', '请输入你的名字');
            
            var finalScoreLabel = document.querySelector('.stat-item:first-child .stat-label');
            var finalCompletedLabel = document.querySelector('.stat-item:nth-child(2) .stat-label');
            var finalTimeLabel = document.querySelector('.stat-item:nth-child(3) .stat-label');
            var finalAccuracyLabel = document.querySelector('.stat-item:nth-child(4) .stat-label');
            
            if (finalScoreLabel) finalScoreLabel.textContent = getTranslation('finalScore', '最终得分');
            if (finalCompletedLabel) finalCompletedLabel.textContent = getTranslation('finalCompleted', '完成题数');
            if (finalTimeLabel) finalTimeLabel.textContent = getTranslation('finalTime', '用时');
            if (finalAccuracyLabel) finalAccuracyLabel.textContent = getTranslation('finalAccuracy', '正确率');
        } catch (error) {
            console.error('更新游戏结束文字失败:', error);
        }
    }
    
    function shuffleArray(array) {
        if (!array || !array.length) return array;
        
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    
    // ==================== Supabase 初始化 ====================
    async function initSupabase() {
        console.log('🔄 初始化Supabase...');
        
        if (window.location.protocol === 'file:') {
            console.warn('⚠️ 在本地文件系统运行，启用离线模式');
            offlineMode = true;
            syncState.offlineMode = true;
            showMessage(
                getTranslation('offlineMode', '📴 离线模式') + '：' + 
                (currentLanguage === 'zh' ? '请在本地服务器中运行游戏' : 'Please run on a local server'), 
                'warning', 5000
            );
            return false;
        }
        
        var isLaptop = window.screen.width >= 1024 && window.screen.width <= 1440 && 
                        !('ontouchstart' in window) && window.navigator.maxTouchPoints === 0;
        
        if (isLaptop) {
            console.log('💻 检测到笔记本电脑，启用兼容模式');
            showMessage(getTranslation('laptopCompatibilityMode', '💻 笔记本兼容模式已启用'), 'info', 3000);
        }
        
        var retryCount = 0;
        var maxRetries = 3;
        
        while (retryCount < maxRetries && !isSupabaseReady) {
            for (var i = 0; i < CONFIG.SUPABASE_URLS.length; i++) {
                try {
                    var supabaseUrl = CONFIG.SUPABASE_URLS[i];
                    var supabaseKey = CONFIG.SUPABASE_ANON_KEY;
                    
                    console.log('尝试连接 Supabase (' + (i + 1) + '/' + CONFIG.SUPABASE_URLS.length + ')...');
                    
                    supabase = window.supabase.createClient(supabaseUrl, supabaseKey, {
                        auth: {
                            autoRefreshToken: true,
                            persistSession: true,
                            detectSessionInUrl: true,
                            storage: window.localStorage
                        },
                        global: {
                            headers: {
                                'X-Client-Info': 'math-addition-game@1.0.0'
                            }
                        }
                    });
                    
                    var result = await supabase.auth.getSession();
                    
                    if (!result.error) {
                        console.log('✅ Supabase连接成功 (节点 ' + (i + 1) + ')');
                        isSupabaseReady = true;
                        offlineMode = false;
                        syncState.offlineMode = false;
                        return true;
                    } else {
                        console.warn('⚠️ 节点 ' + (i + 1) + ' 连接失败:', result.error.message);
                    }
                } catch (e) {
                    console.warn('⚠️ 节点 ' + (i + 1) + ' 连接异常:', e.message);
                }
                
                await new Promise(function(resolve) { setTimeout(resolve, 500); });
            }
            
            retryCount++;
            if (retryCount < maxRetries) {
                console.log('🔄 重试连接... (' + retryCount + '/' + maxRetries + ')');
                await new Promise(function(resolve) { setTimeout(resolve, 2000); });
            }
        }
        
        console.error('❌ 所有Supabase节点都连接失败，进入离线模式');
        offlineMode = true;
        syncState.offlineMode = true;
        isSupabaseReady = false;
        
        showMessage(
            currentLanguage === 'zh' 
                ? '⚠️ 无法连接到游戏服务器，正在使用离线模式。部分功能可能不可用。' 
                : '⚠️ Cannot connect to game server, using offline mode. Some features may be unavailable.', 
            'warning', 
            6000
        );
        
        return false;
    }
    
    // ==================== 用户认证 ====================
    async function checkAuth() {
        if (!isSupabaseReady || !supabase || offlineMode) return false;
        
        try {
            var result = await supabase.auth.getUser();
            
            if (result.error) {
                console.error('获取用户失败:', result.error);
                return false;
            }
            
            if (result.data && result.data.user) {
                currentUser = result.data.user;
                console.log('用户已登录:', currentUser.email);
                
                await checkUserRole();
                updateUserInfo();
                
                setTimeout(async function() {
                    await loadAchievementsFromCloud();
                    await loadWrongQuestionsFromCloud();
                    await loadUserStats();
                    await loadUserScores();
                    
                    if (syncState.lastSyncTime) {
                        var lastSync = new Date(syncState.lastSyncTime);
                        var now = new Date();
                        if (now - lastSync > 30 * 60 * 1000) {
                            performFullSync();
                        }
                    } else {
                        performFullSync();
                    }
                }, 1000);
                
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('检查认证状态失败:', error);
            return false;
        }
    }
    
    // ==================== 角色检查函数 ====================
    async function checkUserRole() {
        if (!currentUser) {
            isAdminUser = false;
            isSuperAdmin = false;
            isSchoolAdmin = false;
            isTeacher = false;
            return false;
        }
        
        try {
            var userEmail = currentUser.email ? currentUser.email.toLowerCase() : '';
            var userMeta = currentUser.user_metadata || {};
            var userRole = userMeta.role || 'student';
            
            console.log('检查用户角色:', { 
                email: userEmail, 
                role: userRole, 
                metadata: userMeta,
                adminEmails: CONFIG.ADMIN_EMAILS 
            });
            
            var isEmailInAdminList = false;
            for (var i = 0; i < CONFIG.ADMIN_EMAILS.length; i++) {
                if (CONFIG.ADMIN_EMAILS[i].toLowerCase() === userEmail) {
                    isEmailInAdminList = true;
                    break;
                }
            }
            
            isSuperAdmin = isEmailInAdminList || 
                          userRole === 'super_admin' ||
                          userRole === 'admin' ||
                          (userMeta.is_super_admin === true);
            
            isSchoolAdmin = userRole === 'school_admin' ||
                           (userRole === 'admin' && userMeta.school_id) ||
                           isSuperAdmin;
            
            isTeacher = userRole === 'teacher' ||
                       (userRole === 'admin' && userMeta.approved === true) ||
                       isSchoolAdmin;
            
            isAdminUser = isSuperAdmin || isSchoolAdmin;
            
            console.log('角色检查结果:', {
                isSuperAdmin: isSuperAdmin,
                isSchoolAdmin: isSchoolAdmin,
                isTeacher: isTeacher,
                isAdminUser: isAdminUser,
                isEmailInAdminList: isEmailInAdminList
            });
            
            return true;
        } catch (error) {
            console.error('检查用户角色失败:', error);
            return false;
        }
    }
    
    async function checkIfAdmin() {
        await checkUserRole();
        return isAdminUser;
    }
    
    async function login(email, password) {
        try {
            if (!isSupabaseReady || !supabase || offlineMode) {
                showMessage(currentLanguage === 'zh' ? '离线模式无法登录' : 'Cannot login in offline mode', 'error');
                return false;
            }
            
            var result = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password.trim()
            });
            
            if (result.error) {
                var errorElement = document.getElementById('auth-error');
                if (errorElement) errorElement.textContent = result.error.message;
                return false;
            }
            
            if (result.data && result.data.user) {
                currentUser = result.data.user;
                
                await checkUserRole();
                updateUserInfo();
                closeAuthModal();
                
                showMessage(currentLanguage === 'zh' ? '登录成功！' : 'Login successful!', 'success');
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('登录失败:', error);
            var errorElement = document.getElementById('auth-error');
            if (errorElement) errorElement.textContent = currentLanguage === 'zh' ? '登录失败' : 'Login failed';
            return false;
        }
    }
    
    async function register(email, password, username) {
        try {
            if (!isSupabaseReady || !supabase || offlineMode) {
                showMessage(currentLanguage === 'zh' ? '离线模式无法注册' : 'Cannot register in offline mode', 'error');
                return false;
            }
            
            var userMetadata = {
                username: (username && username.trim()) || email.split('@')[0],
                role: 'student'
            };
            
            var result = await supabase.auth.signUp({
                email: email.trim(),
                password: password.trim(),
                options: {
                    data: userMetadata
                }
            });
            
            if (result.error) {
                var errorElement = document.getElementById('auth-error');
                if (errorElement) errorElement.textContent = result.error.message;
                return false;
            }
            
            if (result.data && result.data.user) {
                currentUser = result.data.user;
                
                await checkUserRole();
                updateUserInfo();
                closeAuthModal();
                
                showMessage(currentLanguage === 'zh' ? '注册成功！请检查邮箱验证邮件。' : 'Registration successful! Please check your email for verification.', 'success');
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('注册失败:', error);
            var errorElement = document.getElementById('auth-error');
            if (errorElement) errorElement.textContent = currentLanguage === 'zh' ? '注册失败' : 'Registration failed';
            return false;
        }
    }
    
    async function logout() {
        try {
            if (!isSupabaseReady || !supabase || offlineMode) {
                currentUser = null;
                isAdminUser = false;
                isSuperAdmin = false;
                isSchoolAdmin = false;
                isTeacher = false;
                updateUserInfo();
                showMessage(currentLanguage === 'zh' ? '已退出登录' : 'Logged out', 'info');
                return;
            }
            
            if (currentUser && syncState.pendingChanges) {
                await performFullSync();
            }
            
            var result = await supabase.auth.signOut();
            
            if (result.error) {
                showMessage((currentLanguage === 'zh' ? '退出失败: ' : 'Logout failed: ') + result.error.message, 'error');
                return;
            }
            
            currentUser = null;
            isAdminUser = false;
            isSuperAdmin = false;
            isSchoolAdmin = false;
            isTeacher = false;
            
            var userInfo = document.getElementById('user-info');
            var teacherToolsBtn = document.getElementById('teacher-tools-btn');
            var adminToolsBtn = document.getElementById('admin-tools-btn');
            var syncStatusBtn = document.getElementById('sync-status-btn');
            var teacherApplicationBtn = document.getElementById('teacher-application-btn');
            
            if (userInfo) userInfo.style.display = 'none';
            if (teacherToolsBtn) teacherToolsBtn.style.display = 'none';
            if (adminToolsBtn) adminToolsBtn.style.display = 'none';
            if (syncStatusBtn) syncStatusBtn.style.display = 'none';
            if (teacherApplicationBtn) teacherApplicationBtn.style.display = 'none';
            
            showMessage(currentLanguage === 'zh' ? '已退出登录' : 'Logged out', 'info');
        } catch (error) {
            console.error('退出失败:', error);
            showMessage(currentLanguage === 'zh' ? '退出失败' : 'Logout failed', 'error');
        }
    }
    
    // ==================== updateUserInfo 函数 ====================
    function updateUserInfo() {
        if (!currentUser) return;
        
        try {
            var userInfo = document.getElementById('user-info');
            var userAvatar = document.getElementById('user-avatar');
            var userName = document.getElementById('user-name');
            var teacherToolsBtn = document.getElementById('teacher-tools-btn');
            var adminToolsBtn = document.getElementById('admin-tools-btn');
            var syncStatusBtn = document.getElementById('sync-status-btn');
            var teacherApplicationBtn = document.getElementById('teacher-application-btn');
            
            if (!userInfo || !userAvatar || !userName) return;
            
            userInfo.style.display = 'flex';
            var email = currentUser.email || '';
            var firstLetter = email.charAt(0).toUpperCase() || '?';
            userAvatar.textContent = firstLetter;
            
            var username = (currentUser.user_metadata && currentUser.user_metadata.username) || email.split('@')[0];
            userName.textContent = username;
            
            if (syncStatusBtn) {
                syncStatusBtn.style.display = 'flex';
                if (offlineMode) {
                    syncStatusBtn.innerHTML = '📴';
                    syncStatusBtn.title = currentLanguage === 'zh' ? '离线模式' : 'Offline mode';
                } else if (syncState.pendingChanges) {
                    syncStatusBtn.innerHTML = '☁️ ⚠️';
                    syncStatusBtn.title = currentLanguage === 'zh' ? '有待同步的数据' : 'Pending changes';
                } else {
                    syncStatusBtn.innerHTML = '☁️ ✓';
                    syncStatusBtn.title = currentLanguage === 'zh' ? '已同步' : 'Synced';
                }
            }
            
            var userRole = currentUser.user_metadata ? currentUser.user_metadata.role : null;
            
            if (teacherApplicationBtn) {
                if (userRole === 'student' || !userRole) {
                    teacherApplicationBtn.style.display = 'flex';
                    var span = teacherApplicationBtn.querySelector('span');
                    if (span) span.textContent = getTranslation('applyForTeacher', '申请成为教师');
                } else {
                    teacherApplicationBtn.style.display = 'none';
                }
            }
            
            if (teacherToolsBtn) {
                var showTeacherTools = isSuperAdmin || isSchoolAdmin || 
                    (isTeacher && currentUser.user_metadata && currentUser.user_metadata.approved === true);
                
                teacherToolsBtn.style.display = showTeacherTools ? 'flex' : 'none';
                if (showTeacherTools) {
                    var span = teacherToolsBtn.querySelector('span');
                    if (span) span.textContent = getTranslation('teacherTools', '教师工具');
                }
            }
            
            if (adminToolsBtn) {
                adminToolsBtn.style.display = isSuperAdmin ? 'flex' : 'none';
                if (isSuperAdmin) {
                    var span = adminToolsBtn.querySelector('span');
                    if (span) span.textContent = getTranslation('adminTools', '管理工具');
                }
            }
            
            console.log('UI更新 - 权限状态:', {
                isSuperAdmin: isSuperAdmin,
                isSchoolAdmin: isSchoolAdmin,
                isTeacher: isTeacher,
                showTeacherTools: teacherToolsBtn ? teacherToolsBtn.style.display : null,
                showAdminTools: adminToolsBtn ? adminToolsBtn.style.display : null
            });
            
        } catch (error) {
            console.error('更新用户信息失败:', error);
        }
    }
    
    // ==================== 弹窗函数 ====================
    function showAuthModal() {
        try {
            var authModal = document.getElementById('auth-modal');
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
            var authModal = document.getElementById('auth-modal');
            if (authModal) authModal.style.display = 'none';
            
            var authEmail = document.getElementById('auth-email');
            var authPassword = document.getElementById('auth-password');
            var authUsername = document.getElementById('auth-username');
            var authError = document.getElementById('auth-error');
            
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
            var isLogin = authMode === 'login';
            var authTitle = document.getElementById('auth-title');
            var authSubmitBtn = document.getElementById('auth-submit-btn');
            var authSwitchText = document.getElementById('auth-switch-text');
            var authSwitchLink = document.getElementById('auth-switch-link');
            var authUsernameGroup = document.getElementById('auth-username-group');
            var roleSelectGroup = document.getElementById('role-select-group');
            var teacherRegisterFields = document.getElementById('teacher-register-fields');
            
            if (authTitle) {
                authTitle.textContent = isLogin ? 
                    getTranslation('loginTitle', '🔐 用户登录') : 
                    getTranslation('registerTitle', '📝 用户注册');
            }
            
            if (authSubmitBtn) {
                authSubmitBtn.textContent = isLogin ? 
                    getTranslation('loginButton', '登录') : 
                    getTranslation('registerButton', '注册');
            }
            
            if (authSwitchText) {
                authSwitchText.textContent = isLogin ? 
                    getTranslation('noAccount', '还没有账号？') : 
                    getTranslation('hasAccount', '已有账号？');
            }
            
            if (authSwitchLink) {
                authSwitchLink.textContent = isLogin ? 
                    getTranslation('registerNow', '立即注册') : 
                    getTranslation('loginNow', '立即登录');
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
            var emailInput = document.getElementById('auth-email');
            var passwordInput = document.getElementById('auth-password');
            var usernameInput = document.getElementById('auth-username');
            var roleSelect = document.getElementById('auth-role');
            var schoolInput = document.getElementById('auth-school');
            var stateInput = document.getElementById('auth-state');
            
            if (!emailInput || !passwordInput) return;
            
            var email = emailInput.value.trim();
            var password = passwordInput.value.trim();
            var username = usernameInput ? usernameInput.value.trim() : '';
            var role = roleSelect ? roleSelect.value : 'student';
            var school = schoolInput ? schoolInput.value.trim() : '';
            var state = stateInput ? stateInput.value.trim() : '';
            
            if (!email || !password) {
                var errorElement = document.getElementById('auth-error');
                if (errorElement) errorElement.textContent = currentLanguage === 'zh' ? '请输入邮箱和密码' : 'Please enter email and password';
                return;
            }
            
            if (authMode === 'login') {
                await login(email, password);
            } else {
                await register(email, password, username);
            }
        } catch (error) {
            console.error('处理认证失败:', error);
        }
    }
    
    // ==================== 教师申请功能 ====================
    async function showTeacherApplication() {
        try {
            if (!currentUser) {
                showMessage(getTranslation('needLogin', '请先登录后再申请教师账号'), 'error');
                showAuthModal();
                return;
            }
            
            if (offlineMode) {
                showMessage(
                    currentLanguage === 'zh' ? '离线模式无法提交教师申请' : 'Cannot submit teacher application in offline mode',
                    'warning'
                );
                return;
            }
            
            if (!isSupabaseReady || !supabase) {
                showMessage(currentLanguage === 'zh' ? '云端服务未就绪' : 'Cloud service not ready', 'error');
                return;
            }
            
            var checkResult = await supabase
                .from('teacher_applications')
                .select('*')
                .eq('user_id', currentUser.id)
                .eq('status', 'pending')
                .limit(1);
            
            if (checkResult.error) {
                console.error('检查教师申请失败:', checkResult.error);
            }
            
            if (checkResult.data && checkResult.data.length > 0) {
                showMessage(getTranslation('alreadyApplied', '您已经提交过申请，请耐心等待审核'), 'info');
                return;
            }
            
            var applicationHtml = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 20px; padding: 30px; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); z-index: 4000;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h3 style="color: #4CAF50; margin: 0; font-size: clamp(18px, 5vw, 24px);">👨‍🏫 ${getTranslation('teacherApplication', '教师账号申请')}</h3>
                        <button id="close-application-btn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">✕</button>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold; font-size: clamp(14px, 4vw, 16px);">${getTranslation('schoolName', '学校名称')}</label>
                        <input id="app-school" type="text" placeholder="${getTranslation('schoolNamePlaceholder', '请输入学校全称')}" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: clamp(14px, 4vw, 16px);">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold; font-size: clamp(14px, 4vw, 16px);">${getTranslation('stateRegion', '所在州属')}</label>
                        <input id="app-state" type="text" placeholder="${getTranslation('stateRegionPlaceholder', '请输入州/省/地区')}" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: clamp(14px, 4vw, 16px);">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold; font-size: clamp(14px, 4vw, 16px);">${getTranslation('teachingSubject', '教授科目')}</label>
                        <input id="app-subject" type="text" placeholder="${getTranslation('teachingSubjectPlaceholder', '例如：数学')}" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: clamp(14px, 4vw, 16px);">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold; font-size: clamp(14px, 4vw, 16px);">${getTranslation('gradeLevel', '任教年级')}</label>
                        <input id="app-grade" type="text" placeholder="${getTranslation('gradeLevelPlaceholder', '例如：小学三年级')}" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: clamp(14px, 4vw, 16px);">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold; font-size: clamp(14px, 4vw, 16px);">${getTranslation('contactPhone', '联系电话')}</label>
                        <input id="app-phone" type="tel" placeholder="${getTranslation('contactPhonePlaceholder', '请输入联系电话')}" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: clamp(14px, 4vw, 16px);">
                    </div>
                    
                    <div style="margin-bottom: 25px;">
                        <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold; font-size: clamp(14px, 4vw, 16px);">${getTranslation('reason', '申请理由')}</label>
                        <textarea id="app-reason" rows="4" placeholder="${getTranslation('reasonPlaceholder', '请简要说明申请教师账号的原因')}" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: clamp(14px, 4vw, 16px); resize: vertical;"></textarea>
                    </div>
                    
                    <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                        <button id="submit-application-btn" style="flex: 2; min-width: 200px; background: #4CAF50; color: white; border: none; padding: 14px; border-radius: 10px; font-weight: bold; font-size: clamp(14px, 4vw, 16px); cursor: pointer;">
                            📨 ${getTranslation('submitApplication', '提交申请')}
                        </button>
                        <button id="cancel-application-btn" style="flex: 1; min-width: 100px; background: #f44336; color: white; border: none; padding: 14px; border-radius: 10px; font-weight: bold; font-size: clamp(14px, 4vw, 16px); cursor: pointer;">
                            ${getTranslation('cancel', '取消')}
                        </button>
                    </div>
                </div>
            `;
            
            var applicationDiv = document.createElement('div');
            applicationDiv.id = 'teacher-application-modal';
            applicationDiv.innerHTML = applicationHtml;
            document.body.appendChild(applicationDiv);
            
            document.getElementById('close-application-btn').addEventListener('click', function() {
                if (applicationDiv.parentNode) {
                    applicationDiv.parentNode.removeChild(applicationDiv);
                }
            });
            
            document.getElementById('cancel-application-btn').addEventListener('click', function() {
                if (applicationDiv.parentNode) {
                    applicationDiv.parentNode.removeChild(applicationDiv);
                }
            });
            
            document.getElementById('submit-application-btn').addEventListener('click', async function() {
                var school = document.getElementById('app-school').value.trim();
                var state = document.getElementById('app-state').value.trim();
                var subject = document.getElementById('app-subject').value.trim();
                var grade = document.getElementById('app-grade').value.trim();
                var phone = document.getElementById('app-phone').value.trim();
                var reason = document.getElementById('app-reason').value.trim();
                
                if (!school || !state || !subject || !grade || !phone || !reason) {
                    showMessage(currentLanguage === 'zh' ? '请填写所有字段' : 'Please fill in all fields', 'error');
                    return;
                }
                
                await submitTeacherApplication(school, state, subject, grade, phone, reason);
                if (applicationDiv.parentNode) {
                    applicationDiv.parentNode.removeChild(applicationDiv);
                }
            });
        } catch (error) {
            console.error('显示教师申请表单失败:', error);
        }
    }
    
    async function submitTeacherApplication(school, state, subject, grade, phone, reason) {
        try {
            if (!currentUser) {
                showMessage(getTranslation('needLogin', '请先登录后再申请教师账号'), 'error');
                return false;
            }
            
            if (offlineMode) {
                showMessage(currentLanguage === 'zh' ? '离线模式无法提交申请' : 'Cannot submit application in offline mode', 'error');
                return false;
            }
            
            if (!isSupabaseReady || !supabase) {
                showMessage(currentLanguage === 'zh' ? '云端服务未就绪' : 'Cloud service not ready', 'error');
                return false;
            }
            
            var username = (currentUser.user_metadata && currentUser.user_metadata.username) || 
                          (currentUser.email ? currentUser.email.split('@')[0] : '');
            
            var applicationData = {
                user_id: currentUser.id,
                email: currentUser.email,
                username: username,
                school: school,
                state: state,
                subject: subject,
                grade: grade,
                phone: phone,
                reason: reason,
                status: 'pending',
                created_at: new Date().toISOString()
            };
            
            var result = await supabase
                .from('teacher_applications')
                .insert([applicationData]);
            
            if (result.error) {
                console.error('提交教师申请失败:', result.error);
                showMessage(getTranslation('applicationFailed', '❌ 申请提交失败，请稍后重试'), 'error');
                return false;
            }
            
            await sendTeacherApplicationEmail(applicationData);
            
            showMessage(getTranslation('applicationSubmitted', '✅ 申请已提交！管理员会尽快审核并通过邮件通知您'), 'success');
            return true;
        } catch (error) {
            console.error('提交教师申请异常:', error);
            showMessage(getTranslation('applicationFailed', '❌ 申请提交失败，请稍后重试'), 'error');
            return false;
        }
    }
    
    async function sendTeacherApplicationEmail(applicationData) {
        try {
            var emailContent = `
                新的教师账号申请
                -------------------
                申请人邮箱: ${applicationData.email}
                申请人姓名: ${applicationData.username}
                学校名称: ${applicationData.school}
                所在州属: ${applicationData.state}
                教授科目: ${applicationData.subject}
                任教年级: ${applicationData.grade}
                联系电话: ${applicationData.phone}
                申请理由: ${applicationData.reason}
                申请时间: ${new Date(applicationData.created_at).toLocaleString('zh-CN')}
                
                请登录 Supabase 后台审核该申请：
                1. 进入 Authentication -> Users
                2. 找到该用户，将 user_metadata 中的 role 改为 'teacher'
                3. 添加 approved: true
                
                或执行 SQL：
                UPDATE auth.users 
                SET raw_user_meta_data = raw_user_meta_data || '{"role": "teacher", "approved": true}'::jsonb
                WHERE id = '${applicationData.user_id}';
            `;
            
            console.log('📧 教师申请邮件通知:', emailContent);
            
            var result = await supabase
                .from('email_notifications')
                .insert([{
                    recipient: CONFIG.ADMIN_EMAILS[0],
                    subject: '新的教师账号申请 - ' + applicationData.email,
                    content: emailContent,
                    status: 'pending',
                    created_at: new Date().toISOString()
                }]);
            
            if (result.error) {
                console.error('存储邮件通知失败:', result.error);
            }
            
            return true;
        } catch (error) {
            console.error('发送教师申请邮件失败:', error);
            return false;
        }
    }
    
    // ==================== 修复版教师工具 ====================
    async function showTeacherTools() {
        try {
            if (!currentUser) {
                showMessage(getTranslation('needLogin', '请先登录后再申请教师账号'), 'error');
                showAuthModal();
                return;
            }
            
            if (offlineMode) {
                showMessage(
                    currentLanguage === 'zh' 
                        ? '📴 离线模式无法使用教师工具' 
                        : '📴 Teacher tools unavailable in offline mode',
                    'warning'
                );
                return;
            }
            
            if (!isSupabaseReady || !supabase) {
                showMessage(
                    currentLanguage === 'zh' ? '云端服务未就绪' : 'Cloud service not ready',
                    'error'
                );
                return;
            }
            
            var canUseTeacherTools = isSuperAdmin || isSchoolAdmin || 
                (isTeacher && currentUser.user_metadata && currentUser.user_metadata.approved === true);
            
            if (!canUseTeacherTools) {
                showMessage(
                    currentLanguage === 'zh' 
                        ? '只有已批准的教师、学校管理员或超级管理员可以使用此功能' 
                        : 'Only approved teachers, school administrators or super administrators can use this feature',
                    'error'
                );
                return;
            }
            
            var teacherToolsModal = document.getElementById('teacher-tools-modal');
            if (!teacherToolsModal) return;
            
            var pendingApplications = [];
            try {
                var query = supabase
                    .from('teacher_applications')
                    .select('*')
                    .eq('status', 'pending')
                    .order('created_at', { ascending: false });
                
                if (isSchoolAdmin && !isSuperAdmin) {
                    var schoolId = currentUser.user_metadata ? currentUser.user_metadata.school_id : null;
                    if (schoolId) {
                        query = query.eq('school_id', schoolId);
                    }
                }
                
                var result = await query;
                
                if (!result.error) {
                    pendingApplications = result.data || [];
                }
            } catch (e) {
                console.error('加载待审核教师申请失败:', e);
            }
            
            var approvedTeachers = [];
            try {
                var query = supabase
                    .from('teacher_applications')
                    .select('*')
                    .eq('status', 'approved')
                    .order('created_at', { ascending: false });
                
                if (isSchoolAdmin && !isSuperAdmin) {
                    var schoolId = currentUser.user_metadata ? currentUser.user_metadata.school_id : null;
                    if (schoolId) {
                        query = query.eq('school_id', schoolId);
                    }
                }
                
                var result = await query;
                
                if (!result.error) {
                    approvedTeachers = result.data || [];
                }
            } catch (e) {
                console.error('加载已批准教师失败:', e);
            }
            
            var teacherToolsHtml = `
                <div style="padding: 25px; max-width: 1200px; margin: 0 auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; flex-wrap: wrap; gap: 15px;">
                        <h3 style="color: #4CAF50; margin: 0; display: flex; align-items: center;">
                            <span style="font-size: 2em; margin-right: 10px;">👨‍🏫</span>
                            ${getTranslation('teacherToolsTitle', '👨‍🏫 教师管理控制台')}
                        </h3>
                        <button id="close-teacher-tools" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 30px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                            ✕ ${getTranslation('close', '关闭')}
                        </button>
                    </div>
                    
                    <div style="display: flex; border-bottom: 2px solid #e0e0e0; margin-bottom: 25px; overflow-x: auto; gap: 10px;">
                        <button class="tab-btn active" data-tab="batch-register" id="tab-batch-register" style="padding: 12px 24px; background: none; border: none; border-bottom: 3px solid #4CAF50; font-weight: bold; color: #333; cursor: pointer; white-space: nowrap;">
                            📦 ${getTranslation('batchRegister', '批量注册学生账号')}
                        </button>
                        <button class="tab-btn" data-tab="teacher-approval" id="tab-teacher-approval" style="padding: 12px 24px; background: none; border: none; border-bottom: 3px solid transparent; font-weight: bold; color: #666; cursor: pointer; white-space: nowrap;">
                            ✅ ${getTranslation('teacherApproval', '教师审核')}
                            ${pendingApplications.length > 0 ? '<span style="background: #ff4444; color: white; padding: 2px 8px; border-radius: 12px; margin-left: 8px; font-size: 0.8em;">' + pendingApplications.length + '</span>' : ''}
                        </button>
                        <button class="tab-btn" data-tab="class-management" id="tab-class-management" style="padding: 12px 24px; background: none; border: none; border-bottom: 3px solid transparent; font-weight: bold; color: #666; cursor: pointer; white-space: nowrap;">
                            📚 ${getTranslation('classManagement', '班级管理')}
                        </button>
                    </div>
                    
                    <div id="batch-register-tab" class="tab-content" style="display: block;">
                        <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; margin-bottom: 20px; color: #333;">${getTranslation('batchRegister', '批量注册学生账号')}</h4>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 25px;">
                                <div>
                                    <label style="display: block; margin-bottom: 8px; color: #666; font-weight: bold;">${getTranslation('defaultPassword', '默认密码')}</label>
                                    <input id="default-password" type="text" placeholder="${getTranslation('defaultPasswordPlaceholder', '留空则使用 stu123456')}" value="stu123456" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px;">
                                </div>
                                <div>
                                    <label style="display: block; margin-bottom: 8px; color: #666; font-weight: bold;">${getTranslation('className', '班级名称')}</label>
                                    <input id="class-name" type="text" placeholder="${getTranslation('classNamePlaceholder', '例如：三年一班')}" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px;">
                                </div>
                            </div>
                            
                            <div style="display: flex; gap: 15px; margin-bottom: 25px; flex-wrap: wrap;">
                                <button id="download-template-btn" style="background: #6c757d; color: white; border: none; padding: 12px 25px; border-radius: 30px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                                    📥 ${getTranslation('downloadTemplate', '下载模板')}
                                </button>
                                <div style="position: relative; display: inline-block;">
                                    <input type="file" id="excel-file" accept=".csv,.xlsx,.xls" style="position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer;">
                                    <button id="upload-excel-btn" style="background: #4CAF50; color: white; border: none; padding: 12px 25px; border-radius: 30px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                                        📤 ${getTranslation('uploadExcel', '上传Excel/CSV')}
                                    </button>
                                </div>
                            </div>
                            
                            <div id="upload-progress" style="display: none; margin-bottom: 25px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="color: #666;">${getTranslation('uploadProgress', '上传进度')}</span>
                                    <span id="upload-status" style="color: #4CAF50;">0%</span>
                                </div>
                                <div style="background: #f0f0f0; border-radius: 10px; height: 10px; overflow: hidden;">
                                    <div id="upload-progress-bar" style="width: 0%; background: #4CAF50; height: 100%; transition: width 0.3s ease;"></div>
                                </div>
                            </div>
                            
                            <div id="upload-result" style="display: none; background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 25px;"></div>
                            
                            <div id="account-cards" style="display: none;">
                                <h4 style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                                    <span>${getTranslation('accountCards', '生成的账号卡片')}</span>
                                    <button id="print-cards-btn" style="background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 20px; font-size: 0.9em; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                                        🖨️ ${getTranslation('printCards', '打印卡片')}
                                    </button>
                                </h4>
                                <div id="account-cards-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px;"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="teacher-approval-tab" class="tab-content" style="display: none;">
                        <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; margin-bottom: 20px; color: #333; display: flex; align-items-center;">
                                <span>${getTranslation('teacherApproval', '教师审核')}</span>
                                <span style="background: #ff4444; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8em; margin-left: 15px;">${pendingApplications.length}</span>
                            </h4>
                            
                            ${pendingApplications.length === 0 ? `
                                <div style="text-align: center; padding: 40px 20px; background: #f8f9fa; border-radius: 12px;">
                                    <div style="font-size: 3em; margin-bottom: 15px; opacity: 0.5;">👨‍🏫</div>
                                    <p style="color: #666; margin: 0;">${getTranslation('noPendingApplications', '暂无待审核的教师申请')}</p>
                                </div>
                            ` : `
                                <div style="overflow-x: auto;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <thead>
                                            <tr style="background: #f8f9fa; border-bottom: 2px solid #e0e0e0;">
                                                <th style="padding: 15px; text-align: left; color: #666;">${getTranslation('applicant', '申请人')}</th>
                                                <th style="padding: 15px; text-align: left; color: #666;">${getTranslation('schoolName', '学校名称')}</th>
                                                <th style="padding: 15px; text-align: left; color: #666;">${getTranslation('teachingSubject', '教授科目')}</th>
                                                <th style="padding: 15px; text-align: left; color: #666;">${getTranslation('applyTime', '申请时间')}</th>
                                                <th style="padding: 15px; text-align: center; color: #666;">${getTranslation('status', '状态')}</th>
                                                <th style="padding: 15px; text-align: center; color: #666;">${getTranslation('approve', '批准')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${pendingApplications.map(function(app) {
                                                return `
                                                <tr style="border-bottom: 1px solid #f0f0f0;">
                                                    <td style="padding: 15px;">
                                                        <div style="font-weight: bold; color: #333;">${app.username || (app.email ? app.email.split('@')[0] : '')}</div>
                                                        <div style="color: #666; font-size: 0.85em;">${app.email}</div>
                                                    </td>
                                                    <td style="padding: 15px; color: #333;">${app.school}</td>
                                                    <td style="padding: 15px; color: #333;">${app.subject} (${app.grade})</td>
                                                    <td style="padding: 15px; color: #999; font-size: 0.9em;">${new Date(app.created_at).toLocaleDateString()}</td>
                                                    <td style="padding: 15px; text-align: center;">
                                                        <span style="background: #FF9800; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.85em;">${getTranslation('pending', '待审核')}</span>
                                                    </td>
                                                    <td style="padding: 15px; text-align: center;">
                                                        <button class="approve-teacher-btn" data-user-id="${app.user_id}" data-email="${app.email}" style="background: #4CAF50; color: white; border: none; padding: 6px 16px; border-radius: 20px; font-size: 0.85em; cursor: pointer; margin-right: 8px;">
                                                            ✓ ${getTranslation('approve', '批准')}
                                                        </button>
                                                        <button class="reject-teacher-btn" data-user-id="${app.user_id}" data-email="${app.email}" style="background: #ff4444; color: white; border: none; padding: 6px 16px; border-radius: 20px; font-size: 0.85em; cursor: pointer;">
                                                            ✗ ${getTranslation('reject', '拒绝')}
                                                        </button>
                                                    </td>
                                                </tr>
                                                `;
                                            }).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            `}
                            
                            <h4 style="margin-top: 40px; margin-bottom: 20px; color: #333;">${getTranslation('approvedTeachers', '已通过教师')} (${approvedTeachers.length})</h4>
                            
                            ${approvedTeachers.length === 0 ? `
                                <div style="text-align: center; padding: 30px 20px; background: #f8f9fa; border-radius: 12px;">
                                    <p style="color: #999; margin: 0;">${getTranslation('noApprovedTeachers', '暂无已批准的教师')}</p>
                                </div>
                            ` : `
                                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px;">
                                    ${approvedTeachers.slice(0, 5).map(function(app) {
                                        return `
                                        <div style="background: #f8f9fa; border-radius: 12px; padding: 15px; border-left: 4px solid #4CAF50;">
                                            <div style="font-weight: bold; color: #333; margin-bottom: 5px;">${app.username || (app.email ? app.email.split('@')[0] : '')}</div>
                                            <div style="color: #666; font-size: 0.85em; margin-bottom: 3px;">${app.email}</div>
                                            <div style="color: #666; font-size: 0.85em;">${app.school} · ${app.subject}</div>
                                            <div style="color: #999; font-size: 0.75em; margin-top: 8px;">✓ ${new Date(app.created_at).toLocaleDateString()}</div>
                                        </div>
                                        `;
                                    }).join('')}
                                    ${approvedTeachers.length > 5 ? `
                                        <div style="text-align: center; padding: 15px; color: #666;">
                                            ... 还有 ${approvedTeachers.length - 5} 名已批准教师
                                        </div>
                                    ` : ''}
                                </div>
                            `}
                        </div>
                    </div>
                    
                    <div id="class-management-tab" class="tab-content" style="display: none;">
                        <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; margin-bottom: 20px; color: #333;">${getTranslation('classManagement', '班级管理')}</h4>
                            <div style="text-align: center; padding: 40px 20px; background: #f8f9fa; border-radius: 12px;">
                                <div style="font-size: 3em; margin-bottom: 15px; opacity: 0.5;">📚</div>
                                <p style="color: #666; margin: 0;">${currentLanguage === 'zh' ? '班级管理功能开发中，敬请期待...' : 'Class management feature coming soon...'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            teacherToolsModal.innerHTML = teacherToolsHtml;
            teacherToolsModal.style.display = 'flex';
            
            var teacherTabs = teacherToolsModal.querySelectorAll('.tab-btn');
            for (var i = 0; i < teacherTabs.length; i++) {
                var tab = teacherTabs[i];
                tab.addEventListener('click', function() {
                    for (var j = 0; j < teacherTabs.length; j++) {
                        var t = teacherTabs[j];
                        t.classList.remove('active');
                        t.style.borderBottomColor = 'transparent';
                        t.style.color = '#666';
                    }
                    
                    this.classList.add('active');
                    this.style.borderBottomColor = '#4CAF50';
                    this.style.color = '#333';
                    
                    var tabId = this.id.replace('tab-', '');
                    var contents = teacherToolsModal.querySelectorAll('.tab-content');
                    for (var k = 0; k < contents.length; k++) {
                        contents[k].style.display = 'none';
                    }
                    var targetTab = document.getElementById(tabId + '-tab');
                    if (targetTab) targetTab.style.display = 'block';
                });
            }
            
            teacherToolsModal.querySelector('#close-teacher-tools').addEventListener('click', function() {
                teacherToolsModal.style.display = 'none';
            });
            
            var downloadBtn = teacherToolsModal.querySelector('#download-template-btn');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', downloadTemplate);
            }
            
            var uploadBtn = teacherToolsModal.querySelector('#upload-excel-btn');
            if (uploadBtn) {
                uploadBtn.addEventListener('click', function() {
                    document.getElementById('excel-file').click();
                });
            }
            
            var excelFile = document.getElementById('excel-file');
            if (excelFile) {
                excelFile.addEventListener('change', uploadExcelFile);
            }
            
            var printBtn = teacherToolsModal.querySelector('#print-cards-btn');
            if (printBtn) {
                printBtn.addEventListener('click', printAccountCards);
            }
            
            var approveBtns = teacherToolsModal.querySelectorAll('.approve-teacher-btn');
            for (var i = 0; i < approveBtns.length; i++) {
                approveBtns[i].addEventListener('click', async function(e) {
                    var userId = e.currentTarget.dataset.userId;
                    var email = e.currentTarget.dataset.email;
                    await approveTeacherApplication(userId, email);
                    showTeacherTools();
                });
            }
            
            var rejectBtns = teacherToolsModal.querySelectorAll('.reject-teacher-btn');
            for (var i = 0; i < rejectBtns.length; i++) {
                rejectBtns[i].addEventListener('click', async function(e) {
                    var userId = e.currentTarget.dataset.userId;
                    var email = e.currentTarget.dataset.email;
                    await rejectTeacherApplication(userId, email);
                    showTeacherTools();
                });
            }
            
        } catch (error) {
            console.error('显示教师工具失败:', error);
            showMessage(currentLanguage === 'zh' ? '加载教师工具失败' : 'Failed to load teacher tools', 'error');
        }
    }
    
    // ==================== 修复版管理员工具 ====================
    async function showAdminTools() {
        try {
            if (!currentUser) {
                showMessage(getTranslation('needLogin', '请先登录后再申请教师账号'), 'error');
                showAuthModal();
                return;
            }
            
            if (!isSuperAdmin) {
                showMessage(
                    currentLanguage === 'zh' 
                        ? '只有超级管理员可以访问此功能' 
                        : 'Only super administrators can access this feature',
                    'error'
                );
                return;
            }
            
            if (offlineMode) {
                showMessage(
                    currentLanguage === 'zh' 
                        ? '📴 离线模式无法使用管理员工具' 
                        : '📴 Admin tools unavailable in offline mode',
                    'warning'
                );
                return;
            }
            
            if (!isSupabaseReady || !supabase) {
                showMessage(
                    currentLanguage === 'zh' ? '云端服务未就绪' : 'Cloud service not ready',
                    'error'
                );
                return;
            }
            
            var adminToolsModal = document.getElementById('admin-tools-modal');
            if (!adminToolsModal) return;
            
            var systemStats = {
                totalUsers: 0,
                totalTeachers: 0,
                totalStudents: 0,
                totalGames: 0,
                totalQuestions: 0,
                avgAccuracy: 0
            };
            
            try {
                var countResult = await supabase
                    .from('game_scores')
                    .select('user_id', { count: 'exact', head: true });
                systemStats.totalUsers = countResult.count || 0;
                
                var gameStatsResult = await supabase
                    .from('game_scores')
                    .select('score, questions_completed, correct_count, total_attempts');
                
                if (gameStatsResult.data) {
                    var gameStats = gameStatsResult.data;
                    systemStats.totalGames = gameStats.length;
                    
                    var totalQuestions = 0;
                    var totalCorrect = 0;
                    var totalAttempts = 0;
                    
                    for (var i = 0; i < gameStats.length; i++) {
                        totalQuestions += gameStats[i].questions_completed || 0;
                        totalCorrect += gameStats[i].correct_count || 0;
                        totalAttempts += gameStats[i].total_attempts || 0;
                    }
                    
                    systemStats.totalQuestions = totalQuestions;
                    systemStats.avgAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
                }
            } catch (e) {
                console.error('加载系统统计失败:', e);
            }
            
            var adminToolsHtml = `
                <div style="padding: 25px; max-width: 1200px; margin: 0 auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; flex-wrap: wrap; gap: 15px;">
                        <h3 style="color: #4CAF50; margin: 0; display: flex; align-items: center;">
                            <span style="font-size: 2em; margin-right: 10px;">👑</span>
                            ${getTranslation('adminToolsTitle', '👑 系统管理控制台')}
                        </h3>
                        <button id="close-admin-tools" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 30px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                            ✕ ${getTranslation('close', '关闭')}
                        </button>
                    </div>
                    
                    <div style="display: flex; border-bottom: 2px solid #e0e0e0; margin-bottom: 25px; overflow-x: auto; gap: 10px;">
                        <button class="tab-btn active" data-tab="system-stats" id="tab-system-stats" style="padding: 12px 24px; background: none; border: none; border-bottom: 3px solid #4CAF50; font-weight: bold; color: #333; cursor: pointer; white-space: nowrap;">
                            📊 ${getTranslation('systemStats', '系统统计')}
                        </button>
                        <button class="tab-btn" data-tab="teacher-management" id="tab-teacher-management" style="padding: 12px 24px; background: none; border: none; border-bottom: 3px solid transparent; font-weight: bold; color: #666; cursor: pointer; white-space: nowrap;">
                            👨‍🏫 ${getTranslation('teacherManagement', '教师管理')}
                        </button>
                        <button class="tab-btn" data-tab="system-logs" id="tab-system-logs" style="padding: 12px 24px; background: none; border: none; border-bottom: 3px solid transparent; font-weight: bold; color: #666; cursor: pointer; white-space: nowrap;">
                            📋 ${getTranslation('systemLogs', '系统日志')}
                        </button>
                        <button class="tab-btn" data-tab="data-management" id="tab-data-management" style="padding: 12px 24px; background: none; border: none; border-bottom: 3px solid transparent; font-weight: bold; color: #666; cursor: pointer; white-space: nowrap;">
                            💾 ${getTranslation('dataManagement', '数据管理')}
                        </button>
                        <button class="tab-btn" data-tab="system-settings" id="tab-system-settings" style="padding: 12px 24px; background: none; border: none; border-bottom: 3px solid transparent; font-weight: bold; color: #666; cursor: pointer; white-space: nowrap;">
                            ⚙️ ${getTranslation('systemSettings', '系统设置')}
                        </button>
                    </div>
                    
                    <div id="system-stats-tab" class="tab-content" style="display: block;">
                        <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; margin-bottom: 25px; color: #333;">${getTranslation('systemStats', '系统统计')}</h4>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 15px; text-align: center;">
                                    <div style="font-size: 2em; margin-bottom: 10px;">👥</div>
                                    <div style="font-size: 0.9em; opacity: 0.9;">${getTranslation('totalUsers', '总用户数')}</div>
                                    <div style="font-size: 2.5em; font-weight: bold;">${systemStats.totalUsers}</div>
                                </div>
                                <div style="background: linear-gradient(135deg, #6b8cff 0%, #4a6cf7 100%); color: white; padding: 20px; border-radius: 15px; text-align: center;">
                                    <div style="font-size: 2em; margin-bottom: 10px;">🎮</div>
                                    <div style="font-size: 0.9em; opacity: 0.9;">${getTranslation('totalGames', '总游戏局数')}</div>
                                    <div style="font-size: 2.5em; font-weight: bold;">${systemStats.totalGames}</div>
                                </div>
                                <div style="background: linear-gradient(135deg, #ff8c5a 0%, #ff6b4a 100%); color: white; padding: 20px; border-radius: 15px; text-align: center;">
                                    <div style="font-size: 2em; margin-bottom: 10px;">❓</div>
                                    <div style="font-size: 0.9em; opacity: 0.9;">${getTranslation('totalQuestions', '总答题数')}</div>
                                    <div style="font-size: 2.5em; font-weight: bold;">${systemStats.totalQuestions}</div>
                                </div>
                                <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 20px; border-radius: 15px; text-align: center;">
                                    <div style="font-size: 2em; margin-bottom: 10px;">🎯</div>
                                    <div style="font-size: 0.9em; opacity: 0.9;">${getTranslation('avgAccuracy', '平均正确率')}</div>
                                    <div style="font-size: 2.5em; font-weight: bold;">${systemStats.avgAccuracy}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div id="teacher-management-tab" class="tab-content" style="display: none;">
                        <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; margin-bottom: 25px; color: #333;">${getTranslation('teacherManagement', '教师管理')}</h4>
                            <div style="text-align: center; padding: 40px 20px; background: #f8f9fa; border-radius: 12px;">
                                <div style="font-size: 3em; margin-bottom: 15px; opacity: 0.5;">👨‍🏫</div>
                                <p style="color: #666; margin: 0;">${currentLanguage === 'zh' ? '教师管理功能开发中，敬请期待...' : 'Teacher management feature coming soon...'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div id="system-logs-tab" class="tab-content" style="display: none;">
                        <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; margin-bottom: 25px; color: #333;">${getTranslation('systemLogs', '系统日志')}</h4>
                            <div style="text-align: center; padding: 40px 20px; background: #f8f9fa; border-radius: 12px;">
                                <div style="font-size: 3em; margin-bottom: 15px; opacity: 0.5;">📋</div>
                                <p style="color: #666; margin: 0;">${currentLanguage === 'zh' ? '系统日志功能开发中，敬请期待...' : 'System logs feature coming soon...'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div id="data-management-tab" class="tab-content" style="display: none;">
                        <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; margin-bottom: 25px; color: #333;">${getTranslation('dataManagement', '数据管理')}</h4>
                            <div style="text-align: center; padding: 40px 20px; background: #f8f9fa; border-radius: 12px;">
                                <div style="font-size: 3em; margin-bottom: 15px; opacity: 0.5;">💾</div>
                                <p style="color: #666; margin: 0;">${currentLanguage === 'zh' ? '数据管理功能开发中，敬请期待...' : 'Data management feature coming soon...'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div id="system-settings-tab" class="tab-content" style="display: none;">
                        <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; margin-bottom: 25px; color: #333;">${getTranslation('systemSettings', '系统设置')}</h4>
                            <div style="text-align: center; padding: 40px 20px; background: #f8f9fa; border-radius: 12px;">
                                <div style="font-size: 3em; margin-bottom: 15px; opacity: 0.5;">⚙️</div>
                                <p style="color: #666; margin: 0;">${currentLanguage === 'zh' ? '系统设置功能开发中，敬请期待...' : 'System settings feature coming soon...'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            adminToolsModal.innerHTML = adminToolsHtml;
            adminToolsModal.style.display = 'flex';
            
            var adminTabs = adminToolsModal.querySelectorAll('.tab-btn');
            for (var i = 0; i < adminTabs.length; i++) {
                var tab = adminTabs[i];
                tab.addEventListener('click', function() {
                    for (var j = 0; j < adminTabs.length; j++) {
                        var t = adminTabs[j];
                        t.classList.remove('active');
                        t.style.borderBottomColor = 'transparent';
                        t.style.color = '#666';
                    }
                    
                    this.classList.add('active');
                    this.style.borderBottomColor = '#4CAF50';
                    this.style.color = '#333';
                    
                    var tabId = this.id.replace('tab-', '');
                    var contents = adminToolsModal.querySelectorAll('.tab-content');
                    for (var k = 0; k < contents.length; k++) {
                        contents[k].style.display = 'none';
                    }
                    var targetTab = document.getElementById(tabId + '-tab');
                    if (targetTab) targetTab.style.display = 'block';
                });
            }
            
            adminToolsModal.querySelector('#close-admin-tools').addEventListener('click', function() {
                adminToolsModal.style.display = 'none';
            });
            
        } catch (error) {
            console.error('显示管理员工具失败:', error);
            showMessage(currentLanguage === 'zh' ? '加载管理员工具失败' : 'Failed to load admin tools', 'error');
        }
    }
    
    // ==================== 修复版批准教师申请 ====================
    async function approveTeacherApplication(userId, email) {
        try {
            if (!isSuperAdmin && !isSchoolAdmin) {
                showMessage(
                    currentLanguage === 'zh' ? '只有超级管理员或学校管理员可以批准教师申请' : 'Only super administrators or school administrators can approve teacher applications',
                    'error'
                );
                return;
            }
            
            if (offlineMode) {
                showMessage(
                    currentLanguage === 'zh' ? '离线模式无法批准教师申请' : 'Cannot approve applications in offline mode',
                    'warning'
                );
                return;
            }
            
            if (!isSupabaseReady || !supabase) {
                showMessage(
                    currentLanguage === 'zh' ? '云端服务未就绪' : 'Cloud service not ready',
                    'error'
                );
                return;
            }
            
            var result = await supabase
                .from('teacher_applications')
                .update({
                    status: 'approved',
                    reviewed_at: new Date().toISOString(),
                    reviewed_by: currentUser.id,
                    admin_notes: '已批准（需手动更新用户角色）'
                })
                .eq('user_id', userId)
                .eq('status', 'pending');
            
            if (result.error) {
                console.error('更新申请状态失败:', result.error);
                showMessage(
                    currentLanguage === 'zh' ? '更新申请状态失败' : 'Failed to update application status',
                    'error'
                );
                return;
            }
            
            showMessage(
                currentLanguage === 'zh' 
                    ? '✅ 已标记申请为"已批准"。请登录 Supabase 后台，找到用户 ' + email + '，将 user_metadata.role 改为 "teacher"' 
                    : '✅ Application marked as approved. Please login to Supabase dashboard, find user ' + email + ', and set user_metadata.role to "teacher"',
                'success',
                8000
            );
            
        } catch (error) {
            console.error('批准教师申请失败:', error);
            showMessage(
                currentLanguage === 'zh' ? '批准教师申请失败' : 'Failed to approve teacher application',
                'error'
            );
        }
    }
    
    // ==================== 修复版拒绝教师申请 ====================
    async function rejectTeacherApplication(userId, email) {
        try {
            if (!isSuperAdmin && !isSchoolAdmin) {
                showMessage(
                    currentLanguage === 'zh' ? '只有超级管理员或学校管理员可以拒绝教师申请' : 'Only super administrators or school administrators can reject teacher applications',
                    'error'
                );
                return;
            }
            
            if (offlineMode) {
                showMessage(
                    currentLanguage === 'zh' ? '离线模式无法拒绝教师申请' : 'Cannot reject applications in offline mode',
                    'warning'
                );
                return;
            }
            
            if (!isSupabaseReady || !supabase) {
                showMessage(
                    currentLanguage === 'zh' ? '云端服务未就绪' : 'Cloud service not ready',
                    'error'
                );
                return;
            }
            
            var result = await supabase
                .from('teacher_applications')
                .update({
                    status: 'rejected',
                    reviewed_at: new Date().toISOString(),
                    reviewed_by: currentUser.id,
                    admin_notes: '已拒绝'
                })
                .eq('user_id', userId)
                .eq('status', 'pending');
            
            if (result.error) {
                console.error('更新申请状态失败:', result.error);
                showMessage(
                    currentLanguage === 'zh' ? '拒绝失败：' + result.error.message : 'Rejection failed: ' + result.error.message,
                    'error'
                );
                return;
            }
            
            showMessage(
                currentLanguage === 'zh' ? '❌ 已拒绝教师申请: ' + email : '❌ Rejected teacher application: ' + email,
                'success'
            );
            
        } catch (error) {
            console.error('拒绝教师申请失败:', error);
            showMessage(
                currentLanguage === 'zh' ? '拒绝教师申请失败' : 'Failed to reject teacher application',
                'error'
            );
        }
    }
    
    // ==================== 教师工具辅助函数 ====================
    async function downloadTemplate() {
        try {
            var csvContent = "email,姓名,班级,备注\n" +
                "student1@example.com,张三,三年一班,数学课代表\n" +
                "student2@example.com,李四,三年一班,副班长\n" +
                "student3@example.com,王五,三年二班,学习委员";
            
            var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            var link = document.createElement('a');
            var url = URL.createObjectURL(blob);
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
    
    async function uploadExcelFile(e) {
        try {
            var file = e.target.files[0];
            if (!file) return;
            
            var uploadProgress = document.getElementById('upload-progress');
            var uploadProgressBar = document.getElementById('upload-progress-bar');
            var uploadStatus = document.getElementById('upload-status');
            var uploadResult = document.getElementById('upload-result');
            var accountCards = document.getElementById('account-cards');
            var accountCardsContainer = document.getElementById('account-cards-container');
            
            if (!uploadProgress || !uploadProgressBar || !uploadStatus) {
                console.error('上传进度元素不存在');
                showMessage(
                    currentLanguage === 'zh' ? '界面元素加载失败' : 'UI elements not loaded',
                    'error'
                );
                return;
            }
            
            var defaultPasswordInput = document.getElementById('default-password');
            var defaultPassword = defaultPasswordInput ? defaultPasswordInput.value.trim() : 'stu123456';
            
            var classNameInput = document.getElementById('class-name');
            var className = classNameInput ? classNameInput.value.trim() : '未命名班级';
            
            if (defaultPassword.length < 6) {
                showMessage(currentLanguage === 'zh' ? '默认密码至少需要6位' : 'Default password must be at least 6 characters', 'error');
                return;
            }
            
            if (uploadProgress) uploadProgress.style.display = 'block';
            if (uploadProgressBar) uploadProgressBar.style.width = '0%';
            if (uploadStatus) uploadStatus.textContent = currentLanguage === 'zh' ? '正在读取文件...' : 'Reading file...';
            if (uploadResult) uploadResult.style.display = 'none';
            if (accountCards) accountCards.style.display = 'none';
            if (accountCardsContainer) accountCardsContainer.innerHTML = '';
            
            var reader = new FileReader();
            reader.onload = async function(e) {
                try {
                    var csvContent = e.target.result;
                    var rows = csvContent.split('\n');
                    
                    if (rows.length < 2) {
                        showMessage(currentLanguage === 'zh' ? 'CSV文件格式不正确' : 'Invalid CSV file format', 'error');
                        return;
                    }
                    
                    var students = [];
                    var errors = [];
                    
                    for (var i = 1; i < rows.length; i++) {
                        if (!rows[i].trim()) continue;
                        
                        var columns = rows[i].split(',');
                        if (columns.length >= 2) {
                            var email = columns[0].trim();
                            var name = columns[1].trim();
                            var studentClass = columns.length > 2 ? columns[2].trim() : className;
                            var note = columns.length > 3 ? columns[3].trim() : '';
                            
                            if (email && email.includes('@')) {
                                students.push({
                                    email: email,
                                    name: name || email.split('@')[0],
                                    class: studentClass,
                                    note: note,
                                    password: defaultPassword
                                });
                            } else {
                                errors.push('第' + (i+1) + '行: 邮箱格式不正确 - ' + email);
                            }
                        }
                        
                        if (uploadProgressBar) {
                            uploadProgressBar.style.width = ((i / rows.length) * 50) + '%';
                        }
                    }
                    
                    if (students.length === 0) {
                        showMessage(currentLanguage === 'zh' ? '没有找到有效的学生数据' : 'No valid student data found', 'error');
                        return;
                    }
                    
                    if (uploadStatus) {
                        uploadStatus.textContent = currentLanguage === 'zh' 
                            ? '找到 ' + students.length + ' 名学生，正在注册...' 
                            : 'Found ' + students.length + ' students, registering...';
                    }
                    
                    var results = [];
                    var successCount = 0;
                    var failCount = 0;
                    
                    for (var i = 0; i < students.length; i++) {
                        var student = students[i];
                        
                        try {
                            var result = await supabase.auth.admin.createUser({
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
                            
                            if (result.error) {
                                results.push({
                                    email: student.email,
                                    status: '失败',
                                    message: result.error.message,
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
                            uploadProgressBar.style.width = (50 + (i / students.length) * 50) + '%';
                        }
                        if (uploadStatus) {
                            uploadStatus.textContent = currentLanguage === 'zh' 
                                ? '正在注册 ' + (i+1) + '/' + students.length + '...' 
                                : 'Registering ' + (i+1) + '/' + students.length + '...';
                        }
                        
                        await new Promise(function(resolve) { setTimeout(resolve, 100); });
                    }
                    
                    if (uploadResult) {
                        uploadResult.style.display = 'block';
                        uploadResult.innerHTML = `
                            <h4>${currentLanguage === 'zh' ? '批量注册结果' : 'Batch Registration Results'}</h4>
                            <p>${currentLanguage === 'zh' ? '总计: ' + students.length + ' 名学生' : 'Total: ' + students.length + ' students'}</p>
                            <p style="color: #4CAF50;">${currentLanguage === 'zh' ? '成功: ' + successCount : 'Success: ' + successCount}</p>
                            <p style="color: #ff4444;">${currentLanguage === 'zh' ? '失败: ' + failCount : 'Failed: ' + failCount}</p>
                            ${errors.length > 0 ? '<p style="color: #FF9800;">' + (currentLanguage === 'zh' ? '解析错误: ' + errors.length : 'Parse errors: ' + errors.length) + '</p>' : ''}
                        `;
                    }
                    
                    if (uploadStatus) {
                        uploadStatus.textContent = currentLanguage === 'zh' 
                            ? '完成！成功: ' + successCount + ', 失败: ' + failCount 
                            : 'Complete! Success: ' + successCount + ', Failed: ' + failCount;
                    }
                    
                    var successfulStudents = results.filter(function(r) { return r.status === '成功'; });
                    if (successfulStudents.length > 0 && accountCards && accountCardsContainer) {
                        accountCardsContainer.innerHTML = '';
                        for (var j = 0; j < successfulStudents.length; j++) {
                            var student = successfulStudents[j];
                            var card = document.createElement('div');
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
                        }
                        accountCards.style.display = 'block';
                    }
                    
                    if (successCount > 0) {
                        showMessage(
                            currentLanguage === 'zh' 
                                ? '成功注册 ' + successCount + ' 名学生账号' 
                                : 'Successfully registered ' + successCount + ' student accounts',
                            'success'
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
            
            reader.readAsText(file);
            e.target.value = '';
            
        } catch (error) {
            console.error('上传文件失败:', error);
            showMessage(currentLanguage === 'zh' ? '上传文件失败' : 'Failed to upload file', 'error');
        }
    }
    
    // ==================== 修复版打印账号卡片 ====================
    function printAccountCards() {
        try {
            var container = document.getElementById('account-cards-container');
            if (!container) {
                showMessage(
                    currentLanguage === 'zh' ? '没有可打印的账号卡片' : 'No account cards to print',
                    'error'
                );
                return;
            }
            
            var printContent = container.innerHTML;
            if (!printContent.trim()) {
                showMessage(
                    currentLanguage === 'zh' ? '没有可打印的内容' : 'No content to print',
                    'error'
                );
                return;
            }
            
            var originalContent = document.body.innerHTML;
            
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
    
    // ==================== 云端同步核心功能 ====================
    function initCloudSync() {
        try {
            var savedSyncState = localStorage.getItem('mathGameSyncState');
            if (savedSyncState) {
                try {
                    syncState = JSON.parse(savedSyncState);
                } catch (e) {
                    console.warn('解析同步状态失败:', e);
                }
            }
            startAutoSync();
            console.log('云端同步初始化完成', syncState);
        } catch (error) {
            console.error('初始化云端同步失败:', error);
        }
    }
    
    function startAutoSync() {
        if (autoSyncTimer) {
            clearInterval(autoSyncTimer);
        }
        
        autoSyncTimer = setInterval(function() {
            if (currentUser && isSupabaseReady && !syncState.isSyncing && !offlineMode) {
                console.log('自动同步触发');
                performFullSync();
            }
        }, CONFIG.SYNC_INTERVAL);
    }
    
    function stopAutoSync() {
        if (autoSyncTimer) {
            clearInterval(autoSyncTimer);
            autoSyncTimer = null;
        }
    }
    
    function saveSyncState() {
        try {
            syncState.lastSyncTime = new Date().toISOString();
            localStorage.setItem('mathGameSyncState', JSON.stringify(syncState));
        } catch (error) {
            console.error('保存同步状态失败:', error);
        }
    }
    
    function addSyncHistory(type, status, details) {
        if (!details) details = '';
        
        syncState.syncHistory.unshift({
            timestamp: new Date().toISOString(),
            type: type,
            status: status,
            details: details
        });
        
        if (syncState.syncHistory.length > 20) {
            syncState.syncHistory = syncState.syncHistory.slice(0, 20);
        }
        
        saveSyncState();
    }
    
    async function performFullSync() {
        if (!currentUser) return false;
        if (!isSupabaseReady || !supabase) return false;
        if (syncState.isSyncing) return false;
        if (offlineMode) return false;
        
        try {
            syncState.isSyncing = true;
            
            await syncAchievementsToCloud();
            await syncAllWrongQuestionsToCloud();
            await syncGameScoresToCloud();
            
            await loadAchievementsFromCloud();
            await loadWrongQuestionsFromCloud();
            await loadUserStats();
            
            syncState.isSyncing = false;
            syncState.pendingChanges = false;
            saveSyncState();
            
            addSyncHistory('full', 'success', '所有数据同步成功');
            return true;
        } catch (error) {
            console.error('完整同步失败:', error);
            syncState.isSyncing = false;
            addSyncHistory('full', 'failed', error.message);
            return false;
        }
    }
    
    async function syncGameScoresToCloud() {
        try {
            if (!currentUser || !supabase) return false;
            
            var localScores = localStorage.getItem('mathGameScores_' + currentUser.id + '_pending');
            if (localScores) {
                var pendingScores = JSON.parse(localScores);
                for (var i = 0; i < pendingScores.length; i++) {
                    await supabase.from('game_scores').insert([pendingScores[i]]);
                }
                localStorage.removeItem('mathGameScores_' + currentUser.id + '_pending');
            }
            return true;
        } catch (error) {
            console.error('同步游戏成绩失败:', error);
            return false;
        }
    }
    
    // ==================== 成就系统核心函数 ====================
    function loadAchievements() {
        try {
            var savedStates = localStorage.getItem('mathGameAchievementStates');
            if (savedStates) {
                var parsed = JSON.parse(savedStates);
                achievementStates = new Map(Object.entries(parsed));
            } else {
                for (var i = 0; i < LADDER_ACHIEVEMENTS.length; i++) {
                    var ach = LADDER_ACHIEVEMENTS[i];
                    achievementStates.set(ach.id, {
                        unlocked: false,
                        progress: 0,
                        unlockedAt: null
                    });
                }
            }
            
            var savedStats = localStorage.getItem('mathGamePlayerStats');
            if (savedStats) {
                playerStats = JSON.parse(savedStats);
            }
            
            if (currentUser && isSupabaseReady && !offlineMode) {
                setTimeout(function() {
                    loadAchievementsFromCloud();
                }, 1000);
            }
        } catch (error) {
            console.error('加载成就失败:', error);
            for (var i = 0; i < LADDER_ACHIEVEMENTS.length; i++) {
                var ach = LADDER_ACHIEVEMENTS[i];
                achievementStates.set(ach.id, {
                    unlocked: false,
                    progress: 0,
                    unlockedAt: null
                });
            }
        }
    }
    
    function saveAchievements() {
        try {
            var statesObject = {};
            achievementStates.forEach(function(value, key) {
                statesObject[key] = value;
            });
            
            localStorage.setItem('mathGameAchievementStates', JSON.stringify(statesObject));
            localStorage.setItem('mathGamePlayerStats', JSON.stringify(playerStats));
            
            syncState.pendingChanges = true;
            saveSyncState();
            
            if (currentUser && isSupabaseReady && !offlineMode) {
                setTimeout(function() {
                    syncAchievementsToCloud();
                }, 100);
            }
        } catch (error) {
            console.error('保存成就失败:', error);
        }
    }
    
    async function syncAchievementsToCloud() {
        try {
            if (!currentUser || !isSupabaseReady || !supabase) return false;
            
            var statesObject = {};
            achievementStates.forEach(function(value, key) {
                statesObject[key] = value;
            });
            
            var achievementData = {
                user_id: currentUser.id,
                email: currentUser.email,
                achievement_states: statesObject,
                player_stats: playerStats,
                updated_at: new Date().toISOString(),
                version: syncState.dataVersion
            };
            
            var existingResult = await supabase
                .from('player_achievements')
                .select('id')
                .eq('user_id', currentUser.id)
                .limit(1);
            
            if (existingResult.data && existingResult.data.length > 0) {
                await supabase
                    .from('player_achievements')
                    .update(achievementData)
                    .eq('user_id', currentUser.id);
            } else {
                await supabase
                    .from('player_achievements')
                    .insert([achievementData]);
            }
            
            addSyncHistory('achievements', 'success', '成就数据同步成功');
            return true;
        } catch (error) {
            console.error('同步成就到云端失败:', error);
            addSyncHistory('achievements', 'failed', error.message);
            return false;
        }
    }
    
    async function loadAchievementsFromCloud() {
        try {
            if (!currentUser || !isSupabaseReady || !supabase) return false;
            
            var result = await supabase
                .from('player_achievements')
                .select('*')
                .eq('user_id', currentUser.id)
                .limit(1);
            
            if (result.error) {
                console.error('从云端加载成就失败:', result.error);
                return false;
            }
            
            if (result.data && result.data.length > 0) {
                var cloudData = result.data[0];
                
                if (cloudData.achievement_states) {
                    var entries = Object.entries(cloudData.achievement_states);
                    for (var i = 0; i < entries.length; i++) {
                        var key = entries[i][0];
                        var value = entries[i][1];
                        
                        if (achievementStates.has(key)) {
                            var local = achievementStates.get(key);
                            if (value.unlocked && !local.unlocked) {
                                achievementStates.set(key, value);
                            } else if (value.progress > local.progress) {
                                local.progress = value.progress;
                                achievementStates.set(key, local);
                            }
                        }
                    }
                }
                
                if (cloudData.player_stats) {
                    var cloudStats = cloudData.player_stats;
                    playerStats.gamesCompleted = Math.max(playerStats.gamesCompleted, cloudStats.gamesCompleted || 0);
                    playerStats.bestScore = Math.max(playerStats.bestScore, cloudStats.bestScore || 0);
                    playerStats.bestAccuracy = Math.max(playerStats.bestAccuracy, cloudStats.bestAccuracy || 0);
                    playerStats.fastestAnswer = Math.min(playerStats.fastestAnswer, cloudStats.fastestAnswer || 999);
                    playerStats.totalQuestions = Math.max(playerStats.totalQuestions, cloudStats.totalQuestions || 0);
                    playerStats.totalCorrect = Math.max(playerStats.totalCorrect, cloudStats.totalCorrect || 0);
                    playerStats.totalAttempts = Math.max(playerStats.totalAttempts, cloudStats.totalAttempts || 0);
                }
                
                updateAchievementCounts();
                saveAchievements();
                addSyncHistory('achievements', 'success', '从云端加载成就成功');
                return true;
            }
            return false;
        } catch (error) {
            console.error('从云端加载成就异常:', error);
            addSyncHistory('achievements', 'failed', error.message);
            return false;
        }
    }
    
    function updatePlayerStats() {
        playerStats.gamesCompleted++;
        
        if (score > playerStats.bestScore) {
            playerStats.bestScore = score;
        }
        
        var currentAccuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;
        if (currentAccuracy > playerStats.bestAccuracy) {
            playerStats.bestAccuracy = currentAccuracy;
        }
        
        if (currentFastestAnswer < playerStats.fastestAnswer) {
            playerStats.fastestAnswer = currentFastestAnswer;
        }
        
        playerStats.totalQuestions += completedQuestions;
        playerStats.totalCorrect += correctCount;
        playerStats.totalAttempts += totalAttempts;
    }
    
    function updateAchievementCounts() {
        playerStats.bronzeCount = 0;
        playerStats.silverCount = 0;
        playerStats.goldCount = 0;
        playerStats.platinumCount = 0;
        
        for (var i = 0; i < LADDER_ACHIEVEMENTS.length; i++) {
            var ach = LADDER_ACHIEVEMENTS[i];
            var state = achievementStates.get(ach.id);
            if (state && state.unlocked) {
                switch(ach.level) {
                    case 1: playerStats.bronzeCount++; break;
                    case 2: playerStats.silverCount++; break;
                    case 3: playerStats.goldCount++; break;
                    case 4: playerStats.platinumCount++; break;
                }
            }
        }
    }
    
    function checkAchievementRequirement(achievement) {
        switch(achievement.requirement.type) {
            case 'games_completed': return playerStats.gamesCompleted >= achievement.requirement.value;
            case 'best_score': return playerStats.bestScore >= achievement.requirement.value;
            case 'best_accuracy': return playerStats.bestAccuracy >= achievement.requirement.value;
            case 'fastest_answer': return playerStats.fastestAnswer <= achievement.requirement.value;
            case 'total_questions': return playerStats.totalQuestions >= achievement.requirement.value;
            case 'bronze_count': return playerStats.bronzeCount >= achievement.requirement.value;
            case 'silver_count': return playerStats.silverCount >= achievement.requirement.value;
            case 'gold_count': return playerStats.goldCount >= achievement.requirement.value;
            case 'platinum_count': return playerStats.platinumCount >= achievement.requirement.value;
            default: return false;
        }
    }
    
    function getAchievementProgress(achievement) {
        switch(achievement.requirement.type) {
            case 'games_completed': return Math.min(playerStats.gamesCompleted, achievement.requirement.value);
            case 'best_score': return Math.min(playerStats.bestScore, achievement.requirement.value);
            case 'best_accuracy': return Math.min(playerStats.bestAccuracy, achievement.requirement.value);
            case 'fastest_answer': return playerStats.fastestAnswer <= achievement.requirement.value ? achievement.requirement.value : Math.max(0, achievement.requirement.value - (playerStats.fastestAnswer - achievement.requirement.value));
            case 'total_questions': return Math.min(playerStats.totalQuestions, achievement.requirement.value);
            case 'bronze_count': return Math.min(playerStats.bronzeCount, achievement.requirement.value);
            case 'silver_count': return Math.min(playerStats.silverCount, achievement.requirement.value);
            case 'gold_count': return Math.min(playerStats.goldCount, achievement.requirement.value);
            case 'platinum_count': return Math.min(playerStats.platinumCount, achievement.requirement.value);
            default: return 0;
        }
    }
    
    function checkAndUnlockAchievements() {
        var unlockedCount = 0;
        
        for (var i = 0; i < LADDER_ACHIEVEMENTS.length; i++) {
            var ach = LADDER_ACHIEVEMENTS[i];
            var state = achievementStates.get(ach.id);
            if (!state || !state.unlocked) {
                var isUnlocked = checkAchievementRequirement(ach);
                if (isUnlocked) {
                    achievementStates.set(ach.id, {
                        unlocked: true,
                        progress: 100,
                        unlockedAt: new Date().toISOString()
                    });
                    
                    showAchievementUnlock(ach);
                    unlockedCount++;
                } else {
                    var progress = getAchievementProgress(ach);
                    var total = ach.requirement.value;
                    var progressPercent = Math.round((progress / total) * 100);
                    
                    if (state) {
                        state.progress = Math.min(progressPercent, 100);
                        achievementStates.set(ach.id, state);
                    }
                }
            }
        }
        
        if (unlockedCount > 0) {
            updateAchievementCounts();
            saveAchievements();
            setTimeout(function() {
                checkAndUnlockAchievements();
            }, 100);
        }
    }
    
    function showAchievementUnlock(achievement) {
        var unlockDiv = document.createElement('div');
        unlockDiv.className = 'achievement-unlock';
        unlockDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: clamp(20px, 5vw, 30px);
            border-radius: 20px;
            z-index: 9999;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            animation: achievementPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            text-align: center;
            width: 90%;
            max-width: 400px;
        `;
        
        var nameText = getTranslation(achievement.nameKey, '');
        var descText = getTranslation(achievement.descKey, '');
        var levelText = getTranslation('level', '等级');
        var unlockedText = getTranslation('unlocked', '已解锁');
        
        unlockDiv.innerHTML = `
            <div style="font-size: clamp(3em, 10vw, 4em); margin-bottom: 15px;">${achievement.icon}</div>
            <div style="font-size: clamp(1.5em, 5vw, 1.8em); font-weight: bold; margin-bottom: 10px;">🎉 ${unlockedText}!</div>
            <div style="font-size: clamp(1.2em, 4vw, 1.4em); font-weight: bold; margin-bottom: 5px;">${nameText}</div>
            <div style="font-size: clamp(0.9em, 3vw, 1em); opacity: 0.9; margin-bottom: 15px;">${descText}</div>
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap;">
                <span style="background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px; font-size: clamp(0.8em, 3vw, 0.9em);">${LEVEL_ICONS[achievement.level]} ${levelText} ${achievement.level}</span>
                <span style="background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px; font-size: clamp(0.8em, 3vw, 0.9em);">+${achievement.reward.score} ${currentLanguage === 'zh' ? '分' : 'pts'}</span>
            </div>
        `;
        
        document.body.appendChild(unlockDiv);
        
        var style = document.createElement('style');
        style.textContent = `
            @keyframes achievementPop {
                0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
            @keyframes slideDown {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(function() {
            unlockDiv.style.opacity = '0';
            unlockDiv.style.transform = 'translate(-50%, -50%) scale(0.8)';
            unlockDiv.style.transition = 'all 0.3s ease';
            setTimeout(function() {
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
            
            var container = document.getElementById('achievements-grid');
            var achievementsModal = document.getElementById('achievements-modal');
            var achievementsTitle = document.getElementById('achievements-title');
            
            if (!container || !achievementsModal) return;
            
            if (achievementsTitle) achievementsTitle.textContent = getTranslation('achievementsTitle', '⭐ 成就系统');
            
            container.innerHTML = '';
            
            var categorizedAchievements = {};
            for (var i = 0; i < LADDER_ACHIEVEMENTS.length; i++) {
                var ach = LADDER_ACHIEVEMENTS[i];
                if (!categorizedAchievements[ach.category]) {
                    categorizedAchievements[ach.category] = [];
                }
                categorizedAchievements[ach.category].push(ach);
            }
            
            for (var c = 0; c < CATEGORY_ORDER.length; c++) {
                var category = CATEGORY_ORDER[c];
                if (categorizedAchievements[category]) {
                    categorizedAchievements[category].sort(function(a, b) { return a.level - b.level; });
                }
            }
            
            var totalAchievements = LADDER_ACHIEVEMENTS.length;
            var unlockedCount = 0;
            achievementStates.forEach(function(state) {
                if (state.unlocked) unlockedCount++;
            });
            
            var achievementProgress = getTranslation('achievementProgress', '成就进度');
            var bronzeText = getTranslation('bronze', '青铜');
            var silverText = getTranslation('silver', '白银');
            var goldText = getTranslation('gold', '黄金');
            var platinumText = getTranslation('platinum', '铂金');
            
            var statsHtml = `
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 15px; padding: clamp(20px, 5vw, 25px); margin-bottom: 30px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                        <span style="font-size: clamp(1.2em, 4vw, 1.5em); font-weight: bold;">⭐ ${achievementProgress}</span>
                        <span style="background: rgba(255,255,255,0.2); padding: 8px 20px; border-radius: 25px; font-size: clamp(0.9em, 3vw, 1.1em);">
                            ${unlockedCount}/${totalAchievements}
                        </span>
                    </div>
                    <div style="background: rgba(255,255,255,0.3); border-radius: 15px; height: 12px; overflow: hidden; margin-bottom: 20px;">
                        <div style="width: ${(unlockedCount/totalAchievements)*100}%; background: #FFD700; height: 100%; border-radius: 15px; transition: width 0.3s ease;"></div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
                        <div style="text-align: center; background: rgba(255,255,255,0.1); padding: 12px; border-radius: 12px;">
                            <div style="font-size: 1.8em;">🥉</div>
                            <div style="font-size: clamp(1em, 4vw, 1.2em); font-weight: bold;">${playerStats.bronzeCount}</div>
                            <div style="font-size: clamp(0.8em, 3vw, 0.85em); opacity: 0.9;">${bronzeText}</div>
                        </div>
                        <div style="text-align: center; background: rgba(255,255,255,0.1); padding: 12px; border-radius: 12px;">
                            <div style="font-size: 1.8em;">🥈</div>
                            <div style="font-size: clamp(1em, 4vw, 1.2em); font-weight: bold;">${playerStats.silverCount}</div>
                            <div style="font-size: clamp(0.8em, 3vw, 0.85em); opacity: 0.9;">${silverText}</div>
                        </div>
                        <div style="text-align: center; background: rgba(255,255,255,0.1); padding: 12px; border-radius: 12px;">
                            <div style="font-size: 1.8em;">🥇</div>
                            <div style="font-size: clamp(1em, 4vw, 1.2em); font-weight: bold;">${playerStats.goldCount}</div>
                            <div style="font-size: clamp(0.8em, 3vw, 0.85em); opacity: 0.9;">${goldText}</div>
                        </div>
                        <div style="text-align: center; background: rgba(255,255,255,0.1); padding: 12px; border-radius: 12px;">
                            <div style="font-size: 1.8em;">🏆</div>
                            <div style="font-size: clamp(1em, 4vw, 1.2em); font-weight: bold;">${playerStats.platinumCount}</div>
                            <div style="font-size: clamp(0.8em, 3vw, 0.85em); opacity: 0.9;">${platinumText}</div>
                        </div>
                    </div>
                </div>
            `;
            
            var achievementsHtml = '<div style="display: flex; flex-direction: column; gap: 30px;">';
            
            for (var c = 0; c < CATEGORY_ORDER.length; c++) {
                var category = CATEGORY_ORDER[c];
                var achievements = categorizedAchievements[category];
                if (!achievements || achievements.length === 0) continue;
                
                var categoryName = getTranslation('category' + category.charAt(0).toUpperCase() + category.slice(1), '');
                
                achievementsHtml += `
                    <div style="background: white; border-radius: 20px; padding: clamp(15px, 4vw, 20px); box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <h4 style="display: flex; align-items: center; margin-top: 0; margin-bottom: 20px; color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px; flex-wrap: wrap;">
                            <span style="font-size: clamp(1.5em, 5vw, 2em); margin-right: 12px;">${CATEGORY_ICONS[category]}</span>
                            <span style="font-size: clamp(1.1em, 4vw, 1.3em); font-weight: bold;">${categoryName}</span>
                        </h4>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;" class="achievements-grid">
                `;
                
                for (var a = 0; a < achievements.length; a++) {
                    var ach = achievements[a];
                    var state = achievementStates.get(ach.id);
                    var isUnlocked = state && state.unlocked;
                    var progress = state ? state.progress : 0;
                    var levelColor = LEVEL_COLORS[ach.level];
                    
                    var achName = getTranslation(ach.nameKey, '');
                    var achDesc = getTranslation(ach.descKey, '');
                    
                    achievementsHtml += `
                        <div style="background: ${isUnlocked ? 'linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%)' : '#ffffff'}; 
                                    border: 2px solid ${isUnlocked ? levelColor : '#e9ecef'};
                                    border-radius: 16px; 
                                    padding: 20px 15px; 
                                    text-align: center;
                                    box-shadow: ${isUnlocked ? '0 8px 20px rgba(0,0,0,0.08)' : '0 4px 10px rgba(0,0,0,0.03)'};
                                    opacity: ${isUnlocked ? 1 : 0.8};
                                    transition: all 0.3s ease;
                                    position: relative;
                                    display: flex;
                                    flex-direction: column;
                                    height: 100%;"
                             onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 12px 25px rgba(0,0,0,0.12)';"
                             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='${isUnlocked ? '0 8px 20px rgba(0,0,0,0.08)' : '0 4px 10px rgba(0,0,0,0.03)'}';">
                            
                            <div style="font-size: clamp(2em, 6vw, 2.8em); margin-bottom: 10px;">${ach.icon}</div>
                            
                            <div style="font-weight: bold; color: ${levelColor}; font-size: clamp(0.8em, 3vw, 0.9em); margin-bottom: 8px; background: ${levelColor}20; padding: 4px 10px; border-radius: 20px; display: inline-block; align-self: center;">
                                ${LEVEL_ICONS[ach.level]} ${getTranslation('level', '等级')} ${ach.level}
                            </div>
                            
                            <div style="font-weight: bold; color: #2c3e50; margin-bottom: 8px; font-size: clamp(0.9em, 3.5vw, 1.1em);">
                                ${achName}
                            </div>
                            
                            <div style="color: #6c757d; font-size: clamp(0.8em, 2.8vw, 0.85em); margin-bottom: 15px; line-height: 1.4; flex-grow: 1;">
                                ${achDesc}
                            </div>
                            
                            <div style="background: #f1f3f5; border-radius: 12px; height: 8px; overflow: hidden; margin-bottom: 8px;">
                                <div style="width: ${progress}%; background: ${levelColor}; height: 100%; border-radius: 12px; transition: width 0.3s ease;"></div>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; color: #6c757d; font-size: clamp(0.7em, 2.5vw, 0.8em); margin-top: 5px;">
                                <span>${isUnlocked ? '✓ ' + getTranslation('unlocked', '已解锁') : progress + '%'}</span>
                                <span style="color: ${levelColor};">+${ach.reward.score}</span>
                            </div>
                            
                            ${isUnlocked ? `
                                <div style="position: absolute; top: -8px; right: -8px; background: #4CAF50; color: white; width: 28px; height: 28px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 0.9em; box-shadow: 0 4px 8px rgba(76,175,80,0.3);">
                                    ✓
                                </div>
                            ` : ''}
                        </div>
                    `;
                }
                
                achievementsHtml += `
                        </div>
                    </div>
                `;
            }
            
            achievementsHtml += '</div>';
            container.innerHTML = statsHtml + achievementsHtml;
            achievementsModal.style.display = 'flex';
        } catch (error) {
            console.error('显示成就失败:', error);
        }
    }
    
    // ==================== 游戏核心功能 ====================
    function selectMode(mode) {
        currentMode = mode;
        var modeBtns = document.querySelectorAll('.mode-btn');
        for (var i = 0; i < modeBtns.length; i++) {
            modeBtns[i].classList.remove('active');
        }
        var targetBtn = document.querySelector('[data-mode="' + mode + '"]');
        if (targetBtn) targetBtn.classList.add('active');
        
        var customSettings = document.getElementById('custom-settings');
        if (mode === 'custom') {
            if (customSettings) customSettings.style.display = 'flex';
        } else {
            if (customSettings) customSettings.style.display = 'none';
        }
        
        var startBtn = document.getElementById('start-btn');
        if (startBtn) {
            if (mode === 'practice') {
                startBtn.innerHTML = '<span>' + getTranslation('startPractice', '🎯 开始练习') + '</span>';
            } else {
                startBtn.innerHTML = '<span>' + getTranslation('startGame', '🚀 开始游戏') + '</span>';
            }
        }
    }
    
    function startGame() {
        if (!currentUser && !offlineMode) {
            showAuthModal();
            showMessage(currentLanguage === 'zh' ? '请先登录再开始游戏' : 'Please login to start game', 'info');
            return;
        }
        
        resetGame();
        
        var rangeInput = document.getElementById('number-range');
        var range = rangeInput ? rangeInput.value : '0-14';
        var modeConfig = {};
        for (var key in MODE_CONFIG[currentMode]) {
            modeConfig[key] = MODE_CONFIG[currentMode][key];
        }
        
        if (currentMode === 'custom') {
            var questionsInput = document.getElementById('custom-questions');
            var timeInput = document.getElementById('custom-time');
            modeConfig.questions = questionsInput ? parseInt(questionsInput.value) || 20 : 20;
            modeConfig.time = timeInput ? parseInt(timeInput.value) || 60 : 60;
        }
        
        if (modeConfig.hasTimeLimit) {
            timeLeft = modeConfig.time || 90;
        }
        
        var gameInfo = document.getElementById('game-info');
        var progressContainer = document.getElementById('progress-container');
        var targetContainer = document.getElementById('target-container');
        var gameControls = document.getElementById('game-controls');
        var modeSelection = document.querySelector('.mode-selection');
        var gameSetting = document.querySelector('.game-setting');
        
        if (gameInfo) gameInfo.style.display = 'grid';
        if (progressContainer) progressContainer.style.display = 'block';
        if (targetContainer) targetContainer.style.display = 'block';
        if (gameControls) gameControls.style.display = 'flex';
        if (modeSelection) modeSelection.style.display = 'none';
        if (gameSetting) gameSetting.style.display = 'none';
        
        var gameGrid = document.getElementById('game-grid');
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
            var timeElement = document.getElementById('time');
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
        
        var scoreElement = document.getElementById('score');
        var completedElement = document.getElementById('completed');
        var accuracyElement = document.getElementById('accuracy');
        var progressBar = document.getElementById('progress-bar');
        
        if (scoreElement) scoreElement.textContent = '0';
        if (completedElement) completedElement.textContent = '0/30';
        if (accuracyElement) accuracyElement.textContent = '100%';
        if (progressBar) progressBar.style.width = '100%';
        
        var gameGrid = document.getElementById('game-grid');
        if (gameGrid) gameGrid.innerHTML = '';
        
        loadWrongQuestions();
        loadAchievements();
    }
    
    function generateNumberGrid() {
        var gameGrid = document.getElementById('game-grid');
        if (!gameGrid) return;
        
        var rangeInput = document.getElementById('number-range');
        var range = rangeInput ? rangeInput.value : '0-14';
        var config = RANGE_CONFIG[range];
        if (!config) return;
        
        gameGrid.innerHTML = '';
        var numbers = [];
        
        for (var i = 0; i < 10; i++) {
            var num = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
            numbers.push(num);
        }
        
        shuffleArray(numbers);
        
        for (var i = 0; i < numbers.length; i++) {
            var number = numbers[i];
            var card = document.createElement('div');
            card.className = 'number-card';
            card.textContent = number;
            card.dataset.value = number;
            card.addEventListener('click', function(c) {
                return function() { selectCard(c); };
            }(card));
            gameGrid.appendChild(card);
        }
        
        setTimeout(checkAndAutoRefresh, 300);
    }
    
    function selectCard(card) {
        if (!gameActive || card.classList.contains('disappear')) return;
        
        if (card.classList.contains('selected')) {
            card.classList.remove('selected');
            var newSelected = [];
            for (var i = 0; i < selectedCards.length; i++) {
                if (selectedCards[i] !== card) {
                    newSelected.push(selectedCards[i]);
                }
            }
            selectedCards = newSelected;
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
        
        var num1 = parseInt(selectedCards[0].dataset.value);
        var num2 = parseInt(selectedCards[1].dataset.value);
        var sum = num1 + num2;
        var isCorrect = sum === currentTarget;
        
        if (lastAnswerTime) {
            var answerTime = (new Date() - lastAnswerTime) / 1000;
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
            
            for (var i = 0; i < selectedCards.length; i++) {
                selectedCards[i].classList.add('disappear');
            }
            setTimeout(function() {
                for (var j = 0; j < selectedCards.length; j++) {
                    var card = selectedCards[j];
                    if (card && card.parentNode) {
                        card.parentNode.removeChild(card);
                    }
                }
                selectedCards = [];
                
                var remainingCards = Array.from(document.querySelectorAll('.number-card:not(.disappear)'));
                if (remainingCards.length < 2) {
                    generateNumberGrid();
                } else {
                    if (!hasValidCombination(currentTarget, remainingCards)) {
                        showMessage(currentLanguage === 'zh' ? '没有匹配的组合，自动刷新数字！' : 'No matching combinations, refreshing numbers!', 'info');
                        setTimeout(function() {
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
            
            setTimeout(function() {
                generateNewTarget();
            }, 800);
        } else {
            recordWrongQuestion(num1, num2, sum, currentTarget);
            
            showFeedback(currentLanguage === 'zh' ? '✗ 错误' : '✗ Wrong', 'error');
            for (var i = 0; i < selectedCards.length; i++) {
                selectedCards[i].classList.remove('selected');
            }
            selectedCards = [];
            
            var remainingCards = Array.from(document.querySelectorAll('.number-card:not(.disappear)'));
            if (!hasValidCombination(currentTarget, remainingCards)) {
                showMessage(currentLanguage === 'zh' ? '没有匹配的组合，自动刷新数字！' : 'No matching combinations, refreshing numbers!', 'info');
                setTimeout(function() {
                    refreshNumbers();
                }, 500);
            }
        }
        
        checkAndUnlockAchievements();
    }
    
    function showFeedback(text, type) {
        var feedback = document.getElementById('match-feedback');
        if (!feedback) return;
        
        feedback.textContent = text;
        feedback.style.color = type === 'success' ? '#4CAF50' : '#ff4444';
        feedback.style.opacity = '1';
        setTimeout(function() { feedback.style.opacity = '0'; }, 1000);
    }
    
    function updateTimer() {
        if (!gameActive) return;
        
        timeLeft--;
        if (timeLeft < 0) timeLeft = 0;
        
        var timeElement = document.getElementById('time');
        if (timeElement) timeElement.textContent = timeLeft;
        
        if (timeLeft <= 10) {
            var timeContainer = document.getElementById('time-container');
            if (timeContainer) timeContainer.classList.add('time-warning');
        }
        
        if (timeLeft <= 0) {
            endGame('timeout');
        }
    }
    
    function updateElapsedTime() {
        if (!gameActive || !startTime) return;
        
        var elapsed = Math.floor((new Date() - startTime) / 1000);
        var timeElement = document.getElementById('time');
        if (timeElement) timeElement.textContent = elapsed;
    }
    
    function updateDisplay() {
        var scoreElement = document.getElementById('score');
        var completedElement = document.getElementById('completed');
        var accuracyElement = document.getElementById('accuracy');
        
        if (scoreElement) scoreElement.textContent = score;
        
        if (completedElement) {
            var modeConfig = MODE_CONFIG[currentMode];
            if (modeConfig.questions) {
                completedElement.textContent = completedQuestions + '/' + modeConfig.questions;
            } else {
                completedElement.textContent = completedQuestions.toString();
            }
        }
        
        if (accuracyElement) {
            var accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;
            accuracyElement.textContent = accuracy + '%';
        }
    }
    
    function generateNewTarget() {
        var rangeInput = document.getElementById('number-range');
        var range = rangeInput ? rangeInput.value : '0-14';
        var config = RANGE_CONFIG[range];
        if (!config) return;
        
        var targetRange = config.targetMax - config.targetMin;
        currentTarget = Math.floor(Math.random() * (targetRange + 1)) + config.targetMin;
        
        var targetSumElement = document.getElementById('target-sum');
        if (targetSumElement) targetSumElement.textContent = currentTarget;
        
        setTimeout(checkAndAutoRefresh, 300);
    }
    
    function hasValidCombination(targetSum, cards) {
        if (!cards || cards.length < 2) return false;
        
        var numbers = [];
        for (var i = 0; i < cards.length; i++) {
            numbers.push(parseInt(cards[i].dataset.value));
        }
        
        for (var i = 0; i < numbers.length; i++) {
            for (var j = i + 1; j < numbers.length; j++) {
                if (numbers[i] + numbers[j] === targetSum) {
                    return true;
                }
            }
        }
        return false;
    }
    
    function checkAndAutoRefresh() {
        if (!gameActive) return;
        
        var remainingCards = Array.from(document.querySelectorAll('.number-card:not(.disappear)'));
        if (!hasValidCombination(currentTarget, remainingCards)) {
            showMessage(currentLanguage === 'zh' ? '没有匹配的组合，自动刷新数字！' : 'No matching combinations, refreshing numbers!', 'info');
            setTimeout(function() {
                refreshNumbers();
            }, 500);
        }
    }
    
    function refreshNumbers() {
        var gameGrid = document.getElementById('game-grid');
        if (!gameGrid) return;
        
        gameGrid.style.opacity = '0.5';
        setTimeout(function() {
            generateNumberGrid();
            gameGrid.style.opacity = '1';
        }, 500);
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
        
        var elapsedTime = 0;
        if (startTime) {
            elapsedTime = Math.floor((new Date() - startTime) / 1000);
        }
        
        var accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;
        
        var finalScoreElement = document.getElementById('final-score');
        var finalCompletedElement = document.getElementById('final-completed');
        var finalTimeElement = document.getElementById('final-time');
        var finalAccuracyElement = document.getElementById('final-accuracy');
        var resultTitleElement = document.getElementById('result-title');
        
        if (finalScoreElement) finalScoreElement.textContent = score;
        if (finalCompletedElement) finalCompletedElement.textContent = completedQuestions;
        if (finalTimeElement) finalTimeElement.textContent = elapsedTime + (currentLanguage === 'zh' ? '秒' : 's');
        if (finalAccuracyElement) finalAccuracyElement.textContent = accuracy + '%';
        
        var titleMap = {
            'complete': getTranslation('gameComplete', '🎉 恭喜完成30题！'),
            'timeout': getTranslation('gameTimeout', '⏰ 时间到！'),
            'giveup': getTranslation('gameGiveup', '🏁 游戏结束')
        };
        
        if (resultTitleElement) {
            resultTitleElement.textContent = titleMap[reason] || getTranslation('gameEnd', '🎉 游戏结束!');
        }
        
        updateGameOverText();
        
        var gameOverElement = document.getElementById('game-over');
        if (gameOverElement) gameOverElement.style.display = 'flex';
        
        updatePlayerStats();
        checkAndUnlockAchievements();
        saveAchievements();
        
        if (currentUser && isSupabaseReady && !offlineMode) {
            await saveGameScoreToCloud(score, completedQuestions, accuracy, elapsedTime);
        }
        
        if (currentUser) {
            await updateUserStats();
        }
        
        if (currentUser && wrongQuestions.length > 0 && !offlineMode) {
            if (syncTimeout) clearTimeout(syncTimeout);
            syncTimeout = setTimeout(function() {
                syncAllWrongQuestionsToCloud();
            }, 2000);
        }
        
        syncState.pendingChanges = true;
        saveSyncState();
        updateUserInfo();
    }
    
    // ==================== 成绩云端存储 ====================
    async function saveGameScoreToCloud(gameScore, questionsCompleted, gameAccuracy, timeUsed) {
        try {
            var rangeInput = document.getElementById('number-range');
            var range = rangeInput ? rangeInput.value : '0-14';
            
            if (!currentUser || !isSupabaseReady || !supabase || offlineMode) {
                if (!currentUser) return false;
                
                var pendingScore = {
                    user_id: currentUser.id,
                    email: currentUser.email,
                    username: (currentUser.user_metadata && currentUser.user_metadata.username) || 
                              (currentUser.email ? currentUser.email.split('@')[0] : '匿名玩家'),
                    mode: currentMode,
                    range: range,
                    leaderboard_type: getLeaderboardType(currentMode, range),
                    score: gameScore,
                    questions_completed: questionsCompleted,
                    total_attempts: totalAttempts,
                    correct_count: correctCount,
                    accuracy: gameAccuracy,
                    time_used: timeUsed,
                    created_at: new Date().toISOString()
                };
                
                var pendingKey = 'mathGameScores_' + currentUser.id + '_pending';
                var pendingScores = JSON.parse(localStorage.getItem(pendingKey) || '[]');
                pendingScores.push(pendingScore);
                localStorage.setItem(pendingKey, JSON.stringify(pendingScores));
                
                syncState.pendingChanges = true;
                saveSyncState();
                
                return false;
            }
            
            var leaderboardType = getLeaderboardType(currentMode, range);
            
            if (!leaderboardType) {
                console.log('当前模式不计入排行榜');
                return false;
            }
            
            var username = (currentUser.user_metadata && currentUser.user_metadata.username) || 
                          (currentUser.email ? currentUser.email.split('@')[0] : '匿名玩家');
            
            var scoreData = {
                user_id: currentUser.id,
                email: currentUser.email,
                username: username,
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
            
            var result = await supabase
                .from('game_scores')
                .insert([scoreData]);
            
            if (result.error) {
                console.error('保存成绩到云端失败:', result.error);
                return false;
            }
            
            console.log('成绩保存到云端成功');
            syncState.pendingChanges = true;
            saveSyncState();
            return true;
        } catch (error) {
            console.error('保存成绩异常:', error);
            return false;
        }
    }
    
    // ==================== 获取排行榜类型 ====================
    function getLeaderboardType(gameMode, range) {
        var difficultyMap = {
            '0-9': 'easy',
            '0-14': 'medium',
            '5-18': 'hard'
        };
        
        var difficulty = difficultyMap[range] || 'medium';
        
        if (gameMode === 'challenge') {
            return 'challenge_' + difficulty;
        } else if (gameMode === 'standard') {
            return 'standard_' + difficulty;
        }
        
        return null;
    }
    
    // ==================== 用户统计系统 ====================
    async function loadUserStats() {
        try {
            if (!currentUser || !isSupabaseReady || !supabase || offlineMode) {
                return null;
            }
            
            var localStatsKey = 'mathGameStats_' + currentUser.id;
            var localStats = localStorage.getItem(localStatsKey);
            if (localStats) {
                try {
                    var stats = JSON.parse(localStats);
                    if (stats.timestamp && (Date.now() - stats.timestamp) < CONFIG.CACHE_EXPIRY) {
                        return stats;
                    }
                } catch (e) {}
            }
            
            var result = await supabase
                .from('game_scores')
                .select('*')
                .eq('user_id', currentUser.id)
                .order('created_at', { ascending: false });
            
            if (result.error) {
                console.error('加载用户统计失败:', result.error);
                return null;
            }
            
            var scores = result.data;
            if (!scores || scores.length === 0) {
                return null;
            }
            
            var totalGames = scores.length;
            var totalScore = 0;
            var totalQuestions = 0;
            var totalAttempts = 0;
            var totalCorrect = 0;
            var bestScore = 0;
            var bestAccuracy = 0;
            var totalTimeUsed = 0;
            
            var modeStats = {
                standard: 0,
                challenge: 0,
                practice: 0,
                custom: 0
            };
            
            var rangeStats = {
                easy: 0,
                standard: 0,
                challenge: 0
            };
            
            for (var i = 0; i < scores.length; i++) {
                var s = scores[i];
                totalScore += s.score || 0;
                totalQuestions += s.questions_completed || 0;
                totalAttempts += s.total_attempts || 0;
                totalCorrect += s.correct_count || 0;
                totalTimeUsed += s.time_used || 0;
                
                if ((s.score || 0) > bestScore) bestScore = s.score || 0;
                if ((s.accuracy || 0) > bestAccuracy) bestAccuracy = s.accuracy || 0;
                
                if (s.mode === 'standard') modeStats.standard++;
                else if (s.mode === 'challenge') modeStats.challenge++;
                else if (s.mode === 'practice') modeStats.practice++;
                else if (s.mode === 'custom') modeStats.custom++;
                
                if (s.range === '0-9') rangeStats.easy++;
                else if (s.range === '0-14') rangeStats.standard++;
                else if (s.range === '5-18') rangeStats.challenge++;
            }
            
            var stats = {
                totalGames: totalGames,
                totalScore: totalScore,
                totalQuestions: totalQuestions,
                totalAttempts: totalAttempts,
                totalCorrect: totalCorrect,
                bestScore: bestScore,
                bestAccuracy: bestAccuracy,
                totalTimeUsed: totalTimeUsed,
                modeStats: modeStats,
                rangeStats: rangeStats,
                recentGames: scores.slice(0, 10),
                timestamp: Date.now()
            };
            
            localStorage.setItem(localStatsKey, JSON.stringify(stats));
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
            var saved = localStorage.getItem('mathGameWrongQuestions');
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
            syncState.pendingChanges = true;
            saveSyncState();
        } catch (error) {
            console.error('保存错题失败:', error);
        }
    }
    
    function recordWrongQuestion(num1, num2, wrongSum, correctSum) {
        try {
            loadWrongQuestions();
            
            var existingIndex = -1;
            for (var i = 0; i < wrongQuestions.length; i++) {
                var q = wrongQuestions[i];
                if (q.num1 === num1 && q.num2 === num2 && q.correctSum === correctSum) {
                    existingIndex = i;
                    break;
                }
            }
            
            if (existingIndex >= 0) {
                wrongQuestions[existingIndex].count++;
                wrongQuestions[existingIndex].timestamp = new Date().toISOString();
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
            
            if (currentUser && isSupabaseReady && !offlineMode) {
                setTimeout(function() {
                    syncWrongQuestionToCloud(num1, num2, wrongSum, correctSum);
                }, 100);
            }
        } catch (error) {
            console.error('记录错题失败:', error);
        }
    }
    
    async function syncWrongQuestionToCloud(num1, num2, wrongSum, correctSum) {
        try {
            if (!currentUser || !isSupabaseReady || !supabase || offlineMode) {
                return false;
            }
            
            var wrongQuestionData = {
                user_id: currentUser.id,
                email: currentUser.email,
                num1: num1,
                num2: num2,
                wrong_sum: wrongSum,
                correct_sum: correctSum,
                count: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            
            var existingResult = await supabase
                .from('wrong_questions')
                .select('id, count')
                .eq('user_id', currentUser.id)
                .eq('num1', num1)
                .eq('num2', num2)
                .limit(1);
            
            if (existingResult.data && existingResult.data.length > 0) {
                await supabase
                    .from('wrong_questions')
                    .update({
                        count: (existingResult.data[0].count || 1) + 1,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingResult.data[0].id);
            } else {
                await supabase
                    .from('wrong_questions')
                    .insert([wrongQuestionData]);
            }
            
            return true;
        } catch (error) {
            console.error('同步错题到云端异常:', error);
            return false;
        }
    }
    
    async function syncAllWrongQuestionsToCloud() {
        try {
            if (!currentUser) return false;
            if (!isSupabaseReady || !supabase) return false;
            if (offlineMode) return false;
            
            loadWrongQuestions();
            if (wrongQuestions.length === 0) return false;
            
            var successCount = 0;
            var failCount = 0;
            
            for (var i = 0; i < wrongQuestions.length; i++) {
                var question = wrongQuestions[i];
                try {
                    var success = await syncWrongQuestionToCloud(
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
                    
                    await new Promise(function(resolve) { setTimeout(resolve, 50); });
                } catch (error) {
                    console.error('同步单个错题失败:', error);
                    failCount++;
                }
            }
            
            localStorage.setItem('mathGameWrongQuestionsLastSync', new Date().toISOString());
            return successCount > 0;
        } catch (error) {
            console.error('批量同步错题失败:', error);
            return false;
        }
    }
    
    async function loadWrongQuestionsFromCloud() {
        try {
            if (!currentUser || !isSupabaseReady || !supabase || offlineMode) {
                return false;
            }
            
            var result = await supabase
                .from('wrong_questions')
                .select('*')
                .eq('user_id', currentUser.id)
                .order('created_at', { ascending: false });
            
            if (result.error) {
                console.error('从云端加载错题失败:', result.error);
                return false;
            }
            
            if (!result.data || result.data.length === 0) {
                return false;
            }
            
            var cloudQuestions = [];
            for (var i = 0; i < result.data.length; i++) {
                var item = result.data[i];
                cloudQuestions.push({
                    num1: item.num1,
                    num2: item.num2,
                    wrongSum: item.wrong_sum,
                    correctSum: item.correct_sum,
                    count: item.count || 1,
                    timestamp: item.created_at
                });
            }
            
            loadWrongQuestions();
            
            for (var i = 0; i < cloudQuestions.length; i++) {
                var cloudQuestion = cloudQuestions[i];
                var existingIndex = -1;
                for (var j = 0; j < wrongQuestions.length; j++) {
                    var q = wrongQuestions[j];
                    if (q.num1 === cloudQuestion.num1 && 
                        q.num2 === cloudQuestion.num2 && 
                        q.correctSum === cloudQuestion.correctSum) {
                        existingIndex = j;
                        break;
                    }
                }
                
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
    
    // ==================== 统计功能 ====================
    async function showStatistics() {
        try {
            var statisticsContent = document.getElementById('statistics-content');
            var statisticsModal = document.getElementById('statistics-modal');
            var statisticsTitle = document.getElementById('statistics-title');
            
            if (!statisticsContent || !statisticsModal) return;
            
            if (statisticsTitle) statisticsTitle.textContent = getTranslation('statisticsTitle', '📊 统计分析');
            
            statisticsContent.innerHTML = '<div style="text-align:center;padding:30px;">' + getTranslation('loadingStats', '加载统计信息中...') + '</div>';
            statisticsModal.style.display = 'flex';
            
            var stats = null;
            if (currentUser) {
                stats = await loadUserStats();
            }
            
            var sessionStats = calculateStatistics();
            
            if (stats) {
                var avgAccuracy = stats.totalAttempts > 0 
                    ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100) 
                    : 0;
                var avgTimePerQuestion = stats.totalQuestions > 0 
                    ? (stats.totalTimeUsed / stats.totalQuestions).toFixed(1) 
                    : 0;
                
                var html = `
                    <div style="padding: 20px;">
                        <h3 style="color: #4CAF50; margin-bottom: 15px;">${getTranslation('statisticsTitle', '📊 统计分析')}</h3>
                        
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                                <div style="font-size: 1.8em; margin-bottom: 5px;">🏆</div>
                                <div style="font-size: 0.9em; opacity: 0.9;">${getTranslation('totalGames', '总游戏次数')}</div>
                                <div style="font-size: 2em; font-weight: bold;">${stats.totalGames}</div>
                            </div>
                            <div style="background: linear-gradient(135deg, #6b8cff 0%, #4a6cf7 100%); color: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                                <div style="font-size: 1.8em; margin-bottom: 5px;">💯</div>
                                <div style="font-size: 0.9em; opacity: 0.9;">${getTranslation('bestScore', '最佳得分')}</div>
                                <div style="font-size: 2em; font-weight: bold;">${stats.bestScore}</div>
                            </div>
                            <div style="background: linear-gradient(135deg, #ff8c5a 0%, #ff6b4a 100%); color: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                                <div style="font-size: 1.8em; margin-bottom: 5px;">🎯</div>
                                <div style="font-size: 0.9em; opacity: 0.9;">${getTranslation('bestAccuracy', '最佳正确率')}</div>
                                <div style="font-size: 2em; font-weight: bold;">${stats.bestAccuracy}%</div>
                            </div>
                        </div>
                        
                        <div style="background: white; border-radius: 15px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">📊 ${getTranslation('modeStats', '模式统计')}</h4>
                            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 15px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 1.5em; color: #4CAF50;">${stats.modeStats.standard}</div>
                                    <div style="color: #666; font-size: 0.85em;">${getTranslation('modeStandard', '📚 挑战30')}</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 1.5em; color: #FF9800;">${stats.modeStats.challenge}</div>
                                    <div style="color: #666; font-size: 0.85em;">${getTranslation('modeChallenge', '⚡ 激情90秒')}</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 1.5em; color: #2196F3;">${stats.modeStats.practice}</div>
                                    <div style="color: #666; font-size: 0.85em;">${getTranslation('modePractice', '🎯 练习模式')}</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 1.5em; color: #9C27B0;">${stats.modeStats.custom}</div>
                                    <div style="color: #666; font-size: 0.85em;">${getTranslation('modeCustom', '⚙️ 自定义')}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="background: white; border-radius: 15px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">⚡ ${getTranslation('accuracyLabel', '正确率')}</h4>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                                <div>
                                    <div style="color: #666; margin-bottom: 5px;">${getTranslation('totalQuestions', '总答题数')}</div>
                                    <div style="font-size: 1.8em; font-weight: bold; color: #333;">${stats.totalQuestions}</div>
                                </div>
                                <div>
                                    <div style="color: #666; margin-bottom: 5px;">${getTranslation('totalCorrect', '总正确数')}</div>
                                    <div style="font-size: 1.8em; font-weight: bold; color: #4CAF50;">${stats.totalCorrect}</div>
                                </div>
                                <div>
                                    <div style="color: #666; margin-bottom: 5px;">${getTranslation('avgAccuracy', '平均正确率')}</div>
                                    <div style="font-size: 1.8em; font-weight: bold; color: #FF9800;">${avgAccuracy}%</div>
                                </div>
                                <div>
                                    <div style="color: #666; margin-bottom: 5px;">${getTranslation('avgTimePerQuestion', '平均每题用时')}</div>
                                    <div style="font-size: 1.8em; font-weight: bold; color: #2196F3;">${avgTimePerQuestion}s</div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="background: #f8f9fa; border-radius: 15px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; color: #333; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">🎮 ${getTranslation('myHistory', '我的历史')}</h4>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                                <div>
                                    <div style="color: #666; font-size: 0.9em;">${getTranslation('scoreLabel', '得分')}</div>
                                    <div style="font-size: 1.5em; font-weight: bold; color: #4CAF50;">${score}</div>
                                </div>
                                <div>
                                    <div style="color: #666; font-size: 0.9em;">${getTranslation('completedLabel', '完成题数')}</div>
                                    <div style="font-size: 1.5em; font-weight: bold; color: #2196F3;">${completedQuestions}</div>
                                </div>
                                <div>
                                    <div style="color: #666; font-size: 0.9em;">${getTranslation('accuracyLabel', '正确率')}</div>
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
                        <h3 style="color: #4CAF50; margin-bottom: 15px;">${getTranslation('statisticsTitle', '📊 统计分析')}</h3>
                        <div style="text-align: center; padding: 30px; background: #f8f9fa; border-radius: 15px;">
                            <div style="font-size: 4em; margin-bottom: 20px;">📊</div>
                            <h4>${getTranslation('noHistoryStats', '暂无历史统计数据')}</h4>
                            <p style="color: #666; margin-top: 10px;">${getTranslation('statsDescription', '完成游戏并保存成绩后，统计数据将显示在这里')}</p>
                        </div>
                        
                        <div style="margin-top: 30px; background: white; border-radius: 15px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">🎮 ${getTranslation('myHistory', '我的历史')}</h4>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                                <div>
                                    <div style="color: #666; font-size: 0.9em;">${getTranslation('scoreLabel', '得分')}</div>
                                    <div style="font-size: 1.5em; font-weight: bold; color: #4CAF50;">${score}</div>
                                </div>
                                <div>
                                    <div style="color: #666; font-size: 0.9em;">${getTranslation('completedLabel', '完成题数')}</div>
                                    <div style="font-size: 1.5em; font-weight: bold; color: #2196F3;">${completedQuestions}</div>
                                </div>
                                <div>
                                    <div style="color: #666; font-size: 0.9em;">${getTranslation('accuracyLabel', '正确率')}</div>
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
            showMessage(getTranslation('loadingStats', '加载统计信息中...'), 'error');
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
    var paginationElements = null;
    
    async function loadLeaderboardData(type, sortBy, limit, offset) {
        if (!type) type = 'challenge_easy';
        if (!sortBy) sortBy = 'score';
        if (!limit) limit = 10;
        if (offset === undefined) offset = 0;
        
        try {
            if (!isSupabaseReady || !supabase || offlineMode) {
                // 离线模式返回本地缓存
                var cached = localStorage.getItem('leaderboard_' + type + '_' + sortBy);
                if (cached) {
                    try {
                        var cachedData = JSON.parse(cached);
                        if (cachedData.timestamp && (Date.now() - cachedData.timestamp) < CONFIG.LEADERBOARD_CACHE_TIME) {
                            leaderboardState.totalCount = cachedData.count || 0;
                            leaderboardState.totalPages = Math.ceil(leaderboardState.totalCount / limit);
                            return cachedData.data || [];
                        }
                    } catch (e) {}
                }
                return [];
            }
            
            var query = supabase
                .from('game_scores')
                .select('*', { count: 'exact' })
                .eq('leaderboard_type', type);
            
            if (sortBy === 'score') {
                query = query.order('score', { ascending: false });
            } else if (sortBy === 'accuracy') {
                query = query.order('accuracy', { ascending: false });
            } else if (sortBy === 'time') {
                query = query.order('time_used', { ascending: true });
            }
            
            // 获取总数
            var countResult = await query;
            leaderboardState.totalCount = countResult.count || 0;
            leaderboardState.totalPages = Math.ceil(leaderboardState.totalCount / limit);
            
            // 获取分页数据
            var result = await query
                .range(offset, offset + limit - 1);
            
            if (result.error) {
                console.error('加载排行榜数据失败:', result.error);
                return [];
            }
            
            // 缓存数据
            if (result.data) {
                try {
                    localStorage.setItem('leaderboard_' + type + '_' + sortBy, JSON.stringify({
                        data: result.data,
                        count: leaderboardState.totalCount,
                        timestamp: Date.now()
                    }));
                } catch (e) {}
            }
            
            return result.data || [];
        } catch (error) {
            console.error('加载排行榜数据异常:', error);
            return [];
        }
    }
    
    async function loadUserBestInCombination(gameMode, difficulty) {
        try {
            if (!currentUser || !isSupabaseReady || !supabase || offlineMode) {
                return null;
            }
            
            var leaderboardType = gameMode + '_' + difficulty;
            
            var bestScoreResult = await supabase
                .from('game_scores')
                .select('*')
                .eq('user_id', currentUser.id)
                .eq('leaderboard_type', leaderboardType)
                .order('score', { ascending: false })
                .limit(1);
            
            var bestAccuracyResult = await supabase
                .from('game_scores')
                .select('*')
                .eq('user_id', currentUser.id)
                .eq('leaderboard_type', leaderboardType)
                .order('accuracy', { ascending: false })
                .limit(1);
            
            var bestTimeResult = await supabase
                .from('game_scores')
                .select('*')
                .eq('user_id', currentUser.id)
                .eq('leaderboard_type', leaderboardType)
                .order('time_used', { ascending: true })
                .limit(1);
            
            return {
                bestScore: bestScoreResult.data && bestScoreResult.data.length > 0 ? bestScoreResult.data[0] : null,
                bestAccuracy: bestAccuracyResult.data && bestAccuracyResult.data.length > 0 ? bestAccuracyResult.data[0] : null,
                bestTime: bestTimeResult.data && bestTimeResult.data.length > 0 ? bestTimeResult.data[0] : null
            };
        } catch (error) {
            console.error('加载用户最佳成绩失败:', error);
            return null;
        }
    }
    
    async function showLeaderboard() {
        try {
            var leaderboardContent = document.getElementById('leaderboard-content');
            var leaderboardModal = document.getElementById('leaderboard-modal');
            
            if (!leaderboardContent || !leaderboardModal) return;
            
            leaderboardContent.innerHTML = '<div style="text-align:center;padding:30px;">' + getTranslation('loadingStats', '加载统计信息中...') + '</div>';
            leaderboardModal.style.display = 'flex';
            
            // 重置排行榜状态
            leaderboardState = {
                currentGameMode: 'challenge',
                currentDifficulty: 'easy',
                currentPage: 1,
                pageSize: parseInt((document.getElementById('leaderboard-limit') || { value: 10 }).value) || 10,
                totalPages: 1,
                totalCount: 0,
                sortBy: 'score'
            };
            
            // 加载数据
            await loadLeaderboardForCurrentState();
            
            // 绑定事件（先移除旧监听器）
            bindLeaderboardEvents();
            
        } catch (error) {
            console.error('显示排行榜失败:', error);
            showMessage(getTranslation('loadingStats', '加载统计信息中...'), 'error');
        }
    }
    
    async function loadLeaderboardForCurrentState() {
        var container = document.getElementById('leaderboard-content');
        if (!container) return;
        
        var gameMode = leaderboardState.currentGameMode;
        var difficulty = leaderboardState.currentDifficulty;
        var page = leaderboardState.currentPage;
        var pageSize = leaderboardState.pageSize;
        var sortBy = leaderboardState.sortBy;
        
        var leaderboardType = gameMode + '_' + difficulty;
        var offset = (page - 1) * pageSize;
        
        var data = await loadLeaderboardData(leaderboardType, sortBy, pageSize, offset);
        
        // 获取用户最佳成绩
        var userBest = null;
        if (currentUser && !offlineMode) {
            userBest = await loadUserBestInCombination(gameMode, difficulty);
        }
        
        // 更新标题
        var gameModeName = gameMode === 'challenge' ? 
            getTranslation('leaderboardChallengeMode', '⚡ 激情90秒') : 
            getTranslation('leaderboardStandardMode', '📚 挑战30');
        
        var difficultyKey = difficulty === 'easy' ? 'easyMode' : 
                          difficulty === 'medium' ? 'standardMode' : 'challengeMode';
        var difficultyName = getTranslation(difficultyKey, '');
        
        var titleElement = document.getElementById('leaderboard-dynamic-title');
        if (titleElement) {
            titleElement.textContent = gameModeName + ' · ' + difficultyName;
        }
        
        // 生成HTML
        var html = '<div style="padding: 10px;">' + generateLeaderboardTable(data, sortBy) + '</div>';
        container.innerHTML = html;
        
        // 更新分页状态
        updatePagination();
        
        // 更新用户最佳卡片
        updateMyBestCard(userBest);
        
        // 更新登录提示
        updateLoginPrompt();
        
        // 更新离线提示
        updateOfflinePrompt();
    }
    
    function generateLeaderboardTable(data, sortBy) {
        if (!data || data.length === 0) {
            return '<div class="leaderboard-empty">' + getTranslation('noData', '暂无数据') + '</div>';
        }
        
        var rows = '';
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var isCurrentUser = currentUser && item.user_id === currentUser.id;
            var globalRank = (leaderboardState.currentPage - 1) * leaderboardState.pageSize + i + 1;
            var rankClass = globalRank === 1 ? 'first' : globalRank === 2 ? 'second' : globalRank === 3 ? 'third' : '';
            var userClass = isCurrentUser ? 'current-user' : '';
            
            var medal = '';
            if (globalRank === 1) medal = '🥇';
            else if (globalRank === 2) medal = '🥈';
            else if (globalRank === 3) medal = '🥉';
            else medal = globalRank + '.';
            
            rows += `
                <tr class="${rankClass} ${userClass}">
                    <td>${medal}</td>
                    <td>${item.username || (item.email ? item.email.split('@')[0] : '匿名')}</td>
                    <td>${item.score}</td>
                    <td>${item.accuracy}%</td>
                    <td>${item.time_used}s</td>
                    <td>${new Date(item.created_at).toLocaleDateString()}</td>
                </tr>
            `;
        }
        
        var rankText = getTranslation('rank', '排名');
        var playerText = getTranslation('player', '玩家');
        var scoreText = getTranslation('score', '得分');
        var accuracyText = getTranslation('accuracy', '准确率');
        var timeText = getTranslation('time', '用时');
        var dateText = getTranslation('date', '日期');
        
        return `
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>${rankText}</th>
                        <th>${playerText}</th>
                        <th>${scoreText}</th>
                        <th>${accuracyText}</th>
                        <th>${timeText}</th>
                        <th>${dateText}</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `;
    }
    
    function updatePagination() {
        if (!paginationElements) {
            paginationElements = {
                prevBtn: document.getElementById('page-prev'),
                nextBtn: document.getElementById('page-next'),
                page1: document.getElementById('page-1'),
                page2: document.getElementById('page-2'),
                page3: document.getElementById('page-3')
            };
        }
        
        var prevBtn = paginationElements.prevBtn;
        var nextBtn = paginationElements.nextBtn;
        var page1 = paginationElements.page1;
        var page2 = paginationElements.page2;
        var page3 = paginationElements.page3;
        
        if (!prevBtn || !nextBtn || !page1 || !page2 || !page3) return;
        
        var currentPage = leaderboardState.currentPage;
        var totalPages = leaderboardState.totalPages;
        
        // 更新上一页/下一页状态
        prevBtn.disabled = currentPage <= 1;
        prevBtn.classList.toggle('disabled', currentPage <= 1);
        
        nextBtn.disabled = currentPage >= totalPages;
        nextBtn.classList.toggle('disabled', currentPage >= totalPages);
        
        // 更新页码显示
        page1.textContent = '1';
        page2.textContent = totalPages > 1 ? '2' : '-';
        page3.textContent = totalPages > 2 ? '3' : '-';
        
        page1.classList.toggle('active', currentPage === 1);
        page2.classList.toggle('active', currentPage === 2);
        page3.classList.toggle('active', currentPage === 3);
        
        page2.disabled = totalPages < 2;
        page3.disabled = totalPages < 3;
    }
    
    function updateMyBestCard(userBest) {
        var card = document.getElementById('my-best-card');
        if (!card) return;
        
        if (userBest && currentUser) {
            var scoreEl = document.getElementById('my-best-score');
            var accuracyEl = document.getElementById('my-best-accuracy');
            var timeEl = document.getElementById('my-best-time');
            
            if (scoreEl) scoreEl.textContent = (userBest.bestScore && userBest.bestScore.score) || 0;
            if (accuracyEl) accuracyEl.textContent = ((userBest.bestAccuracy && userBest.bestAccuracy.accuracy) || 0) + '%';
            if (timeEl) timeEl.textContent = ((userBest.bestTime && userBest.bestTime.time_used) || 0) + 's';
            
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    }
    
    function updateLoginPrompt() {
        var prompt = document.getElementById('login-prompt');
        if (!prompt) return;
        
        if (!currentUser && !offlineMode) {
            prompt.style.display = 'block';
        } else {
            prompt.style.display = 'none';
        }
    }
    
    function updateOfflinePrompt() {
        var prompt = document.getElementById('leaderboard-offline');
        if (!prompt) return;
        
        if (offlineMode) {
            prompt.style.display = 'block';
        } else {
            prompt.style.display = 'none';
        }
    }
    
    function bindLeaderboardEvents() {
        // 游戏模式选项卡
        var challengeModeBtn = document.getElementById('tab-challenge-mode');
        if (challengeModeBtn) {
            challengeModeBtn.removeEventListener('click', handleChallengeModeClick);
            challengeModeBtn.addEventListener('click', handleChallengeModeClick);
        }
        
        var standardModeBtn = document.getElementById('tab-standard-mode');
        if (standardModeBtn) {
            standardModeBtn.removeEventListener('click', handleStandardModeClick);
            standardModeBtn.addEventListener('click', handleStandardModeClick);
        }
        
        // 难度选项卡
        var easyBtn = document.getElementById('tab-easy');
        if (easyBtn) {
            easyBtn.removeEventListener('click', handleEasyClick);
            easyBtn.addEventListener('click', handleEasyClick);
        }
        
        var mediumBtn = document.getElementById('tab-medium');
        if (mediumBtn) {
            mediumBtn.removeEventListener('click', handleMediumClick);
            mediumBtn.addEventListener('click', handleMediumClick);
        }
        
        var hardBtn = document.getElementById('tab-hard');
        if (hardBtn) {
            hardBtn.removeEventListener('click', handleHardClick);
            hardBtn.addEventListener('click', handleHardClick);
        }
        
        // 刷新按钮
        var refreshBtn = document.getElementById('sync-leaderboard-btn');
        if (refreshBtn) {
            refreshBtn.removeEventListener('click', handleRefreshClick);
            refreshBtn.addEventListener('click', handleRefreshClick);
        }
        
        // 显示数量选择
        var limitSelect = document.getElementById('leaderboard-limit');
        if (limitSelect) {
            limitSelect.removeEventListener('change', handleLimitChange);
            limitSelect.addEventListener('change', handleLimitChange);
        }
        
        // 分页按钮
        var prevBtn = document.getElementById('page-prev');
        if (prevBtn) {
            prevBtn.removeEventListener('click', handlePrevClick);
            prevBtn.addEventListener('click', handlePrevClick);
        }
        
        var nextBtn = document.getElementById('page-next');
        if (nextBtn) {
            nextBtn.removeEventListener('click', handleNextClick);
            nextBtn.addEventListener('click', handleNextClick);
        }
        
        var page1Btn = document.getElementById('page-1');
        if (page1Btn) {
            page1Btn.removeEventListener('click', handlePage1Click);
            page1Btn.addEventListener('click', handlePage1Click);
        }
        
        var page2Btn = document.getElementById('page-2');
        if (page2Btn) {
            page2Btn.removeEventListener('click', handlePage2Click);
            page2Btn.addEventListener('click', handlePage2Click);
        }
        
        var page3Btn = document.getElementById('page-3');
        if (page3Btn) {
            page3Btn.removeEventListener('click', handlePage3Click);
            page3Btn.addEventListener('click', handlePage3Click);
        }
    }
    
    function handleChallengeModeClick() {
        leaderboardState.currentGameMode = 'challenge';
        leaderboardState.currentPage = 1;
        loadLeaderboardForCurrentState();
    }
    
    function handleStandardModeClick() {
        leaderboardState.currentGameMode = 'standard';
        leaderboardState.currentPage = 1;
        loadLeaderboardForCurrentState();
    }
    
    function handleEasyClick() {
        leaderboardState.currentDifficulty = 'easy';
        leaderboardState.currentPage = 1;
        loadLeaderboardForCurrentState();
    }
    
    function handleMediumClick() {
        leaderboardState.currentDifficulty = 'medium';
        leaderboardState.currentPage = 1;
        loadLeaderboardForCurrentState();
    }
    
    function handleHardClick() {
        leaderboardState.currentDifficulty = 'hard';
        leaderboardState.currentPage = 1;
        loadLeaderboardForCurrentState();
    }
    
    function handleRefreshClick() {
        loadLeaderboardForCurrentState();
        showMessage(getTranslation('syncSuccess', '✅ 同步成功'), 'success');
    }
    
    function handleLimitChange(e) {
        leaderboardState.pageSize = parseInt(e.target.value);
        leaderboardState.currentPage = 1;
        loadLeaderboardForCurrentState();
    }
    
    function handlePrevClick() {
        if (leaderboardState.currentPage > 1) {
            leaderboardState.currentPage--;
            loadLeaderboardForCurrentState();
        }
    }
    
    function handleNextClick() {
        if (leaderboardState.currentPage < leaderboardState.totalPages) {
            leaderboardState.currentPage++;
            loadLeaderboardForCurrentState();
        }
    }
    
    function handlePage1Click() {
        leaderboardState.currentPage = 1;
        loadLeaderboardForCurrentState();
    }
    
    function handlePage2Click() {
        if (leaderboardState.totalPages >= 2) {
            leaderboardState.currentPage = 2;
            loadLeaderboardForCurrentState();
        }
    }
    
    function handlePage3Click() {
        if (leaderboardState.totalPages >= 3) {
            leaderboardState.currentPage = 3;
            loadLeaderboardForCurrentState();
        }
    }
    
    async function loadUserScores() {
        try {
            if (!currentUser || !isSupabaseReady || !supabase || offlineMode) {
                return;
            }
            
            var result = await supabase
                .from('game_scores')
                .select('*')
                .eq('user_id', currentUser.id)
                .order('created_at', { ascending: false })
                .limit(100);
            
            if (result.error) {
                console.error('加载用户成绩失败:', result.error);
                return;
            }
            
            if (result.data && result.data.length > 0) {
                localStorage.setItem('mathGameScores_' + currentUser.id, JSON.stringify({
                    scores: result.data,
                    timestamp: Date.now()
                }));
            }
        } catch (error) {
            console.error('加载用户成绩异常:', error);
        }
    }
    
    function generateLeaderboardCard(mode, type, scores, title, color) {
        var getValue = function(score) {
            if (type === 'score') return score.score;
            if (type === 'accuracy') return score.accuracy + '%';
            if (type === 'time') return score.time_used + 's';
            return '';
        };
        
        var getMedal = function(index) {
            if (index === 0) return '🥇';
            if (index === 1) return '🥈';
            if (index === 2) return '🥉';
            return (index + 1) + '.';
        };
        
        var cardHtml = `
            <div style="background: white; border-radius: 16px; padding: 18px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-top: 5px solid ${color};">
                <h5 style="display: flex; align-items: center; justify-content: space-between; margin-top: 0; margin-bottom: 15px; color: #333; flex-wrap: wrap; gap: 10px;">
                    <span style="font-weight: bold; font-size: clamp(0.9em, 3.5vw, 1.1em);">${title}</span>
                    <span style="background: ${color}20; color: ${color}; padding: 4px 12px; border-radius: 20px; font-size: 0.8em;">
                        ${type === 'score' ? '🏆' : type === 'accuracy' ? '🎯' : '⚡'}
                    </span>
                </h5>
        `;
        
        if (scores.length === 0) {
            cardHtml += `
                <div style="text-align: center; padding: 25px 10px; background: #f8f9fa; border-radius: 12px;">
                    <div style="font-size: 2.5em; margin-bottom: 10px; opacity: 0.5;">🏆</div>
                    <p style="color: #999; margin: 0; font-size: 0.9em;">${getTranslation('noData', '暂无数据')}</p>
                </div>
            `;
        } else {
            cardHtml += '<div style="display: flex; flex-direction: column; gap: 10px;">';
            
            for (var i = 0; i < Math.min(scores.length, 5); i++) {
                var score = scores[i];
                var isCurrentUser = currentUser && score.user_id === currentUser.id;
                var medalColor = i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'transparent';
                
                cardHtml += `
                    <div style="display: flex; align-items: center; justify-content: space-between; 
                                padding: 8px 12px; 
                                background: ${isCurrentUser ? '#FFF9C4' : i % 2 === 0 ? '#fafafa' : 'white'};
                                border-radius: 10px;
                                border-left: 4px solid ${medalColor};
                                flex-wrap: wrap;
                                gap: 8px;">
                        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                            <span style="font-weight: bold; color: ${i < 3 ? '#333' : '#999'}; min-width: 30px;">
                                ${getMedal(i)}
                            </span>
                            <span style="font-weight: ${isCurrentUser ? 'bold' : 'normal'}; color: ${isCurrentUser ? '#4CAF50' : '#333'}; font-size: clamp(0.8em, 3vw, 0.9em);">
                                ${score.username || (score.email ? score.email.split('@')[0] : '匿名')}
                                ${isCurrentUser ? '<span style="background: #4CAF50; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.7em; margin-left: 8px;">' + getTranslation('player', '玩家') + '</span>' : ''}
                            </span>
                        </div>
                        <span style="font-weight: bold; color: ${color}; background: ${color}10; padding: 4px 12px; border-radius: 20px; font-size: clamp(0.8em, 3vw, 0.9em);">
                            ${getValue(score)}
                        </span>
                    </div>
                `;
            }
            
            cardHtml += '</div>';
        }
        
        cardHtml += '</div>';
        return cardHtml;
    }
    
    function generateUserBestSection(userEasy, userStandard, userChallenge) {
        var myBestText = getTranslation('myBest', '我的最佳');
        var scoreText = getTranslation('score', '得分');
        var accuracyText = getTranslation('accuracy', '准确率');
        var timeText = getTranslation('time', '用时');
        var easyModeText = getTranslation('easyMode', '简单模式');
        var standardModeText = getTranslation('standardMode', '标准模式');
        var challengeModeText = getTranslation('challengeMode', '困难模式');
        
        return `
            <div style="margin-top: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 20px; padding: clamp(20px, 5vw, 25px); box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px;">
                    <h4 style="margin: 0; color: white; display: flex; align-items: center; font-size: clamp(1.1em, 4vw, 1.3em);">
                        <span style="background: rgba(255,255,255,0.2); width: 45px; height: 45px; border-radius: 23px; display: inline-flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 1.3em;">👤</span>
                        ${myBestText}
                    </h4>
                    <span style="background: rgba(255,255,255,0.2); padding: 6px 16px; border-radius: 20px; font-size: 0.9em;">
                        ${(currentUser && currentUser.user_metadata && currentUser.user_metadata.username) || 
                          (currentUser && currentUser.email ? currentUser.email.split('@')[0] : getTranslation('player', '玩家'))}
                    </span>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;" class="leaderboard-grid">
                    <div style="background: rgba(255,255,255,0.1); border-radius: 16px; padding: 18px; backdrop-filter: blur(5px);">
                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                            <span style="background: #8BC34A; width: 30px; height: 30px; border-radius: 15px; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px;">🟢</span>
                            <span style="font-weight: bold;">${easyModeText}</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center;">
                            <div>
                                <div style="font-size: 0.8em; opacity: 0.9;">🏆 ${scoreText}</div>
                                <div style="font-size: clamp(1.2em, 4vw, 1.4em); font-weight: bold;">${userEasy && userEasy.bestScore ? userEasy.bestScore.score : 0}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.8em; opacity: 0.9;">🎯 ${accuracyText}</div>
                                <div style="font-size: clamp(1.2em, 4vw, 1.4em); font-weight: bold;">${userEasy && userEasy.bestAccuracy ? userEasy.bestAccuracy.accuracy : 0}%</div>
                            </div>
                            <div>
                                <div style="font-size: 0.8em; opacity: 0.9;">⚡ ${timeText}</div>
                                <div style="font-size: clamp(1.2em, 4vw, 1.4em); font-weight: bold;">${userEasy && userEasy.bestTime ? userEasy.bestTime.time_used : 0}s</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.1); border-radius: 16px; padding: 18px; backdrop-filter: blur(5px);">
                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                            <span style="background: #FF9800; width: 30px; height: 30px; border-radius: 15px; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px;">🟠</span>
                            <span style="font-weight: bold;">${standardModeText}</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center;">
                            <div>
                                <div style="font-size: 0.8em; opacity: 0.9;">🏆 ${scoreText}</div>
                                <div style="font-size: clamp(1.2em, 4vw, 1.4em); font-weight: bold;">${userStandard && userStandard.bestScore ? userStandard.bestScore.score : 0}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.8em; opacity: 0.9;">🎯 ${accuracyText}</div>
                                <div style="font-size: clamp(1.2em, 4vw, 1.4em); font-weight: bold;">${userStandard && userStandard.bestAccuracy ? userStandard.bestAccuracy.accuracy : 0}%</div>
                            </div>
                            <div>
                                <div style="font-size: 0.8em; opacity: 0.9;">⚡ ${timeText}</div>
                                <div style="font-size: clamp(1.2em, 4vw, 1.4em); font-weight: bold;">${userStandard && userStandard.bestTime ? userStandard.bestTime.time_used : 0}s</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.1); border-radius: 16px; padding: 18px; backdrop-filter: blur(5px);">
                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                            <span style="background: #f44336; width: 30px; height: 30px; border-radius: 15px; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px;">🔴</span>
                            <span style="font-weight: bold;">${challengeModeText}</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center;">
                            <div>
                                <div style="font-size: 0.8em; opacity: 0.9;">🏆 ${scoreText}</div>
                                <div style="font-size: clamp(1.2em, 4vw, 1.4em); font-weight: bold;">${userChallenge && userChallenge.bestScore ? userChallenge.bestScore.score : 0}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.8em; opacity: 0.9;">🎯 ${accuracyText}</div>
                                <div style="font-size: clamp(1.2em, 4vw, 1.4em); font-weight: bold;">${userChallenge && userChallenge.bestAccuracy ? userChallenge.bestAccuracy.accuracy : 0}%</div>
                            </div>
                            <div>
                                <div style="font-size: 0.8em; opacity: 0.9;">⚡ ${timeText}</div>
                                <div style="font-size: clamp(1.2em, 4vw, 1.4em); font-weight: bold;">${userChallenge && userChallenge.bestTime ? userChallenge.bestTime.time_used : 0}s</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
                    <span style="background: rgba(255,255,255,0.1); padding: 6px 16px; border-radius: 20px; font-size: 0.85em;">
                        ${syncState.lastSyncTime && !offlineMode ? 
                            '☁️ ' + getTranslation('lastSync', '上次同步') + ': ' + new Date(syncState.lastSyncTime).toLocaleTimeString() : 
                            offlineMode ? '📴 ' + getTranslation('offlineMode', '离线模式') : '☁️ ' + getTranslation('lastSync', '上次同步') + ': -'}
                    </span>
                </div>
            </div>
        `;
    }
    
    function generateLoginPrompt() {
        return `
            <div style="margin-top: 40px; background: linear-gradient(135deg, #6c757d 0%, #495057 100%); border-radius: 20px; padding: 30px; text-align: center; color: white;">
                <div style="font-size: 3.5em; margin-bottom: 15px;">🔐</div>
                <h4 style="margin: 0 0 10px 0; color: white; font-size: clamp(1.1em, 4vw, 1.3em);">${getTranslation('needLogin', '请先登录后再申请教师账号')}</h4>
                <p style="opacity: 0.9; margin-bottom: 20px;">${getTranslation('loginPrompt', '立即登录，与其他玩家一较高下！')}</p>
                <button onclick="if(window.MathGame) window.MathGame.showAuthModal(); else setTimeout(function(){ if(window.MathGame) window.MathGame.showAuthModal(); }, 500);" style="background: white; color: #495057; border: none; padding: 12px 35px; border-radius: 30px; font-size: clamp(0.9em, 3.5vw, 1.1em); font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: all 0.3s ease;">
                    🔐 ${getTranslation('loginNow', '立即登录')}
                </button>
            </div>
        `;
    }
    
    // ==================== 历史记录显示 ====================
    function showHistory() {
        try {
            var tbody = document.getElementById('history-table-body');
            var historyModal = document.getElementById('history-modal');
            var historyTitle = document.getElementById('history-title');
            var clearHistoryBtn = document.getElementById('clear-history-btn');
            
            if (!tbody || !historyModal) return;
            
            if (historyTitle) historyTitle.textContent = getTranslation('historyTitle', '📝 历史记录');
            if (clearHistoryBtn) clearHistoryBtn.innerHTML = '<span>' + getTranslation('clearHistory', '清空本次记录') + '</span>';
            
            tbody.innerHTML = '';
            
            if (gameHistory.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;">' + getTranslation('noData', '暂无数据') + '</td></tr>';
            } else {
                var start = Math.max(0, gameHistory.length - 15);
                for (var i = start; i < gameHistory.length; i++) {
                    var record = gameHistory[i];
                    var index = i - start + 1;
                    var row = document.createElement('tr');
                    var resultText = record.isCorrect ? 
                        (currentLanguage === 'zh' ? '✓ 正确' : '✓ Correct') : 
                        (currentLanguage === 'zh' ? '✗ 错误' : '✗ Wrong');
                    
                    row.innerHTML = `
                        <td>${index}</td>
                        <td>${record.target}</td>
                        <td>${record.num1}</td>
                        <td>${record.num2}</td>
                        <td style="color: ${record.isCorrect ? '#4CAF50' : '#ff4444'}; font-weight: bold;">
                            ${resultText}
                        </td>
                        <td>${new Date(record.timestamp).toLocaleTimeString()}</td>
                    `;
                    tbody.appendChild(row);
                }
            }
            
            historyModal.style.display = 'flex';
        } catch (error) {
            console.error('显示历史记录失败:', error);
        }
    }
    
    // ==================== 修复版错题本显示 ====================
    function showWrongBook() {
        try {
            loadWrongQuestions();
            
            var container = document.getElementById('wrong-questions-list');
            var wrongbookModal = document.getElementById('wrongbook-modal');
            var wrongbookTitle = document.getElementById('wrongbook-title');
            var syncBtn = document.getElementById('sync-wrong-questions-btn');
            var clearBtn = document.getElementById('clear-wrong-questions-btn');
            
            if (!container || !wrongbookModal) return;
            
            if (wrongbookTitle) wrongbookTitle.textContent = getTranslation('wrongbookTitle', '📖 错题本');
            if (syncBtn) syncBtn.innerHTML = '<span>' + getTranslation('syncWrongQuestions', '☁️ 同步错题到云端') + '</span>';
            if (clearBtn) clearBtn.innerHTML = '<span>' + getTranslation('clearWrongQuestions', '🗑️ 清空本地错题') + '</span>';
            
            container.innerHTML = '';
            
            if (wrongQuestions.length === 0) {
                container.innerHTML = '<div style="text-align:center;padding:20px;color:#666;">' + getTranslation('noData', '暂无数据') + '</div>';
            } else {
                var limit = Math.min(wrongQuestions.length, 20);
                for (var i = 0; i < limit; i++) {
                    var question = wrongQuestions[i];
                    var item = document.createElement('div');
                    item.className = 'wrong-question-item';
                    item.style.cssText = `
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 15px;
                        border-bottom: 1px solid #f0f0f0;
                        flex-wrap: wrap;
                        gap: 10px;
                    `;
                    item.innerHTML = `
                        <div>
                            <strong style="color: #333;">${question.num1} + ${question.num2} = ${question.wrongSum}</strong><br>
                            <small style="color: #ff4444;">${getTranslation('wrongAnswer', '错误答案')} (${getTranslation('shouldBe', '应为')} ${question.correctSum})</small><br>
                            <small style="color: #666;">${getTranslation('errors', '错误次数')}: ${question.count}</small>
                        </div>
                        <div>
                            <small style="color: #666;">${new Date(question.timestamp).toLocaleDateString()}</small>
                        </div>
                    `;
                    container.appendChild(item);
                }
                
                if (wrongQuestions.length > 20) {
                    var more = document.createElement('div');
                    more.style.cssText = 'text-align:center;padding:15px;color:#666;';
                    more.textContent = getTranslation('moreQuestions', '还有 {count} 条错题').replace('{count}', wrongQuestions.length - 20);
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
                showMessage(getTranslation('needLogin', '请先登录后再申请教师账号'), 'info');
                showAuthModal();
                return;
            }
            
            var profileModal = document.getElementById('profile-modal');
            var profileTitle = document.getElementById('profile-title');
            var syncStatusElement = document.getElementById('profile-sync-status');
            
            if (!profileModal) return;
            
            if (profileTitle) profileTitle.textContent = getTranslation('profileTitle', '👤 个人资料');
            
            profileModal.style.display = 'flex';
            
            var email = currentUser.email || '';
            var firstLetter = email.charAt(0).toUpperCase() || '?';
            var avatarEl = document.getElementById('profile-avatar');
            if (avatarEl) avatarEl.textContent = firstLetter;
            
            var emailEl = document.getElementById('profile-email');
            if (emailEl) emailEl.textContent = email;
            
            var userRole = (currentUser.user_metadata && currentUser.user_metadata.role) || 'student';
            var roleText = '';
            if (isSuperAdmin) {
                roleText = '👑 ' + (currentLanguage === 'zh' ? '超级管理员' : 'Super Admin');
            } else if (isSchoolAdmin) {
                roleText = '🏫 ' + (currentLanguage === 'zh' ? '学校管理员' : 'School Admin');
            } else if (isTeacher) {
                roleText = '👨‍🏫 ' + (currentLanguage === 'zh' ? '教师' : 'Teacher');
            } else {
                roleText = '👨‍🎓 ' + (currentLanguage === 'zh' ? '学生' : 'Student');
            }
            var roleEl = document.getElementById('profile-role');
            if (roleEl) roleEl.textContent = roleText;
            
            loadUserStats().then(function(stats) {
                if (stats) {
                    var gameCountEl = document.getElementById('profile-game-count');
                    var highScoreEl = document.getElementById('profile-high-score');
                    var avgAccuracyEl = document.getElementById('profile-avg-accuracy');
                    
                    if (gameCountEl) gameCountEl.textContent = stats.totalGames;
                    if (highScoreEl) highScoreEl.textContent = stats.bestScore;
                    if (avgAccuracyEl) {
                        var avgAcc = stats.totalAttempts > 0 
                            ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100) + '%' 
                            : '0%';
                        avgAccuracyEl.textContent = avgAcc;
                    }
                } else {
                    var gameCountEl = document.getElementById('profile-game-count');
                    var highScoreEl = document.getElementById('profile-high-score');
                    var avgAccuracyEl = document.getElementById('profile-avg-accuracy');
                    
                    if (gameCountEl) gameCountEl.textContent = '0';
                    if (highScoreEl) highScoreEl.textContent = '0';
                    if (avgAccuracyEl) avgAccuracyEl.textContent = '0%';
                }
            });
            
            var joinDate = new Date(currentUser.created_at);
            var joinDateEl = document.getElementById('profile-join-date');
            if (joinDateEl) {
                joinDateEl.textContent = joinDate.toLocaleDateString(currentLanguage === 'zh' ? 'zh-CN' : 'en-US');
            }
            
            if (syncStatusElement) {
                var lastSync = syncState.lastSyncTime && !offlineMode
                    ? new Date(syncState.lastSyncTime).toLocaleString() 
                    : (offlineMode ? getTranslation('offlineMode', '离线模式') : (currentLanguage === 'zh' ? '从未同步' : 'Never'));
                syncStatusElement.innerHTML = '☁️ ' + getTranslation('lastSync', '上次同步') + ': ' + lastSync;
            }
        } catch (error) {
            console.error('显示个人资料失败:', error);
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
        var hintBtn = document.getElementById('hint-btn');
        if (!hintBtn) return;
        
        if (hintCooldown > 0) {
            hintBtn.innerHTML = '<span>💡 ' + hintCooldown + (currentLanguage === 'zh' ? '秒' : 's') + '</span>';
            hintBtn.disabled = true;
            hintBtn.style.opacity = '0.7';
        } else {
            hintBtn.innerHTML = '<span>' + getTranslation('hintButton', '💡 提示') + '</span>';
            hintBtn.disabled = false;
            hintBtn.style.opacity = '1';
        }
    }
    
    function showHint() {
        if (hintCooldown > 0) {
            showMessage((currentLanguage === 'zh' ? '提示冷却中，还剩' : 'Hint cooldown, ') + hintCooldown + (currentLanguage === 'zh' ? '秒' : 's remaining'), 'info');
            return;
        }
        
        hintCooldown = 10;
        updateHintButton();
        showMessage(currentLanguage === 'zh' ? '提示已激活！' : 'Hint activated!', 'info');
    }
    
    function restartGame() {
        var gameOverElement = document.getElementById('game-over');
        if (gameOverElement) gameOverElement.style.display = 'none';
        
        var modeSelection = document.querySelector('.mode-selection');
        var gameSetting = document.querySelector('.game-setting');
        var gameInfo = document.getElementById('game-info');
        var progressContainer = document.getElementById('progress-container');
        var targetContainer = document.getElementById('target-container');
        var gameControls = document.getElementById('game-controls');
        var gameGrid = document.getElementById('game-grid');
        
        if (modeSelection) modeSelection.style.display = 'grid';
        if (gameSetting) gameSetting.style.display = 'block';
        if (gameInfo) gameInfo.style.display = 'none';
        if (progressContainer) progressContainer.style.display = 'none';
        if (targetContainer) targetContainer.style.display = 'none';
        if (gameControls) gameControls.style.display = 'none';
        if (gameGrid) gameGrid.style.display = 'none';
        
        var playerNameInput = document.getElementById('player-name');
        if (playerNameInput) playerNameInput.value = '';
        
        resetGame();
    }
    
    async function saveScore() {
        try {
            if (!currentUser && !offlineMode) {
                showMessage(getTranslation('needLogin', '请先登录后再申请教师账号'), 'error');
                showAuthModal();
                return;
            }
            
            var nameInput = document.getElementById('player-name');
            var playerName = nameInput ? nameInput.value.trim() : '';
            
            if (!playerName) {
                playerName = (currentUser && currentUser.user_metadata && currentUser.user_metadata.username) || 
                            (currentUser && currentUser.email ? currentUser.email.split('@')[0] : '') ||
                            (currentLanguage === 'zh' ? '匿名玩家' : 'Anonymous Player');
            }
            
            var elapsedTime = startTime ? Math.floor((new Date() - startTime) / 1000) : 0;
            var accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;
            
            var success = await saveGameScoreToCloud(score, completedQuestions, accuracy, elapsedTime);
            
            if (success) {
                showMessage(getTranslation('syncSuccess', '✅ 同步成功'), 'success');
            } else {
                showMessage(currentLanguage === 'zh' ? '⚠️ 成绩已保存到本地' : '⚠️ Score saved locally', 'warning');
            }
            
            var gameOverElement = document.getElementById('game-over');
            if (gameOverElement) gameOverElement.style.display = 'none';
            
            setTimeout(restartGame, 500);
        } catch (error) {
            console.error('保存成绩失败:', error);
            showMessage(currentLanguage === 'zh' ? '保存成绩失败' : 'Save score failed', 'error');
        }
    }
    
    // ==================== 响应式样式注入 ====================
    function injectResponsiveStyles() {
        try {
            if (document.getElementById('math-game-responsive-styles')) return;
            
            var style = document.createElement('style');
            style.id = 'math-game-responsive-styles';
            style.textContent = `
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                
                html, body {
                    width: 100%;
                    overflow-x: hidden;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                }
                
                #game-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                #game-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 12px;
                    padding: 16px;
                    max-width: 600px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 24px;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
                }
                
                .number-card {
                    aspect-ratio: 1 / 1;
                    width: 100%;
                    min-width: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(145deg, #ffffff, #f5f5f5);
                    border: 2px solid #e0e0e0;
                    border-radius: 12px;
                    font-size: clamp(20px, 5vw, 32px);
                    font-weight: bold;
                    color: #333;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    line-height: 1;
                    word-break: break-word;
                    text-align: center;
                    user-select: none;
                }
                
                @media (hover: hover) {
                    .number-card:hover {
                        transform: scale(1.05);
                        background: linear-gradient(145deg, #f0f8ff, #e6f3ff);
                        border-color: #2196F3;
                        box-shadow: 0 6px 12px rgba(33,150,243,0.2);
                    }
                }
                
                @media (max-width: 480px) {
                    #game-grid {
                        gap: 8px;
                        padding: 12px;
                    }
                    
                    .number-card {
                        border-radius: 8px;
                        font-size: clamp(18px, 4.5vw, 24px);
                        border-width: 1.5px;
                    }
                }
                
                @media (max-width: 360px) {
                    #game-grid {
                        gap: 6px;
                        padding: 8px;
                    }
                    
                    .number-card {
                        font-size: clamp(16px, 4vw, 20px);
                        border-radius: 6px;
                    }
                }
                
                .number-card.selected {
                    background: linear-gradient(145deg, #e3f2fd, #bbdefb);
                    border: 2px solid #2196F3;
                    transform: scale(0.98);
                    box-shadow: 0 2px 4px rgba(33,150,243,0.3);
                }
                
                .number-card.disappear {
                    animation: disappear 0.3s ease forwards;
                }
                
                @keyframes disappear {
                    0% { opacity: 1; transform: scale(1); }
                    100% { opacity: 0; transform: scale(0); }
                }
                
                .sidebar {
                    width: 280px;
                    background: white;
                    border-right: 1px solid #e0e0e0;
                    padding: 20px 0;
                    height: 100vh;
                    position: fixed;
                    left: 0;
                    top: 0;
                    overflow-y: auto;
                    transition: all 0.3s ease;
                    z-index: 1000;
                    box-shadow: 2px 0 10px rgba(0,0,0,0.05);
                }
                
                @media (max-width: 768px) {
                    .sidebar {
                        width: 100%;
                        height: auto;
                        position: relative;
                        border-right: none;
                        border-bottom: 1px solid #e0e0e0;
                        padding: 12px 0;
                    }
                    
                    .sidebar-header {
                        padding: 0 16px;
                    }
                    
                    .sidebar-menu {
                        display: flex;
                        flex-wrap: wrap;
                        padding: 8px;
                        gap: 8px;
                    }
                    
                    .sidebar-menu button {
                        flex: 1 1 calc(50% - 8px);
                        padding: 12px;
                        margin: 0;
                        white-space: normal;
                        font-size: 13px;
                    }
                }
                
                @media (max-width: 480px) {
                    .sidebar-menu button {
                        flex: 1 1 100%;
                    }
                }
                
                .main-content {
                    margin-left: 280px;
                    padding: 20px;
                    min-height: 100vh;
                    transition: all 0.3s ease;
                }
                
                @media (max-width: 768px) {
                    .main-content {
                        margin-left: 0;
                        padding: 12px;
                    }
                }
                
                #game-info {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 12px;
                    padding: 16px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 20px;
                    margin: 16px;
                    color: white;
                }
                
                .info-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    padding: 8px;
                }
                
                .info-label {
                    font-size: clamp(12px, 3vw, 14px);
                    opacity: 0.9;
                    margin-bottom: 4px;
                    white-space: nowrap;
                }
                
                .info-value {
                    font-size: clamp(20px, 5vw, 28px);
                    font-weight: bold;
                    line-height: 1.2;
                }
                
                @media (max-width: 480px) {
                    #game-info {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 8px;
                        padding: 12px;
                        margin: 12px;
                    }
                    
                    .info-label {
                        white-space: normal;
                        font-size: 11px;
                    }
                    
                    .info-value {
                        font-size: 18px;
                    }
                }
                
                #target-container {
                    text-align: center;
                    padding: 16px;
                    background: white;
                    border-radius: 20px;
                    margin: 16px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                
                #target-sum {
                    font-size: clamp(36px, 10vw, 64px);
                    font-weight: bold;
                    color: #4CAF50;
                    line-height: 1;
                }
                
                @media (max-width: 480px) {
                    #target-container {
                        padding: 12px;
                        margin: 12px;
                    }
                    
                    #target-sum {
                        font-size: 42px;
                    }
                }
                
                #game-controls {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                    padding: 16px;
                    margin: 16px;
                    flex-wrap: wrap;
                }
                
                .control-btn {
                    flex: 1 1 auto;
                    min-width: 100px;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 30px;
                    font-size: clamp(14px, 4vw, 16px);
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    white-space: nowrap;
                }
                
                @media (max-width: 480px) {
                    #game-controls {
                        flex-direction: column;
                        gap: 8px;
                        padding: 12px;
                    }
                    
                    .control-btn {
                        width: 100%;
                        padding: 14px;
                        white-space: normal;
                    }
                }
                
                .modal-content {
                    width: 90%;
                    max-width: 800px;
                    max-height: 90vh;
                    overflow-y: auto;
                    border-radius: 20px;
                    padding: 24px;
                    background: white;
                }
                
                @media (max-width: 480px) {
                    .modal-content {
                        width: 95%;
                        padding: 16px;
                    }
                    
                    .modal-content h3 {
                        font-size: 18px;
                    }
                }
                
                .leaderboard-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                }
                
                @media (max-width: 1024px) {
                    .leaderboard-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                
                @media (max-width: 640px) {
                    .leaderboard-grid {
                        grid-template-columns: 1fr;
                    }
                }
                
                .achievements-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                }
                
                @media (max-width: 1024px) {
                    .achievements-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
                
                @media (max-width: 768px) {
                    .achievements-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                
                @media (max-width: 480px) {
                    .achievements-grid {
                        grid-template-columns: 1fr;
                    }
                }
                
                #loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                    transition: opacity 0.5s ease;
                }
                
                .loading-content {
                    text-align: center;
                    color: white;
                }
                
                .loading-spinner {
                    width: 50px;
                    height: 50px;
                    border: 5px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 1s infinite linear;
                    margin: 0 auto 20px;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                .hide-loading {
                    opacity: 0;
                    pointer-events: none;
                }
                
                .message-popup {
                    animation: slideDown 0.3s ease;
                }
                
                @keyframes slideDown {
                    from {
                        transform: translateY(-20px) translateX(-50%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0) translateX(-50%);
                        opacity: 1;
                    }
                }
                
                @keyframes achievementPop {
                    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
            `;
            
            document.head.appendChild(style);
            console.log('✅ 响应式样式注入成功');
            return true;
        } catch (error) {
            console.error('❌ 注入响应式样式失败:', error);
            return false;
        }
    }
    
    function checkCompatibility() {
        var issues = [];
        
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
        } catch (e) {
            issues.push('localStorage');
            var memoryStorage = {};
            window.localStorage = {
                getItem: function(key) { return memoryStorage[key] || null; },
                setItem: function(key, value) { memoryStorage[key] = value; },
                removeItem: function(key) { delete memoryStorage[key]; }
            };
        }
        
        try {
            sessionStorage.setItem('test', 'test');
            sessionStorage.removeItem('test');
        } catch (e) {
            issues.push('sessionStorage');
        }
        
        if (!window.indexedDB) {
            issues.push('indexedDB');
        }
        
        if (!window.WebSocket) {
            issues.push('WebSocket');
        }
        
        if (!window.Promise) {
            issues.push('Promise');
            window.Promise = function(executor) {
                this.callbacks = [];
                var self = this;
                executor(
                    function(value) { setTimeout(function() { self.resolve(value); }, 0); },
                    function(reason) { setTimeout(function() { self.reject(reason); }, 0); }
                );
            };
            window.Promise.prototype.then = function(callback) { this.callbacks.push(callback); return this; };
            window.Promise.prototype.catch = function(callback) { this.errorCallback = callback; return this; };
            window.Promise.prototype.resolve = function(value) { 
                for (var i = 0; i < this.callbacks.length; i++) {
                    this.callbacks[i](value);
                }
            };
            window.Promise.prototype.reject = function(reason) { 
                if (this.errorCallback) this.errorCallback(reason);
            };
        }
        
        if (issues.length > 0) {
            console.warn('⚠️ 兼容性问题:', issues.join(', '));
            showMessage(
                currentLanguage === 'zh' 
                    ? '📴 您的浏览器不支持: ' + issues.join(', ') + '，已启用降级模式' 
                    : '📴 Your browser does not support: ' + issues.join(', ') + ', fallback mode enabled',
                'warning',
                5000
            );
        }
        
        return issues.length === 0;
    }
    
    // ==================== 初始化 ====================
    async function init() {
        console.log('🎮 数学加法消消乐 - 开始初始化...');
        
        try {
            checkCompatibility();
            injectResponsiveStyles();
            
            var savedLang = 'zh';
            try {
                savedLang = localStorage.getItem('mathGameLanguage') || 'zh';
            } catch (e) {
                console.warn('无法读取localStorage:', e);
            }
            if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
                currentLanguage = savedLang;
            }
            setLanguage(currentLanguage);
            
            await initSupabase();
            
            if (isSupabaseReady && supabase) {
                try {
                    await checkAuth();
                } catch (e) {
                    console.warn('认证检查失败，进入离线模式:', e);
                    offlineMode = true;
                }
            }
            
            loadAchievements();
            loadWrongQuestions();
            initCloudSync();
            
            bindEventListeners();
            
            selectMode('standard');
            
            setTimeout(function() {
                var loadingOverlay = document.getElementById('loading-overlay');
                if (loadingOverlay) {
                    loadingOverlay.classList.add('hide-loading');
                    setTimeout(function() {
                        if (loadingOverlay) loadingOverlay.style.display = 'none';
                    }, 500);
                }
            }, 1500);
            
            console.log('🎮 数学加法消消乐 - 初始化完成！', offlineMode ? '(离线模式)' : '(在线模式)');
            console.log('👤 当前用户角色:', { isSuperAdmin: isSuperAdmin, isSchoolAdmin: isSchoolAdmin, isTeacher: isTeacher, isAdminUser: isAdminUser });
            
            if (offlineMode) {
                showMessage(
                    currentLanguage === 'zh' 
                        ? '📴 您正在使用离线模式，游戏数据将仅保存在本地' 
                        : '📴 You are using offline mode, game data will only be saved locally',
                    'warning',
                    5000
                );
            }
        } catch (error) {
            console.error('❌ 初始化失败:', error);
            
            try {
                var loadingOverlay = document.getElementById('loading-overlay');
                if (loadingOverlay) {
                    loadingOverlay.style.display = 'none';
                }
                
                var gameContainer = document.querySelector('.main-content');
                if (gameContainer) {
                    gameContainer.innerHTML = `
                        <div style="text-align: center; padding: 40px 20px;">
                            <div style="font-size: 4em; margin-bottom: 20px;">🎮</div>
                            <h2 style="color: white; margin-bottom: 20px;">${currentLanguage === 'zh' ? '游戏加载遇到问题' : 'Game Loading Error'}</h2>
                            <p style="color: rgba(255,255,255,0.9); margin-bottom: 30px;">
                                ${currentLanguage === 'zh' 
                                    ? '请尝试刷新页面。如果问题持续存在，请使用Chrome、Edge或Firefox等现代浏览器。' 
                                    : 'Please try refreshing the page. If the problem persists, please use a modern browser like Chrome, Edge, or Firefox.'}
                            </p>
                            <button onclick="location.reload()" style="background: white; color: #667eea; border: none; padding: 15px 40px; border-radius: 30px; font-size: 1.2em; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                                🔄 ${currentLanguage === 'zh' ? '刷新页面' : 'Refresh Page'}
                            </button>
                        </div>
                    `;
                }
            } catch (e) {
                console.error('降级界面显示失败:', e);
            }
            
            showMessage(
                currentLanguage === 'zh' 
                    ? '初始化失败，请刷新页面或更换浏览器' 
                    : 'Initialization failed, please refresh or change browser', 
                'error',
                8000
            );
        }
    }
    
    // ==================== 绑定事件监听器 ====================
    function bindEventListeners() {
        try {
            var langBtn = document.getElementById('language-btn');
            if (langBtn) {
                langBtn.addEventListener('click', function() {
                    var newLang = currentLanguage === 'zh' ? 'en' : 'zh';
                    setLanguage(newLang);
                    showMessage(getTranslation('switchedToChinese') || getTranslation('switchedToEnglish'), 'info');
                });
            }
            
            var sideBarButtons = [
                { id: 'history-btn', handler: showHistory },
                { id: 'statistics-btn', handler: showStatistics },
                { id: 'achievements-btn', handler: showAchievements },
                { id: 'wrongbook-btn', handler: showWrongBook },
                { id: 'leaderboard-btn', handler: showLeaderboard },
                { id: 'profile-btn', handler: showProfile },
                { id: 'teacher-tools-btn', handler: showTeacherTools },
                { id: 'admin-tools-btn', handler: showAdminTools },
                { id: 'teacher-application-btn', handler: showTeacherApplication },
                { id: 'logout-btn', handler: logout },
                { id: 'sync-status-btn', handler: function() {
                    showMessage(
                        offlineMode ? getTranslation('offlineMode', '离线模式') :
                        syncState.pendingChanges 
                            ? (currentLanguage === 'zh' ? '有待同步的数据' : 'Pending changes')
                            : (currentLanguage === 'zh' ? '已同步' : 'Synced'), 
                        'info'
                    );
                }}
            ];
            
            for (var i = 0; i < sideBarButtons.length; i++) {
                var btn = sideBarButtons[i];
                var element = document.getElementById(btn.id);
                if (element) {
                    element.addEventListener('click', btn.handler);
                } else {
                    console.warn('按钮未找到: ' + btn.id);
                }
            }
            
            var modeButtons = [
                { id: 'mode-standard', mode: 'standard' },
                { id: 'mode-challenge', mode: 'challenge' },
                { id: 'mode-practice', mode: 'practice' },
                { id: 'mode-custom', mode: 'custom' }
            ];
            
            for (var i = 0; i < modeButtons.length; i++) {
                var btn = modeButtons[i];
                var element = document.getElementById(btn.id);
                if (element) {
                    element.addEventListener('click', function(m) {
                        return function() { selectMode(m); };
                    }(btn.mode));
                }
            }
            
            var startBtn = document.getElementById('start-btn');
            if (startBtn) startBtn.addEventListener('click', startGame);
            
            var hintBtn = document.getElementById('hint-btn');
            if (hintBtn) hintBtn.addEventListener('click', showHint);
            
            var refreshBtn = document.getElementById('refresh-btn');
            if (refreshBtn) refreshBtn.addEventListener('click', refreshNumbers);
            
            var endgameBtn = document.getElementById('endgame-btn');
            if (endgameBtn) endgameBtn.addEventListener('click', function() { endGame('giveup'); });
            
            var closeAuthBtn = document.getElementById('close-auth-modal');
            if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuthModal);
            
            var authSubmitBtn = document.getElementById('auth-submit-btn');
            if (authSubmitBtn) authSubmitBtn.addEventListener('click', handleAuth);
            
            var authSwitchLink = document.getElementById('auth-switch-link');
            if (authSwitchLink) authSwitchLink.addEventListener('click', toggleAuthMode);
            
            var authRole = document.getElementById('auth-role');
            if (authRole) {
                authRole.addEventListener('change', function() {
                    var teacherRegisterFields = document.getElementById('teacher-register-fields');
                    if (teacherRegisterFields) {
                        teacherRegisterFields.style.display = this.value === 'teacher' ? 'block' : 'none';
                    }
                });
            }
            
            var modalCloseButtons = [
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
            
            for (var i = 0; i < modalCloseButtons.length; i++) {
                var btn = modalCloseButtons[i];
                var element = document.getElementById(btn.id);
                if (element) {
                    element.addEventListener('click', function(b) {
                        return function() {
                            var modalElement = document.getElementById(b.modal);
                            if (modalElement) modalElement.style.display = 'none';
                            if (b.handler) b.handler();
                        };
                    }(btn));
                }
            }
            
            var saveScoreBtn = document.getElementById('save-score-btn');
            if (saveScoreBtn) saveScoreBtn.addEventListener('click', saveScore);
            
            var playAgainBtn = document.getElementById('play-again-btn');
            if (playAgainBtn) playAgainBtn.addEventListener('click', restartGame);
            
            var viewLeaderboardBtn = document.getElementById('view-leaderboard-btn');
            if (viewLeaderboardBtn) viewLeaderboardBtn.addEventListener('click', showLeaderboard);
            
            var viewStatisticsBtn = document.getElementById('view-statistics-btn');
            if (viewStatisticsBtn) viewStatisticsBtn.addEventListener('click', showStatistics);
            
            var clearHistoryBtn = document.getElementById('clear-history-btn');
            if (clearHistoryBtn) {
                clearHistoryBtn.addEventListener('click', function() {
                    if (confirm(getTranslation('confirmClearHistory', '确定要清空本次游戏的历史记录吗？'))) {
                        gameHistory = [];
                        showHistory();
                        showMessage(getTranslation('historyCleared', '历史记录已清空'), 'info');
                    }
                });
            }
            
            var syncWrongBtn = document.getElementById('sync-wrong-questions-btn');
            if (syncWrongBtn) {
                syncWrongBtn.addEventListener('click', async function() {
                    if (offlineMode) {
                        showMessage(currentLanguage === 'zh' ? '离线模式无法同步' : 'Cannot sync in offline mode', 'warning');
                        return;
                    }
                    await syncAllWrongQuestionsToCloud();
                    showWrongBook();
                });
            }
            
            var clearWrongBtn = document.getElementById('clear-wrong-questions-btn');
            if (clearWrongBtn) {
                clearWrongBtn.addEventListener('click', function() {
                    if (confirm(getTranslation('confirmClearWrongQuestions', '确定要清空本地错题吗？（云端错题不受影响）'))) {
                        wrongQuestions = [];
                        saveWrongQuestions();
                        showWrongBook();
                        showMessage(getTranslation('wrongQuestionsCleared', '本地错题已清空'), 'info');
                    }
                });
            }
            
        } catch (error) {
            console.error('绑定事件监听器失败:', error);
        }
    }
    
    // ==================== 公共接口 ====================
    return {
        init: init,
        selectMode: selectMode,
        startGame: startGame,
        showHint: showHint,
        refreshNumbers: refreshNumbers,
        endGame: function(reason) { endGame(reason); },
        restartGame: restartGame,
        showHistory: showHistory,
        showStatistics: showStatistics,
        showAchievements: showAchievements,
        showWrongBook: showWrongBook,
        showLeaderboard: showLeaderboard,
        showProfile: showProfile,
        showTeacherTools: showTeacherTools,
        showAdminTools: showAdminTools,
        showTeacherApplication: showTeacherApplication,
        logout: logout,
        closeAuthModal: closeAuthModal,
        handleAuth: handleAuth,
        toggleAuthMode: toggleAuthMode,
        saveScore: saveScore,
        showAuthModal: showAuthModal,
        performFullSync: performFullSync,
        getSyncStatus: function() { return syncState; },
        isOfflineMode: function() { return offlineMode; },
        getRoles: function() {
            return {
                isSuperAdmin: isSuperAdmin,
                isSchoolAdmin: isSchoolAdmin,
                isTeacher: isTeacher,
                isAdminUser: isAdminUser
            };
        }
    };
})();

// ==================== 启动游戏 ====================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            if (window.MathGame) {
                window.MathGame.init();
            } else {
                console.error('MathGame对象未定义');
            }
        }, 100);
    });
} else {
    setTimeout(function() {
        if (window.MathGame) {
            window.MathGame.init();
        } else {
            console.error('MathGame对象未定义');
        }
    }, 100);
}

window.MathGame = MathGame;
