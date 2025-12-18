"use server";

import { verify } from "@node-rs/argon2";
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

const signInSchema = z.object({
  account: z
    .string()
    .min(1, "请输入账号"),
  password: z
    .string()
    .min(6, "密码至少6位")
    .max(20, "密码最多20位"),
});

export const signIn = async (
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

    // 更新最后登录时间
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
  } catch (error) {
    return formErrorToActionState(error, formData);
  }

  return redirect({ href: "/home", locale: "zh" });
};
