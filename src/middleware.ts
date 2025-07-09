
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // If trying to access any admin page...
  if (pathname.startsWith('/admin')) {
    // ...except for the admin login page itself...
    if (pathname !== '/admin/login') {
      // ...and the user is not logged in as admin, redirect them to the admin login page.
      if (authToken !== 'admin-logged-in') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    } else {
      // If the user is already logged in as admin and tries to access the admin login page...
      if (authToken === 'admin-logged-in') {
        // ...redirect them to the admin dashboard.
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
  }

  // If the user is logged in as a customer and tries to access the general login page...
  if (pathname === '/login' && authToken === 'customer-logged-in') {
    // ...redirect them to the homepage.
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
