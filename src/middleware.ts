
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminLoginPage = pathname === '/admin/login';

  // If trying to access an admin route (not the login page) without being logged in as admin,
  // redirect to the admin login page.
  if (isAdminRoute && !isAdminLoginPage && authToken !== 'admin-logged-in') {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If already logged in as admin and trying to access the admin login page,
  // redirect to the admin dashboard.
  if (isAdminLoginPage && authToken === 'admin-logged-in') {
    return NextResponse.redirect(new URL('/admin', request.url));
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
