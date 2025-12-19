"use server";

import { hash, verify } from "@node-rs/argon2";
import { z } from "zod";

import {
  ActionState,
  formErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { prisma } from "@/lib/prisma";

import { getAuth } from "../queries/get-auth";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "请输入当前密码"),
    newPassword: z
      .string()
      .min(3, "新密码至少3位")
      .max(16, "新密码最多16位"),
    confirmNewPassword: z
      .string()
      .min(3, "确认密码至少3位")
      .max(16, "确认密码最多16位"),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: "custom",
        message: "两次密码不一致",
        path: ["confirmNewPassword"],
      });
    }
  });

export const changePassword = async (
  _actionState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  try {
    const { user } = await getAuth();

    if (!user) {
      return toActionState("ERROR", "请先登录", formData);
    }

    const { currentPassword, newPassword } = changePasswordSchema.parse(
      Object.fromEntries(formData)
    );

    // 获取用户当前密码哈希
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });

    if (!dbUser) {
      return toActionState("ERROR", "用户不存在", formData);
    }

    // 验证当前密码
    const validPassword = await verify(dbUser.passwordHash, currentPassword);
    if (!validPassword) {
      return toActionState("ERROR", "当前密码错误", formData);
    }

    // 更新密码
    const newPasswordHash = await hash(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    return toActionState("SUCCESS", "密码修改成功");
  } catch (error) {
    return formErrorToActionState(error, formData);
  }
};
