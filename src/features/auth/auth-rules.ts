import { z } from "zod";

export const accountSchema = z
  .string()
  .min(3, "账号至少3位")
  .max(16, "账号最多16位")
  .regex(/^[a-zA-Z0-9]+$/, "账号只能包含字母和数字");

export const signInPasswordSchema = z
  .string()
  .min(1, "请输入密码")
  .max(128, "密码过长");

export const strongPasswordSchema = z
  .string()
  .min(6, "密码至少6位")
  .max(64, "密码最多64位")
  .regex(/[a-zA-Z]/, "密码需包含字母")
  .regex(/\d/, "密码需包含数字");
