import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { rateLimit } from '@/lib/rate-limit';

// Rate limiting configuration
const limiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500, // Max 500 users per interval
});

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['es', 'en'],

  // Used when no locale matches
  defaultLocale: 'es',

  // Always show the locale in the URL
  localePrefix: 'as-needed'
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes except rate limiting
  if (pathname.startsWith('/api/')) {
    // Rate limiting for export and BI routes
    if (pathname.startsWith('/api/export') || pathname.startsWith('/api/bi')) {
      try {
        await limiter.check(request, 10, 'CACHE_TOKEN');
      } catch {
        return NextResponse.json(
          { error: 'Rate limit exceeded' },
          { status: 429 }
        );
      }
    }
    return NextResponse.next();
  }

  // Apply internationalization middleware first
  const intlResponse = intlMiddleware(request);
  
  // Extract locale from pathname for protected routes
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
  
  // Protected routes (without locale prefix)
  if (pathnameWithoutLocale.startsWith('/dashboard') || 
      pathnameWithoutLocale.startsWith('/transactions') || 
      pathnameWithoutLocale.startsWith('/categories') ||
      pathnameWithoutLocale.startsWith('/reports') || 
      pathnameWithoutLocale.startsWith('/profile') ||
      pathnameWithoutLocale.startsWith('/bi')) {
    
    // Check for session token in cookies
    const sessionToken = request.cookies.get('next-auth.session-token') || 
                        request.cookies.get('__Secure-next-auth.session-token');
    
    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathnameWithoutLocale);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathnameWithoutLocale.startsWith('/login') || pathnameWithoutLocale.startsWith('/register')) {
    // Check for session token in cookies
    const sessionToken = request.cookies.get('next-auth.session-token') || 
                        request.cookies.get('__Secure-next-auth.session-token');
    
    if (sessionToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return intlResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth (NextAuth routes)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};