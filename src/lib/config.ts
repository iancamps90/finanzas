// Application configuration

export const config = {
  // App Info
  app: {
    name: 'Finance Dash Pro',
    description: 'Professional Finance Dashboard with Power BI Integration',
    version: '1.0.0',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // Database
  database: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/finance_dash_pro',
  },

  // Authentication
  auth: {
    secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    providers: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      },
    },
  },

  // Features
  features: {
    registration: process.env.ENABLE_REGISTRATION !== 'false',
    googleAuth: process.env.ENABLE_GOOGLE_AUTH === 'true',
    powerBI: process.env.ENABLE_POWER_BI === 'true',
    export: process.env.ENABLE_EXPORT !== 'false',
    analytics: process.env.ENABLE_ANALYTICS === 'true',
  },

  // Power BI
  powerBI: {
    publicAccess: process.env.BI_PUBLIC === 'true',
    baseUrl: process.env.BI_BASE_URL || '/api/bi',
  },

  // Rate Limiting
  rateLimit: {
    auth: {
      requests: 5,
      window: 15 * 60 * 1000, // 15 minutes
    },
    export: {
      requests: 10,
      window: 15 * 60 * 1000, // 15 minutes
    },
    api: {
      requests: 100,
      window: 15 * 60 * 1000, // 15 minutes
    },
  },

  // File Upload
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['text/csv', 'application/vnd.ms-excel'],
  },

  // Pagination
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },

  // Cache
  cache: {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100,
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableConsole: process.env.NODE_ENV !== 'production',
  },

  // Security
  security: {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
      credentials: true,
    },
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  },

  // Email
  email: {
    from: process.env.EMAIL_FROM || 'noreply@financedashpro.com',
    smtp: {
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    },
  },

  // Analytics
  analytics: {
    googleAnalytics: process.env.GA_TRACKING_ID || '',
    mixpanel: process.env.MIXPANEL_TOKEN || '',
  },

  // Monitoring
  monitoring: {
    sentry: {
      dsn: process.env.SENTRY_DSN || '',
      environment: process.env.NODE_ENV || 'development',
    },
  },

  // Development
  development: {
    enableDevTools: process.env.NODE_ENV === 'development',
    enableHotReload: process.env.NODE_ENV === 'development',
    enableDebugLogs: process.env.NODE_ENV === 'development',
  },
} as const;

export type Config = typeof config;

// Environment validation
export function validateConfig() {
  const required = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return true;
}

// Feature flags
export const featureFlags = {
  isEnabled: (feature: keyof typeof config.features) => {
    return config.features[feature];
  },
  
  isDevelopment: () => {
    return process.env.NODE_ENV === 'development';
  },
  
  isProduction: () => {
    return process.env.NODE_ENV === 'production';
  },
  
  isTest: () => {
    return process.env.NODE_ENV === 'test';
  },
} as const;

