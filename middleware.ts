import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // 添加安全头
  const response = NextResponse.next();
  
  // 安全头
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // CSP 头
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com https://www.gstatic.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; media-src 'self' https://www.youtube.com; connect-src 'self' https://api.openai.com https://www.googleapis.com https://firebase.googleapis.com;"
  );
  
  // 缓存控制
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, max-age=0');
  } else if (request.nextUrl.pathname.startsWith('/_next/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|ico|svg)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=86400');
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};