import { APP_CONFIG } from './constants';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  locale?: string;
  siteName?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export function generateSEO({
  title,
  description = APP_CONFIG.description,
  keywords = ['finance', 'dashboard', 'analytics', 'power bi', 'excel', 'next.js'],
  image = '/og-image.png',
  url,
  type = 'website',
  locale = 'es_ES',
  siteName = APP_CONFIG.name,
  author = APP_CONFIG.author,
  publishedTime,
  modifiedTime,
  section,
  tags,
}: SEOProps = {}) {
  const fullTitle = title ? `${title} | ${APP_CONFIG.name}` : APP_CONFIG.name;
  const fullUrl = url ? `${APP_CONFIG.url}${url}` : APP_CONFIG.url;
  const fullImage = image.startsWith('http') ? image : `${APP_CONFIG.url}${image}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale,
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(section && { section }),
      ...(tags && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
      creator: '@financedashpro',
      site: '@financedashpro',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_VERIFICATION_ID,
      yandex: process.env.YANDEX_VERIFICATION_ID,
      yahoo: process.env.YAHOO_VERIFICATION_ID,
    },
    alternates: {
      canonical: fullUrl,
      languages: {
        'es-ES': `${APP_CONFIG.url}/es`,
        'en-US': `${APP_CONFIG.url}/en`,
      },
    },
  };
}

export const defaultSEO = generateSEO();

export const pageSEO = {
  home: generateSEO({
    title: 'Dashboard de Finanzas Profesional',
    description: 'Gestiona tus finanzas con nuestro dashboard profesional. Integración con Power BI, exportación a Excel y análisis avanzados.',
    keywords: ['dashboard finanzas', 'gestión financiera', 'power bi', 'excel', 'análisis financiero'],
  }),
  
  login: generateSEO({
    title: 'Iniciar Sesión',
    description: 'Accede a tu dashboard de finanzas personalizado.',
    type: 'website',
  }),
  
  register: generateSEO({
    title: 'Crear Cuenta',
    description: 'Regístrate y comienza a gestionar tus finanzas de manera profesional.',
    type: 'website',
  }),
  
  dashboard: generateSEO({
    title: 'Dashboard',
    description: 'Resumen completo de tus finanzas con métricas clave y gráficas interactivas.',
    keywords: ['dashboard', 'métricas financieras', 'resumen', 'kpi'],
  }),
  
  transactions: generateSEO({
    title: 'Transacciones',
    description: 'Gestiona todas tus transacciones financieras con filtros avanzados y exportación.',
    keywords: ['transacciones', 'gastos', 'ingresos', 'gestión financiera'],
  }),
  
  categories: generateSEO({
    title: 'Categorías',
    description: 'Organiza tus finanzas con categorías personalizables para ingresos y gastos.',
    keywords: ['categorías', 'organización', 'clasificación', 'finanzas'],
  }),
  
  reports: generateSEO({
    title: 'Reportes',
    description: 'Análisis detallado de tus finanzas con reportes personalizables y exportación avanzada.',
    keywords: ['reportes', 'análisis', 'estadísticas', 'exportación'],
  }),
  
  profile: generateSEO({
    title: 'Perfil',
    description: 'Gestiona tu información personal y configuración de cuenta.',
    type: 'profile',
  }),
  
  powerBI: generateSEO({
    title: 'Power BI Integration',
    description: 'Conecta tus datos financieros con Power BI para análisis avanzados y visualizaciones profesionales.',
    keywords: ['power bi', 'integración', 'análisis avanzado', 'visualizaciones'],
  }),
};

export function generateStructuredData({
  type,
  data,
}: {
  type: 'WebSite' | 'WebPage' | 'Organization' | 'Person' | 'Article';
  data: any;
}) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  switch (type) {
    case 'WebSite':
      return {
        ...baseStructuredData,
        name: APP_CONFIG.name,
        description: APP_CONFIG.description,
        url: APP_CONFIG.url,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${APP_CONFIG.url}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      };

    case 'Organization':
      return {
        ...baseStructuredData,
        name: APP_CONFIG.name,
        description: APP_CONFIG.description,
        url: APP_CONFIG.url,
        logo: `${APP_CONFIG.url}/logo.png`,
        contactPoint: {
          '@type': 'ContactPoint',
          email: APP_CONFIG.supportEmail,
          contactType: 'customer service',
        },
      };

    case 'Person':
      return {
        ...baseStructuredData,
        name: data.name,
        email: data.email,
        jobTitle: data.jobTitle,
        worksFor: {
          '@type': 'Organization',
          name: APP_CONFIG.name,
        },
      };

    default:
      return {
        ...baseStructuredData,
        ...data,
      };
  }
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${APP_CONFIG.url}${item.url}`,
    })),
  };
}

