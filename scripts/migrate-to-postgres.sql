-- 🗄️ Script de Migración a PostgreSQL
-- Finance Dash Pro - Migración desde SQLite a PostgreSQL

-- Crear base de datos (ejecutar como superusuario)
-- CREATE DATABASE finance_dash_pro;
-- \c finance_dash_pro;

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configurar timezone
SET timezone = 'Europe/Madrid';

-- ========================================
-- TABLAS PRINCIPALES
-- ========================================

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    email_verified TIMESTAMP WITH TIME ZONE,
    image TEXT,
    password_hash TEXT,
    provider TEXT DEFAULT 'CREDENTIALS',
    role TEXT DEFAULT 'USER',
    locale TEXT DEFAULT 'es-ES',
    currency TEXT DEFAULT 'EUR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de cuentas OAuth
CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    UNIQUE(provider, provider_account_id)
);

-- Tabla de sesiones
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_token TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Tabla de tokens de verificación
CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires TIMESTAMP WITH TIME ZONE NOT NULL,
    UNIQUE(identifier, token)
);

-- ========================================
-- TABLAS DE FINANZAS PERSONALES
-- ========================================

-- Categorías
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transacciones
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    type TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT,
    payment_method TEXT DEFAULT 'CARD',
    tags TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Presupuestos
CREATE TABLE IF NOT EXISTS budgets (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
    period TEXT DEFAULT 'MONTHLY',
    month INTEGER,
    year INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Objetivos
CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target_amount DECIMAL(10,2) NOT NULL,
    current_amount DECIMAL(10,2) DEFAULT 0,
    deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- TABLAS ERP - MULTI-TENANT
-- ========================================

-- Empresas
CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    cif TEXT UNIQUE NOT NULL,
    address TEXT,
    city TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'ES',
    phone TEXT,
    email TEXT,
    website TEXT,
    fiscal_year_start TEXT DEFAULT '01-01',
    logo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Relación usuarios-empresas
CREATE TABLE IF NOT EXISTS user_companies (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'USER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, company_id)
);

-- Facturas
CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    number TEXT NOT NULL,
    series TEXT DEFAULT 'A',
    customer_name TEXT NOT NULL,
    customer_nif TEXT,
    customer_address TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 21.0,
    tax_amount DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'DRAFT',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, series, number)
);

-- Plan de cuentas
CREATE TABLE IF NOT EXISTS account_plans (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    parent_id TEXT REFERENCES account_plans(id) ON DELETE SET NULL,
    level INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(company_id, code)
);

-- Asientos contables
CREATE TABLE IF NOT EXISTS accounting_entries (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT NOT NULL,
    debit_account TEXT NOT NULL,
    credit_account TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reportes fiscales
CREATE TABLE IF NOT EXISTS tax_reports (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    period TEXT NOT NULL,
    total_payable DECIMAL(10,2) DEFAULT 0,
    total_receivable DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2) DEFAULT 0,
    status TEXT DEFAULT 'DRAFT',
    due_date TIMESTAMP WITH TIME ZONE,
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, type, period)
);

-- ========================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ========================================

-- Índices para usuarios
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);

-- Índices para finanzas personales
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_transactions_user_type ON transactions(user_id, type);
CREATE INDEX IF NOT EXISTS idx_transactions_user_category ON transactions(user_id, category_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_year_month ON budgets(user_id, year, month);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);

-- Índices para ERP
CREATE INDEX IF NOT EXISTS idx_companies_cif ON companies(cif);
CREATE INDEX IF NOT EXISTS idx_user_companies_user_id ON user_companies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_companies_company_id ON user_companies(company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_company_date ON invoices(company_id, date);
CREATE INDEX IF NOT EXISTS idx_account_plans_company_id ON account_plans(company_id);
CREATE INDEX IF NOT EXISTS idx_account_plans_company_code ON account_plans(company_id, code);
CREATE INDEX IF NOT EXISTS idx_account_plans_company_type ON account_plans(company_id, type);
CREATE INDEX IF NOT EXISTS idx_accounting_entries_company_id ON accounting_entries(company_id);
CREATE INDEX IF NOT EXISTS idx_accounting_entries_company_date ON accounting_entries(company_id, date);
CREATE INDEX IF NOT EXISTS idx_tax_reports_company_id ON tax_reports(company_id);
CREATE INDEX IF NOT EXISTS idx_tax_reports_company_type ON tax_reports(company_id, type);

-- ========================================
-- TRIGGERS PARA UPDATED_AT
-- ========================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at 
    BEFORE UPDATE ON companies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at 
    BEFORE UPDATE ON invoices 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tax_reports_updated_at 
    BEFORE UPDATE ON tax_reports 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- VISTAS ÚTILES
-- ========================================

-- Vista de resumen financiero por usuario
CREATE OR REPLACE VIEW user_financial_summary AS
SELECT 
    u.id as user_id,
    u.name,
    u.email,
    COUNT(DISTINCT t.id) as total_transactions,
    COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0) as total_income,
    COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END), 0) as total_expense,
    COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0) - 
    COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END), 0) as balance,
    COUNT(DISTINCT c.id) as total_categories,
    COUNT(DISTINCT b.id) as total_budgets,
    COUNT(DISTINCT g.id) as total_goals
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id
LEFT JOIN categories c ON u.id = c.user_id
LEFT JOIN budgets b ON u.id = b.user_id
LEFT JOIN goals g ON u.id = g.user_id
GROUP BY u.id, u.name, u.email;

-- Vista de resumen por categoría
CREATE OR REPLACE VIEW category_summary AS
SELECT 
    c.id as category_id,
    c.name as category_name,
    c.type as category_type,
    c.color,
    c.user_id,
    COUNT(t.id) as transaction_count,
    COALESCE(SUM(t.amount), 0) as total_amount,
    COALESCE(AVG(t.amount), 0) as average_amount,
    MIN(t.date) as first_transaction,
    MAX(t.date) as last_transaction
FROM categories c
LEFT JOIN transactions t ON c.id = t.category_id
GROUP BY c.id, c.name, c.type, c.color, c.user_id;

-- ========================================
-- FUNCIONES ÚTILES
-- ========================================

-- Función para calcular balance mensual
CREATE OR REPLACE FUNCTION get_monthly_balance(user_id_param TEXT, year_param INTEGER, month_param INTEGER)
RETURNS TABLE(
    income DECIMAL(10,2),
    expense DECIMAL(10,2),
    balance DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END), 0) as expense,
        COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0) - 
        COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END), 0) as balance
    FROM transactions t
    WHERE t.user_id = user_id_param
      AND EXTRACT(YEAR FROM t.date) = year_param
      AND EXTRACT(MONTH FROM t.date) = month_param;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- COMENTARIOS
-- ========================================

COMMENT ON DATABASE finance_dash_pro IS 'Base de datos para Finance Dash Pro - Sistema de gestión financiera personal y empresarial';
COMMENT ON TABLE users IS 'Usuarios del sistema';
COMMENT ON TABLE categories IS 'Categorías de transacciones';
COMMENT ON TABLE transactions IS 'Transacciones financieras';
COMMENT ON TABLE companies IS 'Empresas (multi-tenant)';
COMMENT ON TABLE invoices IS 'Facturas empresariales';
COMMENT ON TABLE accounting_entries IS 'Asientos contables';

-- ========================================
-- PERMISOS
-- ========================================

-- Crear usuario de aplicación (opcional)
-- CREATE USER finance_app WITH PASSWORD 'secure_password';
-- GRANT CONNECT ON DATABASE finance_dash_pro TO finance_app;
-- GRANT USAGE ON SCHEMA public TO finance_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO finance_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO finance_app;

-- ========================================
-- CONFIGURACIÓN FINAL
-- ========================================

-- Configurar autovacuum para optimización
ALTER TABLE transactions SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE accounting_entries SET (autovacuum_vacuum_scale_factor = 0.1);

-- Configurar estadísticas
ALTER TABLE transactions SET (default_statistics_target = 100);
ALTER TABLE accounting_entries SET (default_statistics_target = 100);

-- Mensaje de finalización
DO $$
BEGIN
    RAISE NOTICE '✅ Migración a PostgreSQL completada exitosamente!';
    RAISE NOTICE '📊 Base de datos: finance_dash_pro';
    RAISE NOTICE '🗄️ Tablas creadas: %', (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public');
    RAISE NOTICE '📈 Índices creados: %', (SELECT count(*) FROM pg_indexes WHERE schemaname = 'public');
    RAISE NOTICE '🎯 Listo para producción!';
END $$;
