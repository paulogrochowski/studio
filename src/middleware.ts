
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminLoginPage = pathname === '/admin/login';

  // Redirect to dashboard if a logged-in admin tries to access the admin login page
  if (authToken === 'admin-logged-in' && isAdminLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Redirect to admin login if an unauthenticated user tries to access a protected admin route
  if (authToken !== 'admin-logged-in' && isAdminRoute && !isAdminLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  // Redirect to home if a logged-in customer tries to access the customer login page
  if (authToken === 'customer-logged-in' && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
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
