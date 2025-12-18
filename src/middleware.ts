import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";
import { detectPreferredLanguage } from "./lib/language-redirect";

const intlMiddleware = createMiddleware(routing);

// 需要登录才能访问的路径
const protectedPaths = ["/profile/edit"];

// 已登录用户不应访问的路径（登录/注册页）
const authPaths = ["/sign-in", "/sign-up"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 如果访问根路径 /，进行智能语言重定向
  if (pathname === "/") {
    const preferredLanguage = detectPreferredLanguage(request);
    const redirectUrl = new URL(`/${preferredLanguage}/home`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // 获取会话 cookie（Lucia 默认使用 auth_session）
  // 注意：middleware 中无法调用数据库验证 session
  // 这里只做简单的 cookie 存在性检查，真正的验证在 getAuth() 中进行
  // 如果 cookie 存在但 session 无效，用户访问页面时会看到未登录状态
  const sessionCookie = request.cookies.get("auth_session");
  const isAuthenticated = !!sessionCookie?.value;

  // 提取不带 locale 前缀的路径
  const pathWithoutLocale = pathname.replace(/^\/(zh|en)/, "") || "/";

  // 检查是否是受保护的路径
  const isProtectedPath = protectedPaths.some((path) =>
    pathWithoutLocale.startsWith(path)
  );

  // 检查是否是认证页面
  const isAuthPath = authPaths.some((path) =>
    pathWithoutLocale.startsWith(path)
  );

  // 未登录用户访问受保护页面 -> 重定向到登录页
  if (isProtectedPath && !isAuthenticated) {
    const locale = pathname.match(/^\/(zh|en)/)?.[1] || "zh";
    const signInUrl = new URL(`/${locale}/sign-in`, request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // 已登录用户访问登录/注册页的重定向逻辑移到页面组件中处理
  // 因为 middleware 无法真正验证 session 有效性

  // 其他路径使用 next-intl 的默认中间件
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(zh|en)/:path*"],
};
