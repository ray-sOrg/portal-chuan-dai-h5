"use server";

import { verify } from "@node-rs/argon2";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  ActionState,
  formErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import {
  accountSchema,
  signInPasswordSchema,
} from "@/features/auth/auth-rules";
import {
  clearAccountSignInFailures,
  getClientIp,
  isSignInRateLimited,
  recordFailedSignIn,
} from "@/features/auth/utils/login-rate-limit";
import { getSafeRedirectPath } from "@/features/auth/utils/safe-redirect";
import { lucia } from "@/lib/lucia";
import { prisma } from "@/lib/prisma";

const signInSchema = z.object({
  account: accountSchema,
  password: signInPasswordSchema,
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
    const requestHeaders = await headers();
    const clientIp = getClientIp(requestHeaders);

    if (await isSignInRateLimited(account, clientIp)) {
      return toActionState(
        "ERROR",
        "登录尝试过于频繁，请稍后再试",
        formData
      );
    }

    // 查找用户（通过账号）
    const user = await prisma.user.findUnique({
      where: { account },
    });

    if (!user) {
      await recordFailedSignIn(account, clientIp);
      return toActionState("ERROR", "账号或密码错误", formData);
    }

    // 验证密码
    const validPassword = await verify(user.passwordHash, password);
    if (!validPassword) {
      await recordFailedSignIn(account, clientIp);
      return toActionState("ERROR", "账号或密码错误", formData);
    }

    await clearAccountSignInFailures(account);

    // 创建会话
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    const _cookie = await cookies();
    _cookie.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

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
  const safeRedirect = getSafeRedirectPath(redirectTo);
  redirect(safeRedirect);
};
