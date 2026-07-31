"use server";

import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  ActionState,
  formErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import {
  accountSchema,
  strongPasswordSchema,
} from "@/features/auth/auth-rules";
import { lucia } from "@/lib/lucia";
import { prisma } from "@/lib/prisma";
import { profilePath } from "@/paths";

const signUpSchema = z
  .object({
    account: accountSchema,
    password: strongPasswordSchema,
    confirmPassword: strongPasswordSchema,
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

  redirect(profilePath);
};
