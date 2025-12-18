"use server";

import { hash } from "@node-rs/argon2";
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

const signUpSchema = z
  .object({
    account: z
      .string()
      .min(3, "账号至少3位")
      .max(20, "账号最多20位"),
    password: z
      .string()
      .min(6, "密码至少6位")
      .max(20, "密码最多20位"),
    confirmPassword: z
      .string()
      .min(6, "确认密码至少6位")
      .max(20, "确认密码最多20位"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "两次密码不一致",
        path: ["confirmPassword"],
      });
    }
  });

export const signUp = async (
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  try {
    const { account, password } = signUpSchema.parse(
      Object.fromEntries(formData)
    );

    // 检查账号是否已注册
    const existingUser = await prisma.user.findUnique({
      where: { account },
    });
    if (existingUser) {
      return toActionState("ERROR", "该账号已注册", formData);
    }

    // 创建用户
    const passwordHash = await hash(password);
    const user = await prisma.user.create({
      data: {
        account,
        passwordHash,
        nickname: account, // 默认昵称为账号
      },
    });

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
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return toActionState("ERROR", "该账号已注册", formData);
    }
    return formErrorToActionState(error, formData);
  }

  return redirect({ href: "/home", locale: "zh" });
};
