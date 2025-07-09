
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('auth-token')?.value;

  // Pass pathname to client components for layout decisions
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);
  
  // Check if the current route is an admin route
  const isAdminRoute = pathname.startsWith('/admin');
  
  // If it's not an admin route, just continue with the correct headers
  if (!isAdminRoute) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // --- From here on, we are handling admin routes ---

  const isLoggedInAsAdmin = authToken === 'admin-logged-in';
  const isLoginPage = pathname === '/admin/login';

  // Case 1: A logged-in admin tries to access the login page.
  // -> Redirect them to the main admin dashboard.
  if (isLoggedInAsAdmin && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Case 2: A user who is NOT logged in as admin tries to access a protected admin page.
  // -> Redirect them to the admin login page.
  if (!isLoggedInAsAdmin && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  // Case 3: All other valid scenarios are allowed to proceed.
  // (e.g., logged-in admin on a protected page, or a non-logged-in user on the login page)
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
