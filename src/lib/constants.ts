// Application constants and configuration

export const APP_CONFIG = {
  name: 'Finance Dash Pro',
  description: 'Professional Finance Dashboard with Power BI Integration',
  version: '1.0.0',
  author: 'Finance Dash Pro Team',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  supportEmail: 'support@financedashpro.com',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/transactions',
  CATEGORIES: '/categories',
  REPORTS: '/reports',
  PROFILE: '/profile',
  POWER_BI: '/bi',
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/signin',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/signout',
    SESSION: '/api/auth/session',
  },
  USER: {
    ME: '/api/me',
    UPDATE: '/api/me',
    PASSWORD: '/api/me/password',
  },
  TRANSACTIONS: {
    LIST: '/api/transactions',
    CREATE: '/api/transactions',
    UPDATE: (id: string) => `/api/transactions/${id}`,
    DELETE: (id: string) => `/api/transactions/${id}`,
  },
  CATEGORIES: {
    LIST: '/api/categories',
    CREATE: '/api/categories',
    UPDATE: (id: string) => `/api/categories/${id}`,
    DELETE: (id: string) => `/api/categories/${id}`,
  },
  EXPORT: {
    CSV: '/api/export/csv',
    PDF: '/api/export/pdf',
  },
  POWER_BI: {
    CSV: '/api/bi/transactions.csv',
    JSON: '/api/bi/transactions.json',
  },
} as const;

export const TRANSACTION_TYPES = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
} as const;

export const PAYMENT_METHODS = {
  CARD: 'CARD',
  CASH: 'CASH',
  TRANSFER: 'TRANSFER',
  OTHER: 'OTHER',
} as const;

export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export const CURRENCIES = {
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
} as const;

export const LOCALES = {
  'es-ES': { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
  'en-US': { code: 'en-US', name: 'English', flag: '🇺🇸' },
} as const;

export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: 'dd MMMM yyyy',
  ISO: 'yyyy-MM-dd',
  DISPLAY: 'dd MMM yyyy',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

export const RATE_LIMITS = {
  AUTH: { requests: 5, window: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  EXPORT: { requests: 10, window: 15 * 60 * 1000 }, // 10 requests per 15 minutes
  API: { requests: 100, window: 15 * 60 * 1000 }, // 100 requests per 15 minutes
} as const;

export const FILE_LIMITS = {
  CSV_IMPORT: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['text/csv', 'application/vnd.ms-excel'],
  },
  IMAGE_UPLOAD: {
    MAX_SIZE: 2 * 1024 * 1024, // 2MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  },
} as const;

export const CHART_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#EC4899', // Pink
  '#6366F1', // Indigo
] as const;

export const CATEGORY_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F43F5E', // Rose
  '#8B5A2B', // Brown
  '#64748B', // Slate
  '#A855F7', // Violet
] as const;

export const DEMO_DATA = {
  USERS: [
    {
      email: 'demo@example.com',
      password: 'demo123',
      name: 'Usuario Demo',
      role: 'USER',
    },
    {
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Administrador',
      role: 'ADMIN',
    },
  ],
  CATEGORIES: [
    { name: 'Supermercado', type: 'EXPENSE', color: '#3B82F6' },
    { name: 'Transporte', type: 'EXPENSE', color: '#EF4444' },
    { name: 'Ocio', type: 'EXPENSE', color: '#10B981' },
    { name: 'Servicios', type: 'EXPENSE', color: '#F59E0B' },
    { name: 'Salud', type: 'EXPENSE', color: '#8B5CF6' },
    { name: 'Nómina', type: 'INCOME', color: '#06B6D4' },
    { name: 'Freelance', type: 'INCOME', color: '#84CC16' },
    { name: 'Inversiones', type: 'INCOME', color: '#F97316' },
  ],
} as const;

export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: false,
    REQUIRE_LOWERCASE: false,
    REQUIRE_NUMBERS: false,
    REQUIRE_SYMBOLS: false,
  },
  EMAIL: {
    MAX_LENGTH: 254,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  TRANSACTION: {
    AMOUNT: {
      MIN: 0.01,
      MAX: 999999.99,
    },
    DESCRIPTION: {
      MAX_LENGTH: 500,
    },
  },
  CATEGORY: {
    NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 50,
    },
  },
} as const;

export const STORAGE_KEYS = {
  THEME: 'theme',
  LOCALE: 'locale',
  CURRENCY: 'currency',
  SIDEBAR_STATE: 'sidebar-state',
  TABLE_PREFERENCES: 'table-preferences',
  CHART_PREFERENCES: 'chart-preferences',
} as const;

export const ERROR_MESSAGES = {
  NETWORK: 'Error de conexión. Verifica tu internet.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no existe.',
  VALIDATION: 'Los datos proporcionados no son válidos.',
  SERVER: 'Error interno del servidor. Inténtalo más tarde.',
  RATE_LIMIT: 'Demasiadas solicitudes. Espera un momento.',
} as const;

export const SUCCESS_MESSAGES = {
  SAVED: 'Guardado exitosamente',
  UPDATED: 'Actualizado exitosamente',
  DELETED: 'Eliminado exitosamente',
  CREATED: 'Creado exitosamente',
  EXPORTED: 'Exportado exitosamente',
  IMPORTED: 'Importado exitosamente',
} as const;

