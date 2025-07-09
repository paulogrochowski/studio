
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminLoginPage = pathname === '/admin/login';
  const isCustomerLoginPage = pathname === '/login';

  // Rule 1: If a logged-in admin tries to access the admin login page, redirect them to the dashboard.
  if (authToken === 'admin-logged-in' && isAdminLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Rule 2: If an unauthenticated user tries to access any admin page (that isn't the login page),
  // redirect them to the admin login page.
  if (!authToken && isAdminRoute && !isAdminLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  // Rule 3: If a customer (not admin) tries to access any admin page, redirect them to the customer login.
  if (authToken === 'customer-logged-in' && isAdminRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
  }

  // Rule 4: If a logged-in customer tries to access the customer login page, redirect them to the homepage.
  if (authToken === 'customer-logged-in' && isCustomerLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Pass the pathname to the request headers for use in server components if needed.
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
