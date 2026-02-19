<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.5, user-scalable=yes">
    <title>数学加法消消乐 - 云端版</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧮</text></svg>">
    
    <!-- 预加载样式 -->
    <link rel="preload" href="style.css" as="style">
    <link rel="stylesheet" href="style.css">
    
    <!-- 加载中样式 -->
    <style>
        .loading-overlay {
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
            transition: opacity 0.5s;
            will-change: opacity;
            pointer-events: auto;
        }
        
        .loading-content {
            text-align: center;
            color: white;
            pointer-events: none;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .hide-loading {
            opacity: 0;
            pointer-events: none;
        }
        
        body:not(.loaded) .main-content,
        body:not(.loaded) .sidebar {
            opacity: 0;
            pointer-events: none;
        }
        
        body.loaded .main-content,
        body.loaded .sidebar {
            opacity: 1;
            pointer-events: auto;
            transition: opacity 0.5s;
        }
        
        .sidebar-btn, .btn, .tab-btn, .pagination-btn, .close-btn, .language-btn,
        .leaderboard-refresh-btn, .leaderboard-login-btn, .range-btn {
            cursor: pointer;
        }
        
        .btn:disabled, .pagination-btn:disabled, .range-btn:disabled {
            cursor: not-allowed;
            opacity: 0.5;
            pointer-events: none;
        }
        
        /* 网络状态提示 */
        .network-status {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            border-radius: 30px;
            font-size: 14px;
            font-weight: bold;
            z-index: 10000;
            display: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        .network-status.online {
            background: #4CAF50;
            color: white;
            display: block;
        }
        
        .network-status.offline {
            background: #ff4444;
            color: white;
            display: block;
        }
        
        .network-status.connecting {
            background: #FF9800;
            color: white;
            display: block;
        }
    </style>
</head>
<body>
    <!-- 加载覆盖层 -->
    <div class="loading-overlay" id="loading-overlay">
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <h2>加载数学加法消消乐...</h2>
            <p>请稍候</p>
        </div>
    </div>
    
    <!-- 网络状态提示 -->
    <div class="network-status" id="network-status"></div>
    
    <!-- 环境变量配置 -->
    <script type="application/json" id="supabase-config">
        {
            "supabaseUrl": "https://ytoailyxejdgtpfwcdci.supabase.co",
            "supabaseKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0b2FpbHl4ZWpkZ3RwZndjZGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDE5NzQsImV4cCI6MjA4NTExNzk3NH0.DvvP8whiE3rW1bDh4qW2zOLTGsknfQ2Utt8wVOxZjV0"
        }
    </script>
    
    <!-- ========== 语言切换按钮 ========== -->
    <div class="language-switch">
        <button class="language-btn" id="language-btn" aria-label="切换语言">
            <span id="language-icon">🌐</span>
            <span id="language-text" data-i18n="languageText">English</span>
        </button>
    </div>
    
    <!-- 左侧功能栏 -->
    <div class="sidebar">
        <button class="sidebar-btn" id="history-btn" role="button"><span data-i18n="history">📝 历史记录</span></button>
        <button class="sidebar-btn secondary" id="statistics-btn" role="button"><span data-i18n="statistics">📊 统计</span></button>
        <button class="sidebar-btn achievement" id="achievements-btn" role="button"><span data-i18n="achievements">⭐ 成就</span></button>
        <button class="sidebar-btn wrong" id="wrongbook-btn" role="button"><span data-i18n="wrongBook">📖 错题本</span></button>
        <button class="sidebar-btn" id="leaderboard-btn" role="button"><span data-i18n="leaderboard">🏆 排行榜</span></button>
        <button class="sidebar-btn profile" id="profile-btn" role="button"><span data-i18n="profile">👤 个人资料</span></button>
        <button class="sidebar-btn teacher" id="teacher-tools-btn" style="display: none;" role="button"><span data-i18n="teacherTools">👨‍🏫 教师工具</span></button>
        <button class="sidebar-btn admin" id="admin-tools-btn" style="display: none;" role="button"><span data-i18n="adminTools">👑 管理工具</span></button>
        <button class="sidebar-btn" id="teacher-application-btn" style="display: none;" role="button"><span data-i18n="applyForTeacher">👨‍🏫 教师申请</span></button>
        <button class="sidebar-btn" id="sync-status-btn" style="display: none;" role="button"><span>☁️ 已同步</span></button>
    </div>
    
    <!-- 主游戏区 -->
    <div class="main-content">
        <div class="header">
            <h1 data-i18n="gameTitle">🧮 数学加法消消乐</h1>
            <p class="subtitle" data-i18n="gameSubtitle">教学优化版 | 云端同步 | 实时排行榜</p>
            
            <div class="user-info" id="user-info" style="display: none;">
                <div class="user-avatar" id="user-avatar">?</div>
                <span class="user-name" id="user-name" data-i18n="user">用户</span>
                <button class="btn" id="logout-btn" style="padding: 8px 15px; font-size: 0.9em;" role="button">
                    <span data-i18n="logout">退出</span>
                </button>
            </div>
        </div>
        
        <div class="container">
            <!-- 游戏模式选择 -->
            <div class="mode-selection">
                <div class="mode-btn active" data-mode="standard" id="mode-standard" role="button" aria-pressed="true">
                    <div class="mode-title" data-i18n="modeStandard">📚 挑战30</div>
                    <div class="mode-desc" data-i18n="modeStandardDesc">完成30题，比拼用时</div>
                </div>
                <div class="mode-btn" data-mode="challenge" id="mode-challenge" role="button" aria-pressed="false">
                    <div class="mode-title" data-i18n="modeChallenge">⚡ 激情90秒</div>
                    <div class="mode-desc" data-i18n="modeChallengeDesc">90秒时间，比拼题数</div>
                </div>
                <div class="mode-btn" data-mode="practice" id="mode-practice" role="button" aria-pressed="false">
                    <div class="mode-title" data-i18n="modePractice">🎯 练习模式</div>
                    <div class="mode-desc" data-i18n="modePracticeDesc">无时间限制，专心学习</div>
                </div>
                <div class="mode-btn" data-mode="custom" id="mode-custom" role="button" aria-pressed="false">
                    <div class="mode-title" data-i18n="modeCustom">⚙️ 自定义</div>
                    <div class="mode-desc" data-i18n="modeCustomDesc">自设参数，灵活练习</div>
                </div>
            </div>
            
            <!-- 游戏设置 -->
            <div class="game-setting">
                <div class="setting-group">
                    <label id="range-label" data-i18n="numberRange">数字范围:</label>
                    <select id="number-range" class="range-select" aria-labelledby="range-label">
                        <option value="0-9" data-i18n="rangeEasy">0-9 (简单)</option>
                        <option value="0-14" selected data-i18n="rangeStandard">0-14 (标准)</option>
                        <option value="5-18" data-i18n="rangeChallenge">5-18 (挑战)</option>
                    </select>
                    <button class="btn" id="start-btn" role="button">
                        <span data-i18n="startGame">🚀 开始游戏</span>
                    </button>
                </div>
                
                <div class="setting-group" id="custom-settings" style="display: none;">
                    <label data-i18n="questionCount">题目数量:</label>
                    <input type="number" id="custom-questions" min="10" max="50" value="20" aria-label="自定义题目数量">
                    <label data-i18n="timeLimit">时间限制(秒):</label>
                    <input type="number" id="custom-time" min="10" max="300" value="60" aria-label="自定义时间限制">
                </div>
            </div>
            
            <!-- 游戏信息 -->
            <div class="game-header" id="game-info" style="display: none;">
                <div class="info-item">
                    <div class="info-label" data-i18n="scoreLabel">得分</div>
                    <div class="info-value" id="score">0</div>
                </div>
                <div class="info-item">
                    <div class="info-label" data-i18n="completedLabel">完成题数</div>
                    <div class="info-value" id="completed">0/30</div>
                </div>
                <div class="info-item" id="time-container">
                    <div class="info-label" data-i18n="timeLeft">剩余时间</div>
                    <div class="info-value" id="time">90</div>
                </div>
                <div class="info-item">
                    <div class="info-label" data-i18n="accuracyLabel">正确率</div>
                    <div class="info-value" id="accuracy">100%</div>
                </div>
            </div>
            
            <!-- 进度条 -->
            <div class="progress-container" id="progress-container" style="display: none;">
                <div class="progress-bar" id="progress-bar" style="width: 100%;"></div>
            </div>
            
            <!-- 目标和 -->
            <div class="target-container" id="target-container" style="display: none;">
                <div class="target-text">
                    <span class="target-label" data-i18n="targetSum">目标和:</span>
                    <div class="target-number" id="target-sum">10</div>
                </div>
            </div>
            
            <!-- 数字网格 -->
            <div class="game-grid" id="game-grid" aria-label="数字卡片网格，每张卡片代表一个数字，点击两张卡片使其和为当前目标"></div>
            
            <!-- 游戏控制按钮 -->
            <div class="controls" id="game-controls" style="display: none;">
                <button class="btn" id="hint-btn" role="button">
                    <span data-i18n="hintButton">💡 提示</span>
                </button>
                <button class="btn" id="refresh-btn" role="button">
                    <span data-i18n="refreshButton">🔄 刷新</span>
                </button>
                <button class="btn" id="endgame-btn" role="button">
                    <span data-i18n="endGameButton">⏹️ 结束</span>
                </button>
            </div>
        </div>
    </div>
    
    <!-- ========== 弹窗区域 ========== -->
    
    <!-- 登录/注册弹窗 -->
    <div class="modal" id="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title" id="auth-title"><span data-i18n="loginTitle">🔐 用户登录</span></h2>
                <button class="close-btn" id="close-auth-modal" aria-label="关闭">×</button>
            </div>
            <div class="auth-form">
                <div id="teacher-register-fields" style="display: none;">
                    <div class="form-group">
                        <label data-i18n="schoolName">学校名称:</label>
                        <input type="text" id="auth-school" data-i18n="schoolNamePlaceholder" placeholder="请输入学校名称">
                    </div>
                    <div class="form-group">
                        <label data-i18n="stateRegion">所在州属:</label>
                        <input type="text" id="auth-state" data-i18n="stateRegionPlaceholder" placeholder="请输入州属">
                    </div>
                </div>
                <div class="form-group">
                    <label data-i18n="emailLabel">邮箱地址:</label>
                    <input type="email" id="auth-email" data-i18n="emailPlaceholder" placeholder="请输入邮箱地址">
                </div>
                <div class="form-group">
                    <label data-i18n="passwordLabel">密码:</label>
                    <input type="password" id="auth-password" data-i18n="passwordPlaceholder" placeholder="请输入密码">
                </div>
                <div id="auth-username-group" style="display: none;">
                    <div class="form-group">
                        <label data-i18n="usernameLabel">用户名:</label>
                        <input type="text" id="auth-username" data-i18n="usernamePlaceholder" placeholder="请输入用户名（可选）">
                    </div>
                </div>
                <div class="form-group" style="display: none;" id="role-select-group">
                    <label>注册身份:</label>
                    <select id="auth-role">
                        <option value="student">学生</option>
                        <option value="teacher">教师</option>
                    </select>
                </div>
                <button class="btn btn-primary" id="auth-submit-btn" role="button"><span data-i18n="loginButton">登录</span></button>
                <div class="auth-error" id="auth-error"></div>
                <div class="auth-switch">
                    <span id="auth-switch-text" data-i18n="noAccount">还没有账号？</span>
                    <a id="auth-switch-link" role="button" tabindex="0"><span data-i18n="registerNow">立即注册</span></a>
                </div>
            </div>
        </div>
    </div>
    
    <!-- 历史记录弹窗 -->
    <div class="modal" id="history-modal" role="dialog" aria-modal="true" aria-labelledby="history-title">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title" id="history-title"><span data-i18n="historyTitle">📝 历史记录</span></h2>
                <button class="close-btn" id="close-history-modal" aria-label="关闭">×</button>
            </div>
            <div class="table-responsive">
                <table class="history-table">
                    <thead>
                        <tr>
                            <th data-i18n="tableNumber">#</th>
                            <th data-i18n="tableTarget">目标</th>
                            <th data-i18n="tableNum1">数字1</th>
                            <th data-i18n="tableNum2">数字2</th>
                            <th data-i18n="tableResult">结果</th>
                            <th data-i18n="tableTime">用时(秒)</th>
                        </tr>
                    </thead>
                    <tbody id="history-table-body"></tbody>
                </table>
            </div>
            <div class="controls" style="margin-top: 20px;">
                <button class="btn" id="clear-history-btn" role="button"><span data-i18n="clearHistory">清空本次记录</span></button>
            </div>
        </div>
    </div>
    
    <!-- 统计弹窗 -->
    <div class="modal" id="statistics-modal" role="dialog" aria-modal="true" aria-labelledby="statistics-title">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title" id="statistics-title"><span data-i18n="statisticsTitle">📊 统计分析</span></h2>
                <button class="close-btn" id="close-statistics-modal" aria-label="关闭">×</button>
            </div>
            <div id="statistics-content">
                <div style="padding: 20px;"><p id="stats-text" data-i18n="loadingStats">加载统计信息中...</p></div>
            </div>
        </div>
    </div>
    
    <!-- 成就弹窗 -->
    <div class="modal" id="achievements-modal" role="dialog" aria-modal="true" aria-labelledby="achievements-title">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title" id="achievements-title"><span data-i18n="achievementsTitle">⭐ 成就系统</span></h2>
                <button class="close-btn" id="close-achievements-modal" aria-label="关闭">×</button>
            </div>
            <div class="achievements-grid" id="achievements-grid"></div>
        </div>
    </div>
    
    <!-- 错题本弹窗 -->
    <div class="modal" id="wrongbook-modal" role="dialog" aria-modal="true" aria-labelledby="wrongbook-title">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title" id="wrongbook-title"><span data-i18n="wrongbookTitle">📖 错题本</span></h2>
                <button class="close-btn" id="close-wrongbook-modal" aria-label="关闭">×</button>
            </div>
            <div class="wrong-questions-list" id="wrong-questions-list"></div>
            <div class="controls" style="margin-top: 20px;">
                <button class="btn" id="sync-wrong-questions-btn" role="button">
                    <span data-i18n="syncWrongQuestions">☁️ 同步错题到云端</span>
                </button>
                <button class="btn" id="clear-wrong-questions-btn" role="button">
                    <span data-i18n="clearWrongQuestions">🗑️ 清空本地错题</span>
                </button>
            </div>
        </div>
    </div>
    
    <!-- 排行榜弹窗 -->
    <div class="modal" id="leaderboard-modal" role="dialog" aria-modal="true" aria-labelledby="leaderboard-title">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title" id="leaderboard-title"><span data-i18n="leaderboardTitle">🏆 排行榜</span></h2>
                <button class="close-btn" id="close-leaderboard-modal" aria-label="关闭">×</button>
            </div>
            
            <!-- 游戏模式选择选项卡 -->
            <div class="tabs game-mode-tabs">
                <button class="tab-btn active" data-game-mode="challenge" id="tab-challenge-mode" role="tab" aria-selected="true"><span data-i18n="leaderboardChallengeMode">⚡ 激情90秒</span></button>
                <button class="tab-btn" data-game-mode="standard" id="tab-standard-mode" role="tab" aria-selected="false"><span data-i18n="leaderboardStandardMode">📚 挑战30</span></button>
            </div>
            
            <!-- 难度选择选项卡 -->
            <div class="tabs difficulty-tabs" id="difficulty-tabs">
                <button class="tab-btn active" data-difficulty="easy" id="tab-easy" role="tab" aria-selected="true"><span data-i18n="leaderboardEasy">🟢 简单模式</span></button>
                <button class="tab-btn" data-difficulty="medium" id="tab-medium" role="tab" aria-selected="false"><span data-i18n="leaderboardStandard">🟠 标准模式</span></button>
                <button class="tab-btn" data-difficulty="hard" id="tab-hard" role="tab" aria-selected="false"><span data-i18n="leaderboardChallenge">🔴 困难模式</span></button>
            </div>
            
            <!-- 排行榜头部 -->
            <div class="leaderboard-header">
                <h3 class="leaderboard-title" id="leaderboard-dynamic-title">⚡ 激情90秒 · 🟢 简单模式</h3>
                <div class="leaderboard-controls">
                    <div class="limit-selector">
                        <label data-i18n="show">显示:</label>
                        <select id="leaderboard-limit" class="limit-select">
                            <option value="5">5名</option>
                            <option value="10" selected>10名</option>
                            <option value="20">20名</option>
                            <option value="50">50名</option>
                        </select>
                    </div>
                    <button class="leaderboard-refresh-btn" id="sync-leaderboard-btn" role="button">
                        🔄 <span data-i18n="refresh">刷新</span>
                    </button>
                </div>
            </div>
            
            <!-- 排行榜容器 -->
            <div id="leaderboard-content"></div>
            
            <!-- 分页控件 -->
            <div class="leaderboard-pagination" id="leaderboard-pagination">
                <button class="pagination-btn" id="page-prev" data-page="prev" disabled role="button">←</button>
                <button class="pagination-btn active" id="page-1" data-page="1" role="button">1</button>
                <button class="pagination-btn" id="page-2" data-page="2" role="button">2</button>
                <button class="pagination-btn" id="page-3" data-page="3" role="button">3</button>
                <button class="pagination-btn" id="page-next" data-page="next" disabled role="button">→</button>
            </div>
            
            <!-- 我的最佳成绩卡片 -->
            <div class="my-best-card" id="my-best-card" style="display: none;">
                <div class="my-best-title">
                    <span>👤</span> <span data-i18n="myBest">我的最佳</span>
                </div>
                <div class="my-best-grid">
                    <div class="my-best-item">
                        <div class="my-best-label" data-i18n="bestScore">最佳得分</div>
                        <div class="my-best-value" id="my-best-score">0</div>
                    </div>
                    <div class="my-best-item">
                        <div class="my-best-label" data-i18n="bestAccuracy">最佳正确率</div>
                        <div class="my-best-value" id="my-best-accuracy">0%</div>
                    </div>
                    <div class="my-best-item">
                        <div class="my-best-label" data-i18n="bestTime">最快用时</div>
                        <div class="my-best-value" id="my-best-time">0s</div>
                    </div>
                </div>
            </div>
            
            <!-- 登录提示 -->
            <div class="leaderboard-login-prompt" id="login-prompt" style="display: none;">
                <h4 data-i18n="needLogin">🔐 需要登录</h4>
                <p data-i18n="loginPrompt">登录后查看个人排名</p>
                <button class="leaderboard-login-btn" id="leaderboard-login-btn" role="button">
                    🔑 <span data-i18n="loginNow">立即登录</span>
                </button>
            </div>
            
            <!-- 离线模式提示 -->
            <div class="leaderboard-offline" id="leaderboard-offline" style="display: none;">
                📴 <span data-i18n="offlineMode">离线模式：排行榜数据不可用</span>
            </div>
        </div>
    </div>
    
    <!-- 个人资料弹窗 -->
    <div class="modal" id="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title" id="profile-title"><span data-i18n="profileTitle">👤 个人资料</span></h2>
                <button class="close-btn" id="close-profile-modal" aria-label="关闭">×</button>
            </div>
            <div class="profile-info">
                <div class="profile-avatar" id="profile-avatar">?</div>
                <div id="profile-email">加载中...</div>
                <div id="profile-role" style="color: #666; margin-bottom: 10px;"></div>
                <div class="profile-stats">
                    <div class="profile-stat">
                        <div class="profile-stat-label" data-i18n="totalGames">游戏次数</div>
                        <div class="profile-stat-value" id="profile-game-count">0</div>
                    </div>
                    <div class="profile-stat">
                        <div class="profile-stat-label" data-i18n="bestScore">最佳得分</div>
                        <div class="profile-stat-value" id="profile-high-score">0</div>
                    </div>
                    <div class="profile-stat">
                        <div class="profile-stat-label" data-i18n="avgAccuracy">平均正确率</div>
                        <div class="profile-stat-value" id="profile-avg-accuracy">0%</div>
                    </div>
                    <div class="profile-stat">
                        <div class="profile-stat-label" data-i18n="joinDate">注册时间</div>
                        <div class="profile-stat-value" id="profile-join-date">-</div>
                    </div>
                </div>
                <div class="profile-sync-status" id="profile-sync-status"></div>
            </div>
        </div>
    </div>
    
    <!-- 教师工具弹窗 -->
    <div class="modal" id="teacher-tools-modal" role="dialog" aria-modal="true" aria-labelledby="teacher-tools-title">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title" id="teacher-tools-title"><span data-i18n="teacherToolsTitle">👨‍🏫 教师管理工具</span></h2>
                <button class="close-btn" id="close-teacher-tools" aria-label="关闭">×</button>
            </div>
            
            <div style="padding: 20px;">
                <!-- 选项卡 -->
                <div class="tabs">
                    <button class="tab-btn active" data-tab="batch-register" id="tab-batch-register" role="tab" aria-selected="true"><span data-i18n="batchRegister">📦 批量注册</span></button>
                    <button class="tab-btn" data-tab="teacher-approval" id="tab-teacher-approval" role="tab" aria-selected="false"><span data-i18n="teacherApproval">✅ 教师审核</span></button>
                    <button class="tab-btn" data-tab="class-management" id="tab-class-management" role="tab" aria-selected="false"><span data-i18n="classManagement">📚 班级管理</span></button>
                </div>
                
                <!-- 批量注册标签页 -->
                <div id="batch-register-tab" class="tab-content active">
                    <h3 style="margin-bottom: 15px; color: #333;"><span data-i18n="batchRegister">📦 批量注册学生账号</span></h3>
                    
                    <div class="form-group">
                        <label data-i18n="downloadTemplate">📥 下载模板文件：</label>
                        <button class="btn" id="download-template-btn" style="background: #6c757d;" role="button">
                            📥 <span data-i18n="downloadTemplate">下载模板</span>
                        </button>
                    </div>
                    
                    <div class="form-group">
                        <label data-i18n="uploadExcel">📤 上传Excel/CSV文件：</label>
                        <input type="file" id="excel-file" accept=".csv,.xlsx,.xls" style="padding: 10px; border: 2px dashed #ffd700; border-radius: 8px; width: 100%;">
                    </div>
                    
                    <div class="form-group">
                        <label data-i18n="defaultPassword">🔑 默认密码：</label>
                        <input type="text" id="default-password" value="stu123456" data-i18n="defaultPasswordPlaceholder" placeholder="留空则使用 stu123456">
                    </div>
                    
                    <div class="form-group">
                        <label data-i18n="className">🏫 班级名称：</label>
                        <input type="text" id="class-name" data-i18n="classNamePlaceholder" placeholder="例如：三年一班">
                    </div>
                    
                    <button class="btn btn-primary" id="upload-excel-btn" style="margin-top: 20px;" role="button">
                        📤 <span data-i18n="uploadExcel">开始批量注册</span>
                    </button>
                    
                    <div id="upload-progress" style="margin-top: 20px; display: none;">
                        <div class="progress-container">
                            <div class="progress-bar" id="upload-progress-bar" style="width: 0%"></div>
                        </div>
                        <div id="upload-status" style="text-align: center; margin-top: 10px; color: #666;"></div>
                    </div>
                    
                    <div id="upload-result" style="margin-top: 20px; max-height: 300px; overflow-y: auto; padding: 15px; background: #f8f9fa; border-radius: 8px; display: none;"></div>
                    
                    <div id="account-cards" style="margin-top: 20px; display: none;">
                        <h4><span data-i18n="accountCards">📇 生成的账号卡片</span></h4>
                        <div id="account-cards-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 10px; margin-top: 10px;"></div>
                        <button class="btn" id="print-cards-btn" style="margin-top: 15px; background: #2196F3;" role="button">
                            🖨️ <span data-i18n="printCards">打印卡片</span>
                        </button>
                    </div>
                </div>
                
                <!-- 教师审核标签页 -->
                <div id="teacher-approval-tab" class="tab-content" style="display: none;">
                    <h3 style="margin-bottom: 15px; color: #333;"><span data-i18n="teacherApproval">✅ 教师审核</span></h3>
                    <div id="pending-teachers-list" style="max-height: 400px; overflow-y: auto; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                        <div style="text-align: center; padding: 40px; color: #666;">
                            <span data-i18n="noPendingApplications">暂无待审核的教师申请</span>
                        </div>
                    </div>
                </div>
                
                <!-- 班级管理标签页 -->
                <div id="class-management-tab" class="tab-content" style="display: none;">
                    <h3 style="margin-bottom: 15px; color: #333;"><span data-i18n="classManagement">📚 班级管理</span></h3>
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <span data-i18n="comingSoon">功能开发中，敬请期待...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- 管理员工具弹窗 -->
    <div class="modal" id="admin-tools-modal" role="dialog" aria-modal="true" aria-labelledby="admin-tools-title">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title" id="admin-tools-title"><span data-i18n="adminToolsTitle">👑 系统管理工具</span></h2>
                <button class="close-btn" id="close-admin-tools" aria-label="关闭">×</button>
            </div>
            
            <div style="padding: 20px;">
                <!-- 选项卡 -->
                <div class="tabs">
                    <button class="tab-btn active" data-tab="system-stats" id="tab-system-stats" role="tab" aria-selected="true"><span data-i18n="systemStats">📊 系统统计</span></button>
                    <button class="tab-btn" data-tab="teacher-management" id="tab-teacher-management" role="tab" aria-selected="false"><span data-i18n="teacherManagement">👨‍🏫 教师管理</span></button>
                    <button class="tab-btn" data-tab="system-logs" id="tab-system-logs" role="tab" aria-selected="false"><span data-i18n="systemLogs">📋 系统日志</span></button>
                </div>
                
                <!-- 系统统计标签页 -->
                <div id="system-stats-tab" class="tab-content active">
                    <h3 style="margin-bottom: 15px; color: #333;"><span data-i18n="systemStats">📊 系统统计</span></h3>
                    <div class="controls" style="margin-bottom: 15px;">
                        <button class="btn" id="refresh-stats-btn" style="background: #4CAF50;" role="button">🔄 <span data-i18n="refresh">刷新统计</span></button>
                    </div>
                    <div id="system-statistics" style="padding: 10px;">
                        <div style="text-align: center; padding: 40px; color: #666;">
                            <span data-i18n="loadingStats">加载系统统计中...</span>
                        </div>
                    </div>
                </div>
                
                <!-- 教师管理标签页 -->
                <div id="teacher-management-tab" class="tab-content" style="display: none;">
                    <h3 style="margin-bottom: 15px; color: #333;"><span data-i18n="teacherManagement">👨‍🏫 教师管理</span></h3>
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <span data-i18n="comingSoon">功能开发中，敬请期待...</span>
                    </div>
                </div>
                
                <!-- 系统日志标签页 -->
                <div id="system-logs-tab" class="tab-content" style="display: none;">
                    <h3 style="margin-bottom: 15px; color: #333;"><span data-i18n="systemLogs">📋 系统日志</span></h3>
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <span data-i18n="comingSoon">功能开发中，敬请期待...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- 游戏结束弹窗 -->
    <div class="game-over" id="game-over" role="dialog" aria-modal="true" aria-labelledby="result-title">
        <div class="result-card">
            <button class="close-btn" id="close-game-over" aria-label="关闭">×</button>
            <div class="result-title" id="result-title">🎉 游戏结束!</div>
            <div class="result-stats">
                <div class="stat-item">
                    <div class="stat-label" data-i18n="finalScore">最终得分</div>
                    <div class="stat-value" id="final-score">0</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label" data-i18n="finalCompleted">完成题数</div>
                    <div class="stat-value" id="final-completed">0</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label" data-i18n="finalTime">用时</div>
                    <div class="stat-value" id="final-time">0秒</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label" data-i18n="finalAccuracy">正确率</div>
                    <div class="stat-value" id="final-accuracy">100%</div>
                </div>
            </div>
            <div class="input-group">
                <input type="text" id="player-name" data-i18n="playerNamePlaceholder" placeholder="请输入你的名字" maxlength="20" aria-label="玩家名称">
                <button class="btn" id="save-score-btn" role="button"><span data-i18n="saveScore">保存成绩</span></button>
            </div>
            <div class="controls">
                <button class="btn btn-primary" id="play-again-btn" role="button"><span data-i18n="playAgain">再玩一次</span></button>
                <button class="btn" id="view-leaderboard-btn" role="button"><span data-i18n="viewLeaderboard">查看排行榜</span></button>
                <button class="btn" id="view-statistics-btn" role="button"><span data-i18n="viewStatistics">查看统计</span></button>
            </div>
        </div>
    </div>
    
    <!-- 匹配反馈 -->
    <div class="match-feedback" id="match-feedback" aria-live="polite" aria-atomic="true"></div>
    
    <!-- ========== 加载JavaScript ========== -->
    <script src="app.js" defer></script>
    
    <!-- 备用JS加载 -->
    <script>
        window.addEventListener('error', function(e) {
            if (e.target.tagName === 'SCRIPT' && e.target.src.includes('app.js')) {
                console.error('主JS文件加载失败，尝试加载备用...');
                var fallbackScript = document.createElement('script');
                fallbackScript.src = 'deepseek_javascript_20260214_55b278.js';
                fallbackScript.defer = true;
                document.body.appendChild(fallbackScript);
            }
        }, true);
    </script>
    
    <!-- 网络状态监控 -->
    <script>
        (function() {
            var networkStatus = document.getElementById('network-status');
            
            function updateNetworkStatus() {
                if (navigator.onLine) {
                    networkStatus.className = 'network-status online';
                    networkStatus.textContent = '🟢 在线模式';
                    
                    // 3秒后隐藏
                    setTimeout(function() {
                        networkStatus.style.display = 'none';
                    }, 3000);
                } else {
                    networkStatus.className = 'network-status offline';
                    networkStatus.textContent = '🔴 离线模式 - 请检查网络连接';
                }
            }
            
            window.addEventListener('online', updateNetworkStatus);
            window.addEventListener('offline', updateNetworkStatus);
            
            // 初始检查
            updateNetworkStatus();
        })();
    </script>
    
    <!-- 确保页面加载完成后初始化游戏 -->
    <script>
        window.addEventListener('load', function() {
            setTimeout(function() {
                var overlay = document.getElementById('loading-overlay');
                if (overlay) {
                    overlay.classList.add('hide-loading');
                    document.body.classList.add('loaded');
                    
                    setTimeout(function() {
                        overlay.style.display = 'none';
                    }, 500);
                }
                
                if (window.MathGame && typeof window.MathGame.init === 'function') {
                    window.MathGame.init();
                } else {
                    console.warn('MathGame对象未找到，将在1秒后重试');
                    setTimeout(function() {
                        if (window.MathGame && typeof window.MathGame.init === 'function') {
                            window.MathGame.init();
                        } else {
                            console.error('MathGame对象仍然未找到，请检查JS文件');
                        }
                    }, 1000);
                }
            }, 1000);
        });
        
        setTimeout(function() {
            var overlay = document.getElementById('loading-overlay');
            if (overlay && overlay.style.display !== 'none') {
                overlay.classList.add('hide-loading');
                document.body.classList.add('loaded');
                setTimeout(function() {
                    overlay.style.display = 'none';
                }, 500);
            }
        }, 10000);
    </script>
</body>
</html>
