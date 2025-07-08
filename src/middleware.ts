
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/login';
  const isAdminLoginPage = pathname === '/admin/login';
  
  // Protect admin routes
  if (isAdminRoute && !isAdminLoginPage) {
    if (!authToken || authToken !== 'admin-logged-in') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from login pages
  if (authToken) {
    if (isAdminLoginPage && authToken === 'admin-logged-in') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    if (isLoginPage && authToken === 'customer-logged-in') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - models (3D model files in public)
     * - assets in public folder
     */
    '/((?!api|_next/static|_next/image|models|.*\\..*).*)',
  ],
}
