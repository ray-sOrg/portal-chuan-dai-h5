"use server";

import { cookies } from "next/headers";
import { z } from "zod";

import {
  ActionState,
  formErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { redirect } from "@/i18n/routing";
import { lucia } from "@/lib/lucia";
import { prisma } from "@/lib/prisma";

import { verifyOtp } from "../utils/otp-store";

const signInOtpSchema = z.object({
  phone: z
    .string()
    .regex(/^1[3-9]\d{9}$/, "请输入有效的手机号"),
  code: z
    .string()
    .length(6, "验证码为6位数字"),
});

export const signInOtp = async (
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  try {
    const { phone, code } = signInOtpSchema.parse(
      Object.fromEntries(formData)
    );

    // 验证验证码
    if (!verifyOtp(phone, code)) {
      return toActionState("ERROR", "验证码错误或已过期", formData);
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      return toActionState("ERROR", "该手机号未注册", formData);
    }

    // 创建会话
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    const _cookie = await cookies();
    _cookie.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    // 更新最后登录时间
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
  } catch (error) {
    return formErrorToActionState(error, formData);
  }

  return redirect({ href: "/profile", locale: "zh" });
};
