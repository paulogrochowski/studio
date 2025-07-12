
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Rule 1: Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    const adminCookie = request.cookies.get('admin-session');
    
    // If trying to access any admin page (except login) without a cookie, redirect to login
    if (!adminCookie && pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    // If already logged in and trying to access the login page, redirect to the dashboard
    if (adminCookie && pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // Pass pathname to client components for layout decisions
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - models (3D model files in public)
   * - any other files with an extension (e.g., favicon.ico)
   */
  matcher: '/((?!api|_next/static|_next/image|models|.*\\..*).*)',
}
