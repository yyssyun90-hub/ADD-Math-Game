// ==================== app.js ====================
// 数学加法消消乐 - Supabase 完整数据库架构
// 适用于区域学校多租户教育系统
// 版本: 4.0.0 (最终生产版)
// 最后更新: 2026-02-21
// 作者: MathGame Team
// 许可证: MIT

(function(global) {
    'use strict';

    /**
     * 数学加法消消乐 - Supabase 数据库架构
     * 包含完整的表结构、索引、RLS策略、函数、触发器和初始化数据
     */
    const SUPABASE_SCHEMA = {
        version: '4.0.0',
        
        /**
         * 扩展和枚举类型定义
         */
        extensions: `
            -- 创建必要扩展
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            CREATE EXTENSION IF NOT EXISTS "pgcrypto";
            CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
            CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- 支持复合索引
        `,

        enums: `
            -- 用户角色枚举
            DO $$ BEGIN
                CREATE TYPE user_role AS ENUM ('super_admin', 'school_admin', 'teacher', 'student');
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$;
            
            -- 用户状态枚举
            DO $$ BEGIN
                CREATE TYPE user_status AS ENUM ('active', 'inactive', 'graduated', 'transferred');
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$;
            
            -- 游戏模式枚举
            DO $$ BEGIN
                CREATE TYPE game_mode AS ENUM ('standard', 'challenge', 'practice', 'custom');
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$;
            
            -- 难度级别枚举
            DO $$ BEGIN
                CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$;
            
            -- 作业状态枚举
            DO $$ BEGIN
                CREATE TYPE assignment_status AS ENUM ('draft', 'published', 'ended', 'archived');
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$;
            
            -- 通知优先级枚举
            DO $$ BEGIN
                CREATE TYPE notification_priority AS ENUM ('low', 'normal', 'high', 'urgent');
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$;
            
            -- 排行榜类型枚举
            DO $$ BEGIN
                CREATE TYPE leaderboard_type AS ENUM ('school', 'grade', 'class', 'global');
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$;
            
            -- 排行榜周期枚举
            DO $$ BEGIN
                CREATE TYPE leaderboard_period AS ENUM ('daily', 'weekly', 'monthly', 'yearly');
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$;
        `,
        
        /**
         * 核心函数定义
         */
        functions: `
            -- 更新时间戳触发器函数
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
            
            -- 软删除检查函数
            CREATE OR REPLACE FUNCTION check_not_deleted()
            RETURNS TRIGGER AS $$
            BEGIN
                IF OLD.is_deleted THEN
                    RAISE EXCEPTION '记录已被删除';
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
            
            -- 更新班级学生数统计函数
            CREATE OR REPLACE FUNCTION update_class_student_count()
            RETURNS TRIGGER AS $$
            BEGIN
                IF TG_OP = 'INSERT' AND NEW.role = 'student'::user_role AND NEW.class_id IS NOT NULL THEN
                    UPDATE classes 
                    SET student_count = student_count + 1,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = NEW.class_id;
                ELSIF TG_OP = 'UPDATE' AND NEW.role = 'student'::user_role THEN
                    IF OLD.class_id IS DISTINCT FROM NEW.class_id THEN
                        IF OLD.class_id IS NOT NULL THEN
                            UPDATE classes 
                            SET student_count = student_count - 1,
                                updated_at = CURRENT_TIMESTAMP
                            WHERE id = OLD.class_id;
                        END IF;
                        IF NEW.class_id IS NOT NULL THEN
                            UPDATE classes 
                            SET student_count = student_count + 1,
                                updated_at = CURRENT_TIMESTAMP
                            WHERE id = NEW.class_id;
                        END IF;
                    END IF;
                ELSIF TG_OP = 'DELETE' AND OLD.role = 'student'::user_role AND OLD.class_id IS NOT NULL THEN
                    UPDATE classes 
                    SET student_count = student_count - 1,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = OLD.class_id;
                END IF;
                RETURN NULL;
            END;
            $$ LANGUAGE plpgsql;
            
            -- 计算学生掌握度函数
            CREATE OR REPLACE FUNCTION calculate_mastery_level(
                p_user_id UUID,
                p_knowledge_point VARCHAR
            ) RETURNS INTEGER AS $$
            DECLARE
                total_attempts INTEGER;
                correct_count INTEGER;
                mastery_level INTEGER;
            BEGIN
                SELECT 
                    COUNT(*),
                    COUNT(*) FILTER (WHERE (value->>'is_correct')::boolean)
                INTO total_attempts, correct_count
                FROM game_records gr,
                LATERAL jsonb_array_elements(gr.game_data->'questions') AS value
                WHERE gr.user_id = p_user_id
                AND gr.game_data IS NOT NULL
                AND value->>'knowledge_point' = p_knowledge_point;
                
                IF total_attempts = 0 OR total_attempts IS NULL THEN
                    RETURN 0;
                END IF;
                
                mastery_level := (correct_count::FLOAT / total_attempts::FLOAT * 100)::INTEGER;
                RETURN mastery_level;
            END;
            $$ LANGUAGE plpgsql;
            
            -- 生成周报函数
            CREATE OR REPLACE FUNCTION generate_weekly_report(
                p_school_id UUID,
                p_week_date DATE
            ) RETURNS JSONB AS $$
            DECLARE
                report JSONB;
            BEGIN
                WITH weekly_stats AS (
                    SELECT 
                        c.id AS class_id,
                        c.name AS class_name,
                        COUNT(DISTINCT gr.user_id) AS active_students,
                        COUNT(gr.id) AS total_games,
                        COALESCE(AVG(gr.accuracy), 0) AS avg_accuracy,
                        COALESCE(SUM(gr.questions_completed), 0) AS total_questions,
                        COUNT(DISTINCT wq.id) AS new_wrong_questions
                    FROM classes c
                    LEFT JOIN game_records gr ON gr.class_id = c.id 
                        AND gr.created_at >= p_week_date
                        AND gr.created_at < p_week_date + INTERVAL '7 days'
                        AND NOT gr.is_deleted
                    LEFT JOIN wrong_questions wq ON wq.class_id = c.id
                        AND wq.created_at >= p_week_date
                        AND wq.created_at < p_week_date + INTERVAL '7 days'
                        AND NOT wq.is_deleted
                    WHERE c.school_id = p_school_id
                    AND NOT c.is_deleted
                    GROUP BY c.id, c.name
                )
                SELECT jsonb_build_object(
                    'school_id', p_school_id,
                    'week_start', p_week_date,
                    'week_end', p_week_date + INTERVAL '6 days',
                    'total_classes', (SELECT COUNT(*) FROM classes WHERE school_id = p_school_id AND NOT is_deleted),
                    'active_classes', (SELECT COUNT(*) FROM weekly_stats WHERE active_students > 0),
                    'total_students', (SELECT COUNT(*) FROM profiles WHERE school_id = p_school_id AND role = 'student'::user_role AND NOT is_deleted),
                    'class_stats', (SELECT jsonb_agg(weekly_stats) FROM weekly_stats)
                ) INTO report;
                
                RETURN COALESCE(report, '{}'::jsonb);
            END;
            $$ LANGUAGE plpgsql;
            
            -- 归档旧数据函数
            CREATE OR REPLACE FUNCTION archive_old_records(p_days INTEGER DEFAULT 365)
            RETURNS TABLE(table_name TEXT, archived_count BIGINT) AS $$
            DECLARE
                v_cutoff_date TIMESTAMP;
            BEGIN
                v_cutoff_date := NOW() - (p_days || ' days')::INTERVAL;
                
                -- 创建归档表（如果不存在）
                CREATE TABLE IF NOT EXISTS game_records_archive (LIKE game_records INCLUDING ALL);
                CREATE TABLE IF NOT EXISTS system_logs_archive (LIKE system_logs INCLUDING ALL);
                
                -- 归档游戏记录
                WITH moved AS (
                    DELETE FROM game_records 
                    WHERE created_at < v_cutoff_date
                    RETURNING *
                )
                INSERT INTO game_records_archive SELECT * FROM moved;
                GET DIAGNOSTICS archived_count = ROW_COUNT;
                table_name := 'game_records';
                RETURN NEXT;
                
                -- 归档系统日志
                WITH moved AS (
                    DELETE FROM system_logs 
                    WHERE created_at < v_cutoff_date
                    RETURNING *
                )
                INSERT INTO system_logs_archive SELECT * FROM moved;
                GET DIAGNOSTICS archived_count = ROW_COUNT;
                table_name := 'system_logs';
                RETURN NEXT;
            END;
            $$ LANGUAGE plpgsql;
            
            -- 数据清洗函数
            CREATE OR REPLACE FUNCTION clean_soft_deleted_data(p_days INTEGER DEFAULT 30)
            RETURNS TABLE(table_name TEXT, deleted_count BIGINT) AS $$
            DECLARE
                v_cutoff_date TIMESTAMP;
            BEGIN
                v_cutoff_date := NOW() - (p_days || ' days')::INTERVAL;
                
                -- 清理软删除超过指定天数的数据
                DELETE FROM schools WHERE is_deleted AND deleted_at < v_cutoff_date;
                GET DIAGNOSTICS deleted_count = ROW_COUNT;
                table_name := 'schools';
                RETURN NEXT;
                
                DELETE FROM profiles WHERE is_deleted AND deleted_at < v_cutoff_date;
                GET DIAGNOSTICS deleted_count = ROW_COUNT;
                table_name := 'profiles';
                RETURN NEXT;
                
                DELETE FROM game_records WHERE is_deleted AND deleted_at < v_cutoff_date;
                GET DIAGNOSTICS deleted_count = ROW_COUNT;
                table_name := 'game_records';
                RETURN NEXT;
            END;
            $$ LANGUAGE plpgsql;
        `,
        
        /**
         * 表结构定义
         */
        tables: {
            // 1. 学校表
            schools: `
                CREATE TABLE schools (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    name VARCHAR(200) NOT NULL,
                    code VARCHAR(50) UNIQUE NOT NULL,
                    district VARCHAR(100),
                    address TEXT,
                    phone VARCHAR(20),
                    email VARCHAR(100),
                    principal_name VARCHAR(100),
                    established_year INTEGER CHECK (established_year BETWEEN 1900 AND 2100),
                    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
                    settings JSONB DEFAULT '{}'::jsonb,
                    
                    -- 软删除和版本控制
                    is_deleted BOOLEAN DEFAULT FALSE,
                    deleted_at TIMESTAMP WITH TIME ZONE,
                    version INTEGER DEFAULT 1,
                    
                    -- 审计字段
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    
                    -- 约束
                    CONSTRAINT valid_school_email CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
                    CONSTRAINT valid_school_phone CHECK (phone IS NULL OR phone ~* '^[0-9+-]{10,15}$')
                );
                
                -- 索引
                CREATE INDEX idx_schools_code ON schools(code) WHERE NOT is_deleted;
                CREATE INDEX idx_schools_district ON schools(district) WHERE NOT is_deleted;
                CREATE INDEX idx_schools_status ON schools(status) WHERE NOT is_deleted;
                CREATE INDEX idx_schools_search ON schools USING GIN (to_tsvector('simple', COALESCE(name, '') || ' ' || COALESCE(code, '')));
                CREATE INDEX idx_schools_created_at ON schools(created_at);
                
                -- 触发器
                CREATE TRIGGER trigger_update_schools_updated_at
                    BEFORE UPDATE ON schools
                    FOR EACH ROW
                    EXECUTE FUNCTION update_updated_at_column();
                    
                CREATE TRIGGER trigger_check_schools_not_deleted
                    BEFORE UPDATE ON schools
                    FOR EACH ROW
                    WHEN (OLD.is_deleted = true)
                    EXECUTE FUNCTION check_not_deleted();
            `,

            // 2. 学年表
            academic_years: `
                CREATE TABLE academic_years (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
                    name VARCHAR(50) NOT NULL,
                    start_date DATE NOT NULL,
                    end_date DATE NOT NULL CHECK (end_date > start_date),
                    is_current BOOLEAN DEFAULT FALSE,
                    settings JSONB DEFAULT '{}'::jsonb,
                    
                    is_deleted BOOLEAN DEFAULT FALSE,
                    deleted_at TIMESTAMP WITH TIME ZONE,
                    
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    
                    UNIQUE(school_id, name)
                );

                CREATE INDEX idx_academic_years_school ON academic_years(school_id) WHERE NOT is_deleted;
                CREATE INDEX idx_academic_years_current ON academic_years(is_current) WHERE is_current AND NOT is_deleted;
                CREATE INDEX idx_academic_years_dates ON academic_years(start_date, end_date) WHERE NOT is_deleted;

                CREATE TRIGGER trigger_update_academic_years_updated_at
                    BEFORE UPDATE ON academic_years
                    FOR EACH ROW
                    EXECUTE FUNCTION update_updated_at_column();
            `,

            // 3. 年级表
            grades: `
                CREATE TABLE grades (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
                    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
                    name VARCHAR(50) NOT NULL,
                    level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 12),
                    class_count INTEGER DEFAULT 0,
                    student_count INTEGER DEFAULT 0,
                    settings JSONB DEFAULT '{}'::jsonb,
                    
                    is_deleted BOOLEAN DEFAULT FALSE,
                    deleted_at TIMESTAMP WITH TIME ZONE,
                    
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    
                    UNIQUE(school_id, academic_year_id, level)
                );

                CREATE INDEX idx_grades_school ON grades(school_id) WHERE NOT is_deleted;
                CREATE INDEX idx_grades_academic_year ON grades(academic_year_id) WHERE NOT is_deleted;
                CREATE INDEX idx_grades_level ON grades(level) WHERE NOT is_deleted;

                CREATE TRIGGER trigger_update_grades_updated_at
                    BEFORE UPDATE ON grades
                    FOR EACH ROW
                    EXECUTE FUNCTION update_updated_at_column();
            `,

            // 4. 班级表
            classes: `
                CREATE TABLE classes (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
                    grade_id UUID NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
                    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
                    name VARCHAR(50) NOT NULL,
                    class_number INTEGER,
                    room_number VARCHAR(50),
                    student_count INTEGER DEFAULT 0,
                    settings JSONB DEFAULT '{}'::jsonb,
                    
                    is_deleted BOOLEAN DEFAULT FALSE,
                    deleted_at TIMESTAMP WITH TIME ZONE,
                    
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    
                    UNIQUE(school_id, grade_id, academic_year_id, name)
                );

                CREATE INDEX idx_classes_school ON classes(school_id) WHERE NOT is_deleted;
                CREATE INDEX idx_classes_grade ON classes(grade_id) WHERE NOT is_deleted;
                CREATE INDEX idx_classes_academic_year ON classes(academic_year_id) WHERE NOT is_deleted;
                CREATE INDEX idx_classes_school_grade ON classes(school_id, grade_id) WHERE NOT is_deleted;

                CREATE TRIGGER trigger_update_classes_updated_at
                    BEFORE UPDATE ON classes
                    FOR EACH ROW
                    EXECUTE FUNCTION update_updated_at_column();
            `,

            // 5. 用户扩展表
            profiles: `
                CREATE TABLE profiles (
                    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
                    school_id UUID REFERENCES schools(id),
                    class_id UUID REFERENCES classes(id),
                    grade_id UUID REFERENCES grades(id),
                    academic_year_id UUID REFERENCES academic_years(id),
                    username VARCHAR(100) UNIQUE,
                    real_name VARCHAR(100),
                    student_no VARCHAR(50),
                    role user_role NOT NULL DEFAULT 'student',
                    status user_status DEFAULT 'active',
                    
                    -- 学生特定字段
                    parent_name VARCHAR(100),
                    parent_phone VARCHAR(20),
                    parent_email VARCHAR(100),
                    enrollment_date DATE,
                    
                    -- 教师特定字段
                    teacher_no VARCHAR(50),
                    title VARCHAR(50),
                    subjects TEXT[],
                    
                    -- 公共字段
                    avatar_url TEXT,
                    phone VARCHAR(20),
                    settings JSONB DEFAULT '{}'::jsonb,
                    
                    -- 软删除和版本控制
                    is_deleted BOOLEAN DEFAULT FALSE,
                    deleted_at TIMESTAMP WITH TIME ZONE,
                    version INTEGER DEFAULT 1,
                    
                    -- 审计字段
                    last_login_at TIMESTAMP WITH TIME ZONE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    
                    -- 约束
                    CONSTRAINT valid_profile_email CHECK (parent_email IS NULL OR parent_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
                    CONSTRAINT valid_profile_phone CHECK (phone IS NULL OR phone ~* '^[0-9+-]{10,15}$'),
                    CONSTRAINT valid_parent_phone CHECK (parent_phone IS NULL OR parent_phone ~* '^[0-9+-]{10,15}$'),
                    CONSTRAINT student_has_class CHECK (role != 'student' OR (role = 'student' AND class_id IS NOT NULL)),
                    CONSTRAINT teacher_has_school CHECK (role != 'teacher' OR (role = 'teacher' AND school_id IS NOT NULL))
                );

                -- 索引
                CREATE INDEX idx_profiles_school ON profiles(school_id) WHERE NOT is_deleted;
                CREATE INDEX idx_profiles_class ON profiles(class_id) WHERE NOT is_deleted;
                CREATE INDEX idx_profiles_grade ON profiles(grade_id) WHERE NOT is_deleted;
                CREATE INDEX idx_profiles_role ON profiles(role) WHERE NOT is_deleted;
                CREATE INDEX idx_profiles_student_no ON profiles(student_no) WHERE NOT is_deleted AND role = 'student';
                CREATE INDEX idx_profiles_teacher_no ON profiles(teacher_no) WHERE NOT is_deleted AND role = 'teacher';
                CREATE INDEX idx_profiles_status ON profiles(status) WHERE NOT is_deleted;
                CREATE INDEX idx_profiles_parent_phone ON profiles(parent_phone) WHERE NOT is_deleted;
                CREATE INDEX idx_profiles_search ON profiles USING GIN (to_tsvector('simple', COALESCE(real_name, '') || ' ' || COALESCE(student_no, '')));
                CREATE INDEX idx_profiles_school_role ON profiles(school_id, role) WHERE NOT is_deleted;

                -- 触发器
                CREATE TRIGGER trigger_update_profiles_updated_at
                    BEFORE UPDATE ON profiles
                    FOR EACH ROW
                    EXECUTE FUNCTION update_updated_at_column();

                CREATE TRIGGER trigger_profiles_update_class_count
                    AFTER INSERT OR UPDATE OR DELETE ON profiles
                    FOR EACH ROW
                    EXECUTE FUNCTION update_class_student_count();
            `,

            // 6. 教师-班级关联表
            teacher_classes: `
                CREATE TABLE teacher_classes (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
                    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
                    subject VARCHAR(50) NOT NULL,
                    is_homeroom BOOLEAN DEFAULT FALSE,
                    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
                    is_active BOOLEAN DEFAULT TRUE,
                    
                    is_deleted BOOLEAN DEFAULT FALSE,
                    deleted_at TIMESTAMP WITH TIME ZONE,
                    
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    
                    UNIQUE(teacher_id, class_id, academic_year_id, subject)
                );

                CREATE INDEX idx_teacher_classes_teacher ON teacher_classes(teacher_id) WHERE NOT is_deleted AND is_active;
                CREATE INDEX idx_teacher_classes_class ON teacher_classes(class_id) WHERE NOT is_deleted AND is_active;
                CREATE INDEX idx_teacher_classes_academic_year ON teacher_classes(academic_year_id) WHERE NOT is_deleted;
                CREATE INDEX idx_teacher_classes_teacher_academic ON teacher_classes(teacher_id, academic_year_id) WHERE NOT is_deleted;
            `,

            // 7. 游戏记录表
            game_records: `
                CREATE TABLE game_records (
                    id UUID DEFAULT uuid_generate_v4(),
                    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
                    school_id UUID REFERENCES schools(id),
                    class_id UUID REFERENCES classes(id),
                    grade_id UUID REFERENCES grades(id),
                    academic_year_id UUID REFERENCES academic_years(id),
                    
                    score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0),
                    questions_completed INTEGER NOT NULL DEFAULT 0 CHECK (questions_completed >= 0),
                    correct_count INTEGER NOT NULL DEFAULT 0 CHECK (correct_count >= 0),
                    accuracy DECIMAL(5,2) GENERATED ALWAYS AS (
                        CASE 
                            WHEN questions_completed > 0 
                            THEN ROUND((correct_count::DECIMAL / questions_completed::DECIMAL * 100)::DECIMAL, 2)
                            ELSE 0 
                        END
                    ) STORED,
                    total_time INTEGER CHECK (total_time >= 0),
                    avg_time_per_question DECIMAL(5,2),
                    
                    mode game_mode NOT NULL,
                    difficulty difficulty_level,
                    number_range VARCHAR(20),
                    target_sum_min INTEGER,
                    target_sum_max INTEGER,
                    
                    game_data JSONB,
                    
                    is_deleted BOOLEAN DEFAULT FALSE,
                    deleted_at TIMESTAMP WITH TIME ZONE,
                    
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    
                    PRIMARY KEY (id, created_at)
                ) PARTITION BY RANGE (created_at);
                
                -- 创建初始分区
                CREATE TABLE game_records_default PARTITION OF game_records DEFAULT;
                
                -- 创建季度分区
                CREATE TABLE game_records_2025_q4 PARTITION OF game_records
                    FOR VALUES FROM ('2025-10-01') TO ('2026-01-01');
                    
                CREATE TABLE game_records_2026_q1 PARTITION OF game_records
                    FOR VALUES FROM ('2026-01-01') TO ('2026-04-01');
                    
                CREATE TABLE game_records_2026_q2 PARTITION OF game_records
                    FOR VALUES FROM ('2026-04-01') TO ('2026-07-01');
                    
                CREATE TABLE game_records_2026_q3 PARTITION OF game_records
                    FOR VALUES FROM ('2026-07-01') TO ('2026-10-01');
                    
                CREATE TABLE game_records_2026_q4 PARTITION OF game_records
                    FOR VALUES FROM ('2026-10-01') TO ('2027-01-01');
                
                -- 索引（在分区表上创建会自动传播到分区）
                CREATE INDEX idx_game_records_user_created ON game_records(user_id, created_at) WHERE NOT is_deleted;
                CREATE INDEX idx_game_records_school_created ON game_records(school_id, created_at) WHERE NOT is_deleted;
                CREATE INDEX idx_game_records_class_created ON game_records(class_id, created_at) WHERE NOT is_deleted;
                CREATE INDEX idx_game_records_grade_created ON game_records(grade_id, created_at) WHERE NOT is_deleted;
                CREATE INDEX idx_game_records_mode_created ON game_records(mode, created_at) WHERE NOT is_deleted;
                CREATE INDEX idx_game_records_score_created ON game_records(score DESC, created_at) WHERE NOT is_deleted;
                CREATE INDEX idx_game_records_accuracy_created ON game_records(accuracy DESC, created_at) WHERE NOT is_deleted;
                CREATE INDEX idx_game_records_game_data ON game_records USING GIN (game_data) WHERE NOT is_deleted AND game_data IS NOT NULL;
            `,

            // 8. 错题本表
            wrong_questions: `
                CREATE TABLE wrong_questions (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
                    school_id UUID REFERENCES schools(id),
                    class_id UUID REFERENCES classes(id),
                    grade_id UUID REFERENCES grades(id),
                    
                    target_sum INTEGER NOT NULL,
                    num1 INTEGER NOT NULL,
                    num2 INTEGER NOT NULL,
                    knowledge_point VARCHAR(100),
                    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
                    
                    attempts INTEGER DEFAULT 1 CHECK (attempts > 0),
                    last_wrong_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    first_wrong_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    is_mastered BOOLEAN DEFAULT FALSE,
                    mastered_at TIMESTAMP WITH TIME ZONE,
                    
                    is_deleted BOOLEAN DEFAULT FALSE,
                    deleted_at TIMESTAMP WITH TIME ZONE,
                    
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    
                    CONSTRAINT valid_numbers CHECK (num1 >= 0 AND num2 >= 0 AND target_sum > 0)
                );

                -- 索引
                CREATE INDEX idx_wrong_questions_user ON wrong_questions(user_id) WHERE NOT is_deleted AND NOT is_mastered;
                CREATE INDEX idx_wrong_questions_school ON wrong_questions(school_id) WHERE NOT is_deleted;
                CREATE INDEX idx_wrong_questions_class ON wrong_questions(class_id) WHERE NOT is_deleted;
                CREATE INDEX idx_wrong_questions_knowledge ON wrong_questions(knowledge_point) WHERE NOT is_deleted;
                CREATE INDEX idx_wrong_questions_mastered ON wrong_questions(is_mastered) WHERE NOT is_deleted;
                CREATE INDEX idx_wrong_questions_last_wrong ON wrong_questions(last_wrong_at DESC) WHERE NOT is_deleted;

                -- 唯一约束（避免重复记录同一错题）
                CREATE UNIQUE INDEX idx_wrong_questions_unique 
                    ON wrong_questions(user_id, target_sum, num1, num2) 
                    WHERE NOT is_deleted AND NOT is_mastered;
            `,

            // 9. 作业表
            assignments: `
                CREATE TABLE assignments (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
                    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
                    academic_year_id UUID REFERENCES academic_years(id),
                    
                    title VARCHAR(200) NOT NULL,
                    description TEXT,
                    instructions TEXT,
                    
                    question_count INTEGER NOT NULL CHECK (question_count > 0),
                    target_sum_min INTEGER DEFAULT 5,
                    target_sum_max INTEGER DEFAULT 18,
                    number_range VARCHAR(20) DEFAULT '0-14',
                    difficulty difficulty_level DEFAULT 'medium',
                    
                    deadline TIMESTAMP WITH TIME ZONE,
                    time_limit INTEGER CHECK (time_limit >= 0),
                    allow_retry BOOLEAN DEFAULT TRUE,
                    max_attempts INTEGER DEFAULT 3 CHECK (max_attempts > 0),
                    
                    status assignment_status DEFAULT 'draft',
                    published_at TIMESTAMP WITH TIME ZONE,
                    
                    is_deleted BOOLEAN DEFAULT FALSE,
                    deleted_at TIMESTAMP WITH TIME ZONE,
                    version INTEGER DEFAULT 1,
                    
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    
                    CONSTRAINT valid_deadline CHECK (deadline IS NULL OR deadline > created_at),
                    CONSTRAINT valid_target_range CHECK (target_sum_max >= target_sum_min)
                );

                CREATE INDEX idx_assignments_teacher ON assignments(teacher_id) WHERE NOT is_deleted;
                CREATE INDEX idx_assignments_class ON assignments(class_id) WHERE NOT is_deleted;
                CREATE INDEX idx_assignments_status ON assignments(status) WHERE NOT is_deleted;
                CREATE INDEX idx_assignments_deadline ON assignments(deadline) WHERE NOT is_deleted AND deadline IS NOT NULL;
                CREATE INDEX idx_assignments_teacher_status ON assignments(teacher_id, status) WHERE NOT is_deleted;

                CREATE TRIGGER trigger_update_assignments_updated_at
                    BEFORE UPDATE ON assignments
                    FOR EACH ROW
                    EXECUTE FUNCTION update_updated_at_column();
            `,

            // 10. 作业完成记录表
            assignment_results: `
                CREATE TABLE assignment_results (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
                    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
                    
                    score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0),
                    questions_completed INTEGER NOT NULL DEFAULT 0 CHECK (questions_completed >= 0),
                    correct_count INTEGER NOT NULL DEFAULT 0 CHECK (correct_count >= 0),
                    accuracy DECIMAL(5,2) GENERATED ALWAYS AS (
                        CASE 
                            WHEN questions_completed > 0 
                            THEN ROUND((correct_count::DECIMAL / questions_completed::DECIMAL * 100)::DECIMAL, 2)
                            ELSE 0 
                        END
                    ) STORED,
                    
                    total_time INTEGER CHECK (total_time >= 0),
                    attempts INTEGER DEFAULT 1 CHECK (attempts > 0),
                    best_score INTEGER,
                    
                    details JSONB,
                    wrong_questions JSONB,
                    
                    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded', 'overdue')),
                    submitted_at TIMESTAMP WITH TIME ZONE,
                    graded_at TIMESTAMP WITH TIME ZONE,
                    
                    is_deleted BOOLEAN DEFAULT FALSE,
                    deleted_at TIMESTAMP WITH TIME ZONE,
                    
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    
                    UNIQUE(assignment_id, student_id)
                );

                CREATE INDEX idx_assignment_results_assignment ON assignment_results(assignment_id) WHERE NOT is_deleted;
                CREATE INDEX idx_assignment_results_student ON assignment_results(student_id) WHERE NOT is_deleted;
                CREATE INDEX idx_assignment_results_status ON assignment_results(status) WHERE NOT is_deleted;
                CREATE INDEX idx_assignment_results_details ON assignment_results USING GIN (details) WHERE NOT is_deleted AND details IS NOT NULL;
                CREATE INDEX idx_assignment_results_assignment_student ON assignment_results(assignment_id, student_id) WHERE NOT is_deleted;

                CREATE TRIGGER trigger_update_assignment_results_updated_at
                    BEFORE UPDATE ON assignment_results
                    FOR EACH ROW
                    EXECUTE FUNCTION update_updated_at_column();
            `,

            // 11. 成就定义表
            achievements: `
                CREATE TABLE achievements (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    code VARCHAR(50) UNIQUE NOT NULL,
                    name VARCHAR(100) NOT NULL,
                    description TEXT,
                    category VARCHAR(50) NOT NULL,
                    level INTEGER CHECK (level BETWEEN 1 AND 4),
                    icon VARCHAR(50),
                    badge_image TEXT,
                    
                    requirement_type VARCHAR(50) NOT NULL,
                    requirement_value INTEGER NOT NULL,
                    reward_score INTEGER DEFAULT 0,
                    
                    is_hidden BOOLEAN DEFAULT FALSE,
                    sort_order INTEGER DEFAULT 0,
                    
                    is_deleted BOOLEAN DEFAULT FALSE,
                    deleted_at TIMESTAMP WITH TIME ZONE,
                    
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );

                CREATE INDEX idx_achievements_category ON achievements(category) WHERE NOT is_deleted;
                CREATE INDEX idx_achievements_level ON achievements(level) WHERE NOT is_deleted;
                CREATE INDEX idx_achievements_code ON achievements(code) WHERE NOT is_deleted;
            `,

            // 12. 用户成就表
            user_achievements: `
                CREATE TABLE user_achievements (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
                    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
                    
                    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    progress INTEGER DEFAULT 0 CHECK (progress >= 0),
                    is_completed BOOLEAN DEFAULT FALSE,
                    
                    is_deleted BOOLEAN DEFAULT FALSE,
                    deleted_at TIMESTAMP WITH TIME ZONE,
                    
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    
                    UNIQUE(user_id, achievement_id)
                );

                CREATE INDEX idx_user_achievements_user ON user_achievements(user_id) WHERE NOT is_deleted;
                CREATE INDEX idx_user_achievements_completed ON user_achievements(is_completed) WHERE NOT is_deleted;
                CREATE INDEX idx_user_achievements_user_completed ON user_achievements(user_id, is_completed) WHERE NOT is_deleted;
            `,

            // 13. 排行榜快照表
            leaderboard_snapshots: `
                CREATE TABLE leaderboard_snapshots (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
                    grade_id UUID REFERENCES grades(id) ON DELETE CASCADE,
                    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
                    
                    snapshot_type leaderboard_type NOT NULL,
                    category VARCHAR(20) NOT NULL CHECK (category IN ('score', 'accuracy', 'speed')),
                    period leaderboard_period NOT NULL,
                    
                    data JSONB NOT NULL,
                    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    
                    is_deleted BOOLEAN DEFAULT FALSE,
                    deleted_at TIMESTAMP WITH TIME ZONE,
                    
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    
                    CONSTRAINT valid_snapshot_scope CHECK (
                        (snapshot_type = 'global' AND school_id IS NULL AND grade_id IS NULL AND class_id IS NULL) OR
                        (snapshot_type = 'school' AND school_id IS NOT NULL AND grade_id IS NULL AND class_id IS NULL) OR
                        (snapshot_type = 'grade' AND school_id IS NOT NULL AND grade_id IS NOT NULL AND class_id IS NULL) OR
                        (snapshot_type = 'class' AND school_id IS NOT NULL AND grade_id IS NOT NULL AND class_id IS NOT NULL)
                    )
                );

                CREATE INDEX idx_leaderboard_snapshots_school ON leaderboard_snapshots(school_id) WHERE NOT is_deleted;
                CREATE INDEX idx_leaderboard_snapshots_type ON leaderboard_snapshots(snapshot_type, category, period) WHERE NOT is_deleted;
                CREATE INDEX idx_leaderboard_snapshots_generated ON leaderboard_snapshots(generated_at DESC) WHERE NOT is_deleted;
            `,

            // 14. 系统日志表
            system_logs: `
                CREATE TABLE system_logs (
                    id UUID DEFAULT uuid_generate_v4(),
                    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
                    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
                    
                    action_type VARCHAR(50) NOT NULL,
                    action_name VARCHAR(200) NOT NULL,
                    resource_type VARCHAR(50),
                    resource_id UUID,
                    
                    details JSONB,
                    ip_address INET,
                    user_agent TEXT,
                    session_id UUID,
                    request_id UUID,
                    response_time INTEGER CHECK (response_time >= 0),
                    
                    status VARCHAR(20) DEFAULT 'success' CHECK (status IN ('success', 'error', 'warning')),
                    error_message TEXT,
                    
                    is_deleted BOOLEAN DEFAULT FALSE,
                    deleted_at TIMESTAMP WITH TIME ZONE,
                    
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    
                    PRIMARY KEY (id, created_at)
                ) PARTITION BY RANGE (created_at);

                -- 创建初始分区
                CREATE TABLE system_logs_default PARTITION OF system_logs DEFAULT;

                -- 创建月度分区
                CREATE TABLE system_logs_2025_12 PARTITION OF system_logs
                    FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');
                    
                CREATE TABLE system_logs_2026_01 PARTITION OF system_logs
                    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
                    
                CREATE TABLE system_logs_2026_02 PARTITION OF system_logs
                    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
                    
                CREATE TABLE system_logs_2026_03 PARTITION OF system_logs
                    FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
                    
                CREATE TABLE system_logs_2026_04 PARTITION OF system_logs
                    FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');

                -- 索引
                CREATE INDEX idx_system_logs_user_created ON system_logs(user_id, created_at) WHERE NOT is_deleted;
                CREATE INDEX idx_system_logs_school_created ON system_logs(school_id, created_at) WHERE NOT is_deleted;
                CREATE INDEX idx_system_logs_action_created ON system_logs(action_type, created_at) WHERE NOT is_deleted;
                CREATE INDEX idx_system_logs_created ON system_logs(created_at);
                CREATE INDEX idx_system_logs_resource ON system_logs(resource_type, resource_id) WHERE NOT is_deleted AND resource_id IS NOT NULL;
                CREATE INDEX idx_system_logs_request_id ON system_logs(request_id) WHERE request_id IS NOT NULL;
                CREATE INDEX idx_system_logs_session_id ON system_logs(session_id) WHERE session_id IS NOT NULL;
            `,

            // 15. 通知表
            notifications: `
                CREATE TABLE notifications (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
                    
                    type VARCHAR(50) NOT NULL,
                    title VARCHAR(200) NOT NULL,
                    content TEXT,
                    
                    target_roles user_role[],
                    target_classes UUID[],
                    target_users UUID[],
                    
                    priority notification_priority DEFAULT 'normal',
                    action_url TEXT,
                    
                    scheduled_at TIMESTAMP WITH TIME ZONE,
                    expires_at TIMESTAMP WITH TIME ZONE CHECK (expires_at IS NULL OR expires_at > scheduled_at),
                    
                    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
                    
                    is_deleted BOOLEAN DEFAULT FALSE,
                    deleted_at TIMESTAMP WITH TIME ZONE,
                    
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );

                CREATE INDEX idx_notifications_school ON notifications(school_id) WHERE NOT is_deleted;
                CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_at) WHERE NOT is_deleted AND scheduled_at IS NOT NULL;
                CREATE INDEX idx_notifications_expires ON notifications(expires_at) WHERE NOT is_deleted AND expires_at IS NOT NULL;
                CREATE INDEX idx_notifications_priority ON notifications(priority) WHERE NOT is_deleted;
                CREATE INDEX idx_notifications_target_users ON notifications USING GIN (target_users) WHERE NOT is_deleted;
                CREATE INDEX idx_notifications_target_classes ON notifications USING GIN (target_classes) WHERE NOT is_deleted;

                CREATE TRIGGER trigger_update_notifications_updated_at
                    BEFORE UPDATE ON notifications
                    FOR EACH ROW
                    EXECUTE FUNCTION update_updated_at_column();
            `,

            // 16. 用户通知阅读状态表
            notification_reads: `
                CREATE TABLE notification_reads (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
                    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
                    
                    is_read BOOLEAN DEFAULT FALSE,
                    read_at TIMESTAMP WITH TIME ZONE,
                    
                    is_deleted BOOLEAN DEFAULT FALSE,
                    deleted_at TIMESTAMP WITH TIME ZONE,
                    
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    
                    UNIQUE(notification_id, user_id)
                );

                CREATE INDEX idx_notification_reads_user ON notification_reads(user_id) WHERE NOT is_deleted;
                CREATE INDEX idx_notification_reads_notification ON notification_reads(notification_id) WHERE NOT is_deleted;
                CREATE INDEX idx_notification_reads_read ON notification_reads(is_read) WHERE NOT is_deleted;
            `,

            // 17. 数据备份记录表
            backup_records: `
                CREATE TABLE backup_records (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    
                    backup_type VARCHAR(20) NOT NULL CHECK (backup_type IN ('full', 'incremental')),
                    backup_size BIGINT CHECK (backup_size >= 0),
                    file_path TEXT,
                    
                    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
                    started_at TIMESTAMP WITH TIME ZONE,
                    completed_at TIMESTAMP WITH TIME ZONE CHECK (completed_at IS NULL OR completed_at >= started_at),
                    
                    tables_included TEXT[],
                    row_count INTEGER CHECK (row_count >= 0),
                    
                    error_message TEXT,
                    
                    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
                    
                    is_deleted BOOLEAN DEFAULT FALSE,
                    deleted_at TIMESTAMP WITH TIME ZONE,
                    
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );

                CREATE INDEX idx_backup_records_status ON backup_records(status) WHERE NOT is_deleted;
                CREATE INDEX idx_backup_records_created ON backup_records(created_at DESC) WHERE NOT is_deleted;
                CREATE INDEX idx_backup_records_type_created ON backup_records(backup_type, created_at) WHERE NOT is_deleted;
            `,

            // 18. 缓存表
            cache_store: `
                CREATE TABLE cache_store (
                    cache_key VARCHAR(255) PRIMARY KEY,
                    cache_value JSONB NOT NULL,
                    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );

                CREATE INDEX idx_cache_expires ON cache_store(expires_at);
                CREATE INDEX idx_cache_key_expires ON cache_store(cache_key, expires_at);
            `,

            // 19. API调用限制表
            api_rate_limits: `
                CREATE TABLE api_rate_limits (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
                    api_key VARCHAR(255),
                    endpoint VARCHAR(255) NOT NULL,
                    call_count INTEGER DEFAULT 1 CHECK (call_count > 0),
                    window_start TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    
                    CONSTRAINT unique_user_endpoint_window UNIQUE(user_id, endpoint, window_start),
                    CONSTRAINT unique_key_endpoint_window UNIQUE(api_key, endpoint, window_start),
                    CONSTRAINT either_user_or_key CHECK (
                        (user_id IS NOT NULL AND api_key IS NULL) OR
                        (user_id IS NULL AND api_key IS NOT NULL)
                    )
                );

                CREATE INDEX idx_api_rate_limits_user ON api_rate_limits(user_id);
                CREATE INDEX idx_api_rate_limits_api_key ON api_rate_limits(api_key);
                CREATE INDEX idx_api_rate_limits_window ON api_rate_limits(window_start);
            `,

            // 20. 数据库迁移记录表
            schema_migrations: `
                CREATE TABLE schema_migrations (
                    version VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    execution_time INTEGER, -- 毫秒
                    success BOOLEAN DEFAULT TRUE,
                    error_message TEXT
                );

                CREATE INDEX idx_schema_migrations_applied ON schema_migrations(applied_at DESC);
            `
        },
        
        /**
         * 视图定义
         */
        views: {
            // 班级统计视图
            class_statistics: `
                CREATE OR REPLACE VIEW class_statistics AS
                SELECT 
                    c.id AS class_id,
                    c.name AS class_name,
                    s.id AS school_id,
                    s.name AS school_name,
                    COUNT(DISTINCT p.id) AS student_count,
                    COUNT(DISTINCT gr.id) AS game_count,
                    COALESCE(AVG(gr.score), 0) AS avg_score,
                    COALESCE(AVG(gr.accuracy), 0) AS avg_accuracy,
                    COALESCE(COUNT(DISTINCT wq.id), 0) AS wrong_question_count
                FROM classes c
                JOIN schools s ON c.school_id = s.id
                LEFT JOIN profiles p ON p.class_id = c.id AND p.role = 'student'::user_role AND NOT p.is_deleted
                LEFT JOIN game_records gr ON gr.class_id = c.id AND NOT gr.is_deleted
                LEFT JOIN wrong_questions wq ON wq.class_id = c.id AND NOT wq.is_deleted AND NOT wq.is_mastered
                WHERE NOT c.is_deleted
                GROUP BY c.id, c.name, s.id, s.name;
            `,

            // 学生进度视图
            student_progress: `
                CREATE OR REPLACE VIEW student_progress AS
                SELECT 
                    p.id AS student_id,
                    p.real_name AS student_name,
                    p.student_no,
                    c.id AS class_id,
                    c.name AS class_name,
                    s.id AS school_id,
                    s.name AS school_name,
                    COUNT(DISTINCT gr.id) AS total_games,
                    COALESCE(SUM(gr.questions_completed), 0) AS total_questions,
                    COALESCE(AVG(gr.accuracy), 0) AS avg_accuracy,
                    COALESCE(MAX(gr.score), 0) AS best_score,
                    COALESCE(COUNT(DISTINCT wq.id), 0) AS current_wrong_count,
                    COALESCE(COUNT(DISTINCT ua.id), 0) AS achievements_unlocked,
                    (
                        SELECT COUNT(*) 
                        FROM game_records gr2 
                        WHERE gr2.user_id = p.id 
                        AND gr2.created_at >= (CURRENT_TIMESTAMP - INTERVAL '7 days')
                        AND NOT gr2.is_deleted
                    ) AS games_last_week
                FROM profiles p
                JOIN classes c ON p.class_id = c.id
                JOIN schools s ON p.school_id = s.id
                LEFT JOIN game_records gr ON gr.user_id = p.id AND NOT gr.is_deleted
                LEFT JOIN wrong_questions wq ON wq.user_id = p.id AND NOT wq.is_deleted AND NOT wq.is_mastered
                LEFT JOIN user_achievements ua ON ua.user_id = p.id AND ua.is_completed AND NOT ua.is_deleted
                WHERE p.role = 'student'::user_role AND NOT p.is_deleted
                GROUP BY p.id, p.real_name, p.student_no, c.id, c.name, s.id, s.name;
            `,

            // 教师工作量视图
            teacher_workload: `
                CREATE OR REPLACE VIEW teacher_workload AS
                SELECT 
                    p.id AS teacher_id,
                    p.real_name AS teacher_name,
                    s.id AS school_id,
                    s.name AS school_name,
                    COUNT(DISTINCT tc.class_id) AS class_count,
                    COUNT(DISTINCT tc.class_id) FILTER (WHERE tc.is_homeroom) AS homeroom_count,
                    COUNT(DISTINCT a.id) AS assignment_count,
                    COUNT(DISTINCT a.id) FILTER (WHERE a.deadline > CURRENT_TIMESTAMP AND a.status = 'published') AS active_assignments,
                    COUNT(DISTINCT ar.id) AS submissions_received,
                    COUNT(DISTINCT ar.id) FILTER (WHERE ar.status = 'submitted') AS pending_grading
                FROM profiles p
                JOIN schools s ON p.school_id = s.id
                LEFT JOIN teacher_classes tc ON tc.teacher_id = p.id AND NOT tc.is_deleted AND tc.is_active
                LEFT JOIN assignments a ON a.teacher_id = p.id AND NOT a.is_deleted
                LEFT JOIN assignment_results ar ON ar.assignment_id = a.id AND NOT ar.is_deleted
                WHERE p.role = 'teacher'::user_role AND NOT p.is_deleted
                GROUP BY p.id, p.real_name, s.id, s.name;
            `
        },
        
        /**
         * 初始化数据
         */
        seed_data: {
            achievements: [
                "('victory_bronze', '初出茅庐', '完成第1局游戏', 'victory', 1, '🥉', NULL, 'games_completed', 1, 10, FALSE, 10)",
                "('victory_silver', '小试牛刀', '完成10局游戏', 'victory', 2, '🥈', NULL, 'games_completed', 10, 50, FALSE, 20)",
                "('victory_gold', '常胜将军', '完成50局游戏', 'victory', 3, '🥇', NULL, 'games_completed', 50, 200, FALSE, 30)",
                "('victory_platinum', '战神降临', '完成100局游戏', 'victory', 4, '🏆', NULL, 'games_completed', 100, 500, FALSE, 40)",
                "('score_bronze', '小有收获', '单局得分达到30分', 'score', 1, '🥉', NULL, 'best_score', 30, 20, FALSE, 50)",
                "('score_silver', '财富积累', '单局得分达到50分', 'score', 2, '🥈', NULL, 'best_score', 50, 50, FALSE, 60)",
                "('score_gold', '百战百胜', '单局得分达到100分', 'score', 3, '🥇', NULL, 'best_score', 100, 150, FALSE, 70)",
                "('score_platinum', '分数收割机', '单局得分达到200分', 'score', 4, '💯', NULL, 'best_score', 200, 300, FALSE, 80)",
                "('accuracy_bronze', '稳扎稳打', '单局准确率达到60%', 'accuracy', 1, '🥉', NULL, 'best_accuracy', 60, 15, FALSE, 90)",
                "('accuracy_silver', '精准打击', '单局准确率达到75%', 'accuracy', 2, '🥈', NULL, 'best_accuracy', 75, 30, FALSE, 100)",
                "('accuracy_gold', '百步穿杨', '单局准确率达到90%', 'accuracy', 3, '🥇', NULL, 'best_accuracy', 90, 100, FALSE, 110)",
                "('accuracy_platinum', '弹无虚发', '单局准确率达到100%', 'accuracy', 4, '🎯', NULL, 'best_accuracy', 100, 200, FALSE, 120)"
            ]
        },
        
        /**
         * 行级安全策略
         */
        row_level_security: {
            enable_rls: `
                -- 启用行级安全
                ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
                ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
                ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
                ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
                ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
                ALTER TABLE teacher_classes ENABLE ROW LEVEL SECURITY;
                ALTER TABLE game_records ENABLE ROW LEVEL SECURITY;
                ALTER TABLE wrong_questions ENABLE ROW LEVEL SECURITY;
                ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
                ALTER TABLE assignment_results ENABLE ROW LEVEL SECURITY;
                ALTER TABLE leaderboard_snapshots ENABLE ROW LEVEL SECURITY;
                ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
                ALTER TABLE notification_reads ENABLE ROW LEVEL SECURITY;
            `,
            
            policies: [
                // 超级管理员策略
                `CREATE POLICY super_admin_all ON schools
                    FOR ALL USING (
                        EXISTS (
                            SELECT 1 FROM profiles 
                            WHERE id = auth.uid() 
                            AND role = 'super_admin'::user_role 
                            AND NOT is_deleted
                        )
                    );`,
                
                // 学校管理员策略
                `CREATE POLICY school_admin_school ON schools
                    FOR ALL USING (
                        EXISTS (
                            SELECT 1 FROM profiles 
                            WHERE id = auth.uid() 
                            AND school_id = schools.id 
                            AND role = 'school_admin'::user_role 
                            AND NOT is_deleted
                        )
                    );`,
                
                // 教师查看学生
                `CREATE POLICY teacher_view_students ON profiles
                    FOR SELECT USING (
                        EXISTS (
                            SELECT 1 FROM teacher_classes tc
                            WHERE tc.teacher_id = auth.uid()
                            AND tc.class_id = profiles.class_id
                            AND NOT tc.is_deleted
                            AND tc.is_active
                        )
                        OR
                        EXISTS (
                            SELECT 1 FROM profiles p
                            WHERE p.id = auth.uid()
                            AND p.school_id = profiles.school_id
                            AND p.role IN ('school_admin'::user_role, 'super_admin'::user_role)
                            AND NOT p.is_deleted
                        )
                    );`,
                
                // 学生查看同班同学
                `CREATE POLICY student_view_classmates ON profiles
                    FOR SELECT USING (
                        EXISTS (
                            SELECT 1 FROM profiles p
                            WHERE p.id = auth.uid()
                            AND p.class_id = profiles.class_id
                            AND p.role = 'student'::user_role
                            AND NOT p.is_deleted
                        )
                    );`,
                
                // 用户查看自己的游戏记录
                `CREATE POLICY user_own_game_records ON game_records
                    FOR ALL USING (auth.uid() = user_id AND NOT is_deleted);`,
                
                // 教师查看班级游戏记录
                `CREATE POLICY teacher_view_class_game_records ON game_records
                    FOR SELECT USING (
                        EXISTS (
                            SELECT 1 FROM teacher_classes tc
                            WHERE tc.teacher_id = auth.uid()
                            AND tc.class_id = game_records.class_id
                            AND NOT tc.is_deleted
                            AND tc.is_active
                        )
                    );`,
                
                // 用户管理自己的错题
                `CREATE POLICY user_own_wrong_questions ON wrong_questions
                    FOR ALL USING (auth.uid() = user_id AND NOT is_deleted);`,
                
                // 教师查看班级错题
                `CREATE POLICY teacher_view_class_wrong_questions ON wrong_questions
                    FOR SELECT USING (
                        EXISTS (
                            SELECT 1 FROM teacher_classes tc
                            WHERE tc.teacher_id = auth.uid()
                            AND tc.class_id = wrong_questions.class_id
                            AND NOT tc.is_deleted
                            AND tc.is_active
                        )
                    );`
            ]
        }
    };

    // ==================== 完整部署脚本 ====================
    const DEPLOY_SCRIPT = `-- =====================================================
-- 数学加法消消乐 - 数据库完整部署脚本
-- 版本: 4.0.0
-- 执行前请确保已创建Supabase项目并启用认证
-- =====================================================

-- 开始事务
BEGIN;

-- 1. 创建扩展
${SUPABASE_SCHEMA.extensions}

-- 2. 创建枚举类型
${SUPABASE_SCHEMA.enums}

-- 3. 创建基础函数
${SUPABASE_SCHEMA.functions}

-- 4. 创建表
${Object.values(SUPABASE_SCHEMA.tables).join('\n\n')}

-- 5. 创建视图
${Object.values(SUPABASE_SCHEMA.views).join('\n\n')}

-- 6. 初始化成就数据
INSERT INTO achievements (
    code, name, description, category, level, icon, badge_image, 
    requirement_type, requirement_value, reward_score, is_hidden, sort_order
) VALUES 
${SUPABASE_SCHEMA.seed_data.achievements.join(',\n')}
ON CONFLICT (code) DO NOTHING;

-- 7. 启用行级安全
${SUPABASE_SCHEMA.row_level_security.enable_rls}

-- 8. 创建安全策略
${SUPABASE_SCHEMA.row_level_security.policies.join('\n\n')}

-- 9. 记录迁移
INSERT INTO schema_migrations (version, name, execution_time, success)
VALUES ('4.0.0', 'initial_schema', 0, true);

-- 提交事务
COMMIT;

-- 10. 更新统计信息
ANALYZE;

-- 验证部署
SELECT '部署成功' AS status, 
       (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') AS table_count,
       (SELECT COUNT(*) FROM pg_policies) AS policy_count;`;

    // ==================== 验证脚本 ====================
    const VERIFY_SCRIPT = `-- =====================================================
-- 验证数据库部署
-- =====================================================

-- 1. 检查表数量
SELECT '表数量' AS check_item, COUNT(*)::TEXT AS value 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- 2. 检查视图数量
SELECT '视图数量' AS check_item, COUNT(*)::TEXT AS value 
FROM information_schema.views 
WHERE table_schema = 'public';

-- 3. 检查枚举类型
SELECT '枚举类型' AS check_item, string_agg(typname, ', ') AS value 
FROM pg_type 
WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
AND typtype = 'e';

-- 4. 检查RLS启用情况
SELECT '启用RLS的表' AS check_item, string_agg(tablename, ', ') AS value 
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;

-- 5. 检查策略数量
SELECT 'RLS策略数量' AS check_item, COUNT(*)::TEXT AS value 
FROM pg_policies 
WHERE schemaname = 'public';

-- 6. 检查成就数据
SELECT '成就数量' AS check_item, COUNT(*)::TEXT AS value 
FROM achievements;

-- 7. 检查分区表
SELECT '分区表' AS check_item, string_agg(partrelid::regclass::text, ', ') AS value 
FROM pg_partitioned_table;

-- 8. 检查索引数量
SELECT '索引数量' AS check_item, COUNT(*)::TEXT AS value 
FROM pg_indexes 
WHERE schemaname = 'public';

-- 9. 检查外键约束
SELECT '外键约束' AS check_item, COUNT(*)::TEXT AS value 
FROM information_schema.table_constraints 
WHERE constraint_type = 'FOREIGN KEY' AND constraint_schema = 'public';

-- 10. 检查触发器
SELECT '触发器数量' AS check_item, COUNT(*)::TEXT AS value 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';`;

    // ==================== 导出到全局 ====================
    global.SUPABASE_SCHEMA = SUPABASE_SCHEMA;
    global.DEPLOY_SCRIPT = DEPLOY_SCRIPT;
    global.VERIFY_SCRIPT = VERIFY_SCRIPT;

    // ==================== 使用说明 ====================
    console.log(`
╔══════════════════════════════════════════════════════════════════════════╗
║        数学加法消消乐 - Supabase 数据库部署工具 v4.0.0                    ║
║                   区域学校多租户教育系统                                 ║
╚══════════════════════════════════════════════════════════════════════════╝

📋 部署步骤:
-----------
1. 登录 Supabase 控制台 (https://app.supabase.com)
2. 进入你的项目
3. 点击左侧菜单 "SQL Editor"
4. 点击 "New Query"
5. 复制下面的 DEPLOY_SCRIPT 内容并执行
6. 执行后运行验证脚本确认部署成功

📦 包含的组件:
-----------
✅ 20个核心数据表
✅ 3个业务视图
✅ 8个枚举类型
✅ 7个基础函数
✅ 12个初始化成就
✅ 10个RLS安全策略

🔒 安全特性:
-----------
✅ 行级安全(RLS)策略
✅ 数据软删除
✅ 乐观锁版本控制
✅ 操作审计日志
✅ API调用限制
✅ 数据分区管理
✅ 外键约束
✅ 数据验证约束

🚀 性能优化:
-----------
✅ 复合索引优化
✅ 分区表设计
✅ GIN索引支持JSON查询
✅ 全文搜索支持
✅ 缓存表支持
✅ 连接池配置建议

📊 监控和维护:
-----------
✅ 系统日志表
✅ 备份记录表
✅ 迁移记录表
✅ 归档函数
✅ 数据清洗函数
✅ 统计信息更新

⚠️ 重要提示:
-----------
1. 执行前请确保已创建Supabase项目
2. 建议先在测试环境验证
3. 执行后运行验证脚本检查
4. 根据实际用户量调整分区范围
5. 定期运行归档函数清理旧数据
6. 监控表空间使用情况
7. 定期更新数据库统计信息

🔧 后续配置:
-----------
1. 创建超级管理员账号
2. 配置Supabase认证设置
3. 设置备份策略
4. 配置监控告警
5. 调整连接池大小

需要帮助?
- 查看 Supabase 文档: https://supabase.com/docs
- 技术支持: support@mathgame.com
- 项目地址: https://github.com/mathgame/regional-edition
`);
})(typeof window !== 'undefined' ? window : global);
