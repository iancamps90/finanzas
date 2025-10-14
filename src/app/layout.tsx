import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Finance Dash Pro - Professional Finance Dashboard',
  description: 'Advanced finance dashboard with Power BI integration, Excel export, and comprehensive analytics',
  keywords: ['finance', 'dashboard', 'analytics', 'power bi', 'excel', 'next.js'],
  authors: [{ name: 'Finance Dash Pro Team' }],
  creator: 'Finance Dash Pro',
  publisher: 'Finance Dash Pro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Finance Dash Pro - Professional Finance Dashboard',
    description: 'Advanced finance dashboard with Power BI integration, Excel export, and comprehensive analytics',
    url: '/',
    siteName: 'Finance Dash Pro',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Finance Dash Pro - Professional Finance Dashboard',
    description: 'Advanced finance dashboard with Power BI integration, Excel export, and comprehensive analytics',
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
    google: 'your-google-verification-code',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

