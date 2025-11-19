import { NextRequest } from 'next/server';

/**
 * 检测用户首选语言
 * 优先级：
 * 1. Cookie 中保存的用户偏好
 * 2. Accept-Language 头部
 * 3. 默认语言 (en)
 */
export function detectPreferredLanguage(request: NextRequest): 'en' | 'zh' {
  // 1. 检查 Cookie 中的语言偏好
  const cookieLanguage = request.cookies.get('language-preference');
  if (cookieLanguage) {
    try {
      const parsed = JSON.parse(cookieLanguage.value);
      if (parsed.state?.preferredLocale) {
        return parsed.state.preferredLocale === 'zh' ? 'zh' : 'en';
      }
    } catch (e) {
      // Cookie 解析失败，继续其他检测方式
    }
  }

  // 2. 检查 Accept-Language 头部
  const acceptLanguage = request.headers.get('Accept-Language');
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().toLowerCase());
    
    // 检查是否包含中文相关的语言代码
    for (const lang of languages) {
      if (lang.startsWith('zh') || 
          lang.includes('cn') || 
          lang === 'chinese') {
        return 'zh';
      }
    }
  }

  // 3. 默认返回英文
  return 'en';
}
