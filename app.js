// 确保页面已完全加载
(function() {
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
        errorDiv.textContent = `⚠️ 游戏加载遇到问题: ${e.message || '未知错误'}。正在尝试恢复...`;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            setTimeout(() => errorDiv.remove(), 300);
        }, 5000);
    });

    window.addEventListener('unhandledrejection', function(e) {
        console.error('❌ 未处理的Promise错误:', e.reason);
    });
})();

const MathGame = (function() {
    // ==================== 配置 ====================
    const CONFIG = {
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
        USE_MOCK_DATA: false
    };
    
    // ==================== 多语言支持（完整修复版）====================
    const translations = {
        zh: {
            // ========== 游戏主界面 ==========
            gameTitle: "🧮 数学加法消消乐",
            gameSubtitle: "教学优化版 | 云端同步 | 实时排行榜",
            history: "📝 历史记录",
            statistics: "📊 统计",
            achievements: "⭐ 成就",
            wrongBook: "📖 错题本",
            leaderboard: "🏆 排行榜",
            profile: "👤 个人资料",
            
            // ========== 游戏模式 ==========
            modeStandard: "📚 挑战30",
            modeStandardDesc: "完成30题，比拼用时",
            modeChallenge: "⚡ 激情90秒",
            modeChallengeDesc: "90秒时间，比拼题数",
            modePractice: "🎯 练习模式",
            modePracticeDesc: "无时间限制，专心学习",
            modeCustom: "⚙️ 自定义",
            modeCustomDesc: "自设参数，灵活练习",
            
            // ========== 游戏设置 ==========
            numberRange: "数字范围:",
            rangeEasy: "0-9 (简单)",
            rangeStandard: "0-14 (标准)",
            rangeChallenge: "5-18 (挑战)",
            startGame: "🚀 开始游戏",
            startPractice: "🎯 开始练习",
            questionCount: "题目数量:",
            timeLimit: "时间限制(秒):",
            
            // ========== 游戏进行中 ==========
            scoreLabel: "得分",
            completedLabel: "完成题数",
            timeLeft: "剩余时间",
            timeUsed: "已用时间",
            accuracyLabel: "正确率",
            targetSum: "目标和:",
            hintButton: "💡 提示",
            refreshButton: "🔄 刷新",
            endGameButton: "⏹️ 结束",
            
            // ========== 用户认证 ==========
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
            
            // ========== 弹窗标题 ==========
            historyTitle: "📝 历史记录",
            statisticsTitle: "📊 统计分析",
            achievementsTitle: "⭐ 成就系统",
            wrongbookTitle: "📖 错题本",
            leaderboardTitle: "🏆 排行榜",
            profileTitle: "👤 个人资料",
            
            // ========== 表格 ==========
            tableNumber: "#",
            tableTarget: "目标",
            tableNum1: "数字1",
            tableNum2: "数字2",
            tableResult: "结果",
            tableTime: "用时(秒)",
            clearHistory: "清空本次记录",
            
            // ========== 云端同步 ==========
            cloudSync: "☁️ 云端同步",
            syncing: "🔄 同步中...",
            syncSuccess: "✅ 同步成功",
            syncFailed: "❌ 同步失败",
            lastSync: "上次同步",
            syncNow: "立即同步",
            autoSync: "自动同步",
            
            // ========== 教师申请 ==========
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
            
            // ========== 教师工具 ==========
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
            
            // ========== 管理员工具 ==========
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
            
            // ========== 排行榜 ==========
            leaderboardEasy: "🟢 简单模式",
            leaderboardStandard: "🟠 挑战30",
            leaderboardChallenge: "🔴 激情90秒",
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
            standardMode: "挑战30",
            challengeMode: "激情90秒",
            noData: "暂无数据",
            myBest: "我的最佳",
            refresh: "刷新",
            
            // ========== 统计 ==========
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
            
            // ========== 游戏结束 ==========
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
            
            // ========== 成就系统 ==========
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
            
            // ========== 错题本 ==========
            wrongAnswer: "错误答案",
            shouldBe: "应为",
            errors: "错误次数",
            moreQuestions: "还有 {count} 条错题",
            
            // ========== 通用 ==========
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
            
            // ========== 登录提示（统一键名）==========
            loginPrompt: "立即登录，与其他玩家一较高下！",
            
            // ========== 离线模式 ==========
            offlineMode: "📴 离线模式",
            connecting: "🔄 正在连接服务器...",
            connectionFailed: "❌ 连接失败，使用离线模式",
            retryConnection: "重试连接",
            usingMockData: "📁 使用演示数据",
            laptopCompatibilityMode: "💻 笔记本兼容模式已启用"
        },
        en: {
            // ========== Game Main Interface ==========
            gameTitle: "🧮 Math Addition Match",
            gameSubtitle: "Educational Edition | Cloud Sync | Real-time Leaderboard",
            history: "📝 History",
            statistics: "📊 Statistics",
            achievements: "⭐ Achievements",
            wrongBook: "📖 Wrong Questions",
            leaderboard: "🏆 Leaderboard",
            profile: "👤 Profile",
            
            // ========== Game Modes ==========
            modeStandard: "📚 Challenge 30",
            modeStandardDesc: "Complete 30 questions, compete by time",
            modeChallenge: "⚡ Passion 90s",
            modeChallengeDesc: "90 seconds, compete by question count",
            modePractice: "🎯 Practice Mode",
            modePracticeDesc: "No time limit, focus on learning",
            modeCustom: "⚙️ Custom Mode",
            modeCustomDesc: "Set your own parameters",
            
            // ========== Game Settings ==========
            numberRange: "Number Range:",
            rangeEasy: "0-9 (Easy)",
            rangeStandard: "0-14 (Standard)",
            rangeChallenge: "5-18 (Challenge)",
            startGame: "🚀 Start Game",
            startPractice: "🎯 Start Practice",
            questionCount: "Questions:",
            timeLimit: "Time Limit (seconds):",
            
            // ========== In Game ==========
            scoreLabel: "Score",
            completedLabel: "Completed",
            timeLeft: "Time Left",
            timeUsed: "Time Used",
            accuracyLabel: "Accuracy",
            targetSum: "Target Sum:",
            hintButton: "💡 Hint",
            refreshButton: "🔄 Refresh",
            endGameButton: "⏹️ End",
            
            // ========== User Auth ==========
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
            
            // ========== Modal Titles ==========
            historyTitle: "📝 History Records",
            statisticsTitle: "📊 Statistics Analysis",
            achievementsTitle: "⭐ Achievement System",
            wrongbookTitle: "📖 Wrong Questions",
            leaderboardTitle: "🏆 Leaderboard",
            profileTitle: "👤 Profile",
            
            // ========== Tables ==========
            tableNumber: "#",
            tableTarget: "Target",
            tableNum1: "Num1",
            tableNum2: "Num2",
            tableResult: "Result",
            tableTime: "Time(s)",
            clearHistory: "Clear Current History",
            
            // ========== Cloud Sync ==========
            cloudSync: "☁️ Cloud Sync",
            syncing: "🔄 Syncing...",
            syncSuccess: "✅ Sync Successful",
            syncFailed: "❌ Sync Failed",
            lastSync: "Last Sync",
            syncNow: "Sync Now",
            autoSync: "Auto Sync",
            
            // ========== Teacher Application ==========
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
            
            // ========== Teacher Tools ==========
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
            
            // ========== Admin Tools ==========
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
            
            // ========== Leaderboard ==========
            leaderboardEasy: "🟢 Easy Mode",
            leaderboardStandard: "🟠 Challenge 30",
            leaderboardChallenge: "🔴 Passion 90s",
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
            standardMode: "Challenge 30",
            challengeMode: "Passion 90s",
            noData: "No Data",
            myBest: "My Best",
            refresh: "Refresh",
            
            // ========== Statistics ==========
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
            
            // ========== Game Over ==========
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
            
            // ========== Achievement System ==========
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
            
            // ========== Wrong Book ==========
            wrongAnswer: "Wrong answer",
            shouldBe: "should be",
            errors: "Errors",
            moreQuestions: "... {count} more questions",
            
            // ========== Common ==========
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
            
            // ========== Login Prompt（统一键名）==========
            loginPrompt: "Login now and compete with other players!",
            
            // ========== Offline Mode ==========
            offlineMode: "📴 Offline Mode",
            connecting: "🔄 Connecting to server...",
            connectionFailed: "❌ Connection failed, using offline mode",
            retryConnection: "Retry Connection",
            usingMockData: "📁 Using Demo Data",
            laptopCompatibilityMode: "💻 Laptop Compatibility Mode Enabled"
        }
    };
    
    // ==================== 全局变量 ====================
    let supabase = null;
    let supabaseInitialized = false;
    let offlineMode = false;
    let mockDataEnabled = false;
    let connectionRetryCount = 0;
    const MAX_RETRY_COUNT = 3;
    
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
    let isSuperAdmin = false;  // 新增：超级管理员标志
    let isSchoolAdmin = false; // 新增：学校管理员标志
    let isTeacher = false;     // 新增：教师标志
    let isSupabaseReady = false;
    
    // ==================== 云端同步状态 ====================
    let syncState = {
        lastSyncTime: null,
        isSyncing: false,
        syncHistory: [],
        dataVersion: '1.0.0',
        pendingChanges: false,
        offlineMode: false
    };
    
    let autoSyncTimer = null;
    
    // ==================== 阶梯式成就系统 ====================
    const ACHIEVEMENT_LEVELS = {
        BRONZE: 1,
        SILVER: 2,
        GOLD: 3,
        PLATINUM: 4
    };
    
    const ACHIEVEMENT_CATEGORIES = {
        VICTORY: 'victory',
        SCORE: 'score',
        ACCURACY: 'accuracy',
        SPEED: 'speed',
        PERSISTENCE: 'persistence',
        MASTER: 'master'
    };
    
    const CATEGORY_ORDER = ['victory', 'score', 'accuracy', 'speed', 'persistence', 'master'];
    const CATEGORY_ICONS = { victory: '🏆', score: '💯', accuracy: '🎯', speed: '⚡', persistence: '💪', master: '👑' };
    const LEVEL_ICONS = { 1: '🥉', 2: '🥈', 3: '🥇', 4: '🏆' };
    const LEVEL_COLORS = { 1: '#CD7F32', 2: '#C0C0C0', 3: '#FFD700', 4: '#E5E4E2' };
    
    // 完整阶梯式成就定义
    const LADDER_ACHIEVEMENTS = [
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
    
    let achievementStates = new Map();
    let playerStats = {
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
    
    let lastAnswerTime = null;
    let currentFastestAnswer = 999;
    
    const MODE_CONFIG = {
        standard: { questions: 30, time: null, hasTimeLimit: false, leaderboardType: 'standard', displayName: '挑战30' },
        challenge: { questions: null, time: 90, hasTimeLimit: true, leaderboardType: 'challenge', displayName: '激情90秒' },
        practice: { questions: null, time: null, hasTimeLimit: false, leaderboardType: null, displayName: '练习模式' },
        custom: { questions: 20, time: 60, hasTimeLimit: true, leaderboardType: null, displayName: '自定义' }
    };
    
    const RANGE_CONFIG = {
        '0-9': { min: 0, max: 9, targetMin: 5, targetMax: 10, leaderboardType: 'easy', displayName: '简单模式' },
        '0-14': { min: 0, max: 14, targetMin: 6, targetMax: 14, leaderboardType: 'standard', displayName: '挑战30' },
        '5-18': { min: 5, max: 18, targetMin: 8, targetMax: 18, leaderboardType: 'challenge', displayName: '激情90秒' }
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
                border-radius: 30px;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                font-size: clamp(14px, 4vw, 16px);
                max-width: 90%;
                text-align: center;
            `;
            
            document.body.appendChild(message);
            
            setTimeout(() => {
                if (message && message.parentNode) {
                    message.style.opacity = '0';
                    message.style.transform = 'translateX(-50%) translateY(-20px)';
                    message.style.transition = 'all 0.3s ease';
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
            if (lang !== 'zh' && lang !== 'en') return;
            currentLanguage = lang;
            localStorage?.setItem('mathGameLanguage', lang);
            
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
                languageText.textContent = translations[lang].languageText;
            }
            
            updateModeDisplayNames();
            
            if (currentUser) {
                updateUserInfo();
            }
            
            const openModals = {
                'history-modal': showHistory,
                'statistics-modal': showStatistics,
                'achievements-modal': showAchievements,
                'wrongbook-modal': showWrongBook,
                'leaderboard-modal': showLeaderboard,
                'profile-modal': showProfile,
                'teacher-tools-modal': showTeacherTools,
                'admin-tools-modal': showAdminTools
            };
            
            Object.keys(openModals).forEach(modalId => {
                const modal = document.getElementById(modalId);
                if (modal && modal.style.display === 'flex') {
                    openModals[modalId]();
                }
            });
            
            const gameOverElement = document.getElementById('game-over');
            if (gameOverElement && gameOverElement.style.display === 'flex') {
                updateGameOverText();
            }
            
            console.log(`语言已切换到: ${lang}`);
        } catch (error) {
            console.error('设置语言失败:', error);
        }
    }
    
    function updateModeDisplayNames() {
        try {
            const modeStandard = document.querySelector('[data-mode="standard"] span');
            const modeChallenge = document.querySelector('[data-mode="challenge"] span');
            const modePractice = document.querySelector('[data-mode="practice"] span');
            const modeCustom = document.querySelector('[data-mode="custom"] span');
            
            if (modeStandard) modeStandard.textContent = translations[currentLanguage].modeStandard;
            if (modeChallenge) modeChallenge.textContent = translations[currentLanguage].modeChallenge;
            if (modePractice) modePractice.textContent = translations[currentLanguage].modePractice;
            if (modeCustom) modeCustom.textContent = translations[currentLanguage].modeCustom;
            
            const modeStandardDesc = document.querySelector('[data-mode="standard"] .mode-desc');
            const modeChallengeDesc = document.querySelector('[data-mode="challenge"] .mode-desc');
            const modePracticeDesc = document.querySelector('[data-mode="practice"] .mode-desc');
            const modeCustomDesc = document.querySelector('[data-mode="custom"] .mode-desc');
            
            if (modeStandardDesc) modeStandardDesc.textContent = translations[currentLanguage].modeStandardDesc;
            if (modeChallengeDesc) modeChallengeDesc.textContent = translations[currentLanguage].modeChallengeDesc;
            if (modePracticeDesc) modePracticeDesc.textContent = translations[currentLanguage].modePracticeDesc;
            if (modeCustomDesc) modeCustomDesc.textContent = translations[currentLanguage].modeCustomDesc;
            
            const startBtn = document.getElementById('start-btn');
            if (startBtn) {
                if (currentMode === 'practice') {
                    startBtn.innerHTML = `<span>${translations[currentLanguage].startPractice}</span>`;
                } else {
                    startBtn.innerHTML = `<span>${translations[currentLanguage].startGame}</span>`;
                }
            }
        } catch (error) {
            console.error('更新模式显示名称失败:', error);
        }
    }
    
    function updateGameOverText() {
        try {
            const resultTitle = document.getElementById('result-title');
            const saveScoreBtn = document.getElementById('save-score-btn');
            const playAgainBtn = document.getElementById('play-again-btn');
            const viewLeaderboardBtn = document.getElementById('view-leaderboard-btn');
            const viewStatisticsBtn = document.getElementById('view-statistics-btn');
            const playerNameInput = document.getElementById('player-name');
            
            if (saveScoreBtn) saveScoreBtn.innerHTML = `<span>${translations[currentLanguage].saveScore}</span>`;
            if (playAgainBtn) playAgainBtn.innerHTML = `<span>${translations[currentLanguage].playAgain}</span>`;
            if (viewLeaderboardBtn) viewLeaderboardBtn.innerHTML = `<span>${translations[currentLanguage].viewLeaderboard}</span>`;
            if (viewStatisticsBtn) viewStatisticsBtn.innerHTML = `<span>${translations[currentLanguage].viewStatistics}</span>`;
            if (playerNameInput) playerNameInput.placeholder = translations[currentLanguage].playerNamePlaceholder;
            
            const finalScoreLabel = document.querySelector('.final-score-label');
            const finalCompletedLabel = document.querySelector('.final-completed-label');
            const finalTimeLabel = document.querySelector('.final-time-label');
            const finalAccuracyLabel = document.querySelector('.final-accuracy-label');
            
            if (finalScoreLabel) finalScoreLabel.textContent = translations[currentLanguage].finalScore;
            if (finalCompletedLabel) finalCompletedLabel.textContent = translations[currentLanguage].finalCompleted;
            if (finalTimeLabel) finalTimeLabel.textContent = translations[currentLanguage].finalTime;
            if (finalAccuracyLabel) finalAccuracyLabel.textContent = translations[currentLanguage].finalAccuracy;
        } catch (error) {
            console.error('更新游戏结束文字失败:', error);
        }
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
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
            showMessage(currentLanguage === 'zh' ? '📴 离线模式：请在本地服务器中运行游戏' : '📴 Offline mode: Please run on a local server', 'warning', 5000);
            return false;
        }
        
        const isLaptop = window.screen.width >= 1024 && window.screen.width <= 1440 && 
                        !('ontouchstart' in window) && window.navigator.maxTouchPoints === 0;
        
        if (isLaptop) {
            console.log('💻 检测到笔记本电脑，启用兼容模式');
            showMessage(translations[currentLanguage].laptopCompatibilityMode, 'info', 3000);
        }
        
        for (let i = 0; i < CONFIG.SUPABASE_URLS.length; i++) {
            try {
                const supabaseUrl = CONFIG.SUPABASE_URLS[i];
                const supabaseKey = CONFIG.SUPABASE_ANON_KEY;
                
                console.log(`尝试连接 Supabase (${i + 1}/${CONFIG.SUPABASE_URLS.length})...`);
                
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
                
                const { error } = await supabase.auth.getSession();
                
                if (!error) {
                    console.log(`✅ Supabase连接成功 (节点 ${i + 1})`);
                    isSupabaseReady = true;
                    offlineMode = false;
                    syncState.offlineMode = false;
                    return true;
                } else {
                    console.warn(`⚠️ 节点 ${i + 1} 连接失败:`, error.message);
                }
            } catch (e) {
                console.warn(`⚠️ 节点 ${i + 1} 连接异常:`, e.message);
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
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
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error) {
                console.error('获取用户失败:', error);
                return false;
            }
            
            if (user) {
                currentUser = user;
                console.log('用户已登录:', user.email);
                
                await checkUserRole(); // 新增：检查用户角色
                updateUserInfo();
                
                setTimeout(async () => {
                    await loadAchievementsFromCloud();
                    await loadWrongQuestionsFromCloud();
                    await loadUserStats();
                    await loadUserScores();
                    
                    if (syncState.lastSyncTime) {
                        const lastSync = new Date(syncState.lastSyncTime);
                        const now = new Date();
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
    
    // ==================== 新增：完整的角色检查函数 ====================
    async function checkUserRole() {
        if (!currentUser) {
            isAdminUser = false;
            isSuperAdmin = false;
            isSchoolAdmin = false;
            isTeacher = false;
            return false;
        }
        
        try {
            const userEmail = currentUser.email?.toLowerCase() || '';
            const userMeta = currentUser.user_metadata || {};
            const userRole = userMeta.role || 'student';
            
            console.log('检查用户角色:', { email: userEmail, role: userRole, metadata: userMeta });
            
            // 1. 超级管理员检查（多种方式）
            isSuperAdmin = (
                userRole === 'super_admin' ||
                userRole === 'admin' ||  // 兼容旧数据
                CONFIG.ADMIN_EMAILS.some(adminEmail => adminEmail.toLowerCase() === userEmail) ||
                userMeta.is_super_admin === true
            );
            
            // 2. 学校管理员检查
            isSchoolAdmin = (
                userRole === 'school_admin' ||
                (userRole === 'admin' && userMeta.school_id) ||  // 有学校ID的admin视为学校管理员
                isSuperAdmin  // 超级管理员自动拥有学校管理员权限
            );
            
            // 3. 教师检查
            isTeacher = (
                userRole === 'teacher' ||
                (userRole === 'admin' && userMeta.approved === true) ||
                isSchoolAdmin  // 学校管理员自动拥有教师权限
            );
            
            // 4. 兼容旧代码的 isAdminUser
            isAdminUser = isSuperAdmin || isSchoolAdmin;
            
            console.log('角色检查结果:', {
                isSuperAdmin,
                isSchoolAdmin,
                isTeacher,
                isAdminUser
            });
            
            return true;
        } catch (error) {
            console.error('检查用户角色失败:', error);
            return false;
        }
    }
    
    async function checkIfAdmin() {
        // 兼容旧函数，调用新函数
        await checkUserRole();
        return isAdminUser;
    }
    
    async function login(email, password) {
        try {
            if (!isSupabaseReady || !supabase || offlineMode) {
                showMessage(currentLanguage === 'zh' ? '离线模式无法登录' : 'Cannot login in offline mode', 'error');
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
                
                await checkUserRole(); // 使用新函数
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
            if (!isSupabaseReady || !supabase || offlineMode) {
                showMessage(currentLanguage === 'zh' ? '离线模式无法注册' : 'Cannot register in offline mode', 'error');
                return false;
            }
            
            const userMetadata = {
                username: username?.trim() || email.split('@')[0],
                role: 'student'
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
                
                await checkUserRole(); // 使用新函数
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
            
            const { error } = await supabase.auth.signOut();
            
            if (error) {
                showMessage(currentLanguage === 'zh' ? '退出失败: ' : 'Logout failed: ' + error.message, 'error');
                return;
            }
            
            currentUser = null;
            isAdminUser = false;
            isSuperAdmin = false;
            isSchoolAdmin = false;
            isTeacher = false;
            
            const userInfo = document.getElementById('user-info');
            const teacherToolsBtn = document.getElementById('teacher-tools-btn');
            const adminToolsBtn = document.getElementById('admin-tools-btn');
            const syncStatusBtn = document.getElementById('sync-status-btn');
            const teacherApplicationBtn = document.getElementById('teacher-application-btn');
            
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
    
    // ==================== 修复版 updateUserInfo 函数 ====================
    function updateUserInfo() {
        if (!currentUser) return;
        
        try {
            const userInfo = document.getElementById('user-info');
            const userAvatar = document.getElementById('user-avatar');
            const userName = document.getElementById('user-name');
            const teacherToolsBtn = document.getElementById('teacher-tools-btn');
            const adminToolsBtn = document.getElementById('admin-tools-btn');
            const syncStatusBtn = document.getElementById('sync-status-btn');
            const teacherApplicationBtn = document.getElementById('teacher-application-btn');
            
            if (!userInfo || !userAvatar || !userName) return;
            
            userInfo.style.display = 'flex';
            const email = currentUser.email || '';
            const firstLetter = email.charAt(0).toUpperCase() || '?';
            userAvatar.textContent = firstLetter;
            
            const username = currentUser.user_metadata?.username || email.split('@')[0];
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
            
            const userRole = currentUser.user_metadata?.role;
            
            // 教师申请按钮：只有学生角色显示
            if (teacherApplicationBtn) {
                if (userRole === 'student' || !userRole) {
                    teacherApplicationBtn.style.display = 'flex';
                    const span = teacherApplicationBtn.querySelector('span');
                    if (span) span.textContent = translations[currentLanguage].applyForTeacher;
                } else {
                    teacherApplicationBtn.style.display = 'none';
                }
            }
            
            // 教师工具按钮：超级管理员、学校管理员、已批准的教师可见
            if (teacherToolsBtn) {
                const showTeacherTools = isSuperAdmin || isSchoolAdmin || 
                    (userRole === 'teacher' && currentUser.user_metadata?.approved === true);
                
                teacherToolsBtn.style.display = showTeacherTools ? 'flex' : 'none';
                if (showTeacherTools) {
                    const span = teacherToolsBtn.querySelector('span');
                    if (span) span.textContent = translations[currentLanguage].teacherTools || '教师工具';
                }
            }
            
            // 管理员工具按钮：只有超级管理员可见
            if (adminToolsBtn) {
                adminToolsBtn.style.display = isSuperAdmin ? 'flex' : 'none';
                if (isSuperAdmin) {
                    const span = adminToolsBtn.querySelector('span');
                    if (span) span.textContent = translations[currentLanguage].adminTools || '管理工具';
                }
            }
            
            // 调试信息
            console.log('UI更新 - 权限状态:', {
                isSuperAdmin,
                isSchoolAdmin,
                isTeacher,
                showTeacherTools: teacherToolsBtn?.style.display,
                showAdminTools: adminToolsBtn?.style.display
            });
            
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
                    translations[currentLanguage].loginTitle : 
                    translations[currentLanguage].registerTitle;
            }
            
            if (authSubmitBtn) {
                authSubmitBtn.textContent = isLogin ? 
                    translations[currentLanguage].loginButton : 
                    translations[currentLanguage].registerButton;
            }
            
            if (authSwitchText) {
                authSwitchText.textContent = isLogin ? 
                    translations[currentLanguage].noAccount : 
                    translations[currentLanguage].hasAccount;
            }
            
            if (authSwitchLink) {
                authSwitchLink.textContent = isLogin ? 
                    translations[currentLanguage].registerNow : 
                    translations[currentLanguage].loginNow;
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
                showMessage(translations[currentLanguage].needLogin, 'error');
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
            
            const { data: existingApp, error: checkError } = await supabase
                .from('teacher_applications')
                .select('*')
                .eq('user_id', currentUser.id)
                .eq('status', 'pending')
                .limit(1);
            
            if (checkError) {
                console.error('检查教师申请失败:', checkError);
            }
            
            if (existingApp && existingApp.length > 0) {
                showMessage(translations[currentLanguage].alreadyApplied, 'info');
                return;
            }
            
            const applicationHtml = `
                <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 20px; padding: 30px; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); z-index: 4000;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h3 style="color: #4CAF50; margin: 0; font-size: clamp(18px, 5vw, 24px);">👨‍🏫 ${translations[currentLanguage].teacherApplication}</h3>
                        <button id="close-application-btn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">✕</button>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold; font-size: clamp(14px, 4vw, 16px);">${translations[currentLanguage].schoolName}</label>
                        <input id="app-school" type="text" placeholder="${translations[currentLanguage].schoolNamePlaceholder}" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: clamp(14px, 4vw, 16px);">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold; font-size: clamp(14px, 4vw, 16px);">${translations[currentLanguage].stateRegion}</label>
                        <input id="app-state" type="text" placeholder="${translations[currentLanguage].stateRegionPlaceholder}" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: clamp(14px, 4vw, 16px);">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold; font-size: clamp(14px, 4vw, 16px);">${translations[currentLanguage].teachingSubject}</label>
                        <input id="app-subject" type="text" placeholder="${translations[currentLanguage].teachingSubjectPlaceholder}" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: clamp(14px, 4vw, 16px);">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold; font-size: clamp(14px, 4vw, 16px);">${translations[currentLanguage].gradeLevel}</label>
                        <input id="app-grade" type="text" placeholder="${translations[currentLanguage].gradeLevelPlaceholder}" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: clamp(14px, 4vw, 16px);">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold; font-size: clamp(14px, 4vw, 16px);">${translations[currentLanguage].contactPhone}</label>
                        <input id="app-phone" type="tel" placeholder="${translations[currentLanguage].contactPhonePlaceholder}" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: clamp(14px, 4vw, 16px);">
                    </div>
                    
                    <div style="margin-bottom: 25px;">
                        <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold; font-size: clamp(14px, 4vw, 16px);">${translations[currentLanguage].reason}</label>
                        <textarea id="app-reason" rows="4" placeholder="${translations[currentLanguage].reasonPlaceholder}" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: clamp(14px, 4vw, 16px); resize: vertical;"></textarea>
                    </div>
                    
                    <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                        <button id="submit-application-btn" style="flex: 2; min-width: 200px; background: #4CAF50; color: white; border: none; padding: 14px; border-radius: 10px; font-weight: bold; font-size: clamp(14px, 4vw, 16px); cursor: pointer;">
                            📨 ${translations[currentLanguage].submitApplication}
                        </button>
                        <button id="cancel-application-btn" style="flex: 1; min-width: 100px; background: #f44336; color: white; border: none; padding: 14px; border-radius: 10px; font-weight: bold; font-size: clamp(14px, 4vw, 16px); cursor: pointer;">
                            ${translations[currentLanguage].cancel}
                        </button>
                    </div>
                </div>
            `;
            
            const applicationDiv = document.createElement('div');
            applicationDiv.id = 'teacher-application-modal';
            applicationDiv.innerHTML = applicationHtml;
            document.body.appendChild(applicationDiv);
            
            document.getElementById('close-application-btn').addEventListener('click', () => {
                applicationDiv.remove();
            });
            
            document.getElementById('cancel-application-btn').addEventListener('click', () => {
                applicationDiv.remove();
            });
            
            document.getElementById('submit-application-btn').addEventListener('click', async () => {
                const school = document.getElementById('app-school').value.trim();
                const state = document.getElementById('app-state').value.trim();
                const subject = document.getElementById('app-subject').value.trim();
                const grade = document.getElementById('app-grade').value.trim();
                const phone = document.getElementById('app-phone').value.trim();
                const reason = document.getElementById('app-reason').value.trim();
                
                if (!school || !state || !subject || !grade || !phone || !reason) {
                    showMessage(currentLanguage === 'zh' ? '请填写所有字段' : 'Please fill in all fields', 'error');
                    return;
                }
                
                await submitTeacherApplication(school, state, subject, grade, phone, reason);
                applicationDiv.remove();
            });
        } catch (error) {
            console.error('显示教师申请表单失败:', error);
        }
    }
    
    async function submitTeacherApplication(school, state, subject, grade, phone, reason) {
        try {
            if (!currentUser) {
                showMessage(translations[currentLanguage].needLogin, 'error');
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
            
            const applicationData = {
                user_id: currentUser.id,
                email: currentUser.email,
                username: currentUser.user_metadata?.username || currentUser.email?.split('@')[0],
                school: school,
                state: state,
                subject: subject,
                grade: grade,
                phone: phone,
                reason: reason,
                status: 'pending',
                created_at: new Date().toISOString()
            };
            
            const { error } = await supabase
                .from('teacher_applications')
                .insert([applicationData]);
            
            if (error) {
                console.error('提交教师申请失败:', error);
                showMessage(translations[currentLanguage].applicationFailed, 'error');
                return false;
            }
            
            await sendTeacherApplicationEmail(applicationData);
            
            showMessage(translations[currentLanguage].applicationSubmitted, 'success');
            return true;
        } catch (error) {
            console.error('提交教师申请异常:', error);
            showMessage(translations[currentLanguage].applicationFailed, 'error');
            return false;
        }
    }
    
    async function sendTeacherApplicationEmail(applicationData) {
        try {
            const emailContent = `
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
            
            const { error } = await supabase
                .from('email_notifications')
                .insert([{
                    recipient: CONFIG.ADMIN_EMAILS[0],
                    subject: '新的教师账号申请 - ' + applicationData.email,
                    content: emailContent,
                    status: 'pending',
                    created_at: new Date().toISOString()
                }]);
            
            if (error) {
                console.error('存储邮件通知失败:', error);
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
                showMessage(translations[currentLanguage].needLogin, 'error');
                showAuthModal();
                return;
            }
            
            // ✅ 添加离线模式检查
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
            
            // 使用新的角色检查
            const canUseTeacherTools = isSuperAdmin || isSchoolAdmin || 
                (isTeacher && currentUser.user_metadata?.approved === true);
            
            if (!canUseTeacherTools) {
                showMessage(
                    currentLanguage === 'zh' 
                        ? '只有已批准的教师、学校管理员或超级管理员可以使用此功能' 
                        : 'Only approved teachers, school administrators or super administrators can use this feature',
                    'error'
                );
                return;
            }
            
            const teacherToolsModal = document.getElementById('teacher-tools-modal');
            if (!teacherToolsModal) return;
            
            // 加载待审核教师申请列表
            let pendingApplications = [];
            try {
                let query = supabase
                    .from('teacher_applications')
                    .select('*')
                    .eq('status', 'pending')
                    .order('created_at', { ascending: false });
                
                // 学校管理员只能看到本校申请
                if (isSchoolAdmin && !isSuperAdmin) {
                    const schoolId = currentUser.user_metadata?.school_id;
                    if (schoolId) {
                        query = query.eq('school_id', schoolId);
                    }
                }
                
                const { data, error } = await query;
                
                if (!error) {
                    pendingApplications = data || [];
                }
            } catch (e) {
                console.error('加载待审核教师申请失败:', e);
            }
            
            // 加载已批准教师列表
            let approvedTeachers = [];
            try {
                let query = supabase
                    .from('teacher_applications')
                    .select('*')
                    .eq('status', 'approved')
                    .order('created_at', { ascending: false });
                
                // 学校管理员只能看到本校教师
                if (isSchoolAdmin && !isSuperAdmin) {
                    const schoolId = currentUser.user_metadata?.school_id;
                    if (schoolId) {
                        query = query.eq('school_id', schoolId);
                    }
                }
                
                const { data, error } = await query;
                
                if (!error) {
                    approvedTeachers = data || [];
                }
            } catch (e) {
                console.error('加载已批准教师失败:', e);
            }
            
            // 生成教师工具界面
            const teacherToolsHtml = `
                <div style="padding: 25px; max-width: 1200px; margin: 0 auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; flex-wrap: wrap; gap: 15px;">
                        <h3 style="color: #4CAF50; margin: 0; display: flex; align-items: center;">
                            <span style="font-size: 2em; margin-right: 10px;">👨‍🏫</span>
                            ${translations[currentLanguage].teacherToolsTitle}
                        </h3>
                        <button id="close-teacher-tools" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 30px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                            ✕ ${translations[currentLanguage].close}
                        </button>
                    </div>
                    
                    <!-- 标签页导航 -->
                    <div style="display: flex; border-bottom: 2px solid #e0e0e0; margin-bottom: 25px; overflow-x: auto; gap: 10px;">
                        <button class="teacher-tab active" data-tab="batch-register" style="padding: 12px 24px; background: none; border: none; border-bottom: 3px solid #4CAF50; font-weight: bold; color: #333; cursor: pointer; white-space: nowrap;">
                            📦 ${translations[currentLanguage].batchRegister}
                        </button>
                        <button class="teacher-tab" data-tab="teacher-approval" style="padding: 12px 24px; background: none; border: none; border-bottom: 3px solid transparent; font-weight: bold; color: #666; cursor: pointer; white-space: nowrap;">
                            ✅ ${translations[currentLanguage].teacherApproval}
                            ${pendingApplications.length > 0 ? `<span style="background: #ff4444; color: white; padding: 2px 8px; border-radius: 12px; margin-left: 8px; font-size: 0.8em;">${pendingApplications.length}</span>` : ''}
                        </button>
                        <button class="teacher-tab" data-tab="class-management" style="padding: 12px 24px; background: none; border: none; border-bottom: 3px solid transparent; font-weight: bold; color: #666; cursor: pointer; white-space: nowrap;">
                            📚 ${translations[currentLanguage].classManagement}
                        </button>
                    </div>
                    
                    <!-- 批量注册标签页 -->
                    <div id="batch-register-tab" class="teacher-tab-content" style="display: block;">
                        <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; margin-bottom: 20px; color: #333;">${translations[currentLanguage].batchRegister}</h4>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 25px;">
                                <div>
                                    <label style="display: block; margin-bottom: 8px; color: #666; font-weight: bold;">${translations[currentLanguage].defaultPassword}</label>
                                    <input id="default-password" type="text" placeholder="${translations[currentLanguage].defaultPasswordPlaceholder}" value="stu123456" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px;">
                                </div>
                                <div>
                                    <label style="display: block; margin-bottom: 8px; color: #666; font-weight: bold;">${translations[currentLanguage].className}</label>
                                    <input id="class-name" type="text" placeholder="${translations[currentLanguage].classNamePlaceholder}" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px;">
                                </div>
                            </div>
                            
                            <div style="display: flex; gap: 15px; margin-bottom: 25px; flex-wrap: wrap;">
                                <button id="download-template-btn" style="background: #6c757d; color: white; border: none; padding: 12px 25px; border-radius: 30px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                                    📥 ${translations[currentLanguage].downloadTemplate}
                                </button>
                                <div style="position: relative; display: inline-block;">
                                    <input type="file" id="excel-file" accept=".csv,.xlsx,.xls" style="position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer;">
                                    <button id="upload-excel-btn" style="background: #4CAF50; color: white; border: none; padding: 12px 25px; border-radius: 30px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                                        📤 ${translations[currentLanguage].uploadExcel}
                                    </button>
                                </div>
                            </div>
                            
                            <!-- 上传进度 -->
                            <div id="upload-progress" style="display: none; margin-bottom: 25px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="color: #666;">${translations[currentLanguage].uploadProgress}</span>
                                    <span id="upload-status" style="color: #4CAF50;">0%</span>
                                </div>
                                <div style="background: #f0f0f0; border-radius: 10px; height: 10px; overflow: hidden;">
                                    <div id="upload-progress-bar" style="width: 0%; background: #4CAF50; height: 100%; transition: width 0.3s ease;"></div>
                                </div>
                            </div>
                            
                            <!-- 上传结果 -->
                            <div id="upload-result" style="display: none; background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 25px;"></div>
                            
                            <!-- 生成的账号卡片 -->
                            <div id="account-cards" style="display: none;">
                                <h4 style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                                    <span>${translations[currentLanguage].accountCards}</span>
                                    <button id="print-cards-btn" style="background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 20px; font-size: 0.9em; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                                        🖨️ ${translations[currentLanguage].printCards}
                                    </button>
                                </h4>
                                <div id="account-cards-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px;"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 教师审核标签页 -->
                    <div id="teacher-approval-tab" class="teacher-tab-content" style="display: none;">
                        <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; margin-bottom: 20px; color: #333; display: flex; align-items-center;">
                                <span>${translations[currentLanguage].teacherApproval}</span>
                                <span style="background: #ff4444; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8em; margin-left: 15px;">${pendingApplications.length}</span>
                            </h4>
                            
                            ${pendingApplications.length === 0 ? `
                                <div style="text-align: center; padding: 40px 20px; background: #f8f9fa; border-radius: 12px;">
                                    <div style="font-size: 3em; margin-bottom: 15px; opacity: 0.5;">👨‍🏫</div>
                                    <p style="color: #666; margin: 0;">${translations[currentLanguage].noPendingApplications}</p>
                                </div>
                            ` : `
                                <div style="overflow-x: auto;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <thead>
                                            <tr style="background: #f8f9fa; border-bottom: 2px solid #e0e0e0;">
                                                <th style="padding: 15px; text-align: left; color: #666;">${translations[currentLanguage].applicant}</th>
                                                <th style="padding: 15px; text-align: left; color: #666;">${translations[currentLanguage].schoolName}</th>
                                                <th style="padding: 15px; text-align: left; color: #666;">${translations[currentLanguage].teachingSubject}</th>
                                                <th style="padding: 15px; text-align: left; color: #666;">${translations[currentLanguage].applyTime}</th>
                                                <th style="padding: 15px; text-align: center; color: #666;">${translations[currentLanguage].status}</th>
                                                <th style="padding: 15px; text-align: center; color: #666;">${translations[currentLanguage].approve}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${pendingApplications.map(app => `
                                                <tr style="border-bottom: 1px solid #f0f0f0;">
                                                    <td style="padding: 15px;">
                                                        <div style="font-weight: bold; color: #333;">${app.username || app.email.split('@')[0]}</div>
                                                        <div style="color: #666; font-size: 0.85em;">${app.email}</div>
                                                    </td>
                                                    <td style="padding: 15px; color: #333;">${app.school}</td>
                                                    <td style="padding: 15px; color: #333;">${app.subject} (${app.grade})</td>
                                                    <td style="padding: 15px; color: #999; font-size: 0.9em;">${new Date(app.created_at).toLocaleDateString()}</td>
                                                    <td style="padding: 15px; text-align: center;">
                                                        <span style="background: #FF9800; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.85em;">${translations[currentLanguage].pending}</span>
                                                    </td>
                                                    <td style="padding: 15px; text-align: center;">
                                                        <button class="approve-teacher-btn" data-user-id="${app.user_id}" data-email="${app.email}" style="background: #4CAF50; color: white; border: none; padding: 6px 16px; border-radius: 20px; font-size: 0.85em; cursor: pointer; margin-right: 8px;">
                                                            ✓ ${translations[currentLanguage].approve}
                                                        </button>
                                                        <button class="reject-teacher-btn" data-user-id="${app.user_id}" data-email="${app.email}" style="background: #ff4444; color: white; border: none; padding: 6px 16px; border-radius: 20px; font-size: 0.85em; cursor: pointer;">
                                                            ✗ ${translations[currentLanguage].reject}
                                                        </button>
                                                    </td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            `}
                            
                            <!-- 已批准教师列表 -->
                            <h4 style="margin-top: 40px; margin-bottom: 20px; color: #333;">${translations[currentLanguage].approvedTeachers} (${approvedTeachers.length})</h4>
                            
                            ${approvedTeachers.length === 0 ? `
                                <div style="text-align: center; padding: 30px 20px; background: #f8f9fa; border-radius: 12px;">
                                    <p style="color: #999; margin: 0;">${translations[currentLanguage].noApprovedTeachers}</p>
                                </div>
                            ` : `
                                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px;">
                                    ${approvedTeachers.slice(0, 5).map(app => `
                                        <div style="background: #f8f9fa; border-radius: 12px; padding: 15px; border-left: 4px solid #4CAF50;">
                                            <div style="font-weight: bold; color: #333; margin-bottom: 5px;">${app.username || app.email.split('@')[0]}</div>
                                            <div style="color: #666; font-size: 0.85em; margin-bottom: 3px;">${app.email}</div>
                                            <div style="color: #666; font-size: 0.85em;">${app.school} · ${app.subject}</div>
                                            <div style="color: #999; font-size: 0.75em; margin-top: 8px;">✓ ${new Date(app.created_at).toLocaleDateString()}</div>
                                        </div>
                                    `).join('')}
                                    ${approvedTeachers.length > 5 ? `
                                        <div style="text-align: center; padding: 15px; color: #666;">
                                            ... 还有 ${approvedTeachers.length - 5} 名已批准教师
                                        </div>
                                    ` : ''}
                                </div>
                            `}
                        </div>
                    </div>
                    
                    <!-- 班级管理标签页 -->
                    <div id="class-management-tab" class="teacher-tab-content" style="display: none;">
                        <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; margin-bottom: 20px; color: #333;">${translations[currentLanguage].classManagement}</h4>
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
            
            // 绑定标签页切换事件
            const teacherTabs = teacherToolsModal.querySelectorAll('.teacher-tab');
            teacherTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    teacherTabs.forEach(t => {
                        t.classList.remove('active');
                        t.style.borderBottomColor = 'transparent';
                        t.style.color = '#666';
                    });
                    
                    this.classList.add('active');
                    this.style.borderBottomColor = '#4CAF50';
                    this.style.color = '#333';
                    
                    const tabId = this.dataset.tab;
                    teacherToolsModal.querySelectorAll('.teacher-tab-content').forEach(content => {
                        content.style.display = 'none';
                    });
                    teacherToolsModal.querySelector(`#${tabId}-tab`).style.display = 'block';
                });
            });
            
            // 绑定关闭按钮
            teacherToolsModal.querySelector('#close-teacher-tools').addEventListener('click', () => {
                teacherToolsModal.style.display = 'none';
            });
            
            // 绑定下载模板按钮
            teacherToolsModal.querySelector('#download-template-btn')?.addEventListener('click', downloadTemplate);
            
            // 绑定上传Excel按钮
            teacherToolsModal.querySelector('#upload-excel-btn')?.addEventListener('click', () => {
                document.getElementById('excel-file').click();
            });
            
            // 绑定文件选择事件
            const excelFile = document.getElementById('excel-file');
            if (excelFile) {
                excelFile.addEventListener('change', uploadExcelFile);
            }
            
            // 绑定打印卡片按钮
            teacherToolsModal.querySelector('#print-cards-btn')?.addEventListener('click', printAccountCards);
            
            // 绑定批准教师按钮
            teacherToolsModal.querySelectorAll('.approve-teacher-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const userId = e.currentTarget.dataset.userId;
                    const email = e.currentTarget.dataset.email;
                    await approveTeacherApplication(userId, email);
                    showTeacherTools(); // 刷新界面
                });
            });
            
            // 绑定拒绝教师按钮
            teacherToolsModal.querySelectorAll('.reject-teacher-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const userId = e.currentTarget.dataset.userId;
                    const email = e.currentTarget.dataset.email;
                    await rejectTeacherApplication(userId, email);
                    showTeacherTools(); // 刷新界面
                });
            });
            
        } catch (error) {
            console.error('显示教师工具失败:', error);
            showMessage(currentLanguage === 'zh' ? '加载教师工具失败' : 'Failed to load teacher tools', 'error');
        }
    }
    
    // ==================== 修复版管理员工具 ====================
    async function showAdminTools() {
        try {
            if (!currentUser) {
                showMessage(translations[currentLanguage].needLogin, 'error');
                showAuthModal();
                return;
            }
            
            // 使用新的超级管理员检查
            if (!isSuperAdmin) {
                showMessage(
                    currentLanguage === 'zh' 
                        ? '只有超级管理员可以访问此功能' 
                        : 'Only super administrators can access this feature',
                    'error'
                );
                return;
            }
            
            // ✅ 添加离线模式检查
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
            
            const adminToolsModal = document.getElementById('admin-tools-modal');
            if (!adminToolsModal) return;
            
            // 加载系统统计数据
            let systemStats = {
                totalUsers: 0,
                totalTeachers: 0,
                totalStudents: 0,
                totalGames: 0,
                totalQuestions: 0,
                avgAccuracy: 0
            };
            
            try {
                // 获取用户统计
                const { count: userCount } = await supabase
                    .from('game_scores')
                    .select('user_id', { count: 'exact', head: true });
                systemStats.totalUsers = userCount || 0;
                
                // 获取游戏统计
                const { data: gameStats } = await supabase
                    .from('game_scores')
                    .select('score, questions_completed, correct_count, total_attempts');
                
                if (gameStats) {
                    systemStats.totalGames = gameStats.length;
                    systemStats.totalQuestions = gameStats.reduce((sum, g) => sum + (g.questions_completed || 0), 0);
                    const totalCorrect = gameStats.reduce((sum, g) => sum + (g.correct_count || 0), 0);
                    const totalAttempts = gameStats.reduce((sum, g) => sum + (g.total_attempts || 0), 0);
                    systemStats.avgAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
                }
            } catch (e) {
                console.error('加载系统统计失败:', e);
            }
            
            // 生成管理员工具界面
            const adminToolsHtml = `
                <div style="padding: 25px; max-width: 1200px; margin: 0 auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; flex-wrap: wrap; gap: 15px;">
                        <h3 style="color: #4CAF50; margin: 0; display: flex; align-items: center;">
                            <span style="font-size: 2em; margin-right: 10px;">👑</span>
                            ${translations[currentLanguage].adminToolsTitle}
                        </h3>
                        <button id="close-admin-tools" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 30px; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                            ✕ ${translations[currentLanguage].close}
                        </button>
                    </div>
                    
                    <!-- 标签页导航 -->
                    <div style="display: flex; border-bottom: 2px solid #e0e0e0; margin-bottom: 25px; overflow-x: auto; gap: 10px;">
                        <button class="admin-tab active" data-tab="system-stats" style="padding: 12px 24px; background: none; border: none; border-bottom: 3px solid #4CAF50; font-weight: bold; color: #333; cursor: pointer; white-space: nowrap;">
                            📊 ${translations[currentLanguage].systemStats}
                        </button>
                        <button class="admin-tab" data-tab="teacher-management" style="padding: 12px 24px; background: none; border: none; border-bottom: 3px solid transparent; font-weight: bold; color: #666; cursor: pointer; white-space: nowrap;">
                            👨‍🏫 ${translations[currentLanguage].teacherManagement}
                        </button>
                        <button class="admin-tab" data-tab="system-logs" style="padding: 12px 24px; background: none; border: none; border-bottom: 3px solid transparent; font-weight: bold; color: #666; cursor: pointer; white-space: nowrap;">
                            📋 ${translations[currentLanguage].systemLogs}
                        </button>
                        <button class="admin-tab" data-tab="data-management" style="padding: 12px 24px; background: none; border: none; border-bottom: 3px solid transparent; font-weight: bold; color: #666; cursor: pointer; white-space: nowrap;">
                            💾 ${translations[currentLanguage].dataManagement}
                        </button>
                        <button class="admin-tab" data-tab="system-settings" style="padding: 12px 24px; background: none; border: none; border-bottom: 3px solid transparent; font-weight: bold; color: #666; cursor: pointer; white-space: nowrap;">
                            ⚙️ ${translations[currentLanguage].systemSettings}
                        </button>
                    </div>
                    
                    <!-- 系统统计标签页 -->
                    <div id="system-stats-tab" class="admin-tab-content" style="display: block;">
                        <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; margin-bottom: 25px; color: #333;">${translations[currentLanguage].systemStats}</h4>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 15px; text-align: center;">
                                    <div style="font-size: 2em; margin-bottom: 10px;">👥</div>
                                    <div style="font-size: 0.9em; opacity: 0.9;">${translations[currentLanguage].totalUsers}</div>
                                    <div style="font-size: 2.5em; font-weight: bold;">${systemStats.totalUsers}</div>
                                </div>
                                <div style="background: linear-gradient(135deg, #6b8cff 0%, #4a6cf7 100%); color: white; padding: 20px; border-radius: 15px; text-align: center;">
                                    <div style="font-size: 2em; margin-bottom: 10px;">🎮</div>
                                    <div style="font-size: 0.9em; opacity: 0.9;">${translations[currentLanguage].totalGames}</div>
                                    <div style="font-size: 2.5em; font-weight: bold;">${systemStats.totalGames}</div>
                                </div>
                                <div style="background: linear-gradient(135deg, #ff8c5a 0%, #ff6b4a 100%); color: white; padding: 20px; border-radius: 15px; text-align: center;">
                                    <div style="font-size: 2em; margin-bottom: 10px;">❓</div>
                                    <div style="font-size: 0.9em; opacity: 0.9;">${translations[currentLanguage].totalQuestions}</div>
                                    <div style="font-size: 2.5em; font-weight: bold;">${systemStats.totalQuestions}</div>
                                </div>
                                <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 20px; border-radius: 15px; text-align: center;">
                                    <div style="font-size: 2em; margin-bottom: 10px;">🎯</div>
                                    <div style="font-size: 0.9em; opacity: 0.9;">${translations[currentLanguage].avgAccuracy}</div>
                                    <div style="font-size: 2.5em; font-weight: bold;">${systemStats.avgAccuracy}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 教师管理标签页 -->
                    <div id="teacher-management-tab" class="admin-tab-content" style="display: none;">
                        <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; margin-bottom: 25px; color: #333;">${translations[currentLanguage].teacherManagement}</h4>
                            <div style="text-align: center; padding: 40px 20px; background: #f8f9fa; border-radius: 12px;">
                                <div style="font-size: 3em; margin-bottom: 15px; opacity: 0.5;">👨‍🏫</div>
                                <p style="color: #666; margin: 0;">${currentLanguage === 'zh' ? '教师管理功能开发中，敬请期待...' : 'Teacher management feature coming soon...'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 系统日志标签页 -->
                    <div id="system-logs-tab" class="admin-tab-content" style="display: none;">
                        <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; margin-bottom: 25px; color: #333;">${translations[currentLanguage].systemLogs}</h4>
                            <div style="text-align: center; padding: 40px 20px; background: #f8f9fa; border-radius: 12px;">
                                <div style="font-size: 3em; margin-bottom: 15px; opacity: 0.5;">📋</div>
                                <p style="color: #666; margin: 0;">${currentLanguage === 'zh' ? '系统日志功能开发中，敬请期待...' : 'System logs feature coming soon...'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 数据管理标签页 -->
                    <div id="data-management-tab" class="admin-tab-content" style="display: none;">
                        <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; margin-bottom: 25px; color: #333;">${translations[currentLanguage].dataManagement}</h4>
                            <div style="text-align: center; padding: 40px 20px; background: #f8f9fa; border-radius: 12px;">
                                <div style="font-size: 3em; margin-bottom: 15px; opacity: 0.5;">💾</div>
                                <p style="color: #666; margin: 0;">${currentLanguage === 'zh' ? '数据管理功能开发中，敬请期待...' : 'Data management feature coming soon...'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 系统设置标签页 -->
                    <div id="system-settings-tab" class="admin-tab-content" style="display: none;">
                        <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                            <h4 style="margin-top: 0; margin-bottom: 25px; color: #333;">${translations[currentLanguage].systemSettings}</h4>
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
            
            // 绑定标签页切换事件
            const adminTabs = adminToolsModal.querySelectorAll('.admin-tab');
            adminTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    adminTabs.forEach(t => {
                        t.classList.remove('active');
                        t.style.borderBottomColor = 'transparent';
                        t.style.color = '#666';
                    });
                    
                    this.classList.add('active');
                    this.style.borderBottomColor = '#4CAF50';
                    this.style.color = '#333';
                    
                    const tabId = this.dataset.tab;
                    adminToolsModal.querySelectorAll('.admin-tab-content').forEach(content => {
                        content.style.display = 'none';
                    });
                    adminToolsModal.querySelector(`#${tabId}-tab`).style.display = 'block';
                });
            });
            
            // 绑定关闭按钮
            adminToolsModal.querySelector('#close-admin-tools').addEventListener('click', () => {
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
            // 使用新的角色检查
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
            
            // ✅ 由于客户端无法使用 admin API，改为更新申请表状态并提供手动操作指引
            const { error: appError } = await supabase
                .from('teacher_applications')
                .update({
                    status: 'approved',
                    reviewed_at: new Date().toISOString(),
                    reviewed_by: currentUser.id,
                    admin_notes: '已批准（需手动更新用户角色）'
                })
                .eq('user_id', userId)
                .eq('status', 'pending');
            
            if (appError) {
                console.error('更新申请状态失败:', appError);
                showMessage(
                    currentLanguage === 'zh' ? '更新申请状态失败' : 'Failed to update application status',
                    'error'
                );
                return;
            }
            
            // ✅ 显示手动操作指引
            showMessage(
                currentLanguage === 'zh' 
                    ? `✅ 已标记申请为"已批准"。请登录 Supabase 后台，找到用户 ${email}，将 user_metadata.role 改为 "teacher"` 
                    : `✅ Application marked as approved. Please login to Supabase dashboard, find user ${email}, and set user_metadata.role to "teacher"`,
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
            
            const { error: appError } = await supabase
                .from('teacher_applications')
                .update({
                    status: 'rejected',
                    reviewed_at: new Date().toISOString(),
                    reviewed_by: currentUser.id,
                    admin_notes: '已拒绝'
                })
                .eq('user_id', userId)
                .eq('status', 'pending');
            
            if (appError) {
                console.error('更新申请状态失败:', appError);
                showMessage(
                    currentLanguage === 'zh' ? '拒绝失败：' + appError.message : 'Rejection failed: ' + appError.message,
                    'error'
                );
                return;
            }
            
            showMessage(
                currentLanguage === 'zh' ? `❌ 已拒绝教师申请: ${email}` : `❌ Rejected teacher application: ${email}`,
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
    
    // ==================== 教师工具辅助函数（修复版）====================
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
    
    async function uploadExcelFile(e) {
        try {
            const file = e.target.files[0];
            if (!file) return;
            
            // ✅ 添加元素存在性检查
            const uploadProgress = document.getElementById('upload-progress');
            const uploadProgressBar = document.getElementById('upload-progress-bar');
            const uploadStatus = document.getElementById('upload-status');
            const uploadResult = document.getElementById('upload-result');
            const accountCards = document.getElementById('account-cards');
            const accountCardsContainer = document.getElementById('account-cards-container');
            
            if (!uploadProgress || !uploadProgressBar || !uploadStatus) {
                console.error('上传进度元素不存在');
                showMessage(
                    currentLanguage === 'zh' ? '界面元素加载失败' : 'UI elements not loaded',
                    'error'
                );
                return;
            }
            
            const defaultPassword = document.getElementById('default-password')?.value.trim() || 'stu123456';
            const className = document.getElementById('class-name')?.value.trim() || '未命名班级';
            
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
                        successfulStudents.forEach((student) => {
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
            e.target.value = ''; // 清空文件选择
            
        } catch (error) {
            console.error('上传文件失败:', error);
            showMessage(currentLanguage === 'zh' ? '上传文件失败' : 'Failed to upload file', 'error');
        }
    }
    
    // ==================== 修复版打印账号卡片 ====================
    function printAccountCards() {
        try {
            // ✅ 添加元素存在性检查
            const container = document.getElementById('account-cards-container');
            if (!container) {
                showMessage(
                    currentLanguage === 'zh' ? '没有可打印的账号卡片' : 'No account cards to print',
                    'error'
                );
                return;
            }
            
            const printContent = container.innerHTML;
            if (!printContent.trim()) {
                showMessage(
                    currentLanguage === 'zh' ? '没有可打印的内容' : 'No content to print',
                    'error'
                );
                return;
            }
            
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
    
    // ==================== 云端同步核心功能 ====================
    function initCloudSync() {
        try {
            const savedSyncState = localStorage.getItem('mathGameSyncState');
            if (savedSyncState) {
                syncState = JSON.parse(savedSyncState);
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
        
        autoSyncTimer = setInterval(() => {
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
    
    function addSyncHistory(type, status, details = '') {
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
            
            const localScores = localStorage.getItem(`mathGameScores_${currentUser.id}_pending`);
            if (localScores) {
                const pendingScores = JSON.parse(localScores);
                for (const score of pendingScores) {
                    await supabase.from('game_scores').insert([score]);
                }
                localStorage.removeItem(`mathGameScores_${currentUser.id}_pending`);
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
            const savedStates = localStorage.getItem('mathGameAchievementStates');
            if (savedStates) {
                const parsed = JSON.parse(savedStates);
                achievementStates = new Map(Object.entries(parsed));
            } else {
                LADDER_ACHIEVEMENTS.forEach(ach => {
                    achievementStates.set(ach.id, {
                        unlocked: false,
                        progress: 0,
                        unlockedAt: null
                    });
                });
            }
            
            const savedStats = localStorage.getItem('mathGamePlayerStats');
            if (savedStats) {
                playerStats = JSON.parse(savedStats);
            }
            
            if (currentUser && isSupabaseReady && !offlineMode) {
                setTimeout(() => {
                    loadAchievementsFromCloud();
                }, 1000);
            }
        } catch (error) {
            console.error('加载成就失败:', error);
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
            const statesObject = {};
            achievementStates.forEach((value, key) => {
                statesObject[key] = value;
            });
            
            localStorage.setItem('mathGameAchievementStates', JSON.stringify(statesObject));
            localStorage.setItem('mathGamePlayerStats', JSON.stringify(playerStats));
            
            syncState.pendingChanges = true;
            saveSyncState();
            
            if (currentUser && isSupabaseReady && !offlineMode) {
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
            if (!currentUser || !isSupabaseReady || !supabase) return false;
            
            const statesObject = {};
            achievementStates.forEach((value, key) => {
                statesObject[key] = value;
            });
            
            const achievementData = {
                user_id: currentUser.id,
                email: currentUser.email,
                achievement_states: statesObject,
                player_stats: playerStats,
                updated_at: new Date().toISOString(),
                version: syncState.dataVersion
            };
            
            const { data: existingData } = await supabase
                .from('player_achievements')
                .select('id')
                .eq('user_id', currentUser.id)
                .limit(1);
            
            if (existingData && existingData.length > 0) {
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
            
            const { data, error } = await supabase
                .from('player_achievements')
                .select('*')
                .eq('user_id', currentUser.id)
                .limit(1);
            
            if (error) {
                console.error('从云端加载成就失败:', error);
                return false;
            }
            
            if (data && data.length > 0) {
                const cloudData = data[0];
                
                if (cloudData.achievement_states) {
                    Object.entries(cloudData.achievement_states).forEach(([key, value]) => {
                        if (achievementStates.has(key)) {
                            const local = achievementStates.get(key);
                            if (value.unlocked && !local.unlocked) {
                                achievementStates.set(key, value);
                            } else if (value.progress > local.progress) {
                                local.progress = value.progress;
                                achievementStates.set(key, local);
                            }
                        }
                    });
                }
                
                if (cloudData.player_stats) {
                    playerStats.gamesCompleted = Math.max(playerStats.gamesCompleted, cloudData.player_stats.gamesCompleted || 0);
                    playerStats.bestScore = Math.max(playerStats.bestScore, cloudData.player_stats.bestScore || 0);
                    playerStats.bestAccuracy = Math.max(playerStats.bestAccuracy, cloudData.player_stats.bestAccuracy || 0);
                    playerStats.fastestAnswer = Math.min(playerStats.fastestAnswer, cloudData.player_stats.fastestAnswer || 999);
                    playerStats.totalQuestions = Math.max(playerStats.totalQuestions, cloudData.player_stats.totalQuestions || 0);
                    playerStats.totalCorrect = Math.max(playerStats.totalCorrect, cloudData.player_stats.totalCorrect || 0);
                    playerStats.totalAttempts = Math.max(playerStats.totalAttempts, cloudData.player_stats.totalAttempts || 0);
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
        
        const currentAccuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;
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
        let unlockedCount = 0;
        
        LADDER_ACHIEVEMENTS.forEach(ach => {
            const state = achievementStates.get(ach.id);
            if (!state || !state.unlocked) {
                const isUnlocked = checkAchievementRequirement(ach);
                if (isUnlocked) {
                    achievementStates.set(ach.id, {
                        unlocked: true,
                        progress: 100,
                        unlockedAt: new Date().toISOString()
                    });
                    
                    showAchievementUnlock(ach);
                    unlockedCount++;
                } else {
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
            updateAchievementCounts();
            saveAchievements();
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
            padding: clamp(20px, 5vw, 30px);
            border-radius: 20px;
            z-index: 9999;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            animation: achievementPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            text-align: center;
            width: 90%;
            max-width: 400px;
        `;
        
        unlockDiv.innerHTML = `
            <div style="font-size: clamp(3em, 10vw, 4em); margin-bottom: 15px;">${achievement.icon}</div>
            <div style="font-size: clamp(1.5em, 5vw, 1.8em); font-weight: bold; margin-bottom: 10px;">🎉 ${translations[currentLanguage].unlocked}!</div>
            <div style="font-size: clamp(1.2em, 4vw, 1.4em); font-weight: bold; margin-bottom: 5px;">${translations[currentLanguage][achievement.nameKey]}</div>
            <div style="font-size: clamp(0.9em, 3vw, 1em); opacity: 0.9; margin-bottom: 15px;">${translations[currentLanguage][achievement.descKey]}</div>
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap;">
                <span style="background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px; font-size: clamp(0.8em, 3vw, 0.9em);">${LEVEL_ICONS[achievement.level]} ${translations[currentLanguage].level} ${achievement.level}</span>
                <span style="background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px; font-size: clamp(0.8em, 3vw, 0.9em);">+${achievement.reward.score} ${currentLanguage === 'zh' ? '分' : 'pts'}</span>
            </div>
        `;
        
        document.body.appendChild(unlockDiv);
        
        const style = document.createElement('style');
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
            const achievementsTitle = document.getElementById('achievements-title');
            
            if (!container || !achievementsModal) return;
            
            if (achievementsTitle) achievementsTitle.textContent = translations[currentLanguage].achievementsTitle;
            
            container.innerHTML = '';
            
            const categorizedAchievements = {};
            LADDER_ACHIEVEMENTS.forEach(ach => {
                if (!categorizedAchievements[ach.category]) {
                    categorizedAchievements[ach.category] = [];
                }
                categorizedAchievements[ach.category].push(ach);
            });
            
            CATEGORY_ORDER.forEach(category => {
                if (categorizedAchievements[category]) {
                    categorizedAchievements[category].sort((a, b) => a.level - b.level);
                }
            });
            
            const totalAchievements = LADDER_ACHIEVEMENTS.length;
            let unlockedCount = 0;
            achievementStates.forEach(state => {
                if (state.unlocked) unlockedCount++;
            });
            
            const statsHtml = `
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 15px; padding: clamp(20px, 5vw, 25px); margin-bottom: 30px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                        <span style="font-size: clamp(1.2em, 4vw, 1.5em); font-weight: bold;">⭐ ${translations[currentLanguage].achievementProgress}</span>
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
                            <div style="font-size: clamp(0.8em, 3vw, 0.85em); opacity: 0.9;">${translations[currentLanguage].bronze}</div>
                        </div>
                        <div style="text-align: center; background: rgba(255,255,255,0.1); padding: 12px; border-radius: 12px;">
                            <div style="font-size: 1.8em;">🥈</div>
                            <div style="font-size: clamp(1em, 4vw, 1.2em); font-weight: bold;">${playerStats.silverCount}</div>
                            <div style="font-size: clamp(0.8em, 3vw, 0.85em); opacity: 0.9;">${translations[currentLanguage].silver}</div>
                        </div>
                        <div style="text-align: center; background: rgba(255,255,255,0.1); padding: 12px; border-radius: 12px;">
                            <div style="font-size: 1.8em;">🥇</div>
                            <div style="font-size: clamp(1em, 4vw, 1.2em); font-weight: bold;">${playerStats.goldCount}</div>
                            <div style="font-size: clamp(0.8em, 3vw, 0.85em); opacity: 0.9;">${translations[currentLanguage].gold}</div>
                        </div>
                        <div style="text-align: center; background: rgba(255,255,255,0.1); padding: 12px; border-radius: 12px;">
                            <div style="font-size: 1.8em;">🏆</div>
                            <div style="font-size: clamp(1em, 4vw, 1.2em); font-weight: bold;">${playerStats.platinumCount}</div>
                            <div style="font-size: clamp(0.8em, 3vw, 0.85em); opacity: 0.9;">${translations[currentLanguage].platinum}</div>
                        </div>
                    </div>
                </div>
            `;
            
            let achievementsHtml = '<div style="display: flex; flex-direction: column; gap: 30px;">';
            
            CATEGORY_ORDER.forEach(category => {
                const achievements = categorizedAchievements[category];
                if (!achievements || achievements.length === 0) return;
                
                achievementsHtml += `
                    <div style="background: white; border-radius: 20px; padding: clamp(15px, 4vw, 20px); box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <h4 style="display: flex; align-items: center; margin-top: 0; margin-bottom: 20px; color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px; flex-wrap: wrap;">
                            <span style="font-size: clamp(1.5em, 5vw, 2em); margin-right: 12px;">${CATEGORY_ICONS[category]}</span>
                            <span style="font-size: clamp(1.1em, 4vw, 1.3em); font-weight: bold;">${translations[currentLanguage]['category' + category.charAt(0).toUpperCase() + category.slice(1)]}</span>
                        </h4>
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;" class="achievements-grid">
                `;
                
                achievements.forEach(ach => {
                    const state = achievementStates.get(ach.id);
                    const isUnlocked = state && state.unlocked;
                    const progress = state ? state.progress : 0;
                    const levelColor = LEVEL_COLORS[ach.level];
                    
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
                                ${LEVEL_ICONS[ach.level]} ${translations[currentLanguage].level} ${ach.level}
                            </div>
                            
                            <div style="font-weight: bold; color: #2c3e50; margin-bottom: 8px; font-size: clamp(0.9em, 3.5vw, 1.1em);">
                                ${translations[currentLanguage][ach.nameKey]}
                            </div>
                            
                            <div style="color: #6c757d; font-size: clamp(0.8em, 2.8vw, 0.85em); margin-bottom: 15px; line-height: 1.4; flex-grow: 1;">
                                ${translations[currentLanguage][ach.descKey]}
                            </div>
                            
                            <div style="background: #f1f3f5; border-radius: 12px; height: 8px; overflow: hidden; margin-bottom: 8px;">
                                <div style="width: ${progress}%; background: ${levelColor}; height: 100%; border-radius: 12px; transition: width 0.3s ease;"></div>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; color: #6c757d; font-size: clamp(0.7em, 2.5vw, 0.8em); margin-top: 5px;">
                                <span>${isUnlocked ? '✓ ' + translations[currentLanguage].unlocked : progress + '%'}</span>
                                <span style="color: ${levelColor};">+${ach.reward.score}</span>
                            </div>
                            
                            ${isUnlocked ? `
                                <div style="position: absolute; top: -8px; right: -8px; background: #4CAF50; color: white; width: 28px; height: 28px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 0.9em; box-shadow: 0 4px 8px rgba(76,175,80,0.3);">
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
                startBtn.innerHTML = `<span>${translations[currentLanguage].startPractice}</span>`;
            } else {
                startBtn.innerHTML = `<span>${translations[currentLanguage].startGame}</span>`;
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
        
        checkAndUnlockAchievements();
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
    
    function refreshNumbers() {
        const gameGrid = document.getElementById('game-grid');
        if (!gameGrid) return;
        
        gameGrid.style.opacity = '0.5';
        setTimeout(() => {
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
            'complete': translations[currentLanguage].gameComplete,
            'timeout': translations[currentLanguage].gameTimeout,
            'giveup': translations[currentLanguage].gameGiveup
        };
        
        if (resultTitleElement) {
            resultTitleElement.textContent = titleMap[reason] || translations[currentLanguage].gameEnd;
        }
        
        updateGameOverText();
        
        const gameOverElement = document.getElementById('game-over');
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
            setTimeout(() => {
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
            if (!currentUser || !isSupabaseReady || !supabase || offlineMode) {
                const pendingScore = {
                    user_id: currentUser?.id,
                    email: currentUser?.email,
                    username: currentUser?.user_metadata?.username || currentUser?.email?.split('@')[0] || '匿名玩家',
                    mode: currentMode,
                    range: document.getElementById('number-range')?.value || '0-14',
                    leaderboard_type: RANGE_CONFIG[document.getElementById('number-range')?.value || '0-14']?.leaderboardType,
                    score: gameScore,
                    questions_completed: questionsCompleted,
                    total_attempts: totalAttempts,
                    correct_count: correctCount,
                    accuracy: gameAccuracy,
                    time_used: timeUsed,
                    created_at: new Date().toISOString()
                };
                
                const pendingScores = JSON.parse(localStorage.getItem(`mathGameScores_${currentUser.id}_pending`) || '[]');
                pendingScores.push(pendingScore);
                localStorage.setItem(`mathGameScores_${currentUser.id}_pending`, JSON.stringify(pendingScores));
                
                syncState.pendingChanges = true;
                saveSyncState();
                
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
            syncState.pendingChanges = true;
            saveSyncState();
            return true;
        } catch (error) {
            console.error('保存成绩异常:', error);
            return false;
        }
    }
    
    // ==================== 用户统计系统 ====================
    async function loadUserStats() {
        try {
            if (!currentUser || !isSupabaseReady || !supabase || offlineMode) {
                return null;
            }
            
            const localStats = localStorage.getItem(`mathGameStats_${currentUser.id}`);
            if (localStats) {
                try {
                    const stats = JSON.parse(localStats);
                    if (stats.timestamp && (Date.now() - stats.timestamp) < CONFIG.CACHE_EXPIRY) {
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
            syncState.pendingChanges = true;
            saveSyncState();
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
            
            if (currentUser && isSupabaseReady && !offlineMode) {
                setTimeout(() => {
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
            
            const wrongQuestionData = {
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
            
            const { data: existingData } = await supabase
                .from('wrong_questions')
                .select('id, count')
                .eq('user_id', currentUser.id)
                .eq('num1', num1)
                .eq('num2', num2)
                .limit(1);
            
            if (existingData && existingData.length > 0) {
                await supabase
                    .from('wrong_questions')
                    .update({
                        count: (existingData[0].count || 1) + 1,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingData[0].id);
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
            
            const { data, error } = await supabase
                .from('wrong_questions')
                .select('*')
                .eq('user_id', currentUser.id)
                .order('created_at', { ascending: false });
            
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
                timestamp: item.created_at
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
    
    // ==================== 统计功能 ====================
    async function showStatistics() {
        try {
            const statisticsContent = document.getElementById('statistics-content');
            const statisticsModal = document.getElementById('statistics-modal');
            const statisticsTitle = document.getElementById('statistics-title');
            
            if (!statisticsContent || !statisticsModal) return;
            
            if (statisticsTitle) statisticsTitle.textContent = translations[currentLanguage].statisticsTitle;
            
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
                            <h4>${translations[currentLanguage].noHistoryStats}</h4>
                            <p style="color: #666; margin-top: 10px;">${translations[currentLanguage].statsDescription}</p>
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
            showMessage(translations[currentLanguage].loadingStats, 'error');
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
    async function loadLeaderboardData(type = 'easy', sortBy = 'score', limit = 10) {
        try {
            if (!isSupabaseReady || !supabase || offlineMode) {
                return [];
            }
            
            let query = supabase
                .from('game_scores')
                .select('*')
                .eq('leaderboard_type', type);
            
            if (sortBy === 'score') {
                query = query.order('score', { ascending: false });
            } else if (sortBy === 'accuracy') {
                query = query.order('accuracy', { ascending: false });
            } else if (sortBy === 'time') {
                query = query.order('time_used', { ascending: true });
            }
            
            query = query.order('created_at', { ascending: false }).limit(limit);
            
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
    
    async function loadUserBestInMode(type) {
        try {
            if (!currentUser || !isSupabaseReady || !supabase || offlineMode) {
                return null;
            }
            
            const { data: bestScore } = await supabase
                .from('game_scores')
                .select('*')
                .eq('user_id', currentUser.id)
                .eq('leaderboard_type', type)
                .order('score', { ascending: false })
                .limit(1);
            
            const { data: bestAccuracy } = await supabase
                .from('game_scores')
                .select('*')
                .eq('user_id', currentUser.id)
                .eq('leaderboard_type', type)
                .order('accuracy', { ascending: false })
                .limit(1);
            
            const { data: bestTime } = await supabase
                .from('game_scores')
                .select('*')
                .eq('user_id', currentUser.id)
                .eq('leaderboard_type', type)
                .order('time_used', { ascending: true })
                .limit(1);
            
            return {
                bestScore: bestScore && bestScore.length > 0 ? bestScore[0] : null,
                bestAccuracy: bestAccuracy && bestAccuracy.length > 0 ? bestAccuracy[0] : null,
                bestTime: bestTime && bestTime.length > 0 ? bestTime[0] : null
            };
        } catch (error) {
            console.error('加载用户最佳成绩失败:', error);
            return null;
        }
    }
    
    async function loadUserScores() {
        try {
            if (!currentUser || !isSupabaseReady || !supabase || offlineMode) {
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
            const leaderboardTitle = document.getElementById('leaderboard-title');
            
            if (!leaderboardContent || !leaderboardModal) return;
            
            if (leaderboardTitle) leaderboardTitle.textContent = translations[currentLanguage].leaderboardTitle;
            
            leaderboardContent.innerHTML = `<div style="text-align:center;padding:30px;">${translations[currentLanguage].loadingStats}</div>`;
            leaderboardModal.style.display = 'flex';
            
            // ✅ 使用新的超级管理员检查
            if (isSuperAdmin) {
                // 超级管理员看到全国排行榜
                await showNationalLeaderboard(leaderboardContent);
            } else {
                // 普通用户看到原有排行榜
                await showSchoolLeaderboard(leaderboardContent);
            }
            
        } catch (error) {
            console.error('显示排行榜失败:', error);
            showMessage(translations[currentLanguage].loadingStats, 'error');
        }
    }
    
    // ✅ 新增：全国排行榜（超级管理员专用）
    async function showNationalLeaderboard(container) {
        try {
            // 获取全国统计数据
            const { data: stats } = await supabase
                .from('admin_dashboard_stats')
                .select('*')
                .single();
            
            // 获取全国排行榜数据
            const { data: nationalData } = await supabase
                .rpc('get_leaderboard', {
                    p_leaderboard_type: 'national',
                    p_mode: 'challenge',
                    p_limit: 50
                });
            
            const html = `
                <div style="padding: 20px;">
                    <!-- 管理员统计卡片 -->
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 15px;">
                            <div style="font-size: 2em;">🏫</div>
                            <div style="font-size: 1.5em; font-weight: bold;">${stats?.total_schools || 0}</div>
                            <div style="opacity: 0.9;">合作学校</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #ff8c5a 0%, #ff6b4a 100%); color: white; padding: 20px; border-radius: 15px;">
                            <div style="font-size: 2em;">👥</div>
                            <div style="font-size: 1.5em; font-weight: bold;">${stats?.total_players || 0}</div>
                            <div style="opacity: 0.9;">总玩家数</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 20px; border-radius: 15px;">
                            <div style="font-size: 2em;">🎮</div>
                            <div style="font-size: 1.5em; font-weight: bold;">${stats?.total_games || 0}</div>
                            <div style="opacity: 0.9;">总游戏局数</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); color: white; padding: 20px; border-radius: 15px;">
                            <div style="font-size: 2em;">🎯</div>
                            <div style="font-size: 1.5em; font-weight: bold;">${stats?.avg_accuracy || 0}%</div>
                            <div style="opacity: 0.9;">平均正确率</div>
                        </div>
                    </div>
                    
                    <!-- 全国排行榜 -->
                    <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <h4 style="display: flex; align-items: center; margin-top: 0; margin-bottom: 20px;">
                            <span style="background: #4CAF50; color: white; width: 32px; height: 32px; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px;">🏆</span>
                            全国总排行榜（所有学校）
                        </h4>
                        
                        <div style="overflow-x: auto;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr style="background: #f8f9fa; border-bottom: 2px solid #e0e0e0;">
                                        <th style="padding: 12px; text-align: left;">排名</th>
                                        <th style="padding: 12px; text-align: left;">玩家</th>
                                        <th style="padding: 12px; text-align: left;">学校</th>
                                        <th style="padding: 12px; text-align: left;">班级</th>
                                        <th style="padding: 12px; text-align: left;">得分</th>
                                        <th style="padding: 12px; text-align: left;">正确率</th>
                                        <th style="padding: 12px; text-align: left;">用时</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${nationalData?.leaderboard?.map((item, index) => `
                                        <tr style="border-bottom: 1px solid #f0f0f0;">
                                            <td style="padding: 12px;">
                                                <span style="font-weight: bold; color: ${index < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][index] : '#666'};">
                                                    ${index < 3 ? ['🥇', '🥈', '🥉'][index] : `${index+1}.`}
                                                </span>
                                            </td>
                                            <td style="padding: 12px; font-weight: bold;">${item.username}</td>
                                            <td style="padding: 12px;">${item.school_name}</td>
                                            <td style="padding: 12px;">${item.class_name || '-'}</td>
                                            <td style="padding: 12px; color: #4CAF50; font-weight: bold;">${item.score}</td>
                                            <td style="padding: 12px;">${item.accuracy}%</td>
                                            <td style="padding: 12px;">${item.time_used}s</td>
                                        </tr>
                                    `).join('') || '<tr><td colspan="7" style="text-align:center;padding:30px;">暂无数据</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div style="margin-top: 20px; text-align: right; color: #666; font-size: 0.85em;">
                        更新时间: ${new Date().toLocaleString()}
                    </div>
                </div>
            `;
            
            container.innerHTML = html;
        } catch (error) {
            console.error('加载全国排行榜失败:', error);
            container.innerHTML = `<div style="text-align:center;padding:30px;color:#ff4444;">加载失败: ${error.message}</div>`;
        }
    }
    
    // ✅ 原有学校排行榜（保持不变）
    async function showSchoolLeaderboard(container) {
        let easyScore = [], easyAccuracy = [], easySpeed = [];
        let standardScore = [], standardAccuracy = [], standardSpeed = [];
        let challengeScore = [], challengeAccuracy = [], challengeSpeed = [];
        
        if (!offlineMode) {
            [easyScore, easyAccuracy, easySpeed,
             standardScore, standardAccuracy, standardSpeed,
             challengeScore, challengeAccuracy, challengeSpeed] = await Promise.all([
                loadLeaderboardData('easy', 'score', 10),
                loadLeaderboardData('easy', 'accuracy', 10),
                loadLeaderboardData('easy', 'time', 10),
                loadLeaderboardData('standard', 'score', 10),
                loadLeaderboardData('standard', 'accuracy', 10),
                loadLeaderboardData('standard', 'time', 10),
                loadLeaderboardData('challenge', 'score', 10),
                loadLeaderboardData('challenge', 'accuracy', 10),
                loadLeaderboardData('challenge', 'time', 10)
            ]);
        }
        
        let userEasy = null;
        let userStandard = null;
        let userChallenge = null;
        
        if (currentUser && !offlineMode) {
            [userEasy, userStandard, userChallenge] = await Promise.all([
                loadUserBestInMode('easy'),
                loadUserBestInMode('standard'),
                loadUserBestInMode('challenge')
            ]);
        }
        
        let html = `
            <div style="padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; flex-wrap: wrap; gap: 15px;">
                    <h3 style="color: #4CAF50; margin: 0; display: flex; align-items: center;">
                        <span style="font-size: 2em; margin-right: 10px;">🏆</span>
                        ${translations[currentLanguage].leaderboardTitle}
                    </h3>
                    <button id="sync-leaderboard-btn" style="background: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                        🔄 ${translations[currentLanguage].refresh}
                    </button>
                </div>
                
                <!-- 简单模式 3个榜单 -->
                <div style="margin-bottom: 40px;">
                    <h4 style="display: flex; align-items: center; color: #8BC34A; border-bottom: 3px solid #8BC34A; padding-bottom: 12px; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
                        <span style="background: #8BC34A; color: white; width: 36px; height: 36px; border-radius: 18px; display: inline-flex; align-items: center; justify-content: center;">🟢</span>
                        <span style="font-size: clamp(1.1em, 4vw, 1.3em);">${translations[currentLanguage].leaderboardEasy}</span>
                        <span style="font-size: 0.8em; background: #8BC34A20; color: #8BC34A; padding: 4px 12px; border-radius: 20px;">
                            ${currentLanguage === 'zh' ? '0-9' : '0-9'}
                        </span>
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;" class="leaderboard-grid">
                        ${generateLeaderboardCard('easy', 'score', easyScore, translations[currentLanguage].leaderboardEasyScore, '#8BC34A')}
                        ${generateLeaderboardCard('easy', 'accuracy', easyAccuracy, translations[currentLanguage].leaderboardEasyAccuracy, '#8BC34A')}
                        ${generateLeaderboardCard('easy', 'time', easySpeed, translations[currentLanguage].leaderboardEasySpeed, '#8BC34A')}
                    </div>
                </div>
                
                <!-- 挑战30模式 3个榜单 -->
                <div style="margin-bottom: 40px;">
                    <h4 style="display: flex; align-items: center; color: #FF9800; border-bottom: 3px solid #FF9800; padding-bottom: 12px; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
                        <span style="background: #FF9800; color: white; width: 36px; height: 36px; border-radius: 18px; display: inline-flex; align-items: center; justify-content: center;">🟠</span>
                        <span style="font-size: clamp(1.1em, 4vw, 1.3em);">${translations[currentLanguage].leaderboardStandard}</span>
                        <span style="font-size: 0.8em; background: #FF980020; color: #FF9800; padding: 4px 12px; border-radius: 20px;">
                            ${currentLanguage === 'zh' ? '30题' : '30 Qs'}
                        </span>
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;" class="leaderboard-grid">
                        ${generateLeaderboardCard('standard', 'score', standardScore, translations[currentLanguage].leaderboardStandardScore, '#FF9800')}
                        ${generateLeaderboardCard('standard', 'accuracy', standardAccuracy, translations[currentLanguage].leaderboardStandardAccuracy, '#FF9800')}
                        ${generateLeaderboardCard('standard', 'time', standardSpeed, translations[currentLanguage].leaderboardStandardSpeed, '#FF9800')}
                    </div>
                </div>
                
                <!-- 激情90秒模式 3个榜单 -->
                <div style="margin-bottom: 40px;">
                    <h4 style="display: flex; align-items: center; color: #f44336; border-bottom: 3px solid #f44336; padding-bottom: 12px; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
                        <span style="background: #f44336; color: white; width: 36px; height: 36px; border-radius: 18px; display: inline-flex; align-items: center; justify-content: center;">🔴</span>
                        <span style="font-size: clamp(1.1em, 4vw, 1.3em);">${translations[currentLanguage].leaderboardChallenge}</span>
                        <span style="font-size: 0.8em; background: #f4433620; color: #f44336; padding: 4px 12px; border-radius: 20px;">
                            ${currentLanguage === 'zh' ? '90秒' : '90s'}
                        </span>
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;" class="leaderboard-grid">
                        ${generateLeaderboardCard('challenge', 'score', challengeScore, translations[currentLanguage].leaderboardChallengeScore, '#f44336')}
                        ${generateLeaderboardCard('challenge', 'accuracy', challengeAccuracy, translations[currentLanguage].leaderboardChallengeAccuracy, '#f44336')}
                        ${generateLeaderboardCard('challenge', 'time', challengeSpeed, translations[currentLanguage].leaderboardChallengeSpeed, '#f44336')}
                    </div>
                </div>
                
                ${currentUser ? generateUserBestSection(userEasy, userStandard, userChallenge) : generateLoginPrompt()}
                ${offlineMode ? '<div style="margin-top: 20px; text-align: center; color: #666; padding: 15px; background: #f8f9fa; border-radius: 12px;">📴 ' + (currentLanguage === 'zh' ? '离线模式：排行榜数据不可用' : 'Offline mode: Leaderboard data unavailable') + '</div>' : ''}
            </div>
        `;
        
        container.innerHTML = html;
        
        document.getElementById('sync-leaderboard-btn')?.addEventListener('click', async () => {
            showLeaderboard();
            showMessage(translations[currentLanguage].syncSuccess, 'success');
        });
    }
    
    function generateLeaderboardCard(mode, type, scores, title, color) {
        const getValue = (score) => {
            if (type === 'score') return score.score;
            if (type === 'accuracy') return score.accuracy + '%';
            if (type === 'time') return score.time_used + 's';
            return '';
        };
        
        const getMedal = (index) => {
            if (index === 0) return '🥇';
            if (index === 1) return '🥈';
            if (index === 2) return '🥉';
            return `${index + 1}.`;
        };
        
        let cardHtml = `
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
                    <p style="color: #999; margin: 0; font-size: 0.9em;">${translations[currentLanguage].noData}</p>
                </div>
            `;
        } else {
            cardHtml += `<div style="display: flex; flex-direction: column; gap: 10px;">`;
            
            scores.slice(0, 5).forEach((score, index) => {
                const isCurrentUser = currentUser && score.user_id === currentUser.id;
                const medalColor = index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'transparent';
                
                cardHtml += `
                    <div style="display: flex; align-items: center; justify-content: space-between; 
                                padding: 8px 12px; 
                                background: ${isCurrentUser ? '#FFF9C4' : index % 2 === 0 ? '#fafafa' : 'white'};
                                border-radius: 10px;
                                border-left: 4px solid ${medalColor};
                                flex-wrap: wrap;
                                gap: 8px;">
                        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                            <span style="font-weight: bold; color: ${index < 3 ? '#333' : '#999'}; min-width: 30px;">
                                ${getMedal(index)}
                            </span>
                            <span style="font-weight: ${isCurrentUser ? 'bold' : 'normal'}; color: ${isCurrentUser ? '#4CAF50' : '#333'}; font-size: clamp(0.8em, 3vw, 0.9em);">
                                ${score.username || score.email?.split('@')[0] || '匿名'}
                                ${isCurrentUser ? `<span style="background: #4CAF50; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.7em; margin-left: 8px;">${translations[currentLanguage].player}</span>` : ''}
                            </span>
                        </div>
                        <span style="font-weight: bold; color: ${color}; background: ${color}10; padding: 4px 12px; border-radius: 20px; font-size: clamp(0.8em, 3vw, 0.9em);">
                            ${getValue(score)}
                        </span>
                    </div>
                `;
            });
            
            cardHtml += `</div>`;
        }
        
        cardHtml += `</div>`;
        return cardHtml;
    }
    
    function generateUserBestSection(userEasy, userStandard, userChallenge) {
        return `
            <div style="margin-top: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 20px; padding: clamp(20px, 5vw, 25px); box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px;">
                    <h4 style="margin: 0; color: white; display: flex; align-items: center; font-size: clamp(1.1em, 4vw, 1.3em);">
                        <span style="background: rgba(255,255,255,0.2); width: 45px; height: 45px; border-radius: 23px; display: inline-flex; align-items: center; justify-content: center; margin-right: 15px; font-size: 1.3em;">👤</span>
                        ${translations[currentLanguage].myBest}
                    </h4>
                    <span style="background: rgba(255,255,255,0.2); padding: 6px 16px; border-radius: 20px; font-size: 0.9em;">
                        ${currentUser?.user_metadata?.username || currentUser?.email?.split('@')[0] || translations[currentLanguage].player}
                    </span>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;" class="leaderboard-grid">
                    <!-- 简单模式 -->
                    <div style="background: rgba(255,255,255,0.1); border-radius: 16px; padding: 18px; backdrop-filter: blur(5px);">
                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                            <span style="background: #8BC34A; width: 30px; height: 30px; border-radius: 15px; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px;">🟢</span>
                            <span style="font-weight: bold;">${translations[currentLanguage].easyMode}</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center;">
                            <div>
                                <div style="font-size: 0.8em; opacity: 0.9;">🏆 ${translations[currentLanguage].score}</div>
                                <div style="font-size: clamp(1.2em, 4vw, 1.4em); font-weight: bold;">${userEasy?.bestScore?.score || 0}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.8em; opacity: 0.9;">🎯 ${translations[currentLanguage].accuracy}</div>
                                <div style="font-size: clamp(1.2em, 4vw, 1.4em); font-weight: bold;">${userEasy?.bestAccuracy?.accuracy || 0}%</div>
                            </div>
                            <div>
                                <div style="font-size: 0.8em; opacity: 0.9;">⚡ ${translations[currentLanguage].time}</div>
                                <div style="font-size: clamp(1.2em, 4vw, 1.4em); font-weight: bold;">${userEasy?.bestTime?.time_used || 0}s</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 挑战30模式 -->
                    <div style="background: rgba(255,255,255,0.1); border-radius: 16px; padding: 18px; backdrop-filter: blur(5px);">
                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                            <span style="background: #FF9800; width: 30px; height: 30px; border-radius: 15px; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px;">🟠</span>
                            <span style="font-weight: bold;">${translations[currentLanguage].standardMode}</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center;">
                            <div>
                                <div style="font-size: 0.8em; opacity: 0.9;">🏆 ${translations[currentLanguage].score}</div>
                                <div style="font-size: clamp(1.2em, 4vw, 1.4em); font-weight: bold;">${userStandard?.bestScore?.score || 0}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.8em; opacity: 0.9;">🎯 ${translations[currentLanguage].accuracy}</div>
                                <div style="font-size: clamp(1.2em, 4vw, 1.4em); font-weight: bold;">${userStandard?.bestAccuracy?.accuracy || 0}%</div>
                            </div>
                            <div>
                                <div style="font-size: 0.8em; opacity: 0.9;">⚡ ${translations[currentLanguage].time}</div>
                                <div style="font-size: clamp(1.2em, 4vw, 1.4em); font-weight: bold;">${userStandard?.bestTime?.time_used || 0}s</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 激情90秒模式 -->
                    <div style="background: rgba(255,255,255,0.1); border-radius: 16px; padding: 18px; backdrop-filter: blur(5px);">
                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                            <span style="background: #f44336; width: 30px; height: 30px; border-radius: 15px; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px;">🔴</span>
                            <span style="font-weight: bold;">${translations[currentLanguage].challengeMode}</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center;">
                            <div>
                                <div style="font-size: 0.8em; opacity: 0.9;">🏆 ${translations[currentLanguage].score}</div>
                                <div style="font-size: clamp(1.2em, 4vw, 1.4em); font-weight: bold;">${userChallenge?.bestScore?.score || 0}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.8em; opacity: 0.9;">🎯 ${translations[currentLanguage].accuracy}</div>
                                <div style="font-size: clamp(1.2em, 4vw, 1.4em); font-weight: bold;">${userChallenge?.bestAccuracy?.accuracy || 0}%</div>
                            </div>
                            <div>
                                <div style="font-size: 0.8em; opacity: 0.9;">⚡ ${translations[currentLanguage].time}</div>
                                <div style="font-size: clamp(1.2em, 4vw, 1.4em); font-weight: bold;">${userChallenge?.bestTime?.time_used || 0}s</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
                    <span style="background: rgba(255,255,255,0.1); padding: 6px 16px; border-radius: 20px; font-size: 0.85em;">
                        ${syncState.lastSyncTime && !offlineMode ? 
                            `☁️ ${translations[currentLanguage].lastSync}: ${new Date(syncState.lastSyncTime).toLocaleTimeString()}` : 
                            offlineMode ? `📴 ${translations[currentLanguage].offlineMode}` : `☁️ ${translations[currentLanguage].lastSync}: -`}
                    </span>
                </div>
            </div>
        `;
    }
    
    // ==================== 修复版 generateLoginPrompt ====================
    function generateLoginPrompt() {
        return `
            <div style="margin-top: 40px; background: linear-gradient(135deg, #6c757d 0%, #495057 100%); border-radius: 20px; padding: 30px; text-align: center; color: white;">
                <div style="font-size: 3.5em; margin-bottom: 15px;">🔐</div>
                <h4 style="margin: 0 0 10px 0; color: white; font-size: clamp(1.1em, 4vw, 1.3em);">${translations[currentLanguage].needLogin}</h4>
                <p style="opacity: 0.9; margin-bottom: 20px;">${translations[currentLanguage].loginPrompt}</p>
                <button onclick="MathGame.showAuthModal()" style="background: white; color: #495057; border: none; padding: 12px 35px; border-radius: 30px; font-size: clamp(0.9em, 3.5vw, 1.1em); font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: all 0.3s ease;">
                    🔐 ${translations[currentLanguage].loginNow}
                </button>
            </div>
        `;
    }
    
    // ==================== 历史记录显示 ====================
    function showHistory() {
        try {
            const tbody = document.getElementById('history-table-body');
            const historyModal = document.getElementById('history-modal');
            const historyTitle = document.getElementById('history-title');
            const clearHistoryBtn = document.getElementById('clear-history-btn');
            
            if (!tbody || !historyModal) return;
            
            if (historyTitle) historyTitle.textContent = translations[currentLanguage].historyTitle;
            if (clearHistoryBtn) clearHistoryBtn.innerHTML = `<span>${translations[currentLanguage].clearHistory}</span>`;
            
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
    
    // ==================== 修复版错题本显示 ====================
    function showWrongBook() {
        try {
            loadWrongQuestions();
            
            const container = document.getElementById('wrong-questions-list');
            const wrongbookModal = document.getElementById('wrongbook-modal');
            const wrongbookTitle = document.getElementById('wrongbook-title');
            const syncBtn = document.getElementById('sync-wrong-questions-btn');
            const clearBtn = document.getElementById('clear-wrong-questions-btn');
            
            if (!container || !wrongbookModal) return;
            
            if (wrongbookTitle) wrongbookTitle.textContent = translations[currentLanguage].wrongbookTitle;
            if (syncBtn) syncBtn.innerHTML = `<span>${translations[currentLanguage].syncWrongQuestions}</span>`;
            if (clearBtn) clearBtn.innerHTML = `<span>${translations[currentLanguage].clearWrongQuestions}</span>`;
            
            container.innerHTML = '';
            
            if (wrongQuestions.length === 0) {
                container.innerHTML = `<div style="text-align:center;padding:20px;color:#666;">${translations[currentLanguage].noData}</div>`;
            } else {
                wrongQuestions.slice(0, 20).forEach((question) => {
                    const item = document.createElement('div');
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
                            <small style="color: #ff4444;">${translations[currentLanguage].wrongAnswer} (${translations[currentLanguage].shouldBe} ${question.correctSum})</small><br>
                            <small style="color: #666;">${translations[currentLanguage].errors}: ${question.count}</small>
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
                    more.textContent = translations[currentLanguage].moreQuestions.replace('{count}', wrongQuestions.length - 20);
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
                showMessage(translations[currentLanguage].needLogin, 'info');
                showAuthModal();
                return;
            }
            
            const profileModal = document.getElementById('profile-modal');
            const profileTitle = document.getElementById('profile-title');
            const syncStatusElement = document.getElementById('profile-sync-status');
            
            if (!profileModal) return;
            
            if (profileTitle) profileTitle.textContent = translations[currentLanguage].profileTitle;
            
            profileModal.style.display = 'flex';
            
            const email = currentUser.email || '';
            const firstLetter = email.charAt(0).toUpperCase() || '?';
            document.getElementById('profile-avatar').textContent = firstLetter;
            document.getElementById('profile-email').textContent = email;
            
            const userRole = currentUser.user_metadata?.role || 'student';
            let roleText = '';
            if (isSuperAdmin) {
                roleText = '👑 ' + (currentLanguage === 'zh' ? '超级管理员' : 'Super Admin');
            } else if (isSchoolAdmin) {
                roleText = '🏫 ' + (currentLanguage === 'zh' ? '学校管理员' : 'School Admin');
            } else if (isTeacher) {
                roleText = '👨‍🏫 ' + (currentLanguage === 'zh' ? '教师' : 'Teacher');
            } else {
                roleText = '👨‍🎓 ' + (currentLanguage === 'zh' ? '学生' : 'Student');
            }
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
            
            if (syncStatusElement) {
                const lastSync = syncState.lastSyncTime && !offlineMode
                    ? new Date(syncState.lastSyncTime).toLocaleString() 
                    : (offlineMode ? translations[currentLanguage].offlineMode : (currentLanguage === 'zh' ? '从未同步' : 'Never'));
                syncStatusElement.innerHTML = `☁️ ${translations[currentLanguage].lastSync}: ${lastSync}`;
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
        const hintBtn = document.getElementById('hint-btn');
        if (!hintBtn) return;
        
        if (hintCooldown > 0) {
            hintBtn.innerHTML = `<span>💡 ${hintCooldown}${currentLanguage === 'zh' ? '秒' : 's'}</span>`;
            hintBtn.disabled = true;
            hintBtn.style.opacity = '0.7';
        } else {
            hintBtn.innerHTML = `<span>${translations[currentLanguage].hintButton}</span>`;
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
            if (!currentUser && !offlineMode) {
                showMessage(translations[currentLanguage].needLogin, 'error');
                showAuthModal();
                return;
            }
            
            const nameInput = document.getElementById('player-name');
            let playerName = nameInput ? nameInput.value.trim() : '';
            
            if (!playerName) {
                playerName = currentUser?.user_metadata?.username || currentUser?.email?.split('@')[0] || (currentLanguage === 'zh' ? '匿名玩家' : 'Anonymous Player');
            }
            
            const elapsedTime = startTime ? Math.floor((new Date() - startTime) / 1000) : 0;
            const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;
            
            const success = await saveGameScoreToCloud(score, completedQuestions, accuracy, elapsedTime);
            
            if (success) {
                showMessage(translations[currentLanguage].syncSuccess, 'success');
            } else {
                showMessage(currentLanguage === 'zh' ? '⚠️ 成绩已保存到本地' : '⚠️ Score saved locally', 'warning');
            }
            
            const gameOverElement = document.getElementById('game-over');
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
            
            const style = document.createElement('style');
            style.id = 'math-game-responsive-styles';
            style.textContent = `
                /* ========== 全局响应式设置 ========== */
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
                
                /* ========== 游戏容器 ========== */
                #game-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                /* ========== 游戏网格 - 完美适配所有屏幕 ========== */
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
                
                /* ========== 侧边栏响应式 ========== */
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
                
                /* ========== 主内容区 ========== */
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
                
                /* ========== 游戏信息栏响应式 ========== */
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
                
                /* ========== 目标栏响应式 ========== */
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
                
                /* ========== 游戏控制按钮响应式 ========== */
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
                
                /* ========== 弹窗响应式 ========== */
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
                
                /* ========== 排行榜卡片响应式 ========== */
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
                
                /* ========== 成就卡片响应式 ========== */
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
                
                /* ========== 加载动画 ========== */
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
                
                /* ========== 消息提示 ========== */
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
        const issues = [];
        
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
        } catch (e) {
            issues.push('localStorage');
            const memoryStorage = {};
            window.localStorage = {
                getItem: (key) => memoryStorage[key] || null,
                setItem: (key, value) => { memoryStorage[key] = value; },
                removeItem: (key) => { delete memoryStorage[key]; }
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
            window.Promise = class {
                constructor(executor) {
                    this.callbacks = [];
                    executor(
                        (value) => setTimeout(() => this.resolve(value), 0),
                        (reason) => setTimeout(() => this.reject(reason), 0)
                    );
                }
                then(callback) { this.callbacks.push(callback); return this; }
                catch(callback) { this.errorCallback = callback; return this; }
                resolve(value) { this.callbacks.forEach(cb => cb(value)); }
                reject(reason) { this.errorCallback?.(reason); }
            };
        }
        
        if (issues.length > 0) {
            console.warn('⚠️ 兼容性问题:', issues.join(', '));
            showMessage(
                currentLanguage === 'zh' 
                    ? `📴 您的浏览器不支持: ${issues.join(', ')}，已启用降级模式` 
                    : `📴 Your browser does not support: ${issues.join(', ')}, fallback mode enabled`,
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
            
            let savedLang = 'zh';
            try {
                savedLang = localStorage?.getItem('mathGameLanguage') || 'zh';
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
            
            setTimeout(() => {
                const loadingOverlay = document.getElementById('loading-overlay');
                if (loadingOverlay) {
                    loadingOverlay.classList.add('hide-loading');
                    setTimeout(() => {
                        loadingOverlay.style.display = 'none';
                    }, 500);
                }
            }, 1500);
            
            console.log('🎮 数学加法消消乐 - 初始化完成！', offlineMode ? '(离线模式)' : '(在线模式)');
            console.log('👤 当前用户角色:', { isSuperAdmin, isSchoolAdmin, isTeacher, isAdminUser });
            
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
                const loadingOverlay = document.getElementById('loading-overlay');
                if (loadingOverlay) {
                    loadingOverlay.style.display = 'none';
                }
                
                const gameContainer = document.querySelector('.main-content');
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
            document.getElementById('language-btn')?.addEventListener('click', () => {
                const newLang = currentLanguage === 'zh' ? 'en' : 'zh';
                setLanguage(newLang);
                showMessage(translations[newLang].switchedToChinese || translations[newLang].switchedToEnglish, 'info');
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
                { id: 'teacher-application-btn', handler: showTeacherApplication },
                { id: 'logout-btn', handler: logout },
                { id: 'sync-status-btn', handler: () => {
                    showMessage(
                        offlineMode ? translations[currentLanguage].offlineMode :
                        syncState.pendingChanges 
                            ? (currentLanguage === 'zh' ? '有待同步的数据' : 'Pending changes')
                            : (currentLanguage === 'zh' ? '已同步' : 'Synced'), 
                        'info'
                    );
                }}
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
                if (confirm(translations[currentLanguage].confirmClearHistory)) {
                    gameHistory = [];
                    showHistory();
                    showMessage(translations[currentLanguage].historyCleared, 'info');
                }
            });
            
            document.getElementById('sync-wrong-questions-btn')?.addEventListener('click', async () => {
                if (offlineMode) {
                    showMessage(currentLanguage === 'zh' ? '离线模式无法同步' : 'Cannot sync in offline mode', 'warning');
                    return;
                }
                await syncAllWrongQuestionsToCloud();
                showWrongBook();
            });
            
            document.getElementById('clear-wrong-questions-btn')?.addEventListener('click', () => {
                if (confirm(translations[currentLanguage].confirmClearWrongQuestions)) {
                    wrongQuestions = [];
                    saveWrongQuestions();
                    showWrongBook();
                    showMessage(translations[currentLanguage].wrongQuestionsCleared, 'info');
                }
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
        showTeacherApplication,
        logout,
        closeAuthModal,
        handleAuth,
        toggleAuthMode,
        saveScore,
        showAuthModal,
        performFullSync,
        getSyncStatus: () => syncState,
        isOfflineMode: () => offlineMode,
        // 新增：获取角色状态
        getRoles: () => ({
            isSuperAdmin,
            isSchoolAdmin,
            isTeacher,
            isAdminUser
        })
    };
})();

// ==================== 启动游戏 ====================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            MathGame.init();
        }, 100);
    });
} else {
    setTimeout(() => {
        MathGame.init();
    }, 100);
}

window.MathGame = MathGame;
