
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const adminCookie = request.cookies.get('admin-session');

  // Protege todas as rotas /admin/*
  if (pathname.startsWith('/admin') && pathname !== '/admin' && !adminCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/'; // Redireciona para a home, onde o modal pode ser aberto
    return NextResponse.redirect(url);
  }

  // Se o admin está logado e tenta acessar /admin (página de login implícita), redireciona para o dashboard
  if (pathname === '/admin' && adminCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/dashboard'; // Ou a primeira página do painel
    //return NextResponse.redirect(url); // Desativado para permitir a nova lógica de layout
  }
  
  // Pass headers to client components for layout decisions
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);
  requestHeaders.set('x-url', request.url);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|models|.*\\..*).*)',
}
