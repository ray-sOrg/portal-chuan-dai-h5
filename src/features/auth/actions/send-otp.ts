"use server";

import { z } from "zod";

import {
  ActionState,
  formErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";

import { canSendOtp, generateOtp, storeOtp } from "../utils/otp-store";

const sendOtpSchema = z.object({
  phone: z.string().regex(/^1[3-9]\d{9}$/, "请输入有效的手机号"),
  type: z.enum(["register", "login"]).optional().default("login"),
});

export const sendOtp = async (
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  try {
    const { phone, type } = sendOtpSchema.parse(Object.fromEntries(formData));

    // 注册时检查手机号是否已存在
    if (type === "register") {
      const existingUser = await prisma.user.findUnique({
        where: { phone },
      });
      if (existingUser) {
        return toActionState("ERROR", "该手机号已注册", formData);
      }
    }

    // 登录时检查手机号是否存在
    if (type === "login") {
      const existingUser = await prisma.user.findUnique({
        where: { phone },
      });
      if (!existingUser) {
        return toActionState("ERROR", "该手机号未注册", formData);
      }
    }

    // 检查是否频繁发送
    if (!canSendOtp(phone)) {
      return toActionState("ERROR", "验证码发送过于频繁，请稍后再试", formData);
    }

    // 生成并存储验证码
    const code = generateOtp();
    storeOtp(phone, code);

    // TODO: 集成真实的短信服务（阿里云/腾讯云）
    // 开发环境下打印验证码
    console.log(`[DEV] 验证码发送到 ${phone}: ${code}`);

    return toActionState("SUCCESS", "验证码已发送", formData);
  } catch (error) {
    return formErrorToActionState(error, formData);
  }
};
