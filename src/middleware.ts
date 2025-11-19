import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { detectPreferredLanguage } from './lib/language-redirect';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 如果访问根路径 /，进行智能语言重定向
  if (pathname === '/') {
    const preferredLanguage = detectPreferredLanguage(request);
    const redirectUrl = new URL(`/${preferredLanguage}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // 其他路径使用 next-intl 的默认中间件
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(zh|en)/:path*']
};
