// 简单的内存存储验证码（生产环境应使用 Redis）
const otpStore = new Map<string, { code: string; expiresAt: number }>();

// 生成 6 位数字验证码
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 存储验证码
export function storeOtp(phone: string, code: string): void {
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5分钟有效期
  otpStore.set(phone, { code, expiresAt });
}

// 检查是否可以发送（60秒内只能发送一次）
export function canSendOtp(phone: string): boolean {
  const existing = otpStore.get(phone);
  if (existing && existing.expiresAt - Date.now() > 4 * 60 * 1000) {
    return false;
  }
  return true;
}

// 验证验证码
export function verifyOtp(phone: string, code: string): boolean {
  const stored = otpStore.get(phone);
  if (!stored) return false;
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(phone);
    return false;
  }
  if (stored.code !== code) return false;

  // 验证成功后删除
  otpStore.delete(phone);
  return true;
}
