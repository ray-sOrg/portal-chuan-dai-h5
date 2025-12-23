"use server";

import { verify } from "@node-rs/argon2";
import { cookies, headers } from "next/headers";
import { z } from "zod";

import {
  ActionState,
  formErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { redirect } from "@/i18n/routing";
import { lucia } from "@/lib/lucia";
import { prisma } from "@/lib/prisma";

const signInSchema = z.object({
  account: z
    .string()
    .min(3, "账号至少3位")
    .max(16, "账号最多16位")
    .regex(/^[a-zA-Z0-9]+$/, "账号只能包含字母和数字"),
  password: z
    .string()
    .min(3, "密码至少3位")
    .max(16, "密码最多16位"),
});

export const signIn = async (
  redirectTo: string,
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  try {
    const { account, password } = signInSchema.parse(
      Object.fromEntries(formData)
    );

    // 查找用户（通过账号）
    const user = await prisma.user.findUnique({
      where: { account },
    });

    if (!user) {
      return toActionState("ERROR", "账号或密码错误", formData);
    }

    // 验证密码
    const validPassword = await verify(user.passwordHash, password);
    if (!validPassword) {
      return toActionState("ERROR", "账号或密码错误", formData);
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

    // 获取客户端IP
    const headersList = await headers();
    const clientIp =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "unknown";

    // 更新最后登录时间和IP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: clientIp,
      },
    });
  } catch (error) {
    return formErrorToActionState(error, formData);
  }

  // 登录成功后跳转到指定页面，默认为 /profile
  const safeRedirect = redirectTo.startsWith('/') ? redirectTo : '/profile';
  return redirect({ href: safeRedirect, locale: "zh" });
};
